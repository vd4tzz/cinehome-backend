import { Brackets, DataSource } from "typeorm";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Ticket } from "./entity/ticket.entity";
import { Booking, BookingState } from "./entity/booking.entity";
import { Showtime } from "../cinema/entity/showtime.entity";
import { User } from "../user/entity/user.entity";
import { Seat } from "../cinema/entity/seat.entity";
import { PriceService } from "../price/price.service";
import Big from "big.js";
import { ConfigService } from "@nestjs/config";
import { OnEvent } from "@nestjs/event-emitter";
import { PaymentSuccessEvent } from "../payment/payment-success.event";

@Injectable()
export class BookingService {
  private readonly RESERVED_BOOKING_TIME: number;

  constructor(
    private dataSource: DataSource,
    private priceService: PriceService,
    private configService: ConfigService,
  ) {
    this.RESERVED_BOOKING_TIME = configService.get<number>("RESERVED_BOOKING_TIME")!;
  }

  async bookingTickets(userId: number, showtimeId: number, seatIds: number[]) {
    const userRepository = this.dataSource.getRepository(User);
    const showtimeRepository = this.dataSource.getRepository(Showtime);
    const ticketRepository = this.dataSource.getRepository(Ticket);
    const seatRepository = this.dataSource.getRepository(Seat);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException();
    }

    const showtime = await showtimeRepository.findOne({
      where: { id: showtimeId },
      relations: {
        screen: true,
      },
    });

    if (!showtime) {
      throw new NotFoundException();
    }

    if (showtime.endTime <= new Date()) {
      throw new BadRequestException("showtime ended");
    }

    const seats = await seatRepository
      .createQueryBuilder("seat")
      .innerJoinAndSelect("seat.type", "seatType")
      .where("seat.id IN (:...seatIds)", { seatIds: seatIds })
      .andWhere("seat.screen = :screenId", { screenId: showtime.screenId })
      .getMany();

    if (seats.length != seatIds.length) {
      throw new BadRequestException();
    }

    // Kiểm tra ticket có seat_id IN [...seatIds] sao cho booking có state != CANCELED
    // tức là lấy ra các ticket mà booking đang có state CREATED (đang được hold) hoặc PAID (đã thanh toán)
    // nếu số lượng ticket > 0, seatId trong seatIDs không thể được đặt
    const cnt = await ticketRepository
      .createQueryBuilder("ticket")
      .innerJoin("ticket.booking", "booking")
      .where(
        new Brackets((qb) => {
          qb.where("booking.state != :canceledState", { canceledState: BookingState.CANCELED })
            .andWhere(new Brackets((qb) => {
              qb.where("booking.state != :createdState", { createdState: BookingState.CREATED })
                .orWhere("booking.expiredAt > :now", { now: new Date() });
            }),
          );
        }),
      )
      .andWhere("booking.showtime = :showtimeId", { showtimeId: showtimeId })
      .andWhere("ticket.seat IN (:...seatIds)", { seatIds: seatIds })
      .getCount();

    if (cnt > 0) {
      throw new BadRequestException("seat is not available");
    }

    const expiredAt = new Date(new Date().getTime() + this.RESERVED_BOOKING_TIME * 1000);

    const booking = new Booking({
      user: user,
      showtime: showtime,
      state: BookingState.CREATED,
      expiredAt: expiredAt,
    });

    const cinemaId = showtime.screen.cinemaId;
    const startTime = showtime.startTime;
    const formatId = showtime.formatId;
    const basePrice = showtime.basePrice;

    const [dayOfWeekSurcharge, formatSurcharge, timeSlotSurcharge] = await Promise.all([
      this.priceService.getDayOfWeekTypeSurcharge(cinemaId, startTime),
      this.priceService.getFormatSurcharge(cinemaId, formatId),
      this.priceService.getTimeSlotSurcharge(cinemaId, startTime),
    ]);

    let price = new Big(basePrice);
    price = price.plus(dayOfWeekSurcharge).plus(formatSurcharge).plus(timeSlotSurcharge);

    let totalAmount = new Big(0);

    const seatSurchargeMap = new Map<number, Big>();
    const tickets = await Promise.all(
      seats.map(async (seat) => {
        let seatSurcharge: Big;

        if (!seatSurchargeMap.has(seat.id)) {
          seatSurcharge = await this.priceService.getSeatSurcharge(seat.type.id, cinemaId);
          seatSurchargeMap.set(seat.type.id, seatSurcharge);
        } else {
          seatSurcharge = seatSurchargeMap.get(seat.type.id)!;
        }

        const finalTicketPrice = price.plus(seatSurcharge);
        totalAmount = totalAmount.plus(finalTicketPrice);
        return new Ticket({ seat, booking, price: finalTicketPrice.valueOf() });
      }),
    );

    booking.totalAmount = totalAmount.valueOf();

    await this.dataSource.transaction(async (manager) => {
      await manager.save(booking);
      await manager.save(tickets);
    });

    return {
      bookingId: booking.id,
      amount: booking.totalAmount,
    };
  }

  @OnEvent("payment.success")
  async handlePaymentSuccess(event: PaymentSuccessEvent) {
    const bookingRepository = this.dataSource.getRepository(Booking);

    const bookingId = event.bookingId;
    const booking = await bookingRepository.findOneBy({ id: bookingId });
    if (!booking) {
      return;
    }

    booking.state = BookingState.PAID;
    await bookingRepository.save(booking);
  }
}

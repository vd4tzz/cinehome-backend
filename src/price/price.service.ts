import Big from "big.js";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Showtime } from "../cinema/entity/showtime.entity";
import { DayOfWeekTypeCode } from "../cinema/entity/day-of-week-type.entity";
import { DayOfWeekTypeSurcharge } from "../cinema/entity/day-of-week-type-surcharge.entity";
import { FormatSurcharge } from "../cinema/entity/format-surcharge.entity";
import { TimeSlotSurcharge } from "../cinema/entity/time-slot-surcharge.entity";
import { SeatTypeCode } from "../cinema/entity/seat-type.entity";
import { Seat } from "../cinema/entity/seat.entity";
import { SeatTypeSurcharge } from "../cinema/entity/seat-type-surcharge.entity";

@Injectable()
export class PriceService {
  constructor(private dataSource: DataSource) {}

  async getSeatsWithPriceForShowtime(showtimeId: number) {
    const showtimeRepo = this.dataSource.getRepository(Showtime);

    const showtime = await showtimeRepo.findOne({
      where: { id: showtimeId },
      relations: {
        screen: true,
      },
    });

    if (!showtime) {
      throw new NotFoundException();
    }

    const cinemaId = showtime.screen.cinemaId;
    const startTime = showtime.startTime;
    const formatId = showtime.formatId;

    const [dayOfWeekSurcharge, formatSurcharge, timeSlotSurcharge] = await Promise.all([
      this.getDayOfWeekTypeSurcharge(cinemaId, startTime),
      this.getFormatSurcharge(cinemaId, formatId),
      this.getTimeSlotSurcharge(cinemaId, startTime),
    ]);

    let price = new Big(showtime.basePrice);

    price = price.plus(dayOfWeekSurcharge).plus(formatSurcharge).plus(timeSlotSurcharge);

    // lấy toàn bộ seatTypeSurcharge của các seat thuộc về showtime.screen
    const seatTypeSurcharges = await this.dataSource
      .getRepository(SeatTypeSurcharge)
      .createQueryBuilder("surcharge")
      .innerJoinAndSelect("surcharge.seatType", "seatType")
      .innerJoin("seatType.seats", "seat")
      .where("surcharge.cinema = :cinemaId", {
        cinemaId: showtime.screen.cinemaId,
      })
      .andWhere("seat.screen = :screenId", {
        screenId: showtime.screenId,
      })
      .getMany();

    const finalPriceMap = new Map<SeatTypeCode, string>();
    for (const seatTypeSurcharge of seatTypeSurcharges) {
      const code = seatTypeSurcharge.seatType.code;
      const totalPrice = price.plus(seatTypeSurcharge.surcharge).valueOf();
      finalPriceMap.set(code, totalPrice);
    }

    const seatRepository = this.dataSource.getRepository(Seat);
    const seats = await seatRepository.find({
      where: { screen: { id: showtime.screen.id } },
      relations: {
        type: true,
      },
    });

    return seats.map((seat) => ({
      id: seat.id,
      row: seat.row,
      label: seat.label,
      columnOrder: seat.columnOrder,
      seatType: seat.type?.code,
      price: finalPriceMap.get(seat.type?.code),
    }));
  }

  async getDayOfWeekTypeSurcharge(cinemaId: number, startTime: Date) {
    const dayOfWeekTypeCode = this.getDayOfWeekCode(startTime);

    const dayOfWeekTypeSurcharge = await this.dataSource
      .getRepository(DayOfWeekTypeSurcharge)
      .createQueryBuilder("surcharge")
      .innerJoin("surcharge.dayOfWeekType", "dayOfWeekType")
      .where("surcharge.cinema = :cinemaId", { cinemaId: cinemaId })
      .andWhere("dayOfWeekType.code = :code", { code: dayOfWeekTypeCode })
      .getOne();

    if (!dayOfWeekTypeSurcharge) {
      throw new InternalServerErrorException("day of week");
    }

    return new Big(dayOfWeekTypeSurcharge.surcharge);
  }

  async getFormatSurcharge(cinemaId: number, formatId: number) {
    console.log(cinemaId);
    console.log(formatId);
    const formatSurcharge = await this.dataSource
      .getRepository(FormatSurcharge)
      .createQueryBuilder("surcharge")
      .where("surcharge.cinema = :cinemaId", { cinemaId: cinemaId })
      .andWhere("surcharge.format = :formatId", { formatId: formatId })
      .getOne();

    if (!formatSurcharge) {
      throw new InternalServerErrorException("format");
    }

    return new Big(formatSurcharge.surcharge);
  }

  async getTimeSlotSurcharge(cinemaId: number, startTime: Date) {
    const timeSlotSurcharge = await this.dataSource
      .getRepository(TimeSlotSurcharge)
      .createQueryBuilder("surcharge")
      .innerJoin("surcharge.timeSlot", "timeSlot")
      .where("surcharge.cinema = :cinemaId", { cinemaId: cinemaId })
      .andWhere("timeSlot.startTime <= :startTime and timeSlot.endTime >= :startTime", {
        startTime: this.formatDateToTimeString(startTime),
      })
      .getOne();

    if (!timeSlotSurcharge) {
      throw new InternalServerErrorException("time slot");
    }

    return new Big(timeSlotSurcharge.surcharge);
  }

  async getSeatSurcharge(seatTypeId: number, cinemaId: number) {
    const seatSurcharge = await this.dataSource
      .getRepository(SeatTypeSurcharge)
      .createQueryBuilder("surcharge")
      .where("surcharge.cinema = :cinemaId", { cinemaId: cinemaId })
      .andWhere("surcharge.seatType = :seatTypeId", { seatTypeId: seatTypeId })
      .getOne();

    if (!seatSurcharge) {
      throw new InternalServerErrorException();
    }

    return new Big(seatSurcharge.surcharge);
  }

  private getDayOfWeekCode(startTime: Date) {
    const dayOfWeek = startTime.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return DayOfWeekTypeCode.WEEKEND;
    }

    return DayOfWeekTypeCode.WEEKDAY;
  }

  /*
   * formatDateToTimeString(date: Date) phụ thuộc vào local timezone
   * khi deploy cần set timezone UTC +7 để khớp với logic
   */
  private formatDateToTimeString(date: Date): string {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }
}

import { Injectable, BadRequestException, ConflictException, Inject, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { BookingItem } from './entities/booking-item.entity';
import { ShowSeat } from '../shows/entities/show-seat.entity';
import { Concession } from '../concessions/entities/concession.entity';
import { ConcessionItem } from '../concessions/entities/concession-item.entity';
import type{ Cache } from 'cache-manager';
import { CreateConcessionItemDto } from './dto/create-concession-item.dto';

/**
 * BookingsService:
 * - Nhận holdId và idempotencyKey
 * - Kiểm tra ghế còn HOLD không
 * - Tính tiền (MVP: 100k/ghế)
 * - Tạo Booking PENDING + BookingItem (trong transaction)
 *
 * Vì `seats` ở đây là mảng ShowSeat (có quan hệ seat:Seat),
 * bạn sẽ thấy truy cập id ghế bằng `s.seat.id` (đó là "seat.seat" mà bạn thắc mắc).
 */
@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);
  
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(ShowSeat) private readonly showSeatRepo: Repository<ShowSeat>,
    @InjectRepository(Concession) private readonly concessionRepo: Repository<Concession>,
    @InjectRepository(ConcessionItem) private readonly concessionItemRepo: Repository<ConcessionItem>,
    @Inject('CACHE_MANAGER') private cache: Cache,
  ) {}

  async createFromHold(
    userId: string, 
    holdId: string, 
    idempotencyKey: string,
    concessions?: CreateConcessionItemDto[]
  ) {
    // 1) Idempotency: check FIRST before any business logic
    const existed = await this.bookingRepo.findOne({ where: { idempotencyKey }, relations: ['items', 'show'] });
    if (existed) {
      this.logger.log(`Idempotent request for booking: ${idempotencyKey}`);
      return existed;
    }

    // 2) lấy hold từ cache
    const hold = (await this.cache.get<any>(`hold:${holdId}`)) || null;
    if (!hold) {
      this.logger.warn(`Hold expired or not found: ${holdId}`);
      throw new BadRequestException('Hold expired or not found');
    }

    // 3) lấy các ShowSeat thuộc hold với pessimistic_write lock
    const seats = await this.showSeatRepo.find({
      where: hold.seatIds.map((sid: string) => ({ show: { id: hold.showId }, seat: { id: sid }, holdId })),
      relations: ['seat', 'show'],
      lock: { mode: 'pessimistic_write' }, // CRITICAL: prevent concurrent booking
    });

    if (seats.length !== hold.seatIds.length) {
      this.logger.warn(`Invalid seats for hold ${holdId}: expected ${hold.seatIds.length}, found ${seats.length}`);
      throw new BadRequestException('Some seats invalid');
    }
    if (seats.some((s) => s.status !== 'HOLD')) {
      this.logger.warn(`Some seats not on HOLD for holdId: ${holdId}`);
      throw new ConflictException('Some seats are not on HOLD');
    }

    // 4) Tính giá: vé + bắp nước
    const pricePerSeat = 100_000;
    let totalAmount = pricePerSeat * seats.length;

    // Validate và tính giá bắp nước nếu có
    let concessionsToAdd: Array<{ concession: Concession; quantity: number }> = [];
    if (concessions && concessions.length > 0) {
      const concessionIds = concessions.map((c) => c.concessionId);
      const foundConcessions = await this.concessionRepo.find({
        where: { id: In(concessionIds) },
      });

      if (foundConcessions.length !== concessionIds.length) {
        this.logger.warn(`Some concessions not found`);
        throw new NotFoundException('Some concessions not found');
      }

      for (const dto of concessions) {
        const concession = foundConcessions.find((c) => c.id === dto.concessionId);
        if (!concession) {
          throw new NotFoundException(`Concession not found: ${dto.concessionId}`);
        }
        if (concession.status !== 'AVAILABLE') {
          throw new BadRequestException(`Concession out of stock: ${concession.name}`);
        }
        concessionsToAdd.push({ concession, quantity: dto.quantity });
        totalAmount += concession.price * dto.quantity;
      }
    }

    // 5) Transaction: tạo booking + items + concession items
    const booking = await this.dataSource.transaction(async (mgr) => {
      const b = mgr.create(Booking, {
        user: { id: userId } as any, // gán by id (TypeORM sẽ map)
        show: { id: hold.showId } as any,
        totalAmount,
        status: 'PENDING',
        idempotencyKey,
        meta: { seatCount: seats.length, fromHoldId: holdId },
      });
      await mgr.save(b);

      for (const s of seats) {
        const item = mgr.create(BookingItem, { booking: b, seat: s.seat, price: pricePerSeat });
        await mgr.save(item);
      }

      // Tạo concession items
      for (const { concession, quantity } of concessionsToAdd) {
        const concItem = mgr.create(ConcessionItem, {
          booking: b,
          concession,
          quantity,
          price: concession.price,
        });
        await mgr.save(concItem);
      }

      return b;
    });

    this.logger.log(`Booking created: ${booking.id} for user ${userId}, ${seats.length} seats, ${concessionsToAdd.length} concessions, total: ${totalAmount}`);
    return booking;
  }

  // Confirm payment and finalize seats: HOLD -> SOLD, booking -> CONFIRMED
  async confirmPayment(bookingId: string, providerTxId: string) {
    // Use pessimistic_write lock to prevent race conditions
    const booking = await this.bookingRepo.findOne({ 
      where: { id: bookingId }, 
      relations: ['items', 'show'],
      lock: { mode: 'pessimistic_write' }, // CRITICAL: prevent concurrent confirmation
    });
    
    if (!booking) {
      this.logger.warn(`Booking not found: ${bookingId}`);
      throw new BadRequestException('Booking not found');
    }
    
    if (booking.status === 'CONFIRMED') {
      this.logger.log(`Booking already confirmed (idempotent): ${bookingId}`);
      return booking; // idempotent
    }

    if (booking.status !== 'PENDING') {
      this.logger.warn(`Booking status invalid for confirmation: ${booking.status}`);
      throw new BadRequestException(`Cannot confirm booking with status: ${booking.status}`);
    }

    try {
      await this.dataSource.transaction(async (mgr) => {
        const itemSeatIds = booking.items.map((it: any) => it.seat?.id).filter(Boolean);
        if (!itemSeatIds.length) throw new BadRequestException('No booking items');

        const showSeats = await mgr.getRepository(ShowSeat).find({
          where: itemSeatIds.map((sid: any) => ({ show: { id: booking.show.id }, seat: { id: sid } })),
          relations: ['seat', 'show'],
          lock: { mode: 'pessimistic_write' }, // CRITICAL: prevent concurrent seat updates
        });

        for (const ss of showSeats) {
          if (ss.status !== 'HOLD') {
            this.logger.error(`Seat no longer on hold: ${ss.seat.id}, status: ${ss.status}`);
            throw new ConflictException('Seat no longer on hold');
          }
          ss.status = 'SOLD';
          ss.bookingId = booking.id as any;
          ss.holdId = null;
          await mgr.save(ShowSeat, ss);
          
          // Clear cache
          try {
            await this.cache.del(`hold:${booking.show.id}:${(ss as any).seat.id}`);
          } catch (e) {
            this.logger.warn(`Failed to clear cache for seat ${ss.seat.id}`);
          }
        }

        booking.status = 'CONFIRMED';
        booking.meta = { ...(booking.meta || {}), providerTxId };
        await mgr.save(Booking, booking);
      });

      // clear hold package if present
      const fromHoldId = (booking.meta && (booking.meta as any).fromHoldId) || null;
      if (fromHoldId) {
        try {
          await this.cache.del(`hold:${fromHoldId}`);
        } catch (e) {
          this.logger.warn(`Failed to clear hold cache: ${fromHoldId}`);
        }
      }

      this.logger.log(`Booking confirmed: ${bookingId}, providerTxId: ${providerTxId}`);
      return booking;
    } catch (error) {
      this.logger.error(`Error confirming booking ${bookingId}: ${error}`);
      throw error;
    }
  }
}

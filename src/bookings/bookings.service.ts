import { Injectable, BadRequestException, ConflictException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { BookingItem } from './entities/booking-item.entity';
import { ShowSeat } from '../shows/entities/show-seat.entity';
import type{ Cache } from 'cache-manager';

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
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(ShowSeat) private readonly showSeatRepo: Repository<ShowSeat>,
    @Inject('CACHE_MANAGER') private cache: Cache,
  ) {}

  async createFromHold(userId: string, holdId: string, idempotencyKey: string) {
    // 1) Idempotency: nếu tạo rồi -> trả lại
    const existed = await this.bookingRepo.findOne({ where: { idempotencyKey }, relations: ['items', 'show'] });
    if (existed) return existed;

    // 2) lấy hold từ cache
    const hold = (await this.cache.get<any>(`hold:${holdId}`)) || null;
    if (!hold) throw new BadRequestException('Hold expired');

    // 3) lấy các ShowSeat thuộc hold
    const seats = await this.showSeatRepo.find({
      where: hold.seatIds.map((sid: string) => ({ show: { id: hold.showId }, seat: { id: sid }, holdId })),
      relations: ['seat', 'show'],
      lock: { mode: 'pessimistic_read' },
    });

    if (seats.length !== hold.seatIds.length)
      throw new BadRequestException('Some seats invalid');
    if (seats.some((s) => s.status !== 'HOLD'))
      throw new ConflictException('Some seats are not on HOLD');

    // 4) Tính giá (100k/ghế)
    const pricePerSeat = 100_000;
    const totalAmount = pricePerSeat * seats.length;

    // 5) Transaction: tạo booking + items
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
      return b;
    });

    return booking;
  }

  // Confirm payment and finalize seats: HOLD -> SOLD, booking -> CONFIRMED
  async confirmPayment(bookingId: string, providerTxId: string) {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId }, relations: ['items', 'show'] });
    if (!booking) throw new BadRequestException('Booking not found');
    if (booking.status === 'CONFIRMED') return booking; // idempotent

    await this.dataSource.transaction(async (mgr) => {
      const itemSeatIds = booking.items.map((it: any) => it.seat?.id).filter(Boolean);
      if (!itemSeatIds.length) throw new BadRequestException('No booking items');

      const showSeats = await mgr.getRepository(ShowSeat).find({
        where: itemSeatIds.map((sid: any) => ({ show: { id: booking.show.id }, seat: { id: sid } })),
        relations: ['seat', 'show'],
        lock: { mode: 'pessimistic_read' },
      });

      for (const ss of showSeats) {
        if (ss.status !== 'HOLD') throw new ConflictException('Seat no longer on hold');
        ss.status = 'SOLD';
        ss.bookingId = booking.id as any;
        ss.holdId = null;
        await mgr.save(ShowSeat, ss);
        await this.cache.del(`hold:${booking.show.id}:${(ss as any).seat.id}`);
      }

      booking.status = 'CONFIRMED';
      booking.meta = { ...(booking.meta || {}), providerTxId };
      await mgr.save(Booking, booking);
    });

    // clear hold package if present
    const fromHoldId = (booking.meta && (booking.meta as any).fromHoldId) || null;
    if (fromHoldId) await this.cache.del(`hold:${fromHoldId}`);

    return booking;
  }
}

import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingsService } from '../bookings/bookings.service';

/**
 * PaymentsService (mock):
 * - Kiểm tra booking PENDING
 * - Tạo Payment PENDING (idempotent theo idempotencyKey)
 * - Trả về paymentUrl giả để FE redirect thử
 *
 * Sau này bạn thay phần "mock" bằng integration VNPay/MoMo thật.
 */
@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    private readonly bookingsService: BookingsService,
  ) {}

  async initiatePayment(bookingId: string, idempotencyKey: string, provider = 'mock', returnUrl?: string) {
    // 1) Idempotency
    const existed = await this.paymentRepo.findOne({ where: { idempotencyKey } });
    if (existed) {
      if (existed.status !== 'PENDING') throw new ConflictException('Payment already processed');
      const cached = existed.meta?.paymentUrl;
      if (cached) return { paymentId: existed.id, paymentUrl: cached };
    }

    // 2) Validate booking
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) throw new BadRequestException('Booking not found');
    if (booking.status !== 'PENDING') throw new ConflictException('Booking not payable');

    // 3) Create payment PENDING
    let payment = this.paymentRepo.create({
      bookingId,
      amount: booking.totalAmount,
      currency: 'VND',
      provider,
      status: 'PENDING',
      idempotencyKey,
      meta: {},
    });
    payment = await this.paymentRepo.save(payment);

    // 4) Build mock URL (thay bằng URL VNPay thật sau)
    const paymentUrl = (returnUrl || 'https://example.com/return') + `?paymentId=${payment.id}&bookingId=${booking.id}`;
    payment.meta = { ...payment.meta, paymentUrl };
    await this.paymentRepo.save(payment);

    return { paymentId: payment.id, paymentUrl };
  }

  // Mock webhook handling: update Payment status and confirm booking seats
  async confirmMockPayment(paymentId: string, status: 'SUCCESS' | 'FAILED' | 'CANCELLED' = 'SUCCESS') {
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    if (!payment) throw new BadRequestException('Payment not found');

    if (payment.status === 'SUCCESS') return payment; // idempotent

    payment.status = status;
    if (!payment.providerTxId) payment.providerTxId = `mock:${payment.id}`;
    await this.paymentRepo.save(payment);

    if (status === 'SUCCESS') {
      await this.bookingsService.confirmPayment(payment.bookingId, payment.providerTxId);
    }

    return payment;
  }
}

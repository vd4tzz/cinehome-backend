import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

/**
 * Payment: ghi nhận 1 lần thanh toán cho booking (ở đây mock provider).
 */
@Entity()
@Index(['bookingId'], { unique: false })
@Index(['idempotencyKey'], { unique: true })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' }) bookingId: string;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  booking: Booking;

  @Column({ type: 'int' }) amount: number; // VND
  @Column({ type: 'varchar', length: 32 }) currency: string; // 'VND'
  @Column({ type: 'varchar', length: 32 }) provider: string; // 'mock'
  @Column({ type: 'varchar', length: 16, default: 'PENDING' }) status: PaymentStatus;

  @Column({ type: 'varchar', length: 128 }) idempotencyKey: string;
  @Column({ type: 'varchar', length: 128, nullable: true }) providerTxId: string | null;
  @Column({ type: 'jsonb', nullable: true }) meta: any;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}

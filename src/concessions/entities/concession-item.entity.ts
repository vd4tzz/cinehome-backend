import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { Concession } from './concession.entity';

/**
 * ConcessionItem - Line item cho bắp nước trong booking
 * Tương tự BookingItem nhưng cho concessions
 */
@Entity()
export class ConcessionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @ManyToOne(() => Concession, { eager: true })
  @JoinColumn({ name: 'concessionId' })
  concession: Concession;

  @Column({ type: 'int' })
  quantity: number; // Số lượng

  @Column({ type: 'int' })
  price: number; // Giá tại thời điểm đặt (snapshot)
}

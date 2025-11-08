import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Booking } from './booking.entity';
import { Seat } from '../../seats/entities/seat.entity';

@Entity()
export class BookingItem {
    @PrimaryGeneratedColumn('uuid') id: string;

    @ManyToOne(() => Booking, (b) => b.items) booking: Booking;
    @ManyToOne(() => Seat) seat: Seat;

    @Column({ type: 'int' }) price: number; //VND
}
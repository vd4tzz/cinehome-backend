import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Seat } from "../../cinema/entity/seat.entity";
import { Booking } from "./booking.entity";

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Seat, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "seat_id" })
  seat: Seat;

  @ManyToOne(() => Booking)
  booking: Booking;

  @Column({ type: "numeric" })
  price: string;

  constructor(partial: Partial<Ticket>) {
    Object.assign(this, partial);
  }
}

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Seat } from "../../cinema/entity/seat.entity";
import { Booking } from "./booking.entity";

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Seat, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "seat_id" })
  seat: Seat;

  @RelationId((ticket: Ticket) => ticket.seat)
  seatId: number;

  @ManyToOne(() => Booking)
  booking: Booking;

  @Column({ type: "numeric" })
  price: string;

  constructor(partial: Partial<Ticket>) {
    Object.assign(this, partial);
  }
}

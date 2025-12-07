import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entity/user.entity";
import { Showtime } from "../../cinema/entity/showtime.entity";
import { Ticket } from "./ticket.entity";
import { FoodBookingDetail } from "./food-booking-detail.entity";

export enum BookingState {
  CREATED = "CREATED",
  CANCELED = "CANCELED",
  PAID = "PAID",
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Showtime)
  showtime: Showtime;

  @Column({ type: "numeric" })
  totalAmount: string;

  @Column()
  state: BookingState;

  @Column({ type: "timestamp" })
  expiredAt: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.booking)
  tickets: Ticket[];

  @OneToMany(() => FoodBookingDetail, (foodBookingDetail) => foodBookingDetail.booking)
  foodBookingDetails: FoodBookingDetail[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  constructor(partial: Partial<Booking>) {
    Object.assign(this, partial);
  }
}

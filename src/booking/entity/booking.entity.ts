import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entity/user.entity";
import { Showtime } from "../../cinema/entity/showtime.entity";

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

  constructor(partial: Partial<Booking>) {
    Object.assign(this, partial);
  }
}

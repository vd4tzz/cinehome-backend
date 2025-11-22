import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Seat } from "./seat.entity";

export enum SeatTypeCode {
  SINGLE = "SINGLE",
  COUPLE = "COUPLE",
}

@Entity("seat_types")
export class SeatType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: SeatTypeCode;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Seat, (seat) => seat.type)
  seats: Seat[];
}

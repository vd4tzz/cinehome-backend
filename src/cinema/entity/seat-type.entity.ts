import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}

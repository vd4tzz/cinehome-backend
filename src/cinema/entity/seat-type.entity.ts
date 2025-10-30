import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("seat_types")
export class SeatType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  description: string;
}

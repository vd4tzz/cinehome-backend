import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("time_slots")
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "time" })
  startTime: string;

  @Column({ type: "time" })
  endTime: string;
}

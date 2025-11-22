import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum DayOfWeekTypeCode {
  WEEKDAY = "WEEKDAY",
  WEEKEND = "WEEKEND",
}

@Entity("days_of_week_type")
export class DayOfWeekType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: DayOfWeekTypeCode;

  @Column({ nullable: true })
  description: string;
}

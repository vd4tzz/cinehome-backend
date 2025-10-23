import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum DayTypeCode {
  WEEKDAY = "WEEKDAY",
  WEEKEND = "WEEKEND",
}

@Entity("day_types")
export class DayType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: DayTypeCode;

  @Column({ nullable: true })
  description: string;
}

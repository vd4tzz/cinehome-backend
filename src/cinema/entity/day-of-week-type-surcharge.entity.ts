import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Cinema } from "./cinema.entity";
import { DayOfWeekType } from "./day-of-week-type.entity";

@Entity("day_of_week_type_surcharges")
export class DayOfWeekTypeSurcharge {
  @PrimaryColumn({ name: "cinema_id" })
  cinemaId: number;

  @PrimaryColumn({ name: "day_of_week_type_id" })
  dayTypeId: number;

  @ManyToOne(() => Cinema, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cinema_id" })
  cinema: Cinema;

  @ManyToOne(() => DayOfWeekType, { onDelete: "CASCADE" })
  @JoinColumn({ name: "day_of_week_type_id" })
  dayOfWeekType: DayOfWeekType;

  @Column({ type: "numeric" })
  surcharge: string;
}

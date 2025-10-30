import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Cinema } from "./cinema.entity";
import { DayType } from "./day-type.entity";

@Entity("")
export class DayTypeSurcharge {
  @PrimaryColumn({ name: "cinema_id" })
  cinemaId: number;

  @PrimaryColumn({ name: "day_type_id" })
  dayTypeId: number;

  @ManyToOne(() => Cinema, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cinema_id" })
  cinema: Cinema;

  @ManyToOne(() => DayType, { onDelete: "CASCADE" })
  @JoinColumn({ name: "day_type_id" })
  dayType: DayType;

  @Column({ type: "numeric" })
  surcharge: string;
}

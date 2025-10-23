import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Cinema } from "./cinema.entity";
import { Format } from "./format.entity";

@Entity()
export class FormatSurcharge {
  @PrimaryColumn({ name: "cinema_id" })
  cinemaId: number;

  @PrimaryColumn({ name: "format_id" })
  formatId: number;

  @ManyToOne(() => Cinema)
  @JoinColumn({ name: "cinema_id" })
  cinema: Cinema;

  @ManyToOne(() => Format)
  @JoinColumn({ name: "format_id" })
  format: Format;

  @Column({ type: "numeric" })
  surcharge: string;
}

import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Cinema } from "./cinema.entity";
import { SeatType } from "./seat-type.entity";

@Entity()
export class SeatTypeSurcharge {
  @PrimaryColumn({ name: "cinema_id" })
  cinemaId: number;

  @PrimaryColumn({ name: "seat_type_id" })
  seatTypeId: number;

  @ManyToOne(() => Cinema, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cinema_id" })
  cinema: Cinema;

  @ManyToOne(() => SeatType, { onDelete: "CASCADE" })
  @JoinColumn({ name: "seat_type_id" })
  seatType: SeatType;

  @Column({ type: "numeric" })
  surcharge: string;
}

import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Cinema } from "./cinema.entity";
import { Audience } from "./audience.entity";

@Entity()
export class AudienceSurcharge {
  @PrimaryColumn({ name: "cinema_id" })
  cinemaId: number;

  @PrimaryColumn({ name: "audience_id" })
  audienceId: number;

  @ManyToOne(() => Cinema)
  @JoinColumn({ name: "cinema_id" })
  cinema: Cinema;

  @ManyToOne(() => Audience)
  @JoinColumn({ name: "audience_id" })
  audience: Audience;

  @Column({ type: "numeric" })
  surcharge: string;
}

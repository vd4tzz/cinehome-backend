import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Cinema } from "./cinema.entity";
import { TimeSlot } from "./time-slot.entity";

@Entity()
export class TimeSlotSurcharge {
  @PrimaryColumn({ name: "cinema_id" })
  cinemaId: number;

  @PrimaryColumn({ name: "time_slot_id" })
  timeSlotId: number;

  @ManyToOne(() => Cinema)
  @JoinColumn({ name: "cinema_id" })
  cinema: Cinema;

  @ManyToOne(() => TimeSlot)
  @JoinColumn({ name: "time_slot_id" })
  timeSlot: TimeSlot;

  @Column({ type: "numeric" })
  surcharge: string;
}

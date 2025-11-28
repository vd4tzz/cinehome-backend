import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Screen } from "./screen.entity";
import { SeatType } from "./seat-type.entity";

@Entity("seats")
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Screen, (screen) => screen.seats, { onDelete: "CASCADE" })
  @JoinColumn({ name: "screen_id" })
  screen: Screen;

  @Column()
  row: string;

  @Column({ nullable: true })
  label: string;

  @Column({ name: "column_order" })
  columnOrder: number;

  @ManyToOne(() => SeatType, (seatType) => seatType.seats, { onDelete: "CASCADE" })
  @JoinColumn({ name: "seat_type_id" })
  type: SeatType;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;
}

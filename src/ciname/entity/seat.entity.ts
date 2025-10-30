import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

  @Column()
  label: string;

  @Column({ name: "column_order" })
  columnOrder: number;

  @OneToOne(() => SeatType, { onDelete: "CASCADE" })
  @JoinColumn({ name: "seat_type_id" })
  type: SeatType;
}

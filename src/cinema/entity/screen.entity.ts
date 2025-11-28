import {
  Column, DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { Cinema } from "./cinema.entity";
import { Seat } from "./seat.entity";
import { Format } from "./format.entity";

@Entity("screens")
export class Screen {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cinema, (cinema) => cinema.screens, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cinema_id" })
  cinema: Cinema;

  @RelationId((screen: Screen) => screen.cinema)
  cinemaId: number;

  @Column()
  name: string;

  @ManyToMany(() => Format, (format) => format.screens, { onDelete: "CASCADE" })
  @JoinTable({
    name: "screen_format",
    joinColumn: {
      name: "screen_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "format_id",
      referencedColumnName: "id",
    },
  })
  formats: Format[];

  @OneToMany(() => Seat, (seat) => seat.screen, { cascade: ["soft-remove"] })
  seats: Seat[];

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  constructor(partial: Partial<Screen>) {
    Object.assign(this, partial);
  }
}

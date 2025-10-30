import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Screen } from "./screen.entity";

@Entity("formats")
export class Format {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Screen, (screen) => screen.formats)
  screens: Screen[];
}

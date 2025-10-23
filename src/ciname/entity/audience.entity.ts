import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Audience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  type: string;

  @Column({ nullable: true })
  description: string;
}

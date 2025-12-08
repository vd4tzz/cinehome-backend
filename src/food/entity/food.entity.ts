import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("foods")
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "numeric" })
  price: string;
}

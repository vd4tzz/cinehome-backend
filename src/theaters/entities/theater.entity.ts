import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Theater {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, nullable: true })
  city: string | null;
}


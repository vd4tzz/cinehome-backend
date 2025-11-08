import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'int', default: 120 })
  durationMin: number;

  @Column({ length: 50, nullable: true })
  rating: string | null;
}


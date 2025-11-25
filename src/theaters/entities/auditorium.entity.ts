import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Theater } from './theater.entity';

@Entity()
export class Auditorium {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Theater, { eager: true })
  theater: Theater;

  @Column({ type: 'varchar', length: 100 })
  name: string; // e.g., Room 1

  @Column({ type: 'int', default: 100 })
  capacity: number;
}


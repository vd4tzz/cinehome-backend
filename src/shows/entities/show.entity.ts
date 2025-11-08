import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { ShowSeat } from './show-seat.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { Auditorium } from '../../theaters/entities/auditorium.entity';

/**
 * Show: 1 suất chiếu (MVP không liên kết Movie/Auditorium để đơn giản)
 * - startAt/endAt: thời gian chiếu
 */
@Entity()
export class Show {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' }) startAt: Date;
  @Column({ type: 'timestamptz' }) endAt: Date;

  @ManyToOne(() => Movie, { eager: true, nullable: true })
  movie: Movie | null;

  @ManyToOne(() => Auditorium, { eager: true, nullable: true })
  auditorium: Auditorium | null;

  @OneToMany(() => ShowSeat, (ss) => ss.show)
  seats: ShowSeat[];
}

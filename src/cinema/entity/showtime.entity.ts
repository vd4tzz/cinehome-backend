import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Movie } from "../../movie/entity/movie.entity";
import { Screen } from "./screen.entity";

export enum ShowtimeState {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
}

@Entity("showtimes")
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Screen)
  @JoinColumn({ name: "screen_id" })
  screen: Screen;

  @RelationId((showtime: Showtime) => showtime.screen)
  screenId: number;

  @ManyToOne(() => Movie)
  @JoinColumn({ name: "movie_id" })
  movie: Movie;

  @RelationId((showtime: Showtime) => showtime.movie)
  movieId: number;

  @Column({ name: "start_time", type: "timestamptz" })
  startTime: Date;

  @Column({ name: "end_time", type: "timestamptz" })
  endTime: Date;

  @Column()
  state: ShowtimeState;

  @Column({ nullable: true })
  description: string;

  @Column({ name: "base_price", type: "numeric" })
  basePrice: string;

  constructor(partial: Partial<Showtime>) {
    Object.assign(this, partial);
  }
}

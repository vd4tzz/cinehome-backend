import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Genre } from "./genre.entity";

export enum MovieState {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

@Entity("movies")
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "vietnamese_title" })
  vietnameseTitle: string;

  @Column({ name: "original_title", nullable: true })
  originalTitle?: string;

  @Column({ type: "date", name: "release_date" })
  releaseDate: string;

  @Column({ nullable: true })
  overview: string;

  @Column({ name: "poster_url", nullable: true })
  posterUrl: string;

  @Column({ name: "backdrop_url", nullable: true })
  backdropUrl?: string;

  @Column()
  duration: number;

  @Column({ name: "age_rating" })
  ageRating: string;

  @Column()
  director: string;

  @Column({ nullable: true })
  state: MovieState;

  @Column({
    type: "jsonb",
    nullable: true,
    default: [],
  })
  actors: string[];

  @ManyToMany(() => Genre, (genre) => genre.movies)
  @JoinTable({
    name: "movie_genre",
    joinColumn: {
      name: "movie_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "genre_id",
      referencedColumnName: "id",
    },
  })
  genres: Genre[];

  @Column({ default: false })
  isDeleted: boolean;

  constructor(partial: Partial<Movie>) {
    Object.assign(this, partial);
  }
}

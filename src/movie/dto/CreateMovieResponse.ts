import { MovieState } from "../entity/movie.entity";

class GenreDto {
  id: number;
  name: string;
}

export class CreateMovieResponse {
  id: number;

  vietnameseTitle: string;

  originalTitle?: string;

  releaseDate: string;

  overview: string;

  posterUrl: string;

  backdropUrl?: string;

  duration: number;

  ageRating: string;

  director: string;

  state: MovieState;

  actors: string[];

  genres: GenreDto[];
}

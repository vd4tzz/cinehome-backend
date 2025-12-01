import { ApiProperty } from "@nestjs/swagger";

class GenreDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class MovieResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  vietnameseTitle: string;

  @ApiProperty()
  originalTitle: string;

  @ApiProperty()
  releaseDate: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  posterUrl: string;

  @ApiProperty()
  backdropUrl: string;

  @ApiProperty()
  overview: string;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  ageRating: string;

  @ApiProperty()
  director: string;

  @ApiProperty()
  actors: string[];

  @ApiProperty()
  country: string;

  @ApiProperty({ type: GenreDto })
  genres: GenreDto[];
}

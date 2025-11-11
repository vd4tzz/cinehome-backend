import { ApiProperty } from "@nestjs/swagger";

export class CreateShowtimeResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  movieId: number;

  @ApiProperty()
  screenId: number;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  basePrice: string;
}

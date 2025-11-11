import { ApiProperty } from "@nestjs/swagger";

export class CreateShowtimeRequest {
  @ApiProperty()
  movieId: number;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  basePrice: string;
}

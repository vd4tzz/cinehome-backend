import { ApiProperty } from "@nestjs/swagger";
import { ShowtimeState } from "../entity/showtime.entity";

export class ShowtimeResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  movieId: number;

  @ApiProperty()
  movieVietnameseTitle: string;

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

  @ApiProperty()
  state: ShowtimeState;
}

import { ApiProperty } from "@nestjs/swagger";

export class CreateScreenResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  cinemaId: number;
}

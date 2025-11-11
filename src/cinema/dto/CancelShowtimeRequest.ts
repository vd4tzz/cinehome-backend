import { ApiProperty } from "@nestjs/swagger";

export class CancelShowtimeRequest {
  @ApiProperty()
  description: string;
}

import { ApiProperty } from "@nestjs/swagger";

export class CreateScreenRequest {
  @ApiProperty()
  name: string;
}

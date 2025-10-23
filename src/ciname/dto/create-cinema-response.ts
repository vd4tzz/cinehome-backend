import { ApiProperty } from "@nestjs/swagger";

export class CreateCinemaResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  province: string;

  constructor(partial: Partial<CreateCinemaResponse>) {
    Object.assign(this, partial);
  }
}

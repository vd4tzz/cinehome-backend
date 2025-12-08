import { ApiProperty } from "@nestjs/swagger";

export class CreateAdminRequest {
  @ApiProperty()
  cinemaId: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

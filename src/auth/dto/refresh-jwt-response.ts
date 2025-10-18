import { ApiProperty } from "@nestjs/swagger";

export class RefreshJwtResponse {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  accessTokenExpIn: number;

  constructor(partial: Partial<RefreshJwtResponse>) {
    Object.assign(this, partial);
  }
}

import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export class LoginResponse {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  accessTokenExpIn: number;

  @Exclude()
  refreshToken: string;

  @Exclude()
  refreshTokenExpIn: number;

  constructor(partial: Partial<LoginResponse>) {
    Object.assign(this, partial);
  }
}

import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export class VerifyEmailResponse {
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

  constructor(partial: Partial<VerifyEmailResponse>) {
    Object.assign(this, partial);
  }
}

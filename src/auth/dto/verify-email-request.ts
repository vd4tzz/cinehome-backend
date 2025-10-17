import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class VerifyEmailRequest {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsString()
  token: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class SendEmailVerificationRequest {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsString()
  url: string;
}

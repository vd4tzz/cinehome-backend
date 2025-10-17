import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class SendEmailVerificationRequest {
  @ApiProperty()
  @IsInt()
  userId: number;
}

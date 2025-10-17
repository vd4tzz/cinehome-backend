import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Matches, MinLength } from "class-validator";

export class ResetPasswordRequest {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @MinLength(8)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, {
    message: "password must contain at least one character and one number",
  })
  newPassword: string;
}

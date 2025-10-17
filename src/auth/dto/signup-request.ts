import { IsEmail, MinLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignupRequest {
  @ApiProperty()
  @IsEmail({}, { message: "Email không hợp lệ" })
  email: string;

  @ApiProperty()
  @MinLength(8, { message: "Mật khẩu phải có ít nhất 8 ký tự." })
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, {
    message: "Mật khẩu phải chứa ít nhất một chữ cái và một chữ số.",
  })
  password: string;
}

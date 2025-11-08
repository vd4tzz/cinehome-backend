import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng, dùng để đăng ký tài khoản',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'secret123',
    description: 'Mật khẩu tối thiểu 6 ký tự',
    minLength: 6,
    maxLength: 72,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password: string;
}

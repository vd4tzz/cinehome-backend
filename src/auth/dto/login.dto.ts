import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email đã đăng ký',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'secret123',
    description: 'Mật khẩu đăng nhập',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

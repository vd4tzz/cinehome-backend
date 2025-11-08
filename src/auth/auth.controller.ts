// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';


@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
   @ApiBody({ type: SignupDto })
   @ApiResponse({ status: 201, description: 'Tạo tài khoản thành công' })
    signup(@Body() dto: SignupDto) {
    return this.auth.signup(dto.email, dto.password);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('refresh')
  @ApiBody({ type: RefreshDto })
  @ApiResponse({ status: 200, description: 'Làm mới token' })
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }
}

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post, Req,
  Res, UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupRequest } from "./dto/signup-request";
import { SignupResponse } from "./dto/signup-response";
import { ApiOkResponse, ApiResponse } from "@nestjs/swagger";
import { SendEmailResponse } from "./dto/send-email-response";
import { VerifyEmailResponse } from "./dto/verify-email-response";
import { type Response } from "express";
import { LoginRequest } from "./dto/login-request";
import { LoginResponse } from "./dto/login-response";
import { ResetPasswordRequest } from "./dto/reset-password-request";
import { SendEmailVerificationRequest } from "./dto/send-email-verification-request";
import { VerifyEmailRequest } from "./dto/verify-email-request";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    type: SignupResponse,
    status: 201,
    description: "User registered successfully and need to verify email.",
  })
  @Post("signup")
  async signup(@Body() signupRequest: SignupRequest): Promise<SignupResponse> {
    return await this.authService.signup(signupRequest);
  }

  @ApiOkResponse({
    description: "Email verification link has been successfully sent.",
    type: SendEmailResponse,
  })
  @Post("send-email-verification")
  @HttpCode(200)
  async sendEmailVerification(
    @Body() sendEmailVerificationRequest: SendEmailVerificationRequest,
  ): Promise<SendEmailResponse> {
    return await this.authService.sendEmailVerification(sendEmailVerificationRequest);
  }

  @ApiResponse({
    status: 200,
    description:
      "Email verified successfully. A new access token is returned in the response body, and a secure HTTP-only refresh token is set in the cookie.",
    type: VerifyEmailResponse,
    headers: {
      "Set-Cookie": {
        description: "Cookie containing the refresh token.",
        schema: {
          type: "string",
          example: "refreshToken=xyz123; HttpOnly; Secure; Path=/; Max-Age=604800",
        },
      },
    },
  })
  @Post("verify-email")
  async verifyEmail(
    @Body() verifyEmailRequest: VerifyEmailRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<VerifyEmailResponse> {
    const verifyEmailResponse = await this.authService.verifyEmailToken(verifyEmailRequest);

    response.cookie("refreshToken", verifyEmailResponse.refreshToken, {
      httpOnly: true,
      maxAge: verifyEmailResponse.refreshTokenExpIn * 1000,
    });

    return verifyEmailResponse;
  }

  @ApiOkResponse({ type: LoginResponse, description: "" })
  @Post("login")
  @HttpCode(200)
  async login(
    @Body() loginRequest: LoginRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponse> {
    const loginResponse = await this.authService.login(loginRequest);

    response.cookie("refreshToken", loginResponse.refreshToken, {
      httpOnly: true,
      maxAge: loginResponse.refreshTokenExpIn * 1000,
    });

    return loginResponse;
  }

  @Post("forgot-password")
  @HttpCode(200)
  async sendEmailForgotPassword(
    @Body() sendEmailVerificationRequest: SendEmailVerificationRequest,
  ): Promise<SendEmailResponse> {
    return this.authService.sendEmailForgotPassword(sendEmailVerificationRequest);
  }

  @Post("reset-password")
  @HttpCode(200)
  async resetPassword(@Body() resetPasswordRequest: ResetPasswordRequest): Promise<void> {
    return this.authService.resetPassword(resetPasswordRequest);
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleOAuth2() {
    console.log("google oauth2");
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleOAuth2Callback(@Req() req: any) {
    return this.authService.handleOauth2Callback(req.user.email);
  }
}

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupRequest } from "./dto/signup-request";
import { SignupResponse } from "./dto/signup-response";
import { ApiOkResponse, ApiResponse } from "@nestjs/swagger";
import { SendEmailResponse } from "./dto/send-email-response";
import { VerifyEmailResponse } from "./dto/verify-email-response";
import { type Request, type Response } from "express";
import { LoginRequest } from "./dto/login-request";
import { LoginResponse } from "./dto/login-response";
import { ResetPasswordRequest } from "./dto/reset-password-request";
import { SendEmailVerificationRequest } from "./dto/send-email-verification-request";
import { VerifyEmailRequest } from "./dto/verify-email-request";
import { AuthGuard } from "@nestjs/passport";
import { OAuth2Provider } from "../user/entity/user.entity";
import { AuthUser } from "./auth.user";
import { GoogleGuard } from "./google.guard";

@Controller("api/auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  private JWT_REFRESH_COOKIE = "REFRESH_TOKEN";
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

    this.setRefreshJwtCookie(response, verifyEmailResponse.refreshToken, verifyEmailResponse.refreshTokenExpIn);

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

    this.setRefreshJwtCookie(response, loginResponse.refreshToken, loginResponse.refreshTokenExpIn);

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
  @UseGuards(GoogleGuard)
  googleOAuth2() {
    console.log("google oauth2");
  }

  @Get("google/callback")
  @UseGuards(GoogleGuard)
  async googleOAuth2Callback(@Req() req: Request, @Res() response: Response) {
    const email = (req.user as AuthUser).email;
    const loginResponse = await this.authService.handleOauth2Callback(email, OAuth2Provider.GOOGLE);
    this.setRefreshJwtCookie(response, loginResponse.refreshToken, loginResponse.refreshTokenExpIn);

    const state = req.query.state as string;
    let redirectUrl: string;
    try {
      redirectUrl = decodeURIComponent(state);
    } catch {
      redirectUrl = "";
    }

    return redirectUrl !== "" ? response.redirect(redirectUrl) : response;
  }

  @Get("refresh")
  async refreshJwt(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = (request.cookies as Record<string, string | undefined>)[this.JWT_REFRESH_COOKIE] ?? "";
    const res = await this.authService.refreshJwt(refreshToken);

    this.setRefreshJwtCookie(response, res.refreshToken, res.refreshTokenExpIn);

    return res;
  }

  @Get("logout")
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(this.JWT_REFRESH_COOKIE);
  }

  private setRefreshJwtCookie(response: Response, refreshJwt: string, refreshJwtExpIn: number) {
    response.cookie(this.JWT_REFRESH_COOKIE, refreshJwt, {
      httpOnly: true,
      maxAge: refreshJwtExpIn * 1000,
      path: "/",
      // sameSite: "lax",
    });
  }
}

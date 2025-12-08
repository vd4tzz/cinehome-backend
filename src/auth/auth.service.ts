import { SignupRequest } from "./dto/signup-request";
import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import crypto from "crypto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { MailService } from "../common/mail/mail.service";
import { DataSource } from "typeorm";
import { SignupResponse } from "./dto/signup-response";
import { OAuth2Provider, User } from "../user/entity/user.entity";
import { Token, TokenType } from "../user/entity/token.entity";
import { SendEmailResponse } from "./dto/send-email-response";
import { VerifyEmailResponse } from "./dto/verify-email-response";
import { LoginRequest } from "./dto/login-request";
import { LoginResponse } from "./dto/login-response";
import { ResetPasswordRequest } from "./dto/reset-password-request";
import {
  ConflictAuthenticationMethodException,
  EmailExistedException,
  InvalidCredentialException,
  InvalidJsonWebToken,
  InvalidTokenException,
  UserAlreadyVerifiedException,
  UserNotFoundException,
  UserNotVerifiedException,
} from "../common/exceptions";
import { SendEmailVerificationRequest } from "./dto/send-email-verification-request";
import { VerifyEmailRequest } from "./dto/verify-email-request";
import { AuthRoleContext } from "./auth-role-context";
import { Role, RoleName } from "../user/entity/role.entity";
import { JwtPayload } from "./jwt-payload";
import { RefreshJwtResponse } from "./dto/refresh-jwt-response";

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_SECRET: string;
  private readonly JWT_ACCESS_EXP: number;
  private readonly JWT_REFRESH_SECRET: string;
  private readonly JWT_REFRESH_EXP: number;
  private readonly VERIFIED_TOKEN_EXP: number;
  private readonly FRONT_END_URL: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private dataSource: DataSource,
    private authRole: AuthRoleContext,
  ) {
    this.JWT_ACCESS_SECRET = this.configService.get<string>("JWT_ACCESS_SECRET")!;
    this.JWT_REFRESH_SECRET = this.configService.get<string>("JWT_REFRESH_SECRET")!;

    this.JWT_ACCESS_EXP = +this.configService.get<string>("JWT_ACCESS_EXP")!;
    this.JWT_REFRESH_EXP = +this.configService.get<string>("JWT_REFRESH_EXP")!;

    this.VERIFIED_TOKEN_EXP = +this.configService.get<string>("VERIFIED_TOKEN_EXP")!;

    this.FRONT_END_URL = this.configService.get<string>("FRONT_END_URL")!;
  }

  async signup(signupRequest: SignupRequest): Promise<SignupResponse> {
    return await this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);

      const { email, password } = signupRequest;

      const user = await userRepository.findOneBy({ email: email });
      if (user) {
        throw new EmailExistedException();
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        email: email,
        password: hashedPassword,
        isVerified: false,
        oAuth2Provider: OAuth2Provider.NONE,
        roles: [await this.authRole.getUserRole()],
      });
      await userRepository.save(newUser);

      return new SignupResponse({
        userId: newUser.id,
        email: newUser.email,
      });
    });
  }

  // Todo signupAdmin

  async sendEmailVerification(sendEmailVerificationRequest: SendEmailVerificationRequest): Promise<SendEmailResponse> {
    console.log("GUI EMAIL");
    return await this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const tokenRepository = manager.getRepository(Token);

      const { userId, url } = sendEmailVerificationRequest;

      const user = await userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new UserNotFoundException();
      }

      if (user.isVerified) {
        throw new UserAlreadyVerifiedException();
      }

      await tokenRepository.delete({ user: user, type: TokenType.EMAIL_VERIFICATION });

      const { rawToken, hashedToken } = this.generateToken();

      await tokenRepository.save(
        new Token({
          token: hashedToken,
          createdAt: new Date(),
          type: TokenType.EMAIL_VERIFICATION,
          user: user,
        }),
      );

      const verificationLink = `${url}?userId=${user.id}&token=${rawToken}`;
      await this.mailService.sendVerification(user.email, verificationLink, this.VERIFIED_TOKEN_EXP / 60);

      return new SendEmailResponse({
        message: "email send successfully",
        email: user.email,
      });
    });
  }

  async verifyEmailToken(verifyEmailRequest: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    return await this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const tokenRepository = manager.getRepository(Token);

      const { userId, token } = verifyEmailRequest;

      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ["roles"],
      });
      if (!user) {
        throw new UserNotFoundException();
      }
      if (user.isVerified) {
        throw new UserAlreadyVerifiedException();
      }

      const tokenEntity = await tokenRepository.findOneBy({ user: user, type: TokenType.EMAIL_VERIFICATION });
      if (!tokenEntity) {
        throw new InvalidTokenException();
      }

      const isTokenExpired = Date.now() > tokenEntity.createdAt.getTime() + this.VERIFIED_TOKEN_EXP * 1000;
      if (isTokenExpired) {
        throw new InvalidTokenException();
      }

      const hashedToken = tokenEntity.token;
      const isTokenMatched = this.compareToken(token, hashedToken);
      if (!isTokenMatched) {
        throw new InvalidTokenException();
      }

      await tokenRepository.remove(tokenEntity);

      user.isVerified = true;
      await userRepository.save(user);

      const jwtPayload = this.jwtPayload(user.id, user.email, this.extractUserRolesName(user.roles));

      return new VerifyEmailResponse({
        userId: user.id,
        email: user.email,
        accessToken: this.signAccessToken(jwtPayload),
        accessTokenExpIn: this.JWT_ACCESS_EXP,
        refreshToken: this.signRefreshToken(jwtPayload),
        refreshTokenExpIn: this.JWT_REFRESH_EXP,
      });
    });
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const userRepository = this.dataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { email: loginRequest.email },
      relations: {
        roles: true,
        admin: true,
      },
    });
    if (!user) {
      throw new InvalidCredentialException();
    }
    if (!user.isVerified) {
      throw new UserNotVerifiedException();
    }
    if (user.oAuth2Provider != OAuth2Provider.NONE) {
      throw new ConflictAuthenticationMethodException(`account is registered with ${user.oAuth2Provider} method`);
    }

    const isPasswordMatched = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordMatched) {
      throw new InvalidCredentialException();
    }

    const jwtPayload = this.jwtPayload(
      user.id,
      user.email,
      this.extractUserRolesName(user.roles),
      user.admin?.cinemaId,
    );

    return new LoginResponse({
      userId: user.id,
      email: user.email,
      cinemaId: user.admin?.cinemaId,
      accessToken: this.signAccessToken(jwtPayload),
      accessTokenExpIn: this.JWT_ACCESS_EXP,
      refreshToken: this.signRefreshToken(jwtPayload),
      refreshTokenExpIn: this.JWT_REFRESH_EXP,
    });
  }

  async sendEmailForgotPassword(
    sendEmailForgotPasswordRequest: SendEmailVerificationRequest,
  ): Promise<SendEmailResponse> {
    return await this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const tokenRepository = manager.getRepository(Token);

      const { userId } = sendEmailForgotPasswordRequest;

      const user = await userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new UserNotFoundException();
      }
      if (!user.isVerified) {
        throw new UserNotVerifiedException();
      }

      await tokenRepository.delete({ user: user, type: TokenType.FORGOT_PASSWORD });

      const { rawToken, hashedToken } = this.generateToken();

      await tokenRepository.save(
        new Token({
          token: hashedToken,
          createdAt: new Date(),
          type: TokenType.FORGOT_PASSWORD,
          user: user,
        }),
      );

      const forgotPasswordLink = `${this.FRONT_END_URL}/forgot-password?userId=${userId}&token=${rawToken}`;
      await this.mailService.sendForgotPassword(user.email, forgotPasswordLink, 5);

      return new SendEmailResponse({
        message: "Đã gửi email thành công",
        email: user.email,
      });
    });
  }

  async resetPassword(resetPasswordRequest: ResetPasswordRequest): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const { userId, token: rawToken, newPassword } = resetPasswordRequest;

      const userRepository = manager.getRepository(User);
      const tokenRepository = manager.getRepository(Token);

      const user = await userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new UserNotFoundException();
      }

      const tokenEntity = await tokenRepository.findOneBy({ user: user, type: TokenType.FORGOT_PASSWORD });
      if (!tokenEntity) {
        throw new InvalidTokenException();
      }

      const isTokenExpired = Date.now() > tokenEntity.createdAt.getTime() + this.VERIFIED_TOKEN_EXP * 1000;
      if (isTokenExpired) {
        throw new InvalidTokenException();
      }

      const hashedToken = tokenEntity.token;
      const isTokenMatched = this.compareToken(rawToken, hashedToken);
      if (!isTokenMatched) {
        throw new InvalidTokenException();
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await userRepository.save(user);

      await tokenRepository.remove(tokenEntity);
    });
  }

  async handleOauth2Callback(email: string, oAuth2Provider: OAuth2Provider) {
    return await this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);

      let user = await userRepository.findOne({
        where: { email: email },
        relations: ["roles"],
      });
      if (!user) {
        user = new User({
          email: email,
          oAuth2Provider: oAuth2Provider,
          isVerified: true,
          roles: [await this.authRole.getUserRole()],
        });

        await userRepository.save(user);
      } else {
        if (user.oAuth2Provider == OAuth2Provider.NONE) {
          throw new ConflictAuthenticationMethodException("account is registered with traditional method");
        }
        if (user.oAuth2Provider != oAuth2Provider) {
          throw new ConflictAuthenticationMethodException(`account is registered with ${user.oAuth2Provider} method`);
        }
      }

      const jwtPayload = this.jwtPayload(user.id, user.email, this.extractUserRolesName(user.roles));
      return new LoginResponse({
        userId: user.id,
        email: user.email,
        accessToken: this.signAccessToken(jwtPayload),
        accessTokenExpIn: this.JWT_ACCESS_EXP,
        refreshToken: this.signRefreshToken(jwtPayload),
        refreshTokenExpIn: this.JWT_REFRESH_EXP,
      });
    });
  }

  async refreshJwt(refreshToken: string) {
    let jwtPayloadIn: JwtPayload;
    try {
      jwtPayloadIn = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, { secret: this.JWT_REFRESH_SECRET });
    } catch {
      throw new InvalidJsonWebToken();
    }

    const { sub, email, roles } = jwtPayloadIn;

    const jwtPayloadOut = this.jwtPayload(sub!, email!, roles!);

    return new RefreshJwtResponse({
      userId: sub!,
      email: email!,
      accessToken: this.signAccessToken(jwtPayloadOut),
      accessTokenExpIn: this.JWT_ACCESS_EXP,
      refreshToken: this.signRefreshToken(jwtPayloadOut),
      refreshTokenExpIn: this.JWT_REFRESH_EXP,
    });
  }

  private signAccessToken(jwtPayload: any): string {
    return this.jwtService.sign(jwtPayload, {
      expiresIn: this.JWT_ACCESS_EXP,
      secret: this.JWT_ACCESS_SECRET,
    });
  }

  private signRefreshToken(jwtPayload: any): string {
    return this.jwtService.sign(jwtPayload, {
      expiresIn: this.JWT_REFRESH_EXP,
      secret: this.JWT_REFRESH_SECRET,
    });
  }

  private generateToken(): { rawToken: string; hashedToken: string } {
    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    return {
      rawToken: rawToken,
      hashedToken: hashedToken,
    };
  }

  private compareToken(raw: string, hashed: string): boolean {
    const hashedRawToken = crypto.createHash("sha256").update(raw).digest("hex");
    return hashedRawToken === hashed;
  }

  private jwtPayload(id: number, email: string, roles: RoleName[], cinemaId?: number) {
    return {
      sub: id,
      email: email,
      cinemaId: cinemaId,
      roles: roles,
    };
  }

  private extractUserRolesName(roles: Role[]): RoleName[] {
    return roles.map((role) => role.name);
  }
}

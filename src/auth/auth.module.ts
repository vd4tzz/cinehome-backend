import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { MailModule } from "../common/mail/mail.module";
import { JwtStrategy } from "./jwt.strategy";
import { AuthRoleContext } from "./auth-role-context";
import { GoogleStrategy } from "./google.strategy";
import { GoogleGuard } from "./google.guard";

@Module({
  imports: [
    ConfigModule,
    UserModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_ACCESS_SECRET"),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GoogleGuard, AuthRoleContext],
  exports: [JwtModule, AuthRoleContext],
})
export class AuthModule {}

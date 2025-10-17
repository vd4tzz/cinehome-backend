import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "./jwt-payload";
import { AuthUser } from "./auth.user";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>("JWT_ACCESS_SECRET")!,
    });
  }

  validate(payload: JwtPayload) {
    return new AuthUser({ userId: payload.sub, email: payload.email, roles: payload.roles });
  }
}

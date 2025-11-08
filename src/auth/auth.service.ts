import { 
   Inject, 
   Injectable,
   BadRequestException,
   UnauthorizedException 
} from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";
import {randomBytes, createHash} from 'crypto';
import { User } from "src/users/user.entity";
import { isEmail } from "class-validator";


type JwtPayload = { sub:string; email: string; roles: string[] };

@Injectable({})
export class AuthService {
   constructor(
      private users: UsersService,
      private jwt: JwtService,
      private cfg: ConfigService,
   ) {}

   //----- Signup-----

   async signup(email: string, password: string){
      const existed = await this.users.findByEmail(email);
      if(existed) throw new BadRequestException('Email already exists');

      const passwordHash = await bcrypt.hash(password,10);

      const emailVerificationToken = randomBytes(32).toString('hex');
      
      const user = await this.users.create(email, passwordHash, emailVerificationToken);

      // mock gửi mail log ra
      // subject: verify your email
      // link: /auth/verify-email?token=<emailVerificationToken>
      // eslint-disable-next-line no-console

      console.log('[Mock Email] Verify token for' , email, ':', emailVerificationToken);

      //phát hành token lần đầu ( nhiều app vẫn cho login sau signup), verify sớm sẽ hạn chế tính năng

      const { accessToken , refreshToken } = await this.issueTokens(user.id, user.email, user.roles);

      //lưu hash refresh token để rotate/ revoke
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
      await this.users.setRefreshTokenHash( user.id, refreshTokenHash);

      return {
         user: {
            id: user.id,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            roles: user.roles
         },
         accessToken,
         refreshToken,
      };
   }

   //----- Login-----
   async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // Phát hành cặp token mới
    const { accessToken, refreshToken } = await this.issueTokens(user.id, user.email, user.roles);

    // Rotate: cập nhật hash mới → refresh cũ tự động bị vô hiệu (vì hash không khớp)
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.users.setRefreshTokenHash(user.id, refreshTokenHash);

    return {
      user: { id: user.id, email: user.email, isEmailVerified: user.isEmailVerified, roles: user.roles },
      accessToken,
      refreshToken,
    };
  }

  // ── REFRESH ────────────────────────────────────────────────────────
  async refresh(refreshToken: string) {
    // 1) verify chữ ký + hạn
    const payload = await this.safeVerifyRefresh(refreshToken);
    const { sub: userId } = payload;

    // 2) đối chiếu với hash trong DB (rotation / revoke)
    const user = await this.users.findByEmail(payload.email);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token revoked');
    }
    const same = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!same) throw new UnauthorizedException('Refresh token rotated/revoked');

    // 3) phát hành cặp token mới
    const { accessToken, refreshToken: newRefresh } = await this.issueTokens(user.id, user.email, user.roles);

    // 4) lưu hash refresh mới (rotate)
    const newHash = await bcrypt.hash(newRefresh, 10);
    await this.users.setRefreshTokenHash(user.id, newHash);

    return { accessToken, refreshToken: newRefresh };
  }
 // ── Helpers ────────────────────────────────────────────────────────
  private async issueTokens(userId: string, email: string, roles: string[]) {
   const accessPayload = { sub: userId, email, roles };
   const refreshPayload = { sub: userId, email, roles, typ: 'refresh' as const };

   const accessExpSec = Number(this.cfg.get('JWT_ACCESS_EXPIRES_SEC') ?? 900);
   const refreshExpSec = Number(this.cfg.get('JWT_REFRESH_EXPIRES_SEC') ?? 604800);

   const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(accessPayload, {
         secret: this.cfg.get<string>('JWT_ACCESS_SECRET'),
         expiresIn: accessExpSec,          // <= number OK
      }),
      this.jwt.signAsync(refreshPayload, {
         secret: this.cfg.get<string>('JWT_REFRESH_SECRET'),
         expiresIn: refreshExpSec,         // <= number OK
      }),
   ]);

  return { accessToken, refreshToken };
  }

  private async safeVerifyRefresh(token: string): Promise<JwtPayload> {
    try {
      return await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: this.cfg.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

}


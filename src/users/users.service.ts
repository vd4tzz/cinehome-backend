// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async create(email: string, passwordHash: string, emailVerificationToken: string) {
    const user = this.repo.create({ email, passwordHash, emailVerificationToken });
    return this.repo.save(user);
  }

  async setRefreshTokenHash(userId: string, refreshTokenHash: string | null) {
    // null = revoke
    await this.repo.update(userId, { refreshTokenHash });
  }

  async setEmailVerified(userId: string) {
    await this.repo.update(userId, { isEmailVerified: true, emailVerificationToken: null });
  }
}

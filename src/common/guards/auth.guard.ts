import { Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

/**
 * Real JWT AuthGuard using Passport
 * Validates JWT tokens from Authorization header
 * Uses JwtAccessStrategy for token validation
 */
@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {}

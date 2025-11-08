// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Array<'ADMIN' | 'STAFF' | 'USER'>) => SetMetadata(ROLES_KEY, roles);





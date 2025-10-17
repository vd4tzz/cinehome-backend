import { RoleName } from "../user/entity/role.entity";

export class AuthUser {
  userId: number;
  email: string;
  roles: RoleName[];

  constructor(partial: Partial<AuthUser>) {
    Object.assign(this, partial);
  }
}

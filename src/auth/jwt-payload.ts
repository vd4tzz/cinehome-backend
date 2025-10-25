import { RoleName } from "../user/entity/role.entity";

export interface JwtPayload {
  sub?: number;
  email?: string;
  exp?: number;
  iat?: number;
  roles?: RoleName[];
  cinemaId?: number;
}

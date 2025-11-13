import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { RoleName } from "../user/entity/role.entity";
import { Reflector } from "@nestjs/core";
import { CHECK_CINEMA_OWNERSHIP } from "./cinema-ownership.decorator";

@Injectable()
export class CinemaOwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  /* eslint-disable */
  canActivate(context: ExecutionContext): boolean {
    const handler = context.getHandler();
    const shouldCheck = this.reflector.get<boolean>(CHECK_CINEMA_OWNERSHIP, handler);

    // if handler is marked that not should check,
    // then return true to pass CinemaOwnershipGuard Guard
    if (!shouldCheck) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const cinemaId = +request.params?.cinemaId;
    if (!cinemaId) {
      return false;
    }

    const user = request.user;
    if (!user) {
      return false;
    }

    if (user.roles.includes(RoleName.SUPER_ADMIN)) {
      return true;
    }

    return user.cinemaId === cinemaId;
  }
  /* eslint-enable */
}

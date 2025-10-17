import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "./auth/auth.user";
import { RoleName } from "./user/entity/role.entity";
import { Roles } from "./auth/roles.decorator";
import { RolesGuard } from "./auth/roles.guard";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("test")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(RoleName.USER)
  test(@Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return req.user as AuthUser;
  }
}

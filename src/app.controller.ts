import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "./auth/auth.user";
import { RoleName } from "./user/entity/role.entity";
import { Roles } from "./auth/roles.decorator";
import { RolesGuard } from "./auth/roles.guard";
import { PageQuery } from "./common/pagination/page-query.decorator";
import { PageParam } from "./common/pagination/PageParam";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("test")
  test(@PageQuery() pageParam: PageParam) {
    console.log(pageParam);
    console.log(pageParam.order);
  }
}

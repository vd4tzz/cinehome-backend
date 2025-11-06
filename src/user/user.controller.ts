import { Controller, Get, ParseIntPipe, Query } from "@nestjs/common";
import { PageParam } from "../common/pagination/page-param";
import { UserService } from "./user.service";

@Controller("/api/users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("admins")
  async getUserAdminsByCinemaId(@Query("cinemaId", ParseIntPipe) cinemaId: number, @Query() pageParam: PageParam) {
    return await this.userService.getAdminsByCinemaId(cinemaId, pageParam);
  }
}

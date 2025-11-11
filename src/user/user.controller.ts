import { Controller, Get, ParseIntPipe, Query } from "@nestjs/common";
import { PageQuery } from "../common/pagination/page-query";
import { UserService } from "./user.service";

@Controller("/api/users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("admins")
  async getUserAdminsByCinemaId(@Query("cinemaId", ParseIntPipe) cinemaId: number, @Query() pageParam: PageQuery) {
    return await this.userService.getAdminsByCinemaId(cinemaId, pageParam);
  }
}

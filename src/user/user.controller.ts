import { Body, Controller, Get, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { PageQuery } from "../common/pagination/page-query";
import { UserService } from "./user.service";
import { UpdateUserInfoRequest } from "./dto/UpdateUserInfoRequest";
import { CurrentUser } from "../auth/current-user.decorator";
import { AuthUser } from "../auth/auth-user";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateAdminRequest } from "./dto/create-admin-request";

@Controller("/api/users")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get("me")
  async getUserInfo(@CurrentUser() user: AuthUser) {
    return this.userService.getUserInfo(user.userId);
  }

  @Get("admins")
  async getUserAdminsByCinemaId(@Query("cinemaId", ParseIntPipe) cinemaId: number, @Query() pageParam: PageQuery) {
    return await this.userService.getAdminsByCinemaId(cinemaId, pageParam);
  }

  @Post("admins")
  async createAdmin(@Body() req: CreateAdminRequest) {
    await this.userService.createAdmin(req.cinemaId, req.username, req.password);
  }

  @Put(":userId")
  async updateUserInfo(@CurrentUser() user: AuthUser, @Body() request: UpdateUserInfoRequest) {
    return this.userService.updateUserInfo(user.userId, request);
  }
}

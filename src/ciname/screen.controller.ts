import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ScreenService } from "./screen.service";
import { CreateScreenRequest } from "./dto/create-screen-request";
import { CreateScreenResponse } from "./dto/create-screen-response";
import { UpdateScreenRequest } from "./dto/update-screen-request";
import { UpdateScreenResponse } from "./dto/update-screen-response";
import { PageParam } from "../common/pagination/PageParam";
import { RolesGuard } from "../auth/roles.guard";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CinemaOwnershipGuard } from "../auth/cinema-ownership.guard";
import { Roles } from "../auth/roles.decorator";
import { RoleName } from "../user/entity/role.entity";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CinemaOwnership } from "../auth/cinema-ownership.decorator";

@ApiBearerAuth("access-token")
@Controller("api/cinemas/:cinemaId/screens")
@UseGuards(JwtAuthGuard, RolesGuard, CinemaOwnershipGuard)
export class ScreenController {
  constructor(private screenService: ScreenService) {}

  @Post()
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async createScreen(
    @Param("cinemaId") cinemaId: number,
    @Body() createScreenRequest: CreateScreenRequest,
  ): Promise<CreateScreenResponse> {
    return this.screenService.createScreen(cinemaId, createScreenRequest);
  }

  @Put(":screenId")
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async updateScreen(
    @Param("cinemaId") cinemaId: number,
    @Param("screenId") screenId: number,
    @Body() updateScreenRequest: UpdateScreenRequest,
  ): Promise<UpdateScreenResponse> {
    return this.screenService.updateScreen(cinemaId, screenId, updateScreenRequest);
  }

  @Get(":screenId")
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async getScreenById(@Param("screenId") screenId: number) {
    return this.screenService.getScreenById(screenId);
  }

  @Get()
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async getScreens(@Param("cinemaId") cinemaId: number, @Query() pageParam: PageParam) {
    return this.screenService.getScreens(cinemaId, pageParam);
  }

  @Delete(":screenId")
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async deleteScreen(
    @Param("screenId", ParseIntPipe) screenId: number,
    @Param("cinemaId", ParseIntPipe) cinemaId: number,
  ): Promise<void> {
    return this.screenService.deleteScreen(cinemaId, screenId);
  }
}

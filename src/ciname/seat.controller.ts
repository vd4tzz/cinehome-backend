import { Controller, Get, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { CinemaOwnershipGuard } from "../auth/cinema-ownership.guard";
import { RoleName } from "../user/entity/role.entity";
import { Roles } from "../auth/roles.decorator";
import { CinemaOwnership } from "../auth/cinema-ownership.decorator";

@Controller("api/cinemas/:cinemaId/screens/:screenId/seats")
@UseGuards(JwtAuthGuard, RolesGuard, CinemaOwnershipGuard)
export class SeatController {
  @Post()
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async createSeat() {}

  @Put()
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async updateSeat() {}

  @Get()
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async getSeatById() {}

  @Get()
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async getSeats() {}
}

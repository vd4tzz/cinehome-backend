import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { SurchargeService } from "./surcharge.service";
import { PageQuery } from "../common/pagination/page-query";
import { UpdateAudienceSurchargeRequest } from "./dto/update-audience-surcharge-request";
import { UpdateDayTypeSurchargeRequest } from "./dto/update-day-type-surcharge-request";
import { UpdateSeatTypeSurchargeRequest } from "./dto/update-seat-type-surcharge-request";
import { UpdateFormatSurchargeRequest } from "./dto/update-format-surcharge-request";
import { UpdateTimeSlotSurchargeRequest } from "./dto/update-time-slot-surcharge-request";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { CinemaOwnershipGuard } from "../auth/cinema-ownership.guard";
import { Roles } from "../auth/roles.decorator";
import { RoleName } from "../user/entity/role.entity";
import { CinemaOwnership } from "../auth/cinema-ownership.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("api/cinemas/:cinemaId")
@UseGuards(JwtAuthGuard, RolesGuard, CinemaOwnershipGuard)
@ApiBearerAuth("access-token")
export class SurchargeController {
  constructor(private surchargeService: SurchargeService) {}

  @Get("/audience-surcharges")
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async getAudienceSurcharge(@Param("cinemaId") cinemaId: number) {
    return this.surchargeService.getAudienceSurcharge(cinemaId);
  }

  @Patch("/audience-surcharges")
  // @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async updateAudienceSurcharge(
    @Param("cinemaId", ParseIntPipe) cinemaId: number,
    @Body() updateAudienceSurchargeRequest: UpdateAudienceSurchargeRequest,
  ) {
    return await this.surchargeService.updateAudienceSurcharge(cinemaId, updateAudienceSurchargeRequest);
  }

  @Get("day-type-surcharges")
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async getDayTypeSurcharge(@Param("cinemaId") cinemaId: number) {
    return this.surchargeService.getDayTypeSurcharge(cinemaId);
  }

  @Patch("day-type-surcharges")
  // @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async updateDayTypeSurcharge(
    @Param("cinemaId", ParseIntPipe) cinemaId: number,
    @Body() updateDayTypeSurchargeRequest: UpdateDayTypeSurchargeRequest,
  ) {
    return await this.surchargeService.updateDayTypeSurcharge(cinemaId, updateDayTypeSurchargeRequest);
  }

  @Get("format-surcharges")
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async getFormatSurcharge(@Param("cinemaId") cinemaId: number) {
    return await this.surchargeService.getFormatSurcharge(cinemaId);
  }

  @Patch("format-surcharges")
  // @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async updateFormatSurcharge(
    @Param("cinemaId", ParseIntPipe) cinemaId: number,
    @Body() updateFormatSurchargeRequest: UpdateFormatSurchargeRequest,
  ) {
    return await this.surchargeService.updateFormatSurcharge(cinemaId, updateFormatSurchargeRequest);
  }

  @Get("seat-type-surcharges")
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async getSeatTypeSurcharge(@Param("cinemaId") cinemaId: number) {
    return await this.surchargeService.getSeatTypeSurcharge(cinemaId);
  }

  @Patch("seat-type-surcharges")
  // @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async updateSeatTypeSurcharge(
    @Param("cinemaId", ParseIntPipe) cinemaId: number,
    @Body() updateSeatTypeSurchargeRequest: UpdateSeatTypeSurchargeRequest,
  ) {
    return await this.surchargeService.updateSeatTypeSurcharge(cinemaId, updateSeatTypeSurchargeRequest);
  }

  @Get("time-slot-surcharges")
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async getTimeSlotSurcharge(@Param("cinemaId") cinemaId: number) {
    return await this.surchargeService.getTimeSlotSurcharge(cinemaId);
  }

  @Patch("time-slot-surcharges")
  // @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @CinemaOwnership()
  async updateTimeSlotSurcharge(
    @Param("cinemaId", ParseIntPipe) cinemaId: number,
    @Body() updateTimeSlotSurchargeRequest: UpdateTimeSlotSurchargeRequest,
  ) {
    return await this.surchargeService.updateTimeSlotSurcharge(cinemaId, updateTimeSlotSurchargeRequest);
  }
}

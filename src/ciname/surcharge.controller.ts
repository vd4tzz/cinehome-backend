import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query } from "@nestjs/common";
import { SurchargeService } from "./surcharge.service";
import { PageParam } from "../common/pagination/PageParam";
import { UpdateAudienceSurchargeRequest } from "./dto/update-audience-surcharge-request";
import { UpdateDayTypeSurchargeRequest } from "./dto/update-day-type-surcharge-request";
import { UpdateSeatTypeSurchargeRequest } from "./dto/update-seat-type-surcharge-request";
import { UpdateFormatSurchargeRequest } from "./dto/update-format-surcharge-request";
import { UpdateTimeSlotSurchargeRequest } from "./dto/update-time-slot-surcharge-request";

@Controller("api/cinemas/:cinemaId")
export class SurchargeController {
  constructor(private surchargeService: SurchargeService) {}

  @Get("/audience-surcharges")
  async getAudienceSurcharge(@Param("cinemaId") cinemaId: number, @Query() pageParam: PageParam) {
    return this.surchargeService.getAudienceSurcharge(cinemaId, pageParam);
  }

  @Patch("/audiences-surcharges")
  async updateAudienceSurcharge(
    @Param("cinemaId", ParseIntPipe) cinemaId: number,
    @Body() updateAudienceSurchargeRequest: UpdateAudienceSurchargeRequest,
  ) {
    await this.surchargeService.updateAudienceSurcharge(cinemaId, updateAudienceSurchargeRequest);
  }

  @Get("day-type-surcharges")
  async getDayTypeSurcharge(@Param("cinemaId") cinemaId: number, @Query() pageParam: PageParam) {
    return this.surchargeService.getDayTypeSurcharge(cinemaId, pageParam);
  }

  @Patch("day-type-surcharges")
  async updateDayTypeSurcharge(
    @Param("cinemaId", ParseIntPipe) cinemaId: number,
    @Body() updateDayTypeSurchargeRequest: UpdateDayTypeSurchargeRequest,
  ) {
    await this.surchargeService.updateDayTypeSurcharge(cinemaId, updateDayTypeSurchargeRequest);
  }

  @Get("format-surcharges")
  async getFormatSurcharge(@Param("cinemaId") cinemaId: number, @Query() pageParam: PageParam) {
    return await this.surchargeService.getFormatSurcharge(cinemaId, pageParam);
  }

  @Patch("format-surcharges")
  async updateFormatSurcharge(
    @Param("cinemaId", ParseIntPipe) cinemaId: number,
    @Body() updateFormatSurchargeRequest: UpdateFormatSurchargeRequest,
  ) {
    await this.surchargeService.updateFormatSurcharge(cinemaId, updateFormatSurchargeRequest);
  }

  @Get("seat-type-surcharges")
  async getSeatTypeSurcharge(@Param("cinemaId") cinemaId: number, @Query() pageParam: PageParam) {
    return await this.surchargeService.getSeatTypeSurcharge(cinemaId, pageParam);
  }

  @Patch("seat-type-surcharges")
  async updateSeatTypeSurcharge(
    @Param("cinemaId", ParseIntPipe) cinemaId: number,
    @Body() updateSeatTypeSurchargeRequest: UpdateSeatTypeSurchargeRequest,
  ) {
    await this.surchargeService.updateSeatTypeSurcharge(cinemaId, updateSeatTypeSurchargeRequest);
  }

  @Get("time-slot-surcharges")
  async getTimeSlotSurcharge(@Param("cinemaId") cinemaId: number, @Query() pageParam: PageParam) {
    return await this.surchargeService.getTimeSlotSurcharge(cinemaId, pageParam);
  }

  @Patch("time-slot-surcharges")
  async updateTimeSlotSurcharge(
    @Param("cinemaId", ParseIntPipe) cinemaId: number,
    @Body() updateTimeSlotSurchargeRequest: UpdateTimeSlotSurchargeRequest,
  ) {
    await this.surchargeService.updateTimeSlotSurcharge(cinemaId, updateTimeSlotSurchargeRequest);
  }
}

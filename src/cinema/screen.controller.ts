import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { ShowtimeService } from "./showtime.service";
import { CreateShowtimeRequest } from "./dto/create-showtime-request";
import { ShowtimeQuery } from "../movie/dto/query/showtime-query";
import { CreateSeatMapRequest } from "./dto/create-seat-map-request";
import { SeatService } from "./seat.service";
import { CreateSeatMapResponse } from "./dto/create-seat-map-response";
import { GetSeatMapResponse } from "./dto/get-seat-map-response";
import { CreateShowtimeResponse } from "./dto/CreateShowtimeResponse";

@ApiBearerAuth("access-token")
@Controller("api/screens")
// @UseGuards(JwtAuthGuard, RolesGuard)
export class ScreenController {
  constructor(
    private showtimeService: ShowtimeService,
    private seatService: SeatService,
  ) {}

  @ApiResponse({ type: CreateShowtimeResponse, status: 201 })
  @Post(":screenId/showtimes")
  async createShowtime(
    @Param("screenId", ParseIntPipe) screenId: number,
    @Body() createShowtimeRequest: CreateShowtimeRequest,
  ) {
    return this.showtimeService.createShowtime(screenId, createShowtimeRequest);
  }

  @Get(":screenId/showtimes")
  async getShowtimes(@Param("screenId", ParseIntPipe) screenId: number, @Query() showtimeQuery: ShowtimeQuery) {
    return this.showtimeService.getShowtimes(screenId, showtimeQuery);
  }

  @ApiResponse({ type: CreateSeatMapResponse, status: 201 })
  @Post(":screenId/seats")
  async createSeatMapOfScreen(
    @Param("screenId", ParseIntPipe) screenId: number,
    @Body() createSeatMapOfScreenRequest: CreateSeatMapRequest,
  ) {
    return this.seatService.createSeatMap(screenId, createSeatMapOfScreenRequest);
  }

  @ApiResponse({ type: GetSeatMapResponse, status: 200 })
  @Get(":screenId/seats")
  async getSeatMapOfScreen(@Param("screenId", ParseIntPipe) screenId: number) {
    return this.seatService.getSeatMap(screenId);
  }
}

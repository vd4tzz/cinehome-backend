import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ShowtimeService } from "./showtime.service";
import { CreateShowtimeRequest } from "./dto/CreateShowtimeRequest";
import { ShowtimeQuery } from "../movie/dto/query/showtime-query";
import { CreateSeatMapOfScreenRequest } from "./dto/create-seat-map-of-screen-request";
import { SeatService } from "./seat.service";

@ApiBearerAuth("access-token")
@Controller("api/screens")
// @UseGuards(JwtAuthGuard, RolesGuard)
export class ScreenController {
  constructor(
    private showtimeService: ShowtimeService,
    private seatService: SeatService,
  ) {}

  @Post(":screenId/showtimes")
  async createShowtime(
    @Param("screenId", ParseIntPipe) screenId: number,
    @Body() createShowtimeRequest: CreateShowtimeRequest,
  ) {
    console.log(createShowtimeRequest);
    return this.showtimeService.createShowtime(screenId, createShowtimeRequest);
  }

  @Get(":screenId/showtimes")
  async getShowtimes(@Param("screenId", ParseIntPipe) screenId: number, @Query() showtimeQuery: ShowtimeQuery) {
    return this.showtimeService.getShowtimes(screenId, showtimeQuery);
  }

  @Post(":screenId/seats")
  async createSeatMapOfScreen(
    @Param("screenId", ParseIntPipe) screenId: number,
    @Body() createSeatMapOfScreenRequest: CreateSeatMapOfScreenRequest,
  ) {
    return this.seatService.createSeatMapOfScreen(screenId, createSeatMapOfScreenRequest);
  }

  @Get(":screenId/seats")
  async getSeatMapOfScreen(@Param("screenId", ParseIntPipe) screenId: number) {
    return this.seatService.getSeatMap(screenId);
  }
}

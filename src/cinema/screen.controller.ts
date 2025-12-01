import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiResponse } from "@nestjs/swagger";
import { ShowtimeService } from "./showtime.service";
import { CreateShowtimeRequest } from "./dto/create-showtime-request";
import { ShowtimeQuery } from "../movie/dto/query/showtime-query";
import { CreateSeatMapRequest } from "./dto/create-seat-map-request";
import { SeatService } from "./seat.service";
import { CreateSeatMapResponse } from "./dto/create-seat-map-response";
import { GetSeatMapResponse } from "./dto/get-seat-map-response";
import { ShowtimeResponse } from "./dto/showtime-response";
import { ScreenService } from "./screen.service";
import { UpdateScreenRequest } from "./dto/update-screen-request";
import { Roles } from "../auth/roles.decorator";
import { RoleName } from "../user/entity/role.entity";
import { GetScreenResponse } from "./dto/get-screen-response";
import { UpdateScreenResponse } from "./dto/update-screen-response";
import { ApiPaginatedResponse } from "../common/pagination/ApiPaginatedResponse";

@ApiBearerAuth("access-token")
@Controller("api/screens")
// @UseGuards(JwtAuthGuard, RolesGuard)
export class ScreenController {
  constructor(
    private showtimeService: ShowtimeService,
    private seatService: SeatService,
    private screenService: ScreenService,
  ) {}

  @Get(":screenId")
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @ApiOkResponse({ type: GetScreenResponse })
  async getScreenById(@Param("screenId") screenId: number) {
    return this.screenService.getScreenById(screenId);
  }

  @Put(":screenId")
  @ApiOkResponse({ type: UpdateScreenResponse })
  async updateScreen(@Param("screenId", ParseIntPipe) screenId: number, @Body() request: UpdateScreenRequest) {
    return await this.screenService.updateScreen(screenId, request);
  }

  @Delete(":screenId")
  async deleteScreen(@Param("screenId", ParseIntPipe) screenId: number) {
    await this.screenService.deleteScreen(screenId);
  }

  @ApiResponse({ type: ShowtimeResponse, status: 201 })
  @Post(":screenId/showtimes")
  async createShowtime(
    @Param("screenId", ParseIntPipe) screenId: number,
    @Body() createShowtimeRequest: CreateShowtimeRequest,
  ) {
    return this.showtimeService.createShowtime(screenId, createShowtimeRequest);
  }

  @Get(":screenId/showtimes")
  @ApiPaginatedResponse(ShowtimeResponse)
  async getShowtimes(@Param("screenId", ParseIntPipe) screenId: number, @Query() showtimeQuery: ShowtimeQuery) {
    return this.showtimeService.getShowtimesOfScreen(screenId, showtimeQuery);
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

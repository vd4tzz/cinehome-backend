import { ShowtimeService } from "./showtime.service";
import { Body, Controller, Param, ParseIntPipe, Patch } from "@nestjs/common";
import { CancelShowtimeRequest } from "./dto/CancelShowtimeRequest";
import { ApiResponse } from "@nestjs/swagger";
import { CancelShowtimeResponse } from "./dto/CancelShowtimeResponse";
import { PriceService } from "../price/price.service";

@Controller("api/showtimes")
export class ShowtimeController {
  constructor(
    private showtimeService: ShowtimeService,
    private priceService: PriceService,
  ) {}

  @ApiResponse({ type: CancelShowtimeResponse, status: 200 })
  @Patch(":showtimeId")
  async cancelShowtime(
    @Param("showtimeId", ParseIntPipe) showtimeId: number,
    @Body() cancelShowtimeRequest: CancelShowtimeRequest,
  ) {
    return this.showtimeService.cancelShowtime(showtimeId, cancelShowtimeRequest);
  }
}

import { ShowtimeService } from "./showtime.service";
import { Body, Controller, Param, ParseIntPipe, Patch } from "@nestjs/common";
import { CancelShowtimeRequest } from "./dto/CancelShowtimeRequest";
import { ApiResponse } from "@nestjs/swagger";
import { ShowtimeResponse } from "./dto/showtime-response";

@Controller("api/showtimes")
export class ShowtimeController {
  constructor(private showtimeService: ShowtimeService) {}

  @ApiResponse({ type: ShowtimeResponse, status: 200 })
  @Patch(":showtimeId")
  async cancelShowtime(
    @Param("showtimeId", ParseIntPipe) showtimeId: number,
    @Body() cancelShowtimeRequest: CancelShowtimeRequest,
  ) {
    return this.showtimeService.cancelShowtime(showtimeId, cancelShowtimeRequest);
  }
}

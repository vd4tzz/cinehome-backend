import { Module } from "@nestjs/common";
import { CinemaController } from "./cinema.controller";
import { CinemaService } from "./cinema.service";
import { ScreenController } from "./screen.controller";
import { ScreenService } from "./screen.service";
import { CinemaHandlerModule } from "./event/handler/cinema-handler.module";
import { SurchargeController } from "./surcharge.controller";
import { SurchargeService } from "./surcharge.service";
import { ShowtimeController } from "./showtime.controller";
import { ShowtimeService } from "./showtime.service";
import { SeatService } from "./seat.service";

@Module({
  imports: [CinemaHandlerModule],
  controllers: [CinemaController, ScreenController, SurchargeController, ShowtimeController],
  providers: [CinemaService, ScreenService, SurchargeService, ShowtimeService, SeatService],
})
export class CinemaModule {}

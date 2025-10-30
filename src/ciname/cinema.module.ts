import { Module } from "@nestjs/common";
import { CinemaController } from "./cinema.controller";
import { CinemaService } from "./cinema.service";
import { ScreenController } from "./screen.controller";
import { ScreenService } from "./screen.service";
import { CinemaHandlerModule } from "./event/handler/cinema.handler.module";
import { SurchargeController } from "./surcharge.controller";
import { SurchargeService } from "./surcharge.service";

@Module({
  imports: [CinemaHandlerModule],
  controllers: [CinemaController, ScreenController, SurchargeController],
  providers: [CinemaService, ScreenService, SurchargeService],
})
export class CinemaModule {}

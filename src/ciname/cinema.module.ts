import { Module } from "@nestjs/common";
import { CinemaController } from "./cinema.controller";
import { CinemaService } from "./cinema.service";
import { ScreenController } from "./screen.controller";
import { ScreenService } from "./screen.service";

@Module({
  imports: [],
  controllers: [CinemaController, ScreenController],
  providers: [CinemaService, ScreenService],
})
export class CinemaModule {}

import { Module } from "@nestjs/common";
import { CinemaCreatedHandler } from "./cinema-created.handler";

@Module({
  providers: [CinemaCreatedHandler],
})
export class CinemaHandlerModule {}

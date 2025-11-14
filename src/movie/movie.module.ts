import { Module } from "@nestjs/common";
import { MovieController } from "./movie.controller";
import { StorageModule } from "../common/storage/storage.module";
import { MovieService } from "./movie.service";
import { ShowtimeService } from "../cinema/showtime.service";

@Module({
  imports: [StorageModule],
  controllers: [MovieController],
  providers: [MovieService, ShowtimeService],
})
export class MovieModule {}

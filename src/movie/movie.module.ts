import { Module } from "@nestjs/common";
import { MovieController } from "./movie.controller";
import { StorageModule } from "../common/storage/storage.module";
import { MovieService } from "./movie.service";
import { ShowtimeService } from "../cinema/showtime.service";
import { GenreService } from "./genre.service";
import { GenreController } from "./genre.controller";

@Module({
  imports: [StorageModule],
  controllers: [MovieController, GenreController],
  providers: [MovieService, ShowtimeService, GenreService],
})
export class MovieModule {}

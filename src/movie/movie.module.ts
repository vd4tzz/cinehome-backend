import { Module } from "@nestjs/common";
import { MovieController } from "./movie.controller";
import { StorageModule } from "../common/storage/storage.module";
import { MovieService } from "./movie.service";

@Module({
  imports: [StorageModule],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}

import {
  Body,
  Controller, Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { CreateMovieRequest } from "./dto/CreateMovieRequest";
import { MovieService } from "./movie.service";
import { UpdateMovieImagesRequest } from "./dto/UpdateMovieImagesRequest";
import { MovieQuery } from "./dto/query/MovieQuery";

@Controller("api/movies")
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Post()
  @UseInterceptors(FileInterceptor("img"))
  async createMovie(@Body() createMovieRequest: CreateMovieRequest) {
    return this.movieService.createMovie(createMovieRequest);
  }

  @Patch(":movieId/images")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "poster", maxCount: 1 },
      { name: "backdrop", maxCount: 1 },
    ]),
  )
  updateMovieImages(
    @Param("movieId", ParseIntPipe) movieId: number,
    @UploadedFiles() updateMovieImagesRequest: UpdateMovieImagesRequest,
  ) {
    return this.movieService.updateMovieImages(movieId, updateMovieImagesRequest);
  }

  @Patch(":movieId/status")
  async updateMovieStatus(@Param("movieId", ParseIntPipe) movieId: number) {
    return await this.movieService.updateMovieStatusToPublished(movieId);
  }

  @Get()
  async getMovies(@Query() movieQuery: MovieQuery) {
    return this.movieService.getMovies(movieQuery);
  }

  @Delete(":movieId")
  async deleteMovieById(@Param("movieId", ParseIntPipe) movieId: number) {
    return this.movieService.deleteMovieById(movieId);
  }
}

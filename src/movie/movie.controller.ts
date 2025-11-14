import {
  Body,
  Controller,
  Delete,
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
import { PageQuery } from "../common/pagination/page-query";
import { ShowtimeService } from "../cinema/showtime.service";

@Controller("api/movies")
export class MovieController {
  constructor(
    private movieService: MovieService,
    private showtimeService: ShowtimeService,
  ) {}

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

  @Get()
  async getMovies(@Query() movieQuery: MovieQuery) {
    return this.movieService.getMovies(movieQuery);
  }

  @Get("upcoming")
  async getUpComingMovies(@Query() pageQuery: PageQuery) {
    return this.movieService.getUpComingMovies(pageQuery);
  }

  @Get("showing")
  async getShowingMovies(@Query() pageQuery: PageQuery) {
    return this.movieService.getShowingMovies(pageQuery);
  }

  @Delete(":movieId")
  async deleteMovieById(@Param("movieId", ParseIntPipe) movieId: number) {
    return this.movieService.deleteMovieById(movieId);
  }

  @Get(":movieId")
  async getMovie(@Param("movieId", ParseIntPipe) movieId: number) {
    return this.movieService.getMovie(movieId);
  }

  @Patch(":movieId/status")
  async updateMovieStatus(@Param("movieId", ParseIntPipe) movieId: number) {
    return await this.movieService.updateMovieStatusToPublished(movieId);
  }

  @Get(":movieId/showtimes")
  async getMovieShowtimes(@Param("movieId", ParseIntPipe) movieId: number, @Query() pageQuery: PageQuery) {
    return this.showtimeService.getAvailableShowtimeOfMovie(movieId, pageQuery);
  }
}

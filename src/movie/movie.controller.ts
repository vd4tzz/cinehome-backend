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
import { CreateMovieRequest } from "./dto/create-movie-request";
import { MovieService } from "./movie.service";
import { UpdateMovieImagesRequest } from "./dto/update-movie-images-request";
import { MovieQuery } from "./dto/query/movie-query";
import { PageQuery } from "../common/pagination/page-query";
import { ShowtimeService } from "../cinema/showtime.service";
import { ApiBody, ApiConsumes, ApiOkResponse } from "@nestjs/swagger";
import { MovieResponse } from "./dto/movie-response";
import { ApiPaginatedResponse } from "../common/pagination/ApiPaginatedResponse";
import { UpdateMovieInfoRequest } from "./dto/update-movie-info-request";

@Controller("api/movies")
export class MovieController {
  constructor(
    private movieService: MovieService,
    private showtimeService: ShowtimeService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("img"))
  @ApiOkResponse({ type: MovieResponse })
  async createMovie(@Body() createMovieRequest: CreateMovieRequest) {
    return this.movieService.createMovie(createMovieRequest);
  }

  @Patch(":movieId")
  async updateMovieInfo(@Param("movieId", ParseIntPipe) movieId: number, @Body() request: UpdateMovieInfoRequest) {
    return this.movieService.updateMovieInfo(movieId, request);
  }

  @Patch(":movieId/images")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "poster", maxCount: 1 },
      { name: "backdrop", maxCount: 1 },
    ]),
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    type: UpdateMovieImagesRequest, // Sử dụng DTO đã khai báo
    description: "",
  })
  @ApiOkResponse({ type: MovieResponse })
  updateMovieImages(
    @Param("movieId", ParseIntPipe) movieId: number,
    @UploadedFiles() updateMovieImagesRequest: UpdateMovieImagesRequest,
  ) {
    return this.movieService.updateMovieImages(movieId, updateMovieImagesRequest);
  }

  @Get()
  @ApiPaginatedResponse(MovieResponse)
  async getMovies(@Query() movieQuery: MovieQuery) {
    return this.movieService.getMovies(movieQuery);
  }

  @ApiPaginatedResponse(MovieResponse)
  @Get("upcoming")
  async getUpComingMovies(@Query() pageQuery: PageQuery) {
    return this.movieService.getUpComingMovies(pageQuery);
  }

  @Get("showing")
  @ApiPaginatedResponse(MovieResponse)
  async getShowingMovies(@Query() pageQuery: PageQuery) {
    return this.movieService.getShowingMovies(pageQuery);
  }

  @Delete(":movieId")
  async deleteMovieById(@Param("movieId", ParseIntPipe) movieId: number) {
    return this.movieService.deleteMovieById(movieId);
  }

  @Get(":movieId")
  @ApiOkResponse({ type: MovieResponse })
  async getMovie(@Param("movieId", ParseIntPipe) movieId: number) {
    return this.movieService.getMovie(movieId);
  }

  @Patch(":movieId/status")
  async updateMovieStatus(@Param("movieId", ParseIntPipe) movieId: number) {
    return await this.movieService.updateMovieStatusToPublished(movieId);
  }

  @Get(":movieId/showtimes")
  async getMovieShowtimes(@Param("movieId", ParseIntPipe) movieId: number) {
    return this.showtimeService.getAvailableShowtimeOfMovie(movieId);
  }
}

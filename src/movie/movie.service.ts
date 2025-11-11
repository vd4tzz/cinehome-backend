import { DataSource, ILike, In, MoreThan } from "typeorm";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateMovieRequest } from "./dto/CreateMovieRequest";
import { Movie, MovieState } from "./entity/movie.entity";
import { Genre } from "./entity/genre.entity";
import { CreateMovieResponse } from "./dto/CreateMovieResponse";
import { UpdateMovieImagesRequest } from "./dto/UpdateMovieImagesRequest";
import { StorageService } from "../common/storage/storage.service";
import { MovieQuery } from "./dto/query/MovieQuery";
import { Page } from "../common/pagination/page";
import { UpdateMovieStatusResponse } from "./dto/UpdateMovieStatusResponse";
import { PageQuery } from "../common/pagination/page-query";

@Injectable()
export class MovieService {
  constructor(
    private dataSource: DataSource,
    private storageService: StorageService,
  ) {}

  async createMovie(createMovieRequest: CreateMovieRequest) {
    return this.dataSource.transaction(async (manager) => {
      const movieRepository = manager.getRepository(Movie);
      const genreRepository = manager.getRepository(Genre);

      const { vietnameseTitle, originalTitle, releaseDate, overview, duration, ageRating, director, actors, genreIds } =
        createMovieRequest;

      const now = new Date();
      const movieReleaseDate = new Date(releaseDate);
      if (now >= movieReleaseDate) {
        throw new BadRequestException();
      }

      const genres = await genreRepository.findBy({
        id: In(genreIds),
      });

      const newMovie = new Movie({
        vietnameseTitle: vietnameseTitle,
        originalTitle: originalTitle,
        releaseDate: releaseDate,
        overview: overview,
        duration: duration,
        ageRating: ageRating,
        director: director,
        actors: actors,
        genres: genres,
      });

      newMovie.state = MovieState.DRAFT;

      await movieRepository.save(newMovie);

      return {
        id: newMovie.id,
        vietnameseTitle: newMovie.vietnameseTitle,
        originalTitle: newMovie.originalTitle,
        releaseDate: newMovie.releaseDate,
        state: newMovie.state,
        posterUrl: newMovie.posterUrl,
        backdropUrl: newMovie.backdropUrl,
        overview: newMovie.overview,
        duration: newMovie.duration,
        ageRating: newMovie.ageRating,
        director: newMovie.director,
        actors: newMovie.actors,
        genres: newMovie.genres.map((genre) => ({
          id: genre.id,
          name: genre.name,
        })),
      } as CreateMovieResponse;
    });
  }

  async updateMovieImages(movieId: number, updateMovieImagesRequest: UpdateMovieImagesRequest) {
    const poster = updateMovieImagesRequest.poster?.[0];
    const backdrop = updateMovieImagesRequest.backdrop?.[0];

    const movieRepository = this.dataSource.getRepository(Movie);

    const movie = await movieRepository.findOne({
      where: { id: movieId, isDeleted: false },
      relations: {
        genres: true,
      },
    });
    if (!movie) {
      throw new NotFoundException();
    }

    try {
      if (poster) {
        if (movie.posterUrl) {
          await this.storageService.deleteFile(movie.posterUrl);
        }

        movie.posterUrl = await this.storageService.uploadFile(poster);
      }

      if (backdrop) {
        if (movie.backdropUrl) {
          await this.storageService.deleteFile(movie.backdropUrl);
        }

        movie.backdropUrl = await this.storageService.uploadFile(backdrop);
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException("upload files error");
    }

    await movieRepository.save(movie);

    return {
      id: movie.id,
      vietnameseTitle: movie.vietnameseTitle,
      originalTitle: movie.originalTitle,
      releaseDate: movie.releaseDate,
      state: movie.state,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      overview: movie.overview,
      duration: movie.duration,
      ageRating: movie.ageRating,
      director: movie.director,
      actors: movie.actors,
      genres: movie.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
      })),
    } as UpdateMovieImagesRequest;
  }

  async updateMovieStatusToPublished(movieId: number) {
    const movieRepository = this.dataSource.getRepository(Movie);

    const movie = await movieRepository.findOne({
      where: { id: movieId, isDeleted: false },
      relations: {
        genres: true,
      },
    });
    if (!movie) {
      throw new NotFoundException();
    }

    movie.state = MovieState.PUBLISHED;

    await movieRepository.save(movie);

    return {
      id: movie.id,
      vietnameseTitle: movie.vietnameseTitle,
      originalTitle: movie.originalTitle,
      releaseDate: movie.releaseDate,
      state: movie.state,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      overview: movie.overview,
      duration: movie.duration,
      ageRating: movie.ageRating,
      director: movie.director,
      actors: movie.actors,
      genres: movie.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
      })),
    } as UpdateMovieStatusResponse;
  }

  async getMovies(movieQuery: MovieQuery) {
    const movieRepository = this.dataSource.getRepository(Movie);

    const { page, size, title } = movieQuery;

    const [movies, total] = await movieRepository.findAndCount({
      skip: page * size,
      take: size,
      order: {
        id: "DESC",
      },
      where: [
        { isDeleted: false, vietnameseTitle: ILike(`%${title}%`) },
        { isDeleted: false, originalTitle: ILike(`%${title}%`) },
      ],
      relations: {
        genres: true,
      },
    });

    const dtos = movies.map((movie) => ({
      id: movie.id,
      vietnameseTitle: movie.vietnameseTitle,
      originalTitle: movie.originalTitle,
      releaseDate: movie.releaseDate,
      state: movie.state,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      overview: movie.overview,
      duration: movie.duration,
      ageRating: movie.ageRating,
      director: movie.director,
      actors: movie.actors,
      genres: movie.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
      })),
    }));

    return new Page(dtos, movieQuery, total);
  }

  async deleteMovieById(movieId: number) {
    const movieRepository = this.dataSource.getRepository(Movie);

    const movie = await movieRepository.findOneBy({
      id: movieId,
      isDeleted: false,
    });

    if (!movie) {
      throw new NotFoundException();
    }

    movie.isDeleted = true;

    await movieRepository.save(movie);
  }

  async getUpComingMovies(pageQuery: PageQuery) {
    const movieRepository = this.dataSource.getRepository(Movie);

    const { page, size } = pageQuery;

    const today = new Date().toISOString().split("T")[0];

    // Lấy tất cả phim có releaseDate trong tương lai
    const [movies, total] = await movieRepository.findAndCount({
      where: {
        releaseDate: MoreThan(today),
        isDeleted: false,
      },
      relations: {
        genres: true,
      },
      skip: page * size,
      take: size,
    });

    const dtos = movies.map((movie) => ({
      id: movie.id,
      vietnameseTitle: movie.vietnameseTitle,
      originalTitle: movie.originalTitle,
      releaseDate: movie.releaseDate,
      state: movie.state,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      overview: movie.overview,
      duration: movie.duration,
      ageRating: movie.ageRating,
      director: movie.director,
      actors: movie.actors,
      genres: movie.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
      })),
    }));

    return new Page(dtos, pageQuery, total);
  }

  async getShowingMovies(pageQuery: PageQuery) {
    const { page, size } = pageQuery;

    const movieRepository = this.dataSource.getRepository(Movie);

    const now = new Date();
    const today = new Date().toISOString().split("T")[0];

    // get total
    const totalQuery = movieRepository
      .createQueryBuilder("movie")
      .where("movie.releaseDate <= :today", { today })
      .andWhere("movie.isDeleted = :isDeleted", { isDeleted: false })
      .innerJoin("movie.showtimes", "showtime", "showtime.movie_id = movie.id")
      .andWhere("showtime.startTime >= :now", { now })
      .select("movie.id")
      .groupBy("movie.id");

    const totalCount = await totalQuery.getCount();

    if (totalCount === 0) {
      return new Page([], pageQuery, 0);
    }

    /*
     * Điều kiện để một bộ phim được xem là "đang chiếu" (considered showing):
     * 1. Ngày phát hành phải nhỏ hơn hoặc bằng ngày hiện tại (releaseDate <= current).
     * 2. Phải có ít nhất một lịch chiếu có ngày bắt đầu (startDate) lớn hơn hoặc bằng ngày hiện tại (startDate >= current).
     */

    const idQuery = movieRepository
      .createQueryBuilder("movie")
      .where("movie.releaseDate <= :today", { today })
      .andWhere("movie.isDeleted = :isDeleted", { isDeleted: false })
      .innerJoin("movie.showtimes", "showtime", "showtime.movie_id = movie.id")
      .andWhere("showtime.startTime >= :now", { now })
      .select("movie.id", "id")
      .groupBy("movie.id")
      .orderBy("movie.releaseDate", "DESC")
      .skip(page * size)
      .take(size);

    const rawMovieIds: { id: number }[] = await idQuery.getRawMany();
    const showingIds = rawMovieIds.map((e) => e.id);

    if (showingIds.length === 0) {
      return new Page([], pageQuery, 0);
    }

    const showingMovies = await movieRepository.find({
      where: {
        id: In(showingIds),
      },
      relations: {
        genres: true,
      },
      order: {
        releaseDate: "DESC",
      },
    });

    const dtos = showingMovies.map((movie) => ({
      id: movie.id,
      vietnameseTitle: movie.vietnameseTitle,
      originalTitle: movie.originalTitle,
      releaseDate: movie.releaseDate,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      overview: movie.overview,
      duration: movie.duration,
      ageRating: movie.ageRating,
      director: movie.director,
      actors: movie.actors,
      genres: movie.genres ? movie.genres.map((g) => ({ id: g.id, name: g.name })) : [],
    }));

    return new Page(dtos, pageQuery, totalCount);
  }
}

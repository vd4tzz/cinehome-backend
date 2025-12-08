import { Brackets, DataSource, ILike, In, MoreThan } from "typeorm";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateMovieRequest } from "./dto/create-movie-request";
import { Movie, MovieState } from "./entity/movie.entity";
import { Genre } from "./entity/genre.entity";
import { MovieResponse } from "./dto/movie-response";
import { UpdateMovieImagesRequest } from "./dto/update-movie-images-request";
import { StorageService } from "../common/storage/storage.service";
import { MovieQuery } from "./dto/query/movie-query";
import { Page } from "../common/pagination/page";
import { UpdateMovieStatusResponse } from "./dto/UpdateMovieStatusResponse";
import { PageQuery } from "../common/pagination/page-query";
import { UpdateMovieInfoRequest } from "./dto/update-movie-info-request";

@Injectable()
export class MovieService {
  constructor(
    private dataSource: DataSource,
    private storageService: StorageService,
  ) {}

  async createMovie(createMovieRequest: CreateMovieRequest): Promise<MovieResponse> {
    return this.dataSource.transaction(async (manager) => {
      const movieRepository = manager.getRepository(Movie);
      const genreRepository = manager.getRepository(Genre);

      const {
        vietnameseTitle,
        originalTitle,
        releaseDate,
        overview,
        duration,
        ageRating,
        director,
        actors,
        genreIds,
        country,
      } = createMovieRequest;

      // const now = new Date();
      // const movieReleaseDate = new Date(releaseDate);
      // if (now >= movieReleaseDate) {
      //   throw new BadRequestException();
      // }

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
        country: country,
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
        country: newMovie.country,
        genres: newMovie.genres.map((genre) => ({
          id: genre.id,
          name: genre.name,
        })),
      };
    });
  }

  async updateMovieInfo(movieId: number, request: UpdateMovieInfoRequest) {
    const movieRepository = this.dataSource.getRepository(Movie);
    const genreRepository = this.dataSource.getRepository(Genre);

    const movie = await movieRepository.findOneBy({ id: movieId });
    if (!movie) {
      throw new NotFoundException();
    }

    const {
      vietnameseTitle,
      originalTitle,
      releaseDate,
      overview,
      duration,
      ageRating,
      director,
      actors,
      genreIds,
      country,
    } = request;

    const genres = await genreRepository.findBy({
      id: In(genreIds),
    });

    if (genres.length !== genreIds.length) {
      throw new BadRequestException();
    }

    movie.vietnameseTitle = vietnameseTitle;
    movie.originalTitle = originalTitle || "";
    movie.releaseDate = releaseDate;
    movie.overview = overview;
    movie.director = director;
    movie.duration = duration;
    movie.ageRating = ageRating;
    movie.country = country;
    movie.actors = actors;
    movie.genres = genres;

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
      country: movie.country,
      genres: movie.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
      })),
    };
  }

  async updateMovieImages(movieId: number, updateMovieImagesRequest: UpdateMovieImagesRequest): Promise<MovieResponse> {
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
      country: movie.country,
      genres: movie.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
      })),
    };
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
      country: movie.country,
      genres: movie.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
      })),
    } as UpdateMovieStatusResponse;
  }

  async getMovies(movieQuery: MovieQuery): Promise<Page<MovieResponse>> {
    const movieRepository = this.dataSource.getRepository(Movie);

    const { page, size, title } = movieQuery;

    const [movies, total] = await movieRepository.findAndCount({
      skip: page * size,
      take: size,
      order: {
        id: "DESC",
      },
      where: [
        { isDeleted: false, vietnameseTitle: ILike(`%${title ?? ""}%`) },
        { isDeleted: false, originalTitle: ILike(`%${title ?? ""}%`) },
        { isDeleted: false, searchTitle: ILike(`%${title ?? ""}%`) },
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
      country: movie.country,
      genres: movie.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
      })),
    }));

    return new Page(dtos, movieQuery, total);
  }

  async getMovie(movieId: number): Promise<MovieResponse> {
    const movieRepository = this.dataSource.getRepository(Movie);

    const movie = await movieRepository.findOne({
      where: { id: movieId },
      relations: { genres: true },
    });
    if (!movie) {
      throw new NotFoundException();
    }

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
      country: movie.country,
      genres: movie.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
      })),
    };
  }

  async deleteMovieById(movieId: number): Promise<void> {
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

  async getUpComingMovies(pageQuery: PageQuery): Promise<Page<MovieResponse>> {
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

    const dtos: MovieResponse[] = movies.map((movie) => ({
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
      country: movie.country,
      genres: movie.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
      })),
    }));

    return new Page(dtos, pageQuery, total);
  }

  async getShowingMovies(pageQuery: PageQuery): Promise<Page<MovieResponse>> {
    const { page, size } = pageQuery;

    const movieRepository = this.dataSource.getRepository(Movie);

    const now = new Date();
    const today = new Date().toISOString().split("T")[0];

    const oneMonthBefore = new Date();
    oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);
    const lastMonth = oneMonthBefore.toISOString().split("T")[0];

    // get total
    const totalQuery = movieRepository
      .createQueryBuilder("movie")
      .where("movie.releaseDate <= :today", { today })
      .andWhere("movie.isDeleted = :isDeleted", { isDeleted: false })
      .leftJoin("movie.showtimes", "showtime", "showtime.movie_id = movie.id")
      .andWhere(
        new Brackets((qb) => {
          qb.where("showtime.startTime >= :now", { now }).orWhere("movie.releaseDate >= :lastMonth", {
            lastMonth: lastMonth,
          });
        }),
      )
      .select("movie.id")
      .groupBy("movie.id");

    const totalCount = await totalQuery.getCount();

    if (totalCount === 0) {
      return new Page([], pageQuery, 0);
    }

    /*
     * Điều kiện để một bộ phim được xem là "đang chiếu":
     * (releaseDate <= current) and ((showtime >= current) or (releaseDate >= lastMonth))
     */
    const idQuery = movieRepository
      .createQueryBuilder("movie")
      .where("movie.releaseDate <= :today", { today })
      .andWhere("movie.isDeleted = :isDeleted", { isDeleted: false })
      .leftJoin("movie.showtimes", "showtime", "showtime.movie_id = movie.id")
      .andWhere(
        new Brackets((qb) => {
          qb.where("showtime.startTime >= :now", { now }).orWhere("movie.releaseDate >= :lastMonth", {
            lastMonth: lastMonth,
          });
        }),
      )
      .select("movie.id", "id")
      .addSelect("COUNT(showtime.id)", "showtimeCount")
      .groupBy("movie.id")
      .orderBy("CASE WHEN COUNT(showtime.id) > 0 THEN 0 ELSE 1 END", "ASC")
      .addOrderBy("movie.releaseDate", "DESC")
      .offset(page * size)
      .limit(size);

    const rawMovieIds: { id: number }[] = await idQuery.getRawMany();
    const showingMovieIds = rawMovieIds.map((e) => e.id);

    if (showingMovieIds.length === 0) {
      return new Page([], pageQuery, 0);
    }

    const showingMovies = await movieRepository.find({
      where: {
        id: In(showingMovieIds),
      },
      relations: {
        genres: true,
      },
    });

    const movieMap = showingMovies.reduce(
      (map, movie) => {
        map[movie.id] = movie;
        return map;
      },
      {} as Record<string, Movie>,
    );

    const sortedShowingMovies: Movie[] = showingMovieIds.map((movieId) => movieMap[movieId]).filter(Boolean);

    const dtos = sortedShowingMovies.map((movie) => ({
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
      country: movie.country,
      genres: movie.genres ? movie.genres.map((g) => ({ id: g.id, name: g.name })) : [],
    }));

    return new Page(dtos, pageQuery, totalCount);
  }
}

import { DataSource, ILike, In } from "typeorm";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateMovieRequest } from "./dto/CreateMovieRequest";
import { Movie, MovieState } from "./entity/movie.entity";
import { Genre } from "./entity/genre.entity";
import { CreateMovieResponse } from "./dto/CreateMovieResponse";
import { UpdateMovieImagesRequest } from "./dto/UpdateMovieImagesRequest";
import { StorageService } from "../common/storage/storage.service";
import { MovieQuery } from "./dto/query/MovieQuery";
import { Page } from "../common/pagination/page";
import { UpdateMovieStatusResponse } from "./UpdateMovieStatusResponse";

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
}

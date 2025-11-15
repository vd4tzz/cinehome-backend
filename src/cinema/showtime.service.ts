import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Showtime, ShowtimeState } from "./entity/showtime.entity";
import { CreateShowtimeRequest } from "./dto/create-showtime-request";
import { Movie } from "../movie/entity/movie.entity";
import { Screen } from "./entity/screen.entity";
import { CreateShowtimeResponse } from "./dto/CreateShowtimeResponse";
import { CancelShowtimeRequest } from "./dto/CancelShowtimeRequest";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ShowtimeCancelledEvent } from "./event/showtime-cancelled.event";
import { CancelShowtimeResponse } from "./dto/CancelShowtimeResponse";
import { ShowtimeQuery } from "../movie/dto/query/showtime-query";
import { Page } from "../common/pagination/page";
import { PageQuery } from "../common/pagination/page-query";
import { Format } from "./entity/format.entity";

export interface ShowtimeItem {
  showtimeId: number;
  time: string; // HH:mm
  format: string;
  screenName: string;
}

export interface CinemaNode {
  cinemaId: number;
  cinemaName: string;
  cinemaProvince: string;
  times: ShowtimeItem[];
}

export interface DateNode {
  date: string; // YYYY-MM-DD
  cinemas: Map<number, CinemaNode>;
}

@Injectable()
export class ShowtimeService {
  constructor(
    private dataSource: DataSource,
    private eventEmitter2: EventEmitter2,
  ) {}

  async createShowtime(screenId: number, createShowtimeRequest: CreateShowtimeRequest) {
    const showtimeRepository = this.dataSource.getRepository(Showtime);
    const movieRepository = this.dataSource.getRepository(Movie);
    const screenRepository = this.dataSource.getRepository(Screen);
    const formatRepository = this.dataSource.getRepository(Format);

    const { movieId, basePrice, formatId } = createShowtimeRequest;

    const [movie, screen, format] = await Promise.all([
      movieRepository.findOneBy({ id: movieId }),
      screenRepository.findOneBy({ id: screenId }),
      formatRepository.findOneBy({ id: formatId }),
    ]);

    if (!movie || !screen || !format) {
      throw new NotFoundException();
    }

    const current = new Date();
    const startTime = new Date(createShowtimeRequest.startTime);
    const endTime = new Date(startTime.getTime() + movie.duration * 60 * 1000);

    // Đảm bảo startTime phải là thời gian trong tương lai
    if (startTime <= current) {
      throw new BadRequestException();
    }

    const overlap = await showtimeRepository
      .createQueryBuilder("s")
      .where("s.screen_id = :screenId", { screenId })
      .andWhere("(s.start_time < :endTime AND s.end_time > :startTime)", { startTime, endTime })
      .getOne();
    if (overlap) {
      throw new BadRequestException();
    }

    const showtime = new Showtime({
      screen: screen,
      movie: movie,
      format: format,
      startTime: startTime,
      endTime: endTime,
      state: ShowtimeState.ACTIVE,
      basePrice: basePrice,
    });

    await showtimeRepository.save(showtime);

    return {
      id: showtime.id,
      movieId: showtime.movie.id,
      screenId: showtime.screen.id,
      startTime: showtime.startTime.toISOString(),
      endTime: showtime.endTime.toISOString(),
      description: showtime.description,
      basePrice: showtime.basePrice,
    } as CreateShowtimeResponse;
  }

  async cancelShowtime(showtimeId: number, cancelShowtimeRequest: CancelShowtimeRequest) {
    const showtimeRepository = this.dataSource.getRepository(Showtime);
    const showtime = await showtimeRepository.findOneBy({ id: showtimeId });
    if (!showtime) {
      throw new NotFoundException();
    }

    if (showtime.state == ShowtimeState.CANCELED) {
      throw new BadRequestException();
    }

    showtime.state = ShowtimeState.CANCELED;
    showtime.description = cancelShowtimeRequest.description;
    await showtimeRepository.save(showtime);

    this.eventEmitter2.emit("showtime.cancelled", { showtimeId: showtimeId } as ShowtimeCancelledEvent);

    return {
      id: showtime.id,
      movieId: showtime.movieId,
      screenId: showtime.screenId,
      startTime: showtime.startTime.toISOString(),
      endTime: showtime.endTime.toISOString(),
      description: showtime.description,
      basePrice: showtime.basePrice,
    } as CancelShowtimeResponse;
  }

  async getShowtimesOfScreen(screenId: number, showtimeQuery: ShowtimeQuery) {
    const { page, size, startTimeFrom, startTimeTo, state } = showtimeQuery;

    const qb = this.dataSource.getRepository(Showtime).createQueryBuilder("showtime");

    qb.andWhere("showtime.screen_id = :screenId", { screenId });

    if (startTimeFrom) {
      qb.andWhere("showtime.startTime >= :startTimeFrom", { startTimeFrom: new Date(startTimeFrom) });
    }

    if (startTimeTo) {
      qb.andWhere("showtime.startTime <= :startTimeTo", { startTimeTo: new Date(startTimeTo) });
    }

    if (state) {
      qb.andWhere("showtime.state = :state", { state });
    }

    qb.orderBy("showtime.id", "DESC");

    qb.skip(page * size).take(size);

    const [showtimes, total] = await qb.getManyAndCount();

    const dtos = showtimes.map((showtime) => ({
      id: showtime.id,
      movieId: showtime.movieId,
      screenId: showtime.screenId,
      startTime: showtime.startTime.toISOString(),
      endTime: showtime.endTime.toISOString(),
      state: showtime.state,
      description: showtime.description,
      basePrice: showtime.basePrice,
    }));

    return new Page(dtos, showtimeQuery, total);
  }

  async getAvailableShowtimeOfMovie(movieId: number, queryParams: PageQuery) {
    const movieRepository = this.dataSource.getRepository(Movie);
    const showtimeRepository = this.dataSource.getRepository(Showtime);

    const { page, size } = queryParams;

    const movie = await movieRepository.findOneBy({ id: movieId });
    if (!movie) {
      throw new NotFoundException();
    }

    const now = new Date();

    const query = showtimeRepository
      .createQueryBuilder("showtime")
      .innerJoinAndSelect("showtime.format", "format")
      .innerJoinAndSelect("showtime.screen", "screen")
      .innerJoinAndSelect("screen.cinema", "cinema")
      .where("showtime.movie_id = :movieId", { movieId: movieId })
      .andWhere("showtime.endTime > :now", { now: now })
      .limit(size)
      .offset(page * size);

    const showtimes = await query.getMany();

    const scheduleMap = new Map<string, DateNode>();

    for (const row of showtimes) {
      const date = row.startTime.toISOString().slice(0, 10);
      const time = row.startTime.toISOString().slice(11, 16);
      const cinemaName = row.screen.cinema.name;
      const cinemaId = row.screen.cinema.id;
      const screenName = row.screen.name;
      const format = row.format.code;
      const showtimeId = row.id;
      const province = row.screen.cinema.address.province;

      if (!scheduleMap.has(date)) {
        scheduleMap.set(date, {
          date: date,
          cinemas: new Map<number, CinemaNode>(),
        });
      }

      const dateNode = scheduleMap.get(date)!;
      if (!dateNode.cinemas.has(cinemaId)) {
        dateNode.cinemas.set(cinemaId, {
          cinemaId: cinemaId,
          cinemaName: cinemaName,
          cinemaProvince: province,
          times: [],
        });
      }

      const cinemaNode = dateNode.cinemas.get(cinemaId)!;
      cinemaNode.times.push({
        showtimeId: showtimeId,
        time: time,
        format: format,
        screenName: screenName,
      });
    }

    return [...scheduleMap.values()].map((dateNode) => ({
      date: dateNode.date,
      cinemas: [...dateNode.cinemas.values()],
    }));
  }
}

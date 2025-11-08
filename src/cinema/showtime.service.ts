import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Showtime, ShowtimeState } from "./entity/showtime.entity";
import { CreateShowtimeRequest } from "./dto/CreateShowtimeRequest";
import { Movie } from "../movie/entity/movie.entity";
import { Screen } from "./entity/screen.entity";
import { CreateShowtimeResponse } from "./dto/CreateShowtimeResponse";
import { CancelShowtimeRequest } from "./dto/CancelShowtimeRequest";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ShowtimeCancelledEvent } from "./event/showtime-cancelled.event";
import { CancelShowtimeResponse } from "./dto/CancelShowtimeResponse";
import { ShowtimeQuery } from "../movie/dto/query/showtime-query";
import { Page } from "../common/pagination/page";

@Injectable()
export class ShowtimeService {
  constructor(
    private dataSource: DataSource,
    private eventEmitter2: EventEmitter2,
  ) {}

  async createShowtime(createShowtimeRequest: CreateShowtimeRequest) {
    const showtimeRepository = this.dataSource.getRepository(Showtime);
    const movieRepository = this.dataSource.getRepository(Movie);
    const screenRepository = this.dataSource.getRepository(Screen);

    const { screenId, movieId } = createShowtimeRequest;

    const movie = await movieRepository.findOneBy({ id: movieId });
    const screen = await screenRepository.findOneBy({ id: screenId });

    if (!movie || !screen) {
      throw new NotFoundException();
    }

    const startTime = new Date(createShowtimeRequest.startTime);
    const endTime = new Date(startTime.getTime() + movie.duration * 60 * 1000);

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
      startTime: startTime,
      endTime: endTime,
      state: ShowtimeState.ACTIVE,
    });

    await showtimeRepository.save(showtime);

    return {
      id: showtime.id,
      movieId: showtime.movie.id,
      screenId: showtime.screen.id,
      startTime: showtime.startTime.toISOString(),
      endTime: showtime.endTime.toISOString(),
      description: showtime.description,
    } as CreateShowtimeResponse;
  }

  async cancelShowtime(showtimeId: number, cancelShowtimeRequest: CancelShowtimeRequest) {
    const showtimeRepository = this.dataSource.getRepository(Showtime);
    const showtime = await showtimeRepository.findOneBy({ id: showtimeId });
    if (!showtime) {
      throw new NotFoundException();
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
    } as CancelShowtimeResponse;
  }

  async getShowtimes(showtimeQuery: ShowtimeQuery) {

  }
}

import { DataSource, MoreThan } from "typeorm";
import { Cinema } from "./entity/cinema.entity";
import { Screen } from "./entity/screen.entity";
import { GetScreenResponse } from "./dto/get-screen-response";
import { UpdateScreenRequest } from "./dto/update-screen-request";
import { CreateScreenRequest } from "./dto/create-screen-request";
import { CreateScreenResponse } from "./dto/create-screen-response";
import { UpdateScreenResponse } from "./dto/update-screen-response";
import { PageQuery } from "../common/pagination/page-query";
import { Page } from "../common/pagination/page";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Seat } from "./entity/seat.entity";
import { Showtime } from "./entity/showtime.entity";

@Injectable()
export class ScreenService {
  constructor(private dataSource: DataSource) {}

  async createScreen(cinemaId: number, createScreenRequest: CreateScreenRequest): Promise<CreateScreenResponse> {
    /*
     * To create a Screen, the name with the associated cinemaId must not yet exist.
     */

    const cinemaRepository = this.dataSource.getRepository(Cinema);
    const screenRepository = this.dataSource.getRepository(Screen);

    const cinema = await cinemaRepository.findOneBy({ id: cinemaId });
    if (!cinema) {
      throw new NotFoundException();
    }

    const screenExisted = await screenRepository.findOneBy({
      cinema: { id: cinemaId },
      name: createScreenRequest.name,
    });
    if (screenExisted) {
      throw new BadRequestException();
    }

    const newScreen = new Screen({
      name: createScreenRequest.name,
      cinema: { id: cinemaId } as Cinema,
    });

    await screenRepository.save(newScreen);

    return {
      id: newScreen.id,
      name: newScreen.name,
      cinemaId: newScreen.cinemaId,
    };
  }

  async updateScreen(screenId: number, updateScreenRequest: UpdateScreenRequest): Promise<UpdateScreenResponse> {
    const screenRepository = this.dataSource.getRepository(Screen);

    const screen = await screenRepository.findOne({
      where: {
        id: screenId,
      },
      relations: {
        cinema: true,
      },
    });

    if (!screen) throw new NotFoundException();

    const isNameExisted = await screenRepository.exists({
      where: {
        name: updateScreenRequest.name,
        cinema: { id: screen.cinemaId },
      },
    });

    if (isNameExisted) {
      throw new BadRequestException("Name existed");
    }

    screen.name = updateScreenRequest.name;
    await screenRepository.save(screen);

    return {
      id: screen.id,
      name: screen.name,
      cinemaId: screen.cinema.id,
    };
  }

  async getScreenById(screenId: number): Promise<GetScreenResponse> {
    const screenRepository = this.dataSource.getRepository(Screen);

    const screen = await screenRepository.findOne({
      where: { id: screenId },
      relations: ["cinema"],
    });
    if (!screen) {
      throw new BadRequestException();
    }

    return {
      id: screen.id,
      name: screen.name,
      cinemaId: screen.cinema.id,
    };
  }

  async getScreens(cinemaId: number, pageParam: PageQuery): Promise<Page<GetScreenResponse>> {
    const { page, size } = pageParam;

    const query = this.dataSource
      .getRepository(Screen)
      .createQueryBuilder("screen")
      .where("screen.cinema = :cinemaId", { cinemaId })
      .orderBy("id")
      .skip(page * size)
      .take(size);

    const [screens, total] = await query.getManyAndCount();

    const dtos: GetScreenResponse[] = screens.map((screen) => ({
      id: screen.id,
      name: screen.name,
      cinemaId: cinemaId,
    }));

    return new Page(dtos, pageParam, total);
  }

  async deleteScreen(screenId: number): Promise<void> {
    const screenRepository = this.dataSource.getRepository(Screen);
    const screen = await screenRepository.findOne({
      where: { id: screenId },
    });

    if (!screen) {
      throw new NotFoundException();
    }

    const isShowtimeInFutureExisted = await this.dataSource.getRepository(Showtime).exists({
      where: {
        screen: { id: screenId },
        startTime: MoreThan(new Date()),
      },
    });

    if (isShowtimeInFutureExisted) {
      throw new BadRequestException("exist showtime in future");
    }

    await this.dataSource.transaction(async (manager) => {
      // Performance: Sử dụng softDelete thay vì cascade softRemove.
      // - Cơ chế: Bắn thẳng lệnh SQL UPDATE ... WHERE screenId = ? xuống DB.
      // - Lợi ích: Xử lý hàng loạt (Batch) trong 1 request, không Hydrate object lên Application layer.
      await manager.getRepository(Seat).softDelete({
        screen: { id: screenId },
      });

      await manager.softRemove(screen);
    });
  }
}

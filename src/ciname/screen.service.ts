import { DataSource } from "typeorm";
import { Cinema } from "./entity/cinema.entity";
import { Screen } from "./entity/screen.entity";
import { GetScreenResponse } from "./dto/get-screen-response";
import { UpdateScreenRequest } from "./dto/update-screen-request";
import { CreateScreenRequest } from "./dto/create-screen-request";
import { CreateScreenResponse } from "./dto/create-screen-response";
import { UpdateScreenResponse } from "./dto/update-screen-response";
import { PageParam } from "../common/pagination/PageParam";
import { Page } from "../common/pagination/Page";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ScreenService {
  constructor(private dataSource: DataSource) {}

  async createScreen(cinemaId: number, createScreenRequest: CreateScreenRequest): Promise<CreateScreenResponse> {
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
      cinema: cinema,
    });

    await screenRepository.save(newScreen);

    return {
      id: newScreen.id,
      name: newScreen.name,
      cinemaId: newScreen.cinema.id,
    };
  }

  async updateScreen(
    cinemaId: number,
    screenId: number,
    updateScreenRequest: UpdateScreenRequest,
  ): Promise<UpdateScreenResponse> {
    const screenRepository = this.dataSource.getRepository(Screen);

    const screen = await screenRepository.findOne({
      where: {
        id: screenId,
        cinema: { id: cinemaId },
      },
      relations: ["cinema"],
    });

    if (!screen) throw new NotFoundException();

    const nameExisted = await screenRepository.exists({ where: { name: updateScreenRequest.name } });
    if (nameExisted) {
      throw new BadRequestException();
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

  async getScreens(cinemaId: number, pageParam: PageParam): Promise<Page<GetScreenResponse>> {
    const { page, size, order } = pageParam;

    // const screenRepository = this.dataSource.getRepository(Screen);
    // const [screens, total] = await screenRepository.findAndCount({
    //   relations: ["cinema"],
    //   where: {
    //     cinema: { id: cinemaId },
    //   },
    //   skip: page * size,
    //   take: size,
    //   order: order,
    // });

    const query = this.dataSource
      .getRepository(Screen)
      .createQueryBuilder("screen")
      .where("screen.cinema = :cinemaId", { cinemaId })
      .skip(page * size)
      .take(size);

    Object.entries(order).forEach(([field, direction]) => {
      query.addOrderBy(`${field}`, direction);
    });

    const [screens, total] = await query.getManyAndCount();

    const dtos: GetScreenResponse[] = screens.map((screen) => ({
      id: screen.id,
      name: screen.name,
      cinemaId: cinemaId,
    }));

    return new Page(dtos, pageParam, total);
  }
}

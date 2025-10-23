import { DataSource } from "typeorm";
import { CreateScreenRequest } from "./dto/create-screen-request";
import { Cinema } from "./entity/cinema.entity";
import { Screen } from "./entity/screen.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateScreenResponse } from "./dto/create-screen-response";
import { UpdateScreenRequest } from "./dto/update-screen-request";
import { UpdateScreenResponse } from "./dto/update-screen-response";

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

    const screenExisted = await screenRepository.findOneBy({ name: createScreenRequest.name });
    if (screenExisted) {
      throw new NotFoundException();
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

    screen.name = updateScreenRequest.name;
    await screenRepository.save(screen);

    return {
      id: screen.id,
      name: screen.name,
      cinemaId: screen.cinema.id,
    };
  }
}

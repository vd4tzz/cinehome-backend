import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CreateCinemaRequest } from "./dto/create-cinema-request";
import { CreateCinemaResponse } from "./dto/create-cinema-response";
import { Cinema } from "./entity/cinema.entity";
import { UpdateCinemaRequest } from "./dto/update-cinema-request";
import { UpdateCinemaResponse } from "./dto/update-cinema-response";
import { GetCinemaResponse } from "./dto/get-cinema-response";
import { PageParam } from "../common/pagination/PageParam";
import { Page } from "../common/pagination/Page";

@Injectable()
export class CinemaService {
  constructor(private dataSource: DataSource) {}

  async createCinema(createCinemaRequest: CreateCinemaRequest): Promise<CreateCinemaResponse> {
    return await this.dataSource.transaction(async (manager) => {
      const cinemaRepository = manager.getRepository(Cinema);

      const cinema = new Cinema({
        name: createCinemaRequest.name,
        address: {
          street: createCinemaRequest.street,
          province: createCinemaRequest.province,
        },
      });
      await cinemaRepository.save(cinema);

      return new CreateCinemaResponse({
        id: cinema.id,
        name: cinema.name,
        street: cinema.address.street,
        province: cinema.address.province,
      });
    });
  }

  async updateCinema(cinemaId: number, updateCinemaRequest: UpdateCinemaRequest): Promise<UpdateCinemaResponse> {
    return await this.dataSource.transaction(async (manager) => {
      const cinemaRepository = manager.getRepository(Cinema);

      const { name, street, province } = updateCinemaRequest;

      const cinema = await cinemaRepository.findOne({ where: { id: cinemaId } });

      if (!cinema) {
        throw new NotFoundException();
      }

      cinema.name = name;
      cinema.address.street = street;
      cinema.address.province = province;

      await cinemaRepository.save(cinema);

      return {
        id: cinema.id,
        name: cinema.name,
        street: cinema.address.street,
        province: cinema.address.province,
      };
    });
  }

  async getCinemaById(cinemaId: number): Promise<GetCinemaResponse> {
    const cinemaRepository = this.dataSource.getRepository(Cinema);
    const cinema = await cinemaRepository.findOneBy({ id: cinemaId });
    if (!cinema) {
      throw new NotFoundException();
    }

    return {
      id: cinema.id,
      name: cinema.name,
      street: cinema.address.street,
      province: cinema.address.province,
    };
  }

  async getCinemas(pageParam: PageParam): Promise<Page<GetCinemaResponse>> {
    const { page, size, order } = pageParam;

    const cinemaRepository = this.dataSource.getRepository(Cinema);
    const [cinemas, total] = await cinemaRepository.findAndCount({
      skip: page * size,
      take: size,
      order: order,
    });

    const dtos: GetCinemaResponse[] = cinemas.map((cinema) => ({
      id: cinema.id,
      name: cinema.name,
      street: cinema.address.street,
      province: cinema.address.province,
    }));

    return new Page(dtos, pageParam, total);
  }
}

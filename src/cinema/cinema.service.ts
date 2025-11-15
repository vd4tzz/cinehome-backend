import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CreateCinemaRequest } from "./dto/create-cinema-request";
import { CreateCinemaResponse } from "./dto/create-cinema-response";
import { Cinema } from "./entity/cinema.entity";
import { UpdateCinemaRequest } from "./dto/update-cinema-request";
import { UpdateCinemaResponse } from "./dto/update-cinema-response";
import { GetCinemaResponse } from "./dto/get-cinema-response";
import { PageQuery } from "../common/pagination/page-query";
import { Page } from "../common/pagination/page";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class CinemaService {
  constructor(
    private dataSource: DataSource,
    private eventEmitter: EventEmitter2,
  ) {}

  //Todo:
  // - đổi hard delete thành soft delete
  // - với các api xóa, sửa:
  //  + cần kiểm tra showtime, đảm bảo không có startTime >= current

  async createCinema(createCinemaRequest: CreateCinemaRequest): Promise<CreateCinemaResponse> {
    const cinemaRepository = this.dataSource.getRepository(Cinema);

    const cinema = new Cinema({
      name: createCinemaRequest.name,
      address: {
        street: createCinemaRequest.street,
        province: createCinemaRequest.province,
      },
    });
    await cinemaRepository.save(cinema);

    this.eventEmitter.emit("cinema.created", { cinemaId: cinema.id });

    return new CreateCinemaResponse({
      id: cinema.id,
      name: cinema.name,
      street: cinema.address.street,
      province: cinema.address.province,
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

  async getCinemas(pageParam: PageQuery): Promise<Page<GetCinemaResponse>> {
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

  async deleteCinemaById(cinemaId: number): Promise<void> {
    const cinemaRepository = this.dataSource.getRepository(Cinema);
    const result = await cinemaRepository.delete(cinemaId);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async getCinemaProvinces() {
    const cinemaRepository = this.dataSource.getRepository(Cinema);

    const provinceRecords = await cinemaRepository
      .createQueryBuilder("cinema")
      .distinct(true)
      .select(["cinema.province"])
      .getRawMany<Record<string, string>>();

    const provinces = provinceRecords.map((province) => province.province);
    return {
      provinces,
    };
  }
}

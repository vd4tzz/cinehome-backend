import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { PageQuery } from "../common/pagination/page-query";
import { User } from "./entity/user.entity";
import { Page } from "../common/pagination/page";

@Injectable()
export class UserService {
  constructor(private dataSource: DataSource) {}

  async getAdminsByCinemaId(cinemaId: number, pageParam: PageQuery) {
    const userRepository = this.dataSource.getRepository(User);

    const userAdmins = await userRepository.find({
      relations: ["admin"],
      where: {
        admin: {
          cinema: {
            id: cinemaId,
          },
        },
      },
      skip: pageParam.skip,
      take: pageParam.size,
    });

    const total = await userRepository.count({
      relations: ["admin"],
      where: {
        admin: {
          cinema: {
            id: cinemaId,
          },
        },
      },
    });

    const dtos = userAdmins.map((userAdmin) => ({
      userId: userAdmin.id,
      username: userAdmin.email,
      cinemaId: userAdmin.admin.cinemaId,
    }));

    return new Page(dtos, pageParam, total);
  }
}

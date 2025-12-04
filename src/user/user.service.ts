import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { PageQuery } from "../common/pagination/page-query";
import { User } from "./entity/user.entity";
import { Page } from "../common/pagination/page";
import { UpdateUserInfoRequest } from "./dto/UpdateUserInfoRequest";

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

  async getUserInfo(userId: number) {
    const user = await this.dataSource.getRepository(User).findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException();
    }

    return {
      id: user.id,
      fullName: user.fullName || "",
      dateOfBirth: user.dateOfBirth?.toISOString() || "",
      email: user.email,
      phoneNumber: user.phoneNumber || "",
    };
  }

  async updateUserInfo(userId: number, updateUserInfoRequest: UpdateUserInfoRequest) {
    const userRepository = this.dataSource.getRepository(User);

    const user = await userRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException();
    }

    const { fullName, dateOfBirth, phoneNumber } = updateUserInfoRequest;
    user.fullName = fullName;
    user.phoneNumber = phoneNumber;
    user.dateOfBirth = new Date(dateOfBirth);

    await userRepository.save(user);

    return {
      id: user.id,
      fullName: user.fullName,
      dateOfBirth: user.dateOfBirth.toISOString(),
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
  }
}

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { PageQuery } from "../common/pagination/page-query";
import { OAuth2Provider, User } from "./entity/user.entity";
import { Page } from "../common/pagination/page";
import { UpdateUserInfoRequest } from "./dto/UpdateUserInfoRequest";
import * as bcrypt from "bcrypt";
import { UserAdmin } from "./entity/user-admin.entity";
import { Cinema } from "../cinema/entity/cinema.entity";

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

  async createAdmin(cinemaId: number, username: string, password: string) {
    return this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const adminRepository = manager.getRepository(UserAdmin);

      const existedUser = await userRepository.findOneBy({
        email: username,
      });

      if (existedUser) {
        throw new BadRequestException("User da ton tai");
      }

      const cinemaRepository = manager.getRepository(Cinema);
      const cinema = await cinemaRepository.findOneBy({ id: cinemaId });
      if (!cinema) {
        throw new NotFoundException("Khong ton tai cinema");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        email: username,
        password: hashedPassword,
        isVerified: true,
        oAuth2Provider: OAuth2Provider.NONE,
      });

      const admin = new UserAdmin();
      admin.user = user;
      admin.cinema = cinema;

      await userRepository.save(user);
      await adminRepository.save(admin);
    });
  }
}

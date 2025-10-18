import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Role, RoleName } from "../user/entity/role.entity";

@Injectable()
export class AuthRoleContext implements OnApplicationBootstrap {
  private userRole: Role;

  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {}

  async getUserRole(): Promise<Role> {
    const roleRepository = this.dataSource.getRepository(Role);
    const existed = await roleRepository.findOneBy({ name: RoleName.USER });

    this.userRole = existed!;
    return this.userRole;
  }
}

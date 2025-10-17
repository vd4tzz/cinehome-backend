import { Injectable, OnModuleInit } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Role, RoleName } from "../user/entity/role.entity";

@Injectable()
export class AuthRoleContext implements OnModuleInit {
  private userRole: Role;

  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    await this.dataSource.transaction(async (manager) => {
      const roleRepository = manager.getRepository(Role);
      const existed = await roleRepository.findOneBy({ name: RoleName.USER });
      if (!existed) {
        this.userRole = new Role({ name: RoleName.USER });
        await roleRepository.save(this.userRole);
      } else {
        this.userRole = existed;
      }
    });
  }

  getUserRole(): Role {
    return this.userRole;
  }
}

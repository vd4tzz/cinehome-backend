import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { User } from "./entity/user.entity";
import { Token } from "./entity/token.entity";
import { Role } from "./entity/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Token, Role])],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

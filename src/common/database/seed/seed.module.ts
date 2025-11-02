import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "../../../user/entity/role.entity";
import { SeedService } from "./seed.service";

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}

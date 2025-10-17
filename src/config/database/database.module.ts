import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "../../user/entity/user.entity";
import { Token } from "../../user/entity/token.entity";
import { Role } from "../../user/entity/role.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DATABASE_HOST"),
        port: configService.get("DATABASE_PORT"),
        username: configService.get("DATABASE_USERNAME"),
        password: configService.get("DATABASE_PASSWORD"),
        database: configService.get("DATABASE_DB"),
        // entities: [__dirname + "/../**/*.entity{.ts,.js}"],
        entities: [User, Token, Role],
        synchronize: true,
        dropSchema: true, // xoa toan bo du lieu cu truoc khi sync
        logging: ["query", "error"],
      }),
    }),
  ],
})
export class DatabaseModule {}

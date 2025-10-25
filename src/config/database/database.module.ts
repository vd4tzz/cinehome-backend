import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "../../user/entity/user.entity";
import { Token } from "../../user/entity/token.entity";
import { Role } from "../../user/entity/role.entity";
import { Cinema } from "../../ciname/entity/cinema.entity";
import { Screen } from "../../ciname/entity/screen.entity";
import { Seat } from "../../ciname/entity/seat.entity";
import { Format } from "../../ciname/entity/format.entity";
import { TimeSlot } from "../../ciname/entity/time-slot.entity";
import { DayType } from "../../ciname/entity/day-type.entity";
import { SeatType } from "../../ciname/entity/seat-type.entity";
import { DayTypeSurcharge } from "../../ciname/entity/day-type-surcharge.entity";
import { TimeSlotSurcharge } from "../../ciname/entity/time-slot-surcharge.entity";
import { SeatTypeSurcharge } from "../../ciname/entity/seat-type-surcharge.entity";
import { Audience } from "../../ciname/entity/audience.entity";
import { AudienceSurcharge } from "../../ciname/entity/audience-surcharge.entity";
import { FormatSurcharge } from "../../ciname/entity/format-surcharge.entity";
import { UserAdmin } from "../../user/entity/user-admin.entity";

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
        entities: [
          User,
          UserAdmin,
          Token,
          Role,
          Cinema,
          Screen,
          Seat,
          Format,
          TimeSlot,
          DayType,
          SeatType,
          DayTypeSurcharge,
          TimeSlotSurcharge,
          SeatTypeSurcharge,
          Audience,
          AudienceSurcharge,
          FormatSurcharge,
        ],
        synchronize: true,
        dropSchema: true, // xoa toan bo du lieu cu truoc khi sync
        logging: ["query", "error"],
        logger: "formatted-console",
      }),
    }),
  ],
})
export class DatabaseModule {}

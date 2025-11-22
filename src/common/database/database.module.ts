import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "../../user/entity/user.entity";
import { Token } from "../../user/entity/token.entity";
import { Role } from "../../user/entity/role.entity";
import { Cinema } from "../../cinema/entity/cinema.entity";
import { Screen } from "../../cinema/entity/screen.entity";
import { Seat } from "../../cinema/entity/seat.entity";
import { Format } from "../../cinema/entity/format.entity";
import { TimeSlot } from "../../cinema/entity/time-slot.entity";
import { DayOfWeekType } from "../../cinema/entity/day-of-week-type.entity";
import { SeatType } from "../../cinema/entity/seat-type.entity";
import { DayOfWeekTypeSurcharge } from "../../cinema/entity/day-of-week-type-surcharge.entity";
import { TimeSlotSurcharge } from "../../cinema/entity/time-slot-surcharge.entity";
import { SeatTypeSurcharge } from "../../cinema/entity/seat-type-surcharge.entity";
import { Audience } from "../../cinema/entity/audience.entity";
import { AudienceSurcharge } from "../../cinema/entity/audience-surcharge.entity";
import { FormatSurcharge } from "../../cinema/entity/format-surcharge.entity";
import { UserAdmin } from "../../user/entity/user-admin.entity";
import { Movie } from "../../movie/entity/movie.entity";
import { Genre } from "../../movie/entity/genre.entity";
import { Showtime } from "../../cinema/entity/showtime.entity";
import { Booking } from "../../booking/entity/booking.entity";
import { Ticket } from "../../booking/entity/ticket.entity";

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
          DayOfWeekType,
          SeatType,
          DayOfWeekTypeSurcharge,
          TimeSlotSurcharge,
          SeatTypeSurcharge,
          Audience,
          AudienceSurcharge,
          FormatSurcharge,
          Movie,
          Genre,
          Showtime,
          Booking,
          Ticket,
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

import "reflect-metadata"; // Rất quan trọng cho TypeORM
import { DataSource } from "typeorm";
import { Movie } from "../src/movie/entity/movie.entity";
import { Genre } from "../src/movie/entity/genre.entity";
import { User } from "../src/user/entity/user.entity";
import { UserAdmin } from "../src/user/entity/user-admin.entity";
import { Token } from "../src/user/entity/token.entity";
import { Role } from "../src/user/entity/role.entity";
import { Cinema } from "../src/cinema/entity/cinema.entity";
import { Seat } from "../src/cinema/entity/seat.entity";
import { Format } from "../src/cinema/entity/format.entity";
import { TimeSlot } from "../src/cinema/entity/time-slot.entity";
import { DayOfWeekType } from "../src/cinema/entity/day-of-week-type.entity";
import { SeatType } from "../src/cinema/entity/seat-type.entity";
import { DayOfWeekTypeSurcharge } from "../src/cinema/entity/day-of-week-type-surcharge.entity";
import { TimeSlotSurcharge } from "../src/cinema/entity/time-slot-surcharge.entity";
import { SeatTypeSurcharge } from "../src/cinema/entity/seat-type-surcharge.entity";
import { Audience } from "../src/cinema/entity/audience.entity";
import { AudienceSurcharge } from "../src/cinema/entity/audience-surcharge.entity";
import { FormatSurcharge } from "../src/cinema/entity/format-surcharge.entity";
import { Showtime } from "../src/cinema/entity/showtime.entity";
import { Screen } from "../src/cinema/entity/screen.entity";

export const AppDataSource = new DataSource({
  type: "postgres", // Hoặc 'mysql', 'sqlite', v.v.
  host: "localhost",
  port: 5432, // Thay bằng port của bạn
  username: "postgres", // Thay bằng user của bạn
  password: "1", // Thay bằng pass của bạn
  database: "cinehome", // Thay bằng tên DB của bạn

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
  ],

  synchronize: false,
  logging: false,
});

export default AppDataSource; // Để chạy dễ dàng hơn

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./common/database/database.module";
import { MailModule } from "./common/mail/mail.module";
import { SeedModule } from "./common/database/seed/seed.module";
import { CinemaModule } from "./cinema/cinema.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MovieModule } from "./movie/movie.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    AuthModule,
    CinemaModule,
    MovieModule,
    DatabaseModule,
    MailModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./config/database/database.module";
import { MailModule } from "./common/mail/mail.module";
import { SeedModule } from "./common/seed/seed.module";

@Module({
  imports: [AuthModule, ConfigModule.forRoot(), DatabaseModule, MailModule, SeedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

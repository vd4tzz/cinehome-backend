import { Module } from "@nestjs/common";
import { BookingGateway } from "./booking.gateway";
import { PriceModule } from "../price/price.module";
import { CinemaModule } from "../cinema/cinema.module";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { ConfigModule } from "@nestjs/config";
import { PaymentModule } from "../payment/payment.module";

@Module({
  imports: [ConfigModule, CinemaModule, PriceModule, PaymentModule],
  controllers: [BookingController],
  providers: [BookingGateway, BookingService],
})
export class BookingModule {}

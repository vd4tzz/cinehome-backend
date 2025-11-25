// src/modules/bookings/bookings.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingItem } from './entities/booking-item.entity';
import { ShowSeat } from '../shows/entities/show-seat.entity';
import { Concession } from '../concessions/entities/concession.entity';
import { ConcessionItem } from '../concessions/entities/concession-item.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, BookingItem, ShowSeat, Concession, ConcessionItem])],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}

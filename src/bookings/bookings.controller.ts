import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { UserId } from '../common/decorators/user-id.decorator';

/**
 * BookingsController
 * - POST /bookings: tạo booking PENDING từ hold
 */
@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() dto: CreateBookingDto, @UserId() userId: string) {
    const booking = await this.bookingsService.createFromHold(userId, dto.holdId, dto.idempotencyKey);
    return {
      bookingId: booking.id,
      status: booking.status,
      totalAmount: booking.totalAmount,
      seatCount: booking.meta?.seatCount,
    };
  }
}

import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { UserId } from '../common/decorators/user-id.decorator';

/**
 * BookingsController
 * Quản lý đặt vé (chuyển hold thành booking)
 */
@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Tạo booking từ hold',
    description: 'Chuyển hold thành booking với status PENDING. Booking cần được thanh toán trong 15 phút.'
  })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Tạo booking thành công',
    schema: {
      example: {
        bookingId: 'uuid-here',
        status: 'PENDING',
        totalAmount: 250000,
        seatCount: 2,
        concessionCount: 3
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Hold không tồn tại hoặc đã hết hạn / Concession out of stock' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 404, description: 'Concession không tồn tại' })
  @ApiResponse({ status: 409, description: 'Booking đã tồn tại (duplicate idempotencyKey)' })
  async create(@Body() dto: CreateBookingDto, @UserId() userId: string) {
    const booking = await this.bookingsService.createFromHold(
      userId, 
      dto.holdId, 
      dto.idempotencyKey,
      dto.concessions
    );
    return {
      bookingId: booking.id,
      status: booking.status,
      totalAmount: booking.totalAmount,
      seatCount: booking.meta?.seatCount,
      concessionCount: dto.concessions?.length || 0,
    };
  }
}

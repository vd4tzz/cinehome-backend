import { Controller, Post, Body, UseGuards, Delete, Param, Get } from '@nestjs/common';
import { HoldsService } from './holds.service';
import { CreateHoldDto } from './dto/create-hold.dto';
import { AuthGuard } from '../common/guards/auth.guard';

/**
 * HoldsController
 * - POST /holds: giữ ghế
 * - DELETE /holds/:holdId: bỏ giữ ghế
 * - GET /holds/seed-demo: route DEMO tạo dữ liệu seats/show/showSeats cho bạn test nhanh
 */
@Controller('holds')
@UseGuards(AuthGuard)
export class HoldsController {
  constructor(private readonly holdsService: HoldsService) {}

  @Post()
  create(@Body() dto: CreateHoldDto) {
    // Trong Handler, bạn thấy "await": nó chờ Promise trả về rồi mới return
    // Ở đây Nest tự hiểu handler async => cho phép dùng await
    return this.holdsService.createHold(dto.showId, dto.seatIds, dto.idempotencyKey);
  }

  @Delete(':holdId')
  release(@Param('holdId') holdId: string) {
    return this.holdsService.releaseHold(holdId);
  }

  // ====== DEMO seeding (rất đơn giản) ======
  @Get('seed-demo')
  async seedDemo() {
    // gợi ý: bạn có thể viết script seed riêng. Ở đây mình không có repo nên ghi chú thôi.
    return {
      note: 'Hãy tự seed Seat/Show/ShowSeat bằng TypeORM seeding hoặc SQL. Ở MVP này trả lời hướng dẫn.',
      howTo: [
        '1) Tạo vài Seat rows (A-1..A-5, type NORMAL).',
        '2) Tạo 1 Show (startAt/endAt).',
        '3) Tạo ShowSeat cho từng Seat (status=AVAILABLE, link đến Show + Seat).',
      ],
    };
  }
}

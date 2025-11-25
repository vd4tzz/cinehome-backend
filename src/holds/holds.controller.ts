import { Controller, Post, Body, UseGuards, Delete, Param, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { HoldsService } from './holds.service';
import { CreateHoldDto } from './dto/create-hold.dto';
import { AuthGuard } from '../common/guards/auth.guard';

/**
 * HoldsController
 * Quản lý việc giữ ghế tạm thời (5 phút)
 */
@ApiTags('Holds')
@ApiBearerAuth()
@Controller('holds')
@UseGuards(AuthGuard)
export class HoldsController {
  constructor(private readonly holdsService: HoldsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Giữ ghế tạm thời',
    description: 'Giữ một hoặc nhiều ghế cho suất chiếu trong 5 phút. Ghế chuyển từ AVAILABLE → HOLD.'
  })
  @ApiBody({ type: CreateHoldDto })
  @ApiResponse({ status: 201, description: 'Giữ ghế thành công. Trả về holdId và thông tin ghế.' })
  @ApiResponse({ status: 400, description: 'Ghế không khả dụng hoặc đã được giữ/bán' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 429, description: 'Quá nhiều requests' })
  create(@Body() dto: CreateHoldDto) {
    return this.holdsService.createHold(dto.showId, dto.seatIds, dto.idempotencyKey);
  }

  @Delete(':holdId')
  @ApiOperation({ 
    summary: 'Bỏ giữ ghế',
    description: 'Hủy hold và chuyển ghế về trạng thái AVAILABLE. Dùng khi user không muốn giữ nữa.'
  })
  @ApiParam({ name: 'holdId', type: 'string', format: 'uuid', description: 'ID của hold cần hủy' })
  @ApiResponse({ status: 200, description: 'Hủy hold thành công' })
  @ApiResponse({ status: 404, description: 'Hold không tồn tại' })
  release(@Param('holdId') holdId: string) {
    return this.holdsService.releaseHold(holdId);
  }

  // ====== DEMO seeding (rất đơn giản) ======
  @Get('seed-demo')
  @ApiOperation({ 
    summary: '[DEMO] Hướng dẫn seed data',
    description: 'Endpoint demo trả về hướng dẫn tạo dữ liệu test cho seats/shows'
  })
  @ApiResponse({ status: 200, description: 'Hướng dẫn seed data' })
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

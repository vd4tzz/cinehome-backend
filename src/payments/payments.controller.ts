import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { AuthGuard } from '../common/guards/auth.guard';

/**
 * PaymentsController
 * Xử lý thanh toán (mock payment gateway)
 */
@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ 
    summary: 'Khởi tạo thanh toán',
    description: 'Tạo payment record và trả về URL thanh toán (mock). User redirect đến URL này để "thanh toán".'
  })
  @ApiBody({ type: InitiatePaymentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Khởi tạo thanh toán thành công',
    schema: {
      example: {
        paymentId: 'uuid-here',
        paymentUrl: 'http://mock-payment-gateway.local/pay?id=xxx',
        amount: 200000,
        status: 'PENDING'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Booking không ở trạng thái PENDING' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  initiate(@Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiatePayment(
      dto.bookingId,
      dto.idempotencyKey,
      dto.provider || 'mock',
      dto.returnUrl,
    );
  }

  @Post('webhook/mock')
  @ApiOperation({ 
    summary: '[Mock] Webhook xác nhận thanh toán',
    description: 'Endpoint công khai để simulate payment gateway callback. Xác nhận thanh toán thành công/thất bại.'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        paymentId: { type: 'string', format: 'uuid', description: 'ID của payment' },
        status: { type: 'string', enum: ['SUCCESS', 'FAILED', 'CANCELLED'], default: 'SUCCESS' }
      },
      required: ['paymentId']
    }
  })
  @ApiResponse({ status: 200, description: 'Xử lý webhook thành công. Booking được confirm nếu SUCCESS.' })
  @ApiResponse({ status: 404, description: 'Payment không tồn tại' })
  webhookMock(@Body() body: { paymentId: string; status?: 'SUCCESS' | 'FAILED' | 'CANCELLED' }) {
    return this.paymentsService.confirmMockPayment(body.paymentId, body.status || 'SUCCESS');
  }
}

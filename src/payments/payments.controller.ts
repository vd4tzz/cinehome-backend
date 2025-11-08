import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { AuthGuard } from '../common/guards/auth.guard';

/**
 * PaymentsController
 * - POST /payments/initiate: khởi tạo thanh toán (mock)
 * Trả về URL giả để FE redirect -> test luồng end-to-end
 */
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  @UseGuards(AuthGuard)
  initiate(@Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiatePayment(
      dto.bookingId,
      dto.idempotencyKey,
      dto.provider || 'mock',
      dto.returnUrl,
    );
  }

  // Public mock webhook: in real providers, do not protect with AuthGuard
  @Post('webhook/mock')
  webhookMock(@Body() body: { paymentId: string; status?: 'SUCCESS' | 'FAILED' | 'CANCELLED' }) {
    return this.paymentsService.confirmMockPayment(body.paymentId, body.status || 'SUCCESS');
  }
}

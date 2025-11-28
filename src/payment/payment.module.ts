import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { PaymentGatewayFactory } from "./payment-gateway-factory";
import { VnPayGateway } from "./vnpay-gateway";

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PaymentGatewayFactory, VnPayGateway],
  exports: [PaymentService],
})
export class PaymentModule {}

import { VnPayGateway } from "./vnpay-gateway";
import { PaymentMethod } from "./payment-method";
import { Injectable } from "@nestjs/common";
import { PaymentGateway } from "./payment-gateway.interface";

@Injectable()
export class PaymentGatewayFactory {
  constructor(private vnpay: VnPayGateway) {}

  getPaymentGateway(paymentMethod: PaymentMethod): PaymentGateway {
    switch (paymentMethod) {
      case PaymentMethod.VNPAY:
        return this.vnpay;
    }
  }
}

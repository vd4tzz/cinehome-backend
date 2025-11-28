import { Injectable } from "@nestjs/common";
import { PaymentInfo } from "./payment-info";
import { PaymentMethod } from "./payment-method";
import { PaymentGatewayFactory } from "./payment-gateway-factory";

@Injectable()
export class PaymentService {
  constructor(private readonly paymentGatewayFactory: PaymentGatewayFactory) {}

  async createPaymentUrl(paymentMethod: PaymentMethod, paymentInfo: PaymentInfo) {
    const paymentGateway = this.paymentGatewayFactory.getPaymentGateway(paymentMethod);
    return paymentGateway.createPaymentUrl(paymentInfo);
  }
}

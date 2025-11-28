import { PaymentInfo } from "./payment-info";

export interface PaymentGateway {
  createPaymentUrl(paymentInfo: PaymentInfo): string | Promise<string>;
}

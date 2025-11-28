import { PaymentGateway } from "./payment-gateway.interface";
import { VNPay, ProductCode } from "vnpay";
import { dateFormat } from "vnpay/utils";
import { PaymentInfo } from "./payment-info";
import Big from "big.js";
import { VnpayUtils } from "./vnpay-utils";
import { Injectable } from "@nestjs/common";

@Injectable()
export class VnPayGateway implements PaymentGateway {
  public vnpay: VNPay;

  constructor() {
    this.vnpay = new VNPay({
      tmnCode: "4E4V450V",
      secureSecret: "TMJ57J767277IT23TZGD5EN2PHBFVQQZ",
      vnpayHost: "https://sandbox.vnpayment.vn",

      testMode: true,
    });
  }

  createPaymentUrl(paymentInfo: PaymentInfo): string {
    const { bookingId, ipAddress, returnUrl } = paymentInfo;
    const amount = Number(new Big(paymentInfo.amount).toFixed(1, Big.roundDown));

    return this.vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: ipAddress,
      vnp_ReturnUrl: returnUrl,
      vnp_OrderType: ProductCode.Other,
      vnp_TxnRef: VnpayUtils.generateTxnRef(bookingId),
      vnp_OrderInfo: "Thanh toán đơn hàng",
      vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là thời gian hiện tại
      vnp_ExpireDate: dateFormat(new Date(new Date().getTime() + 5 * 60 * 1000)), // tùy chọn
    });
  }
}

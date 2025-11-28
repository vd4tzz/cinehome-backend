import { Controller, Get, Req } from "@nestjs/common";
import type { Request } from "express";
import { VnpayUtils } from "./vnpay-utils";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PaymentSuccessEvent } from "./payment-success.event";
import { VnPayGateway } from "./vnpay-gateway";
import { ReturnQueryFromVNPay } from "vnpay/types";

@Controller("/api/payment")
export class PaymentController {
  constructor(
    private eventEmitter: EventEmitter2,
    private vnPayGateway: VnPayGateway,
  ) {}

  @Get("vnpay-ipn")
  vnpayCallback(@Req() request: Request) {
    const verifyIpnCallResult = this.vnPayGateway.vnpay.verifyIpnCall(request.query as ReturnQueryFromVNPay);

    if (!verifyIpnCallResult.isVerified) {
      return;
    }

    const txnRef = verifyIpnCallResult.vnp_TxnRef;
    const bookingId = VnpayUtils.getBookingIdFromTxnRef(txnRef);
    this.eventEmitter.emit("payment.success", { bookingId } as PaymentSuccessEvent);
  }
}

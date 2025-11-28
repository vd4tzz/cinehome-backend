export class VnpayUtils {
  static generateTxnRef(bookingId: number) {
    return Date.now().valueOf() + "_" + String(bookingId);
  }

  static getBookingIdFromTxnRef(txnRef: string) {
    return Number(txnRef.split("_")[1]);
  }
}

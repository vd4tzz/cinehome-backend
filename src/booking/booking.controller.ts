import { Body, Controller, Ip, Post, UseGuards } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { AuthUser } from "../auth/auth-user";
import { TicketsAndFoodsBookingRequest } from "./dto/tickets-and-foods-booking-request";
import { PaymentService } from "../payment/payment.service";

@UseGuards(JwtAuthGuard)
@Controller("api/booking")
export class BookingController {
  constructor(
    private bookingService: BookingService,
    private paymentService: PaymentService,
  ) {}

  @Post("tickets")
  async bookingTicketsAndFoods(
    @CurrentUser() user: AuthUser,
    @Body() request: TicketsAndFoodsBookingRequest,
    @Ip() ip: string,
  ) {
    const booking = await this.bookingService.bookingTickets(
      user.userId,
      request.showtimeId,
      request.seatIds,
      request.foodItems,
    );

    const paymentUrl = await this.paymentService.createPaymentUrl(request.paymentMethod, {
      bookingId: booking.bookingId,
      amount: booking.amount,
      ipAddress: ip,
      returnUrl: request.returnUrl,
    });

    return {
      paymentUrl,
    };
  }
}

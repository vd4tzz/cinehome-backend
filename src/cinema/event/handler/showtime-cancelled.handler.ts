import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { ShowtimeCancelledEvent } from "../showtime-cancelled.event";

@Injectable()
export class ShowtimeCancelledHandler {
  constructor() {}

  @OnEvent("showtime.cancelled")
  handleShowtimeCancelled(showtimeCancelledEvent: ShowtimeCancelledEvent) {
    console.log(showtimeCancelledEvent.showtimeId);
  }
}

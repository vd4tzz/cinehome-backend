import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Logger, ParseIntPipe } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { ClientContext } from "./client-context";
import { DataSource } from "typeorm";
import { Showtime } from "../cinema/entity/showtime.entity";
import { SeatService } from "../cinema/seat.service";
import { PriceService } from "../price/price.service";
import { OnEvent } from "@nestjs/event-emitter";

@WebSocketGateway()
export class BookingGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private dataSource: DataSource,
    private seatService: SeatService,
    private priceService: PriceService,
  ) {}

  private logger: Logger = new Logger(BookingGateway.name);

  private clientContextMap: Map<string, ClientContext> = new Map();

  @WebSocketServer()
  private server: Server;

  afterInit() {
    this.logger.log("Websocket server is initialized");
  }

  handleConnection(client: Socket) {
    this.clientContextMap.set(client.id, new ClientContext());
  }

  handleDisconnect(client: Socket) {
    this.clientContextMap.delete(client.id);
  }

  @SubscribeMessage("joinShowtime")
  async handleJoinShowtime(
    @ConnectedSocket() client: Socket,
    @MessageBody("showtimeId", ParseIntPipe) showtimeId: number,
  ) {
    const showtimeRepository = this.dataSource.getRepository(Showtime);
    const showtime = await showtimeRepository.findOneBy({ id: showtimeId });
    if (!showtime) {
      return {
        error: "showtime is not exist",
      };
    }

    const endTime = showtime.endTime;
    const now = new Date();
    if (now > endTime) {
      return {
        error: "showtime is end",
      };
    }

    const ctx = this.clientContextMap.get(client.id);
    if (!ctx) {
      return;
    }

    if (ctx.currentShowtime) {
      await client.leave(ctx.currentShowtime);
    }

    ctx.currentShowtime = String(showtimeId);
    await client.join(ctx.currentShowtime);

    try {
      const seatMap = await this.priceService.getSeatsWithPriceForShowtime(showtimeId);
      return { seatMap };
    } catch (err) {
      console.log(err);
      return { hello: "error" };
    }
  }

  @OnEvent("booking.success")
  handleBookingSuccess(event: any) {
    const { showtimeId, seatIds } = event;

    this.server.to(String(showtimeId)).emit("seatReserved", seatIds);
  }
}

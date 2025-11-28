import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit, SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Logger, ParseIntPipe } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { ClientContext } from "./client-context";
import { DataSource } from "typeorm";
import { Showtime } from "../cinema/entity/showtime.entity";
import { SeatService } from "../cinema/seat.service";

@WebSocketGateway()
export class BookingGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private dataSource: DataSource,
    private seatService: SeatService,
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
  async handleJoinShowtime(@MessageBody("showtimeId", ParseIntPipe) showtimeId: number ) {
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

    const screenId = showtime.screenId;
    const seatMap = await this.seatService.getSeatMap(screenId);
    return { seatMap };
  }
}

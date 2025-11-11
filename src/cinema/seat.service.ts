import { BadRequestException, Injectable, NotFoundException, OnApplicationBootstrap } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CreateSeatMapRequest } from "./dto/create-seat-map-request";
import { Screen } from "./entity/screen.entity";
import { SeatType, SeatTypeCode } from "./entity/seat-type.entity";
import { Seat } from "./entity/seat.entity";
import { CreateSeatMapResponse } from "./dto/create-seat-map-response";
import { GetSeatMapResponse } from "./dto/get-seat-map-response";

@Injectable()
export class SeatService implements OnApplicationBootstrap {
  private SINGLE_SEAT_TYPE: SeatType;
  private COUPLE_SEAT_TYPE: SeatType;

  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    const seatTypeRepository = this.dataSource.getRepository(SeatType);

    const singleSeatType = await seatTypeRepository.findOneBy({ code: SeatTypeCode.SINGLE });
    if (!singleSeatType) {
      throw new Error();
    }
    this.SINGLE_SEAT_TYPE = singleSeatType;

    const coupleSeatType = await seatTypeRepository.findOneBy({ code: SeatTypeCode.COUPLE });
    if (!coupleSeatType) {
      throw new Error();
    }
    this.COUPLE_SEAT_TYPE = coupleSeatType;
  }

  async createSeatMap(screenId: number, request: CreateSeatMapRequest) {
    return await this.dataSource.transaction(async (manager) => {
      const screenRepository = manager.getRepository(Screen);
      const seatRepository = manager.getRepository(Seat);

      const screen = await screenRepository.findOneBy({ id: screenId });
      if (!screen) {
        throw new NotFoundException();
      }

      const { seatMap } = request;

      const seats = seatMap.map((seat) => {
        const { row, label, columnOrder, seatType } = seat;
        return {
          screen,
          row,
          label,
          columnOrder,
          type: this.getSeatType(seatType),
        } as Seat;
      });

      const previousSeatMap = await seatRepository.findBy({ screen: { id: screenId } });
      if (previousSeatMap.length !== 0) {
        await seatRepository.delete(previousSeatMap);
      }

      await seatRepository.save(seats);

      const dtos = seats.map((seat) => ({
        id: seat.id,
        row: seat.row,
        label: seat.label,
        columnOrder: seat.columnOrder,
        seatType: seat.type.code,
      }));

      return new CreateSeatMapResponse({
        seatMap: dtos,
      });
    });
  }

  async getSeatMap(screenId: number) {
    const seatRepository = this.dataSource.getRepository(Seat);
    const seats = await seatRepository.find({
      where: { screen: { id: screenId } },
      relations: {
        type: true,
      },
    });

    const dtos = seats.map((seat) => ({
      id: seat.id,
      row: seat.row,
      label: seat.label,
      columnOrder: seat.columnOrder,
      seatType: seat.type.code,
    }));

    return new GetSeatMapResponse({
      seatMap: dtos,
    });
  }

  private getSeatType(seatTypeCode: SeatTypeCode) {
    if (seatTypeCode === this.SINGLE_SEAT_TYPE.code) {
      return this.SINGLE_SEAT_TYPE;
    } else if (seatTypeCode === this.COUPLE_SEAT_TYPE.code) {
      return this.COUPLE_SEAT_TYPE;
    }

    throw new BadRequestException();
  }
}

import { SeatTypeCode } from "../entity/seat-type.entity";

export class ScreenDto {
  screenId: number;
  row: string;
  label: string;
  columnOrder: number;
  seatType: SeatTypeCode;
}

export class CreateSeatMapOfScreenRequest {
  seatMap: ScreenDto[];
}

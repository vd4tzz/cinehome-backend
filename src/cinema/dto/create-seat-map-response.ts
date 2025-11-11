import { ApiProperty } from "@nestjs/swagger";
import { SeatTypeCode } from "../entity/seat-type.entity";

export class SeatDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  row: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  columnOrder: number;

  @ApiProperty({ enum: SeatTypeCode })
  seatType: SeatTypeCode;
}

export class CreateSeatMapResponse {
  @ApiProperty({ type: [SeatDto] })
  seatMap: SeatDto[];

  constructor(partial: Partial<CreateSeatMapResponse>) {
    Object.assign(this, partial);
  }
}

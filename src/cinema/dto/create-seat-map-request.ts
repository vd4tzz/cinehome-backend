import { ApiProperty } from "@nestjs/swagger";
import { SeatTypeCode } from "../entity/seat-type.entity";

export class SeatDto {
  @ApiProperty({
    example: "A",
    description: "Row identifier of the seat",
  })
  row: string;

  @ApiProperty({
    example: "A1",
    description: "Seat label displayed to users",
  })
  label: string;

  @ApiProperty({
    example: 1,
    description: "Column order of the seat within the row",
  })
  columnOrder: number;

  @ApiProperty({
    example: SeatTypeCode.SINGLE,
    enum: SeatTypeCode,
    description: "Type of the seat (e.g., NORMAL, VIP, SWEETBOX, etc.)",
  })
  seatType: SeatTypeCode;
}

export class CreateSeatMapRequest {
  @ApiProperty({
    type: [SeatDto],
    description: "List of seats to be created for the screen",
  })
  seatMap: SeatDto[];
}

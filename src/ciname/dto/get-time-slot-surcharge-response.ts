import { ApiProperty } from "@nestjs/swagger";

export class GetTimeSlotSurchargeResponse {
  @ApiProperty()
  cinemaId: number;

  @ApiProperty()
  timeSlotId: number;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty()
  surcharge: string;
}

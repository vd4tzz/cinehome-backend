import { ApiProperty } from "@nestjs/swagger";

export class GetSeatTypeSurchargeResponse {
  @ApiProperty()
  cinemaId: number;

  @ApiProperty()
  seatTypeId: number;

  @ApiProperty()
  seatTypeCode: string;

  @ApiProperty()
  surcharge: string;
}

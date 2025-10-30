import { ApiProperty } from "@nestjs/swagger";

export class GetDayTypeSurchargeResponse {
  @ApiProperty()
  cinemaId: number;

  @ApiProperty()
  dayTypeId: number;

  @ApiProperty()
  dayTypeCode: string;

  @ApiProperty()
  surcharge: string;
}

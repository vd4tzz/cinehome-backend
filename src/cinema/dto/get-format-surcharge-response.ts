import { ApiProperty } from "@nestjs/swagger";

export class GetFormatSurchargeResponse {
  @ApiProperty()
  cinemaId: number;

  @ApiProperty()
  formatId: number;

  @ApiProperty()
  formatCode: string;

  @ApiProperty()
  surcharge: string;
}

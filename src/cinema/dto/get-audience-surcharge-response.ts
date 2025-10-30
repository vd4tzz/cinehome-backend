import { ApiProperty } from "@nestjs/swagger";

export class GetAudienceSurchargeResponse {
  @ApiProperty()
  cinemaId: number;

  @ApiProperty()
  audienceId: number;

  @ApiProperty()
  audienceType: string;

  @ApiProperty()
  surcharge: string;
}

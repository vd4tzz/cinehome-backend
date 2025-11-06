import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SeatTypeSurchargeDto {
  @ApiProperty()
  @IsNumber()
  cinemaId: number;

  @ApiProperty()
  @IsNumber()
  seatTypeId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  seatTypeCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  surcharge: string;
}

export class GetSeatTypeSurchargeResponse {
  seatTypeSurcharges: SeatTypeSurchargeDto[];
}

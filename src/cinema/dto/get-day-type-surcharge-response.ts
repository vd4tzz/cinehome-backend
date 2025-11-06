import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DayTypeSurchargeDto {
  @ApiProperty()
  @IsNumber()
  cinemaId: number;

  @ApiProperty()
  @IsNumber()
  dayTypeId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dayTypeCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  surcharge: string;
}

export class GetDayTypeSurchargeResponse {
  dayTypeSurcharges: DayTypeSurchargeDto[];
}

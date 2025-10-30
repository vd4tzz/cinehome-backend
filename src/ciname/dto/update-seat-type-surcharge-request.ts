import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsNotEmpty, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

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

export class UpdateSeatTypeSurchargeRequest {
  @ApiProperty({ type: [SeatTypeSurchargeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatTypeSurchargeDto)
  seatTypeSurcharges: SeatTypeSurchargeDto[];
}

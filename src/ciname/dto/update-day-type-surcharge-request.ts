import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsNotEmpty, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

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

export class UpdateDayTypeSurchargeRequest {
  @ApiProperty({ type: [DayTypeSurchargeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayTypeSurchargeDto)
  dayTypeSurcharges: DayTypeSurchargeDto[];
}

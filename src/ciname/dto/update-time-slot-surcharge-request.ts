import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsNotEmpty, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class TimeSlotSurchargeDto {
  @ApiProperty()
  @IsNumber()
  cinemaId: number;

  @ApiProperty()
  @IsNumber()
  timeSlotId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  timeSlotCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  surcharge: string;
}

export class UpdateTimeSlotSurchargeRequest {
  @ApiProperty({ type: [TimeSlotSurchargeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotSurchargeDto)
  timeSlotSurcharges: TimeSlotSurchargeDto[];
}

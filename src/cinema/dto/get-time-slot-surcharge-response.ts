import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TimeSlotSurchargeDto {
  @ApiProperty()
  @IsNumber()
  cinemaId: number;

  @ApiProperty()
  @IsNumber()
  timeSlotId: number;

  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // timeSlotCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  surcharge: string;
}

export class GetTimeSlotSurchargeResponse {
  timeSlotSurcharges: TimeSlotSurchargeDto[];
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class FormatSurchargeDto {
  @ApiProperty()
  @IsNumber()
  cinemaId: number;

  @ApiProperty()
  @IsNumber()
  formatId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  formatCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  surcharge: string;
}

export class GetFormatSurchargeResponse {
  formatSurcharges: FormatSurchargeDto[];
}

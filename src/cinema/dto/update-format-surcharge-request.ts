import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsNotEmpty, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

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

export class UpdateFormatSurchargeRequest {
  @ApiProperty({ type: [FormatSurchargeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormatSurchargeDto)
  formatSurcharges: FormatSurchargeDto[];
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsNotEmpty, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class AudienceSurchargeDto {
  @ApiProperty()
  @IsNumber()
  cinemaId: number;

  @ApiProperty()
  @IsNumber()
  audienceId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  audienceType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  surcharge: string;
}

export class UpdateAudienceSurchargeRequest {
  @ApiProperty({ type: [AudienceSurchargeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AudienceSurchargeDto)
  audienceSurcharges: AudienceSurchargeDto[];
}

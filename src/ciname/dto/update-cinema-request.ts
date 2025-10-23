import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCinemaRequest {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  street: string;

  @IsNotEmpty()
  @ApiProperty()
  province: string;
}

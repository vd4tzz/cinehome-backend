import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateMovieInfoRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  vietnameseTitle: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  originalTitle?: string;

  @IsString()
  @ApiProperty()
  overview: string;

  @IsString()
  @ApiProperty()
  country: string;

  @IsNumber()
  @ApiProperty()
  duration: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  releaseDate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  ageRating: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  director: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty()
  actors: string[];

  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @ApiProperty()
  genreIds: number[];
}

import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsDateString, ArrayMinSize } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMovieRequest {
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
  // @IsNotEmpty()
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
  releaseDate: string; // Ví dụ: "2025-12-25"

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  ageRating: string; // Ví dụ: "P", "C13", "C16", "C18"

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
  @ArrayMinSize(1) // Ít nhất phải có 1 thể loại
  @IsNumber({}, { each: true }) // Đảm bảo mọi phần tử là number (id)
  @ApiProperty()
  genreIds: number[];
}

import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsDateString, ArrayMinSize } from "class-validator";

export class CreateMovieRequest {
  @IsString()
  @IsNotEmpty()
  vietnameseTitle: string;

  @IsString()
  @IsOptional()
  originalTitle?: string;

  @IsString()
  // @IsNotEmpty()
  overview: string;

  // @IsString()
  // @IsNotEmpty()
  // posterUrl: string;

  // @IsString()
  // @IsNotEmpty()
  // backdropUrl: string;

  @IsNumber()
  duration: number;

  @IsDateString()
  @IsNotEmpty()
  releaseDate: string; // Ví dụ: "2025-12-25"

  @IsString()
  @IsNotEmpty()
  ageRating: string; // Ví dụ: "P", "C13", "C16", "C18"

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  actors: string[];

  @IsArray()
  @ArrayMinSize(1) // Ít nhất phải có 1 thể loại
  @IsNumber({}, { each: true }) // Đảm bảo mọi phần tử là number (id)
  genreIds: number[];
}

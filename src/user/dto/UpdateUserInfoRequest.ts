import { IsString, IsDateString, Length } from "class-validator";

export class UpdateUserInfoRequest {
  @IsString()
  @Length(1, 255)
  fullName: string;

  @IsDateString()
  dateOfBirth: string; // lưu dưới dạng string ISO "YYYY-MM-DD"

  @IsString()
  @Length(5, 20)
  phoneNumber: string;
}

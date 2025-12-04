import { IsInt, Min, IsArray, ArrayNotEmpty, ArrayUnique, ValidateNested, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { PaymentMethod } from "../../payment/payment-method";

export class FoodItem {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  id: number;

  @ApiProperty({
    description: "Số lượng món ăn",
    example: 2,
    minimum: 1,
    type: Number,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}

export class TicketsAndFoodsBookingRequest {
  @ApiProperty({
    description: "ID của suất chiếu",
    example: 123,
    minimum: 1,
    type: Number,
  })
  @IsInt({ message: "showtimeId phải là số nguyên" })
  @Min(1, { message: "showtimeId phải lớn hơn 0" })
  showtimeId: number;

  @ApiProperty({
    description: "Danh sách ID các ghế muốn đặt",
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray({ message: "seatIds phải là mảng" })
  @ArrayNotEmpty({ message: "seatIds không được để trống" })
  @ArrayUnique({ message: "seatIds không được trùng nhau" })
  @IsInt({ each: true, message: "Mỗi seatId phải là số nguyên" })
  @Type(() => Number)
  seatIds: number[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FoodItem)
  foodItems: FoodItem[] = [];

  @ApiProperty()
  paymentMethod: PaymentMethod;

  @ApiProperty()
  returnUrl: string;
}

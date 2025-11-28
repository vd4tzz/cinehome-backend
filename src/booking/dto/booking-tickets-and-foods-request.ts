import { IsInt, Min, IsArray, ArrayNotEmpty, ArrayUnique } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { PaymentMethod } from "../../payment/payment-method";

export class BookingTicketsAndFoodsRequest {
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
  paymentMethod: PaymentMethod;

  @ApiProperty()
  returnUrl: string;
}

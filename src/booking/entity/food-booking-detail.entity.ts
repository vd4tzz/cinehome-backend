import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Food } from "./food.entity";
import { Booking } from "./booking.entity";

@Entity()
export class FoodBookingDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Food)
  food: Food;

  @ManyToOne(() => Booking, (booking) => booking.foodBookingDetails)
  booking: Booking;

  @Column()
  quantity: number;

  constructor(partial: Partial<FoodBookingDetail>) {
    Object.assign(this, partial);
  }
}

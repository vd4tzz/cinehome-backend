import{ IsUUID, IsString, Length, IsOptional} from 'class-validator';

export class CreateBookingDto {
    @IsUUID() holdId: string;
    @IsString() @Length(16,128) idempotencyKey: string;
    @IsOptional() @IsString() paymentMethod?: string;//'vnpay' | 'momo' ...
    @IsOptional() @IsString() couponCode?: string;//'BLACKFRIDAY' | 'NEWYEAR' ...

}
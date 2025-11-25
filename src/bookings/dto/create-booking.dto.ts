import { IsUUID, IsString, Length, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateConcessionItemDto } from './create-concession-item.dto';

export class CreateBookingDto {
    @ApiProperty({
        description: 'ID của hold đã tạo trước đó',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid'
    })
    @IsUUID() 
    holdId: string;
    
    @ApiProperty({
        description: 'Key để đảm bảo idempotency (16-128 ký tự)',
        example: 'booking_1234567890abcdef',
        minLength: 16,
        maxLength: 128
    })
    @IsString() 
    @Length(16, 128) 
    idempotencyKey: string;
    
    @ApiPropertyOptional({
        description: 'Phương thức thanh toán (tương lai sẽ dùng)',
        example: 'vnpay',
        enum: ['vnpay', 'momo', 'mock']
    })
    @IsOptional() 
    @IsString() 
    paymentMethod?: string;
    
    @ApiPropertyOptional({
        description: 'Mã giảm giá (tương lai sẽ dùng)',
        example: 'BLACKFRIDAY'
    })
    @IsOptional() 
    @IsString() 
    couponCode?: string;

    @ApiPropertyOptional({
        description: 'Danh sách bắp nước muốn đặt (tự động tính vào tổng tiền)',
        type: [CreateConcessionItemDto],
        example: [
            { concessionId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', quantity: 2 },
            { concessionId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', quantity: 1 }
        ]
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateConcessionItemDto)
    concessions?: CreateConcessionItemDto[];
}
import { IsUUID, IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InitiatePaymentDto {
  @ApiProperty({
    description: 'ID của booking cần thanh toán',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid'
  })
  @IsUUID() 
  bookingId: string;
  
  @ApiProperty({
    description: 'Key để đảm bảo idempotency (16-128 ký tự)',
    example: 'payment_1234567890abcdef',
    minLength: 16,
    maxLength: 128
  })
  @IsString() 
  @Length(16, 128) 
  idempotencyKey: string;
  
  @ApiPropertyOptional({
    description: 'Nhà cung cấp thanh toán',
    example: 'mock',
    default: 'mock',
    enum: ['mock', 'vnpay', 'momo']
  })
  @IsOptional() 
  provider?: string;
  
  @ApiPropertyOptional({
    description: 'URL trở về sau khi thanh toán xong',
    example: 'http://localhost:3000/booking/success'
  })
  @IsOptional() 
  returnUrl?: string;
}

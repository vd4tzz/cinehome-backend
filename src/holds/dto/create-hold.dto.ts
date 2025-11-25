import { IsUUID, IsArray, ArrayNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHoldDto {
    @ApiProperty({
        description: 'ID của suất chiếu',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid'
    })
    @IsUUID() 
    showId: string;
    
    @ApiProperty({
        description: 'Danh sách ID của các ghế muốn giữ',
        example: ['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'],
        type: [String],
        isArray: true
    })
    @IsArray() 
    @ArrayNotEmpty() 
    seatIds: string[];
    
    @ApiProperty({
        description: 'Key để đảm bảo idempotency (client tự generate, 16-128 ký tự)',
        example: 'hold_1234567890abcdef',
        minLength: 16,
        maxLength: 128
    })
    @IsString() 
    @Length(16, 128) 
    idempotencyKey: string;
}
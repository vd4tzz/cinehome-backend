import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min } from 'class-validator';

export class CreateConcessionItemDto {
  @ApiProperty({
    description: 'ID của concession (bắp nước, combo)',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    format: 'uuid',
  })
  @IsUUID()
  concessionId: string;

  @ApiProperty({
    description: 'Số lượng',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token hợp lệ để cấp lại access token',
  })
  @IsString()
  @Length(20, 1000)
  refreshToken: string;
}

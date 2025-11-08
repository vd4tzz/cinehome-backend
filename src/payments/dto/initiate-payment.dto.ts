import { IsUUID, IsString, Length, IsOptional } from 'class-validator';

export class InitiatePaymentDto {
  @IsUUID() bookingId: string;
  @IsString() @Length(16, 128) idempotencyKey: string;
  @IsOptional() provider?: string; // 'mock'
  @IsOptional() returnUrl?: string;
}

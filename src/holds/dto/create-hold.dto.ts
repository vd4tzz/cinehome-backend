import{IsUUID, IsArray, ArrayNotEmpty, IsString, Length}  from 'class-validator';

export class CreateHoldDto{
    @IsUUID() showId: string;
    @IsArray() @ArrayNotEmpty() seatIds: string[];
    @IsString() @Length(16,128) idempotencyKey: string; //client-generated unique key

}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowSeat } from '../shows/entities/show-seat.entity';
import { HoldsService } from './holds.service';
import { HoldsController } from './holds.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ShowSeat])],
  providers: [HoldsService],
  controllers: [HoldsController],
  exports: [HoldsService],
})
export class HoldsModule {}

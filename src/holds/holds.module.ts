import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowSeat } from '../shows/entities/show-seat.entity';
import { HoldsService } from './holds.service';
import { HoldsController } from './holds.controller';
import { HoldsCleanupService } from './holds-cleanup.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShowSeat])],
  providers: [HoldsService, HoldsCleanupService],
  controllers: [HoldsController],
  exports: [HoldsService],
})
export class HoldsModule {}

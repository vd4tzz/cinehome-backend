import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { ShowSeat } from './entities/show-seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show, ShowSeat])],
  exports: [TypeOrmModule],
})
export class ShowsModule {}

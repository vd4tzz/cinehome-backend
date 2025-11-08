import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theater } from './entities/theater.entity';
import { Auditorium } from './entities/auditorium.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Theater, Auditorium])],
  exports: [TypeOrmModule],
})
export class TheatersModule {}


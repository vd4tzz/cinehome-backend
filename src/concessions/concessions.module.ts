import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concession } from './entities/concession.entity';
import { ConcessionItem } from './entities/concession-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Concession, ConcessionItem])],
  exports: [TypeOrmModule],
})
export class ConcessionsModule {}

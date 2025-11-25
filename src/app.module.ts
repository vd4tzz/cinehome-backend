import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';
import {AuthModule} from './auth/auth.module';

import { HoldsModule } from './holds/holds.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { SeatsModule } from './seats/seats.module';
import { ShowsModule } from './shows/shows.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { TheatersModule } from './theaters/theaters.module';
import { ConcessionsModule } from './concessions/concessions.module';

@Module({
  imports:[
  ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
      PORT: Joi.number().default(3000),
      DB_HOST: Joi.string().required(),
      DB_PORT: Joi.number().default(5432),
      DB_USER: Joi.string().required(),
      DB_PASS: Joi.string().required(),
      DB_NAME: Joi.string().required(),
      JWT_ACCESS_SECRET: Joi.string().min(32).required(),
      JWT_REFRESH_SECRET: Joi.string().min(32).required(),
      JWT_ACCESS_EXPIRATION: Joi.string().default('900s'),
      JWT_REFRESH_EXPIRATION: Joi.string().default('604800s'),
    }),
  }),
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (cfg: ConfigService) => ({
      type: 'postgres',
      host: cfg.get<string>('DB_HOST'),
      port: cfg.get<number>('DB_PORT'),
      username: cfg.get<string>('DB_USER'),
      password: cfg.get<string>('DB_PASS'),
      database: cfg.get<string>('DB_NAME'),
      autoLoadEntities: true,
      synchronize: cfg.get<string>('NODE_ENV') === 'development', // Only in dev, use migrations in prod
      logging: ['error'],
    }),
    
  }),
  // Cache configuration with in-memory store (no Redis needed)
  CacheModule.register({
    isGlobal: true,
    ttl: 300000, // 5 minutes default TTL in milliseconds
    max: 1000, // Max items in cache
  }),
  // Rate limiting to prevent brute force and DDoS
  ThrottlerModule.forRoot([{
    ttl: 60000, // 60 seconds
    limit: 100, // 100 requests per minute for general API
  }]),
  // Schedule module for cron jobs
  ScheduleModule.forRoot(),

  UsersModule,
  AuthModule,
    SeatsModule,
    ShowsModule,
    MoviesModule,
    TheatersModule,
    HoldsModule,
    BookingsModule,
    PaymentsModule,
    ConcessionsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Apply rate limiting globally
    },
  ],
})
export class AppModule {}

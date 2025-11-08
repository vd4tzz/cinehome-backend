import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import {AuthModule} from './auth/auth.module';

import { HoldsModule } from './holds/holds.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { SeatsModule } from './seats/seats.module';
import { ShowsModule } from './shows/shows.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { TheatersModule } from './theaters/theaters.module';

@Module({
  imports:[
  ConfigModule.forRoot({isGlobal: true}),
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
      synchronize: true, // chỉ dùng dev.prod dùng migration
      logging: ['error'],
    }),
    
  }),

  UsersModule,
  AuthModule,
    SeatsModule,
    ShowsModule,
    MoviesModule,
    TheatersModule,
    HoldsModule,
    BookingsModule,
    PaymentsModule,
  ],
})
export class AppModule {}

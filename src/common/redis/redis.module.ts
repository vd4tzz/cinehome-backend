// redis.module.ts
import { Module, Global } from "@nestjs/common";
import Redis from "ioredis";

@Global()
@Module({
  providers: [
    {
      provide: Redis,
      useFactory: () => {
        return new Redis(
          "rediss://default:ATTtAAIncDIyZDdjMWZkZDdkYWI0OWQ1OGQ2MmQ0YjE1MzIzN2ZiOHAyMTM1NDk@sharp-rattler-13549.upstash.io:6379",
        );
      },
    },
  ],
  exports: [Redis],
})
export class RedisModule {}

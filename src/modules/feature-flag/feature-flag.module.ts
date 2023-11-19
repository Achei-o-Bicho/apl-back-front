import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { FeatureFlagService } from './feature-flag.service';
import { FeatureFlagController } from './feature-flag.controller';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),
  ],
  providers: [FeatureFlagService],
  exports: [FeatureFlagService],
  controllers: [FeatureFlagController],
})
export class FeatureFlagModule {}

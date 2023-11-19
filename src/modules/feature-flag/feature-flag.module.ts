import { Module } from '@nestjs/common';
import { FeatureFlagService } from './feature-flag.service';
import { FeatureFlagController } from './feature-flag.controller';

@Module({
  imports: [],
  providers: [FeatureFlagService],
  exports: [FeatureFlagService],
  controllers: [FeatureFlagController],
})
export class FeatureFlagModule {}

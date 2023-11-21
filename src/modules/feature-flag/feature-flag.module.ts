import { Module } from '@nestjs/common';
import { FeatureFlagService } from './feature-flag.service';
import { FeatureFlagController } from './feature-flag.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [FeatureFlagService],
  exports: [FeatureFlagService],
  controllers: [FeatureFlagController],
})
export class FeatureFlagModule {}

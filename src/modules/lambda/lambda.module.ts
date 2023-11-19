import { Module } from '@nestjs/common';
import { LambdaService } from './lambda.service';
import { HttpModule } from '@nestjs/axios';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';

@Module({
  imports: [HttpModule, FeatureFlagModule],
  exports: [LambdaService],
  providers: [LambdaService],
})
export class LambdaModule {}

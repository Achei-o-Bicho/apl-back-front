import { Module } from '@nestjs/common';
import { ClassificationImageService } from './classification-image.service';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';

@Module({
  imports: [FeatureFlagModule],
  providers: [
    ClassificationImageService,
    {
      provide: 'MODEL_PATH',
      useValue: './src/modules/classification-image/model/model.json',
    },
  ],
  exports: [ClassificationImageService],
})
export class ClassificationImageModule {}

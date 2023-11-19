import { Module } from '@nestjs/common';
import { ClassificationImageService } from './classification-image.service';

@Module({
  providers: [
    ClassificationImageService,
    {
      provide: 'MODEL_PATH',
      useValue: './src/modules/classificationImage/model/model.json',
    },
  ],
  exports: [ClassificationImageService],
})
export class ClassificationImageModule {}

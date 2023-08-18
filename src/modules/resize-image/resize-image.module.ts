import { Module } from '@nestjs/common';
import { ImageResizeService } from './resize-image.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ImageResizeService],
  exports: [ImageResizeService],
})
export class ResizeImageModule {}

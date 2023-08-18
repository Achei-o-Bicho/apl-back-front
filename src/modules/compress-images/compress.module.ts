import { Module } from '@nestjs/common';
import { Base64CompressionService } from './compress.service';

@Module({
  imports: [],
  controllers: [],
  providers: [Base64CompressionService],
  exports: [Base64CompressionService],
})
export class CompressImagesModule {}

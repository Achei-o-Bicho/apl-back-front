import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImageResizeService {
  async resizeImage(inputBuffer: Buffer): Promise<Buffer> {
    const resizedImageBuffer = await sharp(inputBuffer)
      .resize(500, 500)
      .toBuffer();
    return resizedImageBuffer;
  }
}

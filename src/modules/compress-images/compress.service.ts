import { Injectable } from '@nestjs/common';
import * as zlib from 'zlib';

@Injectable()
export class Base64CompressionService {
  compressBase64(base64String: string): string {
    const buffer = Buffer.from(base64String, 'base64');
    const compressedBuffer = zlib.deflateSync(buffer);
    const compressedBase64 = compressedBuffer.toString('base64');
    return compressedBase64;
  }

  decompressBase64(compressedBase64: string): string {
    const compressedBuffer = Buffer.from(compressedBase64, 'base64');
    const decompressedBuffer = zlib.inflateSync(compressedBuffer);
    const originalBase64 = decompressedBuffer.toString('base64');
    return originalBase64;
  }
}

import { Injectable, Logger } from "@nestjs/common";
import * as brotli from "brotli";

@Injectable()
export class Base64CompressionService {
  private readonly logger = new Logger(Base64CompressionService.name);

  compressBase64(base64String: string): string {
    try {
      const buffer = Buffer.from(base64String, 'base64');
      const compressedBuffer = brotli.compress(buffer);

      if (compressedBuffer) {
        return compressedBuffer.toString('base64');
      } else {
        this.logger.error('Compression failed');
        return base64String;
      }
    } catch (err) {
      this.logger.error(err);
      return base64String;
    }
  }

  decompressBase64(compressedBase64: string): string {
    try {
      const compressedBuffer = Buffer.from(compressedBase64, 'base64');
      const decompressedBuffer = brotli.decompress(compressedBuffer);
      const originalBase64 = decompressedBuffer.toString('base64');
      return originalBase64;
    } catch (err) {
      this.logger.error(err);
    }
  }
}

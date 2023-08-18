import { Injectable, Logger } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';

@Injectable()
export class AwsService {
  private readonly logger = new Logger(AwsService.name);

  constructor(@InjectAwsService(S3) private readonly s3: S3) {}

  async uploadFile(fileBuffer: Buffer, fileName: string, contentType: string) {
    try {
      const params = {
        Bucket: process.env.BUCKET_S3,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
      };

      this.logger.log('Saving file in aws...');

      return this.s3.upload(params).promise();
    } catch (err) {
      this.logger.error(err);
    }
  }
}

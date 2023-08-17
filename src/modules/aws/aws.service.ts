import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';

@Injectable()
export class AwsService {
  constructor(@InjectAwsService(S3) private readonly s3: S3) {}

  async uploadFile(fileBuffer: Buffer, fileName: string, contentType: string) {
    try {
      const params = {
        Bucket: process.env.BUCKET_S3,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
      };

      return this.s3.upload(params).promise();
    } catch (err) {}
  }
}

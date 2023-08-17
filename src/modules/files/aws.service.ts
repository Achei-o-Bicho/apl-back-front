import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  private s3 = new AWS.S3();

  async uploadFile(fileBuffer: Buffer, fileName: string, contentType: string) {
    const params = {
      Bucket: process.env.BUCKET_S3, // Substitua pelo nome do seu bucket na AWS
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    };

    return this.s3.upload(params).promise();
  }
}

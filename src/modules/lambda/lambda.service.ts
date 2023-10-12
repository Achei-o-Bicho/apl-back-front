import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class LambdaService {
  private logger = new Logger(LambdaService.name);
  constructor(private httpService: HttpService) {}

  async sendImageToGoogleFunction(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<ISaveImageGoogleCloudFunction> {
    try {
      const url =
        'https://us-central1-projeto-dog-extract.cloudfunctions.net/uploadImagePetMongoDbfFunction';

      const data = {
        fileName,
        buffer: fileBuffer.toString('base64'),
        contentType,
      };

      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN_CLOUD_FUNCTION}`,
        },
      };

      this.logger.log('Sending data to cloud function');

      const response = await this.httpService
        .post(url, data, config)
        .toPromise();

      if (response.status !== 200) {
        this.logger.error('Error to send data for Cloud Function');
      }

      return response.data as ISaveImageGoogleCloudFunction;
    } catch (error) {
      this.logger.error(error);
    }
  }
}

export interface ISaveImageGoogleCloudFunction {
  location: string;
}

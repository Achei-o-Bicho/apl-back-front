import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { FeatureFlagService } from '../feature-flag/feature-flag.service';

@Injectable()
export class LambdaService {
  private logger = new Logger(LambdaService.name);
  constructor(
    private httpService: HttpService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  async sendImageToGoogleFunction(
    fileBuffer: Buffer | string,
    fileName: string,
    contentType: string,
  ): Promise<ISaveImageGoogleCloudFunction> {
    try {
      const sendImageIsEnabled = (
        await this.featureFlagService.get('SEND_IMAGE_LAMBDA')
      ).isEnabled;

      if (!sendImageIsEnabled) {
        this.logger.warn('Flag send image is lambda is not enabled');
        return null;
      }

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

      const response = await lastValueFrom(
        this.httpService.post(url, data, config).pipe(
          map((resp) => resp),
          catchError((error: AxiosError) => {
            console.error('Erro na requisição HTTP:', error);

            throw new HttpException('Erro na requisição HTTP', error.status);
          }),
        ),
      );

      return response.data as ISaveImageGoogleCloudFunction;
    } catch (error) {
      this.logger.error(error);
    }
  }
}

export interface ISaveImageGoogleCloudFunction {
  location: string;
  message: string;
}

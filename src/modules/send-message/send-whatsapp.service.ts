import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class SendWhatsappService {
  private readonly logger = new Logger(SendWhatsappService.name);

  constructor(private readonly httpService: HttpService) {}

  async sendSMS(phoneNumber: string, otpToken: string): Promise<void> {
    try {
      this.logger.debug(`Sending message at phone number: ${phoneNumber}`);

      const data = {
        token: process.env.TOKEN_API_MSG,
        to: phoneNumber,
        body: `O seu código de verificação achei o bicho é: *${otpToken}*`,
      };

      const axiosRequest: AxiosRequestConfig = {
        url: `https:/api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
      };

      const response: AxiosResponse<{
        sent: boolean;
        message: string;
        id: number;
      }> = await this.httpService.request(axiosRequest).toPromise();

      if (!response.status || response.status !== 200) {
        throw new HttpException(
          {
            status: response.status,
            error: response.data,
          },
          response.status,
        );
      }
      this.logger.debug('Message sent successfully');
    } catch (error) {
      this.logger.error(
        `Failed to send message at phone number ${phoneNumber}`,
      );
      throw new Error(`Failed to send message at phone number ${phoneNumber}`);
    }
  }
}

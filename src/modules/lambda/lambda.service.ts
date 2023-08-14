import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LambdaService {
  private logger = new Logger(LambdaService.name);
  constructor(private httpService: HttpService) {}
}

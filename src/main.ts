import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('apl-back-front/v1');

  app.enableCors();
  await app.listen(process.env.PORT);
  new Logger('NestApplication').log('Running app at port: ' + process.env.PORT);
}
bootstrap();

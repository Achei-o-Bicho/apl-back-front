import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('BFF do Projeto Achei o Bicho')
    .setDescription('Serviço para gerenciamento de usuários e pets')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  app.setGlobalPrefix(process.env.GLOBAL_PATH);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();
  await app.listen(process.env.PORT);
  new Logger('NestApplication').log('Running app at port: ' + process.env.PORT);
}
bootstrap();

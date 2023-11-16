import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PetsModule } from './modules/pets/pet.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from './logger.middleware';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SendMessageModule } from './modules/send-message/send-message.module';
import { AwsModule } from './modules/aws/aws.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { Credentials, S3 } from 'aws-sdk';
import { ResizeImageModule } from './modules/resize-image/resize-image.module';
import { RecognizePeModule } from './modules/recognize/recognize-pet.module';
import { ChatsModule } from './modules/chat/chat.module';

@Module({
  imports: [
    PetsModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
    UsersModule,
    AuthModule,
    SendMessageModule,
    ResizeImageModule,
    RecognizePeModule,
    AwsModule,
    ChatsModule,
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        region: process.env.REGION_AWS,
        credentials: new Credentials({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          sessionToken: process.env.AWS_SESSION_TOKEN,
        }),
      },
      services: [S3],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

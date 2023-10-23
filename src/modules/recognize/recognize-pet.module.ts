import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RecognizePet,
  RecognizePetSchema,
} from './schema/recognize-pet.schema';
import { RecognizePetController } from './recognize-pet.controller';
import { RecognizePetService } from './recognize-pet.service';
import { LambdaModule } from '../lambda/lambda.module';
import { JwtModule } from '@nestjs/jwt';
import { ResizeImageModule } from '../resize-image/resize-image.module';
import { PetsModule } from '../pets/pet.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PetsModule,
    JwtModule,
    LambdaModule,
    ResizeImageModule,
    MongooseModule.forFeature([
      {
        name: RecognizePet.name,
        schema: RecognizePetSchema,
        collection: 'RECOGNIZE_PET',
      },
    ]),
  ],
  controllers: [RecognizePetController],
  providers: [RecognizePetService],
})
export class RecognizePeModule {}

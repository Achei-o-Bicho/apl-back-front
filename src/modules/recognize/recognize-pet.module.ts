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

@Module({
  imports: [
    JwtModule,
    LambdaModule,
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

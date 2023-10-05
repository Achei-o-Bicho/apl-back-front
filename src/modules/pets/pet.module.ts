import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pet, PetSchema } from './pet.schema';
import { PetsController } from './pets.controller';
import { PetsService } from './pet.service';
import { PetRepository } from './repositories/pet.repository';
import { PetRepositoryService } from './repositories/pet.repository.service';
import { AwsModule } from '../aws/aws.module';
import { UsersModule } from '../users/users.module';
import { ResizeImageModule } from '../resize-image/resize-image.module';
import { JwtModule } from '@nestjs/jwt';
import { LambdaModule } from '../lambda/lambda.module';

@Module({
  imports: [
    JwtModule,
    UsersModule,
    AwsModule,
    ResizeImageModule,
    LambdaModule,
    MongooseModule.forFeature([
      { name: Pet.name, schema: PetSchema, collection: 'COLLECTION_PET' },
    ]),
  ],
  controllers: [PetsController],
  providers: [
    PetsService,
    {
      provide: PetRepository,
      useClass: PetRepositoryService,
    },
  ],
})
export class PetsModule {}

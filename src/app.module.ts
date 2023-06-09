import { Module } from '@nestjs/common';
import { PetsModule } from './modules/pets/pet.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    PetsModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

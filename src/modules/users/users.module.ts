import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schema/user.schema';
import { SendMessageModule } from '../send-message/send-message.module';

@Module({
  imports: [
    SendMessageModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'COLLECTION_USER' },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

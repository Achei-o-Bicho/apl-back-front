import { Message, MessageSchema } from './schema/message.schema';
import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from '../users/users.module';
import { Room, RoomSchema } from './schema/room.schema';
import { User, UserSchema } from '../users/schema/user.schema';

@Module({
  imports: [
    UsersModule,
    JwtModule,
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
        collection: 'COLLECTION_MESSAGES',
      },
      {
        name: Room.name,
        schema: RoomSchema,
        collection: 'COLLECTION_ROOM',
      },
      {
        name: User.name,
        schema: UserSchema,
        collection: 'COLLECTION_USER',
      },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatsModule {}

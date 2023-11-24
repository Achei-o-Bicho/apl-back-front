import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schema/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { MessageDto } from './dto/message.dto';
import { UsersService } from '../users/users.service';
import { Room, RoomDocument } from './schema/room.schema';
import { v4 as uuidv4 } from 'uuid';
import { RoomDto } from './dto/room.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  async getUserFromSocket(socket: Socket) {
    let auth_token = socket.handshake.headers.authorization;

    auth_token = auth_token.split(' ')[1];

    const user = await this.authService.getUserFromAuthenticationToken(
      auth_token,
    );

    if (!user) {
      throw new WsException('Invalid credentials.');
    }

    return user;
  }

  async createMessage(message: MessageDto) {
    const user = await this.usersService.findById(message.userId);

    const newMessage = new this.messageModel({
      user: user,
      message: message.message,
    });

    let room = await this.roomModel.findById(message.room.id);

    if (!room) {
      room = new this.roomModel({
        _id: message.room.id,
        messages: [],
      });
    }

    if (!message?.room?.id) {
      message.room = {
        id: uuidv4(),
      };
    }

    const messageSaved = await newMessage.save();

    room.messages.push(messageSaved);

    return await room.save();
  }

  async getAllMessagesByRoom(room: RoomDto) {
    return this.roomModel.findById(room.id);
  }

  async getAllMessages() {
    return this.roomModel.find();
  }
}

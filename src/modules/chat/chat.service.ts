import { Injectable } from '@nestjs/common';
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
import { IUser } from '../users/interface/user.interface';
import { User, UserDocument } from '../users/schema/user.schema';
import { IMessage } from './interface/message.interface';
import { IRoom } from './interface/room.interface';

@Injectable()
export class ChatService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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

  async createMessage(message: MessageDto, sender: IUser) {
    const user = await this.usersService.findById(message.userIdReceiver);

    const newMessage = new this.messageModel({
      user: user,
      message: message.message,
    });

    const senderModel = new this.userModel(sender);
    const receiverModel = new this.userModel(user);

    let room;

    if (message.room) {
      room = await this.roomModel.findById(message.room.id);
    }

    if (!room) {
      room = new this.roomModel({
        _id: uuidv4(),
        messages: [],
        sender: senderModel,
        receiver: receiverModel,
      });
    }

    const messageSaved = await newMessage.save();

    room.messages.push(messageSaved);

    return await room.save();
  }

  async getAllMessagesByRoom(room: RoomDto) {
    return this.roomModel.findById(room.id);
  }

  async getAllMessages(userId: string) {
    const rooms = await this.roomModel.find<IRoom>({ 'sender._id': userId });
    return rooms.sort(
      (roomA, roomB) => roomA.updatedAt.getTime() - roomB.updatedAt.getTime(),
    );
  }
}

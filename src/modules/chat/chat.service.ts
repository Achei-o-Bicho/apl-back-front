import { Injectable, Logger } from '@nestjs/common';
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
import { IRoom } from './interface/room.interface';
import { IMessage } from './interface/message.interface';

@Injectable()
export class ChatService {
  private userSocketMap: Map<string, Socket> = new Map();
  private readonly logger = new Logger(ChatService.name);
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  associateUserWithSocket(userId: string, socket: Socket): void {
    this.userSocketMap.set(userId, socket);
  }

  getSocketByUserId(userId: string): Socket | undefined {
    return this.userSocketMap.get(userId);
  }

  async getUserFromSocket(socket: Socket) {
    try {
      let auth_token = socket.handshake.headers.authorization;

      auth_token = auth_token.split(' ')[1];

      const user = await this.authService.getUserFromAuthenticationToken(
        auth_token,
      );

      if (!user) {
        throw new WsException('Invalid credentials.');
      }

      return user;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async createMessage(message: MessageDto, sender: IUser) {
    const user = await this.usersService.findById(message.userIdReceiver);

    const newMessage = new this.messageModel({
      user: user,
      message: message.message,
      isOwner: user._id === sender._id,
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
        participants: [senderModel._id, user._id],
      });
    }

    const messageSaved = await newMessage.save();

    room.messages.push(messageSaved);

    return await room.save();
  }

  async getAllMessagesByRoom(room: RoomDto) {
    return this.roomModel.findById(room.id);
  }

  async getAllMessages(userId: string, sender: IUser) {
    const rooms = await this.roomModel
      .find({ participants: userId })
      .sort({ updatedAt: -1 })
      .lean<IRoom[]>();

    return rooms.map((room) => {
      const messagesWithOwnership = room.messages.map((message) => {
        const isOwner = message.user.toString() !== sender._id.toString();
        return { ...message, isOwner } as IMessage;
      });

      return {
        ...room,
        messages: messagesWithOwnership,
        idUserConversationPartner:
          sender._id === room.sender._id ? room.receiver._id : room.sender._id,
      } as IRoom;
    });
  }
}

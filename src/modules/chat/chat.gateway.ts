import { ChatService } from './chat.service';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageDto } from './dto/message.dto';
import { RoomDto } from './dto/room.dto';
import { IUser } from '../users/interface/user.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private chatsService: ChatService) {}

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const userId = await this.chatsService.getUserFromSocket(socket);

    if (!userId) {
      socket.disconnect();
      return;
    }

    const user = this.chatsService.getSocketByUserId(userId._id.toString());

    if (!user) {
      return this.chatsService.associateUserWithSocket(
        userId._id.toString(),
        socket,
      );
    }

    return user;
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() message: MessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const sender = await this.chatsService.getUserFromSocket(socket);
    const recipientSocket = this.chatsService.getSocketByUserId(
      sender._id.toString(),
    );

    if (recipientSocket) {
      recipientSocket.emit('get_all_messages', message);
    }

    const newmessage = await this.chatsService.createMessage(message, sender);

    return newmessage;
  }

  @SubscribeMessage('get_all_messages_from_room')
  async getAllMessagesFromRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() room: RoomDto,
  ) {
    const sender = await this.chatsService.getUserFromSocket(socket);
    const messages = await this.chatsService.getAllMessagesByRoom(room);
    const recipientSocket = this.chatsService.getSocketByUserId(
      sender._id.toString(),
    );

    if (recipientSocket) {
      recipientSocket.emit('get_all_messages', messages);
    }

    socket.emit('get_all_messages', messages);

    return messages;
  }

  @SubscribeMessage('get_all_rooms')
  async getAllMessages(@ConnectedSocket() socket: Socket) {
    const sender = await this.chatsService.getUserFromSocket(socket);

    const recipientSocket = this.chatsService.getSocketByUserId(
      sender._id.toString(),
    );

    const messages = await this.chatsService.getAllMessages(sender._id, sender);

    if (recipientSocket) {
      recipientSocket.emit('get_all_messages', messages);
    }

    return messages;
  }
}

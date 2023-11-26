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
    const socketSender = await this.chatsService.getUserFromSocket(socket);

    if (!socketSender) {
      socket.disconnect();
      return;
    }

    const recipientSocket = this.chatsService.getSocketByUserId(
      socketSender._id.toString(),
    );

    this.chatsService.associateUserWithSocket(
      socketSender._id.toString(),
      socket,
    );

    const messages = await this.chatsService.getAllMessages(
      socketSender._id,
      socketSender,
    );

    if (recipientSocket) {
      // this.chatsService.associateUserWithSocket(
      //   socketSender._id.toString(),
      //   socket,
      // );
      socket.emit('get_all_messages', messages);
    } else {
      this.chatsService
        .getSocketByUserId(socketSender._id.toString())
        .emit('get_all_messages', messages);
    }
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() message: MessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const sender = await this.chatsService.getUserFromSocket(socket);

    const recipientSocketSender = this.chatsService.getSocketByUserId(
      sender._id.toString(),
    );

    const recipientSocketReceiver = this.chatsService.getSocketByUserId(
      message.userIdReceiver,
    );

    const room = await this.chatsService.createMessage(message, sender);

    const messages = await this.chatsService.getAllMessages(sender._id, sender);

    if (recipientSocketSender || recipientSocketReceiver) {
      recipientSocketReceiver.emit('get_all_messages', messages);
      recipientSocketSender.emit('get_all_messages', messages);
    }

    return room;
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

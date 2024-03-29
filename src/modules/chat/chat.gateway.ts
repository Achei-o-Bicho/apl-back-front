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

    const messages = await this.chatsService.getAllMessages(
      socketSender._id,
      socketSender,
    );

    if (recipientSocket && recipientSocket.id === socket.id) {
      recipientSocket.emit('get_all_messages', messages);
    } else {
      this.chatsService.associateUserWithSocket(
        socketSender._id.toString(),
        socket,
      );
      socket.emit('get_all_messages', messages);
    }
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() message: MessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const sender = await this.chatsService.getUserFromSocket(socket);

    const recipientSocketReceptor = this.chatsService.getSocketByUserId(
      message.userIdReceiver,
    );

    const recipientSocketSender = this.chatsService.getSocketByUserId(
      sender._id.toString(),
    );

    const room = await this.chatsService.createMessage(message, sender);

    const messagesFromReceptor = await this.chatsService.getAllMessages(
      message.userIdReceiver,
      sender,
    );

    const messagesFromSender = await this.chatsService.getAllMessages(
      sender._id,
      sender,
    );

    if (recipientSocketReceptor) {
      recipientSocketReceptor.emit('get_all_messages', messagesFromReceptor);
      recipientSocketSender.emit('get_all_messages', messagesFromSender);
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

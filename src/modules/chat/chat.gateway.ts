import { ChatService } from './chat.service';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  ConnectedSocket,
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

  async handleConnection(socket: Socket) {
    await this.chatsService.getUserFromSocket(socket);
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() message: MessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const sender = await this.chatsService.getUserFromSocket(socket);
    const recipientSocket = this.server.sockets.sockets.get(sender._id);

    if (recipientSocket) {
      recipientSocket.emit('receive_message', message);
    }

    const newmessage = await this.chatsService.createMessage(message, sender);

    return newmessage;
  }

  @SubscribeMessage('get_all_messages_from_room')
  async getAllMessagesFromRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() room: RoomDto,
  ) {
    const messages = await this.chatsService.getAllMessagesByRoom(room);

    socket.emit('receive_message', messages);

    return messages;
  }

  @SubscribeMessage('get_all_rooms')
  async getAllMessages(@ConnectedSocket() socket: Socket) {
    const sender = await this.chatsService.getUserFromSocket(socket);

    const messages = await this.chatsService.getAllMessages(sender._id, sender);

    socket.emit('receive_message', messages);

    return messages;
  }
}

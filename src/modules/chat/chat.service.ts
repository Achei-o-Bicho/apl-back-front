import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
  constructor(private authService: AuthService) {}

  async getUserFromSocket(socket: Socket) {
    let auth_token = socket.handshake.headers.authorization;

    auth_token = auth_token.split(' ')[1];

    const user = this.authService.getUserFromAuthenticationToken(auth_token);

    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }
}

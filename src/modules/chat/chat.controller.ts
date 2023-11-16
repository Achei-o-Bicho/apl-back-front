import { MessageDto } from './dto/message.dto';
import { ChatService } from './chat.service';
import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private chatsService: ChatService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createMessage(@Body() message: MessageDto) {
    return this.chatsService.createMessage(message);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllMessages() {
    return this.chatsService.getAllMessages();
  }
}

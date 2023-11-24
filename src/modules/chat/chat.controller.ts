import { MessageDto } from './dto/message.dto';
import { ChatService } from './chat.service';
import { Body, Controller, Post, UseGuards, Get, Param } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private chatsService: ChatService) {}

  @UseGuards(AuthGuard)
  @Get(':userId')
  async getAllMessages(@Param('userId') userId: string) {
    return this.chatsService.getAllMessages(userId);
  }
}

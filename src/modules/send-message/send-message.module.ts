import { Module } from '@nestjs/common';
import { SendWhatsappService } from './send-whatsapp.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [SendWhatsappService],
  exports: [SendWhatsappService],
})
export class SendMessageModule {}

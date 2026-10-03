import { Body, Controller, Post } from '@nestjs/common';
import { TelegramService } from './telegram.service.js';
import { CreateTelegramMessageDto } from '../dto/telegram.dto.js';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('sendMessage')
  sendMessage(@Body() body: CreateTelegramMessageDto) {
    return this.telegramService.sendMessage(body)
  }
}

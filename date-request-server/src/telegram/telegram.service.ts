import { Injectable } from '@nestjs/common';
import { CreateTelegramMessageDto } from '../dto/telegram.dto.js';
import axios from 'axios';

@Injectable()
export class TelegramService {

  sendMessage(body: CreateTelegramMessageDto) {

  }
}

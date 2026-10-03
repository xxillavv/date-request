import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  CreateTelegramMessageDto,
  DateActivity,
  DateAnswer,
} from '../dto/telegram.dto.js';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

const ANSWER_LABELS: Record<DateAnswer, string> = {
  [DateAnswer.Yes]: '✅ Так!',
  [DateAnswer.No]: '❌ Ні',
  [DateAnswer.Maybe]: '🤔 Можливо',
};

const ACTIVITY_LABELS: Record<DateActivity, string> = {
  [DateActivity.Coffee]: '☕ Кава',
  [DateActivity.Restaurant]: '🍝 Ресторан',
  [DateActivity.Cinema]: '🎬 Кіно',
  [DateActivity.Walk]: '🚶 Прогулянка',
  [DateActivity.Other]: '✨ Інше',
};

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

@Injectable()
export class TelegramService {
  constructor(private readonly config: ConfigService) { }

  async sendMessage(body: CreateTelegramMessageDto) {
    try {
      await axios.post(`https://api.telegram.org/bot${this.config.get("TELEGRAM_BOT_TOKEN")}/sendMessage`, {
        chat_id: this.config.get("TELEGRAM_BOT_ID"),
        text: this.buildText(body),
        parse_mode: 'HTML',
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to send message');
    }

    return { status: "ok", data: body };
  }

  private buildText(body: CreateTelegramMessageDto): string {
    const lines = [
      `💌 <b>Відповідь на запрошення</b>`,
      '',
      `<b>Відповідь:</b> ${ANSWER_LABELS[body.answer]}`,
    ];

    if (body.date) lines.push(`<b>Дата:</b> ${body.date}`);
    if (body.time) lines.push(`<b>Час:</b> ${body.time}`);
    if (body.place) lines.push(`<b>Місце:</b> ${escapeHtml(body.place)}`);
    if (body.activity) {
      lines.push(`<b>Що робимо:</b> ${ACTIVITY_LABELS[body.activity]}`);
    }
    if (body.wishes) lines.push(`<b>Побажання:</b> ${escapeHtml(body.wishes)}`);

    return lines.join('\n');
  }
}

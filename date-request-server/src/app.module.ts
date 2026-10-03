import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module.js';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [TelegramModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

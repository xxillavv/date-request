import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from './telegram/telegram.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TelegramModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from '@/config/configuration';

@Injectable()
export class TelegramService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService<AppConfig, true>,
  ) {}

  async sendMessage(text: string) {
    const telegram = this.config.get('integrations.telegram', { infer: true });

    if (!telegram.botToken || !telegram.chatId) {
      throw new ServiceUnavailableException('Telegram integration is not configured');
    }

    const { data } = await firstValueFrom(
      this.http.post(`https://api.telegram.org/bot${telegram.botToken}/sendMessage`, {
        chat_id: telegram.chatId,
        text,
        parse_mode: 'HTML',
      }),
    );

    return data;
  }
}

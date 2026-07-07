import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@/config/configuration';

@Injectable()
export class CheckboxService {
  constructor(private readonly config: ConfigService<AppConfig, true>) {}

  getClientHeaders() {
    const checkbox = this.config.get('integrations.checkbox', { infer: true });

    return {
      'X-Client-Name': checkbox.clientName,
      'X-Client-Version': checkbox.clientVersion,
    };
  }
}

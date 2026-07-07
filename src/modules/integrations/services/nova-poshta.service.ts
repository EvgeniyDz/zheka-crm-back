import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from '@/config/configuration';
import { NovaPoshtaRequestDto } from '../dto/nova-poshta-request.dto';

@Injectable()
export class NovaPoshtaService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService<AppConfig, true>,
  ) {}

  async call(dto: NovaPoshtaRequestDto) {
    const novaPoshta = this.config.get('integrations.novaPoshta', { infer: true });

    if (!novaPoshta.apiKey) {
      throw new ServiceUnavailableException('Nova Poshta API key is not configured');
    }

    const { data } = await firstValueFrom(
      this.http.post(novaPoshta.apiUrl, {
        apiKey: novaPoshta.apiKey,
        modelName: dto.modelName,
        calledMethod: dto.calledMethod,
        methodProperties: dto.methodProperties ?? {},
      }),
    );

    return data;
  }
}

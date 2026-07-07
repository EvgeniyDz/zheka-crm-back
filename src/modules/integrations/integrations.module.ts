import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { IntegrationsController } from './integrations.controller';
import { CheckboxService } from './services/checkbox.service';
import { NovaPoshtaService } from './services/nova-poshta.service';
import { TelegramService } from './services/telegram.service';

@Module({
  imports: [AuthModule, HttpModule.register({ timeout: 15_000 })],
  controllers: [IntegrationsController],
  providers: [CheckboxService, NovaPoshtaService, TelegramService],
})
export class IntegrationsModule {}


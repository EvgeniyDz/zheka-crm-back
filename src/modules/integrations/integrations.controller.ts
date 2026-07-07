import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '@/shared/decorators/permissions.decorator';
import { NovaPoshtaRequestDto } from './dto/nova-poshta-request.dto';
import { TelegramMessageDto } from './dto/telegram-message.dto';
import { NovaPoshtaService } from './services/nova-poshta.service';
import { TelegramService } from './services/telegram.service';

@ApiTags('integrations')
@ApiBearerAuth()
@Controller({ path: 'integrations', version: '1' })
@UseGuards(SupabaseAuthGuard, PermissionsGuard)
export class IntegrationsController {
  constructor(
    private readonly novaPoshtaService: NovaPoshtaService,
    private readonly telegramService: TelegramService,
  ) {}

  @Post('nova-poshta')
  @RequirePermissions({ resourceType: 'integration', resourceName: 'nova-poshta', action: 'view' })
  novaPoshta(@Body() dto: NovaPoshtaRequestDto) {
    return this.novaPoshtaService.call(dto);
  }

  @Post('telegram/messages')
  @RequirePermissions({ resourceType: 'integration', resourceName: 'telegram', action: 'create' })
  sendTelegramMessage(@Body() dto: TelegramMessageDto) {
    return this.telegramService.sendMessage(dto.text);
  }
}

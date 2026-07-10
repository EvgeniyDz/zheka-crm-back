import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RequirePermissions } from '@/shared/decorators/permissions.decorator';
import { ClientsService } from './clients.service';
import { ClientsQueryDto } from './dto/clients-query.dto';

@ApiTags('clients')
@ApiBearerAuth()
@Controller({ path: 'clients', version: '1' })
@UseGuards(SupabaseAuthGuard, PermissionsGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @RequirePermissions({ resourceType: 'table', resourceName: 'Clients', action: 'view' })
  findAll(@Query() query: ClientsQueryDto) {
    return this.clientsService.findAll(query);
  }
}

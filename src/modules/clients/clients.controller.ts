import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RequirePermissions } from '@/shared/decorators/permissions.decorator';
import { ClientsService } from './clients.service';
import { ClientsQueryDto } from './dto/clients-query.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

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
  @Post()
  @RequirePermissions({ resourceType: 'table', resourceName: 'Clients', action: 'create' })
  create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Clients', action: 'update' })
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Clients', action: 'delete' })
  delete(@Param('id') id: string) {
    return this.clientsService.delete(id);
  }
}


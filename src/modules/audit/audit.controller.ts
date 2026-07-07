import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { RequirePermissions } from '@/shared/decorators/permissions.decorator';
import { RequestUser } from '@/shared/types/request-user';

@ApiTags('audit')
@ApiBearerAuth()
@Controller({ path: 'audit-logs', version: '1' })
@UseGuards(SupabaseAuthGuard, PermissionsGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateAuditLogDto) {
    return this.auditService.create(user, dto);
  }

  @Get()
  @RequirePermissions({ resourceType: 'table', resourceName: 'audit_logs', action: 'view' })
  findAll(@Query('limit') limit = 100, @Query('offset') offset = 0) {
    return this.auditService.findAll(Number(limit), Number(offset));
  }
}

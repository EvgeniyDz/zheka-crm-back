import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '@/shared/decorators/permissions.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller({ path: 'users', version: '1' })
@UseGuards(SupabaseAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions({ resourceType: 'table', resourceName: 'app_users', action: 'view' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('roles')
  @RequirePermissions({ resourceType: 'table', resourceName: 'roles', action: 'view' })
  findRoles() {
    return this.usersService.findRoles();
  }
}

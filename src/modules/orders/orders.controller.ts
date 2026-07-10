import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RequirePermissions } from '@/shared/decorators/permissions.decorator';
import { OrdersQueryDto } from './dto/orders-query.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth()
@Controller({ path: 'orders', version: '1' })
@UseGuards(SupabaseAuthGuard, PermissionsGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @RequirePermissions({ resourceType: 'table', resourceName: 'Orders', action: 'view' })
  findAll(@Query() query: OrdersQueryDto) {
    return this.ordersService.findAll(query);
  }

  @Get('summary')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Orders', action: 'view' })
  getSummary(@Query() query: OrdersQueryDto) {
    return this.ordersService.getSummary(query);
  }
}

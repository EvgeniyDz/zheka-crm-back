import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RequirePermissions } from '@/shared/decorators/permissions.decorator';
import { OrdersQueryDto } from './dto/orders-query.dto';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { RequestUser } from '@/shared/types/request-user';

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

  @Post()
  @RequirePermissions({ resourceType: 'table', resourceName: 'Orders', action: 'create' })
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user, dto);
  }

  @Patch(':id')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Orders', action: 'update' })
  update(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(user, id, dto);
  }

  @Delete(':id')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Orders', action: 'delete' })
  delete(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.ordersService.delete(user, id);
  }
}

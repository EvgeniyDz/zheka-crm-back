import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RequirePermissions } from '@/shared/decorators/permissions.decorator';
import { ReferenceDataQueryDto } from './dto/reference-data-query.dto';
import { ReferenceDataService } from './reference-data.service';

@ApiTags('reference-data')
@ApiBearerAuth()
@Controller({ path: 'reference-data', version: '1' })
@UseGuards(SupabaseAuthGuard, PermissionsGuard)
export class ReferenceDataController {
  constructor(private readonly referenceDataService: ReferenceDataService) {}

  @Get('common')
  @RequirePermissions(
    { resourceType: 'table', resourceName: 'Categories', action: 'view' },
    { resourceType: 'table', resourceName: 'Brands', action: 'view' },
    { resourceType: 'table', resourceName: 'Suppliers', action: 'view' },
    { resourceType: 'table', resourceName: 'Collections', action: 'view' },
  )
  getCommon() {
    return this.referenceDataService.getCommon();
  }

  @Get('categories')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Categories', action: 'view' })
  getCategories(@Query() query: ReferenceDataQueryDto) {
    return this.referenceDataService.getCategories(query);
  }

  @Get('brands')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Brands', action: 'view' })
  getBrands(@Query() query: ReferenceDataQueryDto) {
    return this.referenceDataService.getBrands(query);
  }

  @Get('suppliers')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Suppliers', action: 'view' })
  getSuppliers(@Query() query: ReferenceDataQueryDto) {
    return this.referenceDataService.getSuppliers(query);
  }

  @Get('collections')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Collections', action: 'view' })
  getCollections(@Query() query: ReferenceDataQueryDto) {
    return this.referenceDataService.getCollections(query);
  }
}

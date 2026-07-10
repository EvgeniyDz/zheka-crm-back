import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RequirePermissions } from '@/shared/decorators/permissions.decorator';
import { ReferenceDataQueryDto } from './dto/reference-data-query.dto';
import { CatalogReferenceDto } from './dto/catalog-reference.dto';
import { UpdateCatalogReferenceDto } from './dto/update-catalog-reference.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
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
  @Post('categories')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Categories', action: 'create' })
  createCategory(@Body() dto: CatalogReferenceDto) {
    return this.referenceDataService.createCategory(dto);
  }

  @Patch('categories/:slug')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Categories', action: 'update' })
  updateCategory(@Param('slug') slug: string, @Body() dto: UpdateCatalogReferenceDto) {
    return this.referenceDataService.updateCategory(slug, dto);
  }

  @Delete('categories/:slug')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Categories', action: 'delete' })
  deleteCategory(@Param('slug') slug: string) {
    return this.referenceDataService.deleteCategory(slug);
  }

  @Post('brands')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Brands', action: 'create' })
  createBrand(@Body() dto: CatalogReferenceDto) {
    return this.referenceDataService.createBrand(dto);
  }

  @Patch('brands/:slug')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Brands', action: 'update' })
  updateBrand(@Param('slug') slug: string, @Body() dto: UpdateCatalogReferenceDto) {
    return this.referenceDataService.updateBrand(slug, dto);
  }

  @Delete('brands/:slug')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Brands', action: 'delete' })
  deleteBrand(@Param('slug') slug: string) {
    return this.referenceDataService.deleteBrand(slug);
  }

  @Post('suppliers')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Suppliers', action: 'create' })
  createSupplier(@Body() dto: CreateSupplierDto) {
    return this.referenceDataService.createSupplier(dto);
  }

  @Patch('suppliers/:id')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Suppliers', action: 'update' })
  updateSupplier(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSupplierDto) {
    return this.referenceDataService.updateSupplier(id, dto);
  }

  @Delete('suppliers/:id')
  @RequirePermissions({ resourceType: 'table', resourceName: 'Suppliers', action: 'delete' })
  deleteSupplier(@Param('id', ParseIntPipe) id: number) {
    return this.referenceDataService.deleteSupplier(id);
  }
}


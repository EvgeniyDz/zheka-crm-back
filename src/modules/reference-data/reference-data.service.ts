import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ReferenceDataQueryDto } from './dto/reference-data-query.dto';
import { CatalogReferenceDto } from './dto/catalog-reference.dto';
import { UpdateCatalogReferenceDto } from './dto/update-catalog-reference.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import {
  BrandDto,
  CategoryDto,
  CollectionDto,
  CommonReferenceDataDto,
  PaginatedResult,
  SupplierDto,
} from './reference-data.types';

type SortDirection = 'asc' | 'desc';
type SupabaseQuery = ReturnType<ReturnType<SupabaseService['admin']['from']>['select']>;

@Injectable()
export class ReferenceDataService {
  constructor(private readonly supabase: SupabaseService) {}

  async getCategories(query: ReferenceDataQueryDto): Promise<PaginatedResult<CategoryDto>> {
    return this.findNamedTable<CategoryDto>('Categories', query, 'name');
  }

  async getBrands(query: ReferenceDataQueryDto): Promise<PaginatedResult<BrandDto>> {
    return this.findNamedTable<BrandDto>('Brands', query, 'name');
  }

  async getSuppliers(query: ReferenceDataQueryDto): Promise<PaginatedResult<SupplierDto>> {
    return this.findNamedTable<SupplierDto>('Suppliers', query, 'name');
  }


  createCategory(dto: CatalogReferenceDto): Promise<CategoryDto> {
    return this.createRecord<CategoryDto>('Categories', this.normalizeCatalogPayload(dto));
  }

  updateCategory(slug: string, dto: UpdateCatalogReferenceDto): Promise<CategoryDto> {
    return this.updateRecord<CategoryDto>('Categories', 'slug', slug, this.normalizeCatalogPayload(dto));
  }

  deleteCategory(slug: string) {
    return this.deleteRecord('Categories', 'slug', slug);
  }

  createBrand(dto: CatalogReferenceDto): Promise<BrandDto> {
    return this.createRecord<BrandDto>('Brands', this.normalizeCatalogPayload(dto));
  }

  updateBrand(slug: string, dto: UpdateCatalogReferenceDto): Promise<BrandDto> {
    return this.updateRecord<BrandDto>('Brands', 'slug', slug, this.normalizeCatalogPayload(dto));
  }

  deleteBrand(slug: string) {
    return this.deleteRecord('Brands', 'slug', slug);
  }

  createSupplier(dto: CreateSupplierDto): Promise<SupplierDto> {
    return this.createRecord<SupplierDto>('Suppliers', {
      name: dto.name.trim(),
      contacts: dto.contacts?.trim() ?? '',
      payments_info: dto.payments_info?.trim() ?? '',
      balance: dto.balance ?? 0,
    });
  }

  updateSupplier(id: number, dto: UpdateSupplierDto): Promise<SupplierDto> {
    const payload = {
      ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
      ...(dto.contacts !== undefined ? { contacts: dto.contacts?.trim() ?? '' } : {}),
      ...(dto.payments_info !== undefined ? { payments_info: dto.payments_info?.trim() ?? '' } : {}),
      ...(dto.balance !== undefined ? { balance: dto.balance } : {}),
    };

    return this.updateRecord<SupplierDto>('Suppliers', 'id', id, payload);
  }

  deleteSupplier(id: number) {
    return this.deleteRecord('Suppliers', 'id', id);
  }
  async getCollections(query: ReferenceDataQueryDto): Promise<PaginatedResult<CollectionDto>> {
    const limit = query.limit;
    const offset = query.offset;
    const direction = query.direction ?? 'asc';

    let collectionsQuery = this.supabase.admin
      .from('Collections')
      .select('*', { count: 'exact' })
      .order('order', { ascending: direction === 'asc' })
      .range(offset, offset + limit - 1);

    if (query.search?.trim()) {
      collectionsQuery = collectionsQuery.ilike('name', `%${query.search.trim()}%`);
    }

    const [{ data: collections, error, count }, { data: links, error: linksError }] =
      await Promise.all([
        collectionsQuery,
        this.supabase.admin.from('CollectionProducts').select('collection_id, product_articul, order'),
      ]);

    if (error) throw error;
    if (linksError) throw linksError;

    const linksByCollection = (links ?? []).reduce<Record<string, string[]>>((acc, link) => {
      const collectionId = String(link.collection_id);
      if (!acc[collectionId]) acc[collectionId] = [];
      if (link.product_articul) acc[collectionId].push(String(link.product_articul));
      return acc;
    }, {});

    return {
      items: (collections ?? []).map((collection) => this.mapCollection(collection, linksByCollection)),
      total: count ?? 0,
      limit,
      offset,
    };
  }

  async getCommon(): Promise<CommonReferenceDataDto> {
    const [categories, brands, suppliers, collections] = await Promise.all([
      this.getCategories({ limit: 500, offset: 0, direction: 'asc' }),
      this.getBrands({ limit: 500, offset: 0, direction: 'asc' }),
      this.getSuppliers({ limit: 500, offset: 0, direction: 'asc' }),
      this.getCollections({ limit: 500, offset: 0, direction: 'asc' }),
    ]);

    return {
      categories: categories.items,
      brands: brands.items,
      suppliers: suppliers.items,
      collections: collections.items,
    };
  }


  private normalizeCatalogPayload(dto: UpdateCatalogReferenceDto) {
    return {
      ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
      ...(dto.slug !== undefined ? { slug: dto.slug?.trim() } : {}),
      ...(dto.order !== undefined ? { order: dto.order } : {}),
      ...(dto.images !== undefined ? { images: dto.images ?? [] } : {}),
      ...(dto.seoTitle !== undefined ? { seoTitle: dto.seoTitle ?? '' } : {}),
      ...(dto.seoDescription !== undefined ? { seoDescription: dto.seoDescription ?? '' } : {}),
      ...(dto.seoKeys !== undefined ? { seoKeys: dto.seoKeys ?? '' } : {}),
    };
  }

  private async createRecord<T>(tableName: string, payload: Record<string, unknown>): Promise<T> {
    const { data, error } = await this.supabase.admin
      .from(tableName)
      .insert([payload])
      .select('*')
      .single();

    if (error) throw error;
    return data as T;
  }

  private async updateRecord<T>(
    tableName: string,
    column: string,
    value: string | number,
    payload: Record<string, unknown>,
  ): Promise<T> {
    const { data, error } = await this.supabase.admin
      .from(tableName)
      .update(payload)
      .eq(column, value)
      .select('*')
      .single();

    if (error) throw error;
    return data as T;
  }

  private async deleteRecord(tableName: string, column: string, value: string | number) {
    const { error } = await this.supabase.admin.from(tableName).delete().eq(column, value);
    if (error) throw error;

    return { deleted: true };
  }
  private async findNamedTable<T>(
    tableName: string,
    query: ReferenceDataQueryDto,
    orderBy: string,
  ): Promise<PaginatedResult<T>> {
    const limit = query.limit;
    const offset = query.offset;
    const direction: SortDirection = query.direction ?? 'asc';

    let request: SupabaseQuery = this.supabase.admin
      .from(tableName)
      .select('*', { count: 'exact' })
      .order(orderBy, { ascending: direction === 'asc' })
      .range(offset, offset + limit - 1);

    if (query.search?.trim()) {
      request = request.ilike('name', `%${query.search.trim()}%`);
    }

    const { data, error, count } = await request;
    if (error) throw error;

    return {
      items: (data ?? []) as T[],
      total: count ?? 0,
      limit,
      offset,
    };
  }

  private mapCollection(collection: any, linksByCollection: Record<string, string[]>): CollectionDto {
    const id = String(collection.id);

    return {
      id,
      createdTime: collection.created_at,
      name: collection.name,
      description: collection.description,
      slug: collection.slug,
      order: collection.order,
      images: Array.isArray(collection.images) ? collection.images : [],
      seoTitle: collection.seoTitle,
      seoDescription: collection.seoDescription,
      seoKeys: collection.seoKeys,
      productArticuls: linksByCollection[id] ?? [],
    };
  }
}


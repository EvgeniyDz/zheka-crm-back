import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ReferenceDataQueryDto } from './dto/reference-data-query.dto';
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

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface CategoryDto {
  id: number;
  name: string;
  created_at?: string;
}

export interface BrandDto {
  id: number;
  name: string;
  created_at?: string;
}

export interface SupplierDto {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  contacts?: string;
  payments_info?: string;
  balance?: number;
  created_at?: string;
}

export interface CollectionDto {
  id: string;
  createdTime?: string;
  name?: string;
  description?: string;
  slug?: string;
  order?: number;
  images: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeys?: string;
  productArticuls: string[];
}

export interface CommonReferenceDataDto {
  categories: CategoryDto[];
  brands: BrandDto[];
  suppliers: SupplierDto[];
  collections: CollectionDto[];
}

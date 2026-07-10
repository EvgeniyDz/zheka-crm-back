import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '@/shared/dto/pagination-query.dto';

export class OrdersQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;

  @IsOptional()
  @IsIn(['date', 'status', 'client', 'phone', 'price', 'platform'])
  sortBy: 'date' | 'status' | 'client' | 'phone' | 'price' | 'platform' = 'date';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  direction: 'asc' | 'desc' = 'desc';
}

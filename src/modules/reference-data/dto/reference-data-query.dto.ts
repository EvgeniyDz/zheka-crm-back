import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '@/shared/dto/pagination-query.dto';

export class ReferenceDataQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(['asc', 'desc'])
  direction: 'asc' | 'desc' = 'asc';
}

import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '@/shared/dto/pagination-query.dto';

export class ClientsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(['created', 'firstName', 'lastName', 'phone', 'email'])
  sortBy: 'created' | 'firstName' | 'lastName' | 'phone' | 'email' = 'created';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  direction: 'asc' | 'desc' = 'desc';
}

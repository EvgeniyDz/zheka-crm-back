import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  contacts?: string;

  @IsOptional()
  @IsString()
  payments_info?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  balance?: number;
}

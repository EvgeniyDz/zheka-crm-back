import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateAuditLogDto {
  @ApiProperty({ example: 'order.created' })
  @IsString()
  actionType!: string;

  @ApiPropertyOptional({ example: 'orders' })
  @IsOptional()
  @IsString()
  tableName?: string;

  @ApiPropertyOptional({ example: '42' })
  @IsOptional()
  @IsString()
  recordId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  oldValue?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  newValue?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

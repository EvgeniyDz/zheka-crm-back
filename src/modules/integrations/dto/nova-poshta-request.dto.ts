import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class NovaPoshtaRequestDto {
  @ApiProperty({ example: 'Address' })
  @IsString()
  modelName!: string;

  @ApiProperty({ example: 'searchSettlements' })
  @IsString()
  calledMethod!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  methodProperties?: Record<string, unknown>;
}

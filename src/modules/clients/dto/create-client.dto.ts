import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateClientDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  password?: string | null;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  birthday?: string | null;

  @IsOptional()
  @IsString()
  gender?: string | null;

  @IsOptional()
  @IsString()
  newPassword?: string | null;

  @IsOptional()
  @IsString()
  history?: string | null;

  @IsOptional()
  @IsString()
  created?: string | null;

  @IsOptional()
  @IsString()
  delivery?: string | null;

  @IsOptional()
  @IsString()
  notes?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  discount?: number | null;

  @IsOptional()
  @IsString()
  instagram?: string | null;

  @IsOptional()
  @IsString()
  lastContacted?: string | null;
}

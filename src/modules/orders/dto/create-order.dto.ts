import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsOptional() @IsString() date?: string;
  @IsOptional() @IsString() client?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() items?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) price?: number;
  @IsOptional() @IsString() delivery?: string;
  @IsOptional() @IsString() payment?: string;
  @IsOptional() @IsString() payment_type?: string;
  @IsOptional() @IsString() bank_account?: string;
  @IsOptional() @IsString() contactType?: string;
  @IsOptional() @IsString() info?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() platform?: string;
  @IsOptional() @IsString() packing?: string;
  @IsOptional() @IsString() promocode?: string;
  @IsOptional() @IsString() return_comment?: string;
  @IsOptional() @IsString() return_date?: string;
  @IsOptional() @IsString() fiscal_code?: string;
  @IsOptional() @IsString() fiscal_code_prepayment?: string;
  @IsOptional() @IsString() fiscal_code_postpayment?: string;
  @IsOptional() @IsString() return_fiscal_code?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) prepayment_amount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) postpayment_amount?: number;
  @IsOptional() @IsString() pre_payment_relation_id?: string;
  @IsOptional() @IsString() tracking_number?: string;
  @IsOptional() @IsString() waybill_ref?: string;
  @IsOptional() @IsString() gift_certificate_code?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) gift_certificate_amount?: number;
  @IsOptional() @IsString() comment?: string;
  @IsOptional() @IsString() responsible_person?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) cash_given?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) cash_change?: number;
}

export interface OrderDto {
  date?: string;
  client?: string;
  phone?: string;
  items?: string;
  price?: number;
  delivery?: string;
  payment?: string;
  payment_type?: string;
  bank_account?: string;
  contactType?: string;
  info?: string;
  status?: string;
  email?: string;
  platform?: string;
  packing?: string;
  promocode?: string;
  return_comment?: string;
  return_date?: string;
  fiscal_code?: string;
  fiscal_code_prepayment?: string;
  fiscal_code_postpayment?: string;
  return_fiscal_code?: string;
  prepayment_amount?: number;
  postpayment_amount?: number;
  pre_payment_relation_id?: string;
  tracking_number?: string;
  waybill_ref?: string;
  gift_certificate_code?: string;
  gift_certificate_amount?: number;
  comment?: string;
  responsible_person?: string;
  cash_given?: number;
  cash_change?: number;
}

export interface OrdersSummaryDto {
  new: number;
  processing: number;
  total: number;
}

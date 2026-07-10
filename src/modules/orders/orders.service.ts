import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PaginatedResult } from '../reference-data/reference-data.types';
import { OrdersQueryDto } from './dto/orders-query.dto';
import { OrderDto, OrdersSummaryDto } from './orders.types';

type OrdersQuery = ReturnType<ReturnType<SupabaseService['admin']['from']>['select']>;

@Injectable()
export class OrdersService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(query: OrdersQueryDto): Promise<PaginatedResult<OrderDto> & { summary: OrdersSummaryDto }> {
    const limit = query.limit;
    const offset = query.offset;
    const search = query.search?.trim();

    let request = this.applyFilters(
      this.supabase.admin
        .from('Orders')
        .select('*', { count: 'exact' })
        .order(query.sortBy, { ascending: query.direction === 'asc' })
        .range(offset, offset + limit - 1),
      query,
    );

    if (search) {
      request = request.or(
        [
          `client.ilike.%${search}%`,
          `phone.ilike.%${search}%`,
          `email.ilike.%${search}%`,
          `tracking_number.ilike.%${search}%`,
          `items.ilike.%${search}%`,
        ].join(','),
      );
    }

    const [{ data, error, count }, summary] = await Promise.all([
      request,
      this.getSummary(query),
    ]);

    if (error) throw error;

    return {
      items: (data ?? []) as OrderDto[],
      total: count ?? 0,
      limit,
      offset,
      summary,
    };
  }

  async getSummary(query: OrdersQueryDto): Promise<OrdersSummaryDto> {
    const [{ count: total, error: totalError }, { count: newCount, error: newError }, { count: processingCount, error: processingError }] =
      await Promise.all([
        this.applyFilters(this.supabase.admin.from('Orders').select('date', { count: 'exact', head: true }), query),
        this.applyFilters(this.supabase.admin.from('Orders').select('date', { count: 'exact', head: true }), {
          ...query,
          status: 'new',
        }),
        this.applyFilters(this.supabase.admin.from('Orders').select('date', { count: 'exact', head: true }), {
          ...query,
          status: 'processing',
        }),
      ]);

    if (totalError) throw totalError;
    if (newError) throw newError;
    if (processingError) throw processingError;

    return {
      total: total ?? 0,
      new: newCount ?? 0,
      processing: processingCount ?? 0,
    };
  }

  private applyFilters<T extends OrdersQuery>(request: T, query: OrdersQueryDto): T {
    let next = request;

    if (query.status?.trim()) {
      next = next.eq('status', query.status.trim());
    }

    if (query.platform?.trim()) {
      next = next.eq('platform', query.platform.trim());
    }

    if (query.phone?.trim()) {
      next = next.ilike('phone', `%${query.phone.trim()}%`);
    }

    if (query.dateFrom?.trim()) {
      next = next.gte('date', query.dateFrom.trim());
    }

    if (query.dateTo?.trim()) {
      next = next.lte('date', query.dateTo.trim());
    }

    return next;
  }
}

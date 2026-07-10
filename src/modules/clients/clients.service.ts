import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PaginatedResult } from '../reference-data/reference-data.types';
import { ClientsQueryDto } from './dto/clients-query.dto';
import { ClientDto } from './clients.types';

type ClientsQuery = ReturnType<ReturnType<SupabaseService['admin']['from']>['select']>;

@Injectable()
export class ClientsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(query: ClientsQueryDto): Promise<PaginatedResult<ClientDto>> {
    const limit = query.limit;
    const offset = query.offset;
    const search = query.search?.trim();

    let request: ClientsQuery = this.supabase.admin
      .from('Clients')
      .select('*', { count: 'exact' })
      .order(query.sortBy, { ascending: query.direction === 'asc' })
      .range(offset, offset + limit - 1);

    if (search) {
      request = request.or(
        [
          `firstName.ilike.%${search}%`,
          `lastName.ilike.%${search}%`,
          `surname.ilike.%${search}%`,
          `phone.ilike.%${search}%`,
          `email.ilike.%${search}%`,
          `instagram.ilike.%${search}%`,
        ].join(','),
      );
    }

    const { data, error, count } = await request;
    if (error) throw error;

    return {
      items: (data ?? []) as ClientDto[],
      total: count ?? 0,
      limit,
      offset,
    };
  }
}

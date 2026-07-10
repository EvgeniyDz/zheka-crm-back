import { ConflictException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { SupabaseService } from '../supabase/supabase.service';
import { PaginatedResult } from '../reference-data/reference-data.types';
import { ClientsQueryDto } from './dto/clients-query.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientDto } from './clients.types';

type ClientsQuery = ReturnType<ReturnType<SupabaseService['admin']['from']>['select']>;

@Injectable()
export class ClientsService {
  constructor(private readonly supabase: SupabaseService) {}


  async create(dto: CreateClientDto): Promise<ClientDto> {
    const normalizedPhone = this.normalizePhone(dto.phone);
    await this.assertPhoneIsUnique(normalizedPhone);

    const payload = this.normalizeClientPayload({
      ...dto,
      id: dto.id ?? randomUUID(),
      phone: normalizedPhone,
      created: dto.created ?? new Date().toISOString(),
    });

    const { data, error } = await this.supabase.admin
      .from('Clients')
      .insert([payload])
      .select('*')
      .single();

    if (error) throw error;
    return data as ClientDto;
  }

  async update(id: string, dto: UpdateClientDto): Promise<ClientDto> {
    const normalizedPhone = dto.phone ? this.normalizePhone(dto.phone) : undefined;
    if (normalizedPhone) await this.assertPhoneIsUnique(normalizedPhone, id);

    const payload = this.normalizeClientPayload({
      ...dto,
      ...(normalizedPhone ? { phone: normalizedPhone } : {}),
    });

    const { data, error } = await this.supabase.admin
      .from('Clients')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data as ClientDto;
  }

  async delete(id: string) {
    const { error } = await this.supabase.admin.from('Clients').delete().eq('id', id);
    if (error) throw error;

    return { deleted: true };
  }
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
  private normalizeClientPayload(dto: UpdateClientDto): Record<string, unknown> {
    return {
      ...(dto.id !== undefined ? { id: dto.id } : {}),
      ...(dto.email !== undefined ? { email: dto.email ?? '' } : {}),
      ...(dto.phone !== undefined ? { phone: dto.phone ?? '' } : {}),
      ...(dto.password !== undefined ? { password: dto.password ?? '' } : {}),
      ...(dto.firstName !== undefined ? { firstName: dto.firstName.trim() } : {}),
      ...(dto.lastName !== undefined ? { lastName: dto.lastName.trim() } : {}),
      ...(dto.surname !== undefined ? { surname: dto.surname ?? '' } : {}),
      ...(dto.birthday !== undefined ? { birthday: dto.birthday ?? '' } : {}),
      ...(dto.gender !== undefined ? { gender: dto.gender ?? '' } : {}),
      ...(dto.newPassword !== undefined ? { newPassword: dto.newPassword ?? '' } : {}),
      ...(dto.history !== undefined ? { history: dto.history ?? '' } : {}),
      ...(dto.created !== undefined ? { created: dto.created ?? new Date().toISOString() } : {}),
      ...(dto.delivery !== undefined ? { delivery: dto.delivery ?? '' } : {}),
      ...(dto.notes !== undefined ? { notes: dto.notes ?? '' } : {}),
      ...(dto.discount !== undefined ? { discount: dto.discount ?? 0 } : {}),
      ...(dto.instagram !== undefined ? { instagram: dto.instagram ?? '' } : {}),
      ...(dto.lastContacted !== undefined ? { lastContacted: dto.lastContacted ?? '' } : {}),
    };
  }

  private normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');

    if (digits.length === 12 && digits.startsWith('380')) return digits;
    if (digits.length === 11 && digits.startsWith('80')) return `3${digits}`;
    if (digits.length === 10 && digits.startsWith('0')) return `38${digits}`;
    if (digits.length === 9) return `380${digits}`;

    return digits;
  }

  private async assertPhoneIsUnique(phone: string, exceptId?: string): Promise<void> {
    const { data, error } = await this.supabase.admin
      .from('Clients')
      .select('id, phone, firstName, lastName');

    if (error) throw error;

    const duplicate = (data ?? []).find((client) => {
      if (exceptId && String(client.id) === String(exceptId)) return false;
      return this.normalizePhone(String(client.phone ?? '')) === phone;
    });

    if (duplicate) {
      throw new ConflictException(
        `Client with this phone already exists: ${duplicate.firstName ?? ''} ${duplicate.lastName ?? ''}`.trim(),
      );
    }
  }
}



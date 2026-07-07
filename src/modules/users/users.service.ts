import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabase.admin
      .from('app_users')
      .select('*, role:roles(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async findRoles() {
    const { data, error } = await this.supabase.admin.from('roles').select('*').order('name');

    if (error) throw error;
    return data;
  }
}

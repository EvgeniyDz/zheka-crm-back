import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppConfig } from '@/config/configuration';

@Injectable()
export class SupabaseService {
  readonly admin: SupabaseClient;
  readonly public: SupabaseClient;

  constructor(private readonly config: ConfigService<AppConfig, true>) {
    const supabase = this.config.get('supabase', { infer: true });

    this.public = createClient(supabase.url, supabase.anonKey, {
      auth: { persistSession: false },
    });
    this.admin = createClient(supabase.url, supabase.serviceRoleKey, {
      auth: { persistSession: false },
    });
  }
}

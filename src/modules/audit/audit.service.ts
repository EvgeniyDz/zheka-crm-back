import { Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { RequestUser } from '@/shared/types/request-user';

@Injectable()
export class AuditService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(user: RequestUser, dto: CreateAuditLogDto) {
    const { error } = await this.supabase.admin.rpc('log_audit', {
      p_user_id: user.id,
      p_action_type: dto.actionType,
      p_table_name: dto.tableName,
      p_record_id: dto.recordId,
      p_old_value: dto.oldValue,
      p_new_value: dto.newValue,
      p_metadata: dto.metadata,
    });

    if (error) throw error;
    return { created: true };
  }

  async findAll(limit = 100, offset = 0) {
    const { data, error } = await this.supabase.admin
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  }
}

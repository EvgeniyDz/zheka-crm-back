import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { RequestUser } from '@/shared/types/request-user';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  async resolveUser(accessToken: string): Promise<RequestUser> {
    const { data, error } = await this.supabase.public.auth.getUser(accessToken);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    const { data: appUser } = await this.supabase.admin
      .from('app_users')
      .select('*, role:roles(*)')
      .eq('id', data.user.id)
      .maybeSingle();

    return {
      id: data.user.id,
      email: data.user.email,
      role: appUser?.role,
      appUser: appUser ?? undefined,
    };
  }

  getProfile(user: RequestUser) {
    return user;
  }
}

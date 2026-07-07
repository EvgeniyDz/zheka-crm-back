import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, RequiredPermission } from '@/shared/decorators/permissions.decorator';
import { SupabaseService } from '@/modules/supabase/supabase.service';
import { RequestUser } from '@/shared/types/request-user';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly supabase: SupabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<RequiredPermission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required?.length) return true;

    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const user = request.user;

    if (!user) return false;
    if (user.role?.name === 'admin') return true;

    for (const permission of required) {
      const { data, error } = await this.supabase.admin.rpc('has_permission', {
        p_user_id: user.id,
        p_resource_type: permission.resourceType,
        p_resource_name: permission.resourceName,
        p_action: permission.action,
      });

      if (error || data !== true) {
        throw new ForbiddenException('You do not have permission for this action');
      }
    }

    return true;
  }
}

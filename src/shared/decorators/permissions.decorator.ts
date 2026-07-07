import { SetMetadata } from '@nestjs/common';

export type PermissionAction = 'view' | 'create' | 'update' | 'delete';

export interface RequiredPermission {
  resourceType: string;
  resourceName: string;
  action: PermissionAction;
}

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: RequiredPermission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

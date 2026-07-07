import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SupabaseAuthGuard, PermissionsGuard],
  exports: [AuthService, SupabaseAuthGuard, PermissionsGuard],
})
export class AuthModule {}

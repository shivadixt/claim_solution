import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AuthGuard } from './guards/auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { TenantGuard } from './guards/tenant.guard.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RolesGuard, TenantGuard],
  exports: [AuthService, AuthGuard, RolesGuard, TenantGuard],
})
export class AuthModule {}

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { SessionUserData } from '../auth.service.js';

export interface TenantScopedResource {
  clientId?: string | null;
}

/**
 * Validates whether an authenticated user is authorized to access a tenant-scoped resource.
 * - Global platform roles (SUPER_ADMIN, OPERATIONS_ADMIN) are permitted across all tenants.
 * - Tenant-scoped roles (e.g. CLIENT_ADMIN) are strictly confined to matching clientId.
 * - If user clientId does not match resource clientId, access is denied (403 Forbidden).
 */
export function checkTenantAccess(
  user: SessionUserData,
  resource: TenantScopedResource | string | null | undefined,
): boolean {
  if (!user || !user.role) {
    throw new ForbiddenException('User context missing for tenant verification');
  }

  // Super Admin and Operations Admin have global platform visibility
  if (user.role === 'SUPER_ADMIN' || user.role === 'OPERATIONS_ADMIN') {
    return true;
  }

  const resourceClientId =
    typeof resource === 'string' ? resource : resource?.clientId;

  if (!resourceClientId) {
    throw new ForbiddenException('Target resource does not belong to a valid client');
  }

  if (!user.clientId || user.clientId !== resourceClientId) {
    throw new ForbiddenException(
      `Tenant access violation: user client '${user.clientId ?? 'none'}' cannot access resource for client '${resourceClientId}'`,
    );
  }

  return true;
}

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        'Authentication required before tenant evaluation',
      );
    }

    const targetClientId =
      request.params?.clientId ||
      request.body?.clientId ||
      (request.query?.clientId as string);

    if (targetClientId) {
      return checkTenantAccess(user, targetClientId);
    }

    return true;
  }
}

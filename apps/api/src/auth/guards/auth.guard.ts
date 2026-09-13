import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService, SessionUserData } from '../auth.service.js';

declare global {
  namespace Express {
    interface Request {
      user?: SessionUserData;
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Authorization header is missing');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Invalid authorization format. Expected Bearer token',
      );
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      throw new UnauthorizedException('Session token is missing');
    }

    const user = await this.authService.validateSessionToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    request.user = user;
    return true;
  }
}

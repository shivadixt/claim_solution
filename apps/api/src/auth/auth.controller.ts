import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { LogoutDto } from './dto/logout.dto.js';
import { AuthGuard } from './guards/auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { Roles } from './decorators/roles.decorator.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import type { SessionUserData } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const rawIp = req.ip || req.socket?.remoteAddress;
    const ipAddress = rawIp ? rawIp.replace(/^::ffff:/, '') : '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'unknown';

    return this.authService.login(dto, ipAddress, userAgent);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Body() dto: LogoutDto) {
    const authHeader = req.headers['authorization'];
    let token = dto?.sessionToken;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }

    return this.authService.logout(token);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@CurrentUser() user: SessionUserData) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      clientId: user.clientId,
    };
  }

  @Get('admin-only')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  getAdminOnly() {
    return { message: 'You are a super admin' };
  }
}

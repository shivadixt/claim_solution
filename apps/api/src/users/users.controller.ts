import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RoleName } from '@claim-solution/db';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('OPERATIONS_ADMIN', 'SUPER_ADMIN')
  async findUsersByRole(@Query('role') role?: RoleName) {
    return this.usersService.findUsersByRole(role);
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CasesService } from './cases.service.js';
import { CreateCaseDto } from './dto/create-case.dto.js';
import { TriageCaseDto } from './dto/triage-case.dto.js';
import { AssignCaseDto } from './dto/assign-case.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { SessionUserData } from '../auth/auth.service.js';

@Controller('cases')
@UseGuards(AuthGuard, RolesGuard)
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  @Roles('CLIENT_ADMIN', 'OPERATIONS_ADMIN', 'SUPER_ADMIN')
  async createCase(
    @Body() dto: CreateCaseDto,
    @CurrentUser() user: SessionUserData,
  ) {
    return this.casesService.createCase(dto, user);
  }

  @Get()
  @Roles('CLIENT_ADMIN', 'OPERATIONS_ADMIN', 'SUPER_ADMIN')
  async findAllCases(@CurrentUser() user: SessionUserData) {
    return this.casesService.findAllCases(user);
  }

  @Patch(':id/triage')
  @Roles('OPERATIONS_ADMIN', 'SUPER_ADMIN')
  async triageCase(
    @Param('id') id: string,
    @Body() dto: TriageCaseDto,
    @CurrentUser() user: SessionUserData,
  ) {
    return this.casesService.triageCase(id, dto, user);
  }

  @Post(':id/assign')
  @Roles('OPERATIONS_ADMIN', 'SUPER_ADMIN')
  async assignCase(
    @Param('id') id: string,
    @Body() dto: AssignCaseDto,
    @CurrentUser() user: SessionUserData,
  ) {
    return this.casesService.assignCase(id, dto, user);
  }
}

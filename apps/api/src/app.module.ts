import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CasesModule } from './cases/cases.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [DatabaseModule, AuthModule, CasesModule, UsersModule],
  controllers: [HealthController],
})
export class AppModule {}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { RoleName } from '@claim-solution/db';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUsersByRole(roleName?: RoleName) {
    let whereClause = {};

    if (roleName) {
      whereClause = {
        role: {
          name: roleName,
        },
        status: 'ACTIVE',
        isDeleted: false,
      };
    } else {
      whereClause = {
        status: 'ACTIVE',
        isDeleted: false,
      };
    }

    return this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { firstName: 'asc' },
    });
  }
}

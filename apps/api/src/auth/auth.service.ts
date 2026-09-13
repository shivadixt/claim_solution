import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@claim-solution/db';
import { PrismaService } from '../database/prisma.service.js';
import { verifyPassword } from './password.util.js';
import {
  generateSessionToken,
  getSessionExpiryDate,
  hashSessionToken,
} from './session.util.js';
import { LoginDto } from './dto/login.dto.js';

export interface SessionUserData {
  id: string;
  email: string;
  role: string;
  clientId: string | null;
}

export async function validateSessionToken(
  token: string,
  prismaClient?: PrismaClient,
): Promise<SessionUserData | null> {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const prisma = prismaClient ?? new PrismaClient();
  try {
    const tokenHash = hashSessionToken(token);
    const session = await prisma.userSession.findFirst({
      where: {
        tokenHash,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });

    if (
      !session ||
      !session.user ||
      session.user.status !== 'ACTIVE' ||
      session.user.isDeleted
    ) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role.name,
      clientId: session.user.clientId,
    };
  } finally {
    if (!prismaClient) {
      await prisma.$disconnect();
    }
  }
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(
    dto: LoginDto,
    ipAddress: string = '127.0.0.1',
    userAgent: string = 'unknown',
  ) {
    const genericErrorMessage = 'Invalid email or password';

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
      include: { role: true },
    });

    if (!user || user.status !== 'ACTIVE' || user.isDeleted) {
      throw new UnauthorizedException(genericErrorMessage);
    }

    const isPasswordValid = await verifyPassword(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException(genericErrorMessage);
    }

    const sessionToken = generateSessionToken();
    const tokenHash = hashSessionToken(sessionToken);
    const expiresAt = getSessionExpiryDate();

    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        tokenHash,
        ipAddress: ipAddress || '127.0.0.1',
        userAgent: userAgent || 'unknown',
        expiresAt,
        isActive: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role.name,
      clientId: user.clientId,
      sessionToken,
    };
  }

  async logout(token?: string) {
    if (!token || typeof token !== 'string') {
      throw new BadRequestException('Session token is required for logout');
    }

    const cleanToken = token.trim();
    if (!cleanToken) {
      throw new BadRequestException('Session token is required for logout');
    }

    const tokenHash = hashSessionToken(cleanToken);

    await this.prisma.userSession.updateMany({
      where: {
        tokenHash,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  async validateSessionToken(token: string): Promise<SessionUserData | null> {
    return validateSessionToken(token, this.prisma);
  }
}

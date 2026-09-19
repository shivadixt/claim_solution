import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { SessionUserData } from '../auth/auth.service.js';
import { CreateCaseDto } from './dto/create-case.dto.js';
import { TriageCaseDto } from './dto/triage-case.dto.js';
import { AssignCaseDto } from './dto/assign-case.dto.js';
import { RiskLevel } from '@claim-solution/db';

@Injectable()
export class CasesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCase(dto: CreateCaseDto, user: SessionUserData) {
    let targetClientId: string;

    // Tenant Scoping Logic
    if (user.role === 'CLIENT_ADMIN') {
      if (!user.clientId) {
        throw new ForbiddenException(
          'Client Admin user is not associated with a valid Client',
        );
      }
      // Silently override clientId to enforce tenant isolation
      targetClientId = user.clientId;
    } else if (
      user.role === 'SUPER_ADMIN' ||
      user.role === 'OPERATIONS_ADMIN'
    ) {
      if (!dto.clientId) {
        throw new BadRequestException(
          'clientId is required for administrative case creation',
        );
      }
      const existingClient = await this.prisma.client.findUnique({
        where: { id: dto.clientId },
      });
      if (!existingClient) {
        throw new BadRequestException('Specified target client does not exist');
      }
      targetClientId = dto.clientId;
    } else {
      throw new ForbiddenException('User is not authorized to create cases');
    }

    // Claimant resolution (find existing or create)
    let claimant = await this.prisma.claimant.findFirst({
      where: {
        firstName: dto.claimant.firstName,
        lastName: dto.claimant.lastName,
      },
    });

    if (!claimant) {
      claimant = await this.prisma.claimant.create({
        data: {
          firstName: dto.claimant.firstName,
          lastName: dto.claimant.lastName,
        },
      });
    }

    // Hospital resolution (find existing or create)
    let hospital = await this.prisma.hospital.findFirst({
      where: {
        name: dto.provider.hospitalName,
      },
    });

    if (!hospital) {
      hospital = await this.prisma.hospital.create({
        data: {
          name: dto.provider.hospitalName,
        },
      });
    }

    // Provider resolution (find existing or create linked to hospital)
    let provider = await this.prisma.provider.findFirst({
      where: {
        hospitalId: hospital.id,
        name: dto.provider.name,
      },
    });

    if (!provider) {
      provider = await this.prisma.provider.create({
        data: {
          hospitalId: hospital.id,
          name: dto.provider.name,
          type: dto.provider.type || 'HOSPITAL',
        },
      });
    }

    const defaultRiskLevel: RiskLevel = dto.riskLevel || RiskLevel.MEDIUM;

    // Create Case record
    const createdCase = await this.prisma.case.create({
      data: {
        clientId: targetClientId,
        claimantId: claimant.id,
        providerId: provider.id,
        createdById: user.id,
        claimNumber: dto.claimNumber,
        policyNumber: dto.policyNumber,
        claimType: dto.claimType,
        claimAmount: dto.claimAmount,
        priority: dto.priority,
        riskLevel: defaultRiskLevel,
        status: 'NEW',
        version: 1,
        dueDate: null,
      },
    });

    // Create initial CaseStatusHistory entry
    await this.prisma.caseStatusHistory.create({
      data: {
        caseId: createdCase.id,
        fromStatus: 'NEW',
        toStatus: 'NEW',
        changedById: user.id,
        changeReason: 'Initial case creation',
      },
    });

    // Fetch and return complete created case with relations
    return this.prisma.case.findUnique({
      where: { id: createdCase.id },
      include: {
        client: true,
        claimant: true,
        provider: {
          include: {
            hospital: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        assignments: {
          include: {
            investigator: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        statusHistory: true,
      },
    });
  }

  async triageCase(id: string, dto: TriageCaseDto, user: SessionUserData) {
    const existingCase = await this.prisma.case.findUnique({
      where: { id },
      include: {
        client: true,
      },
    });

    if (!existingCase) {
      throw new NotFoundException(`Case with ID '${id}' not found`);
    }

    // Optimistic Concurrency Control
    if (existingCase.version !== dto.version) {
      throw new ConflictException(
        `Case version conflict: submitted version ${dto.version} does not match current version ${existingCase.version}`,
      );
    }

    // SLA Due-Date Calculation (current time + client's slaTatDays)
    const slaTatDays = existingCase.client?.slaTatDays ?? 7;
    const calculatedDueDate = new Date(
      Date.now() + slaTatDays * 24 * 60 * 60 * 1000,
    );

    const newPriority = dto.priority || existingCase.priority;
    const newRiskLevel = dto.riskLevel || existingCase.riskLevel;

    // Apply Triage Updates
    await this.prisma.case.update({
      where: { id },
      data: {
        priority: newPriority,
        riskLevel: newRiskLevel,
        dueDate: calculatedDueDate,
        version: existingCase.version + 1,
      },
    });

    // Audit log entry for Triage
    await this.prisma.caseStatusHistory.create({
      data: {
        caseId: id,
        fromStatus: existingCase.status,
        toStatus: existingCase.status,
        changedById: user.id,
        changeReason: `Triage update: Priority set to ${newPriority}, Risk level set to ${newRiskLevel}`,
      },
    });

    // Return complete updated case record
    return this.prisma.case.findUnique({
      where: { id },
      include: {
        client: true,
        claimant: true,
        provider: {
          include: {
            hospital: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        assignments: {
          include: {
            investigator: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        statusHistory: true,
      },
    });
  }

  async assignCase(id: string, dto: AssignCaseDto, user: SessionUserData) {
    const existingCase = await this.prisma.case.findUnique({
      where: { id },
    });

    if (!existingCase) {
      throw new NotFoundException(`Case with ID '${id}' not found`);
    }

    // 1. Optimistic Concurrency Control
    if (existingCase.version !== dto.version) {
      throw new ConflictException(
        `Case version conflict: submitted version ${dto.version} does not match current version ${existingCase.version}`,
      );
    }

    // 2. Case Status Validation (must be NEW)
    if (existingCase.status !== 'NEW') {
      throw new BadRequestException(
        `Cannot assign case: case status is '${existingCase.status}', but only cases in 'NEW' status can be assigned`,
      );
    }

    // 3. Investigator Role Validation
    const investigatorUser = await this.prisma.user.findUnique({
      where: { id: dto.investigatorId },
      include: { role: true },
    });

    if (!investigatorUser || investigatorUser.role.name !== 'INVESTIGATOR') {
      throw new BadRequestException(
        `Target user with ID '${dto.investigatorId}' is not an active Investigator`,
      );
    }

    const assignmentPriority = dto.priority || existingCase.priority;

    // 4. Create Assignment record
    await this.prisma.assignment.create({
      data: {
        caseId: id,
        investigatorId: dto.investigatorId,
        assignedById: user.id,
        priority: assignmentPriority,
        notes: dto.notes || null,
        status: 'ACTIVE',
      },
    });

    // 5. Update Case Status & Increment Version
    await this.prisma.case.update({
      where: { id },
      data: {
        status: 'ASSIGNED',
        version: existingCase.version + 1,
      },
    });

    // 6. Log Status Transition in CaseStatusHistory (NEW -> ASSIGNED)
    await this.prisma.caseStatusHistory.create({
      data: {
        caseId: id,
        fromStatus: 'NEW',
        toStatus: 'ASSIGNED',
        changedById: user.id,
        changeReason: `Case assigned to investigator '${investigatorUser.email}' (${investigatorUser.firstName} ${investigatorUser.lastName})`,
      },
    });

    // 7. Return complete updated case record
    return this.prisma.case.findUnique({
      where: { id },
      include: {
        client: true,
        claimant: true,
        provider: {
          include: {
            hospital: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        assignments: {
          include: {
            investigator: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        statusHistory: true,
      },
    });
  }

  async findAllCases(user: SessionUserData) {
    let whereClause = {};

    if (user.role === 'CLIENT_ADMIN') {
      if (!user.clientId) {
        return [];
      }
      whereClause = { clientId: user.clientId };
    }

    return this.prisma.case.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        client: true,
        claimant: true,
        provider: {
          include: {
            hospital: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        assignments: {
          include: {
            investigator: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        statusHistory: true,
      },
    });
  }
}

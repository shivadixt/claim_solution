import { PrismaClient, RoleName } from '@prisma/client';
import { hashPassword } from '../../../apps/api/src/auth/password.util.js';

const prisma = new PrismaClient();

export const SYSTEM_ACTOR_ID = '00000000-0000-0000-0000-000000000001';

const roleDefinitions: Record<
  RoleName,
  { description: string; permissions: Record<string, string[]> }
> = {
  [RoleName.SUPER_ADMIN]: {
    description: 'Unrestricted platform administration and operations access.',
    permissions: {
      users: ['create', 'read', 'update', 'delete'],
      roles: ['create', 'read', 'update', 'delete'],
      clients: ['create', 'read', 'update', 'delete'],
      cases: ['create', 'read', 'update', 'delete'],
      claimants: ['create', 'read', 'update', 'delete'],
      providers: ['create', 'read', 'update', 'delete'],
      assignments: ['create', 'read', 'update', 'delete'],
      investigations: ['create', 'read', 'update', 'delete'],
      audits: ['create', 'read', 'update', 'delete'],
      documents: ['create', 'read', 'update', 'delete'],
      reports: ['create', 'read', 'update', 'delete'],
      recovery: ['create', 'read', 'update', 'delete'],
      notifications: ['create', 'read', 'update', 'delete'],
      auditLogs: ['read'],
      billing: ['create', 'read', 'update', 'delete'],
      slaMasters: ['create', 'read', 'update', 'delete'],
    },
  },
  [RoleName.OPERATIONS_ADMIN]: {
    description: 'Operational case management, assignment, reporting, and SLA administration.',
    permissions: {
      users: ['create', 'read', 'update'],
      roles: ['read'],
      clients: ['read'],
      cases: ['create', 'read', 'update', 'delete'],
      claimants: ['create', 'read', 'update', 'delete'],
      providers: ['create', 'read', 'update', 'delete'],
      assignments: ['create', 'read', 'update', 'delete'],
      investigations: ['create', 'read', 'update'],
      audits: ['create', 'read', 'update'],
      documents: ['create', 'read', 'update', 'delete'],
      reports: ['create', 'read', 'update', 'delete'],
      recovery: ['create', 'read', 'update'],
      notifications: ['create', 'read', 'update'],
      auditLogs: ['read'],
      billing: ['read'],
      slaMasters: ['create', 'read', 'update'],
    },
  },
  [RoleName.CLIENT_ADMIN]: {
    description: 'Client-scoped case submission, tracking, reporting, and billing access.',
    permissions: {
      users: ['read:client'],
      clients: ['read:client'],
      cases: ['create:client', 'read:client'],
      claimants: ['create:client', 'read:client'],
      providers: ['read:client'],
      assignments: ['read:client'],
      investigations: ['read:client'],
      audits: ['read:client'],
      documents: ['create:client', 'read:client', 'update:client'],
      reports: ['read:client'],
      recovery: ['read:client'],
      notifications: ['read:client'],
      billing: ['read:client'],
    },
  },
  [RoleName.INVESTIGATOR]: {
    description: 'Assigned-case investigation, evidence, and draft report access.',
    permissions: {
      cases: ['read:assigned'],
      claimants: ['read:assigned'],
      providers: ['read:assigned'],
      assignments: ['read:assigned'],
      investigations: ['create:assigned', 'read:assigned', 'update:assigned'],
      documents: ['create:assigned', 'read:assigned', 'update:assigned'],
      reports: ['create:assigned', 'read:assigned', 'update:assigned'],
      notifications: ['read:assigned'],
    },
  },
  [RoleName.MEDICAL_AUDIT_REVIEWER]: {
    description: 'Assigned-case medical and audit review access.',
    permissions: {
      cases: ['read:assigned'],
      claimants: ['read:assigned'],
      providers: ['read:assigned'],
      assignments: ['read:assigned'],
      investigations: ['read:assigned'],
      audits: ['create:assigned', 'read:assigned', 'update:assigned'],
      documents: ['create:assigned', 'read:assigned', 'update:assigned'],
      reports: ['create:assigned', 'read:assigned', 'update:assigned'],
      notifications: ['read:assigned'],
    },
  },
  [RoleName.QC_REVIEWER]: {
    description: 'Assigned-case quality control and final report approval access.',
    permissions: {
      cases: ['read:assigned'],
      claimants: ['read:assigned'],
      providers: ['read:assigned'],
      assignments: ['read:assigned'],
      investigations: ['read:assigned'],
      audits: ['read:assigned'],
      documents: ['create:assigned', 'read:assigned'],
      reports: ['create:assigned', 'read:assigned', 'update:assigned'],
      notifications: ['read:assigned'],
    },
  },
  [RoleName.RECOVERY_TEAM]: {
    description: 'Assigned-case recovery workflow and supporting document access.',
    permissions: {
      cases: ['read:assigned'],
      claimants: ['read:assigned'],
      providers: ['read:assigned'],
      assignments: ['read:assigned'],
      documents: ['read:assigned'],
      reports: ['read:assigned'],
      recovery: ['create:assigned', 'read:assigned', 'update:assigned'],
      notifications: ['read:assigned'],
      billing: ['read'],
    },
  },
  [RoleName.FINANCE]: {
    description: 'Billing administration and read-only supporting case and recovery access.',
    permissions: {
      cases: ['read:assigned'],
      claimants: ['read:assigned'],
      providers: ['read:assigned'],
      documents: ['read:assigned'],
      recovery: ['read'],
      notifications: ['read:assigned'],
      billing: ['create', 'read', 'update', 'delete'],
    },
  },
};

async function main() {
  await Promise.all(
    Object.entries(roleDefinitions).map(([name, role]) =>
      prisma.role.upsert({
        where: { name: name as RoleName },
        update: role,
        create: { name: name as RoleName, ...role },
      }),
    ),
  );

  const systemRole = await prisma.role.findUniqueOrThrow({
    where: { name: RoleName.SUPER_ADMIN },
  });

  await prisma.user.upsert({
    where: { id: SYSTEM_ACTOR_ID },
    update: { roleId: systemRole.id },
    create: {
      id: SYSTEM_ACTOR_ID,
      roleId: systemRole.id,
      email: 'system-actor@claimsolution.invalid',
      firstName: 'System',
      lastName: 'Actor',
      passwordHash: 'SYSTEM_ACTOR_CANNOT_AUTHENTICATE',
      passwordHistory: [],
      passwordExpiresAt: new Date('2100-01-01T00:00:00.000Z'),
      status: 'INACTIVE',
    },
  });

  // Seed Phase 1 demo client
  const demoClient = await prisma.client.upsert({
    where: { email: 'contact@demoinsurance.test' },
    update: {
      companyName: 'Demo Insurance Co.',
      slaTatDays: 5,
      billingTier: 'STANDARD',
      isActive: true,
    },
    create: {
      companyName: 'Demo Insurance Co.',
      email: 'contact@demoinsurance.test',
      slaTatDays: 5,
      billingTier: 'STANDARD',
      isActive: true,
    },
  });

  // Seed Phase 1 human test users with bcrypt hashed passwords
  const DEMO_PASSWORD = 'DemoPass123!';
  const demoPasswordHash = await hashPassword(DEMO_PASSWORD);

  const clientAdminRole = await prisma.role.findUniqueOrThrow({
    where: { name: RoleName.CLIENT_ADMIN },
  });

  const opsAdminRole = await prisma.role.findUniqueOrThrow({
    where: { name: RoleName.OPERATIONS_ADMIN },
  });

  // 1. Super Admin
  await prisma.user.upsert({
    where: { email: 'superadmin@claimsolution.test' },
    update: {
      roleId: systemRole.id,
      passwordHash: demoPasswordHash,
      status: 'ACTIVE',
    },
    create: {
      roleId: systemRole.id,
      email: 'superadmin@claimsolution.test',
      firstName: 'Super',
      lastName: 'Admin',
      passwordHash: demoPasswordHash,
      passwordHistory: [],
      passwordExpiresAt: new Date('2100-01-01T00:00:00.000Z'),
      status: 'ACTIVE',
    },
  });

  // 2. Client Admin (linked to demo client)
  await prisma.user.upsert({
    where: { email: 'clientadmin@claimsolution.test' },
    update: {
      roleId: clientAdminRole.id,
      clientId: demoClient.id,
      passwordHash: demoPasswordHash,
      status: 'ACTIVE',
    },
    create: {
      roleId: clientAdminRole.id,
      clientId: demoClient.id,
      email: 'clientadmin@claimsolution.test',
      firstName: 'Client',
      lastName: 'Admin',
      passwordHash: demoPasswordHash,
      passwordHistory: [],
      passwordExpiresAt: new Date('2100-01-01T00:00:00.000Z'),
      status: 'ACTIVE',
    },
  });

  // 3. Operations Admin
  await prisma.user.upsert({
    where: { email: 'opsadmin@claimsolution.test' },
    update: {
      roleId: opsAdminRole.id,
      passwordHash: demoPasswordHash,
      status: 'ACTIVE',
    },
    create: {
      roleId: opsAdminRole.id,
      email: 'opsadmin@claimsolution.test',
      firstName: 'Operations',
      lastName: 'Admin',
      passwordHash: demoPasswordHash,
      passwordHistory: [],
      passwordExpiresAt: new Date('2100-01-01T00:00:00.000Z'),
      status: 'ACTIVE',
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });

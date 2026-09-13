export const caseStatuses = [
  'NEW',
  'ASSIGNED',
  'INVESTIGATION',
  'EVIDENCE_SUBMITTED',
  'AUDIT',
  'QC',
  'REPORT_APPROVED',
  'CLIENT_ACTION',
  'CLOSED',
] as const;

export type CaseStatus = (typeof caseStatuses)[number];

export const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export type Priority = (typeof priorities)[number];

export const riskLevels = priorities;
export type RiskLevel = Priority;

export const roles = [
  'SUPER_ADMIN',
  'OPERATIONS_ADMIN',
  'CLIENT_ADMIN',
  'INVESTIGATOR',
  'MEDICAL_AUDIT_REVIEWER',
  'QC_REVIEWER',
  'RECOVERY_TEAM',
  'FINANCE',
] as const;

export type RoleName = (typeof roles)[number];

export type CreateCaseInput = {
  clientId: string;
  claimNumber: string;
  policyNumber: string;
  claimType: string;
  claimAmount: number;
  priority: Priority;
  riskLevel?: RiskLevel;
  claimant: {
    firstName: string;
    lastName: string;
  };
  provider: {
    hospitalId: string;
    name: string;
    type: string;
  };
};

export type UpdateCaseInput = {
  priority?: Priority;
  riskLevel?: RiskLevel;
  version: number;
};

export type CreateAssignmentInput = {
  investigatorId: string;
  dueDate?: string;
  priority: Priority;
  notes?: string;
  version: number;
};

-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('SUPER_ADMIN', 'OPERATIONS_ADMIN', 'CLIENT_ADMIN', 'INVESTIGATOR', 'MEDICAL_AUDIT_REVIEWER', 'QC_REVIEWER', 'RECOVERY_TEAM', 'FINANCE');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('NEW', 'ASSIGNED', 'INVESTIGATION', 'EVIDENCE_SUBMITTED', 'AUDIT', 'QC', 'REPORT_APPROVED', 'CLIENT_ACTION', 'CLOSED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED');

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" "RoleName" NOT NULL,
    "description" TEXT,
    "permissions" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL,
    "company_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sla_tat_days" INTEGER NOT NULL,
    "billing_tier" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "client_id" UUID,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "password_history" JSONB NOT NULL DEFAULT '[]',
    "password_expires_at" TIMESTAMPTZ(6) NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "mfa_secret" TEXT,
    "failed_login_count" INTEGER NOT NULL DEFAULT 0,
    "lockout_expiry" TIMESTAMPTZ(6),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospitals" (
    "hospital_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "registration_number" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "hospitals_pkey" PRIMARY KEY ("hospital_id")
);

-- CreateTable
CREATE TABLE "providers" (
    "provider_id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("provider_id")
);

-- CreateTable
CREATE TABLE "claimants" (
    "claimant_id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "claimants_pkey" PRIMARY KEY ("claimant_id")
);

-- CreateTable
CREATE TABLE "cases" (
    "case_id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "claimant_id" UUID NOT NULL,
    "provider_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "claim_number" TEXT NOT NULL,
    "policy_number" TEXT NOT NULL,
    "claim_type" TEXT NOT NULL,
    "claim_amount" DECIMAL(15,2) NOT NULL,
    "priority" "Priority" NOT NULL,
    "risk_level" "Priority",
    "status" "CaseStatus" NOT NULL DEFAULT 'NEW',
    "due_date" DATE,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("case_id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "assignment_id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "investigator_id" UUID NOT NULL,
    "assigned_by" UUID NOT NULL,
    "due_date" DATE,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "Priority" NOT NULL,
    "notes" TEXT,
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "case_status_history" (
    "history_id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "from_status" "CaseStatus" NOT NULL,
    "to_status" "CaseStatus" NOT NULL,
    "changed_by" UUID NOT NULL,
    "change_reason" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_status_history_pkey" PRIMARY KEY ("history_id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "session_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "ip_address" INET NOT NULL,
    "user_agent" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "last_activity_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_client_id_role_id_idx" ON "users"("client_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "hospitals_registration_number_key" ON "hospitals"("registration_number");

-- CreateIndex
CREATE INDEX "cases_client_id_status_idx" ON "cases"("client_id", "status");

-- CreateIndex
CREATE INDEX "cases_priority_status_idx" ON "cases"("priority", "status");

-- CreateIndex
CREATE INDEX "cases_risk_level_status_idx" ON "cases"("risk_level", "status");

-- CreateIndex
CREATE UNIQUE INDEX "cases_client_id_claim_number_key" ON "cases"("client_id", "claim_number");

-- CreateIndex
CREATE INDEX "assignments_investigator_id_status_idx" ON "assignments"("investigator_id", "status");

-- CreateIndex
CREATE INDEX "assignments_case_id_idx" ON "assignments"("case_id");

-- CreateIndex
CREATE INDEX "case_status_history_case_id_created_at_idx" ON "case_status_history"("case_id", "created_at");

-- CreateIndex
CREATE INDEX "user_sessions_user_id_is_active_idx" ON "user_sessions"("user_id", "is_active");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "providers" ADD CONSTRAINT "providers_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("hospital_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_claimant_id_fkey" FOREIGN KEY ("claimant_id") REFERENCES "claimants"("claimant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("provider_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("case_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_investigator_id_fkey" FOREIGN KEY ("investigator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_status_history" ADD CONSTRAINT "case_status_history_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("case_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_status_history" ADD CONSTRAINT "case_status_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

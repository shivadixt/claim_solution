-- CreateEnum
CREATE TYPE "ClaimType" AS ENUM ('CASHLESS', 'REIMBURSEMENT');

-- AlterTable
ALTER TABLE "cases" ALTER COLUMN "claim_type" TYPE "ClaimType" USING "claim_type"::"ClaimType";

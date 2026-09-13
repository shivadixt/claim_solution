-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterTable
ALTER TABLE "cases"
ALTER COLUMN "risk_level" TYPE "RiskLevel"
USING "risk_level"::text::"RiskLevel";

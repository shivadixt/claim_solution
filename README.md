# Claim Solution — B2B Healthcare Claims Platform

**Claim Solution** is an enterprise B2B healthcare-claims investigation, audit, and recovery platform designed for insurance companies, Third Party Administrators (TPAs), hospitals, and operations teams.

---

## Current Status & Scope

- **Phase 1 (Complete)**: Authentication & RBAC (4 role tiers), multi-tenant client isolation, Case Intake form (`Client Portal`), interactive Case Triage & Investigator Assignment (`Operations Queue`), optimistic concurrency lock (`version`), automated SLA due date calculation, and public marketing interface.

---

## Tech Stack

- **Frontend (`apps/web`)**: Next.js 15 (App Router), React 19, TypeScript, CSS Custom Properties.
- **Backend API (`apps/api`)**: NestJS 11, TypeScript, Express, Throttler rate-limiting.
- **Database & Data Layer (`packages/db`)**: PostgreSQL 16 (via Docker Compose), Prisma ORM 6, TypeScript schema generator.
- **Contracts (`packages/contracts`)**: Shared DTO types and domain enums.
- **Containerization**: Docker Compose for local database orchestration.

---

## Prerequisites

- **Node.js**: v20.x or v22.x installed (Node v22.19.0 recommended).
- **Docker Desktop**: Docker Engine and Docker Compose installed and running.
- **Git**: Installed.

---

## Setup & Installation Guide

Follow these exact steps to clone, configure, and launch the application on your local machine.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Claim Solution"
```

### 2. Configure Environment Variables
Copy the example environment configuration to `.env`:
```bash
cp .env.example .env
```
> **Note**: The default values in `.env.example` are pre-configured to work out-of-the-box for local development with Docker Postgres on `localhost:5432`.

### 3. Install Dependencies (Playwright Workaround)
> [!IMPORTANT]
> Standard `npm install` may hang silently during post-install due to Playwright browser binary downloads. Use `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` to ensure a fast, clean installation.

**Windows PowerShell:**
```powershell
$env:PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1"; npm install
```

**macOS / Linux / Git Bash:**
```bash
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install
```

### 4. Start Local PostgreSQL Database
Spin up the local PostgreSQL container via Docker Compose:
```bash
docker compose up -d
```
Verify the container is running and healthy:
```bash
docker compose ps
```

### 5. Run Database Migrations & Seed Data
Execute Prisma migrations and populate initial system roles, clients, and test user accounts:

**Windows PowerShell:**
```powershell
$env:DATABASE_URL="postgresql://claim_solution:claim_solution_local@localhost:5432/claim_solution?schema=public"; npx prisma migrate dev --schema=packages/db/prisma/schema.prisma
$env:DATABASE_URL="postgresql://claim_solution:claim_solution_local@localhost:5432/claim_solution?schema=public"; npx prisma db seed --schema=packages/db/prisma/schema.prisma
```

**macOS / Linux / Git Bash:**
```bash
DATABASE_URL="postgresql://claim_solution:claim_solution_local@localhost:5432/claim_solution?schema=public" npx prisma migrate dev --schema=packages/db/prisma/schema.prisma
DATABASE_URL="postgresql://claim_solution:claim_solution_local@localhost:5432/claim_solution?schema=public" npx prisma db seed --schema=packages/db/prisma/schema.prisma
```

### 6. Start Development Servers

Open two terminal windows/tabs, or start the servers in background:

- **Start Backend API (Port 3001):**
  ```bash
  npm run dev:api
  ```
- **Start Web Application (Port 3000):**
  ```bash
  npm run dev:web
  ```

---

## Health Check & Verification

Once both servers are running, verify your setup:

- **NestJS API Health Endpoint**: `http://localhost:3001/api/v1/health` (Returns `{"status":"ok","version":"0.1.0"}`)
- **Public Web Portal**: `http://localhost:3000`
- **Login Portal**: `http://localhost:3000/login`

---

## Seeded Test Credentials

> [!WARNING]
> These credentials are **local development-only test accounts** seeded for local testing. Never use these credentials or hashes in any production environment.

| Role | Email | Shared Password | Default Portal URL |
|---|---|---|---|
| **Super Admin** | `superadmin@claimsolution.test` | `DemoPass123!` | `http://localhost:3000/admin` |
| **Client Admin** | `clientadmin@claimsolution.test` | `DemoPass123!` | `http://localhost:3000/client` |
| **Operations Admin** | `opsadmin@claimsolution.test` | `DemoPass123!` | `http://localhost:3000/ops` |
| **Field Investigator** | `investigator@claimsolution.test` | `DemoPass123!` | Assignable user account |

---

## Project Structure

```text
Claim Solution/
├── apps/
│   ├── api/                 # NestJS REST API service (Port 3001)
│   │   └── src/
│   │       ├── auth/        # Session authentication & login guards
│   │       ├── cases/       # Case management & SLA triage endpoints
│   │       ├── users/       # User querying & investigator listing
│   │       └── health/      # API health check controller
│   └── web/                 # Next.js 15 App Router frontend (Port 3000)
│       └── app/
│           ├── (auth)/      # Login interface
│           ├── (client)/    # Client Portal & Intake Form
│           ├── (ops)/       # Operations Case Queue & Triage dialogs
│           ├── (admin)/     # Super Admin Console
│           ├── (public)/    # Public website & Consultation Request form
│           └── api/         # Next.js route handlers forwarding to NestJS API
├── packages/
│   ├── db/                  # Prisma schema, migrations & seed script
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── seed.ts
│   └── contracts/           # Shared TypeScript interfaces & domain enums
├── docker-compose.yml       # Local PostgreSQL database container
├── .env.example             # Local environment variable template
└── package.json             # Root npm workspace configuration
```

---

## Scope Overview

### Completed (Phase 1)
- [x] Session Authentication & Role-Based Access Control (`SUPER_ADMIN`, `CLIENT_ADMIN`, `OPERATIONS_ADMIN`, `INVESTIGATOR`).
- [x] Client Case Intake (`CASHLESS` & `REIMBURSEMENT` claim types, claimant details, hospital provider mapping).
- [x] Operations Queue & Interactive Triage (Priority, Risk Level, automatic SLA `dueDate` calculation).
- [x] Investigator Assignment Engine (`POST /api/v1/cases/:id/assign`).
- [x] Optimistic Concurrency Locking (`version` version-check preventing overwrite collisions).
- [x] Re-imagined Navy & Gold enterprise UI with smooth scrolling navigation.

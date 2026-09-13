# Claim Solution

Phase 1 contains the public website, authentication and role-based access control, plus core case intake, triage, and investigator assignment.

## Repository layout

- `apps/web`: Next.js marketing site and role-specific portals.
- `apps/api`: NestJS API under `/api/v1`.
- `packages/contracts`: workflow and API types shared by applications.
- `packages/db`: PostgreSQL schema and seed data.
- `tests`: end-to-end tests and reusable fixtures.

## Configuration

Copy no secrets into this repository. Database credentials, JWT signing keys, and MFA encryption keys must be injected through the configured secrets manager. `.env.example` contains only safe local configuration names.


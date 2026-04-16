# Supabase Phase 4 Setup

This project is now wired so the Phase 4 schema can be pushed to a real Supabase project without manual file copying.

## What was added

- `supabase/config.toml` - generated Supabase CLI project config
- `frontend/scripts/sync-supabase-migrations.ps1` - mirrors canonical SQL migrations into `supabase/migrations/`
- `frontend/package.json` scripts for local Supabase workflows
- `database/migrations/20260416_phase_04_auth_foundation.sql` - the canonical Phase 4 auth/schema migration

## Migration source of truth

The source of truth remains:

- `database/migrations/*.sql`

Supabase CLI reads from:

- `supabase/migrations/*.sql`

Before any Supabase CLI command that applies schema changes, run the sync step. The npm scripts below already do that for you.

## Required project decisions

Before pushing this schema to production:

1. Create the Supabase project in **EU (Frankfurt)**.
2. Confirm the Data Processing Agreement is signed before storing live biomarker results.
3. Record the project ref and the database password for the linked project.

## Frontend environment variables

Populate these values in:

- `frontend/.env.local`

Required Phase 4 keys:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## CLI workflow

Run all commands from:

- `frontend/`

### 1. Sync the migrations into the Supabase folder

```powershell
npm run db:sync
```

### 2. Link the repo to the real Supabase project

```powershell
npm run db:link -- --project-ref <your-project-ref> -p <your-db-password>
```

### 3. Push the Phase 4 migration to the linked project

```powershell
npm run db:push
```

### 4. Optional local stack commands

```powershell
npm run db:start
npm run db:status
npm run db:stop
```

## Phase 4 verification checklist

- `npm run build` succeeds in `frontend/`
- `npm run db:sync` copies the migration into `supabase/migrations/`
- `npm run db:link` completes against the real project
- `npm run db:push` applies the migration
- `frontend/.env.local` contains the live project URL + keys
- auth routes load and protected routes redirect correctly when signed out

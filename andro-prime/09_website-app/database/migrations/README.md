# Database migrations — canonical source

**Canonical migration source.** Migrations in this directory are the source of truth.

The `09_website-app/supabase/migrations/` directory is a build artifact synced from here by `frontend/scripts/sync-supabase-migrations.ps1` whenever `npm run db:push` or `npm run db:start` is invoked. The build-artifact directory is gitignored (see `09_website-app/supabase/.gitignore`).

**Add new migrations here only.** Do not hand-edit files under `supabase/migrations/` — they will be overwritten on the next sync.

## Conventions

- Filename: `YYYYMMDD_short_description.sql` — lowercase, snake_case, date prefix sorts chronologically.
- One transaction per file (`begin;` / `commit;`).
- Migrations are applied in filename order.
- A migration must be idempotent where practical (`create table if not exists`, `drop policy if exists`, etc.).

## Current migrations

See `../schema/schema.md` for the canonical list and per-table descriptions.

## Frozen tables

The `founding_member_deposits` table (created in `20260416_phase_04_auth_foundation.sql`) is **FROZEN as of 2026-05-08**. The £75 deposit mechanic was shelved; no code writes to the table. Do not extend it. New founding-member opt-ins go to `founding_member_list` (see `20260509_create_founding_member_list.sql`).

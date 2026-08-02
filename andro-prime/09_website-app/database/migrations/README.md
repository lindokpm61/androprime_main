# Database migrations — canonical source

**Canonical migration source.** Migrations in this directory are the source of truth.

The `09_website-app/supabase/migrations/` directory is a build artifact synced from here by `frontend/scripts/sync-supabase-migrations.ps1` whenever `npm run db:push` or `npm run db:start` is invoked. The build-artifact directory is gitignored (see `09_website-app/supabase/.gitignore`).

**Add new migrations here only.** Do not hand-edit files under `supabase/migrations/` — they will be overwritten on the next sync.

## Conventions

- Filename: `YYYYMMDD_short_description.sql` — lowercase, snake_case, date prefix sorts chronologically.
- One transaction per file (`begin;` / `commit;`).
- Migrations are applied in filename order.
- A migration must be idempotent where practical (`create table if not exists`, `drop policy if exists`, etc.).
- **Every file here must be staged into git in the same commit as the change it supports.** This repo stages by path (`git add -A` is forbidden), so an applied-but-untracked migration is the likely omission, not a remote one: it exists in production and in your working tree while the record of it exists nowhere. `test-content-doctor.ts` fails if any file in this directory is untracked.
- **A superseded migration is corrected by a NEW file, never by editing the applied one.** Rewriting a file that has already run hides the fact that it ran in its weaker form. Put a `SUPERSEDED BY <file>` line in the old file's header and in the section it applies to, and name the superseded version in the new file's header.
- **The applied-migration ledger can hold more entries than this directory holds files, and the difference must be written down.** A draft that was superseded within the same session leaves a ledger row with no file (see `20260801_content_state_guards.sql`, which is one file and two ledger entries). Record it in the surviving file's header, so a reader counting one against the other is not left to re-derive it.

## Current migrations

See `../schema/schema.md` for the canonical list and per-table descriptions.

## Frozen tables

The `founding_member_deposits` table (created in `20260416_phase_04_auth_foundation.sql`) is **FROZEN as of 2026-05-08**. The £75 deposit mechanic was shelved; no code writes to the table. Do not extend it. New founding-member opt-ins go to `founding_member_list` (see `20260509_create_founding_member_list.sql`).

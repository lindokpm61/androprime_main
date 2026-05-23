begin;

-- Supplement early-access opt-in list. Phase 0a mechanic introduced
-- 2026-05-23 when the supplement launch was deferred behind the kit launch.
-- Mirrors `founding_member_list`: email-capture marker only, no payment,
-- no commitment. Powers the `supplement-waitlist` CTA on Kit 1/2/3 result
-- cards (Vitamin D / B12 / collagen / normal-T paths) until the supplement
-- range goes live.

create table if not exists public.supplement_waitlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  source_marker text,
  source_kit text,
  interested_in_product text,
  listed_at timestamptz not null default now(),
  unlisted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists supplement_waitlist_email_active_idx
  on public.supplement_waitlist (lower(email)) where unlisted_at is null;

alter table public.supplement_waitlist enable row level security;

drop policy if exists "users read own supplement waitlist" on public.supplement_waitlist;
create policy "users read own supplement waitlist"
  on public.supplement_waitlist
  for select
  using (auth.uid() = user_id);

commit;

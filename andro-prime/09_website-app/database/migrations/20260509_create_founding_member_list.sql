begin;

-- Non-cash founding-member opt-in list. Replaces the deposit-based founding
-- member mechanic (the £75 deposit was shelved 2026-05-08). This table is an
-- email-capture marker only — no payment, no commitment.

create table if not exists public.founding_member_list (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  first_name text,
  last_name text,
  source text not null default 'public_form',
  listed_at timestamptz not null default now(),
  unlisted_at timestamptz
);

create unique index if not exists founding_member_list_email_active_idx
  on public.founding_member_list (lower(email)) where unlisted_at is null;

alter table public.founding_member_list enable row level security;

drop policy if exists "users read own membership" on public.founding_member_list;
create policy "users read own membership"
  on public.founding_member_list
  for select
  using (auth.uid() = user_id);

commit;

begin;

-- Low-T nurture consent (2026-06-04). Backs the explicit Art 9(2)(a) opt-in that
-- gates the low-testosterone nurture programme. A clinically-low result (T < 12)
-- routes to GP referral; SEPARATELY, and only if the customer gives this specific
-- explicit opt-in, we store the result + keep them informed about the future
-- clinical service. This consent is its own un-bundled record, distinct from the
-- point-of-purchase test-processing consent and from general marketing consent.
-- Lawful basis + conditions: 03_compliance/2026-06-04-lowt-nurture-lawful-basis.md.
--
-- One active row per email (withdrawn_at IS NULL). Withdrawal sets withdrawn_at;
-- the row is retained for accountability (UK GDPR Art 7(1)). consent_version
-- records which consent wording the customer agreed to.

create table if not exists public.lowt_nurture_consent (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  consent_version text not null,
  source text not null default 'result_card',
  consented_at timestamptz not null default now(),
  withdrawn_at timestamptz
);

create unique index if not exists lowt_nurture_consent_email_active_idx
  on public.lowt_nurture_consent (lower(email)) where withdrawn_at is null;

alter table public.lowt_nurture_consent enable row level security;

drop policy if exists "users read own lowt nurture consent" on public.lowt_nurture_consent;
create policy "users read own lowt nurture consent"
  on public.lowt_nurture_consent
  for select
  using (auth.uid() = user_id);

commit;

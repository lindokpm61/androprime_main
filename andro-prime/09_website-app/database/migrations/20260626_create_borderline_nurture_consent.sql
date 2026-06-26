begin;

-- Borderline-testosterone nurture consent (2026-06-26). Backs the explicit
-- Art 9(2)(a) opt-in that gates the borderline-result nurture programme (seq-03d).
-- A borderline result (total T 12–<15 nmol/L) is shown on the dashboard as a
-- low-end-of-normal result; SEPARATELY, and only if the customer gives this
-- specific explicit opt-in, we keep them informed about a lower-end result. This
-- consent is its own un-bundled record, distinct from the point-of-purchase
-- test-processing consent, from general marketing consent, and from the low-T
-- nurture consent. Mirrors lowt_nurture_consent (20260604). Fix spec:
-- 09_website-app/docs/seq-03-results-signal-fix-spec-2026-06-26.md.
--
-- One active row per email (withdrawn_at IS NULL). Withdrawal sets withdrawn_at;
-- the row is retained for accountability (UK GDPR Art 7(1)). consent_version
-- records which consent wording the customer agreed to.

create table if not exists public.borderline_nurture_consent (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  consent_version text not null,
  source text not null default 'result_card',
  consented_at timestamptz not null default now(),
  withdrawn_at timestamptz
);

create unique index if not exists borderline_nurture_consent_email_active_idx
  on public.borderline_nurture_consent (lower(email)) where withdrawn_at is null;

alter table public.borderline_nurture_consent enable row level security;

drop policy if exists "users read own borderline nurture consent" on public.borderline_nurture_consent;
create policy "users read own borderline nurture consent"
  on public.borderline_nurture_consent
  for select
  using (auth.uid() = user_id);

commit;

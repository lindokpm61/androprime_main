-- 20260531_create_events.sql
-- First-party analytics events: vendor-neutral capture + GA4 Measurement Protocol mirror.
-- Privacy-by-design: NO raw PII (email kept only as a one-way email_hash). Server-side writes
-- use the service-role key (which bypasses RLS). First-party + transactional + pseudonymised,
-- so no PECR cookie-consent banner is required. Client behavioural GA4 (cookies + Consent
-- Mode v2) is a later phase. See 06_marketing/analytics/conversion-tracking.md.

begin;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  occurred_at timestamptz not null default now(),
  anonymous_id text,
  email_hash text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  fpr_tid text,
  referrer text,
  landing_path text,
  value numeric,
  currency text,
  kit_id text,
  sku text,
  props jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists events_name_time_idx on public.events (event_name, occurred_at desc);
create index if not exists events_time_idx on public.events (occurred_at desc);
create index if not exists events_source_medium_idx on public.events (utm_source, utm_medium);
create index if not exists events_fpr_idx on public.events (fpr_tid);
create index if not exists events_email_hash_idx on public.events (email_hash);

-- RLS on with no permissive policy: anon/auth get no access; server-side writes use the
-- service-role key, which bypasses RLS. There is no user-facing read path for analytics rows.
alter table public.events enable row level security;

commit;

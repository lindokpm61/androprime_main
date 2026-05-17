begin;

-- Stripe webhook idempotency ledger. Stripe delivers events at-least-once and
-- retries on network failure; without dedupe a retried invoice.payment_failed
-- would re-emit the Customer.io trigger and re-send dunning mail (T-07). The
-- webhook records each Stripe event id here before processing and short-circuits
-- on any id it has already seen.

create table if not exists public.processed_stripe_events (
  event_id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now()
);

-- Writes are performed only by the Stripe webhook via the service-role admin
-- client (bypasses RLS). RLS is enabled with no policies so the table is
-- inaccessible to authenticated users.
alter table public.processed_stripe_events enable row level security;

commit;

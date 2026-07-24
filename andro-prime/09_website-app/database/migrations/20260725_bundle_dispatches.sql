begin;

-- Bundle dispatches (2026-07-25). Backs the two-kit bundle mechanism: one Stripe
-- payment ships kit 1 immediately (existing kit_orders + Vitall flow, unchanged),
-- and this table records the SECOND kit that is owed and dispatched later by a
-- trigger. Three bundle SKUs share the machinery:
--   'confirmation' — Kit 1 base; the second kit ships only on a low/borderline
--                    first result (result trigger). On an all-clear the prepaid
--                    kit is BANKED and auto-dispatched at the recheck (bank path).
--   'prove_it'     — Kit 2 base; second kit dispatched on a timer (~day 90).
--   'full_picture' — Kit 3 base; second kit (a Kit 2 energy-recovery) on a timer.
--
-- One row per owed second kit. The daily bundle-sweep job
-- (app/api/jobs/bundle-sweep) advances the state machine:
--   scheduled -> trigger_met -> awaiting_window -> dispatched
-- with 'not_needed' / 'cancelled' as off-ramps. Everything is gated behind the
-- BUNDLES_ENABLED flag — no row is ever written while the flag is OFF. Follows
-- the shape of the existing order/consent migrations (RLS, shared updated_at
-- trigger, service-role writes). Whole design + open gates (solicitor D2 bundle
-- terms, F3/F4 build gates, Ewa confirmation threshold + interval) live in the
-- 09_website-app STATE / the approved bundle plan.

create table if not exists public.bundle_dispatches (
  id uuid primary key default gen_random_uuid(),
  parent_order_id uuid not null references public.kit_orders (id) on delete cascade,
  -- Denormalised from the parent order for RLS (authenticated read-own).
  user_id uuid not null references public.users (id) on delete cascade,
  -- The SECOND kit to ship. May differ from the base kit — Full-picture ships a
  -- Kit 2 (energy-recovery) retest off a Kit 3 (hormone-recovery) base.
  kit_type public.kit_type not null,
  bundle_type text not null
    check (bundle_type in ('confirmation', 'prove_it', 'full_picture')),
  -- State machine. 'not_needed' is included for forward-compat (a future explicit
  -- "no second kit owed" off-ramp) even though today's bank path keeps an
  -- all-clear Confirmation row 'scheduled' with a recheck due_at rather than
  -- retiring it.
  status text not null default 'scheduled'
    check (status in (
      'scheduled', 'trigger_met', 'awaiting_window', 'dispatched', 'not_needed', 'cancelled'
    )),
  -- Timed bundles: purchase + ~90d, set at purchase. Confirmation: null until the
  -- first result, then result_date + CONFIRMATION_INTERVAL_DAYS on a low/borderline
  -- result (trigger), or the recheck date when banked.
  due_at timestamptz,
  -- When the trigger was satisfied (sweep stamps it on scheduled -> trigger_met).
  triggered_at timestamptz,
  -- When the address-check email was sent — starts the soft confirm/update window.
  address_check_at timestamptz,
  -- The second kit's kit_orders row, created at dispatch time.
  second_order_id uuid references public.kit_orders (id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- The daily sweep scans by (status, due_at); the result hook and reporting look
-- rows up by their parent order.
create index if not exists idx_bundle_dispatches_status_due_at
  on public.bundle_dispatches (status, due_at);
create index if not exists idx_bundle_dispatches_parent_order_id
  on public.bundle_dispatches (parent_order_id);

drop trigger if exists set_bundle_dispatches_updated_at on public.bundle_dispatches;
create trigger set_bundle_dispatches_updated_at
before update on public.bundle_dispatches
for each row
execute procedure public.set_updated_at();

alter table public.bundle_dispatches enable row level security;

-- Authenticated users may read their own owed-kit rows; no anon access. Every
-- write goes through the service-role admin client (Stripe webhook + sweep),
-- which bypasses RLS, so there is deliberately no insert/update policy.
drop policy if exists "bundle_dispatches_select_own" on public.bundle_dispatches;
create policy "bundle_dispatches_select_own"
on public.bundle_dispatches
for select
to authenticated
using (auth.uid() = user_id);

commit;

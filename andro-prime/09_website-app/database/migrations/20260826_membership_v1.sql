-- Membership v1: entitlement model, retest dispatch reuse, and between-tests check-ins.
--
-- Membership v1 is DELIBERATELY NOT the supplement membership. It carries the
-- retest entitlement, the dashboard and trend, the check-in loop and member
-- pricing. No physical goods (Keith, 2026-08-26), which is what decouples it
-- from a supply chain that has had no supplier contact yet.
--
-- Three changes, and two of them exist to REUSE machinery rather than add any:
--
--   1. `memberships` — the only genuinely new object. A date plus an active
--      check. There is no credit ledger: the 2026-08-24 reframing made the
--      benefit an entitlement conditional on being an active member on the
--      stated retest date, so there is nothing to issue, redeem, expire or
--      carry as a liability.
--
--   2. `bundle_dispatches` gains `source` and a nullable `parent_order_id`.
--      That table is already "a kit owed to a user at a future date", with a
--      daily sweep (app/api/jobs/bundle-sweep) that dispatches on `due_at` and
--      an address-check email ahead of it. A membership retest is the same
--      object with a different reason, so it reuses the sweep instead of
--      growing a second dispatch path that would have to be kept in step.
--
--   3. `symptom_answers.order_id` becomes nullable. It is currently NOT NULL,
--      which makes the between-tests check-in loop impossible to write at all:
--      a check-in belongs to a member and a date, not to an order.
--
-- Everything the app does with these is gated behind MEMBERSHIP_ENABLED
-- (lib/flags.ts), so this migration is inert until that flag is on.

begin;

-- ---------------------------------------------------------------------------
-- 1. memberships
-- ---------------------------------------------------------------------------
-- Its own table rather than a row in `supplement_subscriptions`: a membership
-- is not a supplement, and that table's name is already noted as misleading.
-- Reuses public.subscription_status so the Stripe webhook's four existing
-- lifecycle branches map across unchanged.

create table if not exists public.memberships (
    id uuid default gen_random_uuid() not null,
    user_id uuid not null,
    stripe_subscription_id text not null,
    status public.subscription_status default 'incomplete'::public.subscription_status not null,
    started_at timestamp with time zone default timezone('utc'::text, now()) not null,
    current_period_end timestamp with time zone,
    -- The entitlement. A date, nothing more. NULL until the membership first
    -- becomes active, because a retest owed by a membership that never started
    -- is not owed at all.
    next_retest_due_at timestamp with time zone,
    -- Stamped when the sweep actually creates the retest order, so a replay
    -- cannot dispatch twice.
    retest_claimed_at timestamp with time zone,
    cancelled_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint memberships_pkey primary key (id),
    constraint memberships_user_id_fkey foreign key (user_id)
        references public.users (id) on delete cascade,
    constraint memberships_stripe_subscription_id_key unique (stripe_subscription_id)
);

-- One live membership per person. A cancelled row must be allowed to coexist
-- with a new one (someone resubscribes), so this is a PARTIAL unique index on
-- the states that actually mean "currently a member" rather than a plain
-- unique on user_id.
create unique index if not exists memberships_one_live_per_user
    on public.memberships (user_id)
    where status in ('incomplete', 'trialing', 'active', 'past_due');

create index if not exists memberships_user_id_idx on public.memberships (user_id);

-- The sweep's lookup: memberships with a retest due and not yet claimed.
create index if not exists memberships_retest_due_idx
    on public.memberships (next_retest_due_at)
    where retest_claimed_at is null;

alter table public.memberships enable row level security;

-- Read-your-own only. Every write is service-role, from the Stripe webhook and
-- the sweep, exactly as supplement_subscriptions works. A member must never be
-- able to move their own retest date.
drop policy if exists memberships_select_own on public.memberships;
create policy memberships_select_own on public.memberships
    for select to authenticated using (auth.uid() = user_id);

drop trigger if exists set_memberships_updated_at on public.memberships;
create trigger set_memberships_updated_at
    before update on public.memberships
    for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 2. bundle_dispatches: generalise from "the second kit of a bundle" to
--    "a kit owed to a user at a future date"
-- ---------------------------------------------------------------------------

alter table public.bundle_dispatches
    add column if not exists source text not null default 'bundle';

do $$
begin
    if not exists (
        select 1 from pg_constraint where conname = 'bundle_dispatches_source_check'
    ) then
        alter table public.bundle_dispatches
            add constraint bundle_dispatches_source_check
            check (source in ('bundle', 'membership'));
    end if;
end $$;

-- A membership retest has no parent bundle order. The default above means every
-- existing row is already 'bundle', so this widening is a no-op for them.
alter table public.bundle_dispatches alter column parent_order_id drop not null;

-- ...but a bundle dispatch must still HAVE a parent, or the widening would
-- silently allow an orphaned bundle row. The nullability moves from the column
-- to the source that is allowed to use it.
do $$
begin
    if not exists (
        select 1 from pg_constraint where conname = 'bundle_dispatches_parent_required_for_bundle'
    ) then
        alter table public.bundle_dispatches
            add constraint bundle_dispatches_parent_required_for_bundle
            check (source <> 'bundle' or parent_order_id is not null);
    end if;
end $$;

-- Same reasoning in the other direction: a membership dispatch must name the
-- membership that owes it.
alter table public.bundle_dispatches
    add column if not exists membership_id uuid;

do $$
begin
    if not exists (
        select 1 from pg_constraint where conname = 'bundle_dispatches_membership_id_fkey'
    ) then
        alter table public.bundle_dispatches
            add constraint bundle_dispatches_membership_id_fkey
            foreign key (membership_id) references public.memberships (id) on delete set null;
    end if;

    if not exists (
        select 1 from pg_constraint where conname = 'bundle_dispatches_membership_required'
    ) then
        alter table public.bundle_dispatches
            add constraint bundle_dispatches_membership_required
            check (source <> 'membership' or membership_id is not null);
    end if;
end $$;

-- One outstanding retest per membership. Without this a webhook replay or a
-- double sweep run creates two owed kits, which is a real kit and real postage.
create unique index if not exists bundle_dispatches_one_open_per_membership
    on public.bundle_dispatches (membership_id)
    where source = 'membership' and status in ('scheduled', 'address_check_sent');

-- ---------------------------------------------------------------------------
-- 3. symptom_answers: allow a check-in that belongs to no order
-- ---------------------------------------------------------------------------
-- order_id is NOT NULL today, so the between-tests loop cannot write a row at
-- all. A check-in belongs to a member and a date. Widen the column, then add a
-- context discriminator so a row still has to say which kind it is: the point
-- is to allow the new shape, not to allow a shapeless row.

alter table public.symptom_answers
    add column if not exists context text not null default 'order';

alter table public.symptom_answers alter column order_id drop not null;

do $$
begin
    if not exists (
        select 1 from pg_constraint where conname = 'symptom_answers_context_check'
    ) then
        alter table public.symptom_answers
            add constraint symptom_answers_context_check
            check (context in ('order', 'checkin'));
    end if;

    -- An 'order' row keeps its order_id; a 'checkin' row must not carry one,
    -- so the two kinds can never be confused by a reader or a query.
    if not exists (
        select 1 from pg_constraint where conname = 'symptom_answers_context_shape'
    ) then
        alter table public.symptom_answers
            add constraint symptom_answers_context_shape
            check (
                (context = 'order'   and order_id is not null)
             or (context = 'checkin' and order_id is null)
            );
    end if;
end $$;

-- The check-in loop reads "this member's answers for this marker over time".
create index if not exists symptom_answers_checkin_idx
    on public.symptom_answers (user_id, question_key, captured_at desc)
    where context = 'checkin';

commit;

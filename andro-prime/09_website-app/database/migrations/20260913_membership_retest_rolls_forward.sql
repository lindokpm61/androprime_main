-- Membership retest: roll the entitlement forward, and repair the two guards it
-- is about to start leaning on. Defect 3b, Keith 2026-09-13.
--
-- ✅ APPLIED 2026-09-13 to the production project (phqrjtnflovicgkngieu), on
-- Keith's explicit go-ahead. Verified afterwards by reading the live catalogue
-- rather than the tool's success flag: all four objects present and correct.
--
-- ⚠ LEDGER NAME DOES NOT MATCH THIS FILENAME, recorded here because the README
-- requires the difference to be written down rather than re-derived. The ledger
-- row is version `20260913002042`, name `membership_retest_rolls_forward` — the
-- connector stamps its own timestamp version and takes the snake_case name, so
-- the date prefix in this filename and the ledger version are different numbers
-- for the same change. One file, one ledger entry, two spellings.
--
-- THE DECISION. 3b: the membership retest is a one-shot. `next_retest_due_at` is
-- written once by `createMembership` and `retest_claimed_at` is stamped once by
-- the nightly sweep, whose selection query is `retest_claimed_at is null`. After
-- a member claims his one retest he pays GBP 47/month forever and the
-- entitlement never returns. The year-1 forecast, `/membership` and the account
-- screen's own "your next one is a year after that" all say one retest PER YEAR.
-- Keith took option 1 of the two offered: the dispatch table holds one row per
-- retest and IS the double-dispatch guard, so the date is free to roll forward.
--
-- ⚠ TWO DEFECTS WERE FOUND IN THAT GUARD WHILE IMPLEMENTING IT, and both are
-- only harmless while the terminator this change removes is still in place. The
-- code half of 3b must not ship without this file.
--
-- ---------------------------------------------------------------------------
-- 1. `membership_retest` WAS not an allowed `bundle_type`, so EVERY membership
--    retest insert would have failed
-- ---------------------------------------------------------------------------
-- `app/api/jobs/bundle-sweep/route.ts` inserts `bundle_type: 'membership_retest'`.
-- `bundle_dispatches_bundle_type_check` (20260725) allowed only 'confirmation',
-- 'prove_it' and 'full_picture'. The string appears nowhere in any migration.
-- Verified against the live database 2026-09-13: the constraint still names
-- three values.
--
-- Nobody noticed because MEMBERSHIP_ENABLED has never been on, so the insert has
-- never run. It would have failed for 100% of members, and the sweep claims
-- BEFORE it inserts, so each member would have been stamped as claimed and sent
-- nothing. Under the old one-shot rule that is permanent: his single lifetime
-- retest, consumed by a constraint violation.

begin;

alter table public.bundle_dispatches
    drop constraint if exists bundle_dispatches_bundle_type_check;

alter table public.bundle_dispatches
    add constraint bundle_dispatches_bundle_type_check
    check (bundle_type in ('confirmation', 'prove_it', 'full_picture', 'membership_retest'));

-- The two discriminators must agree, or a row can claim to be a membership
-- retest under a bundle type that means something else. Cheap, and it is the
-- kind of pair that drifts precisely because each half looks correct alone.
alter table public.bundle_dispatches
    drop constraint if exists bundle_dispatches_type_matches_source;

alter table public.bundle_dispatches
    add constraint bundle_dispatches_type_matches_source
    check (
        (source = 'membership' and bundle_type = 'membership_retest')
     or (source = 'bundle'     and bundle_type <> 'membership_retest')
    );

-- ---------------------------------------------------------------------------
-- 2. The one-open-retest index guards a status that does not exist
-- ---------------------------------------------------------------------------
-- `bundle_dispatches_one_open_per_membership` (20260826) is partial on
--   status in ('scheduled', 'address_check_sent')
-- but `bundle_dispatches_status_check` has never allowed 'address_check_sent'.
-- The real state machine is
--   scheduled -> trigger_met -> awaiting_window -> dispatched
-- so the guard covers exactly ONE of the three open states. A membership whose
-- retest row has advanced to 'trigger_met' is unprotected.
--
-- That is invisible today only because `retest_claimed_at` permanently removes
-- the membership from the sweep's query. Remove the terminator without this and
-- a second owed kit becomes insertable mid-flight: real kit, real postage.
--
-- The three OPEN states are covered and the three terminal ones deliberately are
-- not: 'dispatched', 'cancelled' and 'not_needed' must be free to coexist with
-- next year's row, which is the entire point of rolling forward.

drop index if exists public.bundle_dispatches_one_open_per_membership;

create unique index bundle_dispatches_one_open_per_membership
    on public.bundle_dispatches (membership_id)
    where source = 'membership'
      and status in ('scheduled', 'trigger_met', 'awaiting_window');

-- ---------------------------------------------------------------------------
-- 3. The sweep's lookup index stops assuming the claim is permanent
-- ---------------------------------------------------------------------------
-- `memberships_retest_due_idx` is partial on `retest_claimed_at is null`, which
-- encodes the one-shot rule in the index itself: after the first claim the row
-- leaves the index forever. With the date as the control, the query is simply
-- "due on or before now", so the predicate goes and the column becomes what its
-- name always suggested: a record of WHEN the last retest was released, not a
-- gate on whether another may ever be.

drop index if exists public.memberships_retest_due_idx;

create index memberships_retest_due_idx
    on public.memberships (next_retest_due_at);

-- ---------------------------------------------------------------------------
-- What is NOT in this file, deliberately
-- ---------------------------------------------------------------------------
-- No column is added and none is dropped. `retest_claimed_at` stays, with its
-- meaning narrowed rather than its storage changed, so nothing has to be
-- backfilled and the change is reversible by reverting the code alone. The
-- rolling-forward itself is one UPDATE in the sweep, compare-and-set on the old
-- due date, and it lives in code because it is a rule rather than a shape.

commit;

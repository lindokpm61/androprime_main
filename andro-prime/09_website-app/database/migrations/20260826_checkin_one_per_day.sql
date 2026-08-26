-- Check-in loop: one answer per member, per question, per day.
--
-- Follow-on to 20260826_membership_v1.sql, which made `symptom_answers.order_id`
-- nullable and added the `context` discriminator so a between-tests check-in
-- could be written at all. That migration deliberately moved the nullability
-- into CHECK constraints rather than letting it simply disappear. This one
-- closes the matching gap on UNIQUENESS, for the same reason.
--
-- The table's original guard is `unique (order_id, question_key)`. Under
-- Postgres NULL semantics two NULLs are distinct, so that constraint stops
-- constraining the moment order_id is NULL: every check-in row is unique to it,
-- including a hundred duplicates of the same tap on the same day.
--
-- That is not a cosmetic problem. The loop's whole output is counted, not
-- read — "logged 22 of 22 days", a streak, an adherence bar per day — and a
-- double-tap or a retried POST would inflate a member's streak by writing the
-- same fact twice. The API route reads-then-writes, which handles the ordinary
-- case, but read-then-write is not atomic and two concurrent taps race straight
-- through it. The guard belongs in the database.
--
-- The day key is UTC and stated explicitly. `captured_at::date` would use the
-- session TimeZone GUC, which makes the expression STABLE rather than
-- IMMUTABLE and is therefore not indexable at all; it would also silently give
-- two members in different zones two different definitions of "today".
-- lib/membership/checkin.ts:dayKey() computes the same key the same way, and
-- the two MUST stay in step.
--
-- Inert until MEMBERSHIP_ENABLED is on: nothing writes a `checkin` row before
-- then, so the partial index covers zero rows today.

begin;

create unique index if not exists symptom_answers_one_checkin_per_day
    on public.symptom_answers (
        user_id,
        question_key,
        ((captured_at at time zone 'utc')::date)
    )
    where context = 'checkin';

commit;

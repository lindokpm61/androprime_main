-- 20260805_content_channels_coverage_pause.sql
--
-- Adds an EXPIRING, REASONED pause to a planned channel, so doctor invariant 10 (forward
-- coverage) can tell "this channel is deliberately dark and here is why" apart from "this
-- channel silently stopped producing".
--
-- WHY THIS EXISTS. On 2026-08-05 the Facebook lane had published nothing for a week and the
-- board was green, because every one of the doctor's nine invariants checks that stores AGREE
-- with each other. Four approved assets sitting unscheduled is a state in which every store
-- agrees perfectly. Consistency and coverage fail in opposite directions, and a suite that
-- only checks agreement reports its cleanest result exactly when the pipeline has stopped.
--
-- WHY THE PAUSE MUST EXPIRE. Substack is currently blocked on an expired session token, which
-- is a real gap with a real reason. Without a way to record that, I10 would go red on Substack
-- every night indefinitely, and the doctor's own governing rule is that a check which always
-- alarms is a check nobody reads (it is why the nightly baseline was tuned so carefully in the
-- first place). But an indefinite pause is how a gap becomes invisible again, which is the
-- failure this invariant exists to end. So a pause carries a DATE it dies on. When it lapses,
-- the channel goes red again and someone has to look. Renewing is a decision; forgetting is not
-- a way to make one.
--
-- Both columns are nullable and purely additive. No existing row changes meaning.

alter table public.content_channels
  add column if not exists coverage_paused_until date,
  add column if not exists coverage_pause_reason text;

comment on column public.content_channels.coverage_paused_until is
  'Date this coverage pause EXPIRES (inclusive). Null means the channel is expected to produce. '
  'Past this date the channel is red again in doctor I10, deliberately: a pause that cannot lapse '
  'is indistinguishable from a channel nobody is watching.';

comment on column public.content_channels.coverage_pause_reason is
  'Why this channel is deliberately dark. Required whenever coverage_paused_until is set; the '
  'CHECK below refuses a pause with no stated reason, because an unexplained pause is the same '
  'silence the invariant exists to break.';

-- A pause with no reason is not a decision, it is a mute button. Refuse it.
alter table public.content_channels
  drop constraint if exists content_channels_coverage_pause_needs_reason;

alter table public.content_channels
  add constraint content_channels_coverage_pause_needs_reason
  check (
    coverage_paused_until is null
    or (coverage_pause_reason is not null and btrim(coverage_pause_reason) <> '')
  );

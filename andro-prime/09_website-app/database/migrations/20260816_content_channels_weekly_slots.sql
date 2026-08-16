-- content_channels.weekly_slots — make the documented cadence a number the doctor can read.
--
-- THE GAP THIS CLOSES. `unified-content-calendar.md` gives LinkedIn TWO slots a week (Mon + Thu)
-- and Facebook ONE (Tue), confirmed by Keith 2026-07-09 and restated in the Lane 1 definition.
-- Weeks 34 and 35 both had their Thursday filled and their Monday empty, and NO CHECK COULD SEE IT:
-- doctor I10 asks whether a channel has anything queued in the next seven days, so a single post
-- satisfies a channel that owes two. A lane running at half its cadence passed green.
--
-- The defect is not that I10 was wrong, it is that the expected count existed only in prose. I10
-- compared against 1 because 1 is the only number available to a check whose input is "is this list
-- non-empty". This column is that number, on the row, where the invariant already reads.
--
-- DEFAULT 1 IS THE FLOOR, NOT A CADENCE. A channel nobody has assigned a rhythm keeps exactly
-- today's behaviour — something queued, or a reason on the record — so this migration cannot make
-- any channel quieter than it is now. Only linkedin/text-post moves.
--
-- x/text-post IS DELIBERATELY LEFT AT 1 AND IS NOT AT ITS REAL CADENCE. The X lane ships a batched
-- week of six or seven posts, but the calendar table predates the lane and has no X row at all, so
-- there is no confirmed number to encode. Writing 6 here would be inventing a cadence Keith never
-- set, and it would then alarm against itself. Adding X to the calendar table is Keith's call and
-- is flagged in STATE.md; until then 1 means "must not go dark", which is all we actually know.
--
-- KEEP THIS COLUMN AND THE CALENDAR TABLE IN STEP. The doc note added alongside this migration says
-- the same thing from the other side: change both, or neither. A number that disagrees with the doc
-- it was derived from is the drift this whole convention exists to prevent.

begin;

alter table public.content_channels
  add column if not exists weekly_slots smallint not null default 1;

-- A channel that owes zero posts a week is not a channel with a cadence, it is a channel that
-- should be out of plan or paused. Both of those are already representable and both are visible;
-- weekly_slots = 0 would be a third way to be dark that no check reports.
alter table public.content_channels
  drop constraint if exists content_channels_weekly_slots_positive;
alter table public.content_channels
  add constraint content_channels_weekly_slots_positive check (weekly_slots >= 1);

comment on column public.content_channels.weekly_slots is
  'Slots per week this channel owes, from the table in 06_marketing/content-machine/unified-content-calendar.md. Read by content-doctor I10 to catch a lane running under cadence. Default 1 means "must not go dark", not "ships once a week".';

-- The only row whose documented cadence is not 1. Mon + Thu, per the calendar table.
update public.content_channels
   set weekly_slots = 2
 where platform = 'linkedin' and format = 'text-post';

commit;

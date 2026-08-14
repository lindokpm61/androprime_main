-- 2026-08-14: give `content_metrics` the columns the close test and the shot arm need.
--
-- D7 of `06_marketing/content-machine/2026-08-14-content-machine-plan.md`, ruled by Keith on
-- 2026-08-14: measurement uses `content_metrics`, extended where other channels need it, rather
-- than a new table. Plan step 1.2.
--
-- WHAT THE TABLE ALREADY IS, and why extending is the right move. It holds `rendition_id`,
-- `captured_at` and a metric set, keyed uniquely on `(rendition_id, captured_at)`. So it is a
-- TIME SERIES, not a single score: a rendition can be measured repeatedly. That is exactly the
-- shape the close test needs, and it is why nothing here replaces it.
--
-- WHAT IT DID NOT CARRY. The column set leans LinkedIn and X, which is what it was built for
-- (its own comments cite Unipile field names). Four gaps, each one a metric something on the
-- roadmap actually reports:
--
--   saves       Instagram's strongest carousel signal, and THE WINNING METRIC OF THE VERY TEST
--               this table's first real use is. `reactions` is likes, not saves. The table could
--               not store the number the run exists to compare.
--   reach       Instagram reports reach separately from impressions; today they would collapse
--               into one column and the difference would be lost rather than absent.
--   video_views the shot arm is 21 renditions waiting on a filming day, and nothing here
--               supported it.
--   watch_seconds  the other half of a video signal. TOTAL seconds watched, so that average
--               watch time is derivable as watch_seconds / video_views. A platform that reports
--               only an average goes in `raw` until something queries it, rather than being
--               multiplied up into a number nobody measured.
--
-- `raw` STAYS THE CATCH-ALL. The rule carried forward from D7: a platform-specific metric never
-- needs a migration to be captured, and a field is promoted out of `raw` into a column only once
-- something queries it. This migration promotes exactly four, each named above with the query
-- that wants it.
--
-- WHAT THIS MIGRATION DOES NOT SOLVE, and it is the thing most likely to be misread later. The
-- run is a clean rotation, so topic effects cancel and the test is genuinely readable — but
-- close A's ten posts average run-day 14.5 against close C's 16.5, so COMPARING RUNNING TOTALS
-- AT ONE MOMENT WOULD RANK THE CLOSES BY PUBLISH DATE, in A's favour. The comparison has to be
-- at a FIXED AGE (saves at seven days). That is a requirement on the capture CADENCE, not on the
-- schema: the poll has to capture often enough that every post has a datapoint near its
-- seven-day mark. `metricool-metrics.ts` runs daily for that reason. The last post publishes
-- 2026-09-15, so the test cannot be read before roughly 2026-09-22.
--
-- ROLLBACK: every column is nullable and unused until the poll writes to it.
--   alter table public.content_metrics drop column saves, drop column reach,
--     drop column video_views, drop column watch_seconds;
--
-- SNAPSHOT: the effect of this migration is already reflected in
-- `database/schema/baseline-2026-08-14.sql`, which was re-dumped after it ran. Rebuild from that
-- baseline, not by replaying this file on top of it. The baseline and this file carry the same
-- date, so the ordering is stated here rather than left to be inferred from the filename.

begin;

alter table public.content_metrics
  add column if not exists saves         integer,
  add column if not exists reach         integer,
  add column if not exists video_views   integer,
  add column if not exists watch_seconds numeric;

comment on column public.content_metrics.saves is
  'Saves / bookmarks. Instagram''s strongest carousel signal and the winning metric of the 2026-08 close test; `reactions` is likes and is NOT this. X reports it as totalBookmarks. Read it at a FIXED AGE (saves at seven days), never as a running total: the rotation gives close A a two-day age advantage over close C, so a single-moment comparison ranks the closes by publish date.';

comment on column public.content_metrics.reach is
  'Unique accounts reached, where the platform reports it separately from impressions (Instagram does; LinkedIn calls the same idea uniqueImpressions). Null means the platform did not report it, never that it was zero.';

comment on column public.content_metrics.video_views is
  'Plays. For the shot arm (21 renditions waiting on a filming day) and for any video-covered carousel. Platforms count a "view" differently and the definitions are not comparable across networks; compare within a platform only.';

comment on column public.content_metrics.watch_seconds is
  'TOTAL seconds watched, so average watch time is derivable as watch_seconds / video_views. A platform reporting only an average is left in `raw` rather than multiplied up into a total nobody measured.';

commit;

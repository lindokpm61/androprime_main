-- 2026-08-14: register `instagram/carousel` in the channel registry.
--
-- Plan step 1.1 of `06_marketing/content-machine/2026-08-14-content-machine-plan.md`, found
-- while registering the 30-day run: thirty renditions were about to exist on a platform/format
-- pair the registry has never held. `content_channels` is what the board groups by and what
-- invariant I10 measures coverage against, so a lane with thirty live posts and no row is a
-- lane the board cannot show and the coverage check cannot see.
--
-- SEEDED `in_plan = false` DELIBERATELY, and this is the precedent rather than an oversight.
-- The `linkedin/short` row of 2026-07-31 was seeded the same way, with the reason written into
-- its own notes: `in_plan` is the coverage DENOMINATOR, so flipping a new channel true moves
-- every coverage percentage in the doc layer on the strength of a row nobody decided to add.
-- The table's own comment states the resulting state exactly: "a row where connected is true
-- and in_plan is false is a channel that arrived without a lane." That is precisely what this
-- is until Keith rules on it. The run publishes either way; what waits on the ruling is whether
-- the carousel counts as a planned lane.
--
-- LANE 1, not lane 2. The lane column takes only those two values, and the distinction the
-- doctor draws is "runs every week unconditionally" (lane 1) versus "batched onto a booked
-- filming day, may slip, must never hold lane 1" (lane 2). The carousel run is scheduled a
-- month deep and depends on no shoot, so it is lane 1 by that test even though its production
-- kind is RENDERED rather than WRITTEN. Production kind is not what this column means; when
-- `content_channels` becomes a full spec in Phase 6.1 it is the column that should carry it.
--
-- ROLLBACK: delete the row. Nothing joins to it — renditions carry their own platform and
-- format, and this table is a registry, not a foreign key.
--
-- SNAPSHOT: this migration inserts DATA, and `database/schema/baseline-2026-08-14.sql` is a
-- `--schema-only` dump, so its effect is NOT in the baseline. A database rebuilt from the
-- baseline needs this file replayed; the two schema migrations dated the same day do not.

begin;

insert into public.content_channels
  (platform, format, label, lane, in_plan, connected, publisher, account, sort_order, notes)
values (
  'instagram', 'carousel', 'Instagram carousel', 'lane-1', false, true, 'metricool', 'keith.antony.ai', 45,
  'Added 2026-08-14 while registering the 30-day carousel run (series carousel-30-2026-08): thirty renditions on a pair the registry did not hold. Metricool brand "Keith Antony AI", blogId 6693691, which is NOT the brand METRICOOL_BLOG_ID names (6633045, "Keith Andro Prime") — the scheduler LIST endpoint is brand-scoped and returns an empty array for the wrong brand, while GET by post id is not scoped and answers under either. in_plan seeded FALSE on the linkedin/short precedent so the coverage denominator does not move on a row nobody ruled on; OPEN FOR KEITH: flip it true if the carousel is a planned lane. Production kind is RENDERED (a deck), which this table has no column for until Phase 6.1.'
)
on conflict do nothing;

commit;

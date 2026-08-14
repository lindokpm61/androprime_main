-- 2026-08-14: add `variant` to content_renditions and put it in the unique key.
--
-- D1 of `06_marketing/content-machine/2026-08-14-content-machine-plan.md`, ruled by Keith
-- on 2026-08-14. Plan step 1.1.
--
-- THE RULE IN THE WAY. `content_renditions` was uniquely keyed on
-- `(asset_id, platform, format)`. An ASSET is the idea ("14 signs of vitamin D deficiency");
-- a RENDITION is one publishable version of it for one place. So the database allowed one
-- idea exactly ONE Instagram carousel.
--
-- WHY THE CAROUSEL RUN TRIPS IT. The 30-day run is ten ideas, each shipped as three
-- Instagram carousels that are identical except the closing slide, deliberately, to find out
-- which close performs. Vitamin D therefore wants three rows that all read
-- "vitamin D, Instagram, carousel", and the old key refuses the second and third.
--
-- THE RULING. Add `variant` to the key. The rule becomes one carousel per idea PER VARIANT,
-- so vitamin D holds three: A, B and C. The structure then says what actually happened.
--
-- The rejected alternative, for the record: model each post as its own asset. It needed no
-- migration, which was its only merit. It was rejected because it would leave the database
-- with no record that the three posts are one idea (so "which close won" stops being a
-- question that can be asked), and because each of the thirty would separately declare its
-- canonical article, fanning one signed claim set out thirty ways instead of ten.
--
-- WHAT A VARIANT MEANS ON THIS RUN, so the labels are readable without `closes.js`:
--   A = quiz close      "Not sure which test you'd even need?"  -> the quiz
--   B = kit close       the topic's own kit at its own price    -> the kit LP
--   C = article close   "This is the short version."            -> the canonical article
-- Approved as CA-031 (2026-08-11); K2 of CA-034 (2026-08-12) reframed C as a DELAYED kit
-- offer rather than a no-ask arm. The variant column records WHICH close ran, not what it
-- asked for: that mapping lives in `06_marketing/content/instagram/carousel-prototype/closes.js`
-- and is fixed for the run.
--
-- NULLS NOT DISTINCT IS THE LOAD-BEARING PART. Postgres treats NULLs as distinct in a unique
-- constraint by default, so a plain four-column key would have silently WEAKENED the old
-- guarantee: the 44 existing renditions all carry `variant IS NULL`, and any number of
-- duplicate (asset, platform, format) rows could then be inserted as long as each left
-- `variant` null. `nulls not distinct` (Postgres 15+; this database is 17.6) keeps the old
-- one-row rule exactly as it was for every rendition that has no variant, while allowing the
-- carousel's three. Nothing outside the carousel run needs to set this column.
--
-- ROLLBACK, while no other arm depends on it:
--   alter table public.content_renditions drop constraint content_renditions_asset_platform_format_variant_key;
--   alter table public.content_renditions add constraint content_renditions_asset_id_platform_format_key
--     unique (asset_id, platform, format);
--   alter table public.content_renditions drop column variant;
-- The rollback is only safe while at most one variant row exists per (asset, platform,
-- format); after the carousel run is registered it would fail on the duplicates, which is
-- the correct behaviour rather than an obstacle.
--
-- SNAPSHOT: the effect of this migration is already reflected in
-- `database/schema/baseline-2026-08-14.sql`, which was re-dumped after it ran. Rebuild from
-- that baseline, not by replaying this file on top of it. The baseline and this file carry the
-- same date, so the ordering is stated here rather than left to be inferred from the filename.

begin;

alter table public.content_renditions
  add column if not exists variant text;

alter table public.content_renditions
  drop constraint if exists content_renditions_variant_shape;

alter table public.content_renditions
  add constraint content_renditions_variant_shape
  check (variant is null or (variant = btrim(variant) and length(variant) between 1 and 24));

comment on column public.content_renditions.variant is
  'Which version of this rendition ran, when one asset ships the same platform+format more than once on purpose. NULL is the normal case and means "the only one". On the 2026-08 carousel run it holds A, B or C: the same deck with a different closing slide, which is the experiment. It records WHICH close ran, not what that close asked for (A=quiz, B=kit, C=article, fixed by closes.js and CA-031/CA-034 K2). Part of the unique key, which is NULLS NOT DISTINCT so a null variant still means one row per (asset, platform, format).';

alter table public.content_renditions
  drop constraint if exists content_renditions_asset_id_platform_format_key;

alter table public.content_renditions
  add constraint content_renditions_asset_platform_format_variant_key
  unique nulls not distinct (asset_id, platform, format, variant);

comment on constraint content_renditions_asset_platform_format_variant_key on public.content_renditions is
  'One rendition per (asset, platform, format, variant). NULLS NOT DISTINCT deliberately: it preserves the pre-2026-08-14 guarantee of one row per (asset, platform, format) for every rendition that carries no variant, instead of quietly letting nulls duplicate.';

commit;

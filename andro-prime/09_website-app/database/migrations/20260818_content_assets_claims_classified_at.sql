-- Adds the marker that says a derivative WAS classified, which the row count cannot say.
-- Extends `20260818_content_claim_tiers.sql` (plan step 5.3). Additive; nothing is superseded.
--
-- THE HOLE THIS CLOSES, FOUND BY WRITING THE CHECK FOR IT. `content_asset_claims` holds one row per
-- verdict, so "how many verdicts does this asset have" was standing in for "has this asset been
-- classified". Those come apart in the case that is most common in practice and least alarming to
-- look at: copy that states no figure and cites nothing. The ferritin carousel makes six mechanism
-- claims and contains not one number; `four-worth-seeing` is 500 words with no figure in it. Both
-- classify perfectly well and both correctly produce ZERO rows.
--
-- So without this column, an asset nobody has ever run the classifier over and an asset the
-- classifier read end to end and found nothing mechanical in are the same empty set, and the board
-- and the nightly invariant would both have reported the first as the second. That is the shape this
-- whole phase exists to remove: an absence reading as a clean result.
--
-- IT ALSO DATES THE CHECK, which is the second thing the rows cannot do. A classification made
-- before the copy last moved is evidence about copy that no longer exists, and content-doctor I13
-- compares this timestamp against the rendition's `updated_at` to say so.

begin;

alter table public.content_assets
  add column if not exists claims_classified_at timestamptz;

comment on column public.content_assets.claims_classified_at is
  'When classify-claims (plan step 5.3) last read this asset''s copy against its pinned set. Written on EVERY run including one that finds nothing, because zero verdicts is a real result and is indistinguishable from never having looked. Compared against the rendition updated_at by content-doctor I13: a classification older than the copy it describes is stale.';

commit;

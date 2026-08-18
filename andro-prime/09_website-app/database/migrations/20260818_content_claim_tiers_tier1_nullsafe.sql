-- Corrects ONE constraint in `20260818_content_claim_tiers.sql`, which has already been applied and
-- is left in place unchanged. The tier 1 auto-pass rule ran for about ten minutes in a form that did
-- not enforce itself.
--
-- WHAT WAS WRONG, AND IT IS A SHAPE WORTH RECOGNISING RATHER THAN A TYPO.
--
--   check ((tier = 1 and resolution = 'auto-pass') or (tier <> 1 and resolution is distinct from 'auto-pass'))
--
-- For the exact row it exists to refuse, tier 1 with a NULL resolution, the first branch evaluates
-- to `true and (null = 'auto-pass')` = NULL and the second to false. NULL or false is NULL, and
-- **a CHECK constraint admits a row whose expression is NULL**: only an explicit false refuses. So
-- the rule read as enforcement and permitted an unresolved tier 1, which is the one state Q14 says
-- cannot exist, because Ewa ruled the whole tier auto-passed rather than each instance.
--
-- Every comparison against a nullable column inside a multi-branch CHECK needs `is [not] distinct
-- from`, not `=` / `<>`. The two look interchangeable and differ exactly where it matters.
--
-- HOW IT WAS CAUGHT, WHICH IS THE ONLY REASON IT WAS. The twelve other controls in that migration
-- were verified the same way: by attempting the write and reading the refusal. Reasoning about this
-- constraint produces the wrong answer confidently, and a review would have read it as correct.

begin;

alter table public.content_asset_claims
  drop constraint if exists content_asset_claims_tier1_auto;

alter table public.content_asset_claims
  add constraint content_asset_claims_tier1_auto check (
    (tier = 1 and resolution is not distinct from 'auto-pass')
    or (tier <> 1 and resolution is distinct from 'auto-pass')
  );

commit;

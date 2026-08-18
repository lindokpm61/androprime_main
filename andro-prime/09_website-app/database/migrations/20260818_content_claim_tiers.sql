-- Plan steps 5.3 and 5.4: compute the tier ladder, and make a superseded pin visible.
-- Sits on 20260818_content_claim_sets.sql (5.1 and 5.2), which stored the set and the pin.
-- Rulings: 03_compliance/correspondence/2026-08-18-keith-ewa-fifteen-rulings.md (Q12, Q13, Q14),
--          and ruling 3 of 2026-08-18-keith-ewa-d2-claim-ledger.md (rewording adds no proposition).
--
-- WHAT 5.2 LEFT UNFINISHED, IN ITS OWN WORDS. The pin records which signed set GOVERNS a
-- derivative. It does NOT record which of that set's claims the derivative actually carries, and a
-- populated column reads as a verified one. 23 assets were pinned on 2026-08-18 and not one line of
-- their copy had been checked against the 40 claims by anything but a human reading it once.
--
-- THE LADDER, AS RULED (Q14, as written and without amendment):
--   Tier 1  inherited verbatim, or reworded with no proposition added  -> AUTO-PASSES, no Ewa at all
--   Tier 2  compressed, or on a surface that cannot carry the qualifier -> to Ewa, ITEMISED
--   Tier 3  net-new claim                                              -> back to the ARTICLE for clearance
-- Tier 0 is the mechanical scan and already runs; its verdict lives in content_assets.preflight and
-- is deliberately NOT stored here. That column holds the COPY verdict; this table holds the CLAIM
-- one, and collapsing them would lose the axis that makes each readable.
--
-- WHY TIER 3 IS A ROW IN THE SAME TABLE. A net-new claim is the ABSENCE of a mapping, and an absence
-- has nowhere to live in a join table. Storing it as a row with a null claim_id keeps one place to
-- ask "what does this asset carry", which is the question an ASA complaint asks. Two tables would
-- have made the dangerous answer the one you have to remember to look for.
--
-- WHAT THIS DOES NOT DO. It does not decide anything clinical, and no automation may write a
-- resolution for tier 2 or tier 3: those carry a human's reference or they stay open. Tier 1 is the
-- single exception and it is not an exception to the rule that a human decides, because the human
-- decision was Ewa's on 2026-08-18 and it applies to the whole tier at once.

begin;

-- ═══ 5.4 first, because the tier table's gate reads it ══════════════════════
-- A superseded set has to say WHEN. Q13 says a derivative pinned to a superseded set keeps running
-- and is re-pinned at its next edit, which is a rule about time: it can only be checked against a
-- moment the supersede happened. `updated_at` moves for any edit and cannot answer it.

alter table public.content_claim_sets
  add column if not exists superseded_at timestamptz;

-- No superseded set exists yet. Written anyway, so the constraint below cannot fail on data that
-- arrives between this file being written and being applied.
update public.content_claim_sets
   set superseded_at = coalesce(superseded_at, updated_at, now())
 where status = 'superseded' and superseded_at is null;

alter table public.content_claim_sets
  drop constraint if exists content_claim_sets_superseded_has_date;
alter table public.content_claim_sets
  add constraint content_claim_sets_superseded_has_date
  check (status <> 'superseded' or superseded_at is not null);

comment on column public.content_claim_sets.superseded_at is
  'When this version stopped being the signed one. Q13 (2026-08-18) says a pinned derivative keeps running and is re-pinned at its NEXT EDIT, so the rule is only checkable against this moment. updated_at moves for any edit and cannot stand in for it.';

-- Stamped by the database rather than by whoever runs the supersede, because the whole value of the
-- date is that it was not chosen after the fact.
create or replace function public.stamp_claim_set_superseded()
returns trigger
language plpgsql
as $function$
begin
  if new.status = 'superseded' and new.superseded_at is null then
    new.superseded_at := now();
  end if;
  return new;
end;
$function$;

drop trigger if exists trg_claim_set_superseded_stamp on public.content_claim_sets;
create trigger trg_claim_set_superseded_stamp
  before insert or update on public.content_claim_sets
  for each row execute function public.stamp_claim_set_superseded();

-- ═══ 5.3: what this derivative carries, and at which tier ═══════════════════

create table if not exists public.content_asset_claims (
  id uuid primary key default gen_random_uuid(),

  asset_id uuid not null references public.content_assets(id) on delete cascade,

  -- The set the classification was made AGAINST, stored rather than joined through the asset. The
  -- asset's pin can move; a classification is evidence about one moment and must not silently
  -- re-point at a set nobody checked this copy against.
  claim_set_id uuid not null references public.content_claim_sets(id) on delete restrict,

  -- NULL is the whole point on a tier 3 row: the copy asserts something no signed claim covers.
  claim_id uuid references public.content_claims(id) on delete restrict,

  tier smallint not null,

  -- The copy that carries it, verbatim. An itemised packet for Ewa is only itemised if each line
  -- shows her the words, and a classification with no quote cannot be argued with.
  quote text not null,
  -- platform/format the quote was read from, or 'asset' for the asset body. A claim can be tier 1 on
  -- LinkedIn and tier 2 on X for no reason other than 280 characters, so the surface is part of the
  -- finding rather than a note about it.
  surface text,

  -- Why this tier, in a sentence, from the classifier or from the human who overrode it.
  reason text not null,

  -- Tier 1 is resolved at birth: Ewa ruled the tier, not the instance. Tier 2 and tier 3 arrive
  -- unresolved and only a human closes them.
  resolution text,
  resolution_ref text,
  resolved_at timestamptz,

  classifier text not null default 'classify-claims',
  classified_at timestamptz not null default now(),

  constraint content_asset_claims_tier_check check (tier in (1, 2, 3)),

  -- Tier 1 and 2 are a MAPPING to a signed claim; tier 3 is the absence of one. Neither shape is
  -- optional: a tier 3 row carrying a claim_id would be a mapped claim filed as net-new, and a tier
  -- 1 row without one would be an auto-pass inheriting from nothing.
  constraint content_asset_claims_mapped_shape check (
    (tier in (1, 2) and claim_id is not null)
    or (tier = 3 and claim_id is null)
  ),

  constraint content_asset_claims_quote_not_blank check (btrim(quote) <> ''),
  constraint content_asset_claims_reason_not_blank check (btrim(reason) <> ''),

  constraint content_asset_claims_resolution_check check (
    resolution is null
    or resolution in ('auto-pass', 'ewa-cleared', 'article-cleared', 'removed')
  ),

  -- A resolution with no date and no reference is an assertion. This is the same rule the claim set
  -- applies to its own signature, for the same reason.
  constraint content_asset_claims_resolution_has_evidence check (
    resolution is null
    or (resolved_at is not null and resolution_ref is not null and btrim(resolution_ref) <> '')
  ),

  -- THE RULING, AS A CONSTRAINT. Tier 1 auto-passes with no Ewa (Q14), so a tier 1 row is never
  -- open; and nothing else may claim the auto-pass, which is what stops a tier 2 being closed by
  -- reclassifying it rather than by clearing it.
  --
  -- SUPERSEDED BY `20260818_content_claim_tiers_tier1_nullsafe.sql`. As written below, the branch for
  -- tier 1 with a NULL resolution evaluates to NULL rather than false, and a CHECK admits a NULL, so
  -- the one row this constraint exists to refuse walked through it. Read that file for the live
  -- version. Left unchanged here because it ran in this form.
  constraint content_asset_claims_tier1_auto check (
    (tier = 1 and resolution = 'auto-pass')
    or (tier <> 1 and resolution is distinct from 'auto-pass')
  )
);

-- One row per (asset, claim). A claim carried twice in one asset is one inheritance, and the second
-- quote belongs in the same row's evidence rather than in a second verdict.
create unique index if not exists content_asset_claims_asset_claim_key
  on public.content_asset_claims (asset_id, claim_id)
  where claim_id is not null;

create index if not exists content_asset_claims_asset_idx
  on public.content_asset_claims (asset_id);
-- The gate below asks "does this asset carry an unresolved tier 2 or 3" on every schedule and every
-- publish, so that question gets its own index rather than a scan.
create index if not exists content_asset_claims_open_idx
  on public.content_asset_claims (asset_id)
  where resolution is null;
create index if not exists content_asset_claims_set_idx
  on public.content_asset_claims (claim_set_id);

comment on table public.content_asset_claims is
  'Plan step 5.3. Which claims of its pinned set a derivative actually carries, at which tier of the ladder Ewa ruled on 2026-08-18 (Q14). Tier 1 auto-passes; tier 2 goes to her itemised; tier 3 goes back to the article. A tier 3 row has no claim_id because it maps to no signed claim, which is the finding.';
comment on column public.content_asset_claims.claim_set_id is
  'The set this classification was made against, stored rather than derived. A pin can move; the evidence must not move with it.';
comment on column public.content_asset_claims.resolution is
  'auto-pass is tier 1 and is written by the classifier, because Ewa ruled the TIER rather than the instance. Every other value records a human closing a tier 2 or tier 3, and no automation may write one.';

-- ── A classification may only be made against the set the asset is pinned to ─
-- Otherwise a derivative could be shown as carrying claims from a set that does not govern it, and
-- the row would look exactly like a real inheritance.

create or replace function public.gate_asset_claim_classification()
returns trigger
language plpgsql
as $function$
declare
  pinned_set uuid;
  claim_set  uuid;
begin
  select claim_set_id into pinned_set from public.content_assets where id = new.asset_id;

  if pinned_set is null then
    raise exception
      'GATE: asset % is not pinned to a claim set, so there is nothing for this classification to inherit from. Pin it first (step 5.2).',
      new.asset_id
      using errcode = 'check_violation';
  end if;

  if pinned_set is distinct from new.claim_set_id then
    raise exception
      'GATE: asset % is pinned to claim set %, and this classification cites %. A derivative may only be classified against the set that governs it.',
      new.asset_id, pinned_set, new.claim_set_id
      using errcode = 'check_violation';
  end if;

  if new.claim_id is not null then
    select claim_set_id into claim_set from public.content_claims where id = new.claim_id;
    if claim_set is distinct from new.claim_set_id then
      raise exception
        'GATE: claim % belongs to set %, not to the cited set %. A claim cannot be inherited from a set it is not in.',
        new.claim_id, coalesce(claim_set::text, 'missing'), new.claim_set_id
        using errcode = 'check_violation';
    end if;
  end if;

  return new;
end;
$function$;

drop trigger if exists trg_asset_claim_classification on public.content_asset_claims;
create trigger trg_asset_claim_classification
  before insert or update on public.content_asset_claims
  for each row execute function public.gate_asset_claim_classification();

alter table public.content_asset_claims enable row level security;

-- ═══ The gate: an open tier 2 or tier 3 stops the derivative shipping ═══════
-- THE CLAIM BLOCK BELOW IS SUPERSEDED BY `20260818_content_claim_tiers_gate_on_arrival.sql`. As
-- written here it re-checks every RESTING row at scheduled-or-later, which would have frozen
-- `metricool-writeback` and the id remap on 14 live assets the moment the first classification ran:
-- a gate cannot stop a post already on the platform, only stop us recording what it did. It now
-- fires on ARRIVAL only, like the thumbnail rule. Left unchanged here because it ran in this form.
-- This is what turns the pin from a stored value into an enforced one, which is the sentence step
-- 5.2 wrote about itself. Re-creating gate_rendition_publish() in full rather than adding a second
-- trigger: one rule in two places is the drift 20260801_content_state_guards.sql exists to end, and
-- its own header says so.
--
-- SUPERSEDES the definition in `20260801_content_state_guards.sql` section 4. Every rule there is
-- carried forward unchanged; the claim block is the only addition.
--
-- WHAT IT DELIBERATELY DOES NOT REFUSE:
--   * an asset with NO classification. Ruled Q10, the ledger is forward-only and the already-signed
--     work is not retro-fitted, so demanding a classification here would re-litigate 18 articles'
--     worth of approvals. The hole is real and it is REPORTED instead, by content-doctor I13. A gate
--     that cannot see a gap and an invariant that can is the right split; a gate that blocks live
--     work to force a backfill is not.
--   * a pin to a SUPERSEDED set. Q13: live derivatives keep running. Also I13's job to surface.

create or replace function public.gate_rendition_publish()
returns trigger
language plpgsql
as $function$
declare
  a              public.content_assets%rowtype;
  article_status text;
  arriving       boolean;
  open_claims    integer;
  open_detail    text;
begin
  if new.status not in ('scheduled', 'published', 'measured') then
    return new;
  end if;

  arriving := (tg_op = 'INSERT')
              or (old.status not in ('scheduled', 'published', 'measured'));

  select * into a from public.content_assets where id = new.asset_id;
  if not found then
    raise exception 'GATE: rendition %/% has no parent content_assets row',
      new.platform, new.format
      using errcode = 'check_violation';
  end if;

  if a.status not in ('approved', 'done') then
    raise exception
      'GATE: rendition %/% cannot be % while its asset "%" is at status "%". Get the asset approved first.',
      new.platform, new.format, new.status, a.slug, a.status
      using errcode = 'check_violation';
  end if;

  -- Decision 3 (social-content-db-spec.md): no derivative outruns the article it inherits from.
  if a.canonical_article_id is not null then
    select status::text into article_status
      from public.blog_articles where id = a.canonical_article_id;
    if article_status is distinct from 'published' then
      raise exception
        'GATE: rendition %/% cannot be % because its canonical article is "%", not published. A derivative may not outrun its source.',
        new.platform, new.format, new.status, coalesce(article_status, 'missing')
        using errcode = 'check_violation';
    end if;
  end if;

  -- Thumbnails are a gate, not a nicety (plan §4): produced by hand and approved by Keith.
  if arriving
     and new.thumb_spec <> 'none'
     and new.status in ('scheduled', 'published')
     and (tg_op = 'INSERT' or old.status not in ('thumbnail-done', 'scheduled', 'published', 'measured')) then
    raise exception
      'GATE: rendition %/% needs a confirmed thumbnail before %.',
      new.platform, new.format, new.status
      using errcode = 'check_violation';
  end if;

  -- A published rendition with no URL is an unverifiable claim that it shipped.
  if new.status in ('published', 'measured') and coalesce(new.external_url, '') = '' then
    raise exception
      'GATE: rendition %/% cannot be % without an external_url.',
      new.platform, new.format, new.status
      using errcode = 'check_violation';
  end if;

  -- ADDED BY 20260818_content_claim_tiers.sql (plan step 5.3).
  select count(*),
         string_agg(format('tier %s: "%s"', c.tier,
                           left(c.quote, 80) || case when length(c.quote) > 80 then '…' else '' end),
                    '; ' order by c.tier, c.quote)
    into open_claims, open_detail
    from public.content_asset_claims c
   where c.asset_id = new.asset_id
     and c.tier in (2, 3)
     and c.resolution is null;

  if open_claims > 0 then
    raise exception
      'GATE: rendition %/% cannot be % while asset "%" carries % unresolved claim(s) above tier 1. %. Tier 2 goes to Ewa itemised; tier 3 goes back to the article. Ruled 2026-08-18 (Q14).',
      new.platform, new.format, new.status, a.slug, open_claims, open_detail
      using errcode = 'check_violation';
  end if;

  return new;
end;
$function$;

drop trigger if exists gate_rendition_publish on public.content_renditions;
create trigger gate_rendition_publish
  before insert or update on public.content_renditions
  for each row execute function public.gate_rendition_publish();

-- ═══ 5.4: what is pinned to a set that has moved on ════════════════════════
-- A view rather than a column, because the answer is a join of three facts that each move on their
-- own, and a stored copy of it would be stale exactly when it matters.
--
-- READ THE `edited_since_superseded` COLUMN AS THE WHOLE POINT. Q13 makes a superseded pin normal
-- and re-pinning a next-edit duty, so the population of superseded pins is not the finding. The
-- finding is a derivative that MOVED after its set was superseded and still carries the old pin,
-- because that is the duty going unpaid rather than the state being tolerated.
--
-- AND READ Q12 BEFORE ACTING ON A LONG LIST. A new version only exists when the MEANING changes, so
-- a re-optimisation that rewords without moving a claim supersedes nothing and appears here not at
-- all. The expensive case is narrower than it looks.

create or replace view public.content_pins_superseded as
select
  a.id                     as asset_id,
  a.slug                   as asset_slug,
  a.status                 as asset_status,
  a.pinned_at,
  t.slug                   as topic_slug,
  old.id                   as pinned_set_id,
  old.version              as pinned_version,
  old.superseded_at,
  cur.id                   as signed_set_id,
  cur.version              as signed_version,
  r.rendition_count,
  r.live_count,
  r.last_moved_at,
  -- "Its next edit" made checkable: a rendition that was scheduled, published or otherwise touched
  -- after the supersede, on an asset still carrying the old pin.
  coalesce(r.last_moved_at > old.superseded_at, false) as edited_since_superseded
from public.content_assets a
join public.content_claim_sets old on old.id = a.claim_set_id and old.status = 'superseded'
join public.content_topics t on t.id = old.topic_id
left join public.content_claim_sets cur
       on cur.topic_id = old.topic_id and cur.status = 'signed'
left join lateral (
  select count(*)                                              as rendition_count,
         count(*) filter (where rd.status in ('scheduled', 'published', 'measured')) as live_count,
         max(greatest(rd.updated_at, coalesce(rd.published_at, rd.updated_at)))      as last_moved_at
    from public.content_renditions rd
   where rd.asset_id = a.id
) r on true;

comment on view public.content_pins_superseded is
  'Plan step 5.4. Derivatives pinned to a claim set that has been superseded. Ruled Q13 (2026-08-18): they KEEP RUNNING and are re-pinned at their next edit, so this is a worklist and never a takedown list. edited_since_superseded is the column that separates a tolerated state from an unpaid duty.';

commit;

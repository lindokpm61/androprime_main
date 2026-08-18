-- Plan steps 5.1 and 5.2: store the claim set, versioned, and let derivatives pin to it.
-- Gate D2, approved as CA-041 on 2026-08-18 by Dr Ewa Lindo (clinical) and Keith Antony (business).
-- Rulings: 03_compliance/correspondence/2026-08-18-keith-ewa-d2-claim-ledger.md and
--          03_compliance/correspondence/2026-08-18-keith-ewa-fifteen-rulings.md
--
-- WHAT THIS REPLACES. Ewa signs prose, one piece at a time, so the same clinical judgement comes back
-- to her every time it appears somewhere new. Two requests raised on 2026-08-15 were the same
-- question about two articles, and neither could see the other. Thirteen asset files already carry a
-- `## Claim inheritance check` table in exactly the right shape; every one is written fresh, read
-- once and thrown away.
--
-- WHY IT IS WORTH A SCHEMA AND NOT A CONVENTION. An ASA complaint requires substantiation of a claim
-- AS IT STOOD ON THE DAY IT WAS MADE. A dated, versioned set with every derivative pinned to a
-- version answers that in one query. Thirteen discarded tables do not.
--
-- 🔴 THE UNIT IS THE TOPIC, AND A TOPIC IS NOT A PILLAR. Ruled 2026-08-18: one set covers
-- why-am-i-always-tired, low-vitamin-d-symptoms, b12-blood-test and ferritin-blood-test, which span
-- THREE pillars (B, A, and D with ferritin touching G). She was offered "the pillar" and "finer than
-- a pillar" and refused both, which is why this table exists instead of a column on an existing one.
-- Pillars are a SEARCH-INTENT taxonomy: coverage-rules.md exists to stop two articles cannibalising
-- each other's SERP, which is why vitamin-D-as-a-cause-of-tiredness is split between A and B by the
-- language a reader uses. A claim set is a CLINICAL-CLAIM taxonomy: the same claim is the same claim
-- whichever query brought the reader in. Building this on pillar_id would have looked correct until
-- one claim needed signing twice with nothing able to tell it was one claim.
--
-- EMPTY ON PURPOSE, AND FORWARD ONLY. Ruled Q10: the 18 already-signed articles keep their existing
-- sign-offs and are NOT retro-fitted. No backfill runs here and none is owed. A set arrives when a
-- human drafts one and Ewa signs it.
--
-- WHAT THIS DOES NOT DO. It stores and pins. It does not compute a tier (5.3) and it does not surface
-- what is pinned to a superseded set (5.4). Until those exist, sop-compliance-route.md step 3 is
-- still the live process and nothing here changes what may ship.

begin;

-- ── The topic: the unit Ewa signs at ────────────────────────────────────────

create table if not exists public.content_topics (
  id uuid primary key default gen_random_uuid(),

  slug text not null,
  title text not null,

  -- Why these articles are one topic, in a sentence. Recorded because the grouping is a clinical
  -- judgement rather than a derivable fact, and the next person will otherwise reach for the pillar
  -- map, which is the wrong axis.
  rationale text,

  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint content_topics_slug_not_blank check (btrim(slug) <> ''),
  constraint content_topics_title_not_blank check (btrim(title) <> '')
);

create unique index if not exists content_topics_slug_key on public.content_topics (slug);

comment on table public.content_topics is
  'The unit a claim set is signed at. BROADER than a content pillar and deliberately crossing pillar boundaries: pillars are a search-intent taxonomy, a topic is a clinical-claim one. Ruled by Dr Ewa Lindo 2026-08-18 (CA-041).';
comment on column public.content_topics.rationale is
  'Why these articles are one topic. The grouping is a clinical judgement, not derivable from the pillar map. Recorded so the next reader does not reach for coverage-rules.md.';

-- ── Which articles a topic covers ───────────────────────────────────────────
-- A join table rather than a column on blog_articles: the membership is a fact about the claim
-- ledger, not about the article, and it must be reversible without touching a live published table.

create table if not exists public.content_topic_articles (
  topic_id uuid not null references public.content_topics(id) on delete cascade,
  article_id uuid not null references public.blog_articles(id) on delete cascade,

  created_at timestamptz not null default now(),

  primary key (topic_id, article_id)
);

-- An article belongs to exactly ONE topic. Two topics claiming the same article is the failure this
-- whole model exists to prevent: one claim, signed twice, with nothing able to tell it was one claim.
-- If a real case ever needs an article in two topics, dropping this index is the deliberate decision
-- that allows it, and it should be argued rather than discovered.
create unique index if not exists content_topic_articles_article_key
  on public.content_topic_articles (article_id);

create index if not exists content_topic_articles_topic_idx
  on public.content_topic_articles (topic_id);

comment on table public.content_topic_articles is
  'Articles covered by a topic. Unique on article_id: an article belongs to exactly one topic, so a claim cannot be signed twice under two topics.';

-- ── The claim set: versioned, dated, and signed by a named human ────────────

create table if not exists public.content_claim_sets (
  id uuid primary key default gen_random_uuid(),

  topic_id uuid not null references public.content_topics(id) on delete restrict,

  -- Monotonic per topic. v1 is the first signed set; a new version exists only when the MEANING of a
  -- claim changes (ruled Q12). A wording change that does not move the claim does NOT make a version,
  -- which is what stops the ledger churning and stops derivatives being re-pinned for nothing.
  version integer not null,

  status text not null default 'draft',

  -- The signature. Never written by automation: only a named human approves, and the register's rule
  -- is that a submission is approved only when all required signers have signed.
  signed_by text,
  signed_at timestamptz,
  -- Where the signature actually lives, so the trail survives this table: a CA number, a ClickUp task,
  -- or the correspondence record carrying her verbatim answer.
  signature_ref text,

  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint content_claim_sets_version_positive check (version >= 1),
  constraint content_claim_sets_status_check
    check (status in ('draft', 'signed', 'superseded')),

  -- A signed set MUST carry who signed it and when. Without this the status is an assertion; with it
  -- the status is evidence. This is the single most important constraint in the migration.
  constraint content_claim_sets_signed_has_signature check (
    status <> 'signed'
    or (signed_by is not null and btrim(signed_by) <> '' and signed_at is not null)
  ),
  -- Symmetrically, a draft has not been signed by anyone. Stops a half-filled row reading as signed.
  constraint content_claim_sets_draft_unsigned check (
    status <> 'draft' or (signed_by is null and signed_at is null)
  )
);

create unique index if not exists content_claim_sets_topic_version_key
  on public.content_claim_sets (topic_id, version);

-- AT MOST ONE SIGNED SET PER TOPIC. Superseding is an act, not an accident: publishing v2 without
-- moving v1 to superseded would leave two live sets and no answer to "what is signed today".
create unique index if not exists content_claim_sets_one_signed_per_topic
  on public.content_claim_sets (topic_id)
  where status = 'signed';

create index if not exists content_claim_sets_topic_idx on public.content_claim_sets (topic_id);

comment on table public.content_claim_sets is
  'A versioned, dated set of claims signed at a topic. At most one signed set per topic. A new version exists only when the MEANING of a claim changes (ruled 2026-08-18, Q12).';
comment on column public.content_claim_sets.signature_ref is
  'Where the signature lives outside this table: CA number, ClickUp task, or correspondence record. The trail must survive the row.';

-- ── The claims themselves: one sentence, one source ─────────────────────────

create table if not exists public.content_claims (
  id uuid primary key default gen_random_uuid(),

  claim_set_id uuid not null references public.content_claim_sets(id) on delete cascade,

  position smallint not null,

  -- One sentence. She signs a list we draft (ruled Q11), and the list only works if each line is
  -- separately checkable against a source.
  claim text not null,

  source_name text,
  source_url text,
  -- When the source was last fetched and the claim checked against its wording. There is no expiry
  -- (ruled Q15): a set is re-checked when a cited source is NOTICED to have moved, so this date is
  -- the evidence of the last look rather than a countdown.
  source_verified_at date,

  notes text,
  created_at timestamptz not null default now(),

  constraint content_claims_position_positive check (position >= 1),
  constraint content_claims_not_blank check (btrim(claim) <> '')
);

create unique index if not exists content_claims_set_position_key
  on public.content_claims (claim_set_id, position);

create index if not exists content_claims_set_idx on public.content_claims (claim_set_id);

comment on table public.content_claims is
  'One claim, one sentence, one source. Ewa signs the list rather than prose (ruled 2026-08-18, Q11).';
comment on column public.content_claims.source_verified_at is
  'Last time the source was fetched and the claim checked against its wording. A signed set does NOT expire (ruled Q15); this records the last look, it is not a countdown.';

-- ── The pin: which claim set version a derivative rides on (step 5.2) ───────

alter table public.content_assets
  add column if not exists claim_set_id uuid references public.content_claim_sets(id) on delete restrict;

alter table public.content_assets
  add column if not exists pinned_at timestamptz;

-- on delete restrict above, and this index, are the same decision from two directions: a signed set
-- that something is pinned to cannot be deleted, and finding what is pinned to it must be cheap
-- because 5.4 runs that query on every article edit.
create index if not exists content_assets_claim_set_idx
  on public.content_assets (claim_set_id)
  where claim_set_id is not null;

comment on column public.content_assets.claim_set_id is
  'The claim set VERSION this derivative rides on. Ruled 2026-08-18 (Q13): when the article moves on, a derivative pinned to a superseded set KEEPS RUNNING and is re-pinned at its next edit. Nothing comes down automatically, so this is never a kill switch.';
comment on column public.content_assets.pinned_at is
  'When the pin was set. A pin older than its set''s signed_at means the asset was pinned before the set was signed, which should be impossible and is worth detecting.';

-- ── A pin may only point at a SIGNED set, never a draft ─────────────────────
-- The whole model is that a derivative inherits a signature. Pinning to a draft would inherit
-- nothing while looking identical to a pin that inherits everything.

create or replace function public.gate_asset_claim_set_signed()
returns trigger
language plpgsql
as $function$
declare
  s_status text;
begin
  if new.claim_set_id is null then
    return new;
  end if;

  select status into s_status from public.content_claim_sets where id = new.claim_set_id;

  if s_status is null then
    raise exception 'GATE: claim set % does not exist', new.claim_set_id
      using errcode = 'check_violation';
  end if;

  -- 'superseded' is allowed on purpose: Q13 says a derivative pinned to a superseded set keeps
  -- running. Refusing it here would turn a surfacing job into a takedown, which is the opposite of
  -- what was ruled. Only 'draft' is refused.
  if s_status = 'draft' then
    raise exception
      'GATE: claim set % is a DRAFT. A derivative may only pin to a signed set, or it inherits a signature that does not exist.',
      new.claim_set_id
      using errcode = 'check_violation';
  end if;

  return new;
end;
$function$;

drop trigger if exists trg_asset_claim_set_signed on public.content_assets;
create trigger trg_asset_claim_set_signed
  before insert or update of claim_set_id on public.content_assets
  for each row execute function public.gate_asset_claim_set_signed();

-- ── RLS: same posture as the rest of the content pipeline ───────────────────
-- Written by the engine under the service role. No anon path exists or should: these are the
-- compliance trail, not customer-facing content.

alter table public.content_topics enable row level security;
alter table public.content_topic_articles enable row level security;
alter table public.content_claim_sets enable row level security;
alter table public.content_claims enable row level security;

commit;

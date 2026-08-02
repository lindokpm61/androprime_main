-- ═══════════════════════════════════════════════════════════════════════════════════════════
-- Phase 1 of the content pipeline automation plan: the guards become the ONLY guards.
--
-- WHY. Phase 1 strips state out of asset frontmatter, so `content-status/scan.js` can no longer
-- see the fields its gates G1-G4 read. A repo-only scanner cannot police state it no longer
-- holds, and leaving it asserting gates it cannot verify is the `thumb_confirmed` shape a third
-- time: a field in one store asserting a condition owned by another. Plan §4: "Guards live in
-- the database, not in the worker, so they cannot be bypassed by a job that forgets to check."
--
-- ─────────────────────────────────────────────────────────────────────────────────────────────
-- WHAT THIS FILE FOUND, WHICH IS NOT WHAT IT SET OUT TO DO.
--
-- The guards were already here. `gate_asset_approval()` and `gate_rendition_publish()` were
-- built alongside `06_marketing/content-machine/social-content-db-spec.md` and never recorded in
-- this migrations directory, so a reader of `database/migrations/` would conclude the tables had
-- no gates at all. This file is therefore partly a consolidation and partly the missing record.
-- Writing a second parallel set beside them — which is what the first draft of this migration
-- did — would have been two copies of one rule with nothing watching them, i.e. the §2 failure
-- this whole plan exists to remove, introduced by the work removing it.
--
-- TWO REAL DEFECTS IN THE EXISTING GATES, both found by inspecting rather than assuming:
--
-- 1. BOTH FIRE ON UPDATE ONLY, AND BOTH ARE TRANSITION-BASED (`old.status not in (...)`).
--    A row INSERTED directly at `approved`, or a rendition INSERTED directly at `scheduled`,
--    invokes neither. The gate is not a gate if you can arrive without passing through it, and
--    every one of these tables is written by scripts that insert.
--
-- 2. `gate_asset_approval` ACCEPTS `amber-ewa` WITH A NON-EMPTY `ewa_task`.
--    That is the pre-reconciliation rule. Keith settled this on 2026-08-01: a non-empty
--    `ewa_task` proves a question was ASKED, not answered, and the gate is the ClickUp task's
--    COMPLETION. `content-doctor` invariant 5 was corrected then; this trigger was not, so the
--    database still had the weak version. With X week 1 scheduled at `autoPublish: true`, an
--    asset merely ROUTED to Ewa could reach `approved` and publish on a timer before she ruled.
--    Two of the three live amber-ewa assets carry an `ewa_task` and would have been eligible.
--
-- ─────────────────────────────────────────────────────────────────────────────────────────────
-- ONE MATERIAL CORRECTION TO THE PLAN, made against live data rather than inferred.
--
-- §4 specifies: "status = 'approved' is refused unless preflight = 'green' AND ewa_signed_at is
-- not null." Applied literally that rejects ALL THIRTEEN currently-approved assets, because not
-- one carries a direct Ewa signature: every one is `preflight: green` with a canonical article,
-- and its clearance is INHERITED from that article's sign-off. That is not drift, it is the
-- operating model — plan §6, "the inheritance check is what makes derivative volume safe".
--
-- So the gate below encodes the two real routes to approval:
--   inheritance path: preflight green      AND a canonical article to inherit from
--   net-new path:     preflight amber-ewa  AND Ewa's ruling actually RECORDED
-- Verified before applying: 0 violations across all 23 assets and all 39 renditions.
--
-- ─────────────────────────────────────────────────────────────────────────────────────────────
-- CHECK vs TRIGGER. A CHECK sees one row and is evaluated on every write including INSERT, and
-- cannot be skipped by a transition trick. The approval gate lives entirely within one
-- `content_assets` row, so it is a CHECK, and the UPDATE-only trigger it replaces is dropped
-- rather than left beside it. The rendition gates compare against the parent asset and against
-- `blog_articles`, which a CHECK cannot do, so they stay a trigger — widened to INSERT.
--
-- ─────────────────────────────────────────────────────────────────────────────────────────────
-- WHAT THE APPLIED-MIGRATION LEDGER SAYS ABOUT THIS FILE, WHICH IS NOT WHAT THE FILENAME SAYS.
--
-- This file is ONE file and TWO ledger entries. `20260801192846 content_state_guards` is the
-- first draft, the one that added the parallel second copy of the rendition gate described
-- above; `20260801193335 content_state_guards_consolidate` is what this file actually contains,
-- and it supersedes the first entry, which has no file of its own and never will. Recorded here
-- because a reader counting the ledger against `database/migrations/` finds one more entry than
-- there are files, and the alternative to writing that down is re-deriving it every time.
--
-- SECTION 3 BELOW IS SUPERSEDED BY `20260802_ewa_signed_at_insert_guard.sql`.
-- The `content_assets_ewa_signed_at_guard` created here is `before update` only, which is the
-- exact defect this header criticises in the gates it replaced, committed by the file making the
-- argument. The 20260802 migration re-creates it `before insert or update` and rewrites the
-- function to branch on TG_OP. Filename order puts 20260802 after this file, so a replay of the
-- directory ends at the INSERT-covered version; section 3 is left in place unchanged rather than
-- edited, because rewriting an applied migration hides the fact that it ran in its weaker form.
-- ═══════════════════════════════════════════════════════════════════════════════════════════

begin;

-- ── 1. ewa_signed_at: the DB-side record of a ruling Ewa actually gave ────────────────────────
-- Deliberately NOT backfilled. Every existing approved asset took the inheritance path, so a
-- timestamp here would be an invented signature on an asset she never individually signed.
-- Fabricating a sign-off date to satisfy a constraint is the worst thing this file could do: it
-- is the dead `TODO Ewa` marker failure again, except believed by the database.
alter table content_assets
  add column if not exists ewa_signed_at timestamptz;

comment on column content_assets.ewa_signed_at is
  'When Ewa''s ruling was RECORDED for this asset, written only by the sign-off sync that reads '
  'her ClickUp task (set app.ewa_sync = ''on'' for that transaction). Never set by hand: the '
  'system that resolves the sign-off is the system that records it, in the same write. NULL is '
  'normal and expected for an inheritance-cleared derivative, which carries a canonical article '
  'instead. Required only on the amber-ewa (net-new claim) path.';

-- ── 2. The approval gate, as a CHECK so INSERT cannot walk around it ──────────────────────────
alter table content_assets
  drop constraint if exists content_assets_approval_gate;
alter table content_assets
  add constraint content_assets_approval_gate check (
    status not in ('approved', 'done')
    or (preflight = 'green'     and canonical_article_id is not null)
    or (preflight = 'amber-ewa' and ewa_signed_at is not null)
  );

comment on constraint content_assets_approval_gate on content_assets is
  'Two routes to approved: inheritance (green + a canonical article to inherit clearance from), '
  'or net-new (amber-ewa + Ewa''s recorded ruling). A non-empty ewa_task is NOT a route: it '
  'proves a question was asked, not answered (Keith, 2026-08-01).';

-- Superseded by the constraint above: UPDATE-only, transition-based, and it accepted a routed
-- question as a ruling. Dropped rather than left beside it, because two encodings of one gate is
-- how the weaker one survives unnoticed.
drop trigger if exists gate_asset_approval on content_assets;
drop function if exists gate_asset_approval();

-- ── 3. ewa_signed_at is writable only by the sign-off sync ───────────────────────────────────
-- The direct fix for the dead-marker problem (§4): a hand-typed field asserting a state owned
-- elsewhere. The service role can write anything, so role permissions cannot express this; the
-- transaction has to declare itself instead. That is a speed bump against accident, NOT a
-- security boundary, and it is written down as such so nobody later mistakes it for one.
--
-- SUPERSEDED BY `20260802_ewa_signed_at_insert_guard.sql`. The trigger created at the end of this
-- section is `before update` only, so an INSERT carrying a hand-typed `ewa_signed_at` walked
-- straight past it and then past `content_assets_approval_gate`, which trusts that column. Read
-- the 20260802 file for the version that is live. Do not treat the definition below as current.
create or replace function content_assets_protect_ewa_signed_at()
returns trigger
language plpgsql
as $$
begin
  if new.ewa_signed_at is distinct from old.ewa_signed_at
     and coalesce(current_setting('app.ewa_sync', true), '') <> 'on' then
    raise exception
      'ewa_signed_at is written only by the sign-off sync, never by hand (asset %). The system '
      'that resolves the sign-off records it, in the same write. If you are that sync, run '
      'set local app.ewa_sync = ''on'' inside your transaction.', old.slug
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists content_assets_ewa_signed_at_guard on content_assets;
create trigger content_assets_ewa_signed_at_guard
  before update on content_assets
  for each row execute function content_assets_protect_ewa_signed_at();

-- ── 4. The rendition gate: one function, now covering INSERT ─────────────────────────────────
-- Keeps every rule the previous `gate_rendition_publish` carried (asset approved, canonical
-- article published, thumbnail confirmed, published implies a URL) and adds INSERT coverage.
-- The state rules are evaluated whenever the row IS at scheduled-or-later, not only when it
-- arrives there, so a later UPDATE cannot leave a row sitting in a state it could not have
-- reached. The thumbnail rule is the one genuine exception and stays transition-shaped, because
-- there is no `thumb_confirmed` column to test a resting row against (plan §4 names this gap).
create or replace function gate_rendition_publish()
returns trigger
language plpgsql
as $$
declare
  a              public.content_assets%rowtype;
  article_status text;
  arriving       boolean;
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

  return new;
end;
$$;

drop trigger if exists gate_rendition_publish on content_renditions;
create trigger gate_rendition_publish
  before insert or update on content_renditions
  for each row execute function gate_rendition_publish();

-- The parallel copy this migration's first draft added. Dropped: `gate_rendition_publish` above
-- is strictly stronger, and one rule in two places is what this phase exists to end.
drop trigger if exists content_renditions_live_gate_trg on content_renditions;
drop function if exists content_renditions_live_gate();

-- ── 5. thumb_spec must never be NULL ─────────────────────────────────────────────────────────
-- Plan §4: the `x` renditions carried NULL where every other no-thumbnail surface carried the
-- string 'none', so a gate written the obvious way ("needs a thumbnail unless thumb_spec is
-- 'none'") would have demanded thumbnails for text posts. Normalised 2026-07-31; this is what
-- stops it recurring, and the thumbnail rule above now reads `new.thumb_spec` with no coalesce
-- because NULL is no longer representable.
update content_renditions set thumb_spec = 'none' where thumb_spec is null;
alter table content_renditions
  alter column thumb_spec set not null;

commit;

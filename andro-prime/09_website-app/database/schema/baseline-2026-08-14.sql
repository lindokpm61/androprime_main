-- =============================================================================
-- SCHEMA BASELINE — public schema, as it stood on 2026-08-14
-- =============================================================================
--
-- WHAT THIS IS
--
-- A complete `pg_dump --schema-only` of the `public` schema of the production
-- database (project `phqrjtnflovicgkngieu`, region eu-west-1). It is a SNAPSHOT,
-- not a migration step.
--
-- WHY IT EXISTS
--
-- Until this file, the schema of this business existed in exactly one place: the
-- live database. Eleven entries in the applied-migration ledger had no matching
-- file in `database/migrations/`, including the four from 2026-07-28 that create
-- `content_assets`, `content_renditions` and `content_channels`, and nine files
-- had no matching ledger entry. There was therefore no reproducible path from the
-- repository to production, at a time when the project also had no managed
-- database backup. Losing the database meant losing the definition of it.
--
-- Recorded as finding 11.1 of `2026-08-13-content-machine-unification-proposal.md`
-- and executed as step 0.1 of `2026-08-14-content-machine-plan.md`.
--
-- ⚠ DO NOT RUN THIS AGAINST PRODUCTION.
--
-- Everything in it is already applied. It is here to be READ, to be diffed against
-- a future dump, and to rebuild an EMPTY database. Running it against the live
-- database would fail at the first `CREATE TABLE` and, where it did not fail,
-- would be destructive.
--
-- WHY IT IS NOT IN `database/migrations/`
--
-- That directory is an ordered, replayable log, and `sync-supabase-migrations.ps1`
-- copies every `*.sql` in it into the Supabase CLI's own migrations directory,
-- where `supabase db push` would apply it on top of an existing database. A
-- snapshot placed in an ordered log is a file that must never be replayed in
-- sequence with its neighbours, which is a trap rather than a record. The log and
-- the snapshot are different artefacts and live in different directories.
--
-- Note also that replaying the historical migrations on a live database is already
-- known to be unsafe: `20260804_kit_orders_order_seq.sql` says so in its own
-- header, because its closing `restart with` would reissue order references that
-- customers already hold.
--
-- HOW TO REBUILD AN EMPTY DATABASE FROM THIS
--
--   1. Create the project. Supabase provisions `auth`, `storage`, `realtime`,
--      `vault` and `extensions` itself; this file does not cover them.
--   2. Enable the extensions listed below.
--   3. Run this file. Note it contains `CREATE SCHEMA public;` at the top, which a
--      fresh Supabase project already has, so drop that one line or run it with
--      `ON_ERROR_STOP` off for that statement only.
--   4. Apply any migration in `database/migrations/` dated AFTER 2026-08-14.
--
-- EXTENSIONS INSTALLED IN PRODUCTION on 2026-08-14 (not created by this file):
--
--   pg_net              0.20.0   schema: extensions
--   pg_stat_statements  1.11     schema: extensions
--   pgcrypto            1.3      schema: extensions
--   plpgsql             1.0      schema: pg_catalog   (default)
--   supabase_vault      0.3.1    schema: vault        (Supabase-managed)
--   uuid-ossp           1.1      schema: extensions
--
-- The `public` DDL below references only `gen_random_uuid()`, which is core in
-- Postgres 13+, so it carries no hard dependency on any of the above.
--
-- VERIFIED AGAINST THE LIVE DATABASE at the moment of the dump. Every object class
-- was counted in the catalogue and in this file, and all matched:
--
--   tables       29     views          6     functions   8
--   triggers     19     enum types    11     policies   24
--   RLS-enabled  29     indexes       95  (51 standalone + 44 constraint-backed)
--
-- ON THE GRANTS BELOW. The first cut of this baseline recorded three SECURITY DEFINER
-- functions (`upsert_blog_article`, `stage_blog_revision`, `promote_proposed_revision`)
-- as EXECUTE-able by `anon`, which meant anyone holding the publicly-shipped anon key
-- could rewrite or publish any blog body, including clinically signed copy.
--
-- RULED AND FIXED the same day by Keith: see
-- `database/migrations/20260814_revoke_anon_execute_blog_write_rpcs.sql`. This file was
-- then regenerated, so the ACLs below are the corrected ones: all four blog-writing
-- functions now grant EXECUTE to `postgres` and `service_role` only, matching
-- `record_ewa_signoff`, which had always been right. Verified end to end afterwards: an
-- anon POST to `/rest/v1/rpc/upsert_blog_article` returns HTTP 401.
--
-- The principle stands for the next reader: a baseline records what IS, not what should
-- be. If a grant here looks wrong, fix it in a dated migration and regenerate this file.
-- Do not edit the ACLs in place; a hand-edited snapshot is no longer a snapshot.
--
-- REGENERATE WITH (password from SUPABASE_PASSWORD in the repo-root .env):
--
--   pg_dump --schema-only --schema=public --no-owner \
--     -h aws-0-eu-west-1.pooler.supabase.com -p 5432 \
--     -U postgres.phqrjtnflovicgkngieu -d postgres \
--     -f database/schema/baseline-<date>.sql
--
-- Use the SESSION pooler on 5432. The direct host `db.<ref>.supabase.co` is
-- IPv6-only and unreachable from an IPv4-only machine, and the transaction pooler
-- on 6543 does not support what pg_dump needs.
--
-- RE-DUMPED LATER THE SAME DAY (2026-08-14), after plan steps 1.1 and 1.2 landed.
-- Three migrations ran between the first dump and this one, and their effect is
-- ALREADY IN THIS FILE — do not replay them on top of it:
--
--   20260814_content_renditions_variant.sql            `variant` column, and the unique
--                                                      key becomes (asset_id, platform,
--                                                      format, variant) NULLS NOT DISTINCT
--   20260814_content_metrics_carousel_and_video.sql    saves, reach, video_views,
--                                                      watch_seconds
--   20260814_content_channels_instagram_carousel.sql   one registry row (data, not schema)
--
-- Object counts re-verified against the live catalogue at this dump and UNCHANGED
-- from the first one, which is the expected result: the changes were columns and a
-- one-for-one constraint swap, not new objects.
--
-- Dumped by pg_dump 17.2 from server 17.6.1.104.
-- =============================================================================

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: agent_run_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.agent_run_status AS ENUM (
    'ok',
    'error',
    'blocked'
);


--
-- Name: blog_article_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.blog_article_status AS ENUM (
    'draft',
    'published',
    'archived'
);


--
-- Name: content_blocked_on; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.content_blocked_on AS ENUM (
    'keith',
    'ewa'
);


--
-- Name: content_pipeline_stage; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.content_pipeline_stage AS ENUM (
    'keyword_selected',
    'briefed',
    'brief_ready',
    'drafted',
    'in_review',
    'approved',
    'scheduled',
    'published',
    'reoptimising'
);


--
-- Name: content_review_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.content_review_status AS ENUM (
    'submitted',
    'approved',
    'rejected',
    'needs_revision'
);


--
-- Name: deposit_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.deposit_status AS ENUM (
    'pending',
    'paid',
    'cancelled',
    'refunded'
);


--
-- Name: keyword_coverage_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.keyword_coverage_status AS ENUM (
    'unassigned',
    'planned',
    'briefed',
    'drafted',
    'published',
    'deferred',
    'excluded'
);


--
-- Name: keyword_queue_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.keyword_queue_status AS ENUM (
    'candidate',
    'accepted',
    'rejected'
);


--
-- Name: kit_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.kit_type AS ENUM (
    'testosterone',
    'energy-recovery',
    'hormone-recovery'
);


--
-- Name: order_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.order_status AS ENUM (
    'pending',
    'paid',
    'dispatched',
    'sample_registered',
    'processing',
    'results_received',
    'cancelled',
    'refunded',
    'sample_failed',
    'on_hold',
    'data_purged'
);


--
-- Name: subscription_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.subscription_status AS ENUM (
    'incomplete',
    'trialing',
    'active',
    'past_due',
    'cancelled',
    'unpaid'
);


--
-- Name: content_assets_protect_ewa_signed_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.content_assets_protect_ewa_signed_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  sanctioned boolean := coalesce(current_setting('app.ewa_sync', true), '') = 'on';
  changed    boolean;
begin
  if tg_op = 'INSERT' then
    changed := new.ewa_signed_at is not null;
  else
    changed := new.ewa_signed_at is distinct from old.ewa_signed_at;
  end if;

  if changed and not sanctioned then
    raise exception
      'ewa_signed_at is written only by the sign-off sync, never by hand (asset %, via %). The system that resolves the sign-off records it, in the same write. If you are that sync, run set local app.ewa_sync = ''on'' inside your transaction.', new.slug, tg_op
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;


--
-- Name: gate_rendition_publish(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.gate_rendition_publish() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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

  if arriving
     and new.thumb_spec <> 'none'
     and new.status in ('scheduled', 'published')
     and (tg_op = 'INSERT' or old.status not in ('thumbnail-done', 'scheduled', 'published', 'measured')) then
    raise exception
      'GATE: rendition %/% needs a confirmed thumbnail before %.',
      new.platform, new.format, new.status
      using errcode = 'check_violation';
  end if;

  if new.status in ('published', 'measured') and coalesce(new.external_url, '') = '' then
    raise exception
      'GATE: rendition %/% cannot be % without an external_url.',
      new.platform, new.format, new.status
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;


--
-- Name: handle_auth_user_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_auth_user_change() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  insert into public.users (id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (id) do update
    set email = excluded.email,
        updated_at = timezone('utc', now());

  return new;
end;
$$;


--
-- Name: promote_proposed_revision(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.promote_proposed_revision(p_slug text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  v_article_id uuid;
  v_proposed uuid;
  v_body text;
  v_fm jsonb;
  v_kc jsonb;
begin
  select id, proposed_revision_id into v_article_id, v_proposed
    from public.blog_articles where slug = p_slug;
  if v_article_id is null then
    raise exception 'promote_proposed_revision: no article with slug %', p_slug;
  end if;
  if v_proposed is null then
    return null;
  end if;

  select body, frontmatter, keyword_coverage into v_body, v_fm, v_kc
    from public.blog_article_revisions where id = v_proposed;

  update public.blog_articles
    set body = v_body,
        frontmatter = v_fm,
        keyword_coverage = v_kc,
        current_revision_id = v_proposed,
        proposed_revision_id = null
    where id = v_article_id;

  return v_proposed;
end;
$$;


--
-- Name: record_ewa_signoff(text, timestamp with time zone); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.record_ewa_signoff(p_slug text, p_signed_at timestamp with time zone DEFAULT now()) RETURNS timestamp with time zone
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  v_signed timestamptz;
begin
  if p_slug is null or btrim(p_slug) = '' then
    raise exception 'record_ewa_signoff: slug is required';
  end if;

  perform set_config('app.ewa_sync', 'on', true);

  update public.content_assets
     set ewa_signed_at = p_signed_at
   where slug = p_slug
     and ewa_signed_at is null
     and ewa_task is not null
  returning ewa_signed_at into v_signed;

  return v_signed;
end;
$$;


--
-- Name: FUNCTION record_ewa_signoff(p_slug text, p_signed_at timestamp with time zone); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.record_ewa_signoff(p_slug text, p_signed_at timestamp with time zone) IS 'The sign-off sync''s authorised write of content_assets.ewa_signed_at, holding the app.ewa_sync setting the guard trigger requires. Called only by scripts/content-engine/signoff-sync.ts, which supplies the evidence (a completed ClickUp review task with no unresolved rulings). Idempotent: never overwrites an existing signature, and refuses a slug with no ewa_task.';


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = now();
  return new;
end $$;


--
-- Name: stage_blog_revision(text, text, jsonb, jsonb, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.stage_blog_revision(p_slug text, p_body text, p_frontmatter jsonb, p_keyword_coverage jsonb, p_editor text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  v_article_id uuid;
  v_revision_id uuid;
begin
  select id into v_article_id from public.blog_articles where slug = p_slug;
  if v_article_id is null then
    raise exception 'stage_blog_revision: no article with slug %', p_slug;
  end if;

  insert into public.blog_article_revisions (article_id, body, frontmatter, keyword_coverage, editor)
  values (v_article_id, p_body, p_frontmatter, p_keyword_coverage, p_editor)
  returning id into v_revision_id;

  update public.blog_articles
    set proposed_revision_id = v_revision_id
    where id = v_article_id;

  return v_revision_id;
end;
$$;


--
-- Name: upsert_blog_article(text, public.blog_article_status, text, jsonb, jsonb, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.upsert_blog_article(p_slug text, p_status public.blog_article_status, p_body text, p_frontmatter jsonb, p_keyword_coverage jsonb, p_editor text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  v_article_id uuid;
  v_revision_id uuid;
begin
  insert into public.blog_articles (slug, status, body, frontmatter, keyword_coverage, published_at)
  values (
    p_slug, p_status, p_body, p_frontmatter, p_keyword_coverage,
    case when p_status = 'published' then timezone('utc', now()) else null end
  )
  on conflict (slug) do update
    set status = excluded.status,
        body = excluded.body,
        frontmatter = excluded.frontmatter,
        keyword_coverage = excluded.keyword_coverage,
        published_at = case
          when excluded.status = 'published' and public.blog_articles.published_at is null
            then timezone('utc', now())
          else public.blog_articles.published_at
        end
  returning id into v_article_id;

  insert into public.blog_article_revisions (article_id, body, frontmatter, keyword_coverage, editor)
  values (v_article_id, p_body, p_frontmatter, p_keyword_coverage, p_editor)
  returning id into v_revision_id;

  update public.blog_articles
    set current_revision_id = v_revision_id
    where id = v_article_id;

  return v_article_id;
end;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: agent_runs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agent_runs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agent text NOT NULL,
    item_ref text,
    status public.agent_run_status NOT NULL,
    error text,
    detail jsonb,
    started_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    finished_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: biomarker_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.biomarker_values (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    result_id uuid NOT NULL,
    marker_name text NOT NULL,
    value numeric(12,4) NOT NULL,
    unit text NOT NULL,
    reference_low numeric(12,4),
    reference_high numeric(12,4),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: blog_article_revisions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_article_revisions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    article_id uuid NOT NULL,
    body text NOT NULL,
    frontmatter jsonb DEFAULT '{}'::jsonb NOT NULL,
    keyword_coverage jsonb,
    editor text DEFAULT 'system'::text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: blog_articles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_articles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    status public.blog_article_status DEFAULT 'draft'::public.blog_article_status NOT NULL,
    body text NOT NULL,
    frontmatter jsonb DEFAULT '{}'::jsonb NOT NULL,
    keyword_coverage jsonb,
    current_revision_id uuid,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    proposed_revision_id uuid
);


--
-- Name: borderline_nurture_consent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.borderline_nurture_consent (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    email text NOT NULL,
    consent_version text NOT NULL,
    source text DEFAULT 'result_card'::text NOT NULL,
    consented_at timestamp with time zone DEFAULT now() NOT NULL,
    withdrawn_at timestamp with time zone
);


--
-- Name: bundle_dispatches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bundle_dispatches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    parent_order_id uuid NOT NULL,
    user_id uuid NOT NULL,
    kit_type public.kit_type NOT NULL,
    bundle_type text NOT NULL,
    status text DEFAULT 'scheduled'::text NOT NULL,
    due_at timestamp with time zone,
    triggered_at timestamp with time zone,
    address_check_at timestamp with time zone,
    second_order_id uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT bundle_dispatches_bundle_type_check CHECK ((bundle_type = ANY (ARRAY['confirmation'::text, 'prove_it'::text, 'full_picture'::text]))),
    CONSTRAINT bundle_dispatches_status_check CHECK ((status = ANY (ARRAY['scheduled'::text, 'trigger_met'::text, 'awaiting_window'::text, 'dispatched'::text, 'not_needed'::text, 'cancelled'::text])))
);


--
-- Name: content_asset_revisions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_asset_revisions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    asset_id uuid NOT NULL,
    revision integer NOT NULL,
    hook text,
    script text,
    note text,
    created_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE content_asset_revisions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.content_asset_revisions IS 'Mirrors blog_article_revisions. The compliance trail must show what was cleared, not only what is current.';


--
-- Name: content_assets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_assets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    status text DEFAULT 'idea'::text NOT NULL,
    content_type text,
    funnel_stage text,
    funnel_job text,
    awareness text,
    cta text,
    markers text[] DEFAULT '{}'::text[] NOT NULL,
    series text,
    preflight text DEFAULT 'not-run'::text NOT NULL,
    preflight_date date,
    ewa_task text,
    canonical_article_id uuid,
    drive_url text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    ewa_signed_at timestamp with time zone,
    approved_by text,
    approved_at date,
    CONSTRAINT content_assets_approval_gate CHECK (((status <> ALL (ARRAY['approved'::text, 'done'::text])) OR ((preflight = 'green'::text) AND (canonical_article_id IS NOT NULL)) OR ((preflight = 'amber-ewa'::text) AND (ewa_signed_at IS NOT NULL)))),
    CONSTRAINT content_assets_awareness_check CHECK ((awareness = ANY (ARRAY['unaware'::text, 'problem-aware'::text, 'solution-aware'::text, 'product-aware'::text, 'customer'::text, 'advocate'::text]))),
    CONSTRAINT content_assets_content_type_check CHECK ((content_type = ANY (ARRAY['educational'::text, 'personal-story'::text, 'proof-result'::text, 'objection-comparison'::text]))),
    CONSTRAINT content_assets_cta_check CHECK ((cta = ANY (ARRAY['follow'::text, 'quiz'::text, 'email-rung'::text, 'canonical-article'::text, 'kit-1'::text, 'kit-2'::text, 'kit-3'::text, 'retest'::text, 'referral'::text]))),
    CONSTRAINT content_assets_funnel_stage_check CHECK ((funnel_stage = ANY (ARRAY['TOFU'::text, 'MOFU'::text, 'BOFU'::text, 'RETENTION'::text]))),
    CONSTRAINT content_assets_preflight_check CHECK ((preflight = ANY (ARRAY['not-run'::text, 'green'::text, 'amber-ewa'::text, 'red'::text]))),
    CONSTRAINT content_assets_status_check CHECK ((status = ANY (ARRAY['idea'::text, 'hooked'::text, 'scripted'::text, 'recorded'::text, 'edited'::text, 'approved'::text, 'done'::text])))
);


--
-- Name: COLUMN content_assets.markers; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_assets.markers IS 'Array, not a single value: four-worth-seeing carries four markers. The old YAML field could not express that.';


--
-- Name: COLUMN content_assets.canonical_article_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_assets.canonical_article_id IS 'The Ewa-signed article this asset inherits its claims from. NULL means founder-journey / own-story, which needs its own clearance.';


--
-- Name: COLUMN content_assets.ewa_signed_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_assets.ewa_signed_at IS 'When Ewa''s ruling was RECORDED for this asset, written only by the sign-off sync that reads her ClickUp task (set app.ewa_sync = ''on'' for that transaction). Never set by hand. NULL is normal for an inheritance-cleared derivative, which carries a canonical article instead. Required only on the amber-ewa (net-new claim) path.';


--
-- Name: COLUMN content_assets.approved_by; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_assets.approved_by IS 'Who gave the BUSINESS approval to ship this asset (plan section 6: "Keith''s approval to ship. One human decision before anything reaches the public"). Distinct from ewa_signed_at, which is the CLINICAL sign-off. Deliberately NOT protected by a write trigger, unlike ewa_signed_at: Keith''s approval is a human act recorded by hand, whereas Ewa''s is resolved by a system (her ClickUp task) and must therefore be recorded by that same system.';


--
-- Name: COLUMN content_assets.approved_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_assets.approved_at IS 'Date of the business approval named in approved_by. NULL is normal: only assets whose approval was explicitly recorded carry it, and most predate the convention.';


--
-- Name: CONSTRAINT content_assets_approval_gate ON content_assets; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON CONSTRAINT content_assets_approval_gate ON public.content_assets IS 'Two routes to approved: inheritance (green + a canonical article to inherit clearance from), or net-new (amber-ewa + Ewa''s recorded ruling). A non-empty ewa_task is NOT a route: it proves a question was asked, not answered (Keith, 2026-08-01).';


--
-- Name: content_channels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_channels (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    platform text NOT NULL,
    format text NOT NULL,
    label text NOT NULL,
    lane text NOT NULL,
    in_plan boolean DEFAULT true NOT NULL,
    connected boolean DEFAULT false NOT NULL,
    publisher text,
    account text,
    notes text,
    sort_order integer DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    coverage_paused_until date,
    coverage_pause_reason text,
    CONSTRAINT content_channels_coverage_pause_needs_reason CHECK (((coverage_paused_until IS NULL) OR ((coverage_pause_reason IS NOT NULL) AND (btrim(coverage_pause_reason) <> ''::text)))),
    CONSTRAINT content_channels_lane_check CHECK ((lane = ANY (ARRAY['lane-1'::text, 'lane-2'::text]))),
    CONSTRAINT content_channels_publisher_check CHECK ((publisher = ANY (ARRAY['metricool'::text, 'unipile'::text, 'substack-script'::text, 'manual'::text])))
);


--
-- Name: TABLE content_channels; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.content_channels IS 'Spine B distribution surfaces. in_plan = the content plan covers it; connected = an account is wired. A row where connected is true and in_plan is false is a channel that arrived without a lane.';


--
-- Name: COLUMN content_channels.coverage_paused_until; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_channels.coverage_paused_until IS 'Date this coverage pause EXPIRES (inclusive). Null means the channel is expected to produce. Past this date the channel is red again in doctor I10, deliberately: a pause that cannot lapse is indistinguishable from a channel nobody is watching.';


--
-- Name: COLUMN content_channels.coverage_pause_reason; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_channels.coverage_pause_reason IS 'Why this channel is deliberately dark. Required whenever coverage_paused_until is set; the CHECK refuses a pause with no stated reason, because an unexplained pause is the same silence the invariant exists to break.';


--
-- Name: content_hooks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_hooks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    asset_id uuid NOT NULL,
    archetype text,
    spoken text NOT NULL,
    text_overlay text,
    visual text,
    question text,
    score_total integer,
    score_detail jsonb,
    gate_failures text[] DEFAULT '{}'::text[] NOT NULL,
    targeted text,
    chosen boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT content_hooks_archetype_check CHECK ((archetype = ANY (ARRAY['fortune-teller'::text, 'experimenter'::text, 'teacher'::text, 'magician'::text, 'investigator'::text, 'contrarian'::text]))),
    CONSTRAINT content_hooks_score_total_check CHECK (((score_total >= 0) AND (score_total <= 12))),
    CONSTRAINT content_hooks_targeted_check CHECK ((targeted = ANY (ARRAY['mainstream'::text, 'power-user'::text])))
);


--
-- Name: TABLE content_hooks; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.content_hooks IS 'EVERY hook generated, including rejected ones. Winners-only data cannot tell you whether the rubric scores correctly; the low-scored ones are the control group. This is what fills hook-rubric.md section 5.';


--
-- Name: content_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_metrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rendition_id uuid NOT NULL,
    captured_at timestamp with time zone DEFAULT now() NOT NULL,
    impressions integer,
    reactions integer,
    comments integer,
    shares integer,
    profile_viewers integer,
    followers_gained integer,
    raw jsonb,
    saves integer,
    reach integer,
    video_views integer,
    watch_seconds numeric
);


--
-- Name: COLUMN content_metrics.shares; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_metrics.shares IS 'Maps to Unipile repost_counter. Note there is no clicks field on the LinkedIn response.';


--
-- Name: COLUMN content_metrics.profile_viewers; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_metrics.profile_viewers IS 'Unipile analytics.profile_viewers_from_this_post. For a founder-halo channel this is closer to the real KPI than impressions.';


--
-- Name: COLUMN content_metrics.followers_gained; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_metrics.followers_gained IS 'Unipile analytics.followers_gained_from_this_post.';


--
-- Name: COLUMN content_metrics.saves; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_metrics.saves IS 'Saves / bookmarks. Instagram''s strongest carousel signal and the winning metric of the 2026-08 close test; `reactions` is likes and is NOT this. X reports it as totalBookmarks. Read it at a FIXED AGE (saves at seven days), never as a running total: the rotation gives close A a two-day age advantage over close C, so a single-moment comparison ranks the closes by publish date.';


--
-- Name: COLUMN content_metrics.reach; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_metrics.reach IS 'Unique accounts reached, where the platform reports it separately from impressions (Instagram does; LinkedIn calls the same idea uniqueImpressions). Null means the platform did not report it, never that it was zero.';


--
-- Name: COLUMN content_metrics.video_views; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_metrics.video_views IS 'Plays. For the shot arm (21 renditions waiting on a filming day) and for any video-covered carousel. Platforms count a "view" differently and the definitions are not comparable across networks; compare within a platform only.';


--
-- Name: COLUMN content_metrics.watch_seconds; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_metrics.watch_seconds IS 'TOTAL seconds watched, so average watch time is derivable as watch_seconds / video_views. A platform reporting only an average is left in `raw` rather than multiplied up into a total nobody measured.';


--
-- Name: content_pipeline; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_pipeline (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text,
    pillar text,
    stage public.content_pipeline_stage DEFAULT 'keyword_selected'::public.content_pipeline_stage NOT NULL,
    article_id uuid,
    brief_ref text,
    target_date date,
    blocked_on public.content_blocked_on,
    clickup_task_id text,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: content_renditions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_renditions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    asset_id uuid NOT NULL,
    platform text NOT NULL,
    format text NOT NULL,
    body text,
    first_comment text,
    thumb_spec text NOT NULL,
    status text DEFAULT 'to-produce'::text NOT NULL,
    scheduled_for timestamp with time zone,
    published_at timestamp with time zone,
    external_url text,
    external_post_id text,
    unipile_account text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    publisher text,
    variant text,
    CONSTRAINT content_renditions_format_check CHECK ((format = ANY (ARRAY['reel'::text, 'short'::text, 'long-form'::text, 'link-post'::text, 'text-post'::text, 'newsletter'::text, 'story'::text, 'carousel'::text, 'thread'::text, 'image-post'::text, 'video'::text]))),
    CONSTRAINT content_renditions_platform_check CHECK ((platform = ANY (ARRAY['linkedin'::text, 'instagram'::text, 'facebook'::text, 'youtube'::text, 'tiktok'::text, 'substack'::text, 'x'::text, 'threads'::text, 'bluesky'::text, 'pinterest'::text, 'google-business'::text, 'twitch'::text]))),
    CONSTRAINT content_renditions_publisher_check CHECK ((publisher = ANY (ARRAY['metricool'::text, 'unipile'::text, 'substack-script'::text, 'manual'::text]))),
    CONSTRAINT content_renditions_status_check CHECK ((status = ANY (ARRAY['to-produce'::text, 'thumbnail-done'::text, 'scheduled'::text, 'published'::text, 'measured'::text]))),
    CONSTRAINT content_renditions_thumb_spec_check CHECK ((thumb_spec = ANY (ARRAY['9x16'::text, '1280x720'::text, '1200x630'::text, 'none'::text]))),
    CONSTRAINT content_renditions_variant_shape CHECK (((variant IS NULL) OR ((variant = btrim(variant)) AND ((length(variant) >= 1) AND (length(variant) <= 24)))))
);


--
-- Name: COLUMN content_renditions.body; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_renditions.body IS 'The post copy for THIS platform. Copy differs per platform, which is why it lives on the rendition and not the asset.';


--
-- Name: COLUMN content_renditions.scheduled_for; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_renditions.scheduled_for IS 'Intent only. Unipile has no scheduled_at on its create-post endpoint (verified 2026-07-28): it publishes immediately or not at all. Something on our side has to fire.';


--
-- Name: COLUMN content_renditions.publisher; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_renditions.publisher IS 'Which route pushed this live, because the metrics read-back differs per route. metricool = Metricool API/MCP; unipile = direct Unipile call; substack-script = the owned draft-push tool; manual = published by hand in the platform UI.';


--
-- Name: COLUMN content_renditions.variant; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.content_renditions.variant IS 'Which version of this rendition ran, when one asset ships the same platform+format more than once on purpose. NULL is the normal case and means "the only one". On the 2026-08 carousel run it holds A, B or C: the same deck with a different closing slide, which is the experiment. It records WHICH close ran, not what that close asked for (A=quiz, B=kit, C=article, fixed by closes.js and CA-031/CA-034 K2). Part of the unique key, which is NULLS NOT DISTINCT so a null variant still means one row per (asset, platform, format).';


--
-- Name: content_review_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_review_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    content_type text NOT NULL,
    channel text,
    submitted_by uuid,
    submitted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewer_name text DEFAULT 'Dr Ewa Lindo'::text NOT NULL,
    reviewed_at timestamp with time zone,
    status public.content_review_status DEFAULT 'submitted'::public.content_review_status NOT NULL,
    notes text,
    clickup_task_id text,
    content_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    article_id uuid,
    revision_id uuid,
    reviewer_gmc text,
    scope text
);


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_name text NOT NULL,
    occurred_at timestamp with time zone DEFAULT now() NOT NULL,
    anonymous_id text,
    email_hash text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    utm_term text,
    utm_content text,
    fpr_tid text,
    referrer text,
    landing_path text,
    value numeric,
    currency text,
    kit_id text,
    sku text,
    props jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: founding_member_deposits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.founding_member_deposits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    stripe_payment_intent text,
    paid_at timestamp with time zone,
    status public.deposit_status DEFAULT 'pending'::public.deposit_status NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: founding_member_list; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.founding_member_list (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    email text NOT NULL,
    first_name text,
    last_name text,
    source text DEFAULT 'public_form'::text NOT NULL,
    listed_at timestamp with time zone DEFAULT now() NOT NULL,
    unlisted_at timestamp with time zone
);


--
-- Name: keyword_queue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.keyword_queue (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    query text NOT NULL,
    vol integer,
    kd integer,
    cpc numeric,
    pillar text,
    compliance_risk text,
    proposed_slug text,
    status public.keyword_queue_status DEFAULT 'candidate'::public.keyword_queue_status NOT NULL,
    coverage_status public.keyword_coverage_status DEFAULT 'unassigned'::public.keyword_coverage_status NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: kit_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kit_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    kit_type public.kit_type NOT NULL,
    stripe_payment_intent text,
    status public.order_status DEFAULT 'pending'::public.order_status NOT NULL,
    ordered_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    kit_activated_at timestamp with time zone,
    vitall_order_id text,
    shipping_address jsonb,
    is_test boolean DEFAULT false NOT NULL,
    order_seq bigint NOT NULL
);


--
-- Name: COLUMN kit_orders.is_test; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.kit_orders.is_test IS 'Internal test / process-verification order, not a sale. Excluded from every revenue and gate KPI view. Set by hand; nothing in the app writes it.';


--
-- Name: COLUMN kit_orders.order_seq; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.kit_orders.order_seq IS 'Customer-facing order reference, rendered as AP-{order_seq}. Live orders start at 10000; values below that belong to internal test orders. Never reuse or renumber: customers quote these.';


--
-- Name: kit_orders_order_seq_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.kit_orders ALTER COLUMN order_seq ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.kit_orders_order_seq_seq
    START WITH 10000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lab_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lab_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    user_id uuid NOT NULL,
    kit_type public.kit_type NOT NULL,
    received_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    raw_payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: lifecycle_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lifecycle_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    event_name text NOT NULL,
    payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    emitted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: lowt_nurture_consent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lowt_nurture_consent (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    email text NOT NULL,
    consent_version text NOT NULL,
    source text DEFAULT 'result_card'::text NOT NULL,
    consented_at timestamp with time zone DEFAULT now() NOT NULL,
    withdrawn_at timestamp with time zone
);


--
-- Name: processed_stripe_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.processed_stripe_events (
    event_id text NOT NULL,
    event_type text NOT NULL,
    processed_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: qualifier_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.qualifier_responses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    result_id uuid NOT NULL,
    question_key text NOT NULL,
    answer jsonb NOT NULL,
    captured_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: sample_registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sample_registrations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    barcode text NOT NULL,
    registered_at timestamp with time zone,
    dispatched_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: supplement_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.supplement_subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    stripe_subscription_id text NOT NULL,
    product_slug text NOT NULL,
    status public.subscription_status DEFAULT 'incomplete'::public.subscription_status NOT NULL,
    started_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: supplement_waitlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.supplement_waitlist (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    email text NOT NULL,
    source_marker text,
    source_kit text,
    interested_in_product text,
    listed_at timestamp with time zone DEFAULT now() NOT NULL,
    unlisted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: symptom_answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.symptom_answers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    order_id uuid NOT NULL,
    question_key text NOT NULL,
    answer jsonb NOT NULL,
    captured_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email text NOT NULL,
    age integer,
    marketing_consent boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    first_name text,
    last_name text,
    phone text,
    date_of_birth date,
    sex text,
    address_line1 text,
    address_line2 text,
    address_city text,
    address_postal_code text,
    address_country text DEFAULT 'GB'::text,
    address_county text,
    health_processing_consent_version text,
    health_processing_consented_at timestamp with time zone,
    CONSTRAINT users_age_check CHECK (((age IS NULL) OR (age >= 18))),
    CONSTRAINT users_dob_18_plus_check CHECK (((date_of_birth IS NULL) OR (date_of_birth <= (CURRENT_DATE - '18 years'::interval)))),
    CONSTRAINT users_sex_check CHECK (((sex IS NULL) OR (sex = ANY (ARRAY['male'::text, 'female'::text]))))
);


--
-- Name: v_deposit_summary; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.v_deposit_summary AS
 SELECT count(*) FILTER (WHERE (status = 'paid'::public.deposit_status)) AS total_paid,
    count(*) FILTER (WHERE (status = 'pending'::public.deposit_status)) AS total_pending,
    count(*) FILTER (WHERE (status = 'refunded'::public.deposit_status)) AS total_refunded,
    sum(
        CASE
            WHEN (status = 'paid'::public.deposit_status) THEN 75
            ELSE 0
        END) AS total_revenue_gbp
   FROM public.founding_member_deposits;


--
-- Name: v_result_to_supplement_conversion; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.v_result_to_supplement_conversion AS
 SELECT lr.kit_type,
    count(DISTINCT lr.user_id) AS users_with_result,
    count(DISTINCT ss.user_id) AS users_with_subscription,
    round(((100.0 * (count(DISTINCT ss.user_id))::numeric) / (NULLIF(count(DISTINCT lr.user_id), 0))::numeric), 1) AS conversion_pct
   FROM ((public.lab_results lr
     JOIN public.kit_orders ko ON (((ko.id = lr.order_id) AND (NOT ko.is_test))))
     LEFT JOIN public.supplement_subscriptions ss ON (((ss.user_id = lr.user_id) AND (ss.status = 'active'::public.subscription_status))))
  GROUP BY lr.kit_type;


--
-- Name: v_supplement_mrr; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.v_supplement_mrr AS
 SELECT product_slug,
    count(*) AS active_subscribers,
        CASE product_slug
            WHEN 'daily-stack'::text THEN ((count(*))::numeric * 34.95)
            WHEN 'collagen'::text THEN ((count(*))::numeric * 29.95)
            WHEN 'complete-mens-stack'::text THEN ((count(*))::numeric * 54.95)
            ELSE (0)::numeric
        END AS mrr_gbp
   FROM public.supplement_subscriptions
  WHERE (status = 'active'::public.subscription_status)
  GROUP BY product_slug;


--
-- Name: v_gate_tracker; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.v_gate_tracker AS
 SELECT ( SELECT count(*) AS count
           FROM public.kit_orders
          WHERE ((kit_orders.status <> 'cancelled'::public.order_status) AND (NOT kit_orders.is_test))) AS total_kits_sold,
    ( SELECT count(*) AS count
           FROM public.founding_member_list
          WHERE (founding_member_list.unlisted_at IS NULL)) AS fm_list_optins,
    ( SELECT count(*) AS count
           FROM public.founding_member_deposits
          WHERE (founding_member_deposits.status = 'paid'::public.deposit_status)) AS total_deposits_paid,
    ( SELECT v_result_to_supplement_conversion.conversion_pct
           FROM public.v_result_to_supplement_conversion
          WHERE (v_result_to_supplement_conversion.kit_type = ANY (ARRAY['energy-recovery'::public.kit_type, 'hormone-recovery'::public.kit_type]))
         LIMIT 1) AS kit23_to_sub_conversion_pct,
    ( SELECT COALESCE(sum(v_supplement_mrr.mrr_gbp), (0)::numeric) AS "coalesce"
           FROM public.v_supplement_mrr) AS supplement_mrr_gbp,
    ( SELECT count(*) AS count
           FROM public.supplement_subscriptions
          WHERE (supplement_subscriptions.status = 'active'::public.subscription_status)) AS active_sub_count;


--
-- Name: v_kit_pipeline; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.v_kit_pipeline AS
 SELECT kit_type,
    status,
    count(*) AS order_count,
    date_trunc('week'::text, ordered_at) AS week_start
   FROM public.kit_orders ko
  WHERE (NOT is_test)
  GROUP BY kit_type, status, (date_trunc('week'::text, ordered_at))
  ORDER BY (date_trunc('week'::text, ordered_at)) DESC, kit_type;


--
-- Name: v_weekly_kit_sales; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.v_weekly_kit_sales AS
 SELECT date_trunc('week'::text, ordered_at) AS week_start,
    kit_type,
    count(*) AS units_sold
   FROM public.kit_orders
  WHERE ((status <> ALL (ARRAY['cancelled'::public.order_status, 'refunded'::public.order_status])) AND (NOT is_test))
  GROUP BY (date_trunc('week'::text, ordered_at)), kit_type
  ORDER BY (date_trunc('week'::text, ordered_at)) DESC;


--
-- Name: agent_runs agent_runs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agent_runs
    ADD CONSTRAINT agent_runs_pkey PRIMARY KEY (id);


--
-- Name: biomarker_values biomarker_values_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.biomarker_values
    ADD CONSTRAINT biomarker_values_pkey PRIMARY KEY (id);


--
-- Name: blog_article_revisions blog_article_revisions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_article_revisions
    ADD CONSTRAINT blog_article_revisions_pkey PRIMARY KEY (id);


--
-- Name: blog_articles blog_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_articles
    ADD CONSTRAINT blog_articles_pkey PRIMARY KEY (id);


--
-- Name: blog_articles blog_articles_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_articles
    ADD CONSTRAINT blog_articles_slug_key UNIQUE (slug);


--
-- Name: borderline_nurture_consent borderline_nurture_consent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.borderline_nurture_consent
    ADD CONSTRAINT borderline_nurture_consent_pkey PRIMARY KEY (id);


--
-- Name: bundle_dispatches bundle_dispatches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bundle_dispatches
    ADD CONSTRAINT bundle_dispatches_pkey PRIMARY KEY (id);


--
-- Name: content_asset_revisions content_asset_revisions_asset_id_revision_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_asset_revisions
    ADD CONSTRAINT content_asset_revisions_asset_id_revision_key UNIQUE (asset_id, revision);


--
-- Name: content_asset_revisions content_asset_revisions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_asset_revisions
    ADD CONSTRAINT content_asset_revisions_pkey PRIMARY KEY (id);


--
-- Name: content_assets content_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_assets
    ADD CONSTRAINT content_assets_pkey PRIMARY KEY (id);


--
-- Name: content_assets content_assets_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_assets
    ADD CONSTRAINT content_assets_slug_key UNIQUE (slug);


--
-- Name: content_channels content_channels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_channels
    ADD CONSTRAINT content_channels_pkey PRIMARY KEY (id);


--
-- Name: content_channels content_channels_platform_format_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_channels
    ADD CONSTRAINT content_channels_platform_format_key UNIQUE (platform, format);


--
-- Name: content_hooks content_hooks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_hooks
    ADD CONSTRAINT content_hooks_pkey PRIMARY KEY (id);


--
-- Name: content_metrics content_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_metrics
    ADD CONSTRAINT content_metrics_pkey PRIMARY KEY (id);


--
-- Name: content_metrics content_metrics_rendition_id_captured_at_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_metrics
    ADD CONSTRAINT content_metrics_rendition_id_captured_at_key UNIQUE (rendition_id, captured_at);


--
-- Name: content_pipeline content_pipeline_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_pipeline
    ADD CONSTRAINT content_pipeline_pkey PRIMARY KEY (id);


--
-- Name: content_renditions content_renditions_asset_platform_format_variant_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_renditions
    ADD CONSTRAINT content_renditions_asset_platform_format_variant_key UNIQUE NULLS NOT DISTINCT (asset_id, platform, format, variant);


--
-- Name: CONSTRAINT content_renditions_asset_platform_format_variant_key ON content_renditions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON CONSTRAINT content_renditions_asset_platform_format_variant_key ON public.content_renditions IS 'One rendition per (asset, platform, format, variant). NULLS NOT DISTINCT deliberately: it preserves the pre-2026-08-14 guarantee of one row per (asset, platform, format) for every rendition that carries no variant, instead of quietly letting nulls duplicate.';


--
-- Name: content_renditions content_renditions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_renditions
    ADD CONSTRAINT content_renditions_pkey PRIMARY KEY (id);


--
-- Name: content_review_log content_review_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_review_log
    ADD CONSTRAINT content_review_log_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: founding_member_deposits founding_member_deposits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.founding_member_deposits
    ADD CONSTRAINT founding_member_deposits_pkey PRIMARY KEY (id);


--
-- Name: founding_member_deposits founding_member_deposits_stripe_payment_intent_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.founding_member_deposits
    ADD CONSTRAINT founding_member_deposits_stripe_payment_intent_key UNIQUE (stripe_payment_intent);


--
-- Name: founding_member_list founding_member_list_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.founding_member_list
    ADD CONSTRAINT founding_member_list_pkey PRIMARY KEY (id);


--
-- Name: keyword_queue keyword_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keyword_queue
    ADD CONSTRAINT keyword_queue_pkey PRIMARY KEY (id);


--
-- Name: kit_orders kit_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kit_orders
    ADD CONSTRAINT kit_orders_pkey PRIMARY KEY (id);


--
-- Name: kit_orders kit_orders_stripe_payment_intent_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kit_orders
    ADD CONSTRAINT kit_orders_stripe_payment_intent_key UNIQUE (stripe_payment_intent);


--
-- Name: kit_orders kit_orders_vitall_order_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kit_orders
    ADD CONSTRAINT kit_orders_vitall_order_id_key UNIQUE (vitall_order_id);


--
-- Name: lab_results lab_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_results
    ADD CONSTRAINT lab_results_pkey PRIMARY KEY (id);


--
-- Name: lifecycle_events lifecycle_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lifecycle_events
    ADD CONSTRAINT lifecycle_events_pkey PRIMARY KEY (id);


--
-- Name: lowt_nurture_consent lowt_nurture_consent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lowt_nurture_consent
    ADD CONSTRAINT lowt_nurture_consent_pkey PRIMARY KEY (id);


--
-- Name: processed_stripe_events processed_stripe_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.processed_stripe_events
    ADD CONSTRAINT processed_stripe_events_pkey PRIMARY KEY (event_id);


--
-- Name: qualifier_responses qualifier_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qualifier_responses
    ADD CONSTRAINT qualifier_responses_pkey PRIMARY KEY (id);


--
-- Name: qualifier_responses qualifier_responses_result_id_question_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qualifier_responses
    ADD CONSTRAINT qualifier_responses_result_id_question_key_key UNIQUE (result_id, question_key);


--
-- Name: sample_registrations sample_registrations_barcode_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_registrations
    ADD CONSTRAINT sample_registrations_barcode_key UNIQUE (barcode);


--
-- Name: sample_registrations sample_registrations_order_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_registrations
    ADD CONSTRAINT sample_registrations_order_id_key UNIQUE (order_id);


--
-- Name: sample_registrations sample_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_registrations
    ADD CONSTRAINT sample_registrations_pkey PRIMARY KEY (id);


--
-- Name: supplement_subscriptions supplement_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplement_subscriptions
    ADD CONSTRAINT supplement_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: supplement_subscriptions supplement_subscriptions_stripe_subscription_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplement_subscriptions
    ADD CONSTRAINT supplement_subscriptions_stripe_subscription_id_key UNIQUE (stripe_subscription_id);


--
-- Name: supplement_waitlist supplement_waitlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplement_waitlist
    ADD CONSTRAINT supplement_waitlist_pkey PRIMARY KEY (id);


--
-- Name: symptom_answers symptom_answers_order_id_question_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.symptom_answers
    ADD CONSTRAINT symptom_answers_order_id_question_key_key UNIQUE (order_id, question_key);


--
-- Name: symptom_answers symptom_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.symptom_answers
    ADD CONSTRAINT symptom_answers_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: borderline_nurture_consent_email_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX borderline_nurture_consent_email_active_idx ON public.borderline_nurture_consent USING btree (lower(email)) WHERE (withdrawn_at IS NULL);


--
-- Name: content_assets_canonical_article_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX content_assets_canonical_article_id_idx ON public.content_assets USING btree (canonical_article_id);


--
-- Name: content_assets_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX content_assets_status_idx ON public.content_assets USING btree (status);


--
-- Name: content_hooks_archetype_score_total_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX content_hooks_archetype_score_total_idx ON public.content_hooks USING btree (archetype, score_total);


--
-- Name: content_hooks_asset_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX content_hooks_asset_id_idx ON public.content_hooks USING btree (asset_id);


--
-- Name: content_metrics_rendition_id_captured_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX content_metrics_rendition_id_captured_at_idx ON public.content_metrics USING btree (rendition_id, captured_at DESC);


--
-- Name: content_renditions_asset_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX content_renditions_asset_id_idx ON public.content_renditions USING btree (asset_id);


--
-- Name: content_renditions_external_post_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX content_renditions_external_post_id_idx ON public.content_renditions USING btree (external_post_id);


--
-- Name: content_renditions_publisher_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX content_renditions_publisher_idx ON public.content_renditions USING btree (publisher);


--
-- Name: content_renditions_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX content_renditions_status_idx ON public.content_renditions USING btree (status);


--
-- Name: events_email_hash_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_email_hash_idx ON public.events USING btree (email_hash);


--
-- Name: events_fpr_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_fpr_idx ON public.events USING btree (fpr_tid);


--
-- Name: events_name_time_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_name_time_idx ON public.events USING btree (event_name, occurred_at DESC);


--
-- Name: events_source_medium_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_source_medium_idx ON public.events USING btree (utm_source, utm_medium);


--
-- Name: events_time_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_time_idx ON public.events USING btree (occurred_at DESC);


--
-- Name: founding_member_list_email_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX founding_member_list_email_active_idx ON public.founding_member_list USING btree (lower(email)) WHERE (unlisted_at IS NULL);


--
-- Name: idx_agent_runs_agent_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_agent_runs_agent_created ON public.agent_runs USING btree (agent, created_at DESC);


--
-- Name: idx_agent_runs_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_agent_runs_status ON public.agent_runs USING btree (status);


--
-- Name: idx_biomarker_values_result_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_biomarker_values_result_id ON public.biomarker_values USING btree (result_id);


--
-- Name: idx_blog_article_revisions_article; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_article_revisions_article ON public.blog_article_revisions USING btree (article_id, created_at DESC);


--
-- Name: idx_blog_articles_published_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_articles_published_at ON public.blog_articles USING btree (published_at DESC);


--
-- Name: idx_blog_articles_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_articles_status ON public.blog_articles USING btree (status);


--
-- Name: idx_bundle_dispatches_parent_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bundle_dispatches_parent_order_id ON public.bundle_dispatches USING btree (parent_order_id);


--
-- Name: idx_bundle_dispatches_status_due_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bundle_dispatches_status_due_at ON public.bundle_dispatches USING btree (status, due_at);


--
-- Name: idx_content_pipeline_blocked_on; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_pipeline_blocked_on ON public.content_pipeline USING btree (blocked_on);


--
-- Name: idx_content_pipeline_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_pipeline_slug ON public.content_pipeline USING btree (slug);


--
-- Name: idx_content_pipeline_stage; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_pipeline_stage ON public.content_pipeline USING btree (stage);


--
-- Name: idx_content_review_log_article; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_review_log_article ON public.content_review_log USING btree (article_id);


--
-- Name: idx_content_review_log_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_review_log_status ON public.content_review_log USING btree (status);


--
-- Name: idx_content_review_log_submitted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_review_log_submitted_at ON public.content_review_log USING btree (submitted_at DESC);


--
-- Name: idx_content_review_log_submitted_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_content_review_log_submitted_by ON public.content_review_log USING btree (submitted_by);


--
-- Name: idx_founding_member_deposits_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_founding_member_deposits_user_id ON public.founding_member_deposits USING btree (user_id);


--
-- Name: idx_keyword_queue_coverage_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_keyword_queue_coverage_status ON public.keyword_queue USING btree (coverage_status);


--
-- Name: idx_keyword_queue_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_keyword_queue_status ON public.keyword_queue USING btree (status);


--
-- Name: idx_kit_orders_is_test; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_kit_orders_is_test ON public.kit_orders USING btree (is_test) WHERE is_test;


--
-- Name: idx_kit_orders_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_kit_orders_user_id ON public.kit_orders USING btree (user_id);


--
-- Name: idx_kit_orders_vitall_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_kit_orders_vitall_order_id ON public.kit_orders USING btree (vitall_order_id);


--
-- Name: idx_lab_results_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lab_results_order_id ON public.lab_results USING btree (order_id);


--
-- Name: idx_lab_results_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lab_results_user_id ON public.lab_results USING btree (user_id);


--
-- Name: idx_lifecycle_events_name_emitted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lifecycle_events_name_emitted_at ON public.lifecycle_events USING btree (event_name, emitted_at DESC);


--
-- Name: idx_lifecycle_events_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lifecycle_events_user_id ON public.lifecycle_events USING btree (user_id);


--
-- Name: idx_qualifier_responses_result_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_qualifier_responses_result_id ON public.qualifier_responses USING btree (result_id);


--
-- Name: idx_qualifier_responses_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_qualifier_responses_user_id ON public.qualifier_responses USING btree (user_id);


--
-- Name: idx_supplement_subscriptions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_supplement_subscriptions_user_id ON public.supplement_subscriptions USING btree (user_id);


--
-- Name: idx_symptom_answers_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_symptom_answers_order_id ON public.symptom_answers USING btree (order_id);


--
-- Name: idx_symptom_answers_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_symptom_answers_user_id ON public.symptom_answers USING btree (user_id);


--
-- Name: idx_users_postal_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_postal_code ON public.users USING btree (address_postal_code);


--
-- Name: kit_orders_order_seq_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX kit_orders_order_seq_key ON public.kit_orders USING btree (order_seq);


--
-- Name: lowt_nurture_consent_email_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX lowt_nurture_consent_email_active_idx ON public.lowt_nurture_consent USING btree (lower(email)) WHERE (withdrawn_at IS NULL);


--
-- Name: supplement_waitlist_email_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX supplement_waitlist_email_active_idx ON public.supplement_waitlist USING btree (lower(email)) WHERE (unlisted_at IS NULL);


--
-- Name: uq_keyword_queue_query; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_keyword_queue_query ON public.keyword_queue USING btree (lower(query));


--
-- Name: content_assets content_assets_ewa_signed_at_guard; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER content_assets_ewa_signed_at_guard BEFORE INSERT OR UPDATE ON public.content_assets FOR EACH ROW EXECUTE FUNCTION public.content_assets_protect_ewa_signed_at();


--
-- Name: content_renditions gate_rendition_publish; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER gate_rendition_publish BEFORE INSERT OR UPDATE ON public.content_renditions FOR EACH ROW EXECUTE FUNCTION public.gate_rendition_publish();


--
-- Name: blog_articles revalidate_webhook; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER revalidate_webhook AFTER UPDATE ON public.blog_articles FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://andro-prime.com/api/revalidate', 'POST', '{"Content-type":"application/json","x-revalidate-secret":"152802"}', '{}', '5000');


--
-- Name: biomarker_values set_biomarker_values_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_biomarker_values_updated_at BEFORE UPDATE ON public.biomarker_values FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: blog_articles set_blog_articles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_blog_articles_updated_at BEFORE UPDATE ON public.blog_articles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: bundle_dispatches set_bundle_dispatches_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_bundle_dispatches_updated_at BEFORE UPDATE ON public.bundle_dispatches FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: content_pipeline set_content_pipeline_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_content_pipeline_updated_at BEFORE UPDATE ON public.content_pipeline FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: content_review_log set_content_review_log_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_content_review_log_updated_at BEFORE UPDATE ON public.content_review_log FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: founding_member_deposits set_founding_member_deposits_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_founding_member_deposits_updated_at BEFORE UPDATE ON public.founding_member_deposits FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: keyword_queue set_keyword_queue_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_keyword_queue_updated_at BEFORE UPDATE ON public.keyword_queue FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: kit_orders set_kit_orders_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_kit_orders_updated_at BEFORE UPDATE ON public.kit_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: lab_results set_lab_results_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_lab_results_updated_at BEFORE UPDATE ON public.lab_results FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: qualifier_responses set_qualifier_responses_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_qualifier_responses_updated_at BEFORE UPDATE ON public.qualifier_responses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: sample_registrations set_sample_registrations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_sample_registrations_updated_at BEFORE UPDATE ON public.sample_registrations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: supplement_subscriptions set_supplement_subscriptions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_supplement_subscriptions_updated_at BEFORE UPDATE ON public.supplement_subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: symptom_answers set_symptom_answers_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_symptom_answers_updated_at BEFORE UPDATE ON public.symptom_answers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: content_assets set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.content_assets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: content_renditions set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.content_renditions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: users set_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: biomarker_values biomarker_values_result_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.biomarker_values
    ADD CONSTRAINT biomarker_values_result_id_fkey FOREIGN KEY (result_id) REFERENCES public.lab_results(id) ON DELETE CASCADE;


--
-- Name: blog_article_revisions blog_article_revisions_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_article_revisions
    ADD CONSTRAINT blog_article_revisions_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.blog_articles(id) ON DELETE CASCADE;


--
-- Name: blog_articles blog_articles_current_revision_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_articles
    ADD CONSTRAINT blog_articles_current_revision_fk FOREIGN KEY (current_revision_id) REFERENCES public.blog_article_revisions(id) ON DELETE SET NULL;


--
-- Name: blog_articles blog_articles_proposed_revision_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_articles
    ADD CONSTRAINT blog_articles_proposed_revision_id_fkey FOREIGN KEY (proposed_revision_id) REFERENCES public.blog_article_revisions(id) ON DELETE SET NULL;


--
-- Name: borderline_nurture_consent borderline_nurture_consent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.borderline_nurture_consent
    ADD CONSTRAINT borderline_nurture_consent_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: bundle_dispatches bundle_dispatches_parent_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bundle_dispatches
    ADD CONSTRAINT bundle_dispatches_parent_order_id_fkey FOREIGN KEY (parent_order_id) REFERENCES public.kit_orders(id) ON DELETE CASCADE;


--
-- Name: bundle_dispatches bundle_dispatches_second_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bundle_dispatches
    ADD CONSTRAINT bundle_dispatches_second_order_id_fkey FOREIGN KEY (second_order_id) REFERENCES public.kit_orders(id);


--
-- Name: bundle_dispatches bundle_dispatches_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bundle_dispatches
    ADD CONSTRAINT bundle_dispatches_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: content_asset_revisions content_asset_revisions_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_asset_revisions
    ADD CONSTRAINT content_asset_revisions_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.content_assets(id) ON DELETE CASCADE;


--
-- Name: content_assets content_assets_canonical_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_assets
    ADD CONSTRAINT content_assets_canonical_article_id_fkey FOREIGN KEY (canonical_article_id) REFERENCES public.blog_articles(id) ON DELETE RESTRICT;


--
-- Name: content_hooks content_hooks_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_hooks
    ADD CONSTRAINT content_hooks_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.content_assets(id) ON DELETE CASCADE;


--
-- Name: content_metrics content_metrics_rendition_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_metrics
    ADD CONSTRAINT content_metrics_rendition_id_fkey FOREIGN KEY (rendition_id) REFERENCES public.content_renditions(id) ON DELETE CASCADE;


--
-- Name: content_pipeline content_pipeline_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_pipeline
    ADD CONSTRAINT content_pipeline_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.blog_articles(id) ON DELETE SET NULL;


--
-- Name: content_renditions content_renditions_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_renditions
    ADD CONSTRAINT content_renditions_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.content_assets(id) ON DELETE CASCADE;


--
-- Name: content_review_log content_review_log_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_review_log
    ADD CONSTRAINT content_review_log_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.blog_articles(id) ON DELETE SET NULL;


--
-- Name: content_review_log content_review_log_revision_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_review_log
    ADD CONSTRAINT content_review_log_revision_id_fkey FOREIGN KEY (revision_id) REFERENCES public.blog_article_revisions(id) ON DELETE SET NULL;


--
-- Name: content_review_log content_review_log_submitted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_review_log
    ADD CONSTRAINT content_review_log_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: founding_member_deposits founding_member_deposits_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.founding_member_deposits
    ADD CONSTRAINT founding_member_deposits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: founding_member_list founding_member_list_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.founding_member_list
    ADD CONSTRAINT founding_member_list_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: kit_orders kit_orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kit_orders
    ADD CONSTRAINT kit_orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: lab_results lab_results_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_results
    ADD CONSTRAINT lab_results_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.kit_orders(id) ON DELETE CASCADE;


--
-- Name: lab_results lab_results_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_results
    ADD CONSTRAINT lab_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: lifecycle_events lifecycle_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lifecycle_events
    ADD CONSTRAINT lifecycle_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: lowt_nurture_consent lowt_nurture_consent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lowt_nurture_consent
    ADD CONSTRAINT lowt_nurture_consent_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: qualifier_responses qualifier_responses_result_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qualifier_responses
    ADD CONSTRAINT qualifier_responses_result_id_fkey FOREIGN KEY (result_id) REFERENCES public.lab_results(id) ON DELETE CASCADE;


--
-- Name: qualifier_responses qualifier_responses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qualifier_responses
    ADD CONSTRAINT qualifier_responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sample_registrations sample_registrations_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_registrations
    ADD CONSTRAINT sample_registrations_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.kit_orders(id) ON DELETE CASCADE;


--
-- Name: supplement_subscriptions supplement_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplement_subscriptions
    ADD CONSTRAINT supplement_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: supplement_waitlist supplement_waitlist_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplement_waitlist
    ADD CONSTRAINT supplement_waitlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: symptom_answers symptom_answers_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.symptom_answers
    ADD CONSTRAINT symptom_answers_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.kit_orders(id) ON DELETE CASCADE;


--
-- Name: symptom_answers symptom_answers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.symptom_answers
    ADD CONSTRAINT symptom_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: agent_runs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;

--
-- Name: biomarker_values; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.biomarker_values ENABLE ROW LEVEL SECURITY;

--
-- Name: biomarker_values biomarker_values_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY biomarker_values_select_own ON public.biomarker_values FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.lab_results
  WHERE ((lab_results.id = biomarker_values.result_id) AND (lab_results.user_id = auth.uid())))));


--
-- Name: blog_article_revisions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blog_article_revisions ENABLE ROW LEVEL SECURITY;

--
-- Name: blog_articles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

--
-- Name: blog_articles blog_articles_public_read_published; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY blog_articles_public_read_published ON public.blog_articles FOR SELECT TO authenticated, anon USING ((status = 'published'::public.blog_article_status));


--
-- Name: borderline_nurture_consent; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.borderline_nurture_consent ENABLE ROW LEVEL SECURITY;

--
-- Name: bundle_dispatches; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bundle_dispatches ENABLE ROW LEVEL SECURITY;

--
-- Name: bundle_dispatches bundle_dispatches_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY bundle_dispatches_select_own ON public.bundle_dispatches FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: content_asset_revisions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_asset_revisions ENABLE ROW LEVEL SECURITY;

--
-- Name: content_assets; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_assets ENABLE ROW LEVEL SECURITY;

--
-- Name: content_channels; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_channels ENABLE ROW LEVEL SECURITY;

--
-- Name: content_channels content_channels_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY content_channels_read ON public.content_channels FOR SELECT USING (true);


--
-- Name: content_hooks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_hooks ENABLE ROW LEVEL SECURITY;

--
-- Name: content_metrics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_metrics ENABLE ROW LEVEL SECURITY;

--
-- Name: content_pipeline; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_pipeline ENABLE ROW LEVEL SECURITY;

--
-- Name: content_renditions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_renditions ENABLE ROW LEVEL SECURITY;

--
-- Name: content_review_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_review_log ENABLE ROW LEVEL SECURITY;

--
-- Name: content_review_log content_review_log_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY content_review_log_select_own ON public.content_review_log FOR SELECT TO authenticated USING ((submitted_by = auth.uid()));


--
-- Name: events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

--
-- Name: founding_member_deposits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.founding_member_deposits ENABLE ROW LEVEL SECURITY;

--
-- Name: founding_member_deposits founding_member_deposits_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY founding_member_deposits_select_own ON public.founding_member_deposits FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: founding_member_list; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.founding_member_list ENABLE ROW LEVEL SECURITY;

--
-- Name: keyword_queue; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.keyword_queue ENABLE ROW LEVEL SECURITY;

--
-- Name: kit_orders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.kit_orders ENABLE ROW LEVEL SECURITY;

--
-- Name: kit_orders kit_orders_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY kit_orders_select_own ON public.kit_orders FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: kit_orders kit_orders_update_own_activate; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY kit_orders_update_own_activate ON public.kit_orders FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: lab_results; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;

--
-- Name: lab_results lab_results_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY lab_results_select_own ON public.lab_results FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: lifecycle_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lifecycle_events ENABLE ROW LEVEL SECURITY;

--
-- Name: lifecycle_events lifecycle_events_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY lifecycle_events_select_own ON public.lifecycle_events FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: lowt_nurture_consent; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lowt_nurture_consent ENABLE ROW LEVEL SECURITY;

--
-- Name: processed_stripe_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.processed_stripe_events ENABLE ROW LEVEL SECURITY;

--
-- Name: qualifier_responses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.qualifier_responses ENABLE ROW LEVEL SECURITY;

--
-- Name: qualifier_responses qualifier_responses_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY qualifier_responses_insert_own ON public.qualifier_responses FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: qualifier_responses qualifier_responses_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY qualifier_responses_select_own ON public.qualifier_responses FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: qualifier_responses qualifier_responses_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY qualifier_responses_update_own ON public.qualifier_responses FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: sample_registrations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.sample_registrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sample_registrations sample_registrations_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY sample_registrations_select_own ON public.sample_registrations FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.kit_orders
  WHERE ((kit_orders.id = sample_registrations.order_id) AND (kit_orders.user_id = auth.uid())))));


--
-- Name: supplement_subscriptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.supplement_subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: supplement_subscriptions supplement_subscriptions_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY supplement_subscriptions_select_own ON public.supplement_subscriptions FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: supplement_waitlist; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.supplement_waitlist ENABLE ROW LEVEL SECURITY;

--
-- Name: symptom_answers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.symptom_answers ENABLE ROW LEVEL SECURITY;

--
-- Name: symptom_answers symptom_answers_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY symptom_answers_insert_own ON public.symptom_answers FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: symptom_answers symptom_answers_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY symptom_answers_select_own ON public.symptom_answers FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: symptom_answers symptom_answers_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY symptom_answers_update_own ON public.symptom_answers FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: borderline_nurture_consent users read own borderline nurture consent; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own borderline nurture consent" ON public.borderline_nurture_consent FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: lowt_nurture_consent users read own lowt nurture consent; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own lowt nurture consent" ON public.lowt_nurture_consent FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: founding_member_list users read own membership; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own membership" ON public.founding_member_list FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: supplement_waitlist users read own supplement waitlist; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "users read own supplement waitlist" ON public.supplement_waitlist FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: users users_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_select_own ON public.users FOR SELECT TO authenticated USING ((auth.uid() = id));


--
-- Name: users users_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_update_own ON public.users FOR UPDATE TO authenticated USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: FUNCTION content_assets_protect_ewa_signed_at(); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.content_assets_protect_ewa_signed_at() TO anon;
GRANT ALL ON FUNCTION public.content_assets_protect_ewa_signed_at() TO authenticated;
GRANT ALL ON FUNCTION public.content_assets_protect_ewa_signed_at() TO service_role;


--
-- Name: FUNCTION gate_rendition_publish(); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.gate_rendition_publish() TO anon;
GRANT ALL ON FUNCTION public.gate_rendition_publish() TO authenticated;
GRANT ALL ON FUNCTION public.gate_rendition_publish() TO service_role;


--
-- Name: FUNCTION handle_auth_user_change(); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.handle_auth_user_change() TO anon;
GRANT ALL ON FUNCTION public.handle_auth_user_change() TO authenticated;
GRANT ALL ON FUNCTION public.handle_auth_user_change() TO service_role;


--
-- Name: FUNCTION promote_proposed_revision(p_slug text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.promote_proposed_revision(p_slug text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.promote_proposed_revision(p_slug text) TO service_role;


--
-- Name: FUNCTION record_ewa_signoff(p_slug text, p_signed_at timestamp with time zone); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.record_ewa_signoff(p_slug text, p_signed_at timestamp with time zone) FROM PUBLIC;
GRANT ALL ON FUNCTION public.record_ewa_signoff(p_slug text, p_signed_at timestamp with time zone) TO service_role;


--
-- Name: FUNCTION set_updated_at(); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.set_updated_at() TO anon;
GRANT ALL ON FUNCTION public.set_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.set_updated_at() TO service_role;


--
-- Name: FUNCTION stage_blog_revision(p_slug text, p_body text, p_frontmatter jsonb, p_keyword_coverage jsonb, p_editor text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.stage_blog_revision(p_slug text, p_body text, p_frontmatter jsonb, p_keyword_coverage jsonb, p_editor text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.stage_blog_revision(p_slug text, p_body text, p_frontmatter jsonb, p_keyword_coverage jsonb, p_editor text) TO service_role;


--
-- Name: FUNCTION upsert_blog_article(p_slug text, p_status public.blog_article_status, p_body text, p_frontmatter jsonb, p_keyword_coverage jsonb, p_editor text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.upsert_blog_article(p_slug text, p_status public.blog_article_status, p_body text, p_frontmatter jsonb, p_keyword_coverage jsonb, p_editor text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.upsert_blog_article(p_slug text, p_status public.blog_article_status, p_body text, p_frontmatter jsonb, p_keyword_coverage jsonb, p_editor text) TO service_role;


--
-- Name: TABLE agent_runs; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.agent_runs TO anon;
GRANT ALL ON TABLE public.agent_runs TO authenticated;
GRANT ALL ON TABLE public.agent_runs TO service_role;


--
-- Name: TABLE biomarker_values; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.biomarker_values TO anon;
GRANT ALL ON TABLE public.biomarker_values TO authenticated;
GRANT ALL ON TABLE public.biomarker_values TO service_role;


--
-- Name: TABLE blog_article_revisions; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.blog_article_revisions TO anon;
GRANT ALL ON TABLE public.blog_article_revisions TO authenticated;
GRANT ALL ON TABLE public.blog_article_revisions TO service_role;


--
-- Name: TABLE blog_articles; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.blog_articles TO anon;
GRANT ALL ON TABLE public.blog_articles TO authenticated;
GRANT ALL ON TABLE public.blog_articles TO service_role;


--
-- Name: TABLE borderline_nurture_consent; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.borderline_nurture_consent TO anon;
GRANT ALL ON TABLE public.borderline_nurture_consent TO authenticated;
GRANT ALL ON TABLE public.borderline_nurture_consent TO service_role;


--
-- Name: TABLE bundle_dispatches; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.bundle_dispatches TO anon;
GRANT ALL ON TABLE public.bundle_dispatches TO authenticated;
GRANT ALL ON TABLE public.bundle_dispatches TO service_role;


--
-- Name: TABLE content_asset_revisions; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.content_asset_revisions TO anon;
GRANT ALL ON TABLE public.content_asset_revisions TO authenticated;
GRANT ALL ON TABLE public.content_asset_revisions TO service_role;


--
-- Name: TABLE content_assets; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.content_assets TO anon;
GRANT ALL ON TABLE public.content_assets TO authenticated;
GRANT ALL ON TABLE public.content_assets TO service_role;


--
-- Name: TABLE content_channels; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.content_channels TO anon;
GRANT ALL ON TABLE public.content_channels TO authenticated;
GRANT ALL ON TABLE public.content_channels TO service_role;


--
-- Name: TABLE content_hooks; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.content_hooks TO anon;
GRANT ALL ON TABLE public.content_hooks TO authenticated;
GRANT ALL ON TABLE public.content_hooks TO service_role;


--
-- Name: TABLE content_metrics; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.content_metrics TO anon;
GRANT ALL ON TABLE public.content_metrics TO authenticated;
GRANT ALL ON TABLE public.content_metrics TO service_role;


--
-- Name: TABLE content_pipeline; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.content_pipeline TO anon;
GRANT ALL ON TABLE public.content_pipeline TO authenticated;
GRANT ALL ON TABLE public.content_pipeline TO service_role;


--
-- Name: TABLE content_renditions; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.content_renditions TO anon;
GRANT ALL ON TABLE public.content_renditions TO authenticated;
GRANT ALL ON TABLE public.content_renditions TO service_role;


--
-- Name: TABLE content_review_log; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.content_review_log TO anon;
GRANT ALL ON TABLE public.content_review_log TO authenticated;
GRANT ALL ON TABLE public.content_review_log TO service_role;


--
-- Name: TABLE events; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.events TO anon;
GRANT ALL ON TABLE public.events TO authenticated;
GRANT ALL ON TABLE public.events TO service_role;


--
-- Name: TABLE founding_member_deposits; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.founding_member_deposits TO anon;
GRANT ALL ON TABLE public.founding_member_deposits TO authenticated;
GRANT ALL ON TABLE public.founding_member_deposits TO service_role;


--
-- Name: TABLE founding_member_list; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.founding_member_list TO anon;
GRANT ALL ON TABLE public.founding_member_list TO authenticated;
GRANT ALL ON TABLE public.founding_member_list TO service_role;


--
-- Name: TABLE keyword_queue; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.keyword_queue TO anon;
GRANT ALL ON TABLE public.keyword_queue TO authenticated;
GRANT ALL ON TABLE public.keyword_queue TO service_role;


--
-- Name: TABLE kit_orders; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.kit_orders TO anon;
GRANT ALL ON TABLE public.kit_orders TO authenticated;
GRANT ALL ON TABLE public.kit_orders TO service_role;


--
-- Name: SEQUENCE kit_orders_order_seq_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.kit_orders_order_seq_seq TO anon;
GRANT ALL ON SEQUENCE public.kit_orders_order_seq_seq TO authenticated;
GRANT ALL ON SEQUENCE public.kit_orders_order_seq_seq TO service_role;


--
-- Name: TABLE lab_results; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.lab_results TO anon;
GRANT ALL ON TABLE public.lab_results TO authenticated;
GRANT ALL ON TABLE public.lab_results TO service_role;


--
-- Name: TABLE lifecycle_events; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.lifecycle_events TO anon;
GRANT ALL ON TABLE public.lifecycle_events TO authenticated;
GRANT ALL ON TABLE public.lifecycle_events TO service_role;


--
-- Name: TABLE lowt_nurture_consent; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.lowt_nurture_consent TO anon;
GRANT ALL ON TABLE public.lowt_nurture_consent TO authenticated;
GRANT ALL ON TABLE public.lowt_nurture_consent TO service_role;


--
-- Name: TABLE processed_stripe_events; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.processed_stripe_events TO anon;
GRANT ALL ON TABLE public.processed_stripe_events TO authenticated;
GRANT ALL ON TABLE public.processed_stripe_events TO service_role;


--
-- Name: TABLE qualifier_responses; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.qualifier_responses TO anon;
GRANT ALL ON TABLE public.qualifier_responses TO authenticated;
GRANT ALL ON TABLE public.qualifier_responses TO service_role;


--
-- Name: TABLE sample_registrations; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.sample_registrations TO anon;
GRANT ALL ON TABLE public.sample_registrations TO authenticated;
GRANT ALL ON TABLE public.sample_registrations TO service_role;


--
-- Name: TABLE supplement_subscriptions; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.supplement_subscriptions TO anon;
GRANT ALL ON TABLE public.supplement_subscriptions TO authenticated;
GRANT ALL ON TABLE public.supplement_subscriptions TO service_role;


--
-- Name: TABLE supplement_waitlist; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.supplement_waitlist TO anon;
GRANT ALL ON TABLE public.supplement_waitlist TO authenticated;
GRANT ALL ON TABLE public.supplement_waitlist TO service_role;


--
-- Name: TABLE symptom_answers; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.symptom_answers TO anon;
GRANT ALL ON TABLE public.symptom_answers TO authenticated;
GRANT ALL ON TABLE public.symptom_answers TO service_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- Name: TABLE v_deposit_summary; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.v_deposit_summary TO anon;
GRANT ALL ON TABLE public.v_deposit_summary TO authenticated;
GRANT ALL ON TABLE public.v_deposit_summary TO service_role;


--
-- Name: TABLE v_result_to_supplement_conversion; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.v_result_to_supplement_conversion TO anon;
GRANT ALL ON TABLE public.v_result_to_supplement_conversion TO authenticated;
GRANT ALL ON TABLE public.v_result_to_supplement_conversion TO service_role;


--
-- Name: TABLE v_supplement_mrr; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.v_supplement_mrr TO anon;
GRANT ALL ON TABLE public.v_supplement_mrr TO authenticated;
GRANT ALL ON TABLE public.v_supplement_mrr TO service_role;


--
-- Name: TABLE v_gate_tracker; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.v_gate_tracker TO anon;
GRANT ALL ON TABLE public.v_gate_tracker TO authenticated;
GRANT ALL ON TABLE public.v_gate_tracker TO service_role;


--
-- Name: TABLE v_kit_pipeline; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.v_kit_pipeline TO anon;
GRANT ALL ON TABLE public.v_kit_pipeline TO authenticated;
GRANT ALL ON TABLE public.v_kit_pipeline TO service_role;


--
-- Name: TABLE v_weekly_kit_sales; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.v_weekly_kit_sales TO anon;
GRANT ALL ON TABLE public.v_weekly_kit_sales TO authenticated;
GRANT ALL ON TABLE public.v_weekly_kit_sales TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- PostgreSQL database dump complete
--


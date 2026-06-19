begin;

-- Phase 2 of the Content Engine: the operational state machine + sign-off gate the
-- autonomous agents (Phase 3) read and write. Additive only — does not touch the
-- live Phase-1 blog tables. Three new tables + an extension of content_review_log.

-- ---------------------------------------------------------------------------
-- content_pipeline — one row per content item; the conductor's single source of
-- "what stage is this in". The orchestrator derives dispatch from this table.
-- ---------------------------------------------------------------------------
create type public.content_pipeline_stage as enum (
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

create type public.content_blocked_on as enum ('keith', 'ewa');

create table if not exists public.content_pipeline (
  id uuid primary key default gen_random_uuid(),
  slug text,                                          -- article slug (may be a proposed slug pre-draft)
  pillar text,
  stage public.content_pipeline_stage not null default 'keyword_selected',
  article_id uuid references public.blog_articles (id) on delete set null,
  brief_ref text,                                     -- path to the 21-section brief file (files this phase)
  target_date date,                                   -- scheduled publish date (mirrors the ClickUp due date)
  blocked_on public.content_blocked_on,               -- which human gate it's parked on (null = not blocked)
  clickup_task_id text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_content_pipeline_stage on public.content_pipeline (stage);
create index if not exists idx_content_pipeline_blocked_on on public.content_pipeline (blocked_on);
create index if not exists idx_content_pipeline_slug on public.content_pipeline (slug);

drop trigger if exists set_content_pipeline_updated_at on public.content_pipeline;
create trigger set_content_pipeline_updated_at
before update on public.content_pipeline
for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- keyword_queue — Keyword-Scout's opportunity output + the queryable funnel top.
-- Coverage bookkeeping lives here (not in keywords.csv) so the autonomous path
-- never has to commit the CSV; the weekly git-mirror reconciles the CSV from this.
-- ---------------------------------------------------------------------------
create type public.keyword_queue_status as enum ('candidate', 'accepted', 'rejected');

create type public.keyword_coverage_status as enum (
  'unassigned',
  'planned',
  'briefed',
  'drafted',
  'published',
  'deferred',
  'excluded'
);

create table if not exists public.keyword_queue (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  vol integer,
  kd integer,
  cpc numeric,
  pillar text,
  compliance_risk text,                              -- low | medium | high
  proposed_slug text,
  status public.keyword_queue_status not null default 'candidate',
  coverage_status public.keyword_coverage_status not null default 'unassigned',
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_keyword_queue_status on public.keyword_queue (status);
create index if not exists idx_keyword_queue_coverage_status on public.keyword_queue (coverage_status);
create unique index if not exists uq_keyword_queue_query on public.keyword_queue (lower(query));

drop trigger if exists set_keyword_queue_updated_at on public.keyword_queue;
create trigger set_keyword_queue_updated_at
before update on public.keyword_queue
for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- agent_runs — dead-letter / observability. One row per agent execution so the
-- daily digest can lead with "N items errored" and no failure stays silent.
-- ---------------------------------------------------------------------------
create type public.agent_run_status as enum ('ok', 'error', 'blocked');

create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  agent text not null,                               -- keyword-scout | brief-architect | draft-writer | signoff-concierge | publisher | measurement-analyst | orchestrator
  item_ref text,                                     -- slug / queue id / pipeline id this run acted on
  status public.agent_run_status not null,
  error text,
  detail jsonb,
  started_at timestamptz not null default timezone('utc', now()),
  finished_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_agent_runs_status on public.agent_runs (status);
create index if not exists idx_agent_runs_agent_created on public.agent_runs (agent, created_at desc);

-- ---------------------------------------------------------------------------
-- Sign-off gate: extend the existing content_review_log (don't reinvent it).
-- Pin approval to a specific article + body revision, and record the reviewer's GMC.
-- ---------------------------------------------------------------------------
alter table public.content_review_log
  add column if not exists article_id uuid references public.blog_articles (id) on delete set null,
  add column if not exists revision_id uuid references public.blog_article_revisions (id) on delete set null,
  add column if not exists reviewer_gmc text,
  add column if not exists scope text;                -- 'full' | 'section'

create index if not exists idx_content_review_log_article on public.content_review_log (article_id);

-- ---------------------------------------------------------------------------
-- RLS: new tables are service-role only (agents / orchestrator). No anon/auth
-- policies → denied for everyone except the service role (which bypasses RLS).
-- ---------------------------------------------------------------------------
alter table public.content_pipeline enable row level security;
alter table public.keyword_queue enable row level security;
alter table public.agent_runs enable row level security;

commit;

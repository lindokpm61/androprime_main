begin;

-- Phase 1 of the Content Engine decoupling: move blog articles off the filesystem
-- (frontend/content/blog/*.mdx baked into the Docker image) into Supabase, so
-- adding/editing an article is a DB write surfaced via on-demand revalidation —
-- no Coolify rebuild. See plan: DB-backed blog. DB is the source of truth; a git
-- mirror keeps MDX history. Bodies are first-party MDX (agent-authored, Ewa-approved).

create type public.blog_article_status as enum ('draft', 'published', 'archived');

create table if not exists public.blog_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status public.blog_article_status not null default 'draft',
  body text not null,                                   -- raw MDX (compiled at request time by next-mdx-remote/rsc)
  frontmatter jsonb not null default '{}'::jsonb,       -- title, excerpt, category, dates, author/reviewer slugs, photo*, faq[], toc, dark, readTime…
  keyword_coverage jsonb,                               -- mirrors the article's keyword_coverage block (audit input)
  current_revision_id uuid,                             -- FK added after revisions table exists
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_blog_articles_status on public.blog_articles (status);
create index if not exists idx_blog_articles_published_at on public.blog_articles (published_at desc);

-- Immutable edit history: every save writes one row. Powers rollback + the git mirror + audit.
create table if not exists public.blog_article_revisions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.blog_articles (id) on delete cascade,
  body text not null,
  frontmatter jsonb not null default '{}'::jsonb,
  keyword_coverage jsonb,
  editor text not null default 'system',                -- 'migration' | agent name | 'ewa' | 'keith'
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_blog_article_revisions_article
  on public.blog_article_revisions (article_id, created_at desc);

alter table public.blog_articles
  add constraint blog_articles_current_revision_fk
  foreign key (current_revision_id) references public.blog_article_revisions (id) on delete set null;

drop trigger if exists set_blog_articles_updated_at on public.blog_articles;
create trigger set_blog_articles_updated_at
before update on public.blog_articles
for each row
execute procedure public.set_updated_at();

-- Single transactional write path: upsert the article by slug, write an immutable
-- revision, and advance current_revision_id — all in one transaction so a half-written
-- revision can never become the live pointer. This is the function agents call later.
create or replace function public.upsert_blog_article(
  p_slug text,
  p_status public.blog_article_status,
  p_body text,
  p_frontmatter jsonb,
  p_keyword_coverage jsonb,
  p_editor text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
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
        -- keep the original publish timestamp once set; stamp it the first time it goes live
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

-- Writes are service-role only (agents / import). Never callable by anon/auth.
revoke all on function public.upsert_blog_article(text, public.blog_article_status, text, jsonb, jsonb, text) from public;
grant execute on function public.upsert_blog_article(text, public.blog_article_status, text, jsonb, jsonb, text) to service_role;

alter table public.blog_articles enable row level security;
alter table public.blog_article_revisions enable row level security;

-- Public read is published-only. Drafts + archived are invisible to anon/authenticated
-- (a draft direct URL 404s in production); service role bypasses RLS for preview + writes.
drop policy if exists "blog_articles_public_read_published" on public.blog_articles;
create policy "blog_articles_public_read_published"
on public.blog_articles
for select
to anon, authenticated
using (status = 'published');

-- Revisions are never public; no policy = denied for anon/authenticated. Service role only.

commit;

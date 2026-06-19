begin;

-- Gated re-optimisation for the DB-backed blog. A live (published) article's body IS the
-- served row, so changing it goes live immediately — no way to let Ewa review a proposed
-- change before it ships. This adds a "proposed but not current" revision pointer so a
-- re-opt can be staged + previewed + signed off without disturbing the live page, then
-- promoted atomically on approval. Implements the content_pipeline 'reoptimising' stage.

-- A second revision pointer alongside current_revision_id. Live render always uses the
-- current row body; proposed_revision_id is the pending re-opt awaiting Ewa.
alter table public.blog_articles
  add column if not exists proposed_revision_id uuid
  references public.blog_article_revisions (id) on delete set null;

-- Stage a proposed revision: write a new revision for an EXISTING article and point
-- proposed_revision_id at it. current_revision_id, body, status, published_at untouched —
-- the live page does not change. Returns the new revision id (preview via ?rev=<id>).
create or replace function public.stage_blog_revision(
  p_slug text,
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

-- Promote the staged revision to live: copy its body/frontmatter/coverage onto the article,
-- advance current_revision_id, clear proposed_revision_id. status + published_at unchanged
-- (a published article stays published with its original publish date). Returns the promoted
-- revision id, or null if nothing was staged. The app revalidates the slug after this.
create or replace function public.promote_proposed_revision(p_slug text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
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
    return null; -- nothing staged
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

revoke all on function public.stage_blog_revision(text, text, jsonb, jsonb, text) from public;
grant execute on function public.stage_blog_revision(text, text, jsonb, jsonb, text) to service_role;
revoke all on function public.promote_proposed_revision(text) from public;
grant execute on function public.promote_proposed_revision(text) to service_role;

commit;

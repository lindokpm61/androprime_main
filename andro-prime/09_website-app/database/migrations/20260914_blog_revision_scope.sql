begin;

-- ─────────────────────────────────────────────────────────────────────────────
-- A REVISION GETS A SCOPE, BECAUSE A SEARCH SNIPPET IS NOT A CLINICAL OBSERVATION.
--
-- KEITH'S RULING, 2026-09-14: "review a revision of this type as it is an SEO
-- description and tag, not a clinical observation." Defect register M7.
--
-- Until now every staged revision was the same kind of thing. `reopt-concierge`
-- opened a task on "Content Review — Blog Articles" for each one unconditionally,
-- so a revision that changed nothing but the `<title>` tag and the meta
-- description arrived at the clinical reviewer carrying a checklist about EFSA
-- claims, TRT boundaries and thresholds — none of which it could possibly have
-- touched. The ruling cannot be honoured by a rule written in a document,
-- because nothing in the pipeline reads a document. It needs a column.
--
-- 🔴 'seo' IS ENFORCED HERE RATHER THAN ASSERTED UPSTREAM, AND THAT IS THE WHOLE
-- POINT OF PUTTING IT IN THE DATABASE. A caller that claims a revision is
-- metadata-only is making exactly the claim that lets it skip clinical review,
-- so the claim is the one thing it must not be trusted on. `stage_blog_revision`
-- refuses to record an 'seo' revision whose body differs from the live body by a
-- single byte, or whose frontmatter differs anywhere outside `seoTitle` and
-- `seoDescription`. Metadata-only is therefore TRUE BY CONSTRUCTION: there is no
-- path that writes a wider change under the narrower label, including a future
-- caller written by someone who never read this comment.
--
-- What this deliberately does NOT decide is whether a shortened description moved
-- a CLAIM rather than trimming one. That is judgement, it is not expressible as a
-- jsonb comparison, and it lives in `scripts/content-engine/seo-revision-guard.ts`
-- against Ewa's tier ladder (ruled 2026-08-18, Q14). The database settles shape;
-- the guard settles meaning; neither substitutes for the other.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.blog_article_revisions
  add column if not exists scope text not null default 'content';

-- Existing rows predate the distinction and every one of them was a content
-- revision reviewed as such. The default backfills them correctly; the constraint
-- is added after, so it validates that backfill rather than assuming it.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'blog_article_revisions_scope_check'
  ) then
    alter table public.blog_article_revisions
      add constraint blog_article_revisions_scope_check
      check (scope in ('content', 'seo'));
  end if;
end $$;

comment on column public.blog_article_revisions.scope is
  'content = body/editorial change, reviewed clinically by Ewa. seo = seoTitle/seoDescription only, '
  'reviewed as metadata (Keith 2026-09-14, defect register M7). stage_blog_revision enforces that an '
  'seo revision touches nothing else; it is not a label a caller can simply assert.';

-- ─────────────────────────────────────────────────────────────────────────────
-- The 5-argument signature is DROPPED rather than left beside the new one.
--
-- `create or replace` with an added parameter creates a SECOND function, and
-- because the new parameter carries a default, a 5-argument call then matches
-- both and Postgres raises "function public.stage_blog_revision(...) is not
-- unique". Every existing caller passes five arguments, so leaving the old one in
-- place would break all of them the moment this migration ran — the failure would
-- land at the first re-opt, not here, which is the worst possible place for it.
-- ─────────────────────────────────────────────────────────────────────────────
drop function if exists public.stage_blog_revision(text, text, jsonb, jsonb, text);

create or replace function public.stage_blog_revision(
  p_slug text,
  p_body text,
  p_frontmatter jsonb,
  p_keyword_coverage jsonb,
  p_editor text,
  p_scope text default 'content'
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_article_id uuid;
  v_revision_id uuid;
  v_live_body text;
  v_live_fm jsonb;
begin
  if p_scope not in ('content', 'seo') then
    raise exception 'stage_blog_revision: scope must be content or seo, got %', p_scope;
  end if;

  select id, body, frontmatter into v_article_id, v_live_body, v_live_fm
    from public.blog_articles where slug = p_slug;
  if v_article_id is null then
    raise exception 'stage_blog_revision: no article with slug %', p_slug;
  end if;

  -- The narrow label has to earn itself. Both comparisons are exact: an 'seo'
  -- revision is one that changed the two SEO keys and demonstrably nothing else.
  if p_scope = 'seo' then
    if p_body is distinct from v_live_body then
      raise exception
        'stage_blog_revision: scope=seo but the body differs from the live article. '
        'A body change is a content revision and takes clinical review.';
    end if;
    if (p_frontmatter - 'seoTitle' - 'seoDescription')
       is distinct from (v_live_fm - 'seoTitle' - 'seoDescription') then
      raise exception
        'stage_blog_revision: scope=seo but frontmatter changed outside seoTitle/seoDescription. '
        'Stage that as a content revision.';
    end if;
  end if;

  insert into public.blog_article_revisions
    (article_id, body, frontmatter, keyword_coverage, editor, scope)
  values (v_article_id, p_body, p_frontmatter, p_keyword_coverage, p_editor, p_scope)
  returning id into v_revision_id;

  update public.blog_articles
    set proposed_revision_id = v_revision_id
    where id = v_article_id;

  return v_revision_id;
end;
$$;

revoke all on function public.stage_blog_revision(text, text, jsonb, jsonb, text, text) from public;
grant execute on function public.stage_blog_revision(text, text, jsonb, jsonb, text, text) to service_role;

commit;

-- Corrects the claim block of `gate_rendition_publish()` added by `20260818_content_claim_tiers.sql`,
-- which has already been applied and is left in place unchanged. Every other rule in the function is
-- carried forward untouched; only the claim block's trigger condition moves.
--
-- WHAT WAS WRONG. The claim block evaluated the RESTING state: any row sitting at scheduled,
-- published or measured was re-checked on every update. That reads as the stronger choice and is the
-- wrong one, because of what actually updates a live rendition:
--
--   * `metricool-writeback` moves scheduled -> published and writes the URL
--   * `metricool-metrics` and `remap-metricool-ids` rewrite `external_post_id`, which every arming
--     session and every reschedule invalidates (CONTEXT.md, 2026-08-17)
--
-- With the resting form, the first classification run would have frozen all of that for every asset
-- holding an open tier 2 — 14 of them on the first sweep — so our records would have stopped
-- tracking posts that were live on the platform regardless. A gate cannot stop a post that has
-- already gone out; it can only stop us writing down that it did, which makes the database wrong
-- about the world and calls it enforcement.
--
-- AND IT IS WHAT WAS RULED. Q13, 2026-08-18: a live derivative KEEPS RUNNING and is re-pinned at its
-- next edit, and Ewa was offered "they come down until re-pinned" explicitly and did not take it.
-- Blocking the bookkeeping of a live post is a takedown wearing a gate's clothes.
--
-- So the claim block now fires only on ARRIVAL at scheduled-or-later, which is the same shape, and
-- the same argument, as the thumbnail rule two blocks above it. A tier 2 or tier 3 found on copy
-- that is already live is 5.4's surfacing job and a human's to work through, exactly as a superseded
-- pin is.

begin;

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

  -- Plan step 5.3. ON ARRIVAL ONLY: see this file's header. An open verdict stops copy GOING live;
  -- it never stops us recording what a live post did.
  if arriving then
    select count(*),
           string_agg(format('tier %s: "%s"', c.tier,
                             left(c.quote, 80) || case when length(c.quote) > 80 then '...' else '' end),
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
  end if;

  return new;
end;
$function$;

drop trigger if exists gate_rendition_publish on public.content_renditions;
create trigger gate_rendition_publish
  before insert or update on public.content_renditions
  for each row execute function public.gate_rendition_publish();

commit;

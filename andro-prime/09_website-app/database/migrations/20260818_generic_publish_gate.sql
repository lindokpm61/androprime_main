-- Plan step 6.3: the publish gate stops asking a thumbnail-shaped question and asks a media-shaped
-- one. This is the step 6.1 and 6.2 were for; until it lands, those two migrations have not bought
-- the thing they were applied for.
--
-- SUPERSEDES the `gate_rendition_publish()` in `20260818_content_claim_tiers_gate_on_arrival.sql`,
-- which itself superseded `20260801_content_state_guards.sql` section 4. Every rule from both is
-- carried forward. The only rule that CHANGES is the thumbnail one.
--
-- WHAT IT REPLACES, AND WHY THAT WAS THE WRONG SHAPE:
--
--   if arriving and new.thumb_spec <> 'none' ...  -> 'needs a confirmed thumbnail'
--
-- `content_renditions.thumb_spec` is the rendition's own copy of a rule that belongs to the channel.
-- Measured before writing this: across all 91 renditions the column's value is perfectly determined
-- by (platform, format) and disagrees with `content_channels.thumb_spec` exactly ZERO times, which
-- is the evidence it was a channel fact all along. Worse, it could only ever express "a cover is
-- owed": it had nothing to say about a carousel that needs eight images or a Reel that needs a
-- video, so the gate was silent on the requirement most likely to be missing.
--
-- WHAT IT ASKS NOW. One question, from the channel row: does this rendition have the media its
-- channel requires? `media_kind`, `media_min`, `media_max` and `thumb_spec` all come from
-- `content_channels`, and the answer comes from `content_rendition_media`. Adding a platform is a
-- row in one table and a media requirement beside it, which is 6.3's whole "done when".
--
-- ─────────────────────────────────────────────────────────────────────────────────────────────
-- IT FIRES ON AN UPDATE INTO scheduled, NEVER ON AN INSERT, AND THAT IS NOT A WEAKENING.
--
-- Media links are keyed to a rendition id, so at INSERT time they CANNOT exist: nothing can be
-- linked to a row that does not yet exist. A gate demanding them on INSERT is not a gate, it is a
-- ban on the insert path.
--
-- And the insert path is how we RECORD REALITY. `register-carousel-run.ts` inserts renditions
-- straight at `scheduled` because the posts are already scheduled in Metricool; it is writing down
-- what is already true out in the world. Refusing that write would leave the database unable to
-- describe a run that exists, which is strictly worse than describing it with the media rows still
-- to come. The gate is here to stop us PUSHING something out without its media, not to stop us
-- writing down something already out.
--
-- The gap that leaves — a row inserted straight to scheduled with no media — is real and is covered
-- by content-doctor, which tests the RESTING state and can therefore see what an arrival-shaped gate
-- never will. Same split as the claim ladder in the migration this supersedes: the gate refuses the
-- transition, the invariant reports the state.
-- ─────────────────────────────────────────────────────────────────────────────────────────────
--
-- `content_renditions.thumb_spec` IS DELIBERATELY LEFT IN PLACE by this migration. It is now
-- provably redundant, but five consumers still read it (content-doctor I2 and I7, the ops board,
-- and two registration scripts) and `db-owned-keys.json` names it. Dropping it is a separate change
-- with its own blast radius, and doing it in the same migration as the gate would mean that if the
-- gate had to be rolled back, the column it replaced would already be gone.

begin;

create or replace function public.gate_rendition_publish()
returns trigger
language plpgsql
as $function$
declare
  a              public.content_assets%rowtype;
  ch             public.content_channels%rowtype;
  article_status text;
  arriving       boolean;
  open_claims    integer;
  open_detail    text;
  body_media     integer;
  thumb_media    integer;
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

  -- A published rendition with no URL is an unverifiable claim that it shipped.
  if new.status in ('published', 'measured') and coalesce(new.external_url, '') = '' then
    raise exception
      'GATE: rendition %/% cannot be % without an external_url.',
      new.platform, new.format, new.status
      using errcode = 'check_violation';
  end if;

  -- ── Plan step 6.3: the media rule, read from the CHANNEL ──────────────────
  -- UPDATE-arrival only. See this file's header for why an INSERT is exempt and what covers it.
  if arriving and tg_op = 'UPDATE' then
    select * into ch from public.content_channels
     where platform = new.platform and format = new.format;

    -- No channel row means no spec, and no spec means the requirement cannot be checked. Refusing is
    -- the other half of "adding a platform is one row": if there is no row, there is no platform.
    if not found then
      raise exception
        'GATE: rendition %/% cannot be % because there is no content_channels row for it. A channel is what defines the media a rendition needs, so a rendition on an unregistered channel cannot be checked against anything.',
        new.platform, new.format, new.status
        using errcode = 'check_violation';
    end if;

    if ch.media_kind <> 'none' and ch.media_min > 0 then
      select count(*) into body_media
        from public.content_rendition_media m
       where m.rendition_id = new.id and m.role = 'body';

      if body_media < ch.media_min then
        raise exception
          'GATE: rendition %/% cannot be % with % of the % % file(s) its channel requires. Link them in content_rendition_media first.',
          new.platform, new.format, new.status, body_media, ch.media_min, ch.media_kind
          using errcode = 'check_violation';
      end if;

      if ch.media_max is not null and body_media > ch.media_max then
        raise exception
          'GATE: rendition %/% carries % % file(s) and its channel accepts at most %.',
          new.platform, new.format, body_media, ch.media_kind, ch.media_max
          using errcode = 'check_violation';
      end if;
    end if;

    -- Thumbnails are a gate, not a nicety (plan §4). The question is unchanged; only where the
    -- requirement is read from, and what counts as an answer, have moved. Before 6.2 there was no
    -- `thumb_confirmed` column to test against, so the old rule could only ask whether the row was
    -- passing through a particular status. A linked thumb IS the confirmation.
    if ch.thumb_spec <> 'none' then
      select count(*) into thumb_media
        from public.content_rendition_media m
       where m.rendition_id = new.id and m.role = 'thumb';

      if thumb_media = 0 then
        raise exception
          'GATE: rendition %/% needs a % thumbnail before %, and none is linked.',
          new.platform, new.format, ch.thumb_spec, new.status
          using errcode = 'check_violation';
      end if;
    end if;
  end if;

  -- Plan step 5.3. Arrival only: an open verdict stops copy GOING live, never stops us recording
  -- what a live post did.
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

comment on function public.gate_rendition_publish() is
  'The one publish gate. Plan step 6.3: the media requirement is read from content_channels and answered from content_rendition_media, so adding a platform costs a channel row rather than code. Fires on arrival at scheduled-or-later; the media half is UPDATE-only because media cannot be linked to a row that does not yet exist, and content-doctor covers the resting state an arrival gate cannot see.';

commit;

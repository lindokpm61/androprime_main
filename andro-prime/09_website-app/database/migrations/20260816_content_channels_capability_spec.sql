-- Plan step 6.1: finish content_channels into a SPEC.
--
-- The goal of Phase 6 is that adding a platform costs a row and no code. Today a channel row says
-- what a channel IS (label, lane, in_plan, connected) and nothing about what it REQUIRES, so every
-- requirement lives somewhere else: thumbnail rules in a rendition column, media rules in the
-- scheduler's TypeScript, copy limits nowhere, and "has this route ever carried a real post" in a
-- prose notes field. This migration moves the requirements onto the row.
--
-- EVIDENCE THAT thumb_spec BELONGS HERE: across all 74 renditions, thumb_spec is perfectly
-- determined by (platform, format). Every instagram/reel is 9x16, every facebook/link-post is none,
-- the single youtube/long-form is 1280x720. A column whose value is a function of the channel is a
-- channel fact copied onto every child row.
--
-- DELIBERATELY ADDITIVE. content_renditions.thumb_spec is NOT dropped here. The publish gate still
-- reads it, and removing it before step 6.3 makes the gate generic would take the thumbnail check
-- offline in between. 6.1 makes the channel authoritative; 6.3 makes the gate read it; only then
-- does the rendition column become dead and droppable.

begin;

-- ── What the channel REQUIRES of a rendition ────────────────────────────────

alter table public.content_channels
  -- 'none' is a real answer, not an absent one: a text-only post REQUIRES no media, which is a
  -- different claim from nobody having recorded the requirement yet. Hence NOT NULL with a default.
  add column if not exists media_kind text not null default 'none',
  add column if not exists media_min smallint not null default 0,
  add column if not exists media_max smallint,
  -- Null means the channel does not constrain aspect, not that any aspect is fine to ship.
  add column if not exists media_aspect text,
  -- Moved from content_renditions. Same vocabulary, so the values transfer without translation.
  add column if not exists thumb_spec text not null default 'none',
  add column if not exists body_max_chars integer,
  add column if not exists supports_first_comment boolean not null default false,
  -- Some routes cannot be fully automated: the publisher schedules, a human presses send.
  add column if not exists requires_human_publish boolean not null default false,
  -- The publisher-scoped container this channel addresses. For Metricool this is the blogId, and it
  -- is the fix for a real constraint: metricool-schedule.ts reads ONE brand from METRICOOL_BLOG_ID,
  -- so it structurally cannot reach a second brand. Metricool permits one Instagram account per
  -- brand, we have two Instagram accounts, therefore two brands (Keith, 2026-08-16). Until the
  -- brand is a per-channel fact, the shared scheduler can only ever serve one of them.
  add column if not exists publisher_brand text,
  -- "connected" and "has ever carried a real post" are different facts and only one of them is
  -- evidence. Six of the ten routes are connected and have never published anything.
  add column if not exists route_verified_at timestamptz,
  add column if not exists route_verified_evidence text;

alter table public.content_channels
  drop constraint if exists content_channels_media_kind_check;
alter table public.content_channels
  add constraint content_channels_media_kind_check
  check (media_kind in ('none', 'image', 'video'));

alter table public.content_channels
  drop constraint if exists content_channels_media_count_check;
alter table public.content_channels
  add constraint content_channels_media_count_check
  check (
    media_min >= 0
    and (media_max is null or media_max >= media_min)
    -- A channel requiring no media cannot also require at least one of it.
    and (media_kind <> 'none' or media_min = 0)
  );

alter table public.content_channels
  drop constraint if exists content_channels_thumb_spec_check;
alter table public.content_channels
  add constraint content_channels_thumb_spec_check
  check (thumb_spec in ('none', '9x16', '1280x720'));

comment on column public.content_channels.media_kind is
  'What this channel requires: none | image | video. Authoritative from 2026-08-16 (plan step 6.1).';
comment on column public.content_channels.thumb_spec is
  'Moved from content_renditions, where it was a channel fact copied onto every child row. The rendition column is still read by the publish gate until step 6.3.';
comment on column public.content_channels.publisher_brand is
  'Publisher-scoped account container. For Metricool, the blogId. Two brands exist because Metricool permits one Instagram account per brand.';
comment on column public.content_channels.route_verified_at is
  'When this route last carried a REAL post. Null means never, which "connected = true" does not tell you.';

-- ── Seed the requirements from what is already true ─────────────────────────
-- thumb_spec is lifted from the renditions rather than retyped, so the two cannot disagree at the
-- moment of the move. A channel with no renditions keeps the 'none' default and is corrected below.

update public.content_channels c
set thumb_spec = r.spec
from (
  select platform, format, min(thumb_spec) spec
  from public.content_renditions
  group by platform, format
  having count(distinct thumb_spec) = 1
) r
where c.platform = r.platform and c.format = r.format;

-- Media, copy limits and brand. Every value here is either a published platform limit or a fact
-- recorded elsewhere in the repo; none is inferred from a rendition.
update public.content_channels set
  media_kind = v.media_kind,
  media_min = v.media_min,
  media_max = v.media_max,
  media_aspect = v.media_aspect,
  body_max_chars = v.body_max_chars,
  supports_first_comment = v.supports_first_comment,
  publisher_brand = v.publisher_brand
from (values
  -- platform,    format,       kind,    min, max,  aspect,     chars, 1st comment, brand
  ('linkedin',  'text-post',  'none',  0, null,   null,       3000, true,  null),
  ('linkedin',  'short',      'video', 1, 1,      '9x16',     3000, true,  '6633045'),
  ('facebook',  'link-post',  'image', 0, 1,      null,       null, false, '6633045'),
  ('substack',  'newsletter', 'none',  0, null,   null,       null, false, null),
  -- The carousel lane is the personal brand; the reel lane is the company brand. Keith, 2026-08-16.
  ('instagram', 'reel',       'video', 1, 1,      '9x16',     2200, true,  '6633045'),
  ('instagram', 'carousel',   'image', 2, 10,     '4x5',      2200, true,  '6693691'),
  ('tiktok',    'short',      'video', 1, 1,      '9x16',     2200, false, '6633045'),
  ('youtube',   'short',      'video', 1, 1,      '9x16',     null, false, '6633045'),
  ('youtube',   'long-form',  'video', 1, 1,      '16x9',     null, false, '6633045'),
  ('x',         'text-post',  'none',  0, null,   null,       280,  false, '6633045')
) as v(platform, format, media_kind, media_min, media_max, media_aspect, body_max_chars, supports_first_comment, publisher_brand)
where content_channels.platform = v.platform and content_channels.format = v.format;

-- ── Two account fields were wrong, and both predate the 2026-08-09/10 two-brand restructure ──
-- Corrected against Metricool's own getBrandSettings, read 2026-08-16, not against a document.
-- Neither has shipped a post to the wrong place: the shared scheduler addresses METRICOOL_BLOG_ID
-- (the company brand), so the CODE was right and the ROW was wrong, which is the harder direction
-- to notice because nothing fails.

-- Reels belong to the company Instagram, not the carousel account (Keith, 2026-08-16).
update public.content_channels
set account = 'keithandroprime',
    notes = coalesce(notes, '') || ' | ACCOUNT CORRECTED 2026-08-16: was keith.antony.ai, which is the carousel account on brand 6693691. Reels run on the company account keithandroprime, brand 6633045 (Keith, 2026-08-16). Verified against Metricool getBrandSettings.'
where platform = 'instagram' and format = 'reel';

-- The row named the personal page while its own note described the company page (Keith, 2026-08-16).
update public.content_channels
set account = '1292054467322962',
    notes = coalesce(notes, '') || ' | ACCOUNT CORRECTED 2026-08-16: was 913631891838376, the PERSONAL page on brand 6693691. The company page is 1292054467322962 on brand 6633045, which is what this row''s own note described and where the shared scheduler already posts.'
where platform = 'facebook' and format = 'link-post';

-- ── Route verification: recorded from evidence, never assumed ────────────────
-- A route is verified by a rendition that actually reached published with a real URL.

update public.content_channels c
set route_verified_at = r.last_published,
    route_verified_evidence = r.evidence
from (
  select platform, format,
         max(published_at) as last_published,
         'last real published rendition: ' || max(external_url) as evidence
  from public.content_renditions
  where status in ('published', 'measured')
    and coalesce(external_url, '') <> ''
    and published_at is not null
  group by platform, format
) r
where c.platform = r.platform and c.format = r.format;

commit;

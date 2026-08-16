-- Plan step 6.2: add content_media.
--
-- WHAT IT COLLAPSES. Four problems today are one problem underneath: nothing in the database knows
-- which FILES belong to a rendition.
--   1. Thumbnails are special-cased, via a thumb_spec column and a bespoke branch in the gate.
--   2. The publish gate cannot ask a generic question, so it asks a thumbnail-shaped one.
--   3. A carousel's eight stills and a video's clip-plus-thumbnail have no common shape.
--   4. One 9:16 export is COPIED to the Instagram Reel, the YouTube Short, the TikTok short and the
--      LinkedIn short, so four rows describe one file and can drift apart.
--
-- The many-to-many is the point of (4): a single media row is LINKED to four renditions rather than
-- duplicated into them, so re-rendering the export updates one row and every surface follows.
--
-- THIS IS ALSO PLAN STEP 1.3'S BLOCKER. Retiring carousel-prototype/schedule.js into the shared
-- scheduler needs the shared scheduler to build an eight-media Instagram payload, and "which files
-- belong to this rendition" has had no home in the database. It does now. (1.3 has a SECOND blocker,
-- found 2026-08-16: metricool-schedule.ts reads one brand from METRICOOL_BLOG_ID and the carousel
-- lane is on the other brand. Step 6.1 put publisher_brand on the channel row; the scheduler still
-- has to read it.)
--
-- EMPTY ON PURPOSE. No backfill runs here. The 110 carousel objects are described by the committed
-- media-manifest.json and the 21 owed thumbnails do not exist yet, so populating this table is a
-- separate, checkable step against a real source rather than a guess made inside a migration.

begin;

create table if not exists public.content_media (
  id uuid primary key default gen_random_uuid(),

  -- Media belongs to the IDEA, not to one of its renditions. That is what lets one export serve
  -- four channels: the file is a fact about the asset, the linking is a fact about the rendition.
  asset_id uuid not null references public.content_assets(id) on delete cascade,

  kind text not null,
  -- Null means the aspect is unrecorded, never that it is unconstrained. The channel says what it
  -- requires (6.1); this says what the file actually is; the gate (6.3) compares the two.
  aspect text,

  -- Where the bytes actually are. A public Storage URL, a Drive URL, or a repo path for site chrome.
  uri text not null,
  -- How it got here, so an object with no producer is visible rather than assumed.
  origin text not null,

  -- Same sha256 convention as media-manifest.json, which already records path, URL, sha256 and size
  -- for every published carousel object. Recorded so what shipped stays provable without the bytes.
  checksum text,
  bytes bigint,
  width integer,
  height integer,

  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint content_media_kind_check check (kind in ('image', 'video', 'thumb')),
  constraint content_media_origin_check
    check (origin in ('render', 'drive', 'upload', 'article-photo', 'external')),
  constraint content_media_uri_not_blank check (btrim(uri) <> '')
);

-- One file per asset per URI. Re-registering the same object is an update, never a second row.
create unique index if not exists content_media_asset_uri_key
  on public.content_media (asset_id, uri);

create index if not exists content_media_asset_idx on public.content_media (asset_id);
create index if not exists content_media_checksum_idx on public.content_media (checksum)
  where checksum is not null;

comment on table public.content_media is
  'Files belonging to a content asset. Linked to renditions many-to-many via content_rendition_media so one export can serve several channels without being copied. Plan step 6.2, 2026-08-16.';
comment on column public.content_media.origin is
  'How the file came to exist: render | drive | upload | article-photo | external. An object with no producer should be visible, not assumed.';

-- ── The join: which files this rendition ships, in what order, doing what job ──

create table if not exists public.content_rendition_media (
  rendition_id uuid not null references public.content_renditions(id) on delete cascade,
  media_id uuid not null references public.content_media(id) on delete restrict,

  -- 'body' is the post's own media; 'thumb' is its cover. This is what makes thumbnails stop being
  -- special: a cover is a linked file with a role, not a column and a bespoke gate branch.
  role text not null default 'body',
  -- Carousel slide order. Meaningless for a single-media post, required for eight stills.
  position smallint not null default 1,

  created_at timestamptz not null default now(),

  primary key (rendition_id, media_id, role),
  constraint content_rendition_media_role_check check (role in ('body', 'thumb')),
  constraint content_rendition_media_position_check check (position >= 1)
);

-- Two files cannot occupy the same slot in the same role. Without this, a carousel can hold eight
-- media and still have no defined order, which is a post nobody can reproduce.
create unique index if not exists content_rendition_media_slot_key
  on public.content_rendition_media (rendition_id, role, position);

create index if not exists content_rendition_media_media_idx
  on public.content_rendition_media (media_id);

comment on table public.content_rendition_media is
  'Many-to-many between renditions and their files. role separates body media from the cover; position carries carousel slide order. on delete restrict on media_id so a file still in use cannot be deleted silently.';

-- ── A rendition may only ship media belonging to its own asset ──────────────
-- Without this, the join is wide open: any file could be attached to any post. The failure mode is
-- not abstract, it is one asset's approved slide shipping under another asset's caption.

create or replace function public.gate_rendition_media_same_asset()
returns trigger
language plpgsql
as $function$
declare
  r_asset uuid;
  m_asset uuid;
begin
  select asset_id into r_asset from public.content_renditions where id = new.rendition_id;
  select asset_id into m_asset from public.content_media      where id = new.media_id;

  if r_asset is null or m_asset is null then
    raise exception 'GATE: rendition % or media % does not exist', new.rendition_id, new.media_id
      using errcode = 'check_violation';
  end if;

  if r_asset <> m_asset then
    raise exception
      'GATE: media % belongs to asset %, but rendition % belongs to asset %. A rendition may only ship its own asset''s media.',
      new.media_id, m_asset, new.rendition_id, r_asset
      using errcode = 'check_violation';
  end if;

  return new;
end;
$function$;

drop trigger if exists trg_rendition_media_same_asset on public.content_rendition_media;
create trigger trg_rendition_media_same_asset
  before insert or update on public.content_rendition_media
  for each row execute function public.gate_rendition_media_same_asset();

-- ── RLS: same posture as the rest of the content pipeline ───────────────────
-- These tables are written by the engine under the service role. No anon path exists or should:
-- the bucket is already public for reading the bytes, and nothing anonymous needs the index of them.

alter table public.content_media enable row level security;
alter table public.content_rendition_media enable row level security;

commit;

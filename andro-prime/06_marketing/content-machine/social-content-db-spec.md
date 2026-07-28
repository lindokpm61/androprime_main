---
doc: social-content-db-spec
status: BUILT 2026-07-28 in project phqrjtnflovicgkngieu. All five tables live, backfilled, gates active. Section 5 decisions resolved; section 6 unknowns closed.
owner: Keith Antony
read_first: content-library-build-spec.md, templates/asset-file.md, ../seo-ai-search/content-engine-roadmap.md
---

# Storing short-form content in the DB

> **BUILT 2026-07-28.** Migrations `social_content_tables` and `social_content_gates`. Six assets, fourteen renditions, two hooks and two metric captures backfilled from the git asset files. **See section 8 for what changed between this proposal and what was built, and why.**
>
> **Keith's decision on sequencing (2026-07-28), which overrode a phased recommendation:** build all of it now rather than staging it. His argument, and it is the right one: migration cost scales with volume, so six assets is the cheapest this will ever be, and a half-migration (hooks in Postgres, assets in git) is precisely the two-sources-of-truth state section 2 warns against. Iterating through small problems now beats untangling a large one later.

Where hooks, captions and post text live once Unipile handles distribution, for every short-form channel and not only LinkedIn.

---

## 1. The problem, stated precisely

Short-form content currently lives in **git markdown frontmatter** (`assets/*.md`), with ClickUp as a read-only mirror. That works while a human is the publisher. It stops working the moment a machine is, for three reasons:

1. **A publisher needs to write back.** Post IDs, live URLs, publish timestamps. Machine-written state committed to git is state you have to merge, and it will conflict with whatever an agent is drafting in the same file.
2. **Metrics are time-series.** Unipile can return impressions and engagement per post, repeatedly. That is rows over time, not a frontmatter field.
3. **The `renditions:` array is already a relation pretending to be YAML.** One asset fans out to N platform variants, each with its own copy, status, schedule and URL. It is a child table, and it is currently a nested list that nothing can query.

The tell is already visible in `templates/asset-file.md`: renditions carry `status`, `url` and `publish_date` per platform, and the gate scanner has to parse YAML to enforce transitions on them.

## 2. The precedent, and the conflict in it

The repo already contains **two opposite answers** to "where is the source of truth", and nobody has reconciled them:

| Spine | Source of truth | Mirror | Rule |
| --- | --- | --- | --- |
| **A, blog** | **Supabase** (`blog_articles`, `blog_article_revisions`, `content_pipeline`) | git `content/blog/` via `sync-mirror.ts` | "The DB is the source of truth the moment `draft-writer` runs" |
| **B, founder/social** | **git** (`assets/*.md`) | ClickUp Content Library, one-way | "The ClickUp mirror is read-only, git wins on any disagreement" |

Spine A adopted DB-as-truth because a publisher writes back to it. Spine B is about to acquire a publisher. **The same forcing function applies, and the recommendation is to follow the same precedent** rather than invent a third pattern.

## 3. Proposed schema (five tables)

Named and shaped to sit beside the existing content tables rather than parallel to them.

### `content_assets`
One row per idea. The direct equivalent of an asset file's top-level frontmatter, and the sibling of `blog_articles`.

```
id                   uuid pk
slug                 text unique not null      -- immutable once minted, same rule as today
title                text not null
status               enum(idea, hooked, scripted, recorded, edited, approved, done)
content_type         enum(educational, personal-story, proof-result, objection-comparison)
funnel_stage         enum(TOFU, MOFU, BOFU, RETENTION)
funnel_job           text
awareness            enum(unaware … advocate)
cta                  enum(follow, quiz, email-rung, kit-1, kit-2, kit-3, retest, referral)
markers              text[]                    -- was a single field; four-worth-seeing needs four
series               text
preflight            enum(not-run, green, amber-ewa, red)
preflight_date       date
ewa_task             text                      -- ClickUp URL
canonical_article_id uuid  fk -> blog_articles(id)   -- SEE §4.1
drive_url            text
notes                text
created_at, updated_at
```

### `content_hooks`
Every hook generated, not only the chosen one, with its rubric score. **See §4.2 for why this is the most valuable table here.**

```
id            uuid pk
asset_id      uuid fk -> content_assets(id)
archetype     enum(fortune-teller, experimenter, teacher, magician, investigator, contrarian)
spoken        text
text_overlay  text          -- the 3-to-5 word muted-legible line
visual         text
question       text
score_total    int           -- 0..12
score_detail   jsonb         -- per-dimension, {new_reveal: 2, outcome: 1, …}
gate_failures  text[]        -- empty when it passed the hard gates
targeted       enum(mainstream, power-user)   -- which Mark, per hook-rubric §2
chosen         boolean default false
created_at
```

### `content_renditions`
One row per platform variant. This is where **captions and post text** live, because they differ per platform.

```
id               uuid pk
asset_id         uuid fk -> content_assets(id)
platform         enum(linkedin, instagram, facebook, youtube, tiktok, substack)
format           enum(reel, short, long-form, link-post, text-post, newsletter)
body             text          -- the actual post copy for THIS platform
first_comment    text          -- LinkedIn pattern: link kept out of the post body
thumb_spec       enum(9x16, 1280x720, 1200x630, none)
status           enum(to-produce, thumbnail-done, scheduled, published, measured)
scheduled_for    timestamptz
published_at     timestamptz
external_url     text
external_post_id text          -- what Unipile returns; the join key for metrics
unipile_account  text          -- which connected account posted it
created_at, updated_at
```

### `content_metrics`
Time-series, one row per capture per rendition.

```
id           uuid pk
rendition_id uuid fk -> content_renditions(id)
captured_at  timestamptz not null
impressions  int
reactions    int
comments     int
shares       int
clicks       int
raw          jsonb        -- whatever else the platform returns, unparsed
```

### `content_asset_revisions`
Mirrors `blog_article_revisions`. Versioned body of the hook and script, so an edit after pre-flight is traceable. Same reason the blog has one: the compliance trail must show what was cleared, not only what is current.

---

## 4. What this unlocks that the current setup cannot

### 4.1 Claim inheritance becomes enforceable instead of asserted

Today, `canonical_asset: why-am-i-always-tired` is a **string in YAML**, and the inheritance check is a prose table a human wrote by hand in the asset body. It is careful work, and it is unverifiable by anything.

As `canonical_article_id uuid fk -> blog_articles(id)`, it becomes a constraint. Then the gate can be real:

> A rendition may not reach `scheduled` unless its asset's canonical article exists and is `status='published'`.

That extends the CQC/ASA audit trail, which currently covers blog only via `content_review_log`, to every social post. Given the whole atomisation model rests on "no derivative introduces a claim its canonical asset does not make", this is the single strongest argument for the migration.

### 4.2 The hook rubric's §5 stops being empty

`hook-rubric.md` §5 (learned criteria) is deliberately blank, because there is no performance data. I said the data half of Kallaway's hook machine could not be replicated without Sandcastles.

**With `content_hooks` joined to `content_metrics` through renditions, it can be, in-house.** Every hook ever generated, its rubric score, whether it was chosen, and what the resulting post actually did. That is the whole loop, and it is a single query:

```sql
select h.archetype, h.score_total, h.targeted, m.impressions, m.reactions
from content_hooks h
join content_assets a  on a.id = h.asset_id
join content_renditions r on r.asset_id = a.id and r.status = 'measured'
join content_metrics m on m.rendition_id = r.id
where h.chosen;
```

Keeping the **rejected** hooks is what makes it work. Winners-only data cannot tell you whether the rubric is picking correctly; you need the ones it scored low to see whether they would have done worse.

### 4.3 The week's plan becomes queryable

`/content-week` currently reads a markdown queue. With this, "what is scheduled, what is stale, what is unpublished" is a query, and the two-lane rule (Lane 1 never blocked by Lane 2) can be enforced rather than remembered.

---

## 5. Three decisions, all Keith's

**Decision 1: does the DB become the source of truth, or a projection?**

- **DB-as-truth** (recommended): matches Spine A, survives machine writeback, git `assets/*.md` becomes a mirror like `content/blog/`. Cost: the gate scanner is rewritten to read the DB, and the existing six asset files migrate.
- **DB-as-projection**: git stays authoritative, the DB holds only distribution and metrics. Cheaper now. Breaks the first time Unipile writes a post ID, because the authoritative record then has to be updated by hand.

**Decision 2: do rejected hooks get stored?** Recommended yes, and the reason is §4.2. It costs almost nothing and it is the only route to a data-driven rubric.

**Decision 3: does the canonical-article FK become a hard gate or a warning?** Hard gate is the compliance-correct answer and it will block a post one day when the canonical article is still in review. That is the gate working, but it is Keith who lives with the friction.

---

## 6. What I could not verify

- **Unipile's actual response shape.** The connector needs authorising, so `external_post_id`, the account identifier and the metrics field names are inferred from the pattern in `linkedin-post-search`, not read from the API. Confirm against a live call before the migration is written, because those three columns are the integration surface.
- **Whether Unipile posts to anything beyond LinkedIn** for this account. The schema assumes multi-platform because the brief is "not just for LinkedIn", but which platforms are actually reachable through it is unconfirmed.
- **Rate limits and scheduling.** Whether scheduling is Unipile's job or ours changes whether `scheduled_for` is a real queue or a note.

## 8. What was actually built, 2026-07-28

### 8.1 Section 5 decisions, resolved

- **Decision 1, DB-as-truth or projection: DB-as-truth.** Follows the Spine A precedent rather than inventing a third pattern. The git `assets/*.md` files remain for now and become a mirror; the gate scanner still reads them, so **there is a transition window where both exist and the JS scanner is the one enforcing git**. Closing that window (regenerating the markdown from the DB, and retiring or repointing `scan.js`) is the next piece of work and is not done.
- **Decision 2, store rejected hooks: yes.** `content_hooks` has no "chosen only" filter and the `chosen` boolean carries that instead. **Only two hooks exist so far, both chosen.** Every rejected hook generated before today is unrecoverable, which is the cost of not having built this sooner and the reason not to wait longer.
- **Decision 3, canonical FK as hard gate: hard gate, on by default.** Implemented in `gate_rendition_publish()`. It guards the single rule the whole atomisation model rests on. To downgrade to advisory: `drop trigger gate_rendition_publish on public.content_renditions;`

### 8.2 Section 6 unknowns, closed against a live API

- **Response shape, observed not inferred.** `POST /api/v1/posts` returns `{object:"PostCreated", post_id}`. `GET /api/v1/posts/{id}` returns `social_id` (`urn:li:activity:…`), `share_url`, `parsed_datetime`, and counters. **The metric field names in section 3 were wrong**: they are `impressions_counter`, `reaction_counter`, `comment_counter`, `repost_counter`, and **there is no `clicks` field**. Two fields the proposal did not anticipate turned out to matter more than most of the ones it did: `analytics.profile_viewers_from_this_post` and `analytics.followers_gained_from_this_post`. For a founder-halo channel, "how many people went and looked at Keith" is closer to the real KPI than impressions, so both got columns.
- **A counter gotcha worth carrying into every report:** `comment_counter` includes our **own** first comment. Audience comments are `comment_counter - 1` wherever the LinkedIn first-comment pattern is used. Recorded in each metrics row's `raw` so it cannot be silently misread later.
- **Platforms.** Unipile genuinely supports Instagram (its create-post schema carries Instagram-only `post_type` and `location` fields), but the account list returns **exactly one account, type LINKEDIN**. Instagram is reachable in principle and not connected in fact; connecting is a separate hosted-auth flow (`POST /api/v1/hosted/accounts/link`). The schema is multi-platform in anticipation, not in use.
- **Scheduling is ours.** `POST /api/v1/posts` has **no `scheduled_at` field**: it publishes immediately or not at all. So `scheduled_for` records intent and something on our side has to fire. Given every SOP says Keith presses go, the trigger stays human until there is a track record worth automating.
- **Base URL and account id** (both differ from what the skills record): `https://api20.unipile.com:15044`, account `vX9iWaO0Q0KNed0UWsOraA`. The `1WSVXQByQ_ybabjwkD2gFQ` in `linkedin-deep-analysis` is stale.

### 8.3 Deviations from the proposed schema

- **`text` + `CHECK` instead of native enums.** Adding a platform or a status to a CHECK is one `ALTER`; to a pg enum it is a type migration. The entire argument for building at six assets is that the shape is cheap to change, so the shape had to be cheap to change.
- **`markers text[]`**, replacing the single `marker` YAML field, because `four-worth-seeing` carries four.
- **`unique (asset_id, platform, format)`** on renditions. Deliberately includes `format`: `ep-0-baseline` legitimately has two YouTube renditions, a long-form and a short.
- **Gate triggers fire on `UPDATE` only, never `INSERT`.** Backfill therefore records history as it actually happened, including the one asset that shipped ahead of its gate, rather than rewriting it to something the rules would have allowed.
- **`content_asset_revisions` is live but empty.** The git files are the historical record for everything up to today; revisions start from the next edit made through the DB.

### 8.4 What the backfill immediately surfaced

- **`substack-welcome-normal-on-paper` had no renditions block at all** in its frontmatter. It has been tracked as a ready asset since 19 July with nowhere to ship to. A `substack/newsletter` rendition was created during migration. A nested YAML list can be silently absent; a child table makes the absence visible.
- **`instrumentation-problem` is a live post on an asset at `scripted` with `preflight: amber-ewa`.** The DB now holds that contradiction explicitly rather than as a scanner warning, and the approval gate refuses to resolve it until an `ewa_task` exists or the pre-flight goes green. Verified by attempting the update and being refused.

## 7. Not in scope

Automatic posting. Every existing SOP says Keith presses go, and nothing here changes that: the schema records the intent to publish and the fact of publication, and the trigger stays manual until Keith decides otherwise.

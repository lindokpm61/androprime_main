**Owner:** Keith Antony
**Status:** Build spec v2, 2026-07-13
**Read first:** `CONTEXT.md`

---

# Build: Andro Prime Content Library (git-first tracker)

## Goal
Stop the founder being the database. Every founder content idea has ONE
record (a git asset file) that shows exactly where it is in the pipeline,
so nothing gets lost or half-finished, one shoot reliably fans out to every
platform, compliance and thumbnail gates are machine-checked, and funnel
balance is visible on demand. Git is the source of truth; ClickUp is a
read-only mirror; Drive holds media. No bespoke app, no manual bookkeeping:
if the founder must maintain any part by hand, it has failed.

## Architecture
- WORDS -> git. One asset file per idea:
  andro-prime/06_marketing/content-machine/assets/YYYY-MM-DD-<slug>.md
  Frontmatter = the tracker. Body = chosen hook + script (all modes).
- MEDIA -> Google Drive: Content/YYYY-MM/<slug>/{raw,final,thumb}/
  Thumb filenames encode surface: thumb-9x16.png, thumb-1280x720.png,
  thumb-1200x630.png. Git stores only the folder URL.
- STATE VIEW -> /content-status skill renders the board from frontmatter.
- MIRROR -> one-way git->ClickUp sync: one task per asset in a new
  "Content Library" list (Phase 0 Launch folder, workspace 90121729875),
  status mapped to the list's single status set, renditions rendered as a
  markdown table in the task description. No custom fields. Ewa's
  "Content Review" list 901218140081 is untouched.

## Asset frontmatter schema
  slug: <kebab-case, minted at /hook time; also the Drive folder + task name>
  title: <working title>
  status: idea | hooked | scripted | recorded | edited | approved | done
  content_type: educational | personal-story | proof-result | objection-comparison
  funnel_stage: TOFU | MOFU | BOFU | RETENTION      # existing markup fields
  funnel_job / awareness / cta / marker: <per content-funnel-map.md>
  preflight: not-run | green | amber-ewa | red
  preflight_date: YYYY-MM-DD
  ewa_task: <ClickUp URL, only when amber-ewa / net-new claim>
  canonical_asset: <slug of the Ewa-signed article it inherits from, or "none">
  drive: <folder URL>
  series: <e.g. "Read Your Blood" | none>
  renditions:
    - platform: instagram|youtube|tiktok|facebook|linkedin
      format: reel|short|long-form|link-post|text-post
      thumb: 9x16|1280x720|1200x630|none
      status: to-produce | thumbnail-done | scheduled | published | measured
      url: <published URL, once live>
      publish_date: YYYY-MM-DD

Status model EXTENDS unified-content-calendar.md section 2 (idea ->
drafted -> preflight -> [Ewa] -> scheduled -> live -> measured); it does
not replace it. Recorded/edited slot between drafted and scheduled.

## Default rendition fan-out (skills auto-create; Keith deletes unwanted)
  short-form script -> instagram/reel + youtube/short + tiktok/short (all 9x16)
  long script       -> youtube/long-form (1280x720)
  linkedin mode     -> linkedin/text-post (thumb none)
  facebook mode     -> facebook/link-post (1200x630)

## Gates (machine-enforced by the scanner, exit 2 = block)
  G1 status >= scripted requires a script in the body
  G2 status >= approved requires preflight green (or amber-ewa + ewa_task
     closed) AND canonical_asset set (or an explicit net-new-claim Ewa pass)
  G3 rendition >= scheduled requires: parent >= approved, and if thumb !=
     none, a matching thumb file confirmed in Drive (or a checked
     "thumb-confirmed" flag on the rendition)
  G4 rendition published requires url
  G5 no em dash in any body copy; silent ingredient never named (reuse
     compliance scan.js HARD table on the body)

## Deliverables
D1 Asset schema + assets/ dir + one template file (asset-file.md) in
   content-machine/templates/, documented in content-machine/CONTEXT.md.
D2 Gate scanner: .claude/skills/content-status/scan.js : zero-dep Node CJS
   copying compliance-preflight/scan.js conventions (regex/flat-YAML parse,
   exit 2 on gate violation, per-file report). Wired into /wrap Stage 3
   next to the em-dash scan.
D3 Skill updates:
   /hook  -> after Keith picks a hook: mint slug, create asset file
             (status hooked, funnel tag from the stamp, content_type asked
             as one question), create Drive folder via gws, link it.
   /script -> write script into the asset file body (status scripted),
             auto-create default renditions per mode. All 4 modes
             (short, long, linkedin, facebook). If the asset file doesn't
             exist (script run without hook), create it then.
   /compliance-preflight -> additionally stamp preflight result + date
             into the asset file when the target is an asset.
   NEW /content-status -> run scanner, render the board: pipeline by
             status, renditions by platform, TOFU/MOFU balance, stale
             assets (>14 days idle). Also handles spoken transitions
             ("ferritin's shot" -> recorded) with gate checks.
D4 Drive wiring: gws drive folder creation (Content/YYYY-MM/<slug>/...).
   Greenfield: verify gws drive subcommands, add the settings allow-entry.
   Fallback if gws drive is unusable: Google Drive MCP connector.
D5 ClickUp mirror: content-library-sync.ts in
   09_website-app/frontend/scripts/content-engine/, REUSING clickup.ts
   helpers + existing token. Creates the "Content Library" list once
   (plain statuses only), then upserts one task per asset. Runs in the
   daily content-engine.yml Action + on demand. One-way; git wins.
D6 Doc sweep (decision-sweep discipline): content-funnel-map.md (+
   content_type line in the markup), unified-content-calendar.md sections
   2/3 (name the asset files + Content Library list as the live tracker),
   sop-founder-short-form.md step 8, sop-weekly-run.md, sop-thumbnail.md
   (filenames), content-machine/CONTEXT.md + STATE.md, 06_marketing/STATE.md.
D7 Seed: create the Ep 0 baseline shoot as asset #1 (the real bottleneck),
   plus backfill the pillar-B dry-run derivative set as asset #2.

## Constraints
- Reuse: scan.js pattern, clickup.ts, gray-matter (already installed),
  content-engine.yml, gws CLI. No new tools, no bespoke app.
- Compliance: read 03_compliance/CONTEXT.md first; silent ingredient never
  named; no em dashes; inheritance gate per sop-compliance-route.md
  (claim-free derivative inherits sign-off; net-new claim -> Ewa).
- No auto-posting to platforms, ever. Keith presses go.
- Skills degrade gracefully: if Drive/ClickUp unreachable, write the
  pending action into the asset file and flag it; never fail generation.
- Durable rules -> CONTEXT.md; dated status -> STATE.md (bump dates).

## Success test
/hook ferritin -> pick hook 2 -> /script: yields one asset file with
populated frontmatter, a Drive folder, three default renditions; scanner
blocks "approved" until preflight green and blocks "scheduled" until the
9x16 thumb exists; "ferritin's shot" advances it; /content-status shows
the piece, its renditions, and the TOFU/MOFU balance; the ClickUp task
mirrors it within a day. Zero forms filled by hand.

---

_This git-first design supersedes the earlier ClickUp-first v1 plan on 2026-07-13: the ClickUp API cannot create the custom fields the tracker needs, its statuses are list-level (which breaks the parent/child rendition pipeline), and the gates are not API-enforceable, so git holds the truth and ClickUp is reduced to a read-only mirror._

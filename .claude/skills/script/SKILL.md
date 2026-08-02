---
name: script
description: >
  Generate a finished short-form video script (Reel / Short / TikTok) for an
  Andro Prime founder video from a phrase or topic. Use when Keith says
  "/script <topic>", "write me a short-form script for X", "turn the ferritin
  hook into a full script", or wants the whole 30-to-60-second script, not just
  the hook. Reads the Mark avatar, the hook playbook, the script playbook, and
  the compliance rails, then returns target emotion, compliant shock-facts, a
  chosen hook, a story-structured body written as shootable lines with visual
  and text cues, a soft CTA, and the four-check. It NEVER ships or posts, never
  invents bloodwork numbers, and refuses topics that need TRT, ashwagandha, or
  an unavailable marker. Every script is marked "pre-flight before use".
---

# /script — founder script generator (short-form and long-form)

Turn a phrase or topic into one finished, shootable script, in Andro Prime's format and inside the compliance rails. This is the body, not just the hook; for the hook alone use `/hook`.

The topic is whatever Keith typed after `/script` (for example: `ferritin`, `vitamin D`, `GP said normal`, `supplements not working`). If nothing was typed, ask him for one word and stop.

## Mode (detect from the argument)

- Contains **`linkedin`** → write a **LinkedIn founder post** (WRITTEN-POST branch at the bottom).
- Contains **`facebook`** → write a **Facebook informational post** (WRITTEN-POST branch at the bottom).
- Contains **`long`** → write a **long-form YouTube** script (LONG-FORM branch at the bottom).
- Otherwise → write a **short-form** video script (Reel / Short / TikTok) using Steps 3 to 4.

Loading files, mapping the topic, and refusing off-limits topics (Steps 1 to 2) are the same in every mode.

## Step 1 — Load the current craft (always, every run)

Read these four files fresh each time:

1. `andro-prime/06_marketing/content-machine/avatar-mark.md` — Mark, his dream outcome (certainty, not a cure), and his verbatim pain points (the shock-facts source).
2. `andro-prime/06_marketing/content-machine/hook-playbook.md` — the six archetypes, visual-first, dream-outcome-is-certainty, founder-reveal-held. (It points to `borrowed-hook-templates.md`, 43 pre-vetted proven hook structures you may adapt for the opener.)
3. `andro-prime/03_compliance/CONTEXT.md` — the red-flag table and the Phase 0 boundary. Guardrail #1; read before writing a word.
4. `andro-prime/02_brand/references/narrative-devices.md` — devices **1, 3, 6 and 7 only** (the spoken-native four; the corpus they came from is Keith talking, so they fit a spoken script better than they fit prose). Device 1 supplies the shape, device 3 supplies a visual when the topic has none, device 6 replaces exposition, device 7 handles the peak line. Devices 2, 4, 5, 8 and 9 are long-form; leave them in the articles. **Device 8 (flat close) does not apply to short-form**: keep the four-move arc's closing question to the viewer.

Then, by mode:

- **Short-form:** also read `andro-prime/06_marketing/content-machine/script-playbook.md` (the four blockers, compliant shock-facts, the four story structures, the emotion filter, the six-step write, the four-check).
- **Long-form:** also read `andro-prime/06_marketing/content-machine/long-form-script-playbook.md` (the five-step craft) **and** `andro-prime/06_marketing/content/youtube-founder-journey-strategy.md` (the authority: the two video lines, CTA routing, and the compliance rails, which win over the craft doc wherever they touch).
- **LinkedIn or Facebook:** also read `andro-prime/06_marketing/content-machine/written-post-playbook.md` (the two text-post formats) **and** `andro-prime/06_marketing/seo-ai-search/content-atomisation-model.md` (derivative discipline: inherit the canonical asset's claims, add none).

If any file is missing, say so and stop.

## Step 2 — Map the topic, or refuse it

Same rules as `/hook`:

- Map to a **currently-available marker** (testosterone Kit 1; Vitamin D, Active B12, hs-CRP, ferritin Kit 2; combined Kit 3). If it maps to a marker with no kit yet (thyroid, cortisol, metabolic, cholesterol), you may write but add: "content only — we do not test this yet; do not imply we do."
- **Refuse and redirect** anything needing a TRT promise, ashwagandha by name, or a libido angle beyond what CA-028 permits. One line on the block, then offer the nearest compliant angle. **Andropause / male-menopause is writable** (CA-028 approved 2026-07-26); flag that the finished asset still needs its own pre-flight and Ewa's sight before it ships.

## Step 3 — Build the script (follow the script-playbook six-step write)

**Two selection rules before you start writing.**

**Choose the structure on avatar fit, never on ease of clearance.** When more
than one structure is viable, state in one line what each asks the viewer to DO
with it, and reject any whose implicit ask is "go away and read this": Mark's
defining problem is an excess of unassessed reading, not a shortage of it
(`avatar-mark.md` §A "read enough to be dangerous and not enough to be sure",
and the Tier 2 interpretation gap). Consult the proof ladder in
`hook-rubric.md` §4 here, not only when scoring hooks: rung 1 beats rung 3
because people distrust third-party claims. **Compliance ease is a constraint on
an option, never a reason to prefer one.** If two structures both clear, the
choice is made on avatar fit and proof rung alone. Say which axis you ranked on.
(Observation 81: the safer structure was recommended because it needed no
clinical ruling, and Keith rejected it on exactly this ground.)

**Write TO the avatar, never AS him.** Any "I" in a hook or script belongs to
**Keith** and must be checkable against `author-bios.md` or a filed result. A
line that is true of Mark and false of Keith is a fabricated autobiography on a
trust-led health channel, and the existing gates catch invented numbers but not
invented experience. Discard, do not rescore. (Observation 82.)

Produce, in this order:

1. **Target emotion** (one, from the script playbook: default Surprise/curiosity or Recognition/relief; Vindication only aimed at the reference range; never Fear).
2. **Shock-facts** (three to five, each true AND compliant). Pull from the avatar pain points and real biomarker facts. Flag any that need a real number with `[your real <marker> number]`. No claims, no fabricated figures.
3. **Hook** (one, chosen via the hook-playbook logic: pick the archetype that fits the key visual, lead on the blood/kit/number, dream outcome = certainty, founder reveal held out of the hook).
4. **Story structure** (one of the four: Personal story, Problem-solver, Breakdown, Listicle) that best fits the topic and emotion. Name it.
4b. **The addiction loop** (script-playbook.md §3b), written out before the script itself. The four structures are shapes; this is the mechanism that actually holds attention, and skipping it is why a script can hit every other mark and still feel flat. State each beat in one line:
   - **Stakes:** the character, the thing at risk, the ticking clock. Personally relevant to Mark, never life-or-death.
   - **Big question:** the specific question loaded into his head. Vague teasers ("you won't believe what came back") fail, because with no prediction there is nothing for the reveal to break.
   - **Head fake:** what a normal viewer will predict, and the reveal that contrasts it. Must be unguessable in advance and obvious in hindsight; if it needs explaining, it is a cheap surprise and it does not work.
   - **Rehook:** the phrase that closes the loop and opens the next in one breath ("which would have been great, except…", "and that's when I realised…").
   At 30 to 60 seconds you get **one loop plus a rehook into the CTA**, not four. If the body carries three or more points, order them **second-best first, best second** (§3c).
5. **The script**, written as shootable lines: spoken words, **one** `[Visual: ...]` for frame 1, `[Text: ...]` wherever it helps the muted viewer (free, added in the edit), and delivery cues (`[Pause]`, `[Slower]`, `[Beat]`) through the body. A `[Visual: ...]` on every line is a B-roll order, not a script — see the production-reality note below. Keep it 30 to 60 seconds. Hold the founder reveal for the turn near the end. End on a **soft CTA** (send them to find out their own numbers / the quiz, never a hard sell, never a cure promise).

**Production reality: Keith shoots these alone, on a phone, in one take.** Per
`sops/sop-founder-short-form.md` step 4 the whole kit is a tripod, a lav mic and
window light. So write to what he can actually film:

- **Frame 1 is the only shot that must be a specific visual** (the blood, kit,
  dashboard or number, per hook-playbook §1, or a device-3 object when the topic
  has none). Everything after it can be him to camera.
- **`[Text: ...]` cues cost nothing** — they are added in the edit, not filmed.
  That is what serves the muted viewer, not extra footage.
- **Do not write a shot list.** A `[Visual: ...]` cue per line reads as a
  B-roll order for footage he has to go and shoot. One opening visual, one prop
  he can hold in frame, and delivery cues (`[Pause]`, `[Slower]`) instead.
- **In a talking-head take, the rupture in device 1 is a pause plus a drop in
  pace, not a cut.** Mark it as a delivery cue.

**The general rule behind all of the above (Observation 45): a generation skill
is bounded by whoever executes its output.** Name the executor and their
constraints, and shape the format around them. Mark each element by what it
costs the person who has to produce it: on-screen text is free (added in the
edit), a prop is cheap (already in the room), a cutaway is expensive (a separate
shoot). An output that ignores the executor's constraints is a wish list, and it
gets silently downgraded at production time by whoever is holding the phone.
Where an operating SOP already states the kit and the shooting reality, that SOP
is the binding constraint, not an aspiration.

Also stamp a **funnel tag** at the very top per `andro-prime/06_marketing/content-machine/content-funnel-map.md`. A short-form script is usually **TOFU (Attract)** (cta = quiz or follow, never a kit); a "which kit / how it works" script is BOFU. Set stage by the content's job, not the format.

Output shape:

```
Funnel: <TOFU|MOFU|BOFU|RETENTION> (<Attract|Capture|Convert|Retain>) | job: <short> | cta: <quiz|email-rung|kit-N|...> | format: short-video | marker: <marker>
Emotion: <one emotion>
Shock-facts: <3 to 5 bullets, real numbers flagged>
Hook (<archetype>): <the spoken hook + [Visual] + [Text]>
Structure: <which of the four>

SCRIPT
[0-3s]  <spoken>   [Visual: ...] [Text: ...]
[3-10s] <spoken>   [Visual: ...]
...
[turn]  <founder reveal>   [Visual: ...]
[CTA]   <soft CTA>   [Visual: ...]

Flags: <real numbers needed; founder disclosure; anything to watch>
```

Hold every rail from the playbooks: certainty not cure; no diagnose / treat / fix; real numbers only; no low-T inference from Kit 2; ashwagandha silent; single clear through-line; Peer / Storyteller voice, never Authority.

## Step 4 — Four-check and close

Run the four-check aloud in one line each: interesting to Mark? compressed? does the hook hook alone? is the end emotion the one I aimed for? Then close with: "Pre-flight this script with /compliance-preflight before filming or posting." Do not post, schedule, or mark approved. Offer to bank the hook into `hook-playbook.md` or generate a second structure for the same topic.

**The four-check's compliance clause is an ALLOWLIST of what the copy does. Never a list of what it avoids.** Write "framed as measurement, never as outcome; reports two figures that are Keith's genuine filed results; routes to the quiz" and stop. Do NOT write "no diagnose, treat, cure or fix": naming the banned terms puts every one of them back into a file the scanner then reads, so the pre-flight flags your own compliance note. This has recurred three times, once recursively (the note explaining the fix re-tripped the gate), and on 2026-07-31 nine of ten REVIEW hits across five assets were four-check lines this skill had just generated. `03_compliance/CONTEXT.md` states the rule for the silent ingredient; it applies to the whole red-flag table. (Observation 83.)

## Step 5 — Record it in the asset file (all four modes)

Every mode ends here: short-form, long-form, LinkedIn and Facebook. Once the script (or written post) is produced, persist it so the pipeline can track it. Read the schema first if you have not this run: `andro-prime/06_marketing/content-machine/templates/asset-file.md` and `andro-prime/06_marketing/content-machine/assets/README.md`.

**Two stores, and it matters which you write to.** The asset **file** takes identity and craft: slug, title, funnel block, channel, marker, canonical_asset, series, which renditions exist, and the hook and script in the body. The **database** takes state: `content_assets.status`, `preflight`, `drive_url`, and each rendition's own row. **Never write `status`, `preflight`, `drive` or a rendition `status` / `url` / `publish_date` into the frontmatter** (Phase 1, 2026-08-01): the scanner HARD-fails those keys as `[STATE]`, and they are the dual store this repo removed.

1. **Find or create the asset file.** Look in `andro-prime/06_marketing/content-machine/assets/` for a file whose slug matches this topic (`/hook` usually minted it already).
   - **If it exists:** write the finished script (or post) into its `## Script` section. Nothing else in the file changes.
   - **If none exists** (`/script` run without a prior `/hook`): create it from the template first, following the same rules as `/hook` Step 5: mint the immutable kebab-case slug, ask the one `content_type` question only if it is not obvious, stamp the funnel fields you set in Step 3, set `canonical_asset` (the Ewa-signed source article slug, or `none`), write the chosen hook into `## Chosen hook` and the script into `## Script`, and add `channel: linkedin|facebook` for the written-post modes (every live written-post asset carries this field).
   - **Then move the state, in the database.** Set `content_assets.status = 'scripted'` on the matching row, creating the row if the asset is brand new. Slug is the only join between the file and the row, so a file with no row is invisible to the board and `content-doctor` invariant 1 reports it. If you cannot write the row, say so plainly and leave the file alone rather than parking the status in frontmatter.
   - **The Drive folder branches by mode; this step is not mode-agnostic.** Short-form and long-form create `Content/YYYY-MM/<slug>/{raw,final,thumb}` via the gws CLI and write the resulting folder URL to `content_assets.drive_url` (graceful degradation: if Drive is unreachable leave `drive_url` null and add a `Flags:` line, never fail). **LinkedIn and Facebook create nothing and leave `drive_url` null**: a text post has no raw footage, no final cut and no thumbnail. (Observation 86: the step was written for the video path and never revisited when the text modes were added; when a skill gains a mode, re-read the steps that run in EVERY mode, because the new branch gets the attention and the shared path is where the bug lands.)

2. **Add the default renditions for this mode, in both places, and they are different halves.** In the file's `renditions:` block put only `platform`, `format` and `thumb`, which is which renditions EXIST. In `content_renditions` insert the matching row per rendition, `status = 'to-produce'`, `thumb_spec` equal to the file's `thumb`, no URL and no dates. **Adding the frontmatter entry does not create the row**: register both, or the two stores disagree about what exists. Fan-out by mode:

   | Mode | Renditions (platform / format / thumb) |
   | --- | --- |
   | Short-form | instagram / reel / 9x16 · youtube / short / 9x16 · tiktok / short / 9x16 |
   | Long-form | youtube / long-form / 1280x720 |
   | LinkedIn | linkedin / text-post / none |
   | Facebook | facebook / link-post / 1200x630 |

   Tell Keith the defaults were added and that he can drop any he will not run by saying so (e.g. "delete the tiktok rendition"); renditions can be deleted freely from both stores while every one is still `to-produce`. Once one is scheduled or later, leave it in place as the record.

3. **Scan the file.** Run the scanner and report its result verbatim:

   ```bash
   node .claude/skills/content-status/scan.js andro-prime/06_marketing/content-machine/assets/YYYY-MM-DD-<slug>.md
   ```

   **Exit 0 means the FILE is well formed, not that the piece may ship.** The scanner checks the identity/craft schema, YAML safety, that no database-owned key is in the frontmatter, and the compliance HARD table plus the em-dash rule over the body. It asserts nothing about approval or scheduling: those gates are in the database (`09_website-app/database/migrations/20260801_content_state_guards.sql`). Exit 2 is a HARD block to fix; exit 1 means it could not run, usually the wrong working directory, and it names the path it could not resolve.

Then tell Keith the asset file path, the renditions added, the row you wrote, and the scan result. Still no posting, scheduling, or approval here.

---

# LONG-FORM branch (when the argument contains `long`)

Write a 6-to-12-minute YouTube script instead of a short-form one. Follow `long-form-script-playbook.md` and defer to `youtube-founder-journey-strategy.md` wherever they touch. Steps 1 and 2 above (load files, map/refuse the topic) still apply.

**First, pick the line** (from the strategy doc) and say which:

- **Line 1, Explainer.** Atomised from a published, Ewa-signed blog asset. If a matching article exists, the script may only reshape its claims, never exceed them; if you are unsure which article covers the topic or whether one exists, say so and flag that the script must be checked against the Ewa-signed asset before use. Do not invent claims.
- **Line 2, Founder journey.** Keith's own kits, real numbers, real timeline. Respect the founder-testimonial limits: show data and journey, never assert a supplement caused a change; "how my levels changed", never "what fixed them".

**Then build the script in the five-step order:**

1. **Packaging:** the one-line idea (Mark's pain), a plain-English **title** set first (symptom language, marker is the answer not the hook, curiosity from a myth/number/question, never a cure or claim), and a loose thumbnail note.
2. **Outline:** a bulleted body outline with the uniqueness gate applied (Line 1 = the article's angle/distillation; Line 2 = the real journey). What / why / how per point.
3. **Intro (five parts):** immediate context (click-confirm) / common belief / contrarian take (aimed at the reference range, never the GP) / proof + plan.
4. **Body (2-1-3-4):** second-best point first, then best, then in order. Each point runs the value loop (context, application with example, framing) and re-hooks into the next.
5. **Outro (fortune cookie):** summarise, restate the "stop guessing" solve, high note.

Write it as a real script (spoken paragraphs with `[Visual: ...]` cues, not just bullets). Embed the CTA natively and route it per the strategy doc: cold viewers to the free email rung / quiz first, intent-match to the best live kit, never the FM list, founder + brand disclosure on screen, and the correct Ewa attribution line ("Based on our article [title], clinically reviewed by Dr Ewa Lindo, GMC #4758565" for a claim-free derivative).

Stamp a **funnel tag** at the very top per `content-funnel-map.md`. A Line-1 explainer is **MOFU (Capture)** (cta = email-rung); a Line-2 founder Ep 0 baseline is **TOFU (Attract)**; a "which kit" walkthrough is BOFU.

**Output shape (long-form):**

```
Funnel: <TOFU|MOFU|BOFU|RETENTION> (<Attract|Capture|Convert|Retain>) | job: <short> | cta: <email-rung|kit-N|...> | format: long-video | marker: <marker>
Line: <1 Explainer | 2 Founder journey>   Source article: <name or "none / flag">
Packaging:
  Idea:  <one line>
  Title: <plain-English title>
  Thumbnail: <loose note>
Outline: <the ordered body points, uniqueness-checked>

SCRIPT
[Intro]  <the five-part intro, written out, with [Visual] cues>
[Point 1 = 2nd best]  <value loop, written out>   [re-hook]
[Point 2 = best]      <value loop>                [re-hook]
[Point 3] ...
[Outro]  <fortune-cookie close>
[CTA]    <native embed + routing + disclosure + attribution line>

Flags: <real numbers needed (Ep 0); claim-inheritance check vs the Ewa article; net-new claim => needs Ewa sign-off; anything else>
```

Then run **Step 5** to record the script in its asset file (creating it if `/hook` did not), add the long-form YouTube rendition, and scan it.

Close with the long-form finish checklist and: "Pre-flight this script with /compliance-preflight, and confirm it against the Ewa-signed article, before filming or posting."

---

# WRITTEN-POST branch (when the argument contains `linkedin` or `facebook`)

Write a text post, not a video script. Follow `written-post-playbook.md`. Both are derivatives of the canonical Ewa-signed asset (or, for personal LinkedIn, Keith's own journey): inherit its claims, add none. Steps 1 and 2 (load files, map/refuse the topic) still apply. No em dashes. No engagement-bait CTAs.

**LinkedIn** (Keith's personal profile, founder-forward): line 1 is the hook (Contrarian or Personal story); a re-hook line; short paragraphs in Keith's voice with NO bullet lists; the founder reveal is welcome here; end on a genuine question; soft personal-to-brand CTA (link in first comment, routed to the quiz / email rung, never the FM list). **Write every link with the full `https://` scheme** (Keith, 2026-07-31): `https://andro-prime.com/blog/<slug>?utm_source=linkedin`, never the bare `andro-prime.com/...`, which LinkedIn does not reliably auto-link once a query string is attached and which can render as dead plain text with the UTM never firing. Emotion: recognition / vindication plus credibility. Funnel: usually TOFU or MOFU.

**Facebook** (brand page, older segment): a calm plain hook line (feeling-first, not punchy); a few informational paragraphs that stand on their own value (Teacher / Breakdown / Investigator); a soft in-post link to the router. Native upload reminder. Emotion: recognition / curiosity. Funnel: usually TOFU or MOFU.

Use the exact output shapes in `written-post-playbook.md` (LinkedIn shape or Facebook shape), stamping the funnel tag and the emotion, then writing the full post. Hold every compliance rail: certainty not cure; no diagnose / treat / fix; real numbers only (write `[your real <marker> number]`); Kit-scoped; ashwagandha silent; no TRT; no low-T inference from Kit 2; retest posts say "how my levels changed", never "what fixed them". If a matching Ewa-signed article does not exist or is still a draft, flag that the post must be checked against it before publishing.

Then run **Step 5** to record the post in its asset file (creating it if `/hook` did not), add the LinkedIn or Facebook rendition, and scan it.

Close with: "Pre-flight this post with /compliance-preflight before publishing."

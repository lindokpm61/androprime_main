---
name: hook
description: >
  Generate three short-form video hooks for an Andro Prime founder video from a
  phrase or topic. Use when Keith says "/hook <topic>", "give me hooks for X",
  "hook ideas for the vitamin D video", or wants opening lines for a Reel /
  Short / YouTube video. Reads the Mark avatar, the hook playbook, and the
  compliance rails, then returns three hooks in three different archetypes with
  spoken + text + visual + the single question. It NEVER ships or posts, never
  invents bloodwork numbers, and refuses topics that need TRT, ashwagandha, or
  an unavailable marker. Every hook is marked "pre-flight before use".
---

# /hook — founder hook generator

Turn a phrase or topic into three ready-to-shoot hooks, in Andro Prime's format and inside the compliance rails.

The topic is whatever Keith typed after `/hook` (for example: `always tired`, `vitamin D`, `GP said normal`, `supplements not working`). If nothing was typed, ask him for one word and stop.

## Step 1 — Load the current craft (always, every run)

Read these three files fresh each time so the output uses the latest thinking, never a stale copy:

1. `andro-prime/06_marketing/content-machine/avatar-mark.md` — who the hook is written to (Mark, 44), his dream outcome (certainty, not a cure), and his verbatim pain points.
2. `andro-prime/06_marketing/content-machine/hook-playbook.md` — the six archetypes, the visual-first rule, the desire-based framing, the seven-step write, and the rails.
2b. `andro-prime/06_marketing/content-machine/hook-rubric.md` — the hard gates, the six scored dimensions, the 9/12 threshold, the honesty constraint, and the proof ladder. **Every hook is scored against this before it is shown.**
3. `andro-prime/03_compliance/CONTEXT.md` — the claims rules, red-flag language, and the Phase 0 boundary. This is Guardrail #1; read it before writing a word.
4. `andro-prime/02_brand/references/narrative-devices.md` — devices **1, 3, 6 and 7 only** (the spoken-native four). They are techniques that stack on an archetype, never a seventh archetype. Device 3 is the §1 fallback when a topic has no blood, kit or number to open on. Devices 2, 4, 5, 8 and 9 are long-form; ignore them here. **Device 8 (flat close) does not apply**: shorts keep the closing question to the viewer.

Optional source: `andro-prime/06_marketing/content-machine/borrowed-hook-templates.md` holds 43 pre-vetted proven structures (mapped to our archetypes, compliance-reframed). You may adapt one as a starting structure, then fill it to Mark with a real-number placeholder. Not required; the six archetypes are enough on their own.

If any file is missing, say so and stop rather than guessing.

## Step 2 — Map the topic, or refuse it

- Map the topic to a **currently-available marker**: testosterone (Kit 1); Vitamin D, Active B12, hs-CRP, ferritin (Kit 2); or the combined panel (Kit 3).
- If the topic maps to a marker we do **not** yet sell a kit for (thyroid, cortisol, metabolic, cholesterol), you may still write hooks but must add a visible note: "content only — we do not test this yet; do not imply we do."
- **Refuse and redirect** if the topic requires:
  - a TRT promise or implication (redirect: the man's route is a test then a GP referral, never a TRT pitch);
  - ashwagandha by name (silent-ingredient rule, always);
  - a libido angle beyond what CA-028 permits. (**Andropause / male-menopause is no longer blocked**: CA-028 was approved 2026-07-26. Write it, then flag that the asset needs its own pre-flight and Ewa's sight before it ships.)
  Explain the block in one line and offer the nearest compliant angle instead.

## Step 3 — Write three hooks, three different archetypes

Pick three **different** archetypes from the playbook (Fortune Teller, Experimenter, Teacher, Magician, Investigator, Contrarian) so the set has range. Default toward Experimenter and Investigator, with Magician as a cold-open option; use Contrarian at most once and aim it at the reference range, never the profession.

Build each hook on the illusion-of-novelty spine (`hook-rubric.md`, `sources/kallaway-frameworks.md`):

1. **New reveal + outcome.** What is genuinely new here, and which outcome Mark wants does it attach to? The reveal makes him look; the outcome makes him stay. Dream outcome is **certainty, never a cure**.
2. **Contrast framing.** Name the specific thing Mark already believes, hold it constant, and put the new angle directly against it as a **true opposite**. An unrelated old belief creates confusion, not contrast. This is the same move as `tone-of-voice.md` Move 4.
3. **Urgency** only if a real time window exists. **Never bolt on a fake one**; it reads as selling and costs all trust.
4. **Proof rung** the script can actually deliver (`hook-rubric.md` §4). A hook may promise a rung; it may not claim one the script cannot reach.

For **each** of the three hooks, output exactly this shape:

```
Hook N — [Archetype] — [score]/12
  Spoken:   [1 to 3 short lines, fifth-grade vocabulary, active voice]
  Text:     [the on-screen text, 3 to 5 words, muted-legible, first two seconds]
  Visual:   [the key visual — the blood / kit / number, or a device-3 object; never just Keith's face]
  Question: [the single question this plants in the viewer's head]
  Score:    [N/12 — weakest dimension: <name>, because <one line>]
  Flags:    [e.g. "needs your real ferritin number"; "founder reveal comes after the hook"; or "none"]
```

### Grade before you show

Score every hook against `hook-rubric.md` **before** presenting it. Run the hard gates first (a gate failure is a discard, not a low score), then the six dimensions.

**Threshold is 9/12.** Anything below it is rewritten or dropped. **Never pad the set to three with a sub-threshold hook** — three is the target, not a quota. If only two clear the bar, hand over two and say why the third did not.

Hold every rail while writing:

- **Dream outcome = certainty / the answer, never a cure or symptom fix.** No diagnose, treat, or cure language.
- **Lead with the relatable tired man; the founder reveal is the turn, never in the hook.**
- **Real numbers only.** If a hook leans on a figure, do not invent one — write `[your real <marker> number]` and add the flag. (This is why Ep 0 comes first.)
- **Single subject, single question** per hook; spoken, text and visual all say the same one thing.
- Voice is Peer / Storyteller, never the Authority posture.

## Step 3b — Mode B: grade a hook Keith already wrote

Fires when Keith supplies a line instead of a topic: "grade this hook", "is this any good", "score this", or he just pastes a hook. **This is the highest-value mode and it needs no topic research.** Do not silently improve his line.

1. Run the **hard gates**. Report a gate failure as a gate failure, never as a low score.
2. Score all six dimensions with a one-line reason each.
3. Name the **weakest dimension** and what specifically is missing from it.
4. Offer **three rewrites**, each fixing that weakest dimension while keeping his intent and as much of his wording as possible.
5. Show the original, its score, and the alternatives side by side. He chooses; you do not.

## Step 4 — Stamp the funnel tag and close

Above the three hooks, add a one-line **funnel tag** per `andro-prime/06_marketing/content-machine/content-funnel-map.md`. Short-form hooks are almost always **TOFU (Attract)**: job = a problem-aware scroll-stop, cta = `follow` or at most `quiz`, never a kit. If the topic is genuinely a "which kit / how it works" ask, it is BOFU instead; tag it accordingly. Format:

`Funnel: TOFU (Attract) | job: problem-aware scroll-stop (<marker>) | cta: quiz | format: short-video`

Then end with: "Pre-flight each hook with /compliance-preflight before filming or posting." Do not post, schedule, or mark anything approved. If Keith asks for more, offer to run the same topic through the other archetypes or to bank the winners into `hook-playbook.md`.

## Step 5 — Mint the asset file (only once Keith picks a hook)

Generating three hooks creates nothing. The moment Keith replies with a choice (he picks one, or edits one into the version he wants), that one hook becomes an asset file. The other two are discarded.

Read the schema and template first: `andro-prime/06_marketing/content-machine/templates/asset-file.md` and `andro-prime/06_marketing/content-machine/assets/README.md`. Then:

1. **Mint the slug.** A short, immutable, lowercase kebab-case slug from the topic (e.g. `always-tired-ferritin`, not the whole spoken line). It is set once and never renamed: it names the file, the Drive folder and the ClickUp task. If a matching asset already exists in `assets/`, do not mint a second one; tell Keith and stop.

2. **Ask the one content_type question, only if it is not obvious.** If the topic makes the type clear from the four options (`educational`, `personal-story`, `proof-result`, `objection-comparison`), set it and say which you chose. If it is genuinely ambiguous, ask Keith exactly one question to pick from those four, then continue. Do not ask anything else.

3. **Create the file** at `andro-prime/06_marketing/content-machine/assets/YYYY-MM-DD-<slug>.md` (today's date) by copying the template blank, with:
   - `status: hooked`
   - `slug`, `title`, `content_type` set as above;
   - the funnel fields you already stamped in Step 4 (`funnel_stage`, `funnel_job`, `awareness`, `cta`, `marker`);
   - `canonical_asset:` the slug of the matching Ewa-signed article if you know one covers this topic, otherwise `none`. (`none` is not a free pass: the scanner will later require the Ewa route before this asset can reach `approved`.)
   - the chosen hook, spoken + on-screen text, written into the `## Chosen hook` section of the body. Leave `## Script` empty for `/script`.
   - **no renditions yet.** Delete the template's placeholder rendition so the `renditions:` block is empty; `/script` owns the default fan-out per mode. (Leaving the placeholder would double up when `/script` adds instagram/reel.)

4. **Create the Drive folder** `Content/YYYY-MM/<slug>/` with `raw`, `final` and `thumb` subfolders, and write the folder URL into `drive:`.
   - **Primary path — gws CLI** (business account `keith@andro-prime.com`). Create the root `Content` folder once, then reuse its id for every month/asset folder. Pattern (add `--dry-run` first to preview):

     ```bash
     gws drive files create --params '{"name":"<name>","mimeType":"application/vnd.google-apps.folder","parents":["<parent-id>"]}'
     ```

     Create in order: `Content` (root, id reused thereafter) → `YYYY-MM` (parent = Content id) → `<slug>` (parent = month id) → `raw`, `final`, `thumb` (parent = slug id). Put the `<slug>` folder URL in `drive:`.
     Known ids (created 2026-07-13, business Drive): root `Content` = `1og3i5RxjUW9RvL9qPvVBvRjedDMtwQAf`; `2026-07` = `1T9raTTszNKNRf8PEu5zIEivpU6RXFxuP`. Reuse these; only create a new month folder when the month changes.
     Gotchas (hard-won, do not relearn):
     - **Metadata goes in `--json` (request body), NOT `--params`** (query string only). `--params '{"name":...}'` silently creates a nameless "Untitled" file instead of a folder. Correct shape: `gws drive files create --json '{"name":"<name>","mimeType":"application/vnd.google-apps.folder","parents":["<parent-id>"]}' --params '{"fields":"id,name,mimeType"}'`.
     - **Always verify the response contains `vnd.google-apps.folder`** before using the id; a create can "succeed" and still be junk.
     - Call gws from the Bash tool, not PowerShell (PS 5.1 mangles the embedded JSON quotes).
     - If a call 403s right after a re-auth, delete `~/.config/gws/token_cache.json` (stale access token) and retry.
   - **Fallback — the claude.ai Google Drive connector.** It is authed to Keith's **personal** account, not the business account, so folders land in the wrong Drive. Warn Keith of that before using it and only proceed if he says so.

5. **Graceful degradation (never fail the generation).** If Drive is unreachable or `gws` is unauthenticated, do not error out and do not lose the asset. Set `drive: pending`, add a `Flags:` line to your reply naming what is owed (e.g. "Drive folder not created: gws unauthenticated; run once Drive is reachable"), and finish. The asset file is still created with everything else populated.

Then tell Keith the asset file path and the Drive folder (or the pending flag), and remind him the piece is at `hooked`: run `/script <slug>` next to write the body and fan out the platforms. Still no posting, scheduling, or approval here.

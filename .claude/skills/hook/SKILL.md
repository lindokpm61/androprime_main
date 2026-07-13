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
3. `andro-prime/03_compliance/CONTEXT.md` — the claims rules, red-flag language, and the Phase 0 boundary. This is Guardrail #1; read it before writing a word.

Optional source: `andro-prime/06_marketing/content-machine/borrowed-hook-templates.md` holds 43 pre-vetted proven structures (mapped to our archetypes, compliance-reframed). You may adapt one as a starting structure, then fill it to Mark with a real-number placeholder. Not required; the six archetypes are enough on their own.

If any file is missing, say so and stop rather than guessing.

## Step 2 — Map the topic, or refuse it

- Map the topic to a **currently-available marker**: testosterone (Kit 1); Vitamin D, Active B12, hs-CRP, ferritin (Kit 2); or the combined panel (Kit 3).
- If the topic maps to a marker we do **not** yet sell a kit for (thyroid, cortisol, metabolic, cholesterol), you may still write hooks but must add a visible note: "content only — we do not test this yet; do not imply we do."
- **Refuse and redirect** if the topic requires:
  - a TRT promise or implication (redirect: the man's route is a test then a GP referral, never a TRT pitch);
  - ashwagandha by name (silent-ingredient rule, always);
  - an andropause / libido angle (blocked until Ewa signs Pillar E).
  Explain the block in one line and offer the nearest compliant angle instead.

## Step 3 — Write three hooks, three different archetypes

Pick three **different** archetypes from the playbook (Fortune Teller, Experimenter, Teacher, Magician, Investigator, Contrarian) so the set has range. Default toward Experimenter and Investigator, with Magician as a cold-open option; use Contrarian at most once and aim it at the reference range, never the profession.

For **each** of the three hooks, output exactly this shape:

```
Hook N — [Archetype]
  Spoken:   [1 to 3 short lines, fifth-grade vocabulary, active voice]
  Text:     [the on-screen text, short, first two seconds]
  Visual:   [the key visual — default to the blood / kit / number, never just Keith's face]
  Question: [the single question this plants in the viewer's head]
  Flags:    [e.g. "needs your real ferritin number"; "founder reveal comes after the hook"; or "none"]
```

Hold every rail while writing:

- **Dream outcome = certainty / the answer, never a cure or symptom fix.** No diagnose, treat, or cure language.
- **Lead with the relatable tired man; the founder reveal is the turn, never in the hook.**
- **Real numbers only.** If a hook leans on a figure, do not invent one — write `[your real <marker> number]` and add the flag. (This is why Ep 0 comes first.)
- **Single subject, single question** per hook; spoken, text and visual all say the same one thing.
- Voice is Peer / Storyteller, never the Authority posture.

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
   - **Fallback — the claude.ai Google Drive connector.** It is authed to Keith's **personal** account, not the business account, so folders land in the wrong Drive. Warn Keith of that before using it and only proceed if he says so.

5. **Graceful degradation (never fail the generation).** If Drive is unreachable or `gws` is unauthenticated, do not error out and do not lose the asset. Set `drive: pending`, add a `Flags:` line to your reply naming what is owed (e.g. "Drive folder not created: gws unauthenticated; run once Drive is reachable"), and finish. The asset file is still created with everything else populated.

Then tell Keith the asset file path and the Drive folder (or the pending flag), and remind him the piece is at `hooked`: run `/script <slug>` next to write the body and fan out the platforms. Still no posting, scheduling, or approval here.

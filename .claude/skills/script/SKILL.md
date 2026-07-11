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

# /script — short-form founder script generator

Turn a phrase or topic into one finished, shootable short-form script, in Andro Prime's format and inside the compliance rails. This is the body, not just the hook; for the hook alone use `/hook`.

The topic is whatever Keith typed after `/script` (for example: `ferritin`, `vitamin D`, `GP said normal`, `supplements not working`). If nothing was typed, ask him for one word and stop.

## Step 1 — Load the current craft (always, every run)

Read these four files fresh each time:

1. `andro-prime/06_marketing/content-machine/avatar-mark.md` — Mark, his dream outcome (certainty, not a cure), and his verbatim pain points (the shock-facts source).
2. `andro-prime/06_marketing/content-machine/hook-playbook.md` — the six archetypes, visual-first, dream-outcome-is-certainty, founder-reveal-held.
3. `andro-prime/06_marketing/content-machine/script-playbook.md` — the four blockers, compliant shock-facts, the four story structures, the emotion filter, the six-step write, the four-check.
4. `andro-prime/03_compliance/CONTEXT.md` — the red-flag table and the Phase 0 boundary. Guardrail #1; read before writing a word.

If any file is missing, say so and stop.

## Step 2 — Map the topic, or refuse it

Same rules as `/hook`:

- Map to a **currently-available marker** (testosterone Kit 1; Vitamin D, Active B12, hs-CRP, ferritin Kit 2; combined Kit 3). If it maps to a marker with no kit yet (thyroid, cortisol, metabolic, cholesterol), you may write but add: "content only — we do not test this yet; do not imply we do."
- **Refuse and redirect** anything needing a TRT promise, ashwagandha by name, or an andropause / libido angle (Pillar E, unsigned). One line on the block, then offer the nearest compliant angle.

## Step 3 — Build the script (follow the script-playbook six-step write)

Produce, in this order:

1. **Target emotion** (one, from the script playbook: default Surprise/curiosity or Recognition/relief; Vindication only aimed at the reference range; never Fear).
2. **Shock-facts** (three to five, each true AND compliant). Pull from the avatar pain points and real biomarker facts. Flag any that need a real number with `[your real <marker> number]`. No claims, no fabricated figures.
3. **Hook** (one, chosen via the hook-playbook logic: pick the archetype that fits the key visual, lead on the blood/kit/number, dream outcome = certainty, founder reveal held out of the hook).
4. **Story structure** (one of the four: Personal story, Problem-solver, Breakdown, Listicle) that best fits the topic and emotion. Name it.
5. **The script**, written as shootable lines. Each line is spoken words plus a bracketed `[Visual: ...]` and, where useful, `[Text: ...]` cue. Keep it 30 to 60 seconds. Hold the founder reveal for the turn near the end. End on a **soft CTA** (send them to find out their own numbers / the quiz, never a hard sell, never a cure promise).

Output shape:

```
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


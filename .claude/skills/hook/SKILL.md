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


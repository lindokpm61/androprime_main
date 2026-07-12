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

Then, by mode:

- **Short-form:** also read `andro-prime/06_marketing/content-machine/script-playbook.md` (the four blockers, compliant shock-facts, the four story structures, the emotion filter, the six-step write, the four-check).
- **Long-form:** also read `andro-prime/06_marketing/content-machine/long-form-script-playbook.md` (the five-step craft) **and** `andro-prime/06_marketing/content/youtube-founder-journey-strategy.md` (the authority: the two video lines, CTA routing, and the compliance rails, which win over the craft doc wherever they touch).
- **LinkedIn or Facebook:** also read `andro-prime/06_marketing/content-machine/written-post-playbook.md` (the two text-post formats) **and** `andro-prime/06_marketing/seo-ai-search/content-atomisation-model.md` (derivative discipline: inherit the canonical asset's claims, add none).

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

Close with the long-form finish checklist and: "Pre-flight this script with /compliance-preflight, and confirm it against the Ewa-signed article, before filming or posting."

---

# WRITTEN-POST branch (when the argument contains `linkedin` or `facebook`)

Write a text post, not a video script. Follow `written-post-playbook.md`. Both are derivatives of the canonical Ewa-signed asset (or, for personal LinkedIn, Keith's own journey): inherit its claims, add none. Steps 1 and 2 (load files, map/refuse the topic) still apply. No em dashes. No engagement-bait CTAs.

**LinkedIn** (Keith's personal profile, founder-forward): line 1 is the hook (Contrarian or Personal story); a re-hook line; short paragraphs in Keith's voice with NO bullet lists; the founder reveal is welcome here; end on a genuine question; soft personal-to-brand CTA (link in first comment, routed to the quiz / email rung, never the FM list). Emotion: recognition / vindication plus credibility. Funnel: usually TOFU or MOFU.

**Facebook** (brand page, older segment): a calm plain hook line (feeling-first, not punchy); a few informational paragraphs that stand on their own value (Teacher / Breakdown / Investigator); a soft in-post link to the router. Native upload reminder. Emotion: recognition / curiosity. Funnel: usually TOFU or MOFU.

Use the exact output shapes in `written-post-playbook.md` (LinkedIn shape or Facebook shape), stamping the funnel tag and the emotion, then writing the full post. Hold every compliance rail: certainty not cure; no diagnose / treat / fix; real numbers only (write `[your real <marker> number]`); Kit-scoped; ashwagandha silent; no TRT; no low-T inference from Kit 2; retest posts say "how my levels changed", never "what fixed them". If a matching Ewa-signed article does not exist or is still a draft, flag that the post must be checked against it before publishing.

Close with: "Pre-flight this post with /compliance-preflight before publishing."


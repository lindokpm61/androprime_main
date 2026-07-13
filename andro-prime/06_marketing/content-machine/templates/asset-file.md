# Template: Asset File (one content idea, hook to measured)

**Owner:** Keith Antony | **Status:** Schema v2, 2026-07-13 | **Read first:** `../CONTEXT.md`, `../content-library-build-spec.md`, `../content-funnel-map.md`

One asset file is one founder content idea. Frontmatter is the tracker; the body holds the chosen hook and the script. Copy the blank below to `../assets/YYYY-MM-DD-<slug>.md`. In practice `/hook` mints this file and `/script` fills the body: you rarely hand-edit frontmatter.

---

## Blank frontmatter (every field, allowed values inline)

```yaml
---
slug: <kebab-case, minted at /hook time; also the Drive folder + ClickUp task name>
title: <working title, plain English>
status: idea            # idea | hooked | scripted | recorded | edited | approved | done
content_type: educational   # educational | personal-story | proof-result | objection-comparison
funnel_stage: TOFU      # TOFU | MOFU | BOFU | RETENTION
funnel_job: <short phrase, e.g. "problem-aware scroll-stop (ferritin / fatigue)">
awareness: problem-aware    # unaware | problem-aware | solution-aware | product-aware | customer | advocate
cta: quiz               # follow | quiz | email-rung | kit-1 | kit-2 | kit-3 | retest | referral
marker: ferritin        # ferritin | vitamin-d | b12 | hs-crp | testosterone | none
preflight: not-run      # not-run | green | amber-ewa | red
preflight_date:         # YYYY-MM-DD, set when preflight runs
ewa_task:               # ClickUp URL, only when preflight is amber-ewa or a net-new claim
canonical_asset: none   # slug of the Ewa-signed article it inherits from, or "none"
drive:                  # Google Drive folder URL (Content/YYYY-MM/<slug>/)
series: none            # e.g. "Read Your Blood" | none
renditions:
  - platform: instagram # instagram | youtube | tiktok | facebook | linkedin
    format: reel        # reel | short | long-form | link-post | text-post
    thumb: 9x16         # 9x16 | 1280x720 | 1200x630 | none
    status: to-produce  # to-produce | thumbnail-done | scheduled | published | measured
    url:                # published URL, once live
    publish_date:       # YYYY-MM-DD, once scheduled/published
---
```

## Body skeleton

```markdown
## Chosen hook

<the single hook Keith picked, spoken + on-screen text>

## Script

<the shootable script: lines with visual and text cues, the soft CTA, the four-check>
```

---

## Rules

- **Slug is immutable once minted.** It names the file, the Drive folder, and the ClickUp task. Do not rename it after `/hook` sets it; retire the asset instead.
- **Status only moves via the gates.** The scanner (`.claude/skills/content-status/scan.js`) hard-blocks invalid transitions: no `scripted` without a script in the body, no `approved` without preflight green (or amber-ewa with the Ewa task closed) plus a canonical asset, no `scheduled` rendition without its thumbnail. Never edit `status` past a gate by hand.
- **Renditions are added or deleted freely while every one is still `to-produce`.** The default fan-out (below) is a starting point: delete the platforms you will not run before anything is scheduled. Once a rendition is `scheduled` or later, leave it in place as the record.
- **The funnel block follows `content-funnel-map.md`.** TOFU never carries a kit CTA; per-rendition `format` lives on the rendition, not the top-level block.
- **Compliance is non-negotiable.** No em dashes anywhere; the silent ingredient is never named; markers must map to a live kit. Body copy runs through the preflight before `approved`.

---

## Worked example: `2026-07-13-always-tired-ferritin.md`

```yaml
---
slug: always-tired-ferritin
title: Always tired, and the marker nobody checked
status: scripted
content_type: personal-story
funnel_stage: TOFU
funnel_job: problem-aware scroll-stop (ferritin / fatigue)
awareness: problem-aware
cta: quiz
marker: ferritin
preflight: not-run
preflight_date:
ewa_task:
canonical_asset: why-am-i-always-tired
drive: https://drive.google.com/drive/folders/CONTENT-2026-07-always-tired-ferritin
series: Read Your Blood
renditions:
  - platform: instagram
    format: reel
    thumb: 9x16
    status: to-produce
    url:
    publish_date:
  - platform: youtube
    format: short
    thumb: 9x16
    status: to-produce
    url:
    publish_date:
  - platform: tiktok
    format: short
    thumb: 9x16
    status: to-produce
    url:
    publish_date:
---
```

## Chosen hook

Spoken: "I was tired for a year before anyone checked the one thing that explained it."
On-screen text (frame 1, muted-legible): "Tired for a year. Nobody checked this."

## Script

> I told my GP I was exhausted. Sleeping fine, training the same, still flat by 2pm.
>
> Bloods came back. "All normal."
>
> So I read them myself. One marker sat right at the bottom of the range: ferritin. It is the protein that stores your iron, the tank your body draws on.
>
> Mine was nearly empty.
>
> That does not tell you why, and it is not a diagnosis. It is a signal, and the why is a conversation with your GP, not a supplement order.
>
> A flat year can feel like getting older. Sometimes it is a number you have never been shown.
>
> What did your last blood test actually check?
>
> Education, not medical advice. Find out what your blood says. Link below.

*Four-check: feeling-first; shows Keith's own reading without asserting a supplement fixed anything; hedges signal-not-cause and routes to the GP; no diagnose/treat/cure; marker is live-kit; no FM CTA; no em dashes; the silent ingredient is not named.*

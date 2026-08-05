---
slug: one-load-five-places
title: You do not have five problems. You have one load.
content_type: educational
funnel_stage: TOFU
funnel_job: problem-aware explainer for the older segment (stress as a full-body event), route to the email rung
awareness: problem-aware
cta: email-rung
channel: facebook
marker: none
canonical_asset: signs-of-stress-in-men
series: none
renditions:
  - platform: facebook
    format: link-post
    thumb: 1200x630
---

## Chosen hook

Calm plain opener, feeling-first rather than punchy, per the Facebook format. Lifted almost intact from the hub, because the hub already found the plainest way to say it:

"Most men do not have five separate problems. They have one load, showing up in five places."

## Script

**Funnel:** TOFU (Attract) | job: problem-aware explainer for the older segment (stress as a full-body event) | cta: email-rung | format: facebook-post | marker: none
**Emotion:** Recognition. The relief of one explanation replacing five.
**Source:** `signs-of-stress-in-men` (published 2026-06-30, Ewa-signed).

POST

> Most men do not have five separate problems. They have one load, showing up in five places.
>
> A gut that will not settle. Sleep that breaks at three in the morning. Breakouts in your worst weeks. Tension headaches, and shoulders somewhere up around your ears. Each one tends to get booked in on its own: a gut test for the first, a tracker for the second, paracetamol for the fourth.
>
> The thread running through all of them is the same. When your brain reads a threat it floods you with adrenaline and cortisol. Heart rate up, muscles tense, senses sharp. For a genuine short-term threat that is a brilliant piece of engineering. The trouble is that your brain runs the identical programme for a deadline, a mortgage or a difficult boss, and it does not switch off at six in the evening.
>
> Cortisol does one more thing worth knowing. It quietly stands down whatever the body decides is not urgent in a crisis: digestion, sleep, skin repair, sex drive. Useful for an afternoon. Not for a year.
>
> One thing before any of the rest, because the order matters more than anything else here. Sudden or severe chest pain, pain spreading to your arm, neck, jaw or back, or chest pain that comes with breathlessness, sweating or feeling sick, means call 999 now. Do not talk yourself out of it, and do not assume it is stress. Heart first, every time. Stress second.
>
> The reason this gets missed in men is not complicated. Most of us do not file any of it under stress. We file it under busy. Five symptoms, five separate errands, and the actual driver, a nervous system that has not stood down in months, never gets named once.
>
> You cannot always cut the source. You can turn the response down. A screen-free half hour and a fixed wake time. A twenty-minute walk outside in daylight, not a workout, a walk. A few minutes of slow breathing with the out-breath longer than the in-breath. Less of the caffeine and the alcohol that both wind the response tighter while feeling like the opposite. One boundary at work, just the one.
>
> And the honest part. Stress does not show up cleanly on a single blood test, so there is no stress check being sold to you here. We do not measure cortisol. What a long stretch of running hot does reach is the things you can watch over time, which is what having a baseline is actually for.
>
> If you want the plain-English guides as they publish, and word when a stress panel lands, that is what the list is for: https://andro-prime.com/waitlist?utm_source=facebook

## Craft notes

- **Archetype:** Breakdown, one of the three Facebook homes in `written-post-playbook.md`. The post's whole value is the reframe from five problems to one, which is a structural argument rather than a list.
- **Structure chosen on avatar fit, and that is the axis it was ranked on.** The alternative was the symptom tour, walking gut, chest, sleep, skin and tension in turn as the hub does. Rejected: on Facebook that reads as another symptom list, and this reader has already booked the gut test. The chosen shape puts the reframe first and uses the symptoms as recognition underneath it, so the post's payload arrives in line one rather than in paragraph six. Both clear compliance identically, so avatar fit was the only live axis.
- **The 999 line is carried in full and kept in the hub's own order.** The hub says "Read this part first" and puts the heart before the stress reading, for the obvious reason. A derivative that mentioned chest tightness and dropped that would be materially less safe than its source. It sits mid-post rather than at the top only because the post does not lead on the chest symptom at all; every mention of the chest is downstream of it.
- **Device 7, understatement at the peak:** "Useful for an afternoon. Not for a year." Straight from the hub, and still the shortest thing in the post.
- **This is the one pick this week with no live kit behind it, and the copy says so out loud.** The hub is explicit that cortisol is not measured, and the post repeats it rather than going quiet on it. `content-queue.md` holds this pillar at email capture until a cortisol-carrying kit exists, and `kitCTA.ts` encodes the same routing (`stress` maps to `/waitlist`, `kit: null`).
- **`marker: none` is accurate rather than a gap.** There is no biomarker in this piece, which is the point of it.
- **No personal history, no bloodwork figure, nothing written as Mark.** The only first-person voice is the brand plural the Facebook page speaks in.
- **The destination is the general waitlist, not the founding-member list.** Verified against `lib/content/kitCTA.ts`: the `stress` pillar routes to `/waitlist`, which is a different route from `/founding-member`. Content never routes to the founding-member list.

## Claim inheritance check

Every claim traces to `signs-of-stress-in-men` (published 2026-06-30, Ewa-signed).

| Post line | Source line |
| --- | --- |
| You do not have five problems, you have one load showing up in five places | "You don't have five problems. You have one load, showing up in five places." |
| Gut that will not settle, sleep breaking at three, breakouts, tension headaches, shoulders up around your ears | "a churning gut", "wide awake at 3am", "Spots in your worst weeks", "Tension headaches. Shoulders up around your ears." |
| Each gets booked in on its own: a gut test, a tracker, paracetamol | "The gut gets a test. The sleep gets a sleep tracker. The headaches get paracetamol." |
| The brain floods you with adrenaline and cortisol; heart rate up, muscles tense, senses sharp | "it floods you with adrenaline and cortisol, the stress hormones. Heart rate up. Muscles tense. Senses sharp." |
| The same programme runs for a deadline, a mortgage or a difficult boss, and does not switch off at six | "your brain runs the same programme for a deadline, a mortgage, or a difficult boss. And it doesn't switch off at 6pm (Mayo Clinic)." |
| Cortisol stands down digestion, sleep, skin repair, sex drive | "it quietly shuts down the systems your body decides aren't urgent in a crisis: digestion, sleep, skin repair, sex drive." |
| Useful for an afternoon, not for a year | "Useful for an afternoon. Not for a year." |
| Sudden or severe chest pain, spreading to arm, neck, jaw or back, or with breathlessness, sweating or nausea, means call 999 now | "means call 999 now. Don't talk yourself out of it. Don't assume it's stress." (NHS, Chest pain) |
| Heart first, stress second | "The order matters though. Heart first. Stress second." |
| Men file it under busy rather than under stress | "Most men don't file any of this under stress. They file it under busy." |
| The driver, a nervous system that has not stood down in months, never gets named | "the actual driver, a nervous system that hasn't stood down in months, never gets named." |
| Screen-free half hour and a fixed wake time; a twenty-minute walk outside, not a workout; slow breathing, out longer than in; less caffeine and alcohol; one boundary at work | The five bullets under "What to lower the load this week", verbatim in substance |
| Stress does not show up cleanly on one blood test, and we do not measure cortisol | "Stress itself doesn't show up cleanly on one blood test. So this isn't a pitch for a stress test." and "We don't test cortisol, so there's no stress check to sell you today." |
| A long stretch of running hot reaches things you can watch over time, which is what a baseline is for | "a long stretch of running hot touches things you can measure over time… The kind of thing worth having a baseline for" |

No claim added. Nothing here exceeds the hub.

## Rails held

Written as an allowlist of what the copy does, never a list of what it avoids (Observation 83).

The post stays on the education side throughout. It describes a physiological response in plain English, quotes the hub's mechanism paragraph, and offers five behavioural levers already published in the signed article. It carries the hub's emergency line in full and in the hub's own priority order, sending the chest symptom to 999 before any stress reading is offered. It states plainly that no cortisol measurement is sold and that a single blood test does not capture this, which keeps a pillar with no live kit behind it at email capture, as `content-queue.md` and `kitCTA.ts` both require. It names no ingredient, so the EFSA tables are not in play. No figure and no personal result appears. The single CTA is a soft in-post link to the general waitlist, verified in code as a different destination from the founding-member list. No em dashes, no bullet lists in the post body, no engagement bait.

## Gates still open

- **Pre-flight:** not yet run as an owner action. `/compliance-preflight` is the next step and it stamps `content_assets.preflight`, not this file.
- **Thumbnail:** owed, 1200x630. The rendition cannot be scheduled without it.
- **Worth Ewa's eye even though nothing is net-new.** The post carries an emergency-escalation instruction. It is quoted from her signed article and unchanged, so it inherits cleanly and this is not a blocker, but a line that tells a reader when to call 999 is the kind of line worth a second pair of clinical eyes on its own.
- **Keith's read.** Not approved, not scheduled, not posted.

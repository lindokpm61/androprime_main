# Spine B Content Queue

**Owner:** Keith Antony | **Status:** v1, 2026-07-28 | **Read first:** `CONTEXT.md`, `unified-content-calendar.md`

The standing backlog of **founder / social** content ideas, in priority order. This is the input `/content-week` pulls from so the weekly run never starts from a blank page.

**This is a queue of angles, not drafts.** A row here is a decided topic with its canonical source, funnel tag and CTA already resolved. `/content-week` turns rows into scripts and posts; it does not decide what to make. Drafting state lives in the asset file (`assets/`), never here.

**Spine A (the blog) has its own queue** in `seo-ai-search/content-calendar.md`. Do not duplicate blog rows here. This queue covers only what the blog cannot: LinkedIn, Facebook, Substack, short-form video and YouTube.

---

## The two lanes

The machine produced nothing for its first three weeks because every path ran through Keith holding a camera. It now runs two lanes, and **Lane 1 never waits for Lane 2**.

| | **Lane 1: no camera** | **Lane 2: camera** |
|---|---|---|
| **Surfaces** | LinkedIn, Facebook, Substack | Reels / Shorts / TikTok, YouTube long-form |
| **Needs** | a published, Ewa-signed article to atomise from | Keith, a tripod, a booked filming session |
| **Cadence** | **every week, unconditionally** | batched into a filming day, only when one is booked |
| **Blocked by** | nothing currently | Ep 0 baseline shoot (`C-01`) |
| **Rule** | ships regardless of Lane 2's state | may slip a week; must never hold Lane 1 |

If Lane 2 has no filming day booked, `/content-week` runs Lane 1 alone and says so. That is a normal week, not a failure.

---

## How a row moves

```
queued ──► taken (a /content-week run claimed it) ──► asset file exists ──► done (published) ──► archived here
```

- `/content-week` marks a row **taken** and writes the asset-file slug into the row.
- Once the rendition is `published` in the asset file, mark the row **done**. Git wins on any disagreement; this queue is the plan, the asset file is the state.
- **Never edit a row's status to skip a gate.** The compliance route and the gate scanner are upstream of this file.

## Guardrails carried on every pick

- **Wellness floor ~40%.** Interleave a wellness pillar (A Vitamin D · B Fatigue/brain fog · Omega-3) for roughly every clinical-curious one. Marked `[W]` below; count them.
- **TRT stays ~0%.** Phase 0 boundary, not a sign-off question.
- **Andropause is writable but not yet atomisable.** CA-028 is approved, so the language exists, but the Pillar E hub is still in Ewa's review queue and **no derivative may run ahead of its published canonical article**. See Blocked, below.
- **Every hook maps to a live-kit marker,** or it routes to email capture instead of a kit. No cortisol / thyroid / metabolic / liver kit promotion until those kits launch.
- **No derivative exceeds its canonical asset's claims.** Rows with `canonical: none` are claim-free founder / positioning posts and get extra pre-flight attention, not a pass.

---

## Lane 1: no camera (ships weekly)

### LinkedIn (Keith's personal profile, founder-forward, ends on a question)

| ID | Angle | Canonical article | Pillar | Funnel | CTA | Status |
|---|---|---|---|---|---|---|
| L-01 | Normal on paper, flat in real life: why the reference range never answered my question | `myth-of-normal-range` | C | TOFU | quiz | queued |
| L-02 | Your GP tested three things. There were four worth seeing. | `why-am-i-always-tired` | B `[W]` | MOFU | quiz | **done** 2026-07-28, asset `2026-07-28-four-worth-seeing`, published `7487916942582964226` |
| L-03 | The tiredness sleep doesn't fix | `why-am-i-always-tired` | B `[W]` | TOFU | quiz | queued |
| L-04 | I stopped calling it brain fog and started asking what it actually was | `brain-fog` | B `[W]` | TOFU | quiz | queued |
| L-05 | What a UK winter does to your vitamin D that no diet fixes | `low-vitamin-d-symptoms` | A `[W]` | TOFU | quiz | queued |
| L-06 | Iron isn't only an anaemia question: why a normal full blood count can still miss it | `ferritin-blood-test` | D | MOFU | kit-2 | queued |
| L-07 | Total B12 can read fine while active B12 doesn't | `b12-blood-test` | D | MOFU | kit-2 | queued |
| L-08 | Nobody sells you the test you don't need. That is the whole problem. (conflict-free = money honesty, never an industry attack) | none (positioning, claim-free) | n/a | TOFU | quiz | queued |
| L-09 | Inflammation is the word everyone uses and almost nobody measures | `inflammatory-markers-blood-test` | G | MOFU | kit-2 | queued |
| L-10 | The testosterone number your GP probably didn't measure | `free-androgen-index` | C | MOFU | kit-1 | queued |

### Facebook (brand page, older segment, calm and informational)

| ID | Angle | Canonical article | Pillar | Funnel | CTA | Status |
|---|---|---|---|---|---|---|
| F-01 | What a full blood count tells you, and what it doesn't | `fbc-blood-test` | D | MOFU | kit-2 | queued |
| F-02 | Reading your own results: what the columns on the page actually mean | `how-to-read-blood-test-results` | D | MOFU | quiz | queued |
| F-03 | Signs of low vitamin D that most men put down to age | `14-signs-of-vitamin-d-deficiency` | A `[W]` | TOFU | quiz | queued |
| F-04 | Stress shows up in the body before it shows up in your mood | `signs-of-stress-in-men` | stress | TOFU | email-rung | queued |
| F-05 | What a liver function test measures, in plain English | `liver-function-blood-test` | liver | MOFU | email-rung | queued |
| F-06 | Cholesterol: the number most men never get told about | `cholesterol-test` | metabolic | MOFU | email-rung | queued |
| F-07 | Thyroid: what TSH, T4 and T3 are each doing | `thyroid-test` | thyroid | MOFU | email-rung | queued |
| F-08 | CRP: the marker that says something is going on without saying what | `crp-blood-test` | D | MOFU | kit-2 | queued |

### X (@keithantonyAP, one a day, batched weekly)

**Plan: `x-channel-plan.md`. Not running until Keith signs off the reply habit** (§10 decision 1), because a daily post without it reaches nobody.

Rows here are **weeks, not posts.** One row produces seven posts from one article, following the rotation in the plan §5 (marker fact, normal-vs-optimal, founder line, link-out, myth correction, open question, Sunday thread). Drafted into one file and pre-flighted as a batch, which is the whole reason the cadence is affordable.

Articles are picked from the atomisation grid, preferring ones with no derivatives at all. All seven below currently have none, so each week also moves the coverage number.

| ID | Week of | Source article | Pillar | Why this one |
| --- | --- | --- | --- | --- |
| X-01 | week 1 | `myth-of-normal-range` | C | **TAKEN** 2026-07-29, batch `drafts/x-week-2026-08-03.md`, 7 posts drafted, pre-flight clean (0 HARD / 0 REVIEW), awaiting Keith's read. |
| X-02 | week 2 | `low-vitamin-d-symptoms` `[W]` | A | Wellness floor, and a UK winter angle nobody argues with. |
| X-03 | week 3 | `why-am-i-always-tired` `[W]` | B | The broadest pain point in the avatar. Already carries LinkedIn and Substack derivatives, so the voice is proven. |
| X-04 | week 4 | `ferritin-blood-test` | D | "The tank, not the tap" is a genuinely good short-form idea and it has never been used anywhere. |
| X-05 | week 5 | `crp-blood-test` | D | Inflammation is the word everyone uses and almost nobody measures. |
| X-06 | week 6 | `b12-blood-test` `[W]` | D | Total vs active is the same shape as the normal-vs-optimal wedge, which is the account's signature by this point. |
| X-07 | week 7 | `free-androgen-index` | C | Kit 1 marker, and the article the return post already inherits from. |

**Refill rule:** when this drops below three weeks, add rows from the atomisation grid, still preferring articles at zero coverage. Thirteen of the seventeen qualify today.

### Substack (~1/week, republish only)

**CORRECTED 2026-07-28. This lane was never blocked, and it is already running.** The rows below previously said the publication did not exist. It does: `keithandroprime.substack.com`, "Keith Antony · Andro Prime", tagline "UK men's health, read from your blood", 8 subscriptions. **Four issues are already live**, the earliest since 18 July, discovered by reading the public archive endpoint. Everything is now tracked in `content_renditions` with `platform='substack'`.

**No writing needed.** All 17 published articles were already pushed as Substack drafts on 2026-07-27 (`substack-draft.ts`). The weekly job is: pick one, `/compliance-preflight` it, Keith publishes. Republish-safe rule applies (published + Ewa-signed + canonical back-link).

| ID | Issue | Status |
|---|---|---|
| S-00 | Welcome issue: "Normal on paper, flat in real life. Start here." | **DONE**, live 2026-07-18. Asset `substack-welcome-normal-on-paper`. Pre-flight **re-run green 2026-07-30** (the original was dated the day after publication). Only issue that does not inherit clearance from a signed article; `ewa_task` still empty. |
| S-01 | Free Androgen Index (republish) | **RETRACTED 2026-07-30.** Was live 2026-07-26 to 2026-07-30; deleted from Substack by Keith on Ewa's instruction. Carried the overturned FAI framing under her byline. Asset `preflight: red`, rendition back to `to-produce`. **Blocked on** the corrected article going live (ClickUp `869ebf36k`), then rewrite from the corrected copy, pre-flight as an issue, republish. |
| S-02 | How to Read Your Blood Test Results (republish) | **DONE**, live 2026-07-27. Pre-flight **green 2026-07-30**. |
| S-03 | Signs Your Body Is Under Stress (republish) | **DONE**, live 2026-07-27. Pre-flight **green 2026-07-30**. CTA holds at email capture, no cortisol kit. |
| S-04 | Next republish: pick a wellness pillar `[W]` from the 14 remaining drafts | queued |

**Pre-flight debt PAID 2026-07-30.** All four live bodies were fetched and scanned rather than assumed: **0 HARD, 1 REVIEW, 0 em dashes** across the set (the REVIEW is «cures» inside "no miracle cures", a negation, benign). Three passed and stay live; the FAI issue was retracted for a reason the scanner cannot see, namely that it carried Ewa's review byline on copy contradicting her own threshold ruling. Detail in `STATE.md` (2026-07-30).

**Still owed, and it is the mechanism not the content:** `substack-draft.ts` states publishing is gated on `/compliance-preflight` passing on the assembled issue, but publishing happens by hand in the Substack UI where nothing can enforce it, which is exactly how three issues shipped unchecked. A `--verify` mode that stamps the pre-flight onto the asset before a publish counts as legitimate would close it.

---

## Lane 2: camera (batched; needs a booked filming day)

**C-01 comes first and gates the founder series.** The before-state is unrecoverable once Keith's numbers move, so nothing else in this lane should be filmed ahead of it.

| ID | Angle | Format | Canonical | Pillar | Funnel | CTA | Status |
|---|---|---|---|---|---|---|---|
| C-01 | Ep 0 baseline: Keith's own numbers on camera, before anything changes | long + short pull | none (founder journey) | C | TOFU | follow | **asset exists** (`2026-07-13-ep-0-baseline`, `idea`) |
| C-02 | The stack: constant tiredness usually isn't one big thing | short | `why-am-i-always-tired` | B `[W]` | TOFU | quiz | **asset exists, scripted, stale 19d** |
| C-03 | When a test earns its place: the four markers worth seeing | short | `why-am-i-always-tired` | B `[W]` | MOFU | kit-2 | **asset exists, scripted, stale 19d** |
| C-04 | "Within range" is not the same as "optimal for you" | short | `myth-of-normal-range` | C | TOFU | quiz | queued |
| C-05 | Why your vitamin D reading in February means something different | short | `low-vitamin-d-symptoms` | A `[W]` | TOFU | quiz | queued |
| C-06 | Brain fog: three things it usually turns out to be | short | `brain-fog` | B `[W]` | TOFU | quiz | queued |
| C-07 | Ferritin: the tank, not the tap | short | `ferritin-blood-test` | D | MOFU | kit-2 | queued |
| C-08 | Active vs total B12, in thirty seconds | short | `b12-blood-test` | D | MOFU | kit-2 | queued |
| C-09 | hs-CRP: what a low-grade signal actually looks like | short | `crp-blood-test` | G | MOFU | kit-2 | queued |
| C-10 | The free androgen index, and why total testosterone alone misleads | short | `free-androgen-index` | C | MOFU | kit-1 | queued |
| C-11 | Long-form: why am I always tired (Line 1 explainer) | long | `why-am-i-always-tired` | B `[W]` | MOFU | email-rung | queued |
| C-12 | Long-form: what "normal testosterone for your age" really means (Line 1) | long | `myth-of-normal-range` | C | MOFU | email-rung | queued |
| C-13 | Long-form: what a blood panel worth paying for actually covers (Line 1) | long | `how-to-read-blood-test-results` | D | MOFU | email-rung | queued |
| C-14 | Ep 1: first retest checkpoint, how my levels changed (never "what fixed them") | long | none (founder journey) | C | RETENTION | follow | **blocked** on C-01 + a real retest window |

---

## Blocked / parked (do not pick)

- **Pillar E, andropause / male menopause.** CA-028 approved 2026-07-26, so the language is cleared, but the hub article is still in Ewa's review queue. **A derivative cannot outrun its canonical asset.** The moment the hub publishes, add a LinkedIn, a Facebook and two shorts against it: it is the largest shelf in the 2026-07-26 frustration plan (~12-15k/mo) and should not sit at zero out of habit.
- **Instagram comment-to-DM.** Behind the ManyChat sub-processor sign-off (`03_compliance`) and the Instagram launch.
- **Shelf 2 (competitor / "is X legit" comparison content).** ~2.5-3.5k/mo, no compliance gate, genuinely winnable, but it is a **blog** play first: it needs a canonical comparison article before any social derivative exists. Route to `seo-ai-search`, not here.
- **Cortisol, thyroid, metabolic, liver as kit promotion.** Content is fine; the CTA holds at email capture until those kits are live.

## Refill rule

When Lane 1 drops below **8 queued rows**, refill it before the next weekly run. Sources, in order: newly published blog articles (each one is worth ~1 LinkedIn + ~1 Facebook + 1 Substack republish), the frustration-cluster shelves, and the `avatar-mark.md` §C pain points that no asset has covered yet. Refilling is a `/content-week` step, not a separate job.

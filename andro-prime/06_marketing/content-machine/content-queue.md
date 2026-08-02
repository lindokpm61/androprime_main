# Spine B Content Queue

**Owner:** Keith Antony | **Status:** v1, 2026-07-28 | **Read first:** `CONTEXT.md`, `unified-content-calendar.md`

The standing backlog of **founder / social** content ideas, in priority order. This is the input `/content-week` pulls from so the weekly run never starts from a blank page.

**This is a queue of angles, not drafts.** A row here is a decided topic with its canonical source, funnel tag and CTA already resolved. `/content-week` turns rows into scripts and posts; it does not decide what to make. The drafted copy lives in the asset file (`assets/`) and its state lives in `content_assets`, never here.

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
queued ──► taken (a /content-week run claimed it) ──► asset registered (file + row) ──► done (published) ──► archived here
```

- `/content-week` marks a row **taken** and writes the slug into the row. The slug is the join: it names the asset file, the `content_assets` row, the Drive folder and the ClickUp task.
- Once the rendition is `published` in `content_renditions`, mark the row **done**. **This queue is the plan; the database is the state** (changed 2026-08-01, Phase 1: it used to be the asset file, and "git wins" used to be the tie-break). A row here is a note about intent and never evidence that anything shipped.
- **Never edit a row's status to skip a gate.** The compliance route is upstream of this file, and the gates themselves are in the database (`20260801_content_state_guards.sql`), where a row cannot be marked past them from here at all. `scan.js` no longer holds them: since 2026-08-01 it checks the file's schema and refuses a database-owned key in frontmatter.

## Guardrails carried on every pick

- **Wellness floor ~40%.** Interleave a wellness pillar (A Vitamin D · B Fatigue/brain fog · Omega-3) for roughly every clinical-curious one. Marked `[W]` below; count them.
- **TRT stays ~0%.** Phase 0 boundary, not a sign-off question.
- **Andropause is writable AND now atomisable.** CA-028 is approved and the Pillar E hub `andropause-male-menopause` published 2026-07-30, so the canonical asset exists and derivatives may run against it. It is the largest shelf in the 2026-07-26 frustration plan (~12 to 15k/mo). **As of 2026-07-31 it has four drafted derivatives** (`looking-for-a-word` LinkedIn, `nothing-to-buy-for-it` Facebook, `handbrake-half-on` and `what-time-was-it-taken` shorts). Each one still needs its own pre-flight plus Ewa's own sight before it ships. Their current pre-flight and status are `content_assets` columns, so read them there or from `/content-status`, not from the asset files: quoting them here would put a fourth copy of a moving fact in a doc nobody updates.
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

### X (@KeithAndroPrime, one a day, batched weekly)

**Plan: `x-channel-plan.md`. LIVE since 2026-07-29.** Keith signed off the reply habit (§10 decision 1), which is the condition this channel runs on: a daily post without it reaches nobody.

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

**Refill rule:** when this drops below three weeks, add rows from the atomisation grid, still preferring articles at zero coverage. **Thirteen of the eighteen qualify today** (corrected 2026-07-31: the denominator is 18 published per `blog_articles`, not 17; `andropause-male-menopause` is the 18th and has 4 drafted derivatives, so it no longer qualifies as zero-coverage).

### Substack (~1/week, republish only)

**CORRECTED 2026-07-28. This lane was never blocked, and it is already running.** The rows below previously said the publication did not exist. It does: `keithandroprime.substack.com`, "Keith Antony · Andro Prime", tagline "UK men's health, read from your blood", 8 subscriptions. **Four issues are already live**, the earliest since 18 July, discovered by reading the public archive endpoint. Everything is now tracked in `content_renditions` with `platform='substack'`.

**No writing needed for 17 of the 18.** All 17 articles published as at 2026-07-27 were pushed as Substack drafts that day (`substack-draft.ts`). **`andropause-male-menopause` published 2026-07-30 and has NO Substack draft**, so it is the one that still needs a push before it can enter this rota. The weekly job is: pick one, `/compliance-preflight` it, Keith publishes. Republish-safe rule applies (published + Ewa-signed + canonical back-link).

| ID | Issue | Status |
|---|---|---|
| S-00 | Welcome issue: "Normal on paper, flat in real life. Start here." | **DONE**, live 2026-07-18. Asset `substack-welcome-normal-on-paper`. Pre-flight **re-run green 2026-07-30** (the original was dated the day after publication). Only issue that does not inherit clearance from a signed article; `ewa_task` still empty. |
| S-01 | Free Androgen Index (republish) | **RETRACTED 2026-07-30**, and now **UNBLOCKED**. Was live 2026-07-26 to 2026-07-30; deleted from Substack by Keith on Ewa's instruction. Carried the overturned FAI framing under her byline. Asset `preflight: red`, rendition back to `to-produce`. The corrected article went live on the 07:00 UTC tick, so the rewrite can proceed: `substack-draft.ts --slug free-androgen-index`, pre-flight the assembled issue, Keith publishes. **Note the title changed** to "Free Androgen Index: what your number means, and the figure UK labs use instead". |
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

- ~~**Pillar E, andropause / male menopause.**~~ **UNBLOCKED 2026-07-30 and moved out of this list.** CA-028 cleared the language on 2026-07-26 and the hub published 2026-07-30, so the canonical asset now exists. The queued action stands and is now live work: **add a LinkedIn, a Facebook and two shorts against the hub.** It is the largest shelf in the 2026-07-26 frustration plan (~12-15k/mo). **DRAFTED 2026-07-31:** all four exist (`looking-for-a-word`, `nothing-to-buy-for-it`, `handbrake-half-on`, `what-time-was-it-taken`), scanner-clean at 0 HARD / 0 REVIEW, zero net-new claims. The shelf is no longer at zero. Remaining gate: per-asset pre-flight as an owner action, plus Ewa's own sight, before any of the four ships.
- **Instagram comment-to-DM.** Behind the ManyChat sub-processor sign-off (`03_compliance`) and the Instagram launch.
- **Shelf 2 (competitor / "is X legit" comparison content).** ~2.5-3.5k/mo, no compliance gate, genuinely winnable, but it is a **blog** play first: it needs a canonical comparison article before any social derivative exists. Route to `seo-ai-search`, not here.
- **Cortisol, thyroid, metabolic, liver as kit promotion.** Content is fine; the CTA holds at email capture until those kits are live.

## Refill rule

When Lane 1 drops below **8 queued rows**, refill it before the next weekly run. Sources, in order: newly published blog articles (each one is worth ~1 LinkedIn + ~1 Facebook + 1 Substack republish), the frustration-cluster shelves, and the `avatar-mark.md` §C pain points that no asset has covered yet. Refilling is a `/content-week` step, not a separate job.

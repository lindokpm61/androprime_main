# Content Atomisation Model

**Created:** 2026-05-31 | **Owner:** Keith | **Status:** Operating spec for the content engine named co-primary in [phase0-gtm-v4.md](../master-plan/phase0-gtm-v4.md) §6. This is the *how*: how one symptom pillar becomes a blog post + YouTube + short-form social + email + affiliate kit, who produces each, how claims stay compliant, and how CTAs redirect as products launch.

**Operationalised by → `../content-machine/`** (the cross-channel calendar, SOPs, founder-brand production, and thumbnail templates that run this spec). This doc stays the canonical atomisation spec; the machine references it, it does not replace it.

> **The principle: create once, atomise everywhere.** Each symptom pillar produces **one canonical asset** (the blog hub/spoke), compliance-checked and Ewa-signed once. Every other channel output is a *derivative* of that canonical asset — it may reshape and shorten, but it **may not introduce a claim the canonical asset doesn't already make**. This is what keeps a multi-channel engine both efficient and compliant.

---

## 1. The atomisation unit

The unit of work is a **symptom pillar** (a cluster of how men actually search a problem — e.g. "always tired", "brain fog", "belly fat", "low-T symptoms"), not a product or a single keyword. Pillars come from `keywords.csv` + `discovery-symptom-first.md` + `portfolio-demand-gap-map.md`; the validated set is in memory `project_seo_pillar_rebalance`.

Each pillar has:
- **One canonical asset** — the blog hub (and its spokes), the long-form source of truth. Produced via the `/article` skill from an approved brief in `article-briefs/`. Carries the claims, the citations, the Ewa review, the schema.
- **N derivatives** — YouTube, short-form social, email, affiliate kit, GEO markup — atomised *from* the canonical asset.

---

## 2. The atomisation map (one pillar → all channels)

| Output | Derived from | Format | Primary segment | Platform | CTA target |
|---|---|---|---|---|---|
| **Blog hub + spokes** (canonical) | brief → `/article` | Long-form MDX, hub-and-spoke | Older (search/intent) | Canonical site `/blog` | Central CTA component (§4) |
| **YouTube long-form** | canonical asset | 8-12 min explainer, Keith-presented | **Older** | YouTube (organic) | Description CTA → router |
| **YouTube / social short** | canonical asset | 30-60s, Ewa-twin or Keith | Both | Shorts / Reels / TikTok | Pinned/bio link → router |
| **Short-form social (discovery)** | canonical asset | Reel / carousel / hook | **Younger** | Instagram, TikTok | Bio/link sticker → router |
| **Facebook (informational/community)** | canonical asset | Post / explainer / group seed | **Older** | Facebook | In-post link → router |
| **Email nurture** | canonical asset | Sequence hook + body | Both | Customer.io | In-email kit CTA (never FM list) |
| **Affiliate content kit** | canonical asset + hook library | Pre-cleared Reel scripts, captions, carousels | Younger (PT-distributed) | PT/influencer feeds | Affiliate code → LP variant |
| **GEO / AI-citation (Pillar F)** | canonical asset | Schema, Q&A blocks, citable claims | n/a | LLM answer engines | Brand + canonical URL |

**Segment rule of thumb:** long-form + search + Facebook = older; short-form discovery = younger; email + affiliate kit = both. Same claims everywhere; different shape and platform.

---

## 3. Compliance — checked once, inherited everywhere (Guardrail #1)

Symptom-based health content, especially short-form posted by affiliates, is the **highest-ASA-risk surface** the brand has (complaints land on Andro Prime, not the PT). The canonical-asset model is the control:

1. **Compliance pre-flight + Ewa sign-off happen on the canonical asset only.** Run the `compliance-preflight` skill; read `/03_compliance/CONTEXT.md` first (non-negotiable).
2. **Derivatives may not add claims.** A Reel or email may compress and rephrase but cannot state anything the signed canonical asset doesn't. New claim → back to the canonical asset for re-clearance.
3. **The affiliate content kit is built from a pre-cleared symptom-hook library** (Ewa-signed) so PTs never improvise. Briefed in writing before code issuance.
4. **Hard rules carried into every derivative:** no diagnostic/treat/cure language; no TRT-as-available; **no ashwagandha, ever**; EFSA-only supplement claims; `02_brand/prohibited-terms.md` + no em dashes in customer copy; informational vs product claim thresholds (when in doubt, stricter).
5. **FM-list rule:** content CTAs route to Kit 1/3/3 Plus (or email capture), **never the FM list** (`feedback_fm_list_not_in_content`).
6. **Pillar E (andropause umbrella) is GATED** — highest-leverage narrative but ASA/Ewa-blocked; do not produce its canonical asset until Ewa signs.

---

## 4. CTA routing — build content now, redirect later (GTM decision b)

The mechanism that lets content start now and redirect to Kit 3 Plus / Liver as they launch, without rewrites:

- **Content is evergreen and topic-based**, never hard-wired to a kit. The body explains the symptom/marker; only the CTA target changes when the product does.
- **All CTAs route through one central component/config** (a single `kitCTA` map keyed by pillar → current target). Redirecting a pillar is a one-line config change, not a per-article edit. **Built 2026-07-09:** the map is `09_website-app/frontend/lib/content/kitCTA.ts`, consumed by `components/marketing/InlineKitCTA.tsx` via a `pillar` prop, guarded by `scripts/test-kit-cta.ts` (in `npm test`). The table below is the source of truth; the code mirrors it. **Migration outstanding:** the nine live articles still pass an explicit `ctaHref` and do not yet follow the map (see `09_website-app/STATE.md`).
- **Intent-match to the best *live* product.** Send "liver function test" intent to a liver product, not a hormone kit. Where no live product exists, route to **email capture/waitlist** and hold.
- **Redirect schedule** follows Kit 3 Plus / Liver / Kit 5 launch dates (Keith's timeline).

### Pillar → product routing (current)

| Pillar (symptom framing) | Best live target NOW | Redirect to when live | Segment lean |
|---|---|---|---|
| **G — Inflammation / CRP** | Kit 2 (carries hs-CRP) | **Kit 3 Plus** | Both |
| **D — Markers explained / CRP** | Kit 2 | Kit 3 Plus | Older |
| **A — Vitamin D** ("low vit-D symptoms") | Kit 2 + Daily Stack (D3) | — | Both, lean older |
| **B — Fatigue / energy** ("always tired", "brain fog") | Kit 2 (B12, ferritin, Vit D, CRP) | + Kit 5 (thyroid) | Both |
| **C — Testosterone** ("low-T symptoms") | Kit 1 | — | Both |
| **Belly / visceral fat** (metabolic hook) | **Email capture** (no live match) | **Kit 3 Plus** | Both |
| **Liver** ("liver function test") | **Email capture** (no live match) | **Liver kit** | Older |
| **Thyroid** ("private thyroid test") | **Email capture** | **Kit 5** | Both |
| **E — Andropause / male menopause** | **GATED — do not produce until Ewa signs** | Kit 1 | Older |
| **F — Patient-owned-data / GEO** | (citation layer across all assets) | — | n/a |
| **Programmatic — cities / comparison** | matched kit per page | — | Both |

---

## 5. Production workflow

1. **Select pillar** from the sequenced queue (§6). Confirm SERP underserved-ness (`phrase_organic` check) before briefing — process rule from `project_seo_pillar_rebalance`.
2. **Brief** → `article-briefs/` (coverage map, keywords, target, CTA target). Inherits hub Section 19 decisions (`feedback_lean_spoke_briefs`).
3. **Produce canonical asset** → `/article` skill (voice pass, source verification, MDX, schema, OG image, author byline).
4. **Compliance pre-flight + Ewa sign-off** on the canonical asset (§3).
5. **Atomise** → derivatives per §2 (YouTube script, shorts, carousels, email hook, affiliate kit). No new claims.
6. **Route** → set the pillar's CTA target in the central config (§4).
7. **Distribute** → blog publish, YouTube upload, social schedule, affiliate kit released, email sequence wired (`cio-sequence-build`).
8. **Measure** → §7; feed the v4 KPI framework.

Roles: Keith (on-camera, founder voice, final call); `/article` skill (canonical drafting); Ewa (clinical sign-off + twin scripts); `compliance-preflight` (gate); Customer.io (`cio-sequence-build`) for email.

---

## 6. Sequencing (which pillars first)

Inherit the locked SEO sequence (`project_seo_pillar_rebalance`): **G inflammation (biggest underserved) → A vit D + A.1 spoke → D markers/CRP → B fatigue → C testosterone.** Andropause (E) slots in **when Ewa clears it** (highest-leverage, so prioritise the sign-off). Belly-fat/metabolic and liver canonical assets can be produced now against **email capture**, then redirected when Kit 3 Plus / Liver launch.

The 5 existing articles (G hub, A hub, A.1 spoke, D hub, C spoke) are already drafted, Ewa-blanket-approved, and promoted to `content/blog/` — they are the **first canonical assets to atomise**. Atomisation of these into YouTube/social/email/affiliate-kit is the immediate next production work.

---

## 7. Measurement (per output, feeding v4 §11)

- **Canonical (blog):** rankings on the pillar's underserved cluster, organic sessions, content → email → kit conversion, AI-citation count (Pillar F).
- **YouTube:** views, retention, subscribers, click-through to router.
- **Short-form social:** reach, saves/shares (discovery proxy), link taps.
- **Email:** list growth from the entry rung, nurture → kit conversion.
- **Affiliate kit:** adoption (% of PTs posting), code-attributed sales.

Hard dependency: **GA4 + consent** (not connected; `project_ga4_planned`) — without it, content → email → kit attribution is impossible. Prerequisite for the whole measurement layer.

---

## 8. Cross-references

- Strategy frame: [phase0-gtm-v4.md](../master-plan/phase0-gtm-v4.md) (§6 content spine, §8 routing, §3 ICP)
- Decisions log: [2026-05-31-gtm-v4-strategy-reframe.md](../master-plan/2026-05-31-gtm-v4-strategy-reframe.md)
- Demand inputs: `portfolio-demand-gap-map.md`, `discovery-symptom-first.md`, `keywords.csv`, `keyword-clusters.md`
- Production system: `coverage-rules.md`, `article-briefs/`, the `/article` skill, `blog-ai-seo-strategy.md`
- Compliance: `/03_compliance/CONTEXT.md`, `02_brand/prohibited-terms.md`, the `compliance-preflight` skill
- Next to build: cold-to-warm bridge (lead-magnet/quiz spec + content-subscriber nurture); owned YouTube strategy; owned organic social strategy; affiliate symptom content kit; symptom-hook library (Ewa-gated)

---

*Compiled 2026-05-31. The operating layer beneath the v4 GTM. Carries the option-(b) routing and the canonical-asset compliance model.*

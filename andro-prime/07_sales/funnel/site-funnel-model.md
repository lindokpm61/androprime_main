# Site + Funnel Working Model (current conflict-free strategy)

**Created:** 2026-07-25 | **Owner:** Keith | **Status:** PROPOSED working model. One live change needs Keith's ratification before build: the homepage hero routing (Section 5). Everything else documents what is already shipped or already agreed.

**Why this exists:** the prior funnel docs (`kit-purchase.md`, the Track A landing spec) were written before the conflict-free positioning (2026-07-22) shipped, and they treat the site as one funnel. It is not. The homepage and the paid-search landing pages have different audiences and different jobs, so they route differently. This doc is the reconciled model that both the build and the copy align to. It supersedes the routing assumptions in `kit-purchase.md` (which stays valid for the post-checkout half).

---

## 1. The strategy in one line

Conflict-free positioning (`01_strategy/2026-07-22-conflict-free-positioning-decision.md`): (1) any result that needs a doctor goes to a GP and earns us nothing; (2) no result changes what we offer or what it costs. Copy hierarchy (rail 2): speed/no-GP hook earns the click, money honesty second. The sharp industry line ("no reason to sell you testosterone") is press/GEO only, never on-site hero.

The model below is how the site delivers that position AND the two numbers the strategy needs: routed AOV (Kit 3 default-up) and a willingness-to-pay read to settle bundle pricing.

---

## 2. Surface roles (the core reframe: each surface has one job)

| Surface | Who lands here | The one job | Primary route | Conflict-free surfacing |
| --- | --- | --- | --- | --- |
| **Homepage `/`** | Broad, brand, and undecided traffic | Establish the position and route the undecided | **Quiz** (primary), Browse all tests (secondary) | Full B1 speed hero + the money-honesty subline (live) |
| **Landing pages `lp/*`** | Hot, single-intent paid-search traffic | Convert at the lowest CAC, zero added friction | **Direct to on-page checkout** (`#order`) | Intent-matched hero + one conflict-free receipt line; NO quiz |
| **Quiz `/test-selector`** | Symptom-led and undecided (from homepage, short-form, blog) | Route to the right kit AND capture WTP + buyer-profile | Result → kit page → checkout | Position strip; the WTP block (Section 4) |
| **`/kits` + kit pages** | Comparison and considered buyers | Convert | Kit page → checkout | Per-kit D+ receipt (CA-026) |
| **Blog / organic** | Top-of-funnel education | Feed the quiz or a kit page | Quiz (primary) or kit page | Article CTAs |
| **Short-form (Track A)** | Cold discovery | Drive to the quiz | Link-in-bio / DM → quiz | Symptom hooks; conflict-free stays the press/GEO line |

The reframe that resolves the mismatch: **broad/undecided traffic is routed through the quiz; hot single-intent traffic goes direct.** The homepage serves the first; the landing pages serve the second. They are not the same funnel and should not share a hero strategy.

---

## 3. Routing model

```text
BROAD / SYMPTOM / BRAND  ─────────────►  ROUTE THROUGH THE QUIZ
  Short-form (Track A) → link-in-bio / DM → quiz
  Homepage hero        → quiz            (PROPOSED change, Section 5)
  Blog / organic       → quiz (or kit page)
        │
        ▼
  QUIZ  ·  3 symptom questions → recommended kit (name + why, NO price yet)
        │
        ▼
  ★ WTP + buyer-profile block  (un-priced, non-gating)      ← the new element
        │
        ▼
  price reveal + CTA → /kits/[slug] → checkout → Stripe

HOT / SINGLE-INTENT PAID SEARCH  ─────►  GO DIRECT (bypass quiz)
  Paid search ("testosterone test") → lp/testosterone → #order → checkout → Stripe
```

Rationale: the quiz is the router for people who do not know which kit they need. Forcing it on someone who searched a specific test and is ready to buy adds friction and raises CAC, so the `lp/* → checkout` bypass is deliberate and correct. This matches `kit-purchase.md`'s own "the quiz is the primary router but not the only door."

---

## 4. The quiz as the strategic hinge

The quiz does two jobs, and the second is why the routing matters.

**Job 1: router (built).** `components/marketing/TestSelectorQuiz.tsx`: 3 symptom questions map to Kit 1 / Kit 2 / Kit 3, with Kit 3 as the default-up on genuine two-panel overlap. Result routes to the kit page, not straight to checkout. This behaviour already matches the spec; keep it.

**Job 2: the price-validation and buyer-profile capture (to build, ClickUp `869e74w93`).** The Van Westendorp WTP block is the *only* planned source for validating the £169 / £199 / £259 bundle and kit price points (flagged load-bearing in `01_strategy/ltv-cac-profitability-model-2026-07-21.md`, read at n roughly 50). It is not built yet.

Placement inside the quiz flow, in this order:

1. The 3 symptom questions.
2. The recommended kit shown by name and reason, **price hidden**.
3. **The WTP + buyer-profile block**: the four Van Westendorp price-perception questions plus a short buyer-profile set. Framed as "two quick questions so we price this fairly for men like you." Soft and optional; it never blocks the kit CTA.
4. Price reveal + CTA to the kit page.

Two rules for the block:

- **Un-anchored.** Ask WTP before the customer sees our price. If the priced result card shows first, their answers just echo our number and the read is worthless.
- **Non-gating.** Same pattern as the existing optional email capture: the result and the buy path show regardless of whether they answer.

Because the quiz is the sole WTP source, it only produces the read if enough traffic reaches it, which is the whole reason the homepage hero change (Section 5) is load-bearing, not cosmetic.

**Bundle alignment:** the WTP block validates bundle prices, but bundles are dark behind `BUNDLES_ENABLED` and the quiz currently recommends single kits. Decide before build: either the quiz result surfaces the matching bundle (Recheck / Prove-It / Full-picture) when the flag flips, or the WTP block tests kit and bundle price points explicitly.

---

## 5. Build vs model: what needs to change

| Item | Current build | Model | Owner / gate |
| --- | --- | --- | --- |
| **Homepage hero primary CTA** | Link to `/kits` (catalogue); quiz is a mid-page text link | **Primary CTA = quiz**; "Browse all tests" secondary | **Keith ratify** (only live change here) |
| WTP + buyer-profile block | Not built | Build into the quiz per Section 4 | Dev; ClickUp `869e74w93` |
| Landing pages `lp/*` | Hero → `#order` direct checkout | Unchanged (correct); add one conflict-free receipt line if missing | Copy check |
| Track A landing spec | Parallel spec, not cross-referenced to `lp/*` | Reconcile to the live `lp/*` pages + this model | Marketing |
| seq-06 Quiz Nurture | Built, DRAFT, not activated | Activate as the quiz email follow-up | Ewa sign-off, then flip |
| `kit-purchase.md` | Pre-strategy routing assumptions | Point its acquisition half to this doc; keep its post-checkout half | Housekeeping |

---

## 6. The desired results this produces (tie to the strategy)

- **Routed AOV.** Undecided traffic through the quiz gets the Kit 3 default-up, lifting average order value the way the Tier-2 plan assumes.
- **The pricing read.** Quiz volume at n roughly 50 gives the Van Westendorp WTP data that unblocks the £169 / £199 / £259 reprice decision (a Gate 0B / bundle-launch input). No other source is planned.
- **Position where it belongs.** The conflict-free position leads on the brand surfaces (homepage, quiz, kit pages) and stays low-friction on the hot-intent surfaces (paid-search LPs), so the money-honesty beat builds trust without taxing conversion.
- **Clean measurement.** Broad traffic is instrumented through one router (the quiz); hot traffic converts on intent-matched LPs. The two paths are separable in analytics rather than blurred.

---

## 7. Source-of-truth pointers

- Positioning: `01_strategy/2026-07-22-conflict-free-positioning-decision.md` + CA-026 wording pack `02_brand/2026-07-22-conflict-free-wording-pack.md`.
- Post-checkout funnel: `07_sales/funnel/kit-purchase.md` (valid from checkout onward).
- Quiz build: `09_website-app/frontend/components/marketing/TestSelectorQuiz.tsx` + `app/(marketing)/test-selector/`.
- Landing pages: `09_website-app/frontend/app/lp/*`.
- WTP intent: ClickUp `869e74w93`; `01_strategy/ltv-cac-profitability-model-2026-07-21.md`.
- Short-form path: `06_marketing/content/track-a-launch-copy.md`.

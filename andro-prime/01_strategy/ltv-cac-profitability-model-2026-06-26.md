# LTV:CAC Profitability Model — Kit + Subscription

**Created:** 2026-06-26 | **Owner:** Keith | **Status:** Working unit-economics model. Answers "does the business make money, and at what subscription base value?" Built on this session's findings + the V7.2 financials. Cross-ref: [non-regulated-tier-v72-financials.md](../04_products/catalogue/non-regulated-tier-v72-financials.md), [Tier 2 plan](../06_marketing/master-plan/2026-06-26-tier2-sales-creation-plan.md).

> **Read the verdict first:** cold paid acquisition does **not** pay back even at best-case retention. Owned and affiliate acquisition always do. The subscription price (£34.95 vs £39.95) is a second-order lever; **attach rate and tenure are first-order** and decide whether the business is profitable. Everything below is the arithmetic for that.

## Inputs (with provenance)

**Kit gross profit** (direct sale, after 2.5% Stripe; affiliate is frozen so we use direct, not blended):
- Kit 1 £38 · **Kit 2 £53 (base case — the dominant, feeling-aligned kit)** · Kit 3 £77. Source: V7.2 financials §2.1.

**Subscription monthly contribution** (price − 2.5% Stripe − COGS; COGS £10 midpoint, range £8–12 pending stock-first quotes):
- At **£34.95** → ~**£24/mo** · At **£39.95** → ~**£29/mo**.

**Attach rate** (% of kit buyers who start a subscription): modelled 10% / 20% / 30%. *Unmeasured — the make-or-break unknown (financials flagged 12% vs 18%).*

**Tenure** (months subscribed): modelled 3 / 6 / 12. *Unmeasured. "Days 15–45 critical retention." A customer who sees it to the first retest is ~3–4mo; a believer 12+.*

**CAC by channel** (this session):
- Owned (short-form / content / SEO): **~£0 cash** (time, not cash).
- Cold paid (Search/Meta direct): **~£200** (£1.10 CPC ÷ ~0.5% cold CVR).
- Affiliate/PT (frozen): **~£30** (commission stack).

## LTV per acquired customer

`LTV = kit GP (£53) + attach% × tenure × monthly contribution`

**At £34.95 (sub £24/mo):**

| Attach ↓ / Tenure → | 3 mo | 6 mo | 12 mo |
|---|---|---|---|
| **10%** | £60 | £67 | £82 |
| **20%** | £67 | £82 | £111 |
| **30%** | £75 | £96 | £139 |

**At £39.95 (sub £29/mo):**

| Attach ↓ / Tenure → | 3 mo | 6 mo | 12 mo |
|---|---|---|---|
| **10%** | £62 | £70 | £88 |
| **20%** | £70 | £88 | £123 |
| **30%** | £79 | £105 | **£157** |

(Re-test upside: ~15% buying a 2nd kit adds ~£8 to every cell. Doesn't change any conclusion.)

## LTV:CAC verdict by channel

Using the **planning-case** cell (20% attach, 6-month tenure): LTV ≈ **£82** at £34.95, **£88** at £39.95.

| Channel | CAC | LTV:CAC (planning case) | Verdict |
|---|---|---|---|
| **Owned** (short-form/content/SEO) | ~£0 | effectively infinite | ✅ profitable at any retention — **the engine** |
| **Affiliate** (frozen) | ~£30 | ~2.7–2.9 : 1 | ✅ healthy (~3:1) — **a reason to unfreeze** |
| **Cold paid** | ~£200 | ~0.4 : 1 | ❌ loses ~£115/customer |

**The killer finding:** even in the *best* modelled cell (£39.95, 30% attach, 12-month tenure, LTV £157), cold paid at £200 CAC is **0.79:1 — still underwater.** Cold paid acquisition does not pay back *regardless of how good retention gets*. The CAC is simply too high against a £53 kit + a modest monthly contribution.

**Breakeven:** the planning-case LTV (~£88) supports a CAC of ~£88 at 1:1, ~£29 at a healthy 3:1. **Only owned (~£0) and affiliate (~£30) clear that bar.** This is the arithmetic behind "paid is validation/accelerant, not a scalable channel."

## The base-value decision, quantified

Moving £34.95 → £39.95 lifts LTV by **~£1–18 per customer** (≈ +10% at the planning case; +£18 at best case). Given COGS is fixed, that's near-pure margin straight into the LTV the flywheel runs on. **Take it** (validate via a checkout A/B or quiz-embed later).

But notice the scale: the **price** lever moves LTV ~10%. The **retention** lever (10%/3mo → 30%/12mo) moves it from £60 to £157 — **2.6×.** Price is real money; retention is the whole game.

## Strategic implications

1. **Don't scale cold paid.** The model proves it can't pay back. The Tier 2 £250 Search test is correctly scoped as a *read*, not a channel.
2. **Owned acquisition × subscription retention is the entire profit model.** Every owned-acquired subscriber nets £60–157 at ~£0 cost. That's the flywheel's economic core.
3. **Unfreezing affiliate matters** — at ~£30 CAC it's the only *paid* channel that's profitable (~3:1).
4. **Profitability is won on attach + tenure, not price.** The highest-leverage work is the results→supplement experience (attach) and retention design through the critical days 15–45 (tenure). Set the base value at £39.95 and then pour effort into those two numbers.
5. **None of this is *proven* until Phase 0b.** Attach and tenure are modelled, not measured — and can't be measured until supplements are live with real customers. The model tells you *where the profit must come from*; only live data tells you *if it's there*.

## Caveats

- Attach rate and tenure are **estimates**, not data. The whole verdict swings on them; treat the grid as a map of scenarios, not a forecast.
- COGS (£10) is **pending the stock-first quotes** — but margin is robust (60%+) across £8–14, so the verdict holds.
- Kit 2 is the base; Kit 1 lowers every LTV ~£15, Kit 3 raises it ~£24.
- Excludes overhead/fixed costs (the £593/mo in the financials) — this is per-customer contribution, not whole-business P&L.

---

*Compiled 2026-06-26. Inputs from the V7.2 financials + this session's COGS, CAC, and pricing work. Update the attach/tenure rows with real numbers the moment Phase 0b produces them — that is when this stops being a model and becomes the answer.*

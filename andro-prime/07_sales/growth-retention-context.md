# Growth & Retention Context — Andro Prime

*Last updated: April 2026*
*Skills: referral-program, free-tool-strategy, churn-prevention*

> Read `../../06_marketing/positioning/product-marketing-context.md` first. This file adds growth and retention detail.
> For retest loop mechanics and supplement subscriber churn rationale, read `../../04_products/icp-kit-supplement-alignment-april2026.md` Section 6.

---

## Referral Programme

### Design principles
- Referral should feel like a recommendation from Keith, not a "refer a friend" scheme
- The ICP refers because they believe in the product, not to earn a reward
- Keep it simple — complex tiered programmes confuse and reduce participation

### Referral structure

| Referrer | Reward | Referee | Timing |
|---|---|---|---|
| Existing kit buyer | £10 store credit | 10% off their first kit | Triggered at email 5 of seq-04 (Day 75) |
| Supplement subscriber | £15 store credit | 10% off first order | Triggered at month 3 of subscription |

**Mechanic:** Unique referral link generated per customer via FirstPromoter. Credit applied automatically on referee's first purchase (Stripe coupon or account credit).

**Framing (Keith's voice):** "If you've got the result and found it useful, someone you know probably needs to know about it. Here's a link — they get 10% off, you get £10 back."

**NOT a discount-first mechanic.** Never lead with "earn money." Lead with "know someone who needs this?"

### Affiliate vs referral distinction

| Type | Who | Commission | Purpose |
|---|---|---|---|
| Influencer affiliate | Creators 10k–150k followers | £15 flat per kit + £10 Kit 3 upsell bonus + £10 supplement-conversion bonus. Customer 10% off via affiliate code. | Acquisition |
| PT affiliate | Personal trainers | £15 flat per kit + £10 Kit 3 upsell bonus + £10 supplement-conversion bonus + £200 Silver / £400 Gold one-off graduation bonus. Customer 10% off via affiliate code. | Acquisition |
| Customer referral | Existing kit buyers | £10 credit | Retention + acquisition |

---

## Free Tool Strategy

### Phase 0 free tools

**Tool 1: Testosterone Level Checker (interactive)**
- URL: `/tools/testosterone-calculator/`
- What it does: User enters their lab result (nmol/L) — tool shows where they sit on a range (deficient / borderline / optimal / high) with plain-English explanation
- Why: Captures men who already have a private test result but don't know what it means. Entry point for Kit 1 retest or founding member list.
- CTA: "Get a proper full-panel result with Andro Prime — from £29"

**Tool 2: Symptom checker (quiz)**
- URL: `/tools/symptom-checker/`
- What it does: 5-question quiz mapping symptoms to likely biomarker deficiencies — recommends a kit
- This is a simplified version of the test selector — more symptom-led, less "which kit" framing
- CTA: "Your symptoms suggest [Kit X] — here's what it tests"

**Both tools should:**
- Not require email to see result (barrier to use)
- Offer email gate only for "email me my results"
- Never use "diagnose" or imply medical advice
- Be SEO-indexed (not behind a login)

### Why free tools work for this ICP
Men in this cohort have already been searching Reddit, reading articles, and trying to understand their own results. A free tool that meets them at that point of self-research earns trust before any commercial transaction. It also captures organic search traffic for "testosterone nmol/L calculator" type queries.

---

## Churn Prevention

### Supplement subscriber churn triggers

| Signal | Timing | Action |
|---|---|---|
| No login to dashboard | 45 days | Trigger seq-05 churn prevention |
| Card decline on renewal | Immediately | Automated dunning: 3 emails over 7 days |
| Explicit cancel request | Any time | Pause option offered before cancel confirmed |

### seq-05 churn prevention (3 emails, 45-day no-engagement trigger)

**Email 1:** Personal check-in (Day 1 of trigger)
- From: Keith
- Subject: "Checking in on you, [name]"
- Body: No pitch. Keith asks how it's going. Is the product arriving? Is it fitting into their routine?

**Email 2:** FAQ objection handling (Day 5)
- Addresses: "I haven't noticed a difference yet" — explains 8–12 week timeline for Vit D
- Includes a retest prompt — "check your levels again to see what's changed"

**Email 3:** Frank word from Keith (Day 10)
- Direct, honest tone: "If it's not working for you, I'd rather you cancel and come back to us than pay for something that isn't landing"
- Option: pause subscription for 30 days
- Option: switch product (e.g., Daily Stack — Complete Stack if they have multiple deficiencies)
- No discount offered in this sequence

### Pause mechanic
Offer a 30-day subscription pause as the primary churn-save option. Reactivates automatically. Better than cancel — re-acquire (which costs CAC again).

### The retest loop (primary churn-prevention mechanic)

The retest prompt at Day 75–80 (seq-04 email 4) is the most important churn-prevention mechanism. Subscribers who see improved results stay. Subscribers who don't know if they've improved quit.

Full mechanic: see `../../04_products/icp-kit-supplement-alignment-april2026.md` Section 6.

### Founding member retention (pre-TRT launch)
Founding members are long-cycle holders. They joined the list and are waiting. Primary risk is they forget us or find a TRT alternative first.

**Nurture cadence post-list-signup:**
- Monthly email from Keith (progress update on CQC, relevant health content)
- No hard selling — they've already opted in
- Share milestones: "We've now had X founding members join the list" (social proof)
- Early access communications when TRT launch date is known

---

## Lifetime Value Model

### LTV assumptions (Phase 0)

| Customer type | Initial purchase | Supplement MRR | Est. LTV (12mo) |
|---|---|---|---|
| Kit only (no sub) | £29–£69 | — | £29–£69 |
| Kit + supplement | £29–£69 | £34.95–£54.95/mo | £450–£730 |
| Kit + founding member (list) | £29–£69 | — | £29–£69 (pre-TRT; non-cash list signal, payoff post-CQC) |
| Kit + sub + TRT (post-CQC) | £29–£69 | £34.95/mo | £2,400+ |

**Blended CAC target:** ≤ £50 in Phase 0

**Payback period:**
- Kit-only customer: immediate (positive gross margin)
- Kit + supplement: 1–2 months
- TRT subscriber (post-CQC): under 2 months at £185/mo

### Supplement conversion targets
- ≥ 15% of kit buyers — supplement subscription (target)
- < 10% after 80 results — restructure result email sequence

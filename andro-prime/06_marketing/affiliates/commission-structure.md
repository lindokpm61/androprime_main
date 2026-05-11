# Commission Structure (v2.3)
## Canonical Reference for Affiliate Fees, Bonuses, Discounts & Payout Mechanics
## Reconciled with v2.3 right-sized affiliate model 2026-05-08

**Owner:** Keith Antony
**Cross-references:** `06_marketing/master-plan/phase0-marketing-plan.md` (v2.2 — pending v2.3 reconciliation), `06_marketing/affiliates/CONTEXT.md`, `06_marketing/affiliates/pt-programme.md` (v2.3), `06_marketing/affiliates/influencer-programme.md` (v2.2 — pending v2.3 reconciliation), `01_strategy/financial-model/phase0-financial-model-v1.xlsx`
**Status:** Active. Reconciled with right-sized affiliate model 2026-05-08.
**Version:** 2.3 (April 2026, right-sized affiliate model 2026-05-08)
**Replaces:** v2.2

> **What this document is for:** When in doubt about how an affiliate gets paid — for what, when, how much, with what conditions — this is the source of truth. All other affiliate documents reference this one. If something in another document conflicts with this, this wins until updated.

---

## 0. v2.2 → v2.3 Changes (right-sizing the affiliate stack)

The v2.2 stack was identified as 2–3× UK industry norm at full-bonus stack (28–39% effective cost vs industry 10–15%). The v2.2 financial summary surfaced only 4 of 22 actual cost lines; the rest (flagship retainers, gym free kits, PT-refers-PT bonuses, flagship Kit 3 bonus uplift) were hidden. v2.3 right-sizes to land closer to industry norms while preserving the parts that are strategically load-bearing.

**Kept unchanged**
- £15 base affiliate fee per kit
- £10 Kit 3 upsell bonus (now standardised across all PTs including flagships — see "Standardised" below)
- £10 supplement conversion bonus (LTV-aligned, retained)
- 10% customer discount via codes
- Annual £2,000 PT of the Year contest at M6
- Compliance system (3-strikes, kill switch, attestation, severe violation list)
- Free kit policy: 5 flagship Kit 3 + 20 first-wave Kit 2 (~£1,750)
- FirstPromoter + asset costs (~£1,200)

**Dropped entirely**
- First-month activation bonus (£10 one-time per affiliate). Industry-unusual; ~£500 over 6 months.
- PT-refers-PT bonus (£25 to referrer + £25 first-month boost to new PT). Redundant with existing referral mechanics.
- Flagship Kit 3 bonus uplift (£20 vs £10 differential). Standardised at £10 for all PTs.
- Monthly contests (£200 top PT volume + £150 top PT revenue + £150 top influencer = £500/mo). Quarterly + annual only retained.

**Converted**
- Tier retention bonuses (Silver £100/mo + Gold £200/mo recurring) → **one-off "tier graduation bonus":** £200 in the first month a PT reaches Silver; £400 in the first month a PT reaches Gold. After the graduation month, no further retention cash. Tier still tracked for recognition + non-cash benefits. Saves ~£5,000 over 6 months.

**Standardised / restructured**
- Flagship PT deal: previously £15 + £20 Kit 3 + £10 supplement + £250/mo retainer for content. New: £15 + £10 Kit 3 (standard) + £10 supplement + free Kit 3 (£98 COGS) + **£100 per piece of co-branded content (paid per delivery, capped at 2 pieces/month per flagship)**. Retains relationship + content cadence; pays per delivery rather than retained commitment.
- Gym partnership free kits: capped at 3 free kits per gym (head trainers only) × 10 gyms = 30 kits at £63 COGS = £1,890 (down from up to 8 per gym × 10 gyms = up to £5,040).

**Net effect:** total 6-month PT programme cost ~£13,240 (vs v2.2's effective ~£20k+ once hidden lines are included). Saving ~£7–10k.

---

## 1. Headline Structure

Every affiliate (PT, influencer, gym partner) operates on the same core structure:

- **Affiliate fee:** Flat £15 per kit sold via their code or link
- **Customer discount:** 10% off the kit price, applied at checkout via their code
- **Bonus stack:** Two triggerable bonuses on top of the base fee (v2.3 — the first-month activation bonus is removed)
- **Tier system:** One-off graduation bonus when a PT first reaches Silver (£200) or Gold (£400). No recurring monthly retention cash. (PT only — see Section 4.)
- **Contests:** Quarterly + annual cash prizes (Section 5). Monthly contests removed in v2.3.

Total cost ceiling per affiliate kit (worst case for Andro Prime, all per-kit bonuses paid):

- Kit 1: £15 + £10 supplement bonus = £25 cost on £89.10 received = 28% effective combined cost (with 10% discount included)
- Kit 2: £15 + £10 supplement = £25 cost on £107.10 received = 23%
- Kit 3: £15 + £10 Kit 3 bonus + £10 supplement = £35 cost on £161.10 received = 22%

These ceilings + COGS produce a positive minimum per-kit net across all three kits even at maximum per-kit bonus payout. Plan still works at the cost ceiling.

---

## 2. Per-Kit Economics — Direct Sale vs Affiliate Sale (v2.3)

### Direct sale (no affiliate code)

| Line | Kit 1 (£99) | Kit 2 (£119) | Kit 3 (£179) |
|---|---|---|---|
| Customer pays | £99.00 | £119.00 | £179.00 |
| Stripe (2.5%) | £2.48 | £2.98 | £4.48 |
| COGS (Vitall-quoted) | £58.50 | £63.00 | £98.00 |
| **Net per direct sale** | **£38.02** | **£53.02** | **£76.52** |

### Affiliate sale (10% customer discount via code, £15 base fee)

| Line | Kit 1 (£89.10) | Kit 2 (£107.10) | Kit 3 (£161.10) |
|---|---|---|---|
| Customer pays | £89.10 | £107.10 | £161.10 |
| 10% discount cost (vs RRP) | £9.90 | £11.90 | £17.90 |
| Affiliate base fee | £15.00 | £15.00 | £15.00 |
| Stripe (2.5%) | £2.23 | £2.68 | £4.03 |
| COGS | £58.50 | £63.00 | £98.00 |
| **Net per affiliate sale (no bonus paid)** | **£13.37** | **£26.42** | **£34.07** |

### Affiliate sale with all bonuses paid (v2.3 — Kit 3 + supplement; first-month bonus removed)

Worst case for Andro Prime (highest per-kit payout, all triggers fire):

| Line | Kit 1 | Kit 2 | Kit 3 |
|---|---|---|---|
| Net per affiliate sale (base) | £13.37 | £26.42 | £34.07 |
| Less Kit 3 bonus | n/a | n/a | -£10 |
| Less supplement conversion bonus | -£10 | -£10 | -£10 |
| **Net per affiliate sale (worst case, v2.3)** | **£3.37** | **£16.42** | **£14.07** |

Critical observation: under v2.3, every kit is positive at full per-kit-bonus payout. The v2.2 negative on Kit 1 (£-6.63) was driven by the first-month activation bonus, which is dropped in v2.3. The supplement conversion bonus stays because LTV alignment more than offsets the per-kit cost within 90 days.

**Tripwire (preserved from v2.2):** if observed full-bonus-payout per-kit blended net stays below £15 for 30 days, restructure the bonus stack. Defined in master plan v2.2 Section 10 (pending v2.3 reconciliation).

---

## 3. Bonus Triggers — Detailed Rules (v2.3)

v2.3 reduces the per-kit bonus stack from three triggers to two. The first-month activation bonus is removed entirely.

### Bonus 1: Kit 3 Upsell Bonus (+£10) — standardised across all PT tiers

**Triggers when:** A PT/influencer code is used at checkout for a Kit 3 purchase.

**Why it exists:** Without it, affiliates push the cheapest kit because the flat £15 fee doesn't reward upselling.

**v2.3 change:** Standardised at £10 for all PTs including flagships. v2.2 paid £20 for flagship PTs; v2.3 unifies the rate. Flagship PTs are differentiated via free Kit 3 + per-piece content payments instead (see `pt-programme.md` Section 3.3).

**Paid:** Within 30 days of purchase (after Stripe refund window closes — refund mechanics Section 6).

**Edge case — Kit 1 + Kit 2 bundle bought together (rare):** Treated as two separate sales. £15 × 2 = £30 base fee, no Kit 3 bonus.

**Edge case — Customer buys Kit 1 first, then upgrades to Kit 3 later:** Kit 3 bonus pays on the second purchase only. The Kit 1 sale already paid £15.

### Bonus 2: Supplement Conversion Bonus (+£10)

**Triggers when:** A customer who came in via the affiliate's code subscribes to Daily Stack, Joint & Recovery Collagen, or the Complete Men's Stack within 60 days of their kit purchase.

**Why it exists:** Aligns affiliate incentive with LTV. Their client subscribes → they earn more.

**Paid:** On the first successful subscription payment (after Stripe payment confirmation, after refund/cancel window).

**Edge case — Customer subscribes, cancels within 30 days:** Bonus is recouped from the affiliate's next payout. (Stated in attestation form.)

**Edge case — Customer subscribes after 60 days:** No bonus. The 60-day window is firm. Designed to incentivise active follow-up by the affiliate.

**Edge case — Customer buys multiple kits via different affiliates' codes:** Supplement bonus pays once, to the affiliate whose code produced the most recent kit purchase.

---

## 4. PT Tier System (PT-only — does not apply to influencers) — v2.3 graduation-bonus model

Influencer programme uses a flat structure with no tier bonuses.

| Tier | Monthly volume threshold | One-off graduation bonus (v2.3) | Other benefits |
|---|---|---|---|
| Bronze | 0–3 kits/mo (default) | £0 | Standard asset pack, monthly newsletter |
| Silver | 4–9 kits/mo | **£200 one-off, paid the first month a PT reaches Silver** | All Bronze + early access to new SKUs + custom Keith content on request |
| Gold | 10+ kits/mo | **£400 one-off, paid the first month a PT reaches Gold** | All Silver + 1:1 call with Keith + co-branded LinkedIn post + reserved early-access TRT slot |

### Tier mechanics (v2.3)

- Tier resets monthly based on rolling 30-day kit count, for recognition + non-cash benefits.
- **Graduation bonus pays once per tier per PT, the first month they reach that tier.** A PT who hits Silver, drops back, and re-hits Silver in a later month does **not** get a second Silver graduation bonus. Same for Gold.
- A PT who graduates Bronze → Silver in M1 (£200) and Silver → Gold in M3 (£400) earns a total £600 in graduation bonuses across the tier ladder.
- Tier-up notification sent automatically via FirstPromoter.
- After the graduation month, no further cash bonus on the tier — the PT continues to earn standard £15 base + per-kit bonuses + non-cash tier benefits.

### Graduation bonus payment rules

- Paid in arrears (end of qualifying month, distributed in following month's payout).
- Conditional on no active strikes (compliance violations) at time of payout.
- Conditional on PT being in good standing (no disputed transactions, no kill-switch incidents involving them).
- If PT enters strike-2 (code suspended) status during the qualifying month, the graduation bonus voids for that month. If they later re-qualify in a clean month, it pays then.

### Cash floor protection (preserved from v2.2)

If Andro Prime's cumulative monthly net cash drops below £3,000 at end of any month, graduation bonuses defer to the following month. Stated in PT brief. Not a default — a contingency.

### v2.2 → v2.3 rationale (for the record)

v2.2 paid Silver £100/mo and Gold £200/mo recurring while a PT held the tier — cumulatively the largest single line in the affiliate budget (~£15,000 over 6 months at moderate uptake). v2.3 replaces this with a one-off graduation bonus that still rewards reaching the tier but doesn't double-pay PTs for the same level of performance month after month. Net saving ~£5,000 over 6 months; recognition value of tier preserved.

---

## 5. Contest Mechanics (v2.3 — quarterly + annual only)

v2.3 removes monthly contests entirely. Reduces operational overhead, cost, and gaming risk.

### Quarterly contests

| Prize | Eligibility | Amount |
|---|---|---|
| Top PT (3-month rolling revenue) | Highest cumulative revenue Q1, Q2 | £750 |
| Best newcomer PT | Highest first-quarter performance among PTs onboarded in that quarter | £250 |

Quarterly winner gets a co-branded post on Keith's LinkedIn (with consent) + optional 1-hour podcast-style conversation distributed on both sides.

### Annual contest (M6 only)

| Prize | Eligibility | Amount |
|---|---|---|
| PT of the Year | Highest cumulative 6-month revenue | £2,000 |

PT of the Year also gets:
- Reserved early-access slot for clinical TRT at launch
- Permanent placement on Andro Prime "Trusted Partners" page (opt-in)
- Personal thank-you visit / call from Keith

### v2.3 contest budget summary

| Type | Prize | Frequency | 6-mo total |
|---|---|---|---|
| Quarterly top PT | £750 | × 2 quarters | £1,500 |
| Quarterly newcomer PT | £250 | × 2 quarters | £500 |
| Annual PT of the Year (M6) | £2,000 | × 1 | £2,000 |
| **Total v2.3 contest budget** | | | **£4,000** |

Down from v2.2's £5,000 monthly + £1,500 quarterly + £2,000 annual ≈ £8,500. Saves ~£4,500.

---

## 6. Customer Referral Programme (separate from affiliate)

Distinct from the PT/influencer affiliate programme. Built into the customer dashboard. Unchanged from v2.2.

| Element | Detail |
|---|---|
| Trigger | Customer completes their first kit purchase + creates account |
| Mechanism | Auto-generated unique referral link in customer dashboard |
| Customer reward | £10 store credit on next purchase per successful referral |
| Referee reward | £10 store credit applied to first kit purchase |
| Cap | None on referrer side; one credit per referee |
| Combinability with PT codes | Yes — referee can use a PT code AND a referral link in same checkout, but only the better-value of the two applies. Stripe checkout logic prioritises the larger discount. |

**Referrer credit conditions:**
- Refund of referee's purchase voids the referrer's credit if not yet used
- Credit expires 12 months after issue
- Cannot be cashed out — store credit only

---

## 7. Refunds, Chargebacks, Voids (v2.3)

Affiliates earn their fees on completed sales — defined as Stripe payment cleared and 14-day refund window closed.

### Refund within 14 days of purchase

- Affiliate fee voids
- Bonus on that kit voids (Kit 3 bonus and/or supplement conversion bonus, where applicable)
- 10% discount cost is moot (no revenue to discount)
- Customer fully refunded

### Refund after 14 days but before result delivery

- Affiliate fee voids and is recouped from next payout
- Bonus voids
- Customer refunded minus £10 admin fee (per T&Cs)

### Chargeback (any time)

- Affiliate fee voids and recouped from next payout
- Bonus voids
- Stripe deducts kit price + chargeback fee from Andro Prime
- Customer banned from re-purchasing under same email/payment method
- Affiliate notified that the sale was reversed and fee recouped

### Subscription cancellation within 30 days

- Supplement conversion bonus voids and recouped from next payout
- First month's subscription payment refunds per T&Cs
- Customer can re-subscribe later; bonus does not re-fire on the same customer

(Note: v2.2's first-month activation bonus refund mechanics are removed in v2.3 because the bonus itself is removed.)

---

## 8. Code Format Reference

| Affiliate type | Code format | Example | Generates customer discount |
|---|---|---|---|
| PT (all tiers) | `PT[NAME]15` | `PTSMITH15`, `PTMARK15` | 10% |
| Flagship PT | Custom (negotiated per partner) | `LUKE15` (illustrative) | 10% (or PT's choice) |
| Influencer | `[NAME]15` | `JAMES15` | 10% |
| Gym partnership (gym code) | `GYM[NAME]15` | `GYMVIRTUOSO15` | 10% |
| Customer referral | Auto-generated unique link | `andro-prime.com/?ref=AB7K2P` | n/a (£10 store credit instead) |

**Legacy note:** The "15" suffix is an artefact of an earlier iteration where the customer discount was 15%. The discount is now 10%, but the code format is preserved for stability. Customer-facing copy always states the actual 10% discount; the code format is a behind-the-scenes identifier only. Decision flagged for v3 — migrate or keep.

---

## 9. Payout Schedule and Mechanics

### Frequency

- Monthly — payments dispatched on the 15th of each month for the prior calendar month's earnings
- Earnings include: base fees on cleared sales + per-kit bonuses + tier graduation bonus (if any) + contest prizes from prior month + flagship per-piece content payments (where applicable)
- Minimum payout threshold: £30 (lower balances roll forward)

### Payment method

- Bank transfer (UK GBP) via Wise or directly via Stripe Connect (TBD by Week -2)
- Affiliate provides bank details during onboarding via secure form
- Tax: affiliate is responsible for own tax declarations. Andro Prime issues annual statement of total payments.

### Reporting

- FirstPromoter dashboard shows real-time:
  - Sales count (lifetime + last 30 days)
  - Commission earned (lifetime + last 30 days + pending)
  - Bonuses earned (broken down by type — Kit 3 upsell, supplement conversion, graduation bonus, content payment for flagships)
  - Current tier (PT only)
  - Distance to next tier
  - Personal quarterly leaderboard rank

### Disputes

- Affiliate has 14 days from monthly statement to dispute a payout
- Disputes go to Keith via dedicated email (`affiliates@andro-prime.com`)
- Stripe transaction records are the source of truth — if Stripe shows the sale, the fee is owed

---

## 10. Compliance-Linked Payout Conditions

These are gating conditions, not penalties — they protect Andro Prime from paying for outcomes that cost the brand more than they earn.

### Strike-1 (written warning)

- No payout impact. Earned fees + bonuses pay normally.
- Logged in `pt-network/strikes-log.md`.

### Strike-2 (code suspended 30 days)

- Earnings during 30-day suspension: zero (code is inactive)
- Earnings before suspension pay normally
- Graduation bonus voids for the qualifying month if the strike falls within it; PT may re-earn at next clean qualifying month

### Strike-3 / severe violation (permanent revocation)

- All pending earnings (last 30 days) **still pay** — these are sales that already happened, fees are owed
- All future earnings cease (code is dead)
- Graduation bonus voids for the month of the revocation
- Affiliate is removed from contest eligibility retroactively

**Severe violations are zero-tolerance** (immediate permanent revocation regardless of strike count):
- Ashwagandha mentioned by name
- "TRT is available now" or any equivalent
- False medical diagnosis claim
- False cure claim
- Persistent inflated discount claims after one warning

---

## 11. Special Cases (v2.3)

### Affiliate purchases their own kit using their own code

- Allowed — useful for standard PTs (no free kit) who want to test the product
- £15 base fee pays normally
- 10% discount applies normally
- This is permitted because: (a) it's small spend per affiliate, (b) it generates real product feedback, (c) it gives standard PTs the ability to credibly recommend

### Affiliate refers themselves a second kit (e.g. their partner)

- Allowed if it's a genuine separate purchase
- £15 fee pays normally
- Watch for abuse pattern — Keith reviews "self-referral" flag in FirstPromoter monthly

### Affiliate is also on the Founding Member list

- Allowed and encouraged
- Founding-member list (non-cash email opt-in) operates independently of affiliate earnings — there is no payment to reconcile (£75 cash deposit shelved 2026-05-08)
- Affiliate on the list receives the same TRT launch invitation as any other list member

### A customer uses two different PT codes on different kits

- Each sale attributes to its respective code at time of purchase
- No retroactive reattribution
- Customer can have multiple PTs in their network

### Subscription pricing changes mid-tenure

- Affiliate's supplement conversion bonus is paid based on the conversion event, not the price level
- £10 bonus is fixed regardless of which supplement product the customer subscribes to (Daily Stack, Collagen, or Bundle)

### PT introduces another PT (v2.3 — no cash bonus)

- v2.2's £25 PT-refers-PT bonus and £25 first-month boost to the new PT are **removed in v2.3.**
- PTs may still informally introduce other PTs; flagship PTs may bring sub-PTs into the standard programme as part of their content/network role.
- The introducing PT receives no cash bonus. The introduced PT goes through standard onboarding with the standard commission stack.

### Flagship PT content payments (v2.3 — new line)

- Flagship PTs earn £100 per piece of co-branded content delivered, capped at 2 pieces per calendar month per flagship.
- Paid on the 15th of the month following delivery, after Keith confirms the piece is published and meets brief.
- Replaces v2.2's £250/mo open-ended retainer.
- Detailed mechanics in `pt-programme.md` Section 3.3.

---

## 12. Open Questions / Flagged for v3

1. **Payment processor decision:** Wise vs Stripe Connect — needed by Week -2.
2. **VAT handling:** Andro Prime is currently below VAT threshold. Once registered, affiliate fees may need re-evaluation (£15 net or £15 gross to affiliate).
3. **Affiliate as employer — IR35 implications:** None at current scale (all payments are commission-based to self-employed individuals or limited companies). Re-evaluate at scale.
4. **Activation rate without first-month bonus:** v2.2 used a £10 first-month bonus to push activation toward 60%+. v2.3 removes it. Watch activation rate at M2; if it drops below 50%, consider a non-cash activation lever (priority onboarding call, personalised asset pack, named feature in monthly newsletter) before reintroducing cash.
5. **Code format migration:** `PT[NAME]15` → `PT[NAME]` (drop the "15"). Decide in Week -6.
6. **Custom flagship deals:** Currently 3–5 flagship PTs on the new per-piece content model. If a sub-flagship PT (say 30+ kits/month) emerges from standard cohort, what's the custom upgrade path? Define at v3.
7. **Bonus stack performance review at M3:** Is each bonus pulling its weight? Kit 3 bonus likely yes (volume metric will tell). Supplement bonus likely yes (LTV alignment). Graduation bonuses — review whether the Silver/Gold thresholds are landing where Keith expected.
8. **Cross-document reconciliation:** `phase0-marketing-plan.md` and `influencer-programme.md` still reference v2.2 commercial mechanics. Reconcile to v2.3 in a follow-up pass.

---

*Compiled: April 2026*
*Updated: 2026-05-08 (v2.3 right-sizing)*
*Owner: Keith Antony*
*Version: 2.3 (April 2026, right-sized affiliate model 2026-05-08)*
*Replaces: v2.2*
*Review: weekly during launch (Mondays); monthly thereafter; full revision at M3*

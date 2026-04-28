# Commission Structure (v2.2)
## Canonical Reference for Affiliate Fees, Bonuses, Discounts & Payout Mechanics

**Owner:** Keith Antony
**Cross-references:** `06_marketing/master-plan/phase0-marketing-plan.md` (v2.2), `06_marketing/affiliates/CONTEXT.md`, `06_marketing/affiliates/pt-programme.md`, `06_marketing/affiliates/influencer-programme.md`, `01_strategy/financial-model/phase0-financial-model-v1.xlsx`
**Status:** Active. Reconciled with financial model.
**Version:** 2.2 (April 2026)

> **What this document is for:** When in doubt about how an affiliate gets paid — for what, when, how much, with what conditions — this is the source of truth. All other affiliate documents reference this one. If something in another document conflicts with this, this wins until updated.

---

## 1. Headline Structure

Every affiliate (PT, influencer, gym partner) operates on the same core structure:

- **Affiliate fee:** Flat £15 per kit sold via their code or link
- **Customer discount:** 10% off the kit price, applied at checkout via their code
- **Bonus stack:** Three triggerable bonuses on top of the base fee
- **Tier system:** Cash retention bonuses for higher-volume affiliates (PT only — see Section 4)
- **Contests:** Monthly + quarterly + annual cash prizes (Section 5)

Total cost ceiling per affiliate kit (worst case for Andro Prime, all bonuses paid):
- Kit 1: £15 + £10 supplement bonus + £10 first-month = £35 cost on £89.10 received = 39% effective combined cost
- Kit 2: £15 + £10 supplement + £10 first-month = £35 cost on £107.10 received = 33%
- Kit 3: £15 + £10 Kit 3 bonus + £10 supplement + £10 first-month = £45 cost on £161.10 received = 28%

These ceilings + COGS produce minimum per-kit net of £14–£22 across the three kits even at maximum bonus payout. Plan still works at the cost ceiling.

---

## 2. Per-Kit Economics — Direct Sale vs Affiliate Sale

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

### Affiliate sale with all bonuses paid (Kit 3 + supplement + first-month)

Worst case for Andro Prime (highest payout, all triggers fire):

| Line | Kit 1 | Kit 2 | Kit 3 |
|---|---|---|---|
| Net per affiliate sale (base) | £13.37 | £26.42 | £34.07 |
| Less Kit 3 bonus | n/a | n/a | -£10 |
| Less supplement conversion bonus | -£10 | -£10 | -£10 |
| Less first-month activation bonus (one-time) | -£10 | -£10 | -£10 |
| **Net per affiliate sale (worst case)** | **-£6.63** | **£6.42** | **£4.07** |

Critical observation: at full bonus payout on Kit 1, the per-kit economics turn slightly negative. **This is acceptable because:**
1. The first-month bonus is a one-time payment (not recurring per kit)
2. Supplement conversion produces ongoing MRR that more than offsets the first-kit loss within 90 days
3. Kit 1 buyers with low T results convert to founding member deposits (£75 cash float per deposit) that compensate

But it is a flag. **If observed full-bonus-payout per-kit blended net stays below £15 for 30 days, restructure the bonus stack.** Tripwire defined in master plan v2.2 Section 10.

---

## 3. Bonus Triggers — Detailed Rules

### Bonus 1: Kit 3 Upsell Bonus (+£10)

**Triggers when:** A PT/influencer code is used at checkout for a Kit 3 purchase.

**Why it exists:** Without it, affiliates push the cheapest kit because the flat £15 fee doesn't reward upselling.

**Paid:** Within 30 days of purchase (after Stripe refund window closes — refund mechanics Section 7).

**Edge case — Kit 1 + Kit 2 bundle bought together (rare):** Treated as two separate sales. £15 × 2 = £30 base fee, no Kit 3 bonus.

**Edge case — Customer buys Kit 1 first, then upgrades to Kit 3 later:** Kit 3 bonus pays on the second purchase only. The Kit 1 sale already paid £15.

### Bonus 2: Supplement Conversion Bonus (+£10)

**Triggers when:** A customer who came in via the affiliate's code subscribes to Daily Stack, Joint & Recovery Collagen, or the Complete Men's Stack within 60 days of their kit purchase.

**Why it exists:** Aligns affiliate incentive with LTV. Their client subscribes → they earn more.

**Paid:** On the first successful subscription payment (after Stripe payment confirmation, after refund/cancel window).

**Edge case — Customer subscribes, cancels within 30 days:** Bonus is recouped from the affiliate's next payout. (Stated in attestation form.)

**Edge case — Customer subscribes after 60 days:** No bonus. The 60-day window is firm. Designed to incentivise active follow-up by the affiliate.

**Edge case — Customer buys multiple kits via different affiliates' codes:** Supplement bonus pays once, to the affiliate whose code produced the most recent kit purchase.

### Bonus 3: First-Month Activation Bonus (+£10, one-time)

**Triggers when:** An affiliate's first kit sale lands within 30 days of their code being issued.

**Why it exists:** Kicks the dormant-code problem. Industry default activation rate is 30–40%; this bonus pushes it toward 60%+.

**Paid:** On the first sale (added to that sale's payout).

**Edge case — Affiliate hits 30-day threshold but their first sale is refunded:** Bonus voids if the sale doesn't clear refund window. If a second sale lands within the original 30 days, the bonus pays on that.

**Edge case — Multiple affiliates onboarded same week:** Each one gets their own 30-day clock starting from their attestation signing date.

---

## 4. PT Tier System (PT-only — does not apply to influencers)

Influencer programme uses a flat structure with no tier retention bonuses.

| Tier | Monthly volume threshold | Retention bonus | Other benefits |
|---|---|---|---|
| Bronze | 0–3 kits/mo (default) | £0 | Standard asset pack, monthly newsletter |
| Silver | 4–9 kits/mo | **£100/month** | All Bronze + early access to new SKUs + custom Keith content on request |
| Gold | 10+ kits/mo | **£200/month** | All Silver + monthly 1:1 call with Keith + co-branded LinkedIn post + reserved early-access TRT slot |

### Tier mechanics

- Tier resets monthly based on rolling 30-day kit count
- Tier-up notification sent automatically via FirstPromoter
- Tier retention bonus paid at end of month it was earned, in next month's payout cycle
- A PT who hits Silver in a month and drops to Bronze the next gets the Silver bonus once and reverts

### Tier retention bonus payment rules

- Paid in arrears (end of qualifying month, distributed in following month's payout)
- Conditional on no active strikes (compliance violations) at time of payout
- Conditional on PT being in good standing (no disputed transactions, no kill-switch incidents involving them)
- If PT enters strike-2 (code suspended) status during the qualifying month, the retention bonus prorates to days active

### Cash floor protection

If Andro Prime's cumulative monthly net cash drops below £3,000 at end of any month, retention bonuses defer to the following month. Stated in PT brief. Not a default — a contingency.

---

## 5. Contest Mechanics

### Monthly contests

| Prize | Eligibility | Amount |
|---|---|---|
| Top PT (volume) | Highest 30-day kit count | £200 |
| Top PT (revenue) | Highest 30-day £ generated | £150 |
| Top influencer | Highest 30-day kit count via influencer code | £150 |

Two PT leaderboards (volume + revenue) prevent gaming — a PT can't just push Kit 1 to inflate volume count and still win.

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

---

## 6. Customer Referral Programme (separate from affiliate)

Distinct from the PT/influencer affiliate programme. Built into the customer dashboard.

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

## 7. Refunds, Chargebacks, Voids

Affiliates earn their fees on completed sales — defined as Stripe payment cleared and 14-day refund window closed.

### Refund within 14 days of purchase

- Affiliate fee voids
- Bonus on that kit voids
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
- Earnings include: base fees on cleared sales + bonuses + tier retention + contest prizes from prior month
- Minimum payout threshold: £30 (lower balances roll forward)

### Payment method

- Bank transfer (UK GBP) via Wise or directly via Stripe Connect (TBD by Week -2)
- Affiliate provides bank details during onboarding via secure form
- Tax: affiliate is responsible for own tax declarations. Andro Prime issues annual statement of total payments.

### Reporting

- FirstPromoter dashboard shows real-time:
  - Sales count (lifetime + last 30 days)
  - Commission earned (lifetime + last 30 days + pending)
  - Bonuses earned (broken down by type)
  - Current tier (PT only)
  - Distance to next tier
  - Personal monthly leaderboard rank

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
- Tier retention bonus prorates if month is partially affected

### Strike-3 / severe violation (permanent revocation)

- All pending earnings (last 30 days) **still pay** — these are sales that already happened, fees are owed
- All future earnings cease (code is dead)
- Tier retention bonus voids for the month of the revocation
- Affiliate is removed from contest eligibility retroactively

**Severe violations are zero-tolerance** (immediate permanent revocation regardless of strike count):
- Ashwagandha mentioned by name
- "TRT is available now" or any equivalent
- False medical diagnosis claim
- False cure claim
- Persistent inflated discount claims after one warning

---

## 11. Special Cases

### Affiliate purchases their own kit using their own code

- Allowed — useful for standard PTs (no free kit) who want to test the product
- £15 base fee pays normally
- 10% discount applies normally
- This is permitted because: (a) it's small spend per affiliate, (b) it generates real product feedback, (c) it gives standard PTs the ability to credibly recommend

### Affiliate refers themselves a second kit (e.g. their partner)

- Allowed if it's a genuine separate purchase
- £15 fee pays normally
- Watch for abuse pattern — Keith reviews "self-referral" flag in FirstPromoter monthly

### Affiliate is also a Founding Member depositor

- Allowed and encouraged
- Founding member £75 deposit operates separately from affiliate earnings
- Affiliate's £75 deposit applies as TRT credit at clinical launch (same as any other depositor)

### A customer uses two different PT codes on different kits

- Each sale attributes to its respective code at time of purchase
- No retroactive reattribution
- Customer can have multiple PTs in their network

### Subscription pricing changes mid-tenure

- Affiliate's supplement conversion bonus is paid based on the conversion event, not the price level
- £10 bonus is fixed regardless of which supplement product the customer subscribes to (Daily Stack, Collagen, or Bundle)

---

## 12. Open Questions / Flagged for v3

1. **Payment processor decision:** Wise vs Stripe Connect — needed by Week -2.
2. **VAT handling:** Andro Prime is currently below VAT threshold. Once registered, affiliate fees may need re-evaluation (£15 net or £15 gross to affiliate).
3. **Affiliate as employer — IR35 implications:** None at current scale (all payments are commission-based to self-employed individuals or limited companies). Re-evaluate at scale.
4. **First-month bonus extension to second/third months?** v2.2 keeps it as a one-time bonus. Consider tier-graduating bonus at v3 if activation rate stays below 60%.
5. **Code format migration:** `PT[NAME]15` → `PT[NAME]` (drop the "15"). Decide in Week -6.
6. **Custom flagship deals:** Currently 3–5 flagship PTs on £250/mo retainer. If a sub-flagship PT (say 30+ kits/month) emerges from standard cohort, what's the custom upgrade path? Define at v3.
7. **Bonus stack performance review at M3:** Is each bonus pulling its weight? Kit 3 bonus likely yes (volume metric will tell). Supplement bonus likely yes (LTV alignment). First-month bonus — probably the most disposable if costs need cutting.

---

*Compiled: April 2026*
*Owner: Keith Antony*
*Version: 2.2 (canonical fee/bonus/discount reference for hybrid affiliate model)*
*Review: weekly during launch (Mondays); monthly thereafter; full revision at M3*

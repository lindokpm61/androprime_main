# A result-triggered fast recheck must be prepaid or included, never a new sale

**Decided:** 2026-09-07 · **Owner:** Keith · **Status:** ADOPTED
**Raised in:** `2026-09-06-result-driven-retest-cadence.md` §8, which remains PROPOSED as a whole.
**Recorded separately because** the constraint was adopted on its own, and a decision that lives
only inside another document's body goes stale without anyone noticing. That failure has already
cost this repo ten days once (`../../01_strategy/2026-08-27-first-month-included-in-kit-price.md`).

---

## 1. The rule

> **A recheck triggered by a result, falling less than 90 days after that result, must be
> prepaid or included in an entitlement the customer already holds. It may never trigger a
> new sale.**

## 2. What it is scoped to, and what it deliberately does not touch

The rule governs **result-triggered rechecks of a marker already tested**. Two adjacent things
are outside it, and saying so is the point of this section: an unstated exception surfaces later
as a contradiction rather than being read as a decision.

| Not covered | Why |
|---|---|
| **The complement cross-sell** (`2026-07-08-post-result-cross-sell-complement-rule.md`) | It offers the markers the customer's kit did **not** measure. It is not a recheck, it re-tests nothing, and the honest "here is the panel we have not checked" framing is the compliant pattern the 2026-07-17 cadence table endorses. Unchanged. |
| **seq-04 email 5**, the subscriber retest prompt at +75 days | It is anchored to `subscription_started`, not to a result. It measures **supplement effect** over 90 days of consistent use, and it is not fired by bad news. The rule exists to stop the system reacting to a worrying number with a checkout; this reacts to someone starting a supplement. Unchanged. |

## 3. Why

The result-driven cadence design lets a result choose its own interval. A low testosterone
reading fires a recheck in days, which is clinically right and which Ewa signed on 2026-07-26.

But read what that means commercially without this rule: **the system reacts to bad news by
putting a purchase in front of a worried man, within days of him reading the worst number on his
dashboard.** The 2026-07-17 cadence table already names the failure in its own words: *"Still
feel bad, buy the same kit again sooner"* reads as manufacturing a repeat purchase.

The existing low-T recheck passes the test for two specific reasons, and they are the reasons
this rule generalises:

1. **The kit is already paid for.** It sits inside a Confirmation bundle at £169, of which about
   £70 is the second test. Nothing new is sold at the moment of bad news.
2. **The sample is for a doctor.** The result routed to a GP, a GP needs a second morning sample
   to act, and we supply it. We do not diagnose.

Remove either and the same mechanism becomes *bad result, here is a £99 checkout*.

## 4. It completes a set rather than starting one

Two rules already govern neighbouring ground, and neither reaches this case because the cadence
mechanism did not exist when they were written:

- **CA-014 (Ewa, 2026-06-04):** a confirmed testosterone result under 12 nmol/L routes to a GP
  referral **with no kit or supplement upsell** (`../../03_compliance/CONTEXT.md`).
- **The complement rule (2026-07-08):** a post-result cross-sell is always the complement, never
  the superset, so we never re-sell markers a customer already has.

Both say the same thing from different angles: **we do not monetise the moment a result lands.**
This rule is the third face of it, covering the case where the thing being sold is a repeat of
the very marker that came back wrong.

## 5. What it costs, stated plainly

Revenue, and genuinely. **A man who has just received a bad result is the most motivated buyer
this business will ever have**, and the rule says we do not sell to him in that moment. That is
the trade and it was made knowingly.

## 6. What it does not stop

It governs **what we initiate**, never what the customer may do. He can visit `/kits` and buy
another test five minutes after reading his result, and nothing blocks him. What the business
will not do is fire a mechanism at him that schedules or prompts that purchase.

## 7. Compliance check against what is live today: no violation

Enumerated rather than assumed, from `lib/results/classifier.ts` on 2026-09-07. Recorded so the
question is not re-asked.

| CTA | Fires on | Verdict |
|---|---|---|
| `retestReminder` | In-range states | ✅ Links to `/kits`, a sale, but at **6-12 months**. Outside the window. |
| `gpReferral` | GP-block states | ✅ Routes to the handoff page. No sale. |
| `supplementWaitlist` | Deficiency states | ✅ Email capture, not a purchase. |
| `kit1CrossSell` / `kit2CrossSell` | Normal-T and complement paths | ✅ Untested panel, governed by the 2026-07-08 rule. Not a recheck. |
| `maintenanceOffer` | All-clear, behind `MAINTENANCE_OFFER_ENABLED` | ✅ Waitlist, not a purchase. Flag off. |
| Confirmation recheck, 0 days | T under 12 | ✅ **Prepaid inside the bundle.** Compliant by construction, and the model for the rule. |

**Nothing currently in the product breaks this rule.** It is forward-looking, and its first real
job is to constrain the cadence map before any cell is filled in.

## 8. What it constrains going forward

- **No cell in `RETEST_CADENCE` may carry a sub-90-day interval for a customer with no prepaid
  or included entitlement.** Where the clinically right answer is a fast recheck and the customer
  holds neither, the correct output is the GP route or the long window, not a checkout.
- **It points the whole cadence feature at bundles and the membership, never at the shop.**
- **It strengthens the membership proposition**, which currently lacks one. *"Your recheck is
  included, whenever your numbers say you need one"* is a real reason to be a member and a true
  one, and it is a better answer to the "nothing to deliver in months 2 to 12" gap that
  `../../10_launch-ops/2026-08-24-supplement-membership-gap-analysis.md` identifies than anything
  currently proposed.

## 9. Owner note

No copy changes and no code changes fall out of this today, because nothing violates it. It is a
constraint on work not yet built. **No Ewa escalation**: it removes commercial pressure from
clinical moments rather than adding a claim, so no approved copy moves.

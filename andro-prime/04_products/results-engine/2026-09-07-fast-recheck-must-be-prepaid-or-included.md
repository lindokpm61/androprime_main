# A result-triggered fast recheck must be prepaid or included, never a new sale

**Decided:** 2026-09-07 · **Amended:** 2026-09-15 (§2 gains a third carve-out and §2a is new: the
bucket B clinical interval is scoped out, and the stored value is `{ days: 90 }` rather than
"3 months") · **Owner:** Keith · **Status:** ADOPTED
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
| **Every `recheck` cell** (the 3-month clinical interval), added 2026-09-15 | Ewa signed 3 months for every marker a man is acting on (CA-047). **It is not the mechanism this rule was written against.** §3 was aimed at a recheck firing *in days*, at the moment a man reads the worst number on his dashboard. A `recheck` exists to see whether an intervention moved a marker, which is the same species as seq-04 e5 above and a longer interval than it. **Scoped out on the substance, not on the arithmetic.** ⚠ **Scoped by RULE KIND, not by a list of markers** — see the note below, which is a correction. |

> 🔴 **CORRECTED LATER THE SAME DAY, AND THE CORRECTION IS THE INTERESTING PART.** The row above
> originally scoped the carve-out by **listing the markers**: low vitamin D, low and borderline
> B12, normal-testosterone in the lower half, raised CRP on the lifestyle branch, suboptimal
> ferritin. **Ewa's second reply, 75 minutes later, made that list wrong by four.** `ft-low`, the
> CRP **joints = yes** branch, `shbg-low` and `shbg-high` all came back at 3 months and all carry
> `recheck` rules, so all four belong inside the carve-out and none was named.
>
> Two of those four are the sharp case: **`shbg-low` and `shbg-high` are IN-RANGE states** sitting
> in the cadence table's bucket C, so a list built by reading bucket B would never have found them
> however carefully it was checked.
>
> **The row is now scoped by RULE KIND (`recheck`) rather than by a list of markers**, which is
> both correct and self-maintaining: a marker Ewa rules on next month is inside the carve-out the
> moment its rule is a `recheck`, with nothing to remember and nothing to update here.
>
> **The general lesson, since this repo keeps paying for it:** a carve-out enumerated by instance
> goes stale every time the set grows, and it goes stale *silently*, because the list still reads
> as complete. Scope by the property that made the instances qualify.

## 2a. The 90-day boundary, decided 2026-09-15 (Keith)

Ewa's 3-month bucket B interval landed almost exactly on this rule's threshold, so which side it
falls on had to be settled before the cadence map could schedule anything. **It is settled two
ways, deliberately, because the two halves fail differently.**

### The decision

1. **Bucket B is out of scope on the substance.** See the third row of §2 above. That is the
   load-bearing half: it means the interval can later move to 84 days or 100 without reopening
   the commercial question at all.
2. **The stored value is `{ days: 90 }`, not "3 months".** 90 is not *less than* 90, so the cell
   is outside the rule even for a reader who never finds the carve-out. That is the mechanical
   half, and on its own it would be fragile, since it sits one day off the line.

### Why it cannot be left as "3 months"

**The type already forces an integer.** `recheck` is `{ days: n }` in the cadence design, so
there is no "3 months" for the engine to hold. Someone writes a number, and the only question is
who and when.

🔴 **And if calendar-month arithmetic picks it, the rule's applicability depends on the month the
man's blood was drawn.** Computed across every start date in 2026 to 2028:

| 3 calendar months later | Start dates |
|---|---|
| 89 days | 58 |
| 90 days | 154 |
| 91 days | 250 |
| 92 days | 634 |

**58 of 1096 start dates, 5.3%, land under 90 days, and every one of them is in late January or
February.** So a man who tests in February would fall inside a commercial rule that a man testing
in March does not, for no reason anyone could defend. A leap year moves him back out again. That
is the worst available outcome and it is the default one, arriving through nobody deciding
anything.

### Why the alternative was rejected

**Treating 3 months as inside the rule would quietly undo Ewa's ruling of the same day.** Her
Q4 = C exists precisely to keep a correctable deficiency being followed up when another marker
routes to a GP. But §8 below says that where a fast recheck is clinically right and the customer
holds no entitlement, the output is the GP route or the long window. So a man with low vitamin D
and no membership would be given 6 to 12 months instead of his 3 months. **She would have
preserved the follow-up clinically and we would have removed it commercially**, which is a worse
position than never having asked her.

### The honest objection, recorded rather than buried

Setting 90 to sit one day outside a "less than 90" rule reads as lawyering if the number stands
alone. **That is exactly why the §2 carve-out matters more than the integer**, and why it is
written in terms of what bucket B is for rather than how many days it is. The 90 is a consequence
of the scoping decision, not a way around the rule.

⚠ **The guard this needs.** If anyone later restates bucket B as "12 weeks", that is 84 days and
it crosses back under the threshold silently. **Any proposal to shorten a bucket B cell below 90
days reopens this section**, and the shortening is what triggers it, not the clinical argument
for it.

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
  ⚠ **Read with §2 and §2a (2026-09-15): every `recheck` cell is scoped OUT of this rule and is
  stored as `{ days: 90 }`.** They are not sub-90-day intervals and this bullet does not reach
  them. **Scoped by rule kind, deliberately, not by a list of markers** — the list version was
  wrong within 75 minutes of being written. **The bullet still binds every `confirm` cell**, which
  is where the sub-90-day intervals actually live: the sub-12 testosterone recheck at 0 days,
  prepaid inside the Confirmation bundle, which is the model this whole rule was generalised from.
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

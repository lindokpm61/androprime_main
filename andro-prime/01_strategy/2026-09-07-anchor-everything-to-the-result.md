# Every date anchors to the result landing

**Decided:** 2026-09-07 · **Owner:** Keith · **Status:** ADOPTED
**Ruling, verbatim:** *"anchor everything to results"*

**Closes:** the open anchor question carried by `STATE.md`,
`2026-08-27-first-month-included-in-kit-price.md` §4.1,
`2026-08-26-membership-offer-window.md` §6 (forward-pointer),
`08_customer-journey/journey-spine.md` owed item 4, and
`04_products/results-engine/retest-mechanism-map.md` §6.1.

---

## 1. The decision

**Every customer-facing date is anchored to the moment the lab result comes back.**
Not to purchase, not to Stripe checkout.

The operative field already exists and is already the one the offer window uses:
`lab_results.received_at`, read through `latestResultReceivedAt`. Its own comment
gives the reason the ruling generalises: *"`received_at`, deliberately, not
`collected_at`: the window is about how long ago he learned something, not how
long ago he bled."*

## 2. Why, in one paragraph

Two independent arguments arrived at the same anchor, which is the strongest
evidence available that it is right. **Commercially:** before a result exists
there is no trend, no check-in loop and no retest to be entitled to, so an
included month starting at purchase is 30 days of an empty room, given away
rather than sold, and it can expire before the result exists if the kit sits in
a drawer. **Clinically:** a retest interval measures change in a number, so it
can only run from the moment that number exists. Ninety days after a card was
charged is not ninety days after a baseline.

## 3. What moves, and what already complied

Against the eight mechanisms in `04_products/results-engine/retest-mechanism-map.md`:

| # | Mechanism | Anchor today | Under this ruling |
|---|---|---|---|
| 1 | Confirmation recheck | Result | ✅ Already complies |
| 2 | Confirmation bank | Result | ✅ Already complies |
| 3 | Timed bundles (Prove-It, Full-picture) | **Purchase** | ⚠️ **EXEMPT (decided 2026-09-07, §5a).** Stays at purchase + 90. Live T&Cs promise that, and the 90-day spacing is the product |
| 4 | Membership retest, flagged | **Stripe checkout** | 🔄 Moves |
| 5 | Membership retest, all-clear | **Stripe checkout** | 🔄 Moves (and is separately unreachable) |
| 6 | Membership later retests | Previous retest | 🔄 Moves (and is separately never called) |
| 7 | All-clear reminder email | Result | ✅ Already complies |
| 8 | Subscriber retest email, seq-04 e5 | `subscription_started` | ⚠️ **Carve-out. See §4** |

Also moving: the **membership included month** (the 2026-08-27 ruling) and
`memberships.started_at`, which `createMembership` stamps from checkout today.

**Half the mechanisms already comply**, which is worth stating plainly: this
ruling is less a change of direction than the majority position winning.

## 4. Two carve-outs, and neither is a loophole

> **Scope, stated up front because the title says "everything".** The ruling reaches every date
> that is a **clinical cadence**. It does not reach two mechanisms whose clocks legitimately start
> elsewhere: the seq-04 e5 supplement prompt (below) and the **timed bundles** (§5a, decided
> 2026-09-07). Both are recorded as decisions rather than left implied, because an unstated
> exception is found later as a contradiction.

**Mechanism 8, the seq-04 email 5 retest prompt, stays anchored to
`subscription_started`, and it should.**

It is not a retest-cadence mechanism wearing a different anchor. It measures
**supplement effect**: it fires at +75 days so results land around day 90 of
consistent supplementation, which is the window in which vitamin D and B12
actually move. Its clock legitimately starts when the man starts taking the
supplement, not when he learned his baseline. Anchoring it to a result would
measure nothing.

Recording this explicitly because a blanket "everything" overshoots as easily as
the old inconsistency undershot, and an unstated exception gets discovered later
as a contradiction rather than read as a decision.

🔵 **Keith to confirm this carve-out is intended.** It is the only mechanism the
ruling does not reach.

## 5. The consequence nobody has decided: a timed bundle with no result

Mechanism 3 is the one that changes behaviour rather than just arithmetic, and it
introduces a failure mode that does not exist today.

**Today:** `lib/bundles/checkout.ts` stamps `due_at = purchase + 90` at checkout.
The second kit ships at day 90 **whatever happens**, including to a man who never
posted his first sample.

**Under this ruling:** `due_at` is null until the result lands, then
`result + 90`. The machinery already supports this exactly, and it is how
Confirmation bundles work: `isTriggerMatured` returns false on a null `due_at`,
so the row simply waits. **The code change is small and uses an existing tested
path.**

**But:** if the sample is never posted, `due_at` stays null forever and the
prepaid second kit never ships. A customer has paid for two kits and would
receive one.

That is arguably the clinically correct outcome, since a retest with no baseline
compares nothing. It is not obviously the correct *commercial* or *consumer-law*
outcome, and it is a change to what a paying customer receives.

> ⚠️ **SUPERSEDED THE SAME DAY BY §5a. Read that first; this section is the record of a
> decision that stood for about an hour.** Keith took the purchase + 180 backstop, the sweep
> then found it contradicted live approved T&Cs, and he revised to **purchase + 90**, which is
> the timed-bundle exemption. **Nothing in this section is to be built.** It is kept because the
> reasoning is still the right reasoning for any future backstop, and because deleting a
> superseded decision hides that the revision happened.

~~**DECIDED 2026-09-07 (Keith): option 1, the purchase + 180 backstop.**~~

**The mechanic, specified.** `due_at` is **never null** for a timed bundle. At checkout it is
stamped `purchase + 180`. When the result lands, the result hook overwrites it to
`min(result + 90, purchase + 180)`.

- **Normal case.** Result back by day 14, so `due_at` becomes about day 104. The retest is
  anchored to the baseline exactly as the ruling intends.
- **Never tests.** `due_at` stays at day 180 and the prepaid kit ships. Today's guarantee is
  kept, and it fails in the customer's favour.
- **Very late result.** `min()` is what makes the backstop a **ceiling rather than a target**.
  A result landing at day 120 would otherwise push `due_at` to day 210, quietly moving a
  guarantee outward that exists precisely to stop the kit being swallowed. Capping it means a
  late tester gets his retest slightly sooner than 90 days after baseline, which is the cheaper
  of the two errors.
- **Result lands after dispatch.** No new code. The row has already left `scheduled`, and
  `isTriggerMatured` only ever acts on `scheduled` rows.

**Why this shape and not a second column.** `due_at` already exists, the result hook already
writes it for Confirmation bundles, and the sweep already reads it. A `backstop_at` column would
need a migration, a second predicate and a rule about which wins. One column, one write, no
schema change.

~~**New constant to add:** `SECOND_DISPATCH_BACKSTOP_DAYS = 180` in `lib/bundles/config.ts`.~~
**Not needed under §5a.** No constant is added and `SECOND_DISPATCH_DELAY_DAYS` keeps both its
value and its origin.

🔴 **CORRECTION, same day: this does NOT unblock the timed-bundle build, and the sweep is why.**
Grepping the compliance layer for the backstop turned up
`../03_compliance/terms-and-conditions.md` §"Test Bundles", **approved by Keith and Ewa on
2026-07-25 and synced live to `canonical-site/terms/index.html` on 2026-07-26**. It says:

> *"**Timed bundles (Prove-It and Full-Picture):** the retest is sent automatically **about 90
> days after your purchase**. This spacing lets your second set of results be compared against
> your first."*

**Anchoring timed bundles to the result contradicts that, and there is no version that does not.**
The result always lands after the purchase, so any result-anchored date is later than
purchase + 90. For a normal customer (result back around day 14) dispatch moves to about day 104.
For a customer who never tests it moves to day 180, which is **twice the promised wait, in the one
case the backstop was chosen to protect**. That is the opposite of failing in his favour.

See §5a. **Nothing may be built on mechanism 3 until §5a is answered**, and my earlier
"buildable" line was wrong.

**The options as they were put, 2026-09-07:**

1. **Ship anyway after a backstop period** (say purchase + 180 days), so the
   prepaid kit is never silently swallowed. Simplest, and it keeps today's
   guarantee while fixing the ordinary case.
2. **Chase, then refund** the second-kit portion if no result arrives. Cleanest
   consumer position, most build.
3. **Hold indefinitely** as an open entitlement he can claim whenever he tests.
   No refund, no expiry, and it matches the membership's own
   "entitlement, not a credit" framing.

**Assistant recommendation: option 1**, with the backstop dated from purchase.
It preserves the existing promise, needs one constant rather than a new flow, and
it fails in the customer's favour. **Nothing should be built on mechanism 3 until
this is answered**, because the fallback determines the shape of the change.

## 5a. ✅ RESOLVED: the timed bundles are exempt and stay at purchase + 90

**Decided 2026-09-07 (Keith): "purchase + 90".** Since `min(result + 90, purchase + 90)` is
always `purchase + 90`, choosing that value **is** option A below: the timed bundles are exempt
from this ruling and remain anchored to purchase.

**Consequences, all of them good:**

- **The live T&Cs stay true, unchanged.** No edit to `terms-and-conditions.md`, no re-sync of
  `canonical-site/terms/index.html`, and **no Ewa re-approval.** The escalation below closes with
  no action.
- **No code change for timed bundles.** `secondDispatchDueAt` keeps stamping purchase + 90 at
  checkout, and the result hook does **not** touch Prove-It or Full-Picture rows. Today's
  behaviour is already correct.
- **`SECOND_DISPATCH_BACKSTOP_DAYS` is not needed.** `due_at` is never null for a timed bundle,
  so there is nothing to backstop. The §5 mechanic is moot and is kept below only as the record
  of what was considered.
- **The carve-out list in §4 becomes two:** seq-04 e5, and the timed bundles.

**What the ruling still does**, undiminished: the membership included month,
`memberships.started_at` and both membership retest constants move from Stripe checkout to the
result. That is where the anchor was actually doing work.

**The escalation as it stood, kept as the record:**

**Owner was: Keith (business) and Ewa (clinical countersignature, as on the original).**
**Status: CLOSED 2026-09-07, no change to approved copy.**

### The collision

Live T&Cs promise timed-bundle retests **about 90 days after purchase**, with the stated
rationale *"this spacing lets your second set of results be compared against your first."*
Result-anchoring necessarily moves that date later. This is approved copy on a published page, so
**it is not editable by a sweep** (decision-sweep invariant 2).

**Mitigating fact:** `bundle_dispatches` holds **0 rows** and no bundle has ever been sold, so no
customer is relying on the current promise. This is the cheapest moment this will ever be fixed.

### Two options

**A. Exempt the timed bundles. They stay anchored to purchase at 90 days.**
Coherent, because for Prove-It and Full-Picture **the 90-day spacing is the product**, not a
clinical cadence. A man buys "test now, retest 90 days later" as one package, and the terms say so
in those words. Costs nothing: no terms change, no re-approval, no live-page edit. The Confirmation
bundle is untouched either way, because it already anchors to the result.
**Its real cost:** if his first result takes 30 days to come back, the two results sit only 60 days
apart rather than 90, which is a genuinely weaker comparison. The clinical argument for
result-anchoring is strongest where the interval is a clinical cadence and weakest here, but it is
not zero.

**B. Change the terms.** The promise becomes something like *"about 90 days after your first
result, and in any case within 180 days of your purchase."* Clinically cleaner and it keeps the
ruling universal. **Costs:** Keith and Ewa re-approval, an edit to `terms-and-conditions.md`, and a
re-sync of the served `canonical-site/terms/index.html` (a mirrored store: both copies, or the
served page is the one that goes stale). It also asks a customer to accept a longer worst case
than he has today.

**Not a third option:** setting the backstop to 90 rather than 180 collapses into A, since
`min(result + 90, purchase + 90)` is always `purchase + 90`.

### Recommendation: A, and record it as the third carve-out

The ruling is doing its real work on the membership, where the anchor decides the included month
and the retest date. The timed bundles are a **fixed-spacing product** whose interval was sold and
approved as a purchase-relative promise. Exempting them costs one sentence in this file and breaks
nothing; the alternative reopens approved clinical copy to gain a comparison window that is
already adequate in the ordinary case.

If A is taken, the carve-out list in §4 becomes two: seq-04 e5, and the timed bundles. The
purchase + 180 backstop in §5 then becomes unnecessary, because `due_at` never goes null.

## 6. Code carriers (flagged, not changed)

Application code is its own task with its own verification (decision-sweep
invariant 4). Nothing below has been edited.

| File | What changes |
|---|---|
| `lib/membership/sync.ts` | `createMembership` takes the result date, not `new Date()`, for both `started_at` and `firstRetestDueAt`. The result is already readable via `latestResultReceivedAt`. |
| `lib/bundles/checkout.ts` | ✅ **NO CHANGE.** Timed bundles are exempt (§5a), so `secondDispatchDueAt` keeps stamping purchase + 90. |
| Result hook (`lib/results/processResult.ts`) | ✅ **NO CHANGE.** No Prove-It / Full-picture branch is added; the Confirmation branch it already has was always result-anchored. |
| `lib/bundles/config.ts` | ✅ **NO CHANGE.** `SECOND_DISPATCH_DELAY_DAYS` keeps its value **and its origin**. No backstop constant is needed. |

**So the entire bundle side of this ruling is a no-op**, and the only code that moves is
`createMembership`. That is a much smaller change than the ruling first appeared to require, and
it is the sweep of the compliance layer that shrank it.

🔴 **`BUNDLES_ENABLED` is LIVE** (Coolify, 2026-07-26) and the daily sweep runs in
production, so mechanism 3 is a change to live behaviour, not to dark code.
**Mitigating fact, checked 2026-09-06: `bundle_dispatches` holds 0 rows**, because
no bundle has been sold. There is no migration of existing rows to design, and
that is true only until the first bundle sells.

## 7. What this unblocks

- **The stage-9 emails.** They can now quote a date, which was the thing blocking
  them (`journey-spine.md` owed item 4, and `retest-mechanism-map.md` §4).
- **The included-month mechanic** from the 2026-08-27 ruling.
- **The result-driven cadence proposal** (`04_products/results-engine/2026-09-06-result-driven-retest-cadence.md`),
  whose §5 depended on this and now has its answer.

## 8. Still open after this

1. ~~**The timed-bundle fallback** (§5). Blocks building mechanism 3.~~ ✅ **CLOSED 2026-09-07: purchase + 90, i.e. the timed bundles are EXEMPT** (§5a). No terms change, no Ewa re-approval, no code change. Mechanism 3 keeps today's behaviour.
2. **Confirm the mechanism 8 carve-out** (§4). Keith. One line.
3. ~~**Auto-renew versus opt-in at day 30** (2026-08-27 ruling §4.2). Keith.~~ ✅ **CLOSED 2026-09-07: AUTO-RENEW.** The card is charged on day 31 automatically, with a price line on all kit pages (new site only) and a reminder around day 23 to 25 that doubles as the stage-9 continuation email. Doc: `2026-09-07-auto-renew-at-day-30.md`. 🔴 **It raised a compliance gap that is a launch gate:** the UK subscription-contracts regime (DMCC Act 2024 Part 4) appears nowhere in `03_compliance`. See `../03_compliance/2026-09-07-dmcca-subscription-regime-gap.md`.
4. **What a free first month does to £47** and the VAT threshold. Keith, accountant.
5. **Prepaid-or-included for sub-90-day rechecks** (cadence proposal §8). Keith.
6. Defects 3a and 3b in `retest-mechanism-map.md`. Build, behind the flag.

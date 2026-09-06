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
| 3 | Timed bundles (Prove-It, Full-picture) | **Purchase** | 🔄 **Moves.** See §5, it has a consequence |
| 4 | Membership retest, flagged | **Stripe checkout** | 🔄 Moves |
| 5 | Membership retest, all-clear | **Stripe checkout** | 🔄 Moves (and is separately unreachable) |
| 6 | Membership later retests | Previous retest | 🔄 Moves (and is separately never called) |
| 7 | All-clear reminder email | Result | ✅ Already complies |
| 8 | Subscriber retest email, seq-04 e5 | `subscription_started` | ⚠️ **Carve-out. See §4** |

Also moving: the **membership included month** (the 2026-08-27 ruling) and
`memberships.started_at`, which `createMembership` stamps from checkout today.

**Half the mechanisms already comply**, which is worth stating plainly: this
ruling is less a change of direction than the majority position winning.

## 4. The one carve-out, and it is not a loophole

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

🔴 **OPEN, and it is Keith's. Three options:**

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

## 6. Code carriers (flagged, not changed)

Application code is its own task with its own verification (decision-sweep
invariant 4). Nothing below has been edited.

| File | What changes |
|---|---|
| `lib/membership/sync.ts` | `createMembership` takes the result date, not `new Date()`, for both `started_at` and `firstRetestDueAt`. The result is already readable via `latestResultReceivedAt`. |
| `lib/bundles/checkout.ts` | `secondDispatchDueAt` stops stamping purchase + 90; the row is created with a null `due_at`. |
| Result hook (`lib/results/processResult.ts`) | Gains the Prove-It / Full-picture branch that fills `due_at = result + 90`, alongside the Confirmation branch it already has. |
| `lib/bundles/config.ts` | `SECOND_DISPATCH_DELAY_DAYS` keeps its value; only its origin moves. Plus whatever §5 decides. |

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

1. **The timed-bundle fallback** (§5). Keith. Blocks building mechanism 3.
2. **Confirm the mechanism 8 carve-out** (§4). Keith. One line.
3. **Auto-renew versus opt-in at day 30** (2026-08-27 ruling §4.2). Keith.
4. **What a free first month does to £47** and the VAT threshold. Keith, accountant.
5. **Prepaid-or-included for sub-90-day rechecks** (cadence proposal §8). Keith.
6. Defects 3a and 3b in `retest-mechanism-map.md`. Build, behind the flag.

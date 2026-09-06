# Retest mechanism map: every rule that stamps a retest date, and which ones disagree

**Status:** REFERENCE, living. Built 2026-09-06 by reading the code, not the docs.
**Owner workspace:** `04_products/results-engine`.
**Read with:** `2026-07-17-retest-cadence-table.md`, which is the other axis and is
**still unsigned**. See the warning in section 5 before sending it to Ewa again.

> **This is not the cadence table, and the difference is the point.**
> `2026-07-17-retest-cadence-table.md` answers *"what interval should we RECOMMEND
> for this result state"*. That is a clinical question and it is Ewa's.
> **This file answers a different one: what date does the system actually STAMP,
> from which anchor, into which column, and behind which flag.** That is a
> mechanism question and it is ours. The emails need this one, because an email
> cannot quote a recommendation; it can only quote a stored date.

---

## 1. The table

Eight mechanisms compute a retest date. Six are constants in the app, two are
timings in Customer.io. Every value below was read from the file named, on
2026-09-06.

| # | Mechanism | Constant / timing | Value | **Anchored to** | Date lands in | Gate | Live? |
|---|---|---|---|---|---|---|---|
| 1 | Confirmation bundle recheck | `CONFIRMATION_INTERVAL_DAYS` | **0 days** | The **first result** (trigger time) | `bundle_dispatches.due_at` | `BUNDLES_ENABLED` | Off. **Ewa signed the 0 on 2026-07-26.** |
| 2 | Confirmation bank (all-clear) | `BANK_RECHECK_MONTHS` | **6 months** | The **first result** | `bundle_dispatches.due_at` | `BUNDLES_ENABLED` | Off |
| 3 | Timed bundles (Prove-It, Full-picture) | `SECOND_DISPATCH_DELAY_DAYS` | **90 days** | **Purchase** | `bundle_dispatches.due_at` | `BUNDLES_ENABLED` | Off |
| 4 | Membership first retest, flagged marker | `FIRST_CYCLE_RETEST_DAYS` | **90 days** | **Stripe checkout** (`started_at`) | `memberships.next_retest_due_at` | `MEMBERSHIP_ENABLED` | Off |
| 5 | Membership first retest, all-clear | `ANNUAL_RETEST_DAYS` | **365 days** | Stripe checkout | `memberships.next_retest_due_at` | `MEMBERSHIP_ENABLED` | 🔴 **Cannot fire. See 3a.** |
| 6 | Membership second and later retests | `nextRetestAfter` (365) | **365 days** | Previous retest | nothing | `MEMBERSHIP_ENABLED` | 🔴 **Never called. See 3b.** |
| 7 | All-clear retest reminder email | `RETEST_REMINDER_MONTHS` | **6 months** | The **result** | Customer.io `retest_due_at` attribute | `RETEST_REMINDER_ENABLED` | Off. CIO campaign 23, draft. |
| 8 | Subscriber retest email (seq-04 e5) | sequence delay | **+75 days**, to land results by day 90 | `subscription_started` | Customer.io delay, no stored date | Supplements not live | Off |

**Files:** 1, 2, 3 in `frontend/lib/bundles/config.ts`. 4, 5, 6 in
`frontend/lib/membership/entitlement.ts`. 7 in `frontend/lib/results/processResult.ts`.
8 in `frontend/email-templates/sequences/seq-04-subscriber-onboarding.md`.

### What customer copy promises, which stores no date at all

| Surface | Says |
|---|---|
| Dashboard retest CTA (`classifier.ts`) | "Retest in 6-12 months" |
| `how-it-works`, `faq`, `lp/testosterone`, `lp/hormone-recovery` | "6 to 12 months" |
| `lib/results/biomarker-copy.ts` | 6-12 months; Vitamin D is **seasonal** ("autumn or winter"), not a month count |
| `lp/collagen` | "a retest at **90 days**" (hs-CRP movement, so bucket B: defensible) |
| `thresholds.md`, optimal T | "retest 6-12 mo" |

**These now agree with each other.** That is worth stating, because the 2026-07-17
pack says they do not, and it is the reason section 5 exists.

---

## 2. The anchor problem, stated once

The intervals are mostly reconcilable. **The anchors are not**, and the anchor is
what turns an interval into a date an email can quote.

Three different anchors sit in the code today, for windows a customer experiences
as one thing:

- **Purchase** (mechanism 3)
- **Stripe checkout** (mechanisms 4, 5)
- **The result landing** (mechanisms 1, 2, 7)

A slow lab separates purchase from result by days or weeks, so these are not
three names for one moment. The 30-day membership offer window is anchored to the
result, and the **2026-08-27 first-month ruling** puts a month of membership
inside the kit price, anchored to purchase. `01_strategy/STATE.md` already carries
this as the next decision and it is Keith's. **This table is the argument for
resolving it: the anchor is not a membership detail, it is the field eight
mechanisms and every retest email read from.**

---

## 3. Three defects the map exposes

### 3a. The all-clear member gets a 90-day retest, and the code says he must not

`firstRetestDueAt` picks 90 or 365 from `memberHasMarkerToMove`, which returns
true when the member has **any** row in `lab_results`. It never consults the
classifier; that is a documented v1 simplification. But the checkout route gates
joining on `canJoinMembership`, which requires a result **received within the last
30 days**. So every member has a row, the predicate is always true, and
**mechanism 5 is unreachable**. It also returns true on a read error.

The consequence is not neutral. `entitlement.ts` states the rule it is breaking,
in its own comment: *"Retesting a normal panel at 90 days tells him nothing he
does not already know, and charging for it would be selling a test we do not
think he needs."* Today every all-clear member is sent exactly that kit, at our
cost, and it contradicts bucket C of the clinical table.

**The 365 is unit-tested**, in `scripts/test-membership.ts`, which passes the
boolean in directly. The test proves the arithmetic and cannot see that the input
is impossible.

### 3b. The membership retest is a one-shot, and the forecast sells it as annual

Nothing in production calls `nextRetestAfter`. `next_retest_due_at` is written in
exactly one place, `createMembership`, and never again. The nightly sweep stamps
`retest_claimed_at` when it dispatches, and both `entitlementState` and the
sweep's own query treat a claimed row as finished forever.

So a member gets **one retest, ever.** After it he pays GBP 47 a month
indefinitely and the entitlement never returns.
`financial-model/2026-08-24-membership-year-1-forecast.md` says *"One retest
included per year."* The build does not do that, and the gap widens every year a
member stays.

### 3c. Nothing connects a member's retest to the reminder email

Mechanism 7 stamps `retest_due_at` only on a **whole-result all-clear**, for kit
buyers. A member's retest is a real dispatched kit that arrives through
`bundle_dispatches` as `bundle_type: 'membership_retest'`, so the customer meets
it through the **address-check** sequence, not through a retest reminder. There is
no email today that tells a member their retest date is coming, which is the
`next_retest_due_at` value this table exists to make quotable.

---

## 4. What an email can quote today

Answering the question directly, because it is why this file was asked for.

| If the email is to... | Quote | Caveat |
|---|---|---|
| A member, about their retest | `memberships.next_retest_due_at` | The only stored, member-specific retest date. Anchored to Stripe checkout, which section 2 says is probably the wrong anchor, and today it is always checkout + 90. |
| An all-clear kit buyer | CIO `retest_due_at` | Result + 6 months. Needs `RETEST_REMINDER_ENABLED` on, which needs Ewa on the copy and campaign 23 out of draft. |
| A supplement subscriber | nothing stored | seq-04 e5 is a relative delay from `subscription_started`. No date exists to quote; the email says "day 90" as prose. |
| A bundle holder | `bundle_dispatches.due_at` | Present for all three bundle types, gated off. |

**There is no single field meaning "this customer's next retest".** Four stores
hold four partial answers under three gates. If one field is wanted, that is a
build task and it should be specified after the anchor is decided, not before.

---

## 5. ⚠️ Before the 2026-07-17 cadence table is chased again

That pack asks Ewa to resolve a contradiction **that has since been fixed**. Its
section 1 says the dashboard button says "3 months", the card copy says "3-6
months", and the marketing site says "6 to 12 months". Checked 2026-09-06:
`classifier.ts` now reads `'Retest in 6-12 months'`, `biomarker-copy.ts` contains
no "3-6 months" string, and both landing pages say "6 to 12 months". Its section
5, "What changes once you sign", lists work that has already been done.

The clinical content is still worth signing, and the symptom overlay in its
section 2a is still unresolved and still genuinely Ewa's. But **the justification
must be rewritten before it is sent**, or she rules on a state of the world that
no longer exists.

---

## 6. Owed

| # | Item | Owner |
|---|---|---|
| 1 | **The anchor decision** (section 2). Blocks every retest email. | Keith |
| 2 | 3a: make `memberHasMarkerToMove` consult the classifier, or accept 90 days for everyone and delete the 365 | Keith, then build |
| 3 | 3b: advance the cycle on claim, or change the forecast and the copy to say one retest ever | Keith, then build |
| 4 | 3c: decide whether a member gets a retest-due email at all | Keith |
| 5 | Rewrite the 2026-07-17 pack's premise, then re-send | Keith, then Ewa |
| 6 | The symptom overlay red-flag line (that pack's Q4b) | Ewa |

**Nothing in this file is a clinical decision and nothing in it changes code.** It
records what the code does today, so the decisions above can be made against facts
rather than against four documents written at different times.

---

## 7. A design answer to all of this (added 2026-09-06)

Keith, reading the map: *"a retest can be fired at any time based on the results. If testosterone
is low, a recheck can be fired within days as opposed to weeks or months."* Correct, and mechanism 1
is already exactly that. **`2026-09-06-result-driven-retest-cadence.md` proposes generalising it**:
one exhaustive `Record<ResultState, RetestRule>` that every mechanism in the table above reads from,
so the cadence becomes a property of the result rather than of whichever mechanism fired.

It closes owed items 1 and 2 in section 6 as a side effect (a result-driven cadence can only be
anchored to the result, and the membership stops needing a cadence rule of its own). It does NOT
close item 3, the one-shot.

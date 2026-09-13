# Retest mechanism map: every rule that stamps a retest date, and which ones disagree

**Status:** REFERENCE, living. Built 2026-09-06 by reading the code, not the docs.
**Last extended:** 2026-09-08 — defects **3d, 3e and 3f** added from two questions Keith
asked about ordering a retest through the app. All three were found by reading the code,
and all three are about the same missing thing: **there is no customer-initiated route to
a retest anywhere in the product**, for a member or a non-member.
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
| 1 | Confirmation bundle recheck | `CONFIRMATION_INTERVAL_DAYS` | **0 days** | The **first result** (trigger time) | `bundle_dispatches.due_at` | `BUNDLES_ENABLED` | 🔴 **LIVE.** Ewa signed the 0 on 2026-07-26. |
| 2 | Confirmation bank (all-clear) | `BANK_RECHECK_MONTHS` | **6 months** | The **first result** | `bundle_dispatches.due_at` | `BUNDLES_ENABLED` | 🔴 **LIVE** |
| 3 | Timed bundles (Prove-It, Full-picture) | `SECOND_DISPATCH_DELAY_DAYS` | **90 days** | **Purchase** (EXEMPT from the anchor ruling, 2026-09-07) | `bundle_dispatches.due_at` | `BUNDLES_ENABLED` | 🔴 **LIVE** |
| 4 | Membership first retest, flagged marker | `FIRST_CYCLE_RETEST_DAYS` | **90 days** | **Stripe checkout** (`started_at`) | `memberships.next_retest_due_at` | `MEMBERSHIP_ENABLED` | Off |
| 5 | Membership first retest, all-clear | `ANNUAL_RETEST_DAYS` | **365 days** | Stripe checkout | `memberships.next_retest_due_at` | `MEMBERSHIP_ENABLED` | 🔴 **Cannot fire. See 3a.** |
| 6 | Membership second and later retests | `nextRetestAfter` (365) | **365 days** | Previous retest | nothing | `MEMBERSHIP_ENABLED` | 🔴 **Never called. See 3b.** |
| 7 | All-clear retest reminder email | `RETEST_REMINDER_MONTHS` | **6 months** | The **result** | Customer.io `retest_due_at` attribute | `RETEST_REMINDER_ENABLED` | Off. CIO campaign 23, draft. |
| 8 | Subscriber retest email (seq-04 e5) | sequence delay | **+75 days**, to land results by day 90 | `subscription_started` | Customer.io delay, no stored date | Supplements not live | Off |

**Files:** 1, 2, 3 in `frontend/lib/bundles/config.ts`. 4, 5, 6 in
`frontend/lib/membership/entitlement.ts`. 7 in `frontend/lib/results/processResult.ts`.
8 in `frontend/email-templates/sequences/seq-04-subscriber-onboarding.md`.

> 🔴 **Correction, 2026-09-06 (same day).** The first version of this table marked
> mechanisms 1, 2 and 3 **Off**. That was wrong and it was never verified, only
> assumed from the fact that they sit behind a flag. **`BUNDLES_ENABLED=true` was
> set in Coolify on 2026-07-26** with `ACCOUNT_ADDRESS_ENABLED=true`, the app was
> redeployed, the migration was applied to the live Supabase project, and the
> QStash schedule (`scd_5YpFh9tnXmSe2uZewrHZ6iNT3rTW`, `0 6 * * *`) has been
> POSTing to `andro-prime.com/api/jobs/bundle-sweep` daily ever since. All three
> are **live**, and `09_website-app/STATE.md` said so the whole time.
>
> **What is actually true, checked against the live database on 2026-09-06:**
> `bundle_dispatches` **0 rows**, `memberships` **0 rows**, `kit_orders` **3**,
> `lab_results` **1**. So the bundle machinery is armed and has never fired,
> because no bundle has been sold. Membership has no go-live record and no rows.
>
> **The distinction matters and it is not pedantry.** "Gated off" means a decision
> stands between the defect and a customer. "Live with no traffic" means **the
> next bundle sold starts the machinery with no further gate**, and the only
> reason nothing has gone wrong is that nobody has bought one. Those are different
> risk positions and this file asserted the safer one without checking.
>
> **A flag's presence in the code is not its value in production.** The value
> lives in Coolify, and the only readable record of it in this repo is a dated
> STATE entry. Read that before writing "off".

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
three names for one moment.

> ✅ **RESOLVED 2026-09-07 (Keith): every CLINICAL CADENCE anchors to the RESULT
> LANDING.** Decision doc:
> `../../01_strategy/2026-09-07-anchor-everything-to-the-result.md`.
> Mechanisms 1, 2 and 7 already complied. **Mechanisms 4, 5 and 6 move**, along
> with the membership included month and `memberships.started_at`. **Two carve-outs:**
> mechanism 8 (seq-04 e5 measures supplement effect, so its clock legitimately
> starts at `subscription_started`) and mechanism 3, below.
>
> ⚠️ **Mechanism 3 is EXEMPT (Keith, 2026-09-07): timed bundles stay at
> purchase + 90.** Anchoring them to the result would have contradicted the live
> T&Cs, approved by Keith and Ewa on 2026-07-25 and published on `/terms` the next
> day, which promise the retest *"about 90 days after your purchase"*. No
> result-anchored date can satisfy that, since the result always lands after the
> purchase. The 90-day spacing is the **product** for Prove-It and Full-Picture,
> not a clinical cadence. **Result: no terms change, no Ewa re-approval, and no
> code change at all on the bundle side.** Mechanisms 1 and 2 were already
> result-anchored and are untouched.
>
> **So the anchor ruling's only code carrier is `createMembership`.** Four
> mechanisms already complied, two are exempt, and the two membership constants
> are what actually move.

---

## 3. Six defects the map exposes

### 3a. ✅ CLOSED 2026-09-13. The all-clear member gets a 90-day retest, and the code says he must not

> **FIXED.** Keith, 2026-09-13: *"point the check at the results engine instead
> of the row count."* `memberHasMarkerToMove` now loads the member's most recent
> result, classifies it, and asks `isFlaggedState` — the same predicate the
> retest **panel** rule uses, so cadence and panel cannot drift apart on what
> "flagged" means. The rule itself is a pure function, `decideRetestCadence` in
> `lib/membership/entitlement.ts`; `sync.ts` keeps only the IO.
>
> **Four outcomes, deliberately not collapsed to a boolean:** `flagged` → day 90,
> `all-clear` → annual, `no-result` → annual (nothing to move, and not an error),
> `unreadable` → day 90 **and marked `degraded`**. The failure direction is
> unchanged and still favours the member, but the caller now raises a **Sentry
> alert** on the degraded path rather than a console line, because the
> consequence is a dispatch moved by 275 days in silence.
>
> **Mechanism 5 is now reachable**, which is the whole point.
>
> ⚠ **One trap the fix uncovered and the test now pins.** `normal-testosterone`
> is the 12-to-15 nmol/L low-end-of-normal band and it badges as **Monitor**,
> filled, so it **IS flagged**: a man there correctly gets the 90-day cadence.
> Only `optimal-testosterone` is all-clear. The state's name is the only thing
> suggesting otherwise, and the first draft of the test got it wrong.
>
> `scripts/test-membership.ts` section 2 grew from 5 assertions to 21; the suite
> is 209 → 225. The regression assertion is written as *"an all-clear panel goes
> annual"* rather than as a row count, so the original defect cannot return by a
> different route.

**What follows is the original entry, kept because the reasoning in it is why the
fix is a classifier call and not a SQL one.**

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

### 3b. ✅ CLOSED 2026-09-13. The membership retest is a one-shot, and the forecast sells it as annual

> **FIXED.** Keith, 2026-09-13, took option 1: *"introducing a small table holding
> one row per dispatched retest."* **That table already existed** — `20260826_membership_v1.sql`
> generalised `bundle_dispatches` from "the second kit of a bundle" to "a kit owed
> to a user at a future date", with `source`, `membership_id` and a partial unique
> index for the double-dispatch guard. So the work was the half that had never
> been built: letting the date roll forward, and **repairing the two guards that
> half depends on.**
>
> **The rule.** The sweep's selection query drops `retest_claimed_at is null`; the
> claim update now advances `next_retest_due_at` by `nextRetestAfter(...)` in the
> same statement, compare-and-set on the old due date. `retest_claimed_at` keeps
> its storage and narrows its meaning to *when the last retest was released*.
> `entitlementState` stops treating `claimed` as terminal: it wins only inside
> `RETEST_IN_FLIGHT_DAYS` (14), so a member sees "On its way" while the kit is in
> the post and a countdown afterwards, which is what the account screen's copy has
> promised all along.
>
> 🔴 **TWO DEFECTS FOUND IN THE GUARD WHILE IMPLEMENTING IT.** Both were harmless
> only because the terminator was masking them, so the code must not ship without
> `20260913_membership_retest_rolls_forward.sql`:
>
> 1. **`membership_retest` was never an allowed `bundle_type`.** The sweep inserts
>    it; `bundle_dispatches_bundle_type_check` allows only `confirmation`,
>    `prove_it`, `full_picture`. The string appears in no migration. Verified
>    against the live database. **Every membership retest insert would have
>    failed**, and because the sweep claims before it inserts, each member would
>    have been stamped claimed and sent nothing — permanently, under the old rule.
> 2. **The one-open-retest unique index guards a status that does not exist.** Its
>    predicate is `status in ('scheduled','address_check_sent')`, but the table has
>    never allowed `address_check_sent`. The real machine is
>    `scheduled → trigger_met → awaiting_window → dispatched`, so the guard covered
>    one open state of three. Removing the terminator without fixing this opens a
>    second-kit window mid-flight.
>
> `scripts/test-membership.ts` 225 → **236 assertions**; the regression is asserted
> as "an OLD claim no longer blocks the next retest" plus "a year later he IS owed
> another, which he never was before".
>
> ✅ **The migration was APPLIED to production on 2026-09-13** on Keith's explicit
> go-ahead, and verified by reading the live catalogue rather than a success flag.
> Ledger row `20260913002042`. No data was touched: no column added, none dropped,
> no row rewritten.

**What follows is the original entry.**

Nothing in production calls `nextRetestAfter`. `next_retest_due_at` is written in
exactly one place, `createMembership`, and never again. The nightly sweep stamps
`retest_claimed_at` when it dispatches, and both `entitlementState` and the
sweep's own query treat a claimed row as finished forever.

So a member gets **one retest, ever.** After it he pays GBP 47 a month
indefinitely and the entitlement never returns.
`financial-model/2026-08-24-membership-year-1-forecast.md` says *"One retest
included per year."* The build does not do that, and the gap widens every year a
member stays.

### 3c. 🟡 DRAFTED 2026-09-13, NOT APPROVED. Nothing connects a member's retest to the reminder email

> **The email exists as a draft and the Customer.io campaign is built and inert.**
> Keith, 2026-09-13: *"create the email. Then run the pre-flight. You'll have to
> then create the email in customer.io."* Copy:
> `09_website-app/frontend/email-templates/sequences/membership-retest-due.md`.
> Campaign **25**, `seq-08 — Membership Retest Due`, state `draft`, email action
> `sending_state: draft`, date-triggered on `membership_retest_due_at` at 7 days
> before, template 56. Nothing can send: the campaign is draft, the attribute is
> never stamped, and `MEMBERSHIP_ENABLED` is off.
>
> **It is the retest notice only, not the renewal notice.** The suggestion was to
> build one email rather than two, but that rests on P1 (DMCC Act 2024 Part 4),
> which is open with the solicitor. Writing to an unsettled legal requirement
> means writing it twice, and a renewal notice that is wrong is worse than one
> that is absent.
>
> 🔴 **THE PRE-FLIGHT VERDICT IS `amber-ewa`, NOT APPROVED**, and the drafting pass
> did not reach it. Deterministic floor was clean on both units, and an
> independent `compliance-reviewer` pass (required: the agent that drafts copy may
> not clear it) overturned the drafting verdict on a point no text-level check
> could see. **CA-022's approval is scoped to "every kit buyer whose result came
> back all-clear"; this email's audience is the flagged cohort, See-Your-GP
> included**, because the 90-day cadence is what `decideRetestCadence` returns for
> a flagged member. That makes it the first surface sending a retest prompt to a
> GP-routed man, which is **3f**, reserved to Ewa by Owed row 9.
>
> **Owed, and none of it should open a new ask:** the audience question and the
> Phase-0 confirmatory-testing question (CA-026 audit F4) both belong in the
> **already-drafted, UNSENT** packet, Gmail `r1901433818987540044`. Adding a
> question while it is unsent is free. The entitlement paragraph is contract copy
> against terms with no membership section, so it waits on P1 and is Keith's.
>
> ⚠ **Two corrections the independent pass forced into the copy.** The draft had
> trimmed CA-022's clause *"A retest is the only way to find out how your levels
> have changed since last time"*, which is the retest framing `03_compliance`
> mandates; restored verbatim. And `ACCOUNT_ADDRESS_ENABLED` was missing from the
> activation gate list, so the email's only call to action pointed at a page that
> renders no address while that flag is off; added, matching CA-027's gate on the
> identical CTA.
>
> **Still owed in code:** nothing stamps `membership_retest_due_at`. Until it does,
> the campaign cannot fire.

**What follows is the original entry.**

Mechanism 7 stamps `retest_due_at` only on a **whole-result all-clear**, for kit
buyers. A member's retest is a real dispatched kit that arrives through
`bundle_dispatches` as `bundle_type: 'membership_retest'`, so the customer meets
it through the **address-check** sequence, not through a retest reminder. There is
no email today that tells a member their retest date is coming, which is the
`next_retest_due_at` value this table exists to make quotable.


### 3d. A member cannot claim his retest early, and paying to go early DUPLICATES it rather than consuming it

**Raised by Keith, 2026-09-08:** *"What if a member wants to order his retest earlier
than the retest order period? For instance, a retest that is set for three months, he
then wants to order his retest two days after his initial results. What then?"*

**Nothing happens, and there is no mechanism for it to happen through.**
`entitlementState` returns `pending` and `app/(app)/membership/page.tsx` renders that
as prose -- *"88 days away"* -- with no button, no request, and no contact link on the
block. `next_retest_due_at` is written in **exactly one place**, the `INSERT` in
`createMembership` (`lib/membership/sync.ts:81`), and is never updated by any route,
job or screen. The admin dashboard touches `kit_orders` only, so support has no
override either: bringing a date forward means editing Supabase by hand.

🔴 **The defect is not the missing button. It is what the only available workaround
does.** His one self-serve option is to buy another kit at full price from `/kits`, and
**that purchase does not consume the entitlement**: `retest_claimed_at` is written only
by the nightly sweep. So the sweep still fires on the original date, sees `due`, and
dispatches a **second physical kit** -- of `lastOrder.kit_type`, which is now the kit he
just bought himself. He pays twice, receives two kits, and the included one arrives 88
days after he stopped needing it.

⚠ **It also collides with an adopted rule.**
`2026-09-07-fast-recheck-must-be-prepaid-or-included.md` says a result-triggered recheck
inside 90 days *"must be prepaid or included in an entitlement the customer already
holds. It may never trigger a new sale."* That rule was scoped to **system-triggered**
rechecks, so this case is not literally in breach. It is the same shape and more
awkward: the man **already holds** the entitlement, the rule's own justification ("the
kit is already paid for") is satisfied, and the software's only answer is a new sale.

🔴 **THE REASON THE FIX IS NOT A "RETEST NOW" BUTTON.** There is a real clinical argument
for the wait: two days after a result, vitamin D and ferritin have not moved, and
retesting them spends a kit to learn nothing. But the opposite case is the one that
matters. A man whose testosterone came back low needs a **second morning sample for his
GP**, and Ewa signed `CONFIRMATION_INTERVAL_DAYS = 0` -- immediately -- for exactly that.
That 0-day recheck lives in the **Confirmation bundle** (mechanism 1), which is a
separate purchase; a member who bought a plain kit plus membership does not have it.

**So the system cannot today tell "he is impatient" from "he is the case Ewa signed a
same-day recheck for". Both get "88 days away".** The fix is a rule about WHICH RESULT
STATES may pull the date forward, which is section 7's proposal, not a control on the
membership page.

⚠ Compounding: the date is anchored to **Stripe checkout, not the result** (section 2),
and per 3a every member gets 90 days regardless of whether he has a marker to move. So
the interval he is waiting out may not be his interval at all.

### 3e. A non-member has no way to reorder a kit, anywhere in the app

**Raised by Keith, 2026-09-08**, asking how a customer who needs another testosterone kit
orders one.

**There is no reorder path.** No "order again", no repurchase, no order history. The
account page (`app/(app)/account/page.tsx`) offers exactly three links: the results
dashboard, subscriptions, and a `mailto:` to support. The only in-app pointer is the
results dashboard CTA **"Retest in 6-12 months" -> `/kits`**, which lands him on the
public catalogue index rather than on the kit he actually took.

From there he buys as a brand-new customer: full price, re-enter the address, no order
history, nothing carried across. Nothing in the checkout path recognises him as a
returning customer.

### 3f. A flagged result never suggests a retest; only an all-clear does

Found while answering 3e, and it is the sharper half of it.

`CTAS.retestReminder` is attached in three places in `classifier.ts`:
`optimal-testosterone`, the three SHBG states, and the closing `normal` fallback. Every
one of those is a result with **nothing to sell against**. A man whose testosterone came
back low or equivocal gets `CTAS.gpReferral` instead, correctly per CA-014 -- and
therefore **no retest prompt at all, ever, anywhere in the product**.

The email that would otherwise catch him does not run either: mechanism 7 sits behind
`RETEST_REMINDER_ENABLED` (off, CIO campaign 23 in draft) and stamps `retest_due_at`
only on a **whole-result all-clear**.

🔴 **So the man most likely to need a second test is the one the product never invites to
take one, on either surface.** This is not a bug in any single rule -- CA-014 is right
that a GP-routed result must carry no upsell -- it is a gap between two rules that are
each correct: "no upsell on a GP referral" and "tell people when to retest" have been
implemented as though they were the same decision.

---

## 4. What an email can quote today

Answering the question directly, because it is why this file was asked for.

| If the email is to... | Quote | Caveat |
|---|---|---|
| A member, about their retest | `memberships.next_retest_due_at` | The only stored, member-specific retest date. Anchored to Stripe checkout, which section 2 says is probably the wrong anchor, and today it is always checkout + 90. |
| An all-clear kit buyer | CIO `retest_due_at` | Result + 6 months. Needs `RETEST_REMINDER_ENABLED` on, which needs Ewa on the copy and campaign 23 out of draft. |
| A supplement subscriber | nothing stored | seq-04 e5 is a relative delay from `subscription_started`. No date exists to quote; the email says "day 90" as prose. |
| A bundle holder | `bundle_dispatches.due_at` | Present for all three bundle types and **live since 2026-07-26**, but 0 rows exist because no bundle has been sold. |

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
| 1 | ~~**The anchor decision** (section 2). Blocks every retest email.~~ ✅ **DECIDED 2026-09-07: the result landing**, with the timed bundles **exempt at purchase + 90**. No terms change, no code change on the bundle side. Nothing here is owed | Closed |
| 2 | ~~3a: make `memberHasMarkerToMove` consult the classifier, or accept 90 days for everyone and delete the 365~~ ✅ **DECIDED AND BUILT 2026-09-13.** Keith took the classifier. Pure rule `decideRetestCadence` in `entitlement.ts`, IO in `sync.ts`, four non-collapsed outcomes, Sentry alert on the degraded read. Mechanism 5 is reachable | Closed |
| 3 | ~~3b: advance the cycle on claim, or change the forecast and the copy to say one retest ever~~ ✅ **DECIDED, BUILT AND APPLIED 2026-09-13.** Keith took advance-on-claim via the dispatch table, which already existed. Two latent guard defects found and repaired in the same migration, applied to production and verified live | Closed |
| 4 | 3c: decide whether a member gets a retest-due email at all. **Copy drafted and CIO campaign 25 built as a DRAFT on 2026-09-13**; pre-flight verdict `amber-ewa`. The audience question (approved copy travelling to a flagged cohort) and the Phase-0 question ride the unsent packet `r1901433818987540044`; the entitlement paragraph waits on P1. Attribute not yet stamped | Keith, then Ewa on the audience |
| 5 | ~~Rewrite the 2026-07-17 pack's premise, then re-send~~ ✅ **Premise, §3a and §5 rewritten 2026-09-07**, and the sign-off email is DRAFTED (Gmail `r1901433818987540044`, five lettered questions). **Sending is Keith's act and has not happened.** | Keith to send |
| 6 | The symptom overlay red-flag line (that pack's Q4b) — now **question 5 of the drafted email**, with a proposed red-flag list to accept, amend or replace | Ewa, once Keith sends |
| 7 | 3d: decide which result states may pull a member's retest date forward, and make a self-bought kit **consume** the entitlement rather than run alongside it. The second half is a defect fix and needs no ruling; the first half is section 7's proposal and needs Ewa on the intervals | Keith, then Ewa, then build |
| 8 | 3e: decide whether a returning customer gets a reorder path at all, and whether it is priced differently from a first purchase | Keith, then build |
| 9 | 3f: decide what a GP-routed result says about retesting, given CA-014 forbids a kit upsell on it. A date with no purchase attached is the obvious candidate and is Ewa's to word | Keith to scope, Ewa to word |

**Nothing in this file is a clinical decision.** It records what the code does
today, so the decisions above can be made against facts rather than against four
documents written at different times.

⚠ **The line that used to follow, "and nothing in it changes code", was retired
on 2026-09-13.** Items 1 and 2 are now closed by shipped code, and a register
that claims it can never move anything is one nobody updates when it does.

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

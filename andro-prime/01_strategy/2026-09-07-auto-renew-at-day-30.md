# The membership auto-renews on day 31

**Decided:** 2026-09-07 · **Owner:** Keith · **Status:** ADOPTED
**Ruling, verbatim:** *"I don't see why an opt-in is necessary, as we are sticking to our cadence that
the first month is free, and then on day 31, we charge them. I don't see why that's a difference in our
promise."*

**Closes:** `2026-08-27-first-month-included-in-kit-price.md` §4.2, and item 3 of
`2026-09-07-anchor-everything-to-the-result.md` §8.

---

## 1. The decision

**The first 30 days are included in the kit price, and on day 31 the card is charged GBP 47/month
automatically.** No re-consent step, no reactivation flow, no lapse.

A supporting price line goes on **all kit pages**, on the **new site only** (`redesign/direction-f`),
not on the live site.

## 2. What it supersedes, and the recommendation was wrong

`2026-08-27-first-month-included-in-kit-price.md` §4.2 carried an assistant recommendation of **OPT-IN**,
on the grounds that *"a card charging on day 31 for something the kit page called 'included' is the
pattern the conflict-free position forbids."*

**That recommendation was overstated and Keith rejected it correctly.** The reasoning error is worth
recording, because it is the kind that repeats:

**Numan's ASA ruling (A22-1153049) was for BURYING the subscription, not for having one.** The adopted
thesis already states the rule accurately, in the entitlement section of
`2026-08-24-vertical-agnostic-monitoring-thesis.md`: *"it must be prominent at the point of sale rather
than in the T&Cs."* That is a **prominence** requirement. The recommendation collapsed prominence into
opt-in, and they are not the same obligation.

**Keith's cadence argument holds.** The promise is *"the first month is included"*, and charging on day
31 honours it exactly. An included month that quietly evaporates unless the customer re-enters a card is
arguably the worse experience: he has to act to keep a thing he was told he already had.

## 3. A second correction, on where the disclosure goes

Keith, on being told a disclosure statement should sit near the buy button: *"I don't remember seeing
ever on a free trial buy button or near a buy button a disclosure statement, so I think we need to
rethink that."*

**Half right, and the half that is wrong matters.** What ships on real free trials is not a disclosure
statement, it is one short line of **price copy**, which is why it does not register as a compliance
artefact:

| Service | Line, at or beside the CTA |
|---|---|
| Spotify | *"GBP 0 for 1 month, then GBP 11.99 per month after. Cancel anytime."* |
| Audible | *"Try Audible free for 30 days. GBP 7.99/month after 30 days. Cancel anytime."* |
| Amazon Prime | *"After your free trial, Prime is GBP 8.99/month. Cancel anytime."* |

**So the phrase was wrong and the line stays.** It is price information written honestly, not a legal
block, and it converts.

### Why our case is harder than any of those

**Our button says "Order the kit: GBP 99".** That reads as a one-off purchase, because it is one, and
there is no subscription signal anywhere near it.

On Spotify the whole transaction is understood to be a subscription before anyone clicks, so the trial
line is a detail inside a frame the customer already holds. **A man buying a GBP 99 testosterone kit has
no such frame.** He believes he is buying a box that goes through his letterbox. If a charge appears on
day 31, the surprise is total, and *"it was in the T&Cs"* is precisely the defence that failed for Numan.

**The gap between what the button says and what the customer signed up for is wider on our page than on
any of the comparators**, so the standard free-trial line is the floor here, not the ceiling.

## 4. The line, and where it goes

Under the CTA, in the same weight as the surrounding price furniture:

> Includes 30 days of membership. GBP 47/month after. Cancel anytime.

**Scope: all four `/kits/` routes** (`testosterone`, `energy-recovery`, `hormone-recovery`, and the
`kits` index), on `redesign/direction-f` only.

🔵 **NOT DECIDED: the three `/lp/` kit landing pages** (`lp/testosterone`, `lp/hormone-recovery`,
`lp/energy-recovery`). They carry their own buy buttons and are the pages paid traffic hits cold, so the
surprise risk is arguably highest there. **Owner: Keith.**

## 5. The reminder email is not a cost of this decision

It is the same email that was already blocked on the anchor ruling.

Stage 9 was waiting on an anchor so it could quote a date. Under auto-renew, **one email does three jobs
at once**: it says the included month ends on the 14th and GBP 47 goes on the card, which is the
continuation conversation, the reminder the subscription regime is likely to require (§6), and the
prominence evidence if anyone ever asks.

**Send it around day 23 to 25**, so the customer has about a week to decide with the charge date in
front of him. That timing is a proposal, not a ruling: a statutory minimum may govern it (§6).

**This is a stronger position than opt-in, not a weaker one.** Opt-in has no natural moment at which
anything is said to the customer; it simply goes quiet and he lapses.

## 6. What actually binds, and it is not in this workspace

**The UK subscription-contracts regime in Part 4 of the Digital Markets, Competition and Consumers Act
2024 is aimed precisely at free-trial-to-paid conversion**, and it appeared nowhere in `03_compliance`
before today.

Full gap record, including what to ask the solicitor and the honest limits of what is asserted:
**`../03_compliance/2026-09-07-dmcca-subscription-regime-gap.md`**.

**It does not ban auto-renew**, so it does not disturb this ruling. What it adds is a probable
**mandatory reminder** before the included month converts, plus prominence, cancellation-ease and
cooling-off duties. That is why §5 exists.

## 7. Three things to nail down before the line ships

1. **Where the disclosure sits.** Near the price and the CTA, not inside an accordion. This is the
   requirement that actually replaced opt-in.
2. **Reminder timing.** Day 23 to 25 proposed; a statutory minimum may govern.
3. **Cancellation route.** Must be as easy as joining. Worth confirming `/membership` offers self-serve
   cancellation rather than an email-us.

## 8. The build coupling, which is the real risk

**The copy and the trial mechanic have to ship as one piece of work.**

Today the live site is safe because it says nothing about membership, which is exactly why
`2026-08-27-first-month-included-in-kit-price.md` §5 can call the build being out of step *"a launch
blocker, not a live mis-statement to customers."*

Putting the line on the redesign changes that **the moment the redesign merges**, because at that point
the kit page would say *"Includes 30 days of membership. GBP 47/month after"* while:

| Carrier | State today |
|---|---|
| `MEMBERSHIP_ENABLED` | Off. `/membership` `notFound()`s |
| Stripe checkout | **No `trial_period_days` or `trial_end` anywhere in the repo** |
| `lib/membership/sync.ts` `createMembership` | Charges from checkout; nothing defers the first charge |

**That mis-statement would arrive by merge, not by anyone deciding to ship it.** Either the line and the
trial mechanic merge together, or **the line renders behind `MEMBERSHIP_ENABLED`** so it cannot appear
early. **Recommended: the flag**, since it lets the redesign merge on its own schedule.

## 9. Why the build side is easier than opt-in would have been

Stripe implements this natively: `trial_period_days: 30` and it charges on day 31 by itself.
`ACTIVE_MEMBER_STATUSES` in `lib/membership/entitlement.ts` **already includes `trialing`**, and its
comment ties it to the partial unique index `memberships_one_live_per_user` in
`20260826_membership_v1.sql`. **The entitlement layer and the database already model a trialing member
correctly. The only missing piece is checkout opening the trial.**

Opt-in would have needed the larger build: cancel at trial end, a separate resubscribe flow, and a second
entitlement state for *was a member, is not now, could be again*. **Real work, to deliver a worse
experience.**

## 10. Code carriers (flagged, not changed)

| File | What changes |
|---|---|
| Stripe checkout | Add `trial_period_days: 30`. Nothing expresses an included month today |
| `lib/membership/sync.ts` | `createMembership` sets `trialing`, and takes the **result date** (per the anchor ruling) for `started_at` and `firstRetestDueAt` |
| `app/(marketing)/kits/*` | The §4 price line, behind `MEMBERSHIP_ENABLED` |
| Stage-9 sequence | The day 23 to 25 reminder, per §5 |

## 11. Still open after this

1. **The `/lp/` scope question** (§4). Keith.
2. **The DMCCA read** (`../03_compliance/2026-09-07-dmcca-subscription-regime-gap.md`). Solicitor.
3. **Reminder timing and cancellation route** (§7). Follows from 2.

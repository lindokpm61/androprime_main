# Decision: the three `/lp/` kit landing pages carry the subscription price line

**Date:** 2026-09-11
**Owner:** Keith
**Status:** DECIDED
**Closes:** `2026-09-07-auto-renew-at-day-30.md` §4, the last open item in that ruling.

---

## 1. The decision

The three `/lp/` kit landing pages (`lp/testosterone`, `lp/hormone-recovery`,
`lp/energy-recovery`) carry the same line the four `/kits/` routes carry, under
the CTA, in the same weight as the surrounding price furniture:

> Includes 30 days of membership. GBP 47/month after. Cancel anytime.

**It is gated behind `MEMBERSHIP_ENABLED`**, like every other membership surface,
and renders nothing while the flag is off.

Asked as a three-way choice (line on, line off, build the pages and defer the
line), Keith took the line.

## 2. Why §4 left it open, and why the answer is the one it implies

§4 decided the line for all four `/kits/` routes and marked the `/lp/` set NOT
DECIDED, with its own reasoning already pointing here: *"They carry their own buy
buttons and are the pages paid traffic hits cold, so the surprise risk is
arguably highest there."*

That is the whole argument. A `/kits/` reader has usually arrived through the
site and has some frame for what the company sells. A cold click from an ad onto
`/lp/testosterone` has none, the button says **Order the kit: GBP 99**, and it
reads as a one-off purchase because it looks exactly like one. Section 3 of the
same ruling records why our case is harder than Spotify's or Audible's for
precisely this reason.

## 3. What building it surfaced, and it is bigger than the ruling

🔴 **THE HALF OF §4 THAT WAS ALREADY DECIDED HAD NEVER BEEN BUILT.** The line was
ruled onto the four `/kits/` routes on 2026-09-07 and existed nowhere in `app/`,
`components/` or `lib/` except as a private constant inside `/membership`, which
404s while the flag is off. It is built now, on all seven surfaces, from one
shared source (`lib/membership/disclosure.ts`).

🔴 **AND THIRTEEN SENTENCES ACROSS SEVEN SURFACES STILL SAY THE OPPOSITE.**

| Surface | What it says |
|---|---|
| `/kits` | *"no subscription unless you choose one"* |
| `/kits/testosterone`, `/kits/energy-recovery`, `/kits/hormone-recovery` | *"One-off purchase. Results in your personal dashboard. No GP needed."* (twice each) |
| `/lp/testosterone` | *"One-off purchase. Includes lab fees & delivery. No subscription."* + an FAQ answer |
| `/lp/energy-recovery` | *"Secure checkout. No subscription."* |
| `/lp/hormone-recovery` | *"Secure checkout. No subscription."*, *"One-off purchase."*, and an FAQ answer reading *"It is a one-off payment, not a subscription."* |

Under the adopted model nobody chooses a subscription; it arrives with the kit
and charges on day 31. Every one of those sentences is false the moment the flag
goes on.

🔴 **THE WORST ONE IS APPROVED COPY.** *"no subscription unless you choose one"*
is inside **CA-026 C1**, rendered verbatim in the inverted panel on `/kits`, and
the page's own source comment marks it *"rendered VERBATIM. The redraw changes
only the container."* Changing it is not a copy tweak: it needs Keith, a
compliance pre-flight, and a fresh CA record.

**None of it was rewritten.** Rewriting approved customer-facing copy is not
something a rebuild may do, so all thirteen are rendered unchanged and registered
(`09_website-app/redesign-copy-register.md` rows 42 and 42a).

## 4. The interlock that ships instead

`frontend/scripts/verify-subscription-claims.js`, in `npm test`.

It lists every claim on every run. It **fails only when `MEMBERSHIP_ENABLED` is
true**, which is the exact condition that makes the claims false. So:

- the ordinary flag-off build stays green, because nothing is wrong yet;
- the conformance and screenshot runs, which set the flag, go red;
- and **turning the flag on for real is impossible until the copy is swept.**

That converts "somebody must remember to sweep the copy before launch" into a
build failure, which is the shape this repo has repeatedly concluded a rule needs.

⚠ **Do not edit those sentences to clear the check.** The fix is a rewrite from
Keith, a pre-flight, and a fresh CA record for C1; then `CLAIMS` in that script
is updated in the same change.

🔴 **THE PARAGRAPH ABOVE WAS WRITTEN BEFORE THE CHECK WAS TESTED, AND THE CHECK
HAD TWO HOLES. Both fixed later the same day; recorded here because the claim
above was stated more confidently than it had earned.**

1. **It could not see `public/llms.txt`**, which serves the C1 paragraph verbatim,
   including the false clause, on the apex and written specifically for AI
   ingestion. Scope was `app/` and `.tsx` only. **The check reported green over the
   copy most likely to be quoted back at us by a model.** The scope had been drawn
   around where the claims happened to be found rather than around where
   customer-facing copy can live, and a scope drawn from the search that produced
   it can only confirm that search. Now `app/` and `public/`, across `.tsx`,
   `.txt` and `.md`; count 15 to 16.
2. **It was one-directional.** It failed only with the flag ON and an old claim
   present, and was blind to the opposite and worse state: new copy promising GBP
   47 a month while the flag is OFF, against a kit checkout that is
   `mode: 'payment'` with no `subscription_data` and no `trial_period_days`.
   `RENEWAL_CLAIMS` added, with an allow-list for the flag's own machinery.
   Mutation-tested both ways.

**A gate guarding one direction of a two-sided contradiction is not half a gate.
It is a gate that certifies the side it does not check.**

## 5. What is owed

| Item | Owner |
|---|---|
| Rewritten wording for the thirteen one-off / no-subscription sentences | **Keith**, then compliance pre-flight |
| Fresh CA record for CA-026 C1 | **Keith. Business, not clinical.** See below |
| The homepage membership sentence (register row 12a, open since 2026-09-10) | **Keith**, then pre-flight |
| The DMCC Act 2024 Part 4 questions (`03_compliance/2026-09-07-dmcca-subscription-regime-gap.md`) | **Solicitor**, still open |

⚠ The first three are one decision, not three: they are the same fact stated on
nine surfaces. Answering them separately is how they drift.

🔴 **THREE BUILD BLOCKERS WERE ADDED BY THE INDEPENDENT PRE-FLIGHT, 2026-09-11,
and none of them is a copy decision.** Draft and findings:
`09_website-app/2026-09-11-subscription-copy-rewrite-draft.md` §8a.

| Blocker | What is actually wrong | Owner |
|---|---|---|
| **No cancellation route for a membership** | `getSubscriptions` and the portal API both query `supplement_subscriptions` only; a membership owns a row in `memberships`. A membership-only customer, which is EVERY kit buyer under this ruling, gets the empty state, and the portal API 404s, which `BillingPortalButton` does not handle, so the click is a **silent no-op**. The already-ruled disclosure line says **"Cancel anytime"**, so the gap predates the rewrite | **Keith**, build |
| **No included-month mechanic at all** | `app/api/checkout/kit/route.ts` is `mode: 'payment'` with no `subscription_data` and no `trial_period_days`; `lib/membership/sync.ts:71` stamps `startedAt ?? new Date()` at checkout and inserts `status: 'active'`, not `trialing`. So "includes your first 30 days" has no mechanic, and the start date contradicts the anchor ruling that `/membership` already promises customers | **Keith**, build |
| **The rewritten copy must inherit the flag** | The new sentences are the same promise in richer form as `MembershipDisclosure`, whose header argues that a promise in front of a checkout that bills once is worse than an omission | **Keith**, build |

⚠ **The Stripe portal's `subscription_cancel` setting is a dashboard value with no
repo trace.** Per the pre-flight skill's invariant 6 it is unverified until
exercised, not read.

## 6. The rewrite is a BUSINESS decision, not a clinical one (Keith, 2026-09-11)

This doc first listed the CA-026 C1 re-record as owed to **Keith and Ewa**. That
was wrong and Keith corrected it.

**What is changing is payment terms: what you pay, and when.** That is commercial
copy. Ewa's remit on CA-026 is recorded in the approval register as
*"Keith + Ewa (clinical/principle)"*, and the register already carries a
business-only path: CA-021 is logged *"APPROVED by Keith, business, in-session"*.
So a C1 re-record for the subscription clause is Keith's, and a compliance
pre-flight still runs because it is customer-facing copy.

🔴 **THE BOUNDARY INSIDE C1, AND IT IS WORTH KNOWING BEFORE ANYONE DRAFTS.** The
C1 paragraph holds two different kinds of sentence:

| Clause | Kind | Whose |
|---|---|---|
| *"The price on the card is everything you pay… no subscription unless you choose one"* | Commercial terms | **Keith** |
| *"If a result needs action, the next step is a GP conversation, and we earn nothing from it"* | The conflict-free PRINCIPLE, the separation of incentives | **Ewa**, if it is touched |

The rewrite only needs the first. **If a draft leaves the second clause alone,
Ewa is not in the loop at all.** If a draft reshapes the paragraph in a way that
moves or reworks the GP sentence, it re-enters her remit, which is a reason to
keep the two clauses structurally separate in whatever replaces it.

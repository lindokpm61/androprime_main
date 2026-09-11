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

## 5. What is owed

| Item | Owner |
|---|---|
| Rewritten wording for the thirteen one-off / no-subscription sentences | **Keith**, then compliance pre-flight |
| Fresh CA record for CA-026 C1 | **Keith and Ewa** |
| The homepage membership sentence (register row 12a, open since 2026-09-10) | **Keith**, then pre-flight |
| The DMCC Act 2024 Part 4 questions (`03_compliance/2026-09-07-dmcca-subscription-regime-gap.md`) | **Solicitor**, still open |

⚠ The first three are one decision, not three: they are the same fact stated on
nine surfaces. Answering them separately is how they drift.

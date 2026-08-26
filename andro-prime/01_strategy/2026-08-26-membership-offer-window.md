# The membership offer window, and kits at full retail

**Status:** 🟢 **ADOPTED** (Keith, 2026-08-26). Implemented the same day in
`09_website-app`, behind `MEMBERSHIP_ENABLED`.

**Supersedes nothing.** It CLOSES four questions the 2026-08-24 thesis and the
2026-08-25 adoption left open, listed in section 5.

---

## 1. The decision, in five lines

1. **Both models run.** Kits are sold one-off; membership is a recurring layer
   on top. Neither is optional: kit-only LTV (~£88) does not cover paid CAC
   (£193 to £654), and the forecast still has 63% of year-one revenue coming
   from kits.
2. **Every kit is bought at full retail, always, by everyone.** There is no
   member price on kits and no kit-plus-membership bundle price.
3. **Membership is offered for 30 days after a result comes back**, and only
   then. A customer with no result is never offered one.
4. **Miss the window and the way back in is another kit at full retail**, which
   produces a result and opens a new 30 days.
5. **Nothing carries over on rejoining.** A rejoiner is a new membership with a
   new start date and a new retest date. There is no credit for months
   previously paid.

## 2. Why the window exists

The failure it prevents, in Keith's words: *"we don't want the scenario where
somebody buys at the retail price, doesn't take up the membership, comes back
after the 30 days, takes advantage of the £47, gets their kit and is only paying
£47 for it or makes two payments. And then they're gone."*

The entitlement date already blunts that. The retest is conditional on being an
active member **on a stated future date**, never a credit, so the earliest claim
is day 90 (marker to move) or day 365 (all clear). At day 90 the member has paid
£141 against a kit costing roughly £63 to fulfil. Thin, but not a loss.

The window closes it properly: **you cannot subscribe at all unless you have
just paid full retail for a kit.** The two protections stack, and they protect
different things. The entitlement date stops a fast claim. The window stops the
membership being used as a cheap route to a kit at any speed.

## 3. Why it is ONE rule and not four

Stated as: *a membership may be joined only while a lab result has come back
within the last 30 days.*

That single sentence covers all four cases, which is why it was implemented as
one predicate rather than four:

| Case | Falls out of the rule |
|---|---|
| New customer | His result lands, the window opens. |
| Declines, returns in three months | No recent result, so no offer. Another kit opens one. |
| Cancelled member rejoining | Same: needs a recent result, so cannot cycle subscribe / claim / cancel / wait / resubscribe. |
| What carries over on rejoining | Nothing. A new membership stamps a new retest date, because the entitlement was never a balance. |

**It governs JOINING, never STAYING.** An existing member whose last result is a
year old is still a member; his window is irrelevant until he cancels. Nothing
in the window logic can end a membership.

## 4. Why kits are never discounted

Three reasons, in order of weight:

1. **The member's benefit is the included retest.** Discounting kits on top of a
   free one undercuts exactly the economics the window is there to protect.
2. **The adopted thesis says member-priced SUPPLEMENTS**, not kits: *"supplements
   become a member-priced shop."* The kit discount was an implementation
   assumption, never a decision.
3. **It keeps the offer legible.** "Full retail for every test, and membership
   includes one a year" is one sentence. A member price on kits makes the
   customer do arithmetic to work out what membership is worth.

Member pricing on supplements stays **dark** until supplements are listed in the
shop (Keith, 2026-08-26). The mechanism is built and tested
(`lib/membership/memberPricing.ts`, `lib/membership/pricingRules.ts`) and has no
call site. **The paywall must not list it as a benefit until it has a delivery
path.**

## 5. What this closes

Four items previously recorded as undecided:

- **Whether a kit can be bought without a membership** — yes, and at full price.
- **Whether membership can be bought standalone, with no kit** — no. This was
  permitted by the code and rendered a "Before your first result" screen; that
  screen is deleted.
- **Where membership sits in the funnel** — after a result, inside 30 days. It
  is sold on the retest, never on the software.
- **What happens on rejoining** — nothing carries over.

## 6. What it does NOT close

- **The free first month.** Both financial models assume *"first 30 days included
  in the kit price"*; the build charges £47 from signup and there is no trial
  mechanic. **Still divergent, still undecided.** Keith's mechanic (offer made
  when results land, not at purchase) is compatible with either answer.
- **Kit price under the membership model.** Gap-analysis decision #5, still open.
  The forecast uses Kit 2 at £119 as the paid entry; `04_products` keeps Kit 1
  at £99 as the Phase 0 launch kit.
- **£47 versus £19 to £29.** The thesis records £47 as adopted while its own
  section 6 still lists price as unresolved. Waits on traffic; the falsifier
  prices the one-off bundle and cannot adjudicate it.
- **The compliance read on the membership framing**, and the **membership terms**.
  Both remain hard launch gates. This decision gives the terms three of their
  clauses (cancellation, rejoining, what an unclaimed retest is worth) but does
  not draft them.

## 7. Implementation

| Piece | Where |
|---|---|
| The rule, pure and testable | `09_website-app/frontend/lib/membership/offer.ts` |
| The shared query both sides read | `.../lib/membership/latestResult.ts` |
| **The gate that stops a sale** | `.../app/api/checkout/subscription/route.ts`, returns 409 `offer-window-closed` |
| The three rendered states | `.../app/(app)/membership/page.tsx` |
| Kits de-discounted | `.../app/api/checkout/kit/route.ts` |
| 26 assertions on the window | `.../scripts/test-membership.ts` section 12 |

Enforced **server-side**, not only in the UI: the paywall hides itself outside
the window, but a hidden control is not a gate.

## 8. Sweep owed

🔴 **The doc layer has not been swept, and it was already behind before this
decision.** There are **zero** occurrences of "membership" in the `CONTEXT.md` /
`STATE.md` of `04_products`, `06_marketing`, `07_sales`, `08_customer-journey`
and `10_launch-ops`. `07_sales` still describes the retired £34.95/mo Daily
Stack as the recurring product and exits its lifecycle on `subscription_started`.

That is a bigger job than this decision: the funnel, the lifecycle sequences and
the marketing site have no membership story at all. Tracked separately.

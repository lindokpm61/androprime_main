# The Journey Spine

**What this is:** one ordered list of every stage a man passes through, from the search that
finds us to the retest twelve months later, with the doc that owns each stage and an honest
mark of what is built. It exists because the journey is currently described by five documents
that were written at different times against different theses, and nothing sits above them
saying how they join.

**What this is NOT:** it does not restate any stage's detail. Each stage points at its owning
doc, and that doc stays canonical. When they disagree, the owning doc wins and this file is
wrong and should be fixed.

_Created 2026-08-27. Read alongside `CONTEXT.md`._

---

## The shape, in one line

**Acquisition sells a kit. The app sells the membership. They meet at checkout, and the second
sale happens inside a 30-day window that opens when a result lands.**

Two funnels, one man, and the join is the thing nobody had written down.

```text
  DISCOVERY ─► ROUTER ─► KIT ─► CHECKOUT ═══╗
  (site-funnel-model.md)                     ║  everything meets here
                                             ▼
  ACCESS ─► DISPATCH ─► ACTIVATE ─► WAIT ─► RESULTS
  (flows 1, 3; kit-purchase.md)              │
                                             ▼
                                   ★ THE 30-DAY OFFER WINDOW
                                     (the second sale)
                                             │
                          ┌──────────────────┴──────────────────┐
                          ▼                                     ▼
                    JOINS: member loop                    DECLINES: window
                    check-in, trend, retest               closes, door stays
                          │                               open at full retail
                          ▼
                    RETEST (month 12) ─► back to RESULTS
```

---

## Stage table

Legend: 🟢 built and proved · 🟡 partial or built but undrawn · 🔴 nothing exists

| # | Stage | Trigger | The one job | Owned by | State |
|---|---|---|---|---|---|
| 0 | **Discovery** | Organic search, short-form, paid search, brand | Do the understanding, free | `07_sales/funnel/site-funnel-model.md` §2 | 🟡 articles live (thesis §10.1 says 18, its own §4 says 17, unreconciled); next-step CTAs inconsistent |
| 1 | **Router** | Lands on `/`, an article, or `lp/*` | Route the undecided, let the decided through | same, §3 | 🟢 quiz live; 🔴 homepage argument is still the kit hero |
| 2 | **Kit selection** | Quiz result or `/kits` | Convert | same, §2 | 🟢 |
| 3 | **Checkout** | Kit page CTA or `lp/*` `#order` | Take the money | `07_sales/funnel/kit-purchase.md` §4 | 🟢 |
| 4 | **First access** | Stripe webhook, order confirmed | Get him into the app without a password | `flows/flow-1-first-time-access.md` | 🟢 |
| 5 | **Dispatch** | Order paid | Get the kit to him | `kit-purchase.md` §6 | 🟢 |
| 6 | **Activation** | Kit arrives, QR scanned | Engagement only, never gates the lab | `flows/flow-3-kit-activation.md` | 🟢 |
| 7 | **The wait** | Sample posted | Hold attention without inventing news | `flows/flow-3` end state | 🟡 built (4 order states), not drawn in the mockup |
| 8 | **Results arrive** | Vitall webhook | Deliver meaning on a single result | `flows/flow-4-results-to-action.md`; routing authority `04_products/CONTEXT.md` | 🟢 logic; 🟡 the two-range card is mocked, not built |
| 9 | **★ The offer window** | A result lands. Runs 30 days | **Make the second sale** | **Nothing owns this** | 🟢 gate + rules; 🔴 journey, emails, copy |
| 10 | **Member loop** | Subscription active | Give him a reason to open the app between tests | `09_website-app` membership v1 | 🟢 built behind `MEMBERSHIP_ENABLED`; 🔴 redesign called |
| 11 | **The retest** | Month 12, active on the date | Deliver the entitlement, restart the loop | `bundle_dispatches` + `bundle-sweep` | 🟢 mechanism; 🔴 no journey doc |
| 12 | **Cancel / rejoin** | Member cancels | Lose him honestly, leave the door open | `lib/membership/offer.ts` | 🟢 rules; 🔴 no journey, no save flow |
| 13 | **Returning** | Comes back later | Passwordless re-auth | `flows/flow-2-returning-customer.md` | 🟢 |

### Failure branches, which are stages too

| Branch | From | State |
|---|---|---|
| **Sample failed** | 7 | 🟡 handled operationally, not drawn |
| **GP referral** (low T, hs-CRP >10, ferritin <30) | 8 | 🟢 routing built; earns us nothing, by policy |
| **Window missed** | 9 | 🟢 the outside-it screen is a door, not a refusal |
| **Payment failed / dunning** | 10 | 🟢 Stripe lifecycle, slug-driven |

---

## Stage 9 in full, because it is the hole

Every other stage has an owning document. This one has working code and no journey.

**What exists.** The rule is one predicate, `lib/membership/offer.ts`, covering four cases (new
customer, decliner returning, cancelled member rejoining, what carries over). It is enforced
server-side in `app/api/checkout/subscription/route.ts` with a 409 `offer-window-closed`, and
proved live. Three top-level states render: member, inside the window, outside it. 204
assertions stand.

**What does not exist.**

1. **The emails.** The window is a 30-day deadline with nothing behind it. No sequence, no
   reminder, no last-call. A deadline nobody is told about is not a deadline, it is an expiry.
   This is the single largest missing piece in the whole spine.
2. **The copy.** What the membership _is_, in a sentence a man reads the day his results land.
   `10_launch-ops/2026-08-24-supplement-membership-gap-analysis.md` lists "the membership
   proposition itself: name, what it includes, how it is explained on a page" as not existing.
3. **The journey doc.** Before this file, nothing in `08_customer-journey` mentioned membership
   at all (`grep -ril membership 08_customer-journey`, 2026-08-27, zero hits). This spine names
   the stage; it does not design it. 05_partners and 07_sales are likewise at zero.
4. **The moment.** Results landing is also the moment a man may be told to see a GP. The offer
   must not be made in the same breath as a referral, and nothing currently states that rule.
   **Proposed rail, needs Keith and Ewa:** where stage 8 routes to a GP, stage 9 is suppressed
   or deferred, and it is never adjacent to the referral. This is a conflict-free obligation
   ("any result that needs a doctor goes to a GP and earns us nothing") applied to the second
   sale, and it is the kind of thing that reads as obvious once written and is invisible until
   it is.

**What the 2026-08-27 first-month decision changes here.** The first 30 days are now included
in the kit price. That means stage 9 is no longer "will you start paying £47," it is "you are
already a member until [date], do you want to carry on." That is a materially easier
conversation and it changes the emails from a sales sequence into a continuation sequence.
It also means the window and the included month are the same 30 days, which is either an
elegance or a collision depending on whether they are anchored to the same event. **Open:** the
included month starts at purchase, the window starts when the result lands, and a slow lab puts
those out of step. Needs deciding before the emails are written.

---

## What is owed, in the order it unblocks work

1. **Settle the marketing-site design question.** Does "app-wide" include the unauthenticated
   site? It gates the redesign scope and it is one question. (`site-funnel-model.md` §5.)
2. **Inventory every reachable screen and state from the live routes**, not from memory. This
   spine names stages; the inventory names screens, and the mockup cannot be extended honestly
   without it.
3. **Draw the journey as a flow with no visual design**, so the sequence is agreed before
   anything is styled.
4. **Anchor the offer window and the included month to the same event, or decide they differ**,
   because the emails depend on it.
5. **Write the membership proposition**, then the stage-9 sequence, then compliance pre-flight.
6. **Extend the mockup one stage at a time**, starting from design tokens.

---

## Cross-references

- Acquisition, stages 0 to 3: `../07_sales/funnel/site-funnel-model.md`
- Post-checkout kit funnel, stages 3 to 8: `../07_sales/funnel/kit-purchase.md`
- The four detailed flows: `flows/`
- Results routing authority: `../04_products/CONTEXT.md`
- The offer window rules: `../01_strategy/2026-08-26-membership-offer-window.md`
- What the product is: `../01_strategy/2026-08-24-vertical-agnostic-monitoring-thesis.md`
- Retention in the Day 15 to 45 window: `day-15-45-retention-experience-2026-05-08.md`
- Build state for stages 4 to 12: `../09_website-app/STATE.md`

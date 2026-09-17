# The membership is not a subscription; the subscription was the supplements

**Date:** 2026-09-16
**Owner:** Keith
**Status:** 🟢 DECIDED 2026-09-16. Keith ruled the same day: **Q1 = keep the terms and
add the mapping sentence, Q2 = labels only.** Built and swept the same day; §6 records what
changed. Q3 is noted as out of scope rather than answered, which is itself the ruling.
**Clarification, verbatim (Keith, 2026-09-16):** *"I think the first thing we need to
clarify is that subscriptions don't exist anymore. Actually, membership. The
subscription model was attributed to the supplements."*
**Bears on:** `09_website-app/redesign-copy-register.md` rows 42a and 12a, the `P6`
gate in `10_launch-ops/implementation-checklists/direction-f-go-live.md`, the
Membership section of `03_compliance/terms-and-conditions.md` v1.3.

---

## 1. The clarification is a fact about the product, not a preference

**The subscription is the supplement product.** Daily Stack, Joint & Recovery
Collagen and Complete Men's Stack, billed monthly, about GBP 34.95. That is what
"subscription" has meant in this business since the v7 catalogue.

**It was deferred out of Phase 0a on 2026-05-23** and replaced with a non-cash
waitlist. `01_strategy/STATE.md:464`: *"Supplement subscriptions are NOT
purchasable in 0a (Stripe sub route returns a clean 400 by design)."* Nobody can
buy a subscription today, and no customer holds one.

**Membership is a different product.** GBP 47/month, the first 30 days included in
the kit price, auto-renewing on day 31 under the 2026-09-07 ruling. It owns a row
in `memberships`; a supplement subscription owns a row in `supplement_subscriptions`.
Two tables, two products, and the code has kept them apart correctly throughout.

⚠ **One wrinkle worth holding: deferred is not retired.** Three code comments
written in September call the supplement subscriptions *"retired"*, which is
stronger than the strategy record says. `04_products/CONTEXT.md` still describes
Phase 0b reinstatement when live Stripe Price IDs are configured. **So the word
"subscription" is not free for reuse: it is a customer-facing product name that
is currently switched off and scheduled to come back.** That is the strongest
argument for the rule below, and the strongest argument against solving this by
renaming the database.

## 2. The rule (adopted 2026-09-16)

**In customer-facing copy, the recurring product a kit buyer gets is a MEMBERSHIP.
The word "subscription" is reserved for the supplement product and does not appear
in kit copy, landing-page copy, or account copy that describes membership.**

Three places the word legitimately stays, and they are not exceptions so much as
different audiences:

| Where | Why it stays |
|---|---|
| The terms | See §5 Q1. This is the one place the answer is not ours to choose |
| Stripe objects, table names, route identifiers | Machine-facing. Renaming them buys nothing and risks a migration for a vocabulary decision |
| The DMCCA regime, when it commences | A statutory category, not our label. See §5 Q3 |

## 3. What the rule actually fixes: the account surface is named after the one product nobody can buy

This is the concrete defect the clarification exposes. ✅ **Fixed 2026-09-16** through
`lib/subscriptions/labels.ts`; the table below is what each surface said BEFORE, and is
kept as the record of what was wrong.

| Surface | What it says |
|---|---|
| `app/(app)/subscriptions/page.tsx:12` | Page title **"Your Subscriptions"** |
| same, `:154` | Heading **"Your subscriptions"** |
| same, `:170` | Empty state **"You do not have an active subscription."** |
| `components/shared/Nav.tsx:100` | Nav item **"Subscriptions"** |
| `app/(app)/account/membership/page.tsx:201` | *"Manage or cancel from your subscriptions at any time."* |
| `app/(app)/account/page.tsx:314`, `account/membership/page.tsx:312` | Two links reading **"your subscriptions"** |

Supplements are off and membership is the only recurring row a customer can hold.
**So the page a member is sent to in order to cancel his membership is named after
the product he cannot buy, and its empty state denies the thing he is holding.**

🔴 **CORRECTION, and it shrinks this section a lot. The LOOKUP half of this was
already fixed, and an earlier read of mine in this session said otherwise.** The
2026-09-11 rewrite draft's §7 records the portal as 404ing and the button as a
silent no-op, and that text is stale. All three parts are closed:

| Part | Fixed |
|---|---|
| `BillingPortalButton` silent no-op | 2026-09-11, fails visibly now |
| `checkout/portal` reading one table | 2026-09-13, `resolveBillingSubscriptionId` reads both |
| `getSubscriptions` reading one table | 2026-09-13, reads both, membership half gated on the flag |

**What remains is labels only.** No lookup, no migration, no data decision. That
is a genuinely small change, and §5 Q2 is the only part of it with a cost.

## 4. What the rule does NOT fix, and the number that shows it

**Row 42a does not shrink.** Running `verify-subscription-claims.js` today and
splitting the output by whether the flagged line contains the word at all:

| | Count |
|---|---|
| Lines saying *"no subscription"* / *"not a subscription"* | **6** |
| Lines saying *"One-off purchase"*, *"Pay once"*, *"all-in, one-off"*, *"One-off test"* | **12** |

The twelve are claims about the money, not about the noun. A man pays GBP 99, is
charged GBP 47 on day 31, and no vocabulary ruling makes that a one-off purchase.
**Renaming the product corrects the label on six lines and leaves twelve false.**

⚠ **And the count of record is stale everywhere.** Row 42a, the `P6` gate and the
script's own header all say **thirteen sentences on seven surfaces**. The script
now reports **16 on 7 pages plus 2 non-page surfaces**, because `CLAIMS` was
widened on 2026-09-15 with `pay once`, `one-off test` and `all-in, one-off`, each
of which was rendering on a live buy surface, and nothing updated the record.
**P6 is eighteen sentences, not thirteen.** ✅ **Swept 2026-09-16** into row 42a, the `P6`
gate and `membership-switch-on.md`, and the script's header no longer states a count at
all. §6 item 4.

## 5. Three questions this raises that are yours — ALL THREE RULED 2026-09-16

**🔴 Q1. The terms currently say the opposite, in terms.**
`03_compliance/terms-and-conditions.md:308`: *"Andro Prime Membership is an
ongoing monthly subscription."* And `:128`: *"Where you hold a subscription with
us (a supplement subscription or a membership)"*. That is v1.3, drafted
2026-09-13, deliberately written to bring membership inside the protections the
incoming regime will require. **The wording is doing work: it is what pulls the
30-day price-change notice and the cancellation duty onto membership.** So the
options are not symmetric:

✅ **KEITH RULED A.** The paragraph is added under *"What membership is"* in
`terms-and-conditions.md` and recorded in the v1.3 change log as a dated amendment. No
other clause moved, and the protective reading is unchanged.

| Option | Consequence |
|---|---|
| **A. Keep the terms as they are** (RULED) | Marketing copy says membership, the terms say it is a subscription for consumer-protection purposes. Normal, and the protective reading survives. Needs one sentence in the terms making the mapping explicit so it does not read as a contradiction |
| **B. Strip "subscription" from the terms too** | Re-opens the protections that clause carries and puts a novel argument in front of a regulator for no commercial gain |

**🟠 Q2. Does `/subscriptions` change its URL, or only its labels?**
Labels-only is free. A URL change touches the nav, two account links, the portal
`return_url`, and anything already sent to a customer. Recommended **labels only**,
URL unchanged, since the route also has to keep serving supplement subscriptions
when Phase 0b lands.

✅ **KEITH RULED LABELS ONLY.** The URL is untouched, and so is every flag-off string.

**🔵 Q3. This does not settle the DMCCA scope question, and should not be read as
trying to.** `03_compliance/2026-09-07-dmcca-subscription-regime-gap.md` residual
item (b) is whether the membership is in scope *"given the first 30 days are
bundled into a one-off kit purchase rather than sold as a standalone
subscription"*. That is open, it is a question about substance, and a naming rule
does not touch it. Part 4 commences January 2027 with the implementing regulations
still unpublished.

## 6. What changed (applied 2026-09-16)

✅ **1. Labels on the account surface**, all six sites, through one new shared source,
`lib/subscriptions/labels.ts`. 🔴 **The labels follow `MEMBERSHIP_ENABLED` rather than being
renamed outright, and that is the load-bearing decision in the build:** with the flag OFF the
only rows the page can return are supplement subscriptions, so *"Subscriptions"* is the
correct word and **every flag-off string is byte-identical to what shipped before**. With the
flag ON the surface is called **Billing**, which names neither product and stays true when
supplements reinstate in Phase 0b. Same shape as the interlock: each state is coherent, and
what must never happen is the two coexisting on one screen. `tsc --noEmit` clean.

✅ **2. One paragraph in the terms**, under Q1 option A, plus a dated v1.3 amendment entry.

□ **3. The copy in rows 42a and 12a is UNCHANGED and still owed to Keith.** This ruling does
not touch it. The 2026-09-11 draft already says "membership" throughout, so it needs no
rework to comply with §2; it needs the decision it has been waiting on since 2026-09-11.

✅ **4. Bookkeeping: thirteen became eighteen** in row 42a (with a dated note recording that
the number moved because the 2026-09-13 pre-flight's predicted fix landed, not because copy
crept in), in the `P6` gate, and in `membership-switch-on.md`. **The script's header no longer
states a count at all**: it now says what the output means and names row 42a as the record.
That is the durable half, because the 2026-09-13 fix had reconciled the two numbers by hand,
which added a third place to update rather than removing the duplication.

✅ **5. Nothing renamed** in the database, in Stripe, or in the route path.

## 7. What this does not touch

- **`lib/membership/disclosure.ts`**, the ruled and built price line. It already
  says *"Includes 30 days of membership"* and never uses the word.
- **`/membership`**, which was written after the auto-renew ruling and is the one
  page already correct throughout.
- **The supplement waitlist and the Phase 0b reinstatement path.** Unchanged, and
  the reason the word is reserved rather than retired.
- **The `MEMBERSHIP_ENABLED` interlock.** Still the thing that makes the flag safe
  to flip, and still red until the copy is swept.

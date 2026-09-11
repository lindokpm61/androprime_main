# Draft: the subscription copy rewrite, fourteen slots from one sentence

**Status:** DRAFT, for Keith. Nothing is approved and nothing has been applied to the site.
**Owner:** Keith. **Business, not clinical** (his ruling, 2026-09-11).
**Why:** `01_strategy/2026-09-07-auto-renew-at-day-30.md` made fourteen live sentences false.
**Register:** rows 42a and 12a. **Interlock:** `frontend/scripts/verify-subscription-claims.js`.

---

## 1. The one sentence everything else is cut from

> **You pay once for the kit. That price includes your first 30 days of membership, and on day 31 it becomes GBP 47 a month unless you stop it.**

Fourteen slots, four distinct claims, one fact. Each replacement below is that
sentence trimmed to the space it has.

## 2. The judgement call, and it is the only one in here

**"Nothing hidden" gets stronger under auto-renew, not weaker, but only if the
renewal is on the buying page.**

The conflict-free position has always been about a charge the customer cannot
see coming. Numan's ASA ruling was for burying a subscription, and §3 of the
auto-renew ruling records that our button is a harder case than Spotify's because
a man buying a GBP 99 kit has no subscription frame at all. So the honest move is
not to soften the claim: it is to point at the renewal and say we are telling you
here rather than in the terms. That is the claim competitors cannot copy.

**"One price" is the part that does not survive.** There are two prices now. Every
draft below states both.

---

## 3. Slot 1 of 4: the positioning panel. `/kits`, CA-026 C1

This is the one that needs your re-record. **The GP sentence is untouched and kept
as its own paragraph**, deliberately: it is the conflict-free principle and the
only part of C1 inside Ewa's remit, so keeping it structurally separate means the
rewrite does not reach her.

**NOW**

> **What you pay**
> **One price. Nothing hidden.**
> The price on the card is everything you pay. No charge to see your own results, no surprise second test, no subscription unless you choose one. If a result needs action, the next step is a GP conversation, and we earn nothing from it.

**DRAFT**

> **What you pay**
> **Nothing hidden. Not even the renewal.**
>
> The price on the card is everything you pay today, and it includes your first 30 days of membership. On day 31 that card is charged GBP 47 a month unless you stop it first. No charge to see your own results, and no surprise second test.
>
> If a result needs action, the next step is a GP conversation, and we earn nothing from it.

**What changed and why**

| | |
|---|---|
| "One price" | Gone. There are two. Keeping it is the weakest sentence on the page |
| "no subscription unless you choose one" | Replaced by the renewal, stated plainly. This is the false clause |
| "Nothing hidden" | Kept, and now doing real work: the renewal is the thing being un-hidden |
| The GP sentence | **Byte-identical, own paragraph.** Ewa not in the loop |

## 4. Slot 2 of 4: the buy-button footnote. Ten instances

Six on the three `/kits/*` pages (twice each, bundle and single), four across the
landing pages. **The disclosure line already sits directly above these**, so the
footnote does not need to restate the billing. It only needs to stop asserting a
shape that is no longer true.

| Where | NOW | DRAFT |
|---|---|---|
| `/kits/*` ×6 | One-off purchase. Results in your personal dashboard. No GP needed. | **Results in your personal dashboard. No GP needed.** |
| `/lp/testosterone` | One-off purchase. Includes lab fees & delivery. No subscription. | **Includes lab fees and delivery.** |
| `/lp/energy-recovery` | Secure checkout. No subscription. | **Secure checkout.** |
| `/lp/hormone-recovery` | Secure checkout. No subscription. | **Secure checkout.** |
| `/lp/hormone-recovery` close | One-off purchase. Results in your personal dashboard. No GP needed. | **Results in your personal dashboard. No GP needed.** |

**This is deletion, not rewriting.** Every one of these keeps its true half and
drops its false half. No new words are introduced anywhere in this slot, which is
the cheapest possible pre-flight: there is nothing new to approve.

## 5. Slot 3 of 4: the two FAQ answers

These have room, so they carry the full fact.

**`/lp/testosterone`, "Does the £99 cover everything?"**

> NOW: Yes. The kit, the lab analysis, and the prepaid return postage are all included. No hidden fees. **This is a one-off purchase.**
>
> DRAFT: Yes. The kit, the lab analysis, and the prepaid return postage are all included. No hidden fees. **The price also includes your first 30 days of membership, and on day 31 it becomes GBP 47 a month unless you stop it first.**

**`/lp/hormone-recovery`, "Does the £179 cover everything?"**

> NOW: Yes. The kit, the lab analysis for all nine biomarkers, the prepaid return postage, and access to your results dashboard are all included. **It is a one-off payment, not a subscription.**
>
> DRAFT: Yes. The kit, the lab analysis for all nine biomarkers, the prepaid return postage, and access to your results dashboard are all included. **The price also includes your first 30 days of membership, and on day 31 it becomes GBP 47 a month unless you stop it first.**

Same two sentences on both, deliberately. One fact, one wording.

## 6. Slot 4 of 4: the homepage membership line

Register row 12a, open since 2026-09-10. The current line is wrong twice: the
membership is not "offered" and it does not wait for anything.

> NOW: Holding that record over time is an optional membership. **It is offered once your first result is back, never before, and you never need it to buy a kit or to read your own results.**
>
> DRAFT: Holding that record over time is a membership, and your first 30 days are included in the price of every kit. **It starts when your first result lands, and on day 31 it becomes GBP 47 a month unless you stop it. You never need it to read your own results.**

⚠ "You never need it to buy a kit" is dropped because it is now nonsense: it comes
WITH the kit. "You never need it to read your own results" is kept because it is
still true and still the thing worth saying.

---

## 7. Two dependencies. The first one was checked wrongly

🔴 **CORRECTION, 2026-09-11, from the independent pre-flight. THIS SECTION FIRST
SAID THE CANCELLATION CLAIM WAS SUPPORTABLE. IT IS NOT, AND THE CLAUSE HAS BEEN
CUT FROM THE DRAFT ABOVE.**

The original check confirmed that `/subscriptions` renders `BillingPortalButton`
and stopped there. That is one layer too shallow, and it is exactly the failure
the pre-flight skill's invariant 6 describes: a safeguard is unverified until it
is located in code, not until something plausibly named is found. Traced properly:

| Step | What is actually there |
|---|---|
| `app/(app)/account/membership/page.tsx:195` | "Manage or cancel your membership from your subscriptions" — the only cancellation route offered |
| `app/(app)/subscriptions/page.tsx:71` | calls `getSubscriptions(user.id)` |
| `lib/subscriptions/getSubscriptions.ts:25` | queries **`supplement_subscriptions` only** |
| `app/api/webhooks/stripe/route.ts:382` | states outright that a membership owns a row in **`memberships`**, not there |
| Result | a membership-only customer gets the empty state, "You don't have an active subscription" |
| `app/api/checkout/portal/route.ts:14` | also queries `supplement_subscriptions` only, returns **404** |
| `BillingPortalButton` | handles 401 and nothing else, so `data.url` is undefined and **the click is a silent no-op** |

**Every kit buyer becomes a membership-only customer under this ruling**, so the
claim would have been false for essentially the whole population it was written
for, and it fails in the worst possible shape for an easy-cancellation duty: the
button looks like it worked.

⚠ **The capability gap is older than this draft.** The already-ruled, already-built
disclosure line carries **"Cancel anytime"** (`lib/membership/disclosure.ts`). What
this draft did was make that claim more specific and therefore more falsifiable.
Cutting the clause here does not fix the ruled line. **The cancellation route is an
activation blocker for the whole membership surface, not a wording question.**

⚠ Also unverified and owed: `stripe.billingPortal.sessions.create` is called with
no `configuration`, so cancellation depends on the default Stripe portal having
`subscription_cancel` enabled. That is a dashboard setting, invisible to the repo,
and per invariant 6 it must be **exercised, not read**.

🔴 **THE START DATE IS A LIVE CONTRADICTION IN THE CODE, AND THE DRAFT ABOVE PICKS
THE RULING'S SIDE.** `2026-09-07-anchor-everything-to-the-result.md` ruled that
every date anchors to the result landing, and `/membership`'s own FAQ already
tells customers *"The day your result comes back from the lab, not the day you
ordered."* **`lib/membership/sync.ts:71` stamps `startedAt ?? new Date()` at
checkout completion**, so today the clock starts when the card is charged. The
ruling's own record says `createMembership` is its only code carrier, and it has
not been changed.

So the homepage draft's *"It starts when your first result lands"* is **true to the
ruling and false to the code**. Either the code moves before the flag flips, or
that clause comes out. **It is not a copy decision; it is a build task that the
copy has just made visible.** Flagging rather than fixing: changing when a
subscription starts is not something to slip into a copy pass.

## 8. What this does not touch

- **The disclosure line itself** (*"Includes 30 days of membership. GBP 47/month after. Cancel anytime."*) is already ruled and already built. Unchanged.
- **C1's GP sentence.** Byte-identical, own paragraph, Ewa not in the loop.
- **`/membership`.** Every word on it already describes auto-renew correctly; it is the one page that was written after the ruling.
- **The `/faq` route**, which still carries no subscription answer at all. That is a separate gap, already recorded, and it wants an answer written rather than one corrected.

## 8a. Independent pre-flight findings, 2026-09-11

The `compliance-reviewer` agent ran the judgement pass, because invariant 7 of the
pre-flight skill forbids the drafter from clearing their own copy. **Deterministic
floor: 0 HARD / 0 REVIEW on both the baseline and the draft payloads, delta zero in
both directions.** Every finding below is judgement, and three of them block.

**🔴 HARD, all three are activation blockers rather than wording problems**

1. **The cancellation claim.** §7 above, corrected and the clause cut.
2. **The rewritten copy must inherit the `MEMBERSHIP_ENABLED` interlock, and §9
   below did not say so.** `MembershipDisclosure`'s own header already argues it:
   a page promising thirty included days in front of a checkout that bills
   immediately is *worse* than saying nothing, because it is a promise rather than
   an omission. The new sentences are that promise in richer form.
   🔴 **And `verify-subscription-claims.js` is one-directional and cannot see the
   mirror defect.** Its `CLAIMS` array holds only the old false claims and it fails
   only when the flag is ON. Flag-off copy asserting a GBP 47 recurring charge,
   against `app/api/checkout/kit/route.ts:200` which is `mode: 'payment'` with no
   `subscription_data` and no `trial_period_days`, would report **green**. The
   check I shipped has a blind side and needs the inverse set.
3. **The start-date gap is wider than §7 recorded.** It is not one clause: the kit
   checkout creates no subscription at all, so *"includes your first 30 days of
   membership"* has no mechanic either, not only no start date.

**🟠 FLAGGED, none of them routed yet**

| | Finding | Route |
|---|---|---|
| F1 | *"Nothing hidden. Not even the renewal."* is the right shape but converts an omission into an affirmative claim about the completeness of the commercial terms. Three things sit on the wrong side of it today: no cancellation route, **no membership section in the T&Cs at all**, and the contradicted charge date. Precedent: CA-026's own note F1 retired an absolute from this same paragraph in 2026-07-22 | Keith |
| F2 | Dropping the clause does **not** disturb the conflict-free position, and is slightly strengthening. But naming the membership inside C1 brings §P rule 2 (*"the same options at the same prices whether your numbers are flagged or fine"*) into contact with a **result-varying entitlement**: `lib/membership/entitlement.ts:78` gives a flagged member a day-90 retest and an all-clear member an annual one | Keith, **Ewa sighted** |
| F3 | The "Ewa not in the loop" design is a judgement about scope, not a fact about the record. **§P clause 2 is already owed her** a citation swap from 2026-08-21, so this rides free on a pass that is happening anyway | Keith |
| F4 | 🔴 **The sweep is short. `frontend/public/llms.txt:9` carries the C1 paragraph verbatim**, including the false clause, published on the apex and written for AI ingestion. My check cannot see it: `SCOPE` is `app/` and it walks `.tsx` only. **The interlock would go green with the false claim still served** | Keith |
| F5 | The draft types "GBP 47" while the built disclosure derives "£47" from `PRODUCT_MAP`. Two renderings of one price within a screen of each other on `/kits`. The applied version must derive it | Keith |
| F6 | *"included in the price of every kit"* is a universal claim with no implementing scope, and says nothing about the bundles | Keith |
| F7 | Gap-doc questions 3, 5 and 7 are load-bearing for this wording. The draft converts three open solicitor questions into shipped representations | Solicitor |

**🔵 Confirmed, no action.** The GP sentence is byte-identical between baseline and
draft, verified by hash rather than by eye. Only its position changed, and the
change raises its prominence. Slot 2 is confirmed pure deletion: six of the
fourteen introduce no word not already in the approved baseline.

**Not approved. Three HARD items and seven flagged, none routed.**

## 9. If you approve

1. Apply the fourteen. Roughly forty words of genuinely new copy, all of it in slots 3 and 4; slot 2 is pure deletion.
2. Compliance pre-flight on the diff.
3. **CA-026 C1 re-record, yours, business.** CA-021 is the precedent for a business-only approval.
4. Update `CLAIMS` in `verify-subscription-claims.js` in the same commit, so the interlock tracks the new wording.
5. The check goes green with `MEMBERSHIP_ENABLED=true`, which is the signal that the flag is safe to flip on the build side. The start-date dependency in §7 is separate and still gates it.

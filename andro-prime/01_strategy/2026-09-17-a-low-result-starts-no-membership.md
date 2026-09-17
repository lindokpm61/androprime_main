# A testosterone result under 12 routes to the GP and starts no membership

**Decided:** 2026-09-17 · **Owner:** Keith · **Status:** ADOPTED, built the same day
**Ruling, verbatim:** *"If he gets a low result, he goes to his GP, and that's the end of the
story. If he then decides to come back and get a second test, it's basically the same again. So
he's charged at £99, and he has another 30 days."*
**Built in:** `09_website-app/frontend/lib/membership/startOnResult.ts`, first guard.
**Sits under:** Ewa's CA-014 (2026-06-04, low-T routes to a GP referral with no upsell) and
Keith's `../04_products/results-engine/2026-09-07-fast-recheck-must-be-prepaid-or-included.md`.

---

## 1. The rule

> **A confirmed testosterone reading under 12 nmol/L routes to a GP referral, as it already did,
> and the membership does not start. Nothing is sent, nothing is offered, and nothing is charged.**

A man who later chooses to buy another kit pays **full retail, £99**, like anyone else. If that
result is 12 or above his 30 included days start from it and day 31 charges as normal. If it is
low again he is still a GP case and it still starts nothing.

**Borderline (12 to under 15) is untouched** and enrols normally. So does a kit that does not
measure testosterone: a null reading is not a low one, and inferring low T from Kit 2's energy and
recovery markers is a named red flag in `../03_compliance/CONTEXT.md`.

## 2. What this fixes, and it is worth GBP 58.50 a head

The 2026-09-07 auto-renew ruling starts a membership when the result lands. Applied without this
rule, a low-T customer costs money on every unit:

| | |
|---|---|
| Kit 1 revenue, net of 2.5% Stripe | £96.53 |
| First kit COGS | −£58.50 |
| A confirmatory second kit, included | −£58.50 |
| **Contribution** | **−£20.47** |

**And he never pays the £47**, because the confirmation lands inside the included 30 days and he
cancels on day 29. Kit 1 turns from **+£38.02 to −£20.47** on precisely the segment the whole
proposition is built to attract. At the £40 CAC the models use it is −£60.47. If a third of Kit 1
buyers read under 12, Kit 1's contribution roughly halves.

**The rule fixes it by not giving away an included month to a man who was always going to cancel
before the first charge.** Contribution stays at £38.02.

## 3. 🔴 The option that was refused, and why it is recorded rather than dropped

Keith proposed emailing a low-T customer a reduced-price recheck (around £69.99), with the
membership starting from the recheck's result instead. **The arithmetic was sound** — it lands at
+£47.76, within a penny of what the prepaid bundle contributes — and the instinct behind it was
right: the loss comes from giving away a month to someone who will never pay for one.

**It is forbidden by Keith's own rule, ADOPTED ten days earlier and amended two days earlier:**

> *"A recheck triggered by a result, falling less than 90 days after that result, must be prepaid
> or included in an entitlement the customer already holds. It may never trigger a new sale."*

A coupon meets all three conditions: triggered by a result, immediate, and a new sale. That
document's §2 states it was aimed at *"a recheck firing in days, at the moment a man reads the
worst number on his dashboard"*, which is this email exactly. It also collides with **Ewa's
CA-014**, which routes a sub-12 result to a GP *"with no kit/supplement upsell"* — and that half is
not Keith's to move alone.

**The rule permits exactly two doors, prepaid or included.** Both were walked into independently in
the same session: *included* is what the arithmetic above kills, and *prepaid* is the bundle. That
is the whole reason the Recheck bundle is shaped as a prepayment: **the sale happens before the
bad news rather than after it.** The prepayment is the compliance mechanism and the funding is a
side effect, which is the opposite of how it was first read in this session.

⚠ **Recorded because a refused option that leaves no trace gets re-proposed.** Keith's own summary:
*"I was looking for a solution where there is no solution to be found here."*

## 4. What it means for the bundles

| Bundle | Sells | Membership gives it? | Disposition |
|---|---|---|---|
| **Prove-It**, £199 | A day-90 retest on Kit 2 | **Yes**, included on a flagged marker | 🔴 **RETIRE.** Charging £80 for a retest the member already owns is the mis-sell |
| **Full-picture**, £259 | Same, Kit 3 then Kit 2 | **Yes** | 🔴 **RETIRE** |
| **Recheck**, £169 | An immediate confirmation on a sub-12 result | **No, and it cannot afford to** | 🟠 **Stays in principle** — prepaid is the compliant door. Not yet executed; see §6 |

🔴 **`BUNDLES_ENABLED` must be split before any of this is executed.** `lib/flags.ts` states that
it gates every bundle surface as one unit, the result-hook confirmation trigger included, so two
retirements and one survivor cannot be expressed through it.

**None of this is live today:** the flag is unset in `.env.local`, so all three are already dark.
What the retirement changes is the code and the documents, not the current customer experience.

## 5. Owed to Ewa, and it is one numbered question

She signed the immediate recheck at under 12 on 2026-07-26 and the GP routing on 2026-06-04.
Neither moves here: the referral is unchanged and nothing clinical is added. What she has not seen
is the membership consequence — **a man with the most flagged result of all now receives no
monitoring cadence from us.** The argument for it is that he is under GP care and running a
parallel wellness cadence alongside a GP is the Phase-0 boundary problem rather than a service,
which is the more conservative reading. It rides the citation-swap pass she is already owed from
2026-08-21.

## 6. Open, and it is one line

Keith's *"that's the end of the story"* describes the man who did **not** buy a bundle. Whether the
**Recheck bundle itself** also retires — leaving no prepaid confirmation path at all — is not
settled by this ruling and is the last question in the thread.

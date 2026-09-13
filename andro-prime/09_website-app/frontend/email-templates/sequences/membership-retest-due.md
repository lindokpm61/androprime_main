# Membership retest due — the notice before the kit (defect 3c)

**Status:** 🔴 **DRAFT. NOT APPROVED, NOT ACTIVE.** Copy drafted 2026-09-13, compliance pre-flight run the same day. Customer.io campaign built as a **DRAFT**. Activation is gated on: Keith's business sign-off, the `membership_retest_due_at` attribute being stamped (not built yet, see below), `MEMBERSHIP_ENABLED`, **`ACCOUNT_ADDRESS_ENABLED`** (see below), an attribute-live test send, and a human go/no-go.
**Platform:** Customer.io, workspace 219186
**Goal:** Close **defect 3c** — *"No email ever tells a member his retest is coming."* Today a member's retest simply arrives: the sweep creates the owed kit on the due date and he first hears about it through the `bundle_address_check` email, which is sent at dispatch. **Nothing tells him the date is approaching, and that date is the one thing the whole membership is built around.**
**Tone:** Plain, no hype, no urgency, no sell. Keith's voice. There is nothing to buy here: he already owns this.

---

## What this email is NOT, and why

**It is not the renewal notice, deliberately.** The defect register's suggestion was to build one email rather than two, on the reasoning that a pre-renewal notice is probably owed anyway. **That reasoning depends on P1, which is open with the solicitor**: Part 4 of the DMCC Act 2024 is not recorded anywhere in the compliance workspace and nobody has confirmed what a renewal notice must say or when it must arrive. Writing to an unsettled legal requirement means writing it twice, and **a renewal notice that is wrong is worse than one that is absent.** The retest notice is ours to decide and is useful standing alone, so it ships alone. When P1 is answered the renewal content either folds into this campaign or becomes its sibling; the copy below is structured so either is a small change.

**It does not say what the retest covers.** That is D1's carried copy item and it does not belong here, for a mechanical reason rather than a stylistic one: **the panel is not known when this email is sent.** `selectRetestPanel` runs inside the nightly sweep on the due date, and this fires seven days earlier. Naming a kit now would be a guess. The right surface for "what your retest covers" is the address-check email or the dashboard, both of which are downstream of the decision.

**The COPY makes no clinical claim.** It states a date, an entitlement and a logistics sequence. **Three** sentences are reused from **CA-022** (Ewa, 2026-07-18): two verbatim and one near-verbatim, itemised in the provenance table. The bar for this copy is set by a same-day ruling in the owning file, `lib/membership/retestPanel.ts`: *"Ewa re-enters only if that copy makes a claim about clinical sufficiency, e.g. 'we re-test what matters'."* This makes no such claim and says nothing about panel content.

🔴 **BUT ONE CLINICAL QUESTION IS OWED, AND IT IS ABOUT THE AUDIENCE RATHER THAN THE WORDS.** Found by the independent review, not by this draft. CA-022's approval is scoped to *"every kit buyer whose result came back all-clear"*. **This email's audience is the opposite cohort**: the 90-day cadence is what `decideRetestCadence` returns for a FLAGGED member, and `isFlaggedState` is true for Monitor, Action Needed and **See Your GP**. So a man whose testosterone came back low receives this at day 83.

That makes it the first surface in the product that sends a retest prompt to a GP-routed man, which is **defect 3f**, and the map's Owed row 9 reserves that wording to Ewa: *"A date with no purchase attached is the obvious candidate and is Ewa's to word."* This email is exactly a date with no purchase attached. Approved copy does not travel to a new cohort on its own authority.

---

## Trigger and segment (Customer.io build)

- **Campaign type:** `date` (date-attribute triggered), frequency `once`, sending **7 days before** the attribute date.
- **Attribute:** `membership_retest_due_at` — Unix seconds, mirroring `memberships.next_retest_due_at`.
- **Why 7 days:** the sweep creates the owed kit **on** the due date, then the address-check email goes out, then `ADDRESS_CHECK_WINDOW_DAYS` (4) elapses before dispatch. Seven days ahead means he can correct a stale address **before** we ask rather than during a four-day window, and it is close enough to the event to still be about the event.
- **Why a separate attribute and not `retest_due_at`:** that one is stamped only on a whole-result all-clear for kit buyers, and its campaign sends a **buy** prompt to `/kits`. A member's retest is included and there is nothing to buy. One attribute carrying two meanings would send the wrong one of two emails to anyone who is both.
- **Idempotency:** frequency `once` per date value. Defect 3b now rolls `next_retest_due_at` forward on each claim, so the attribute takes a **new** value every cycle and this correctly sends once per cycle rather than once per lifetime. Before 3b it could only ever have fired once.

### 🔴 The attribute is NOT stamped yet, so this campaign cannot fire

Nothing writes `membership_retest_due_at` to a Customer.io profile today. It needs setting in `lib/membership/sync.ts` at both points the date is written: `createMembership`, and the roll-forward inside the sweep's claim. **Until then the campaign is inert, which is the correct state for an unapproved draft.** Same pattern as CA-022, which was built dark and waited on `RETEST_REMINDER_ENABLED`.

### Art 9: why this attribute needs no extra consent gate

The cadence is 90 days for a member with a flagged marker and 365 for an all-clear one, so **the date's distance from his result implies his result state.** That is the same question `processResult.ts` already answered for `retest_due_at`, and the answer carries across: `results_all_clear` is already emitted to Customer.io for every kit buyer, un-gated and Ewa-confirmed as a low-sensitivity signal. A membership retest date is the **complement of a trait already there**, so it reveals nothing new. No marker name, no value and no verdict is sent, and the email body carries none either.

---

## Sign-off

| | Name | Decision | Date |
|---|---|---|---|
| Clinical | Dr Ewa Lindo | 🔴 **ONE QUESTION OWED, on the AUDIENCE and not the copy.** The words make no clinical claim and clear the bar set in `retestPanel.ts`. What is owed is whether CA-022's sentences may travel to a flagged, GP-routed cohort, which is 3f and is reserved to her. Rides the unsent packet | — |
| Business | Keith Antony | 🔴 **NOT YET GIVEN** | — |

No CA number is claimed. The board assigns one on approval.

⚠ **An earlier version of this table asserted "Not required" for clinical.** That was the drafting agent clearing its own copy, which pre-flight invariant 7 forbids, and the independent pass overturned it. The assertion was wrong in a specific and instructive way: it was correct about the sentences and never examined who receives them.

---

## Email 1 — Your retest is due

**Subject:** Your retest is due on {{ customer.membership_retest_due_at | date: "%-d %B" }}
**Preview:** It is included with your membership. Nothing to buy, nothing to arrange.

---

Your next check with Andro Prime is due on {{ customer.membership_retest_due_at | date: "%-d %B %Y" }}.

It is included with your membership, so there is nothing to buy and nothing to arrange.

Levels do not stay still. They shift with the seasons, your training, your diet and your age. A retest is the only way to find out how your levels have changed since last time, and a second reading gives you a trend rather than a single snapshot.

Here is what happens next. On that date we prepare your kit. Before it ships we will email you to confirm the delivery address we hold, so you can change it if you have moved. Then it arrives, you take the sample the same way you did last time, and your new numbers appear in your account next to your old ones.

One thing worth knowing: the retest is included while you are a member, and you need to be a member on that date. It is not a credit, there is no balance, and there is nothing to keep track of.

If something has not felt right in the meantime, your GP is always a sensible place to start.

**Check the address we hold:** https://app.andro-prime.com/account

Keith

Andro Prime

---

## Provenance of each line

| Line | Source |
|---|---|
| "Levels do not stay still. They shift with the seasons, your training, your diet and your age." | **CA-022 verbatim**, Ewa 2026-07-18 |
| "A retest is the only way to find out how your levels have changed since last time, and a second reading gives you a trend rather than a single snapshot." | **CA-022 verbatim.** An earlier draft kept only the second clause; the independent review found that the trimmed half is the retest framing `03_compliance/CONTEXT.md` mandates, and that dropping it left the trend sentence as the sole standing benefit proposition. Restored in full |
| "your GP is always a sensible place to start" | **CA-022**, as a fragment. The shipped sentence inserts "in the meantime", so it is near-verbatim rather than verbatim |
| "It is not a credit, there is no balance, and there is nothing to keep track of." | Live app copy, `account/membership` retest panel |
| "you need to be a member on that date" | The 2026-08-24 entitlement reframing, stated in `entitlement.ts` and on `/membership` |
| Everything else | New for this email, 2026-09-13 |

---

## Compliance pre-flight, 2026-09-13

**Unit of scan:** the extracted `## Email 1` payload. The rest of this file is apparatus and is reported separately, never folded into the headline count.

| Unit | Result |
|---|---|
| Extracted payload | **0 HARD / 0 REVIEW** |
| Whole file | **0 HARD / 0 REVIEW** |
| Em dashes in shipped lines | **0** (four in apparatus, one in the `## Email 1` heading; none ships) |
| Liquid lint, local | 0 errors, 0 warnings on this file; 0 errors across all 50 |
| Liquid lint, live CIO bodies | 0 errors across all 33 |

🔴 **Invariant 7 applies: the agent that drafted this copy did not clear it.** An independent pass was run by the `compliance-reviewer` agent, and its verdict is the operative one: **`amber-ewa`. Not approved.** What it found that the drafting pass missed is recorded above and below, in its own words where it matters.

### What the copy does

Framed as measurement throughout: it states a date, an entitlement and a logistics sequence, and it interprets nothing. No marker is named, no value is given, no verdict is implied. EFSA table not applicable, no ingredient appears. Phase-0 boundary held on the face of the copy. The GP routing line is present and protective. Nothing is asked for and nothing is sold.

### Outstanding, and who owns each

| # | Item | Owner | Route |
|---|---|---|---|
| 1 | **Audience, not words.** CA-022 was approved for all-clear kit buyers; the 90-day cadence sends this to flagged members, See-Your-GP included. That is 3f, reserved to Ewa | Ewa | **Ride the already-drafted, UNSENT packet** (Gmail `r1901433818987540044`, *"Retest timing: five questions"*) as a sixth question. Free to add while unsent; a separate ask spends her attention twice |
| 2 | **Phase-0 confirmatory-testing boundary.** For a flagged member the retest is a second testosterone sample whose timing is set by the classifier's verdict on the first. CA-026 audit item F4 is still open on exactly this | Ewa + Keith | Same packet |
| 3 | **The entitlement paragraph is contract copy and there is no contract.** `terms-and-conditions.md` contains no membership section; P1 (DMCC Act 2024 Part 4) is open with the solicitor. Same shape as CA-026's D2 sentence, which was ship-gated for this reason | Keith, then solicitor | P1 |
| 4 | **3c is itself undecided.** The map's Owed row 4 is *"decide whether a member gets a retest-due email at all"*. This draft presupposes the answer | Keith | — |
| 5 | 🔴 **`ACCOUNT_ADDRESS_ENABLED` was missing from the activation gate list.** With that flag off, `/account` renders no address at all, so the email's only call to action lands on a page that cannot do the thing it asks for. CA-027 gates the identical CTA on the same flag. **Added to the gate list above** | — | Corrected |
| 6 | **`\| date:` has no precedent in this repo and `%-d` is a GNU strftime extension**, unverified against Customer.io's renderer. If the attribute is absent the subject degrades to "Your retest is due on ". Discharge at the test send, not before | — | Test send |

No CA number is claimed; the highest in use is CA-046 and nothing is reserved. **No new Ewa ask should be raised**: one is drafted and unsent, and items 1 and 2 belong in it.

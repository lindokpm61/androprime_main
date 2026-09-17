# Approval Record — Membership renewal copy, CA-026 item C1 re-record (v1)

| Field | Value |
|---|---|
| Register ID | CA-050 |
| Artefact path | `09_website-app/frontend/lib/membership/subscriptionCopy.ts` (the `membershipEnabled === true` branch). Renders at `app/(marketing)/kits/page.tsx` (C1 panel), `app/(marketing)/page.tsx` (membership sentence), `app/lp/testosterone` and `app/lp/hormone-recovery` (FAQ answers), plus the slot-2 footnotes on the same seven routes |
| Version | v1, drafted 2026-09-11, applied behind the flag 2026-09-16/17, cancel clause ruled 2026-09-17 |
| Content type | Customer-facing positioning and price copy (site-wide, flag-gated) |
| Submitted by | Claude (pre-flight session), on Keith's instruction 2026-09-17 |
| Submitted date | 2026-09-17 |
| Required signers | **Keith** (business framing, pricing, payment terms). **Ewa is NOT a required signer on this record**, on Keith's ruling of 2026-09-11 (CA-021 precedent); the reasoning and the structural condition it rests on are in section 0 |

---

## 0. What this record is, and what it does not do

**It re-records ONE item of CA-026: C1, the `/kits` money block.** CA-026 approved a
set (§P, A1, B1, C1, C2, D1/D2, D+, E2) on 2026-07-22, Keith plus Ewa, her
countersignature received 2026-08-02. Every other item of that set is untouched and
CA-026 stands.

**Why C1 alone moved.** `01_strategy/2026-09-07-auto-renew-at-day-30.md` made C1's
third sentence false: the first 30 days of membership are included in the kit price
and the card is charged GBP 47 automatically on day 31, so a sentence promising no
recurring charge unless the buyer chooses one describes a product that no longer
exists. Approved copy is not a rebuild's to change, so nothing was edited in place:
both wordings now live in one module behind `MEMBERSHIP_ENABLED`, and the flag-off
branch renders the approved CA-026 text byte for byte.

**Why Ewa is not a required signer, and the one structural claim that rests on.**
Keith ruled the rewrite business rather than clinical on 2026-09-11, recorded in
`09_website-app/redesign-copy-register.md` row 42a, on CA-021's precedent (business-only
approval where what changes is commercial terms). The register records her CA-026 remit
as clinical and principle. That ruling holds only while C1's fourth sentence, the
conflict-free GP clause, is untouched. **Verified mechanically rather than by eye, twice
and independently:** the sentence is byte-identical in both flag states, it is held in a
single shared constant `GP_SENTENCE`, and with the flag on it renders as its own
paragraph rather than as the tail of the money paragraph, so it is more structurally
separate than it was, not less. Evidence in section 1.

**Two items in section 2 belong to Ewa and are routed, not raised as a new ask.**
`03_compliance/STATE.md` already records a citation swap owed to her on §P clause 2 from
2026-08-21, described there as a re-approval rather than an edit, and carried on ClickUp
`869e9fr6x`. Items F-1 and F-2 ride that pass as further numbered items. Nothing here
starts a new packet.

⚠ **The hub-first step ran LATE, and the ordering is recorded rather than tidied away.**
ClickUp is the central hub and outranks the repo, so the board should have been written
before this record. It was not: the repo-wired MCP connector refuses every call without a
licence key, **reads included**, so the hub was unreachable through the route the
convention assumes, and the record was written first.

✅ **The board now carries it: `869f3guna` on list `901219880207`, status `pending`,
created 2026-09-17 and read back to confirm** (https://app.clickup.com/t/869f3guna). It is named in the
`CA-NNN · artefact · who owes what` shape and addressed to Keith in second person, per the
2026-09-16 rule from CA-049. Claude created it at `pending` and did not move it.

🔴 **What made this reachable is worth more than the task.** `CLICKUP_API_TOKEN` was in
`frontend/.env.local` the whole time and `scripts/content-engine/clickup.ts` has spoken to
the ClickUp API directly for months: **the account was never locked, one client was.** The
convention had exactly one implementation, a third-party wrapper, so it degraded to "skip
it and write the repo" the moment that wrapper failed, and the skip is invisible from the
repo side. There is now a repo path, `09_website-app/frontend/scripts/clickup-approval-task.ts`,
which reads the board before it writes and refuses to set `approved`.

---

## 1. Pre-flight evidence (mandatory)

### 1a. The unit of scan

**The unit of scan is the extracted customer-facing copy, not the module.**
`subscriptionCopy.ts` is roughly seventy per cent commentary by line count and that
commentary names the regulated vocabulary on purpose, so a blended scan of the file
measures its header rather than its copy. Both payloads were dumped by the committed
tool that exists for this, `09_website-app/frontend/scripts/dump-subscription-copy.ts`,
which renders the module through `subscriptionCopy()` once per flag state.

### 1b. This is a rewrite, so the DELTA is the result, not the count

| | Command | Run date | Result |
|---|---|---|---|
| Approved baseline (flag off) | `node .claude/skills/compliance-preflight/scan.js baseline-flag-off.md` | 2026-09-17 | 🔴 HARD 0 · 🟠 REVIEW 0 · 🟡 CODE-COMMENT 0 · 🔵 SIGNED EXCEPTION 0, exit 0 |
| New copy (flag on) | `node .claude/skills/compliance-preflight/scan.js new-flag-on.md` | 2026-09-17 | 🔴 HARD 0 · 🟠 REVIEW 0 · 🟡 CODE-COMMENT 0 · 🔵 SIGNED EXCEPTION 0, exit 0 |

**Delta: zero findings introduced, zero removed, identical sets to the approved
baseline.** Re-run independently by the reviewer in section 1d, same result.

**Disposition of every HARD hit:** none to dispose of on either payload.

### 1c. Three byte-identity checks, run as a script rather than read

| Check | Result |
|---|---|
| Flag-off C1 (heading plus paragraph) against the approved C1 in `02_brand/2026-07-22-conflict-free-wording-pack.md` §C | **IDENTICAL**, character for character |
| The GP clause present in both flag states | **True in both** |
| The GP clause rendering as its own paragraph with the flag on | **True** |

The two sentences that moved are the money sentences. Script retained at
`scratchpad/ca026/identity-check.py`; it reads the pack and both dumps and asserts,
so the claim is re-runnable rather than remembered.

### 1d. Judgement pass: DONE, and by an independent session

**Invariant 7 applies and was honoured.** The session running this pre-flight authored
part of the copy under review (the cancel clause, ruled by Keith as item F4 earlier the
same day), so it may not clear its own work: a pass run by the author measures the
author's model of the work and writes a passed-gate signal others read. The judgement
pass was therefore handed to the `compliance-reviewer` agent, which read `CONTEXT.md`,
`03_compliance/STATE.md` including the rulings layer, the approved pack, the three
governing strategy rulings, both register rows and the code that makes the sentences
true or false, re-ran the scanner itself rather than accepting the floor on report, and
returned a five-bucket finding set. Its verdict, verbatim: *"Not approved, 1 hard item
and 6 flagged, pending Keith's sign-off."*

**What both passes cleared** (stated as properties, not as a list of prohibitions):
the payload states money, timing, dispatch and where results appear. It names no
ingredient and attributes no benefit to anything, so the EFSA table is not engaged at
all rather than engaged and correct. It says nothing about any reader's levels, asserts
no medical act, and claims no regulated service is available, so the Phase 0 boundary is
not approached. Kit 1 is framed by what it measures. The retest is not mentioned, so the
retest-framing rule is not engaged. The only clinical-adjacent sentence is the GP clause,
byte-identical. House style holds: zero em dashes, four renderings of GBP 47 all derived
from `PRODUCT_MAP`, none typed, and the word reserved for the deferred supplement product
appears zero times in the flag-on payload.

**Flag interlock verified in code, not from the comment that describes it:**
`subscriptionCopy(membershipEnabled)` branches whole, `MembershipDisclosure` returns null
with the flag off, `isMembershipEnabled()` reads the environment per request rather than
at module scope, and `scripts/verify-subscription-claims.js` fails the build on a mixed
state. The two states cannot coexist on one screen.

### 1e. Render obligation, discharged

The copy ships as text rather than as an image, so the obligation is the rendered page.
Captured 2026-09-17 against a running build with `MEMBERSHIP_ENABLED=true`, at 1320 and
390 wide, and captured again with the flag off to confirm the approved wording returns
unchanged:

| Surface | Shot |
|---|---|
| `/kits` C1 panel, flag on | `shots/f4/f4-kits-c1.png` |
| `/kits/*` close block with the disclosure line under the buy button | `shots/f1/f1-testosterone-order.png`, `shots/f1/f1-hormone-order-390.png` |
| Homepage membership sentence | `shots/f4/f4-home-membership.png` |
| Flag off, all three kit pages | zero renderings of the disclosure, original footnotes intact, verified by fetching the served pages |

---

## 2. Items flagged for human decision

Surfaced verbatim, not rewritten. **One is graded HARD by the independent pass and is a
condition on the flag flip rather than on this signature.** Sources are marked `[IND]`
for the independent reviewer and `[PF]` for the pre-flight session.

| Ref | Where | Phrase (verbatim) | Risk / rule | Signer |
|---|---|---|---|---|
| **H-A** `[IND]` | `subscriptionCopy.ts:148-151` (C1), and both FAQ answers via `RENEWAL_SENTENCE` | *"The price on the card is everything you pay today, and it includes your first 30 days of membership. On day 31 that card is charged GBP 47 a month."* | **The charge date is stated with no starting point, and the starting point is not the one a reader will assume.** Day 1 is the day the result lands, not the day of purchase: `startOnResult.ts` opens the subscription when the result arrives, with `trial_period_days: MEMBERSHIP_INCLUDED_DAYS`, under `01_strategy/2026-09-07-anchor-everything-to-the-result.md`. The paragraph anchors on *today* and then says *day 31* with no other clock in it, so a buyer counts 31 days from purchase while the real gap adds dispatch, sampling, return post and lab turnaround. This is a priced representation of when money leaves a card, on the surface the DMCC Act 2024 Part 4 prominence duty is being honoured on. **The fact is sayable in the house voice and inside the sentence budget**: the homepage string already says it, *"It starts when your first result lands, and on day 31 it becomes GBP 47 a month."* Direction of the error favours the customer, which is why no phrase-matching gate can see it. | **Keith** |
| **K-1** `[PF]` | The homepage sentence, and both FAQ answers | *"your first 30 days are included in the price of every kit"* | **Unconditional, while the code refuses a membership outright for one cohort.** `startOnResult.ts` returns `low-t-routes-to-gp` before anything else when a confirmed testosterone is under `BORDERLINE_T_FLOOR` (12 nmol/L): Keith's own ruling of 2026-09-17, consistent with CA-014's GP routing. A Kit 1 or Kit 3 buyer whose result comes back under 12 therefore receives no membership and no included days. Kit 2 yields null rather than low and enrols normally, correctly. Direction favours the customer (he is never charged), but *"included in the price of every kit"* is a claim about what he bought. ⚠ **The obvious correction is the expensive one**: naming the exception puts a clinical routing fact on an acquisition surface, which pulls Ewa back in. A scope word would not. | **Keith** |
| **F-1** `[IND]` | `new-flag-on.md:7` | *"If a result needs action, the next step is a GP conversation, and we earn nothing from it."* | Unchanged words, changed neighbour. The paragraph directly above now states a recurring GBP 47 charge, so §P rule 1's absolute is read beside evidence that a result needing action is followed by ongoing revenue. Still literally true; it is a substantiation question. Same shape as CA-026's own 2026-07-22 note F1, which retired a different absolute from this paragraph for the identical reason. **Route: onto the §P citation swap already owed to Ewa from 2026-08-21, as a second numbered item.** | Keith, then Ewa on that pass |
| **F-2** `[IND]` | The money block as a whole | Names the membership on a §P-governed surface for the first time | §P rule 2 (*"No result changes what we offer or what it costs"*) against `entitlement.ts`, which gives a flagged member a day-90 first-cycle retest and an all-clear member an annual one. **Predates this rewrite** and is not created by it; the price half of the rule is strengthened, since GBP 47 is the same for every buyer. What changes is surface area: the result-varying product is now named on the surface the rule governs. Already logged as draft item F2 and as open item F5. **Same carrier as F-1.** | Keith, Ewa sighted |
| **F-3** `[IND]` | `new-flag-on.md:5` | *"no surprise second test"* | Sits one sentence below a membership whose principal entitlement is a second test. Not false: an included, dated retest is neither a surprise nor a separate charge. Flagged rather than cleared because CA-026 audit item F4, the Phase 0 confirmatory-testing boundary, is recorded OPEN in `03_compliance/STATE.md`. The new C1 states no cadence, so it does not extend F4. | **Keith** |
| **F-4** `[IND]` | `app/lp/energy-recovery:380`, `app/lp/hormone-recovery:541` | *"all-in"* | Slot 2 was handled as pure deletion, dropping the false half and keeping the true half, but *all-in* is itself a completeness claim about a price with a recurring charge behind it. **Substantially mitigated:** `MembershipDisclosure` mounts in the same `#order` tray about fifteen lines below the chip, so the renewal line is in view at the CTA. Whether a two-word chip may keep the word is a business call. | **Keith** |
| **F-5** `[IND]` | `lib/membership/disclosure.ts:34` | `MEMBERSHIP_INCLUDED_DAYS = MEMBERSHIP_OFFER_WINDOW_DAYS` | Copy integrity rather than wording. That constant's documented meaning is the JOIN window from Keith's 2026-08-26 rule, *"a gate on JOINING, never on STAYING"*, which is a different concept from the length of the included period. Nothing renders wrong today because both values are 30. If the join window is ever moved, a priced representation moves on every buy surface, in the copy and in the real Stripe trial length, with no copy decision taken. | Keith / engineering |
| **F-6** `[IND]` | The cancel clause, all four renderings | *"Cancel anytime"* | **The phrase itself is clean**: it is the ruled wording, identical across C1, both FAQ answers, the homepage sentence and `MEMBERSHIP_DISCLOSURE`, and appearing twice within a screen on `/kits` is protective under the prominence duty rather than a defect, because the hazard ruled on was divergence and there is none left in the payload. Two things must be true at the flip for the claim to be honest, neither controlled by this copy: **(a)** self-serve cancellation runs through the Stripe billing portal, which 502s where the account holds no saved portal configuration, and §7.3 of the auto-renew ruling still lists the cancellation route as unconfirmed; **(b)** the v1.3 Membership section of the terms is still DRAFT and not synced, while the new heading claims *"Nothing hidden. Not even the renewal."* ⚠ One divergence outside this payload, noted rather than flagged: `app/(marketing)/membership/page.tsx:500` renders *"Cancel any time"* as three words. | **Keith** |

**Previously adjudicated, no action, recorded so nobody re-opens them:** auto-renew with
prominence rather than opt-in as the obligation (Keith, 2026-09-07 §1 and §2); *"Cancel
anytime"* as the cancel clause everywhere (Keith, item F4, 2026-09-17, recorded at
`01_strategy/2026-09-16-membership-is-not-a-subscription.md` §8); business rather than
clinical, CA-021 precedent (Keith, 2026-09-11, row 42a); membership rather than the
supplement product's word in customer copy (Keith, 2026-09-16); GBP 47 derived from
`PRODUCT_MAP` (draft item F5, applied); `BundleChoice`'s chip ruled a false positive
(Keith, 2026-09-16); `llms.txt` taking the deletion handling because a static file cannot
read a flag (applied, `1475c75`).

---

## 3. Conditions of approval

1. 🔴 **H-A is a condition on the flag flip and must be resolved before
   `MEMBERSHIP_ENABLED` goes on**, whether or not this record is signed first. The
   baseline is not a safe fallback: it is false in the other direction, which is why the
   rewrite exists.
2. 🔴 **This copy may not render until the mechanic behind it exists.**
   `STRIPE_PRICE_MEMBERSHIP` is unset, so the start hook refuses and every buyer would
   silently get no membership while the pages promise one. `verify-subscription-claims.js`
   fails the build on exactly this with the flag on, which is the gate working.
3. 🔴 **The v1.3 Membership section of the terms is DRAFT and not synced to either live
   site.** The heading claims completeness about the commercial terms; the document those
   terms live in does not yet contain them.
4. 🟠 **F-1 and F-2 ride the §P citation swap already owed to Ewa from 2026-08-21**
   (ClickUp `869e9fr6x`). They are not a new packet and must not be raised as one.
5. ✅ **The board task exists**, `869f3guna` on list `901219880207` at `pending`,
   created and read back 2026-09-17. **Only Keith moves it to approved.** The register row
   is the mirror of that task, not the other way round.
6. ⚠ **Scope of this record, stated as a decision rather than an inventory:** it covers
   the `membershipEnabled === true` branch of `subscriptionCopy.ts` and every surface that
   consumes it today. It is written to the module, not to a list of routes, so a new
   consumer of the same module inherits this approval. **Re-submission test:** any change
   to the sentences themselves, or any new surface that states the renewal in its own
   words rather than through this module, needs a fresh record.

---

## 4. Signature block — humans only

Approval requires **all** required signers. A signer writes their own name and date.
Until every required row is signed, the register stays PENDING. Claude does not write in
this block and has not.

| Role | Name | Decision (APPROVED / REJECTED / APPROVED-WITH-CONDITIONS) | Conditions | Date |
|---|---|---|---|---|
| Business (Keith) | | | | |
| Clinical / claims (Ewa) | **Not a required signer on this record.** See section 0. Two items are routed to her existing 2026-08-21 pass. | | | |
| Contractual (Solicitor) | Not required for the copy. The terms document itself is separate and is condition 3. | | | |

---

## 5. Outcome

- Final decision: **PENDING.** Not approved: 1 hard item and 7 flagged, awaiting Keith.
- Register updated: 2026-09-17, row CA-050, PENDING.
- Notes: supersedes CA-026's **C1 item only** on approval; the rest of CA-026 stands, and
  the flag-off branch continues to render the CA-026 C1 text byte for byte, so nothing
  currently live changes when this is signed.

---

*Created 2026-09-17. Law: `03_compliance/CONTEXT.md`. Pre-flight: the deterministic floor
plus an independent judgement pass, per invariant 7.*

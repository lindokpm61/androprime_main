# Approval Record — The renewal start-date anchor (defect H-A), v1

| Field | Value |
|---|---|
| Register ID | CA-052 |
| Artefact path | `09_website-app/frontend/lib/membership/subscriptionCopy.ts`, the new shared constant `RENEWAL_CLAUSE` and its four consumers: `c1Paragraphs[0]` (the `/kits` money block), `faqTestosterone`, `faqHormoneRecovery` (via `RENEWAL_SENTENCE`), and `homepageMembership`. Flag-on branch only |
| Version | v1, applied 2026-09-17 |
| Content type | Customer-facing price and payment-timing copy, flag-gated |
| Submitted by | Claude, on Keith's instruction 2026-09-17 |
| Submitted date | 2026-09-17 |
| Required signers | **Keith** (payment terms). **Ewa is NOT a required signer**, on the same reasoning and the same tested condition as CA-050 section 0 and CA-051: what changes is when money leaves a card. The conflict-free GP sentence is untouched and asserted byte-identical in both flag states |

---

## 0. What this record is, and what it supersedes

**It fixes H-A, the one HARD finding that survived CA-050's signature.** That record's
condition 1 said so in its own words: H-A holds *"whether or not this record is signed
first"*. It was the last copy item gating the flag flip.

**The defect.** CA-050's C1 paragraph read:

> The price on the card is everything you pay today, and it includes your first 30 days of membership. **On day 31 that card is charged GBP 47 a month.** Cancel anytime. No charge to see your own results, and no surprise second test.

The paragraph anchors on **today** and then names **day 31** with no other clock in it, so
a buyer counts 31 days from checkout. **Day 1 is the day the RESULT lands** —
`startOnResult.ts` opens the subscription when the result arrives, with
`trial_period_days: MEMBERSHIP_INCLUDED_DAYS`, under
`01_strategy/2026-09-07-anchor-everything-to-the-result.md`. The real gap adds dispatch,
sampling, return post and lab turnaround, so the true first charge is **weeks later** than
the sentence implies. It is a priced representation of when money leaves a card, on the
surface the DMCC Act 2024 Part 4 prominence duty is being honoured on.

**The direction of the error favours the customer**, which is precisely why no
phrase-matching gate could see it.

**What it supersedes:** CA-050's **C1 paragraph and its two kit-LP FAQ answers only**, on
approval. **The rest of CA-050 stands, including its homepage sentence**, which is
unchanged here. CA-051 is untouched.

### It introduces no new wording

The replacement clause is **lifted verbatim from CA-050's own approved homepage
sentence**, which was already stating the fact correctly while `/kits` and both FAQs were
not. The independent pre-flight said as much when it raised H-A: *"the fact is sayable in
the house voice and inside the sentence budget: the homepage string already says it."*

It is now one constant, `RENEWAL_CLAUSE`, with four consumers, rather than four sentences
that can drift.

---

## 1. Evidence

### The delta, measured field by field against the approved baseline

The previous committed module was checked out beside the new one and both payloads
compared key by key, rather than the change being described from memory:

| | Result |
|---|---|
| **Flag OFF** | **No field changed.** Nothing currently live moves on approval. |
| **Flag ON** | **Three fields:** `c1Paragraphs`, `faqTestosterone`, `faqHormoneRecovery`. |
| **`homepageMembership`** | **Byte-identical.** It now reads the constant instead of spelling the clause out, and the output is character for character what CA-050 approved. |

### The rule is enforced, not restated

🔴 **H-A happened because the rule existed only as prose.** It was known, written down,
and obeyed by exactly one surface of four, and **nothing could tell the difference.**
Restating it would have left that gap where it was. `scripts/test-standing-claim.ts`:

- **Case 10 — no string in the flag-on payload may name the charge day without naming the
  starting point.** It walks the whole returned payload rather than a list of fields, so a
  new sentence that states the charge day inherits the rule automatically. Same reason
  `dump-subscription-copy.ts` walks the object instead of enumerating it.
- **Case 10b — every surface that states it must state it in the SAME wording.** The F4
  rule, mechanised.
- **Case 10c — the anchor phrase is read out of the approved 2026-09-11 draft** rather
  than typed into the test. ⚠ Only the anchor is asserted, not the whole sentence: F4 later
  replaced that draft's cancel clause and the draft writes `GBP` rather than the symbol, so
  a whole-string comparison would be asserting against a superseded artefact. **The scope
  of the fixture is the scope of what the draft still governs.**

**Both were mutation-verified, and 10b failed that test the first time.** It derived its
expected clause from the first charge-day mention it found and compared the others against
it, so reverting *that* surface to the un-anchored wording made `indexOf` return −1,
yielded a one-character reference string, and **all four assertions passed while the
defect was present.** A check that reads its expected value out of the data it is checking
cannot fail when the first row is the wrong one. It now requires every mention to yield a
clause and the set of clauses to have exactly one member, and it fails the same mutation
3-of-4.

### Everything else

**41 assertions**, `typecheck` and `npm test` exit 0. Pre-flight **0 HARD / 0 REVIEW / 0
CODE-COMMENT on both payloads**, unit of scan the extracted copy rather than the module.
`verify-subscription-claims.js` reads **0 sentences on 0 pages**.

---

## 2. Items flagged for human decision

| Ref | Where | The item | Why it is here | Signer |
|---|---|---|---|---|
| **N-1** ✅ **RULED: NO CHANGE, Keith 2026-09-17.** The built version stands and no code moved on the ruling. **The alternative is recorded as considered and refused**, not never raised: keeping *"that card is charged"* everywhere would have changed the homepage sentence CA-050 already signed, which is a wider change than the wording suggests. | `c1Paragraphs[0]`, the `/kits` money block | C1 loses *"that card is charged"* and gains *"it becomes"* | 🔵 **THE ONE DECISION.** C1 said *"On day 31 that card is charged GBP 47 a month"* while the homepage said *"it becomes"*. **Keeping both would put one fact in two vocabularies inside one payload, which is the exact defect Keith ruled on as F4 on 2026-09-17**, so one had to go, and the anchored homepage version is the one carrying the fix. **What that costs is C1's concrete card language**, which is the more vivid way to say money is leaving a card, on the block that takes the money. **The alternative:** `It starts when your first result lands, and on day 31 that card is charged GBP 47 a month.` everywhere — still a recombination of approved fragments, but it is a wording change to the homepage sentence CA-050 already signed, so it costs more than it looks. | **Keith** |
| **N-2** | The new clause, all four renderings | *"It starts when your first result lands"* is unconditional | 🟠 **SAME SHAPE AS CA-050's K-1, AND THIS ADDS A CALL SITE.** `startOnResult.ts` returns `low-t-routes-to-gp` before anything else for a confirmed testosterone under `BORDERLINE_T_FLOOR` (12 nmol/L), Keith's ruling of 2026-09-17, so for that cohort the membership starts **never**, not when the result lands. K-1 said the identical thing about *"included in the price of every kit"*. **This record neither creates the issue nor worsens it**, but the two sentences now describe the same exception and must move together: **if K-1 gets a scope word, this clause needs the same one.** Naming the exception outright puts a clinical routing fact on a buy page and pulls Ewa in; a scope word would not. | **Keith** |
| **N-3** | `faqTestosterone`, `faqHormoneRecovery` | Both answers get ~38 characters longer | ⚠ Noted rather than flagged. The clause is a sentence rather than a subordinate phrase. No layout consequence: these are accordion answers, not chips or footnotes. | — |

**Previously adjudicated, recorded so nobody reopens them:** *"Cancel anytime"* as the
cancel clause everywhere (Keith, F4, 2026-09-17); business rather than clinical on a
payment-terms sentence (Keith, 2026-09-11, CA-021 precedent); the result as the anchor for
everything (`01_strategy/2026-09-07-anchor-everything-to-the-result.md`).

---

## 3. Conditions of approval

1. ✅ **DISCHARGED 2026-09-17. N-1 is ruled no-change**, so the condition recorded here —
   that both options were implementable and only one was implemented — is satisfied by the
   ruling rather than by a change. **Nothing was built on the back of it.**
2. 🟠 **N-2 binds this record to K-1.** Neither sentence may take a scope word without the
   other.
3. 🔴 **Inherited from CA-050 and unchanged:** `STRIPE_PRICE_MEMBERSHIP` is unset, so the
   start hook refuses and every buyer would get no membership while the pages describe one.
4. 🔴 **Inherited from CA-051 item J-4:** the flip is a **rebuild and redeploy**, never an
   env change and a restart, because six of the nine module consumers are statically
   prerendered.
5. ✅ **The board task is the original and this file is the mirror.** `869f3mqwj` at
   `pending`. Only Keith moves it to `approved`. **It was created BEFORE this record**,
   which is the order the convention asks for and the opposite of what happened on CA-050.
6. ⚠ **Re-submission test, same as CA-050 and CA-051:** any change to these sentences, or
   any new surface stating the renewal in its own words rather than through this module,
   needs a fresh record. **This session has now paid that toll twice**, which is the
   argument for settling N-1 before signing rather than after.

---

## 4. Signature block — humans only

Approval requires **all** required signers. A signer writes their own name and date.
Until every required row is signed, the register stays PENDING. Claude does not write in
this block and has not.

| Role | Name | Decision (APPROVED / REJECTED / APPROVED-WITH-CONDITIONS) | Conditions | Date |
|---|---|---|---|---|
| Business (Keith) | | | | |
| Clinical / claims (Ewa) | **Not a required signer on this record.** See section 0. The GP sentence is untouched and asserted byte-identical in both flag states. | | | |

---

## 5. Outcome

- Final decision: ✅ **APPROVED. Keith, 2026-09-17.**
- **Evidence, and it is the hub rather than this file.** Board task `869f3mqwj` on list
  `901219880207` read back at status `approved` on 2026-09-17 via
  `09_website-app/frontend/scripts/clickup-approval-task.ts --dry-run`. Per
  `content-approval/README.md` the task status IS the decision on this board. **The register
  row and this file are both copies of that.**
- ⚠ **The signature block in section 4 is deliberately still empty**, on the same basis as
  CA-050 and CA-051: Claude does not write in it, and the operative act was Keith's board
  move. Its absence is not a missing approval.
- ✅ **N-1 was RULED before the signature** (no change, the built version stands) and **no
  code moved on the ruling**, because the option chosen was the one already implemented.
  N-2 is a standing flag rather than a decision; N-3 is a note.
- Register updated: 2026-09-17, row CA-052, APPROVED.
- 🟢 **THIS WAS THE LAST COPY RECORD GATING THE FLAG FLIP.** CA-050, CA-051 and CA-052
  are all signed; `verify-subscription-claims.js` reads 0 sentences on 0 pages; and **nothing
  still outstanding on `MEMBERSHIP_ENABLED` is a copy question.** What remains is
  engineering (`STRIPE_PRICE_MEMBERSHIP`, the Coolify build argument, the terms Membership
  section) plus the Phase-0 compliance read that `lib/flags.ts` names as its own gate.
- 🔴 **CONDITION 6 NOW BINDS THIS RECORD.** Any change to these sentences, or a new
  surface stating the renewal in its own words rather than through the module, needs a fresh
  record. **This session opened CA-051 and CA-052 for exactly that reason**, so the rule is
  not theoretical: the cheapest moment to change approved copy is before it is approved.
- **Superseded:** CA-050's C1 paragraph and its two kit-LP FAQ answers only. The rest of
  CA-050 stands, **its homepage sentence is unchanged**, and CA-051 is untouched. **Nothing
  currently live changed on signature: the flag-off payload is unchanged in every field.**
- Register updated: 2026-09-17, row CA-052, PENDING.
- Notes: supersedes CA-050's C1 paragraph and two FAQ answers on approval; the rest of
  CA-050 stands and its homepage sentence is unchanged. **Nothing currently live changes:
  the flag-off payload is unchanged in every field.**

---

*Created 2026-09-17. Law: `03_compliance/CONTEXT.md`. Defect: H-A, raised by the
independent pre-flight of CA-050 and surviving its signature by that record's condition 1.*

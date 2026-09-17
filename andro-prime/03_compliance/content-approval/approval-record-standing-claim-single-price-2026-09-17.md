# Approval Record — The A1 standing claim under the membership flag (defect H2b), v1

| Field | Value |
|---|---|
| Register ID | CA-051 |
| Artefact path | `09_website-app/frontend/lib/membership/subscriptionCopy.ts`: `standingClaim`, `aboutFactLabel` and `aboutFactSub`, **both flag branches**. Renders at `app/(marketing)/about` (the inverted panel and the fourth trust chip), `app/(marketing)/how-it-works`, `app/lp/collagen` and `app/lp/daily-stack`. **Plus, and on a different gate:** the `openGraph` and `twitter` descriptions in `app/(marketing)/page.tsx` |
| Version | v1, applied 2026-09-17, commit `c364f6f` |
| Content type | Customer-facing positioning copy (site-wide, flag-gated) plus two share-card metadata fields (not flag-gated) |
| Submitted by | Claude, on Keith's instruction 2026-09-17 |
| Submitted date | 2026-09-17 |
| Required signers | **Keith** (business framing, pricing). **Ewa is NOT a required signer**, on the same reasoning and the same structural condition as CA-050 section 0; see section 0 below, which states what that condition is and how it was tested rather than asserted |

---

## 0. What this record is, and what it does not do

**It records what happens to CA-026 item A1, the standing claim, when the membership
flag is on.** A1 reads:

> Testing and selling are kept apart at Andro Prime. You pay one price for the test. Any result that needs a doctor, low testosterone included, goes to a GP, and those results earn us nothing.

**It does not supersede A1 and it changes nothing that is live today.** A1 remains the
approved wording and remains exactly what renders with `MEMBERSHIP_ENABLED` off, which
is the shipping state. What this record covers is the flag-on branch, where the middle
sentence is removed.

**Why the middle sentence cannot survive.** Under
`01_strategy/2026-09-07-auto-renew-at-day-30.md` the first 30 days of membership are
included in the kit price and the card is charged on day 31, so there are two prices.
This is the same reason C1's heading lost "One price" under CA-050, and the same reason
`public/llms.txt` lost the identical sentence in commit `1475c75`.

**It is a deletion, and the result is not new wording.** The flag-on string is
byte-identical to the paragraph `public/llms.txt:7` has served since `1475c75`, under
the same ruling. Nothing was rewritten and no word was introduced. Asserted, not
claimed: `scripts/test-standing-claim.ts` case 3 fails unless the flag-on string equals
the flag-off string with exactly that one sentence removed.

### Why this is a separate record from CA-050 rather than an amendment to it

CA-050 was **approved on 2026-09-17** (board `869f3guna`, read back). Its condition 6
sets the re-submission test: *"any change to the sentences themselves, or any new surface
that states the renewal in its own words rather than through this module, needs a fresh
record."* These surfaces state it **through** the module, which is the sanctioned
direction, but the strings are new to the module and were not in CA-050's enumerated
payload. With CA-050 signed, folding them in is no longer available, so they take their
own number. **CA-050 is untouched and stands.**

### Why Ewa is not a required signer, and the condition that rests on

**A1's third sentence is the conflict-free GP claim and it is the only part inside her
remit.** It is untouched, byte-identical in both flag states, and held in its own
constant `STANDING_CLAIM_GP` so that a future edit has to be deliberate. This is the same
structure and the same argument as `GP_SENTENCE` in CA-050 section 0, and the same
2026-09-11 ruling (business rather than clinical, CA-021 precedent) applies: what changes
here is a **price** sentence.

**Verified mechanically rather than by eye.** `scripts/test-standing-claim.ts` case 4
asserts the GP sentence is present in both states and identical character for character.
**Rework that sentence and she re-enters.** A2 and A3 in the wording pack carry the same
sentence and the same rule.

---

## 1. Evidence

**The flag-off branch is the approved text, asserted against the signed artefact.**
Case 1 reads A1 out of `02_brand/2026-07-22-conflict-free-wording-pack.md` at run time
and requires byte equality. It is not a literal typed into the test, so if the pack is
ever revised the suite fails rather than the two stores drifting apart quietly.

**The flag-on branch is asserted against the other store that already took this cut.**
Case 2 reads the paragraph out of `public/llms.txt` and requires byte equality.

**Neither fixture was written by the implementer.** Both ends of this deletion already
existed in the repo, written under the same rulings, so the suite cannot pass by agreeing
with the author's own model of the strings.

**Anti-re-import.** Case 7 asserts that none of the four pages carries the sentence as a
literal and that each renders it from the module. It is whitespace-tolerant, because on
`/how-it-works` the sentence was wrapped across three JSX lines, which is why a
single-line grep found `llms.txt` and missed the page.

**29 assertions, wired into `npm test`.** `typecheck`, `test` and `build` all exit 0.

**Pre-flight, 2026-09-17.** Unit of scan was the extracted copy from
`scripts/dump-subscription-copy.ts`, not the module, which is mostly commentary.
**0 HARD / 0 REVIEW / 0 CODE-COMMENT on both payloads.** ⚠ **The dumper was made
exhaustive first, and this mattered:** it had enumerated its eleven fields by hand, so
all three new fields would have been absent and the scan would have returned a clean
result about a payload with the strings under review taken out of it. It now walks the
returned object, so a field cannot enter `SubscriptionCopy` without entering the dump.

**Rendered and looked at, both states.** Shot through `12_operations/automation/shot.js`
at 1320 and 390, light theme, `--expect-text` on every shot, in a **separate build per
flag state** (see condition 4). `shots/h2b-off/`, `shots/h2b-on/`. The `/about` trust row
was looked at directly at 1320 in both states: four chips, no wrap, no layout movement.

### The judgement pass, and an honest statement of its thinness

The deterministic floor is clean and the **delta against the CA-050-approved baseline is
zero new wording**: every string here is either an existing approved sentence, that
sentence minus a clause, or a string already approved inside CA-050. There is
correspondingly little for a judgement pass to weigh, and this record does not claim an
independent one was run.

**The one genuine judgement item is the `/about` chip, and it is in section 2 as a
decision for Keith rather than reported as cleared.**

---

## 2. Items flagged for human decision

| Ref | Where | The item | Why it is here | Signer |
|---|---|---|---|---|
| **J-1** ✅ **RULED: OPTION A, Keith 2026-09-17.** The chip stays, carrying CA-050's approved flag-on heading. **No code changed on the ruling**, because option A is what was already implemented; the trust strip keeps four rows in both flag states. **The alternative is recorded as considered and refused rather than never raised.** | `/about`, the fourth trust chip | Flag-off: `{ 'One price', 'For the test, and nothing after it' }`. Flag-on, as implemented: `{ 'Nothing hidden', 'Not even the renewal' }` | 🔵 **THE ONE REAL DECISION, AND IT IS THE ONLY PLACE IN THIS PAYLOAD WITH NO PURE-DELETION FORM.** Both halves of the chip die together: "One price" is false on its own and "nothing after it" is the false half, so deleting the false half deletes the chip and leaves the trust strip with three rows instead of four. What is implemented **introduces no new word**: it is CA-050's approved flag-on `c1Heading` with the full stops dropped to match the chip row's convention, and the suite asserts that equality so the two cannot drift. ⚠ **The judgement it needs is about REGISTER, not wording:** those five words were approved as a money-block heading and are being asked to work as a trust-strip fact beside "UKAS ISO 15189" and "GMC-registered", which are credentials. **The alternative is dropping the chip.** | **Keith** |
| **J-2** ✅ **RULED: YES, Keith 2026-09-17.** The cut stands. **Already applied in `c364f6f`**, so nothing further is built; the ruling converts an applied-but-unapproved change into an approved one. **It remains the only item here that ships at the MERGE rather than the flip.** | `app/(marketing)/page.tsx`, `openGraph` and `twitter` descriptions | *"One price, nothing hidden."* removed, leaving *"Nothing hidden."* | 🟠 **THIS IS THE ONLY PART OF THIS RECORD THAT SHIPS AT THE MERGE RATHER THAN AT THE FLIP.** `export const metadata` is evaluated at module scope and cannot read the flag per request, so it takes the deletion unconditionally, the same handling and the same reason as `public/llms.txt`. *"Nothing hidden."* is true in both states. ⚠ **It is not a new item: it is copy-register row 48's owed item extended.** That row already recorded the homepage meta `description` dropping this exact string as owed to Keith on 2026-09-14; the `openGraph` and `twitter` fields three lines below it kept it for three more days. **One fact, three call sites, and fixing the one the report named made the other two a contradiction rather than a duplicate.** | **Keith** |
| **J-3** ✅ **RULED: LEAVE IT, Keith 2026-09-17.** The line stays as written: the false-positive call, same as `BundleChoice` on 2026-09-16. The paragraph under the heading prices the comparison (*"Separately, those two kits cost £218. Kit 3 gives you all nine markers for £179"*), so it counts **kits against kits**. A dated `CLAIMS_ALLOW` entry names the file and the phrase; the file is still scanned for every other claim. **The interlock now reads 0 sentences on 0 pages.** ⚠ **The exemption is GUARDED and that was not optional:** mutation-verified, rewriting the heading into a genuine single-price claim left the detector reporting **0 on 0**, because a file-and-phrase exemption inherits whatever the line becomes. Case 9 caught it and was the only thing that did. | `app/lp/hormone-recovery/page.tsx:353` | *"One test instead of two. One price instead of two."* | 🟠 **LEFT IN PLACE AND DELIBERATELY NOT EXEMPTED.** It counts **prices in a bundle comparison** (Kit 3 against Kit 1 plus Kit 2), not payments over time, so it is very probably a false positive of exactly the shape Keith ruled on for `BundleChoice`'s "One-off test" chip on 2026-09-16. It is left unexempted so it surfaces for the same explicit ruling rather than being quietly exempted by the person who widened the detector. **It is the only line the gate still reports: 1 sentence on 1 page.** | **Keith** |
| **J-4** | The interlock as a whole | Six of nine module consumers are statically prerendered | 🔴 **NOT COPY, AND IT GATES THE FLIP.** `isMembershipEnabled()` is evaluated at **build** time on `/`, `/kits`, `/about`, `/how-it-works` and the five `/lp/*` routes, so the module's "call it per request" rule is necessary and not sufficient. **Measured:** with the flag true and the server restarted but not rebuilt, `/kits` served the flag-OFF heading *"One price."* while `/kits/testosterone` served flag-ON copy. **Two states, one site, one click apart, on the page that takes the money.** Recorded here because it is a condition on this copy rendering correctly, not because it is a copy question. **It predates this record and applies to CA-050's payload too.** | Keith / engineering |

**Previously adjudicated, recorded so nobody reopens them:** business rather than clinical
on a price sentence (Keith, 2026-09-11, CA-021 precedent, copy-register row 42a); pure
deletion as the handling where a clause dies and its neighbours do not (CA-050 slot 2,
applied); `llms.txt` taking an unconditional deletion because a static file cannot read a
flag (applied, `1475c75`); `BundleChoice`'s "One-off test" chip ruled a false positive
(Keith, 2026-09-16).

---

## 3. Conditions of approval

1. ✅ **DISCHARGED 2026-09-17. J-1 is ruled option A** and option A is what is built, so
   nothing is owed. The condition previously recorded here — that the chip must be answered
   before the flip because both options were implementable and only one was implemented — is
   satisfied by the ruling rather than by a change.
2. ✅ **DISCHARGED 2026-09-17. J-2 is ruled yes** and was already applied in `c364f6f`. It
   remains **the one item here that ships at the MERGE rather than the flip**, so it is now an
   approved part of the Gate B payload rather than something to revert before it.
2a. ✅ **DISCHARGED 2026-09-17. J-3 is ruled leave-it**, the exemption is written with his
   words in its `why`, and it is **guarded** by `test-standing-claim.ts` case 9 rather than
   left to widen silently. **No copy line holds the flip any more:** the interlock reads 0
   sentences on 0 pages. ⚠ That verdict string is the same one it printed this morning over
   seven live instances; what makes it mean something now is that the vocabulary axis is armed
   and the single remaining match is an explicit, dated, tested exemption instead of a gap.
3. 🔴 **This copy may not render until the mechanic behind it exists**, inherited from
   CA-050 condition 2 and unchanged: `STRIPE_PRICE_MEMBERSHIP` is unset, so the start
   hook refuses and every buyer would get no membership while the pages describe one.
4. 🔴 **The flip is a rebuild and redeploy, never an env change and a restart** (J-4).
   Set `MEMBERSHIP_ENABLED` as a Coolify **build argument**, redeploy, then verify one
   static and one dynamic consumer agree before calling the flip done. A flag-on
   screenshot likewise needs its own build.
5. ✅ **The board task is the original and this file is the mirror.** Only Keith moves it
   to `approved`. Created at `pending`.
6. ⚠ **Scope, stated as a decision rather than an inventory:** this record covers
   `standingClaim`, `aboutFactLabel` and `aboutFactSub` in both branches, every surface
   that consumes them, and the two homepage metadata fields. It is written to the module,
   so a new consumer of the same fields inherits this approval. **Re-submission test:** any
   change to the sentences themselves, or any new surface stating the position in its own
   words rather than through this module, needs a fresh record.
7. ⚠ **CA-026 A1 is NOT superseded.** It stays the approved wording and stays what renders
   with the flag off. The wording pack now carries a scope note under A1 saying so and
   pointing at this module, because the pack is the import source and a page-only sweep
   re-imports whatever the source still states. That note is what stops H2b recurring on
   the next surface.

---

## 4. Signature block — humans only

Approval requires **all** required signers. A signer writes their own name and date.
Until every required row is signed, the register stays PENDING. Claude does not write in
this block and has not.

| Role | Name | Decision (APPROVED / REJECTED / APPROVED-WITH-CONDITIONS) | Conditions | Date |
|---|---|---|---|---|
| Business (Keith) | | | | |
| Clinical / claims (Ewa) | **Not a required signer on this record.** See section 0. The GP sentence is untouched and asserted byte-identical in both states. | | | |

---

## 5. Outcome

- Final decision: ✅ **APPROVED. Keith, 2026-09-17.**
- **Evidence, and it is the hub rather than this file.** Board task `869f3m9hx` on list
  `901219880207` read back at status `approved` on 2026-09-17 via
  `09_website-app/frontend/scripts/clickup-approval-task.ts --dry-run`. Per
  `content-approval/README.md` the task status IS the decision on this board. **The register
  row and this file are both copies of that.**
- ⚠ **The signature block in section 4 is deliberately still empty**, on the same basis as
  CA-050: Claude does not write in it, and the operative act was Keith's board move. Its
  absence is not a missing approval.
- ✅ **All three copy items were ruled BEFORE the signature** (J-1 option A, J-2 yes, J-3
  leave it), so **this approval carries no open item**. J-1 and J-2 required no code change
  because both were already what is built; J-3 produced a dated, guarded `CLAIMS_ALLOW` entry
  rather than a copy change. J-4 is engineering, recorded rather than signed.
- Register updated: 2026-09-17, row CA-051, APPROVED.
- 🔴 **CONDITION 6 NOW BINDS THIS RECORD.** Any change to these sentences, or any new
  surface stating the position in its own words rather than through the module, needs a fresh
  record. That is not boilerplate: it is the exact test that closed the cheap route for these
  strings when CA-050 was signed a few hours earlier and forced them into their own number.
  **The cheapest moment to change approved copy is before it is approved.**
- **What is still owed on the flip, and it is not this record's:** H-A, the charge date with
  no starting point, which survives CA-050's signature by that record's condition 1 and needs
  its own record when built. Nothing on CA-051 is waiting.
- ⚠ **The board task NAME still reads "four decisions" and the repo script writes content
  only, so it cannot be corrected from here.** The body is authoritative. This is the same
  one-fact-in-two-places shape `README.md` warns about for PENDING/APPROVED in task names,
  arriving through a tool limitation rather than through carelessness.
- Register updated: 2026-09-17, row CA-051, PENDING.
- Notes: nothing currently live changes on approval except J-2, which is already applied
  on the branch and ships when Direction F merges. CA-026 A1 and CA-050 both stand.

---

*Created 2026-09-17. Law: `03_compliance/CONTEXT.md`. Defect: H2b, copy-register row 42b.
Pre-flight: the deterministic floor, clean on both payloads; the judgement pass is stated
as thin in section 1 rather than claimed.*

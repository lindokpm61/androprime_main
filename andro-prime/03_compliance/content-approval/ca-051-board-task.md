<!--
The text written to the ClickUp task for CA-051, kept here so the board and the repo
can be diffed. The BOARD is the hub and outranks this file; this is the mirror.
Written by `09_website-app/frontend/scripts/clickup-approval-task.ts`.
-->

✅ **ALL THREE COPY DECISIONS ARE RULED (Keith, 2026-09-17). Nothing is owed: sign it.** Nobody else is required. Ewa is not a signer on this one, for the same reason and on the same tested condition as CA-050.

⚠ **The task NAME still reads "four decisions" and cannot be edited by the repo script, which writes content only.** The body is authoritative. Same one-fact-in-two-places shape the README warns about for PENDING/APPROVED in task names.

**Artefact:** `09_website-app/frontend/lib/membership/subscriptionCopy.ts`: `standingClaim`, `aboutFactLabel`, `aboutFactSub`, both flag branches. Renders on `/about`, `/how-it-works`, `/lp/collagen` and `/lp/daily-stack`. Plus the `openGraph` and `twitter` descriptions on the homepage, which are on a different gate.

**Record:** `03_compliance/content-approval/approval-record-standing-claim-single-price-2026-09-17.md`
**Register:** `content-approval-register.md`, row CA-051. **Defect:** H2b, copy-register row 42b. **Commit:** `c364f6f`.

## Scope, and what it does NOT do

Records what happens to **CA-026 item A1, the standing claim**, when the membership flag is on. **A1 is not superseded.** It stays the approved wording and stays exactly what renders with the flag off, which is the shipping state. **Nothing currently live changes when you sign, except J-2 below.**

With the flag on, A1 loses its middle sentence, *"You pay one price for the test"*, because there are two prices now. Same reason C1's heading lost "One price" under CA-050 and `llms.txt` lost the identical sentence in `1475c75`.

**The result is not new wording.** It is byte-identical to the paragraph `llms.txt:7` has served since `1475c75`, under the same ruling. A test asserts that equality rather than claiming it.

## Why this is its own number and not an amendment to CA-050

CA-050 was approved on 2026-09-17, so folding these strings into it is no longer available. Its condition 6 is what makes them need a signature at all: these surfaces state the position **through** the module, which is the sanctioned direction, but the strings are new to the module and were not in CA-050's enumerated payload. **CA-050 is untouched and stands.**

## Why Ewa is not a signer

A1's third sentence is the conflict-free GP claim and is the only part in her remit. It is untouched, byte-identical in both flag states, and held in its own constant so a future edit has to be deliberate. Same structure and same argument as `GP_SENTENCE` under CA-050, and the same 2026-09-11 ruling: what changes here is a price sentence. Asserted by test, not by eye. **Rework that sentence and she re-enters.**

## What you have ruled, and what is left

- ✅ **J-1 RULED: OPTION A, Keith 2026-09-17.** The chip stays, carrying CA-050's approved flag-on heading. **This is what was already implemented, so no code changed on the ruling** and the trust strip keeps four rows in both flag states. The alternative, dropping the chip, is recorded as considered and refused rather than never raised. Original framing kept below.
- ✅ **J-2 RULED: YES, Keith 2026-09-17.** The two homepage share-card descriptions lose *"One price,"* unconditionally. **Already applied on the branch in `c364f6f`**, so nothing further is built; this converts it from an applied-but-unapproved change into an approved one. It remains the only item here that ships at the **merge** rather than at the flip.
- ✅ **J-3 RULED: LEAVE IT, Keith 2026-09-17.** The line stays as written, which is the false-positive call, the same one `BundleChoice`'s chip got on 2026-09-16. The context settles it: the paragraph directly under the heading prices the comparison, *"Separately, those two kits cost £218. Kit 3 gives you all nine markers for £179"*, so it counts **kits against kits**, never payments over time. A dated `CLAIMS_ALLOW` entry now names the file and the phrase, and the file is still scanned for every other claim. **The interlock reads 0 sentences on 0 pages, so no copy line is holding the flip any more.**
- ⚠ **AND THE EXEMPTION IS GUARDED, BECAUSE AN EXEMPTION IS A CLAIM ABOUT A LINE AND NOTHING WAS CHECKING THE LINE.** Its reasoning is true of the current sentence and of nothing else. **Mutation-verified:** rewriting that heading into a genuine single-price claim left the detector still reporting **0 on 0**, because a file-and-phrase exemption silently inherits whatever the line becomes. `test-standing-claim.ts` case 9 asserts the heading AND its pricing paragraph still read what they read when this was granted, and it was the only thing that caught the mutation. Change either and the suite fails, which forces the exemption to be re-argued rather than quietly inherited.

### The original framing, kept because the reasoning is the record

- 🔵 **J-1, the `/about` trust chip. This is the real one.** Flag-off it reads `One price / For the test, and nothing after it`. **Both halves die together**, so there is no pure-deletion form: deleting the false half deletes the chip and leaves three trust rows instead of four. What is implemented introduces **no new word**, being CA-050's approved flag-on heading (*Nothing hidden / Not even the renewal*) with the full stops dropped to match the chip convention. **The judgement is about register, not wording:** those words were approved as a money-block heading and are being asked to work as a trust-strip fact beside "UKAS ISO 15189" and "GMC-registered", which are credentials. **The alternative is dropping the chip.** Looked at rendered in both states at 1320: four chips, no wrap either way.
- 🟠 **J-2, the two homepage share-card descriptions.** *"One price, nothing hidden."* becomes *"Nothing hidden."*, **unconditionally**, because `export const metadata` cannot read a flag. **This is the only item here that ships at the MERGE rather than at the flip**, so if you reject it, it reverts before Gate B, not before Gate E. It is not new: copy-register row 48 already recorded the meta `description` dropping this exact string as owed to you on 2026-09-14, and the two fields three lines below it kept it. One fact, three call sites.
- 🟠 **J-3, `lp/hormone-recovery:353`**, *"One test instead of two. One price instead of two."* Almost certainly a false positive of the shape you already ruled on for `BundleChoice`'s chip on 2026-09-16: it counts prices in a bundle comparison, not payments over time. **Left unexempted on purpose** so it gets your explicit ruling rather than a quiet exemption from the person who widened the detector.
- 🔴 **J-4 is not copy and it gates the flip.** Six of the nine consumers of this module are statically prerendered, so the flag is read at **build** time there. Measured: with the flag on and the server restarted but not rebuilt, `/kits` served the flag-OFF heading *"One price."* while `/kits/testosterone` served flag-ON copy. **Two states, one site, one click apart, on the page that takes the money.** So the flip is a rebuild and redeploy, never an env change and a restart. **This predates this record and applies to CA-050's payload too.**

## How the defect got this far

`verify-subscription-claims.js` exists to catch exactly this claim and was reporting **`0 sentence(s) on 0 page(s)`** and the verdict *"the copy sweep is done"* over seven live instances. Its phrase list greps for "no subscription", "one-off" and "pay once"; A1 says it as "one price". The check had been widened three times along its **directory** axis and never once along its **vocabulary** axis. One entry took it to 8 on 6. It now reads 1 on 1, and the only line left is J-3.

## Pre-flight

**0 HARD / 0 REVIEW on both payloads.** Unit of scan was the extracted copy, not the module. **Delta against the CA-050-approved baseline is zero new wording.**

⚠ **The dumper was made exhaustive first, and it mattered.** It had listed its eleven fields by hand, so all three new fields would have been missing and the scan would have returned a clean result about a payload with the strings under review taken out of it. It now walks the object, so a field cannot be added without entering the dump.

The record states the judgement pass as **thin rather than claiming an independent one was run**, because every string here is an existing approved sentence, that sentence minus a clause, or a string already approved inside CA-050. J-1 is the item that genuinely needs judgement, and it is above for you rather than reported as cleared.

## Conditions recorded against approval

`STRIPE_PRICE_MEMBERSHIP` is still unset, inherited from CA-050. ✅ **J-1 is answered**, so the condition that used to sit here is discharged. J-2 is on the merge gate rather than the flip gate and is now approved. ✅ **J-3 is answered and its exemption is written and guarded**, so no copy line holds the flip. J-4 is engineering and is recorded rather than signed.

---

⚠ **Claude created this at `pending` and did not move it, and has not moved it now.** Recording your two rulings and performing the approval are two different acts; only you set it to approved. **Nothing is owed before you can:** all three copy items are answered. J-1 and J-2 were already built, and J-3's exemption is written, dated in your words, and guarded by a test.

⚠ **The record file was written about a minute before this task, and the guard caught it.** `.claude/hooks/approvals-board-guard.js`, added after CA-050 went into the register with no task at all, blocked the write and named the fix. The ordering is recorded here rather than tidied away, because a guard that fires and gets quietly worked around is worse than no guard.

# Approval Record — The symptom overlay screen (v1)

| Field | Value |
|---|---|
| Register ID | CA-048 |
| Artefact path | `04_products/results-engine/2026-09-16-symptom-overlay-screen-copy.md` §2, §3 and §4a. The screen shown to a man whose results are in range and who has recorded that he still does not feel well |
| Version | v1 (assembled 2026-09-16 from copy signed under CA-047 and the 2026-08-18 rulings) |
| Content type | Customer-facing on-screen copy, results engine. Safety escalation, GP referral and a complement panel suggestion, as one screen |
| Submitted by | Keith Antony |
| Submitted date | 2026-09-16 (sent 23:42 UTC 2026-09-15) |
| Required signers | Ewa (clinical) + Keith (business) |
| Decision | ✅ **APPROVED 2026-09-16. BOTH SIGNERS IN.** Ewa (clinical) 5 of 5; Keith (business) on his direct instruction, *"CA-48 approved"*. ⚠ **Approval fills the copy; it authorises no build and no deploy** (§4) |

## 1. Pre-flight evidence (mandatory)

- **Deterministic scanner: CLEAN.** `0 HARD / 0 REVIEW / 0 CODE-COMMENT` on the extracted payload
  and, separately, on the whole draft file. **Unit of scan stated:** the two fenced copy blocks,
  apparatus excluded, per the payload/apparatus split.
- ✅ **Verbatim check: 4 of 4 signed blocks identical to source**, diffed word for word with only
  whitespace, blockquote prefixes and markdown link syntax normalised. 🔴 **The emergency wording
  was compared against the LIVE article, not against the approval record's quotation of it**, and
  that mattered: CA-047's record drops the NHS citation the live version carries, so a lift made
  from the record would not have been verbatim.
- ✅ **Judgement pass: TWO passes, one of them independent.** The session that assembled the copy is
  barred from clearing it, so the `compliance-reviewer` agent ran a separate pass. It found **1 HARD
  and 5 REVIEW**, including a false claim in the drafter's own apparatus. Both passes independently
  found the Kit 3 defect.
- ✅ `signoff-email/validate.js` exited **0** on the packet before the draft was created.

### 🔴 The HARD finding, and it was in the trigger conditions rather than the words

An earlier draft scoped both composites to **Kit 3**. Kit 3 measures all nine markers
(`lib/kits/panel.ts:144` makes `hormone-recovery` the union of the other two panels), so there is no
untested panel to widen to, and both signed wordings depend on there being one. The screen would
have offered a man a panel he had just bought and read.

**Four rules broke at once:** §2a's *"step 1 can only ever suggest an untested panel"*, CA-047 round
2 Q8 (never repeat an in-range marker early, with no floor needed **because** the widen-first path
was held to be the whole answer), the 2026-07-08 complement rule, and the CA-014 adjacency defence,
which relies on the suggestion being a complement and not a re-measure.

🔴 **And the existing code guard gives ZERO protection here.** `resultMayCarryRetestOffer()` returns
`!states.some(s => badgeFor(s).label === 'See Your GP')`. On this screen **every marker is in range
by the trigger condition**, so no state carries a GP badge and the guard returns `true`. The
protection has to live in the trigger conditions. Same shape as the defect that rule was written to
close: a per-item check cannot see a per-collection rule.

⚠ **It was found by reading the panel definition, not by reading the copy.** The copy reads
perfectly well while being wrong about who is looking at it, which is why no text-level check could
have caught it.

⚠ **A correction the drafter made and then had to correct again.** The first write-up said the Kit 3
case *"has no signed copy and nobody has listed it"*. **That was false.** §2a's step-1 table lists
Kit 3 explicitly, *"Kit 3 (superset) | — | none left → GP"*, decided by Keith on **2026-07-17**. The
routing was decided fourteen months earlier; only the sentence was missing. The distinction is the
whole cost of the item: an undecided case needs a clinical ruling, an unworded one needs wording
against a decision that already exists.

## 2. Items flagged for human decision

Five lettered questions, sent 2026-09-15 23:42 UTC, answered 2026-09-16 00:04 UTC, **22 minutes**.
Gmail thread `1a0a77178beb2d2f`, reply `1a0a78774f57f01f`. The preamble stated that answering all
five **is** the sign-off, with no separate approval question.

**`1: A  2: B  3: A  4: A  5: A`**

✅ **Five letters against five questions. The expected count was written down before sending and met
exactly, and the ROWS were counted as well as the answers** — the CA-047 lesson, where a reply
matched its expected answer count and the shortfall was in rows.

| Q | Item | Answer | Meaning and effect |
|---|---|---|---|
| 1 | The 999 paragraph moving from two articles onto a results screen | **A** | Carries over **exactly as it appears on the articles**. The surface-class transfer is approved. ⚠ *"Exactly as it appears"* includes the **live NHS hyperlink**, which the draft rendered as plain text, so that half of the build item is now decided |
| 2 | The lead-in above her red-flag list | 🔴 **B** | The drafted lead-in stands: *"See your GP now, rather than testing again, if any of these apply:"*. **She declined the "Otherwise," option.** See §3 |
| 3 | Reader self-triage versus engine-side suppression | **A** | The connective *"If none of the above applies to you:"* stands. **No new symptom capture**, so no new special-category data and no DPIA change |
| 4 | The missing Kit 3 wording | **A** | Accepted as drafted: *"Your results are in range across every marker we measure. If you are still not feeling right, that is worth taking to your GP. There is nothing further we can test for you here."* |
| 5 | Vitamin D named alongside energy | **A** | Stands as she wrote it. These are **blood markers to measure, not an ingredient claim**, so the EFSA ingredient table is not engaged |

**No copy moved on any of the five answers**, so the pre-flight above stands against the exact text
that was signed. Q2 selected between two candidate sentences and she chose the one already drafted.

## 3. 🔴 Q2 = B went against the review, and that is the interesting part

The independent pass called the **"Otherwise,"** option *"the single most useful thing to put in
front of her"*, and the argument was sound: her list opens with an unqualified **"chest pain"**
while the block above routes *sudden or severe* chest pain to 999, so a man with sudden severe chest
pain matches **both lists** — and the `cholesterol-test` FAQ already resolves exactly that, after
the word "Otherwise".

**The question named that conflict explicitly, with the precedent, and she chose B anyway.**

⚠ **This is a considered ruling, not an oversight, and it is recorded here because no reasoning was
given.** The double-match is hers to weigh and she has weighed it. **Anyone who later "corrects" the
lead-in by inserting an "Otherwise," is reversing a clinical ruling, not tidying a sentence.**

✅ **It is also the argument for asking rather than adopting.** Both options went to her because the
reviewer's case was strong but was not the reviewer's to make. Adopting A on the strength of that
argument would have shipped an unsigned change into a screen she was about to sign, and it would
have looked like diligence.

## 4. Sign-off

| Signer | Role | Decision | Date |
|---|---|---|---|
| Dr Ewa Lindo | Clinical | ✅ **Agreed, 5 of 5.** Direct written reply from `ewalindo@live.co.uk` 00:04 UTC, thread `1a0a77178beb2d2f`, message `1a0a78774f57f01f`, 22 minutes after sending: `1: A 2: B 3: A 4: A 5: A`. 🔴 **Q2 = B declined the reviewer's preferred option** after the conflict was named and the precedent quoted | 2026-09-16 |
| Keith Antony | Business | ✅ **Approved**, direct instruction: *"CA-48 approved"* | 2026-09-16 |
| Compliance pre-flight | — | ✅ **RAN AND CLEARED.** Deterministic `0 HARD / 0 REVIEW` on payload and on the whole file; verbatim 4 of 4 against live sources; **two judgement passes, one independent**. ⚠ **No sentence changed between the pre-flight and the sign-off**, so the evidence stands against the exact approved text | 2026-09-16 |

✅ **This closes build-checklist item 7 of `2026-09-15-retest-cadence-by-rule-kind.md` §5, and with
it the whole retest-cadence checklist.** Items 1, 2, 2b and 3 closed 2026-09-15; 4, 5 and 6 closed
2026-09-16 with the map and its fixture; 7 was the last open row.

## 5. Conditions that ride with this screen to the build

🔴 **None of these is a sign-off question, and approval does not discharge any of them.**

1. **The NHS citation ships as a live link** (settled by Q1 = A) (settled by Q1 = A). ⚠ **The `SystemAlert`
   container is NOT settled** and was not put to her; on `cholesterol-test` the block sits inside
   one titled *"When to see your GP, not us"*, and ordering alone does not reproduce that weight.
3. **Sweep every surface this lands on for a second, machine-read copy.** The `cholesterol-test`
   frontmatter FAQ at `:56-66` is live proof this is a real trap, and it is also where the
   "Otherwise," precedent lives.
4. 🔴 **The render obligation is UNDISCHARGED.** Nothing here has been rendered. Contrast,
   truncation and whether the 999 block clears the fold on a phone are failures that leave the
   string correct in the DOM, so no text-level check can see them.

⚠ **AND ONE THING A FUTURE EDITOR MUST NOT DO.** Q2 = B declined the "Otherwise," option with the
conflict named and the precedent quoted. §3 keeps the losing argument in full, so the case can be
seen to have been made and lost. **Inserting one later reverses a clinical ruling.**

**This record authorises the COPY. It does not authorise a build or a deploy.**

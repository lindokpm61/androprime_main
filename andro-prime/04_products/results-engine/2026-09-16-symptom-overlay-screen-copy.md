# The symptom overlay screen: the composites

**Status:** ✅ **APPROVED 2026-09-16. CA-048, both signers in** (Ewa clinical 5 of 5; Keith
business, *"CA-48 approved"*). ✅ **BUILT 2026-09-16 and GATED OFF** (`SYMPTOM_OVERLAY_ENABLED`): `lib/results/symptomOverlay.ts`, `components/results-engine/SymptomOverlay.tsx`, 37 assertions in `npm test`. **All four build conditions are discharged.** 🔴 **It reaches nobody, and the blocker is the TRIGGER rather than the screen:** nothing in the product writes the symptom answer it keys off, and no route mounts the component, so flipping the flag renders nothing. **Owner workspace:** `04_products/results-engine`. **Drafted:** 2026-09-16.
**Closes (when cleared):** build-checklist item 7 of `2026-09-15-retest-cadence-by-rule-kind.md` §5.
**Ruling:** **`1: A 2: B 3: A 4: A 5: A`**, `ewalindo@live.co.uk` 2026-09-16 00:04 UTC, thread
`1a0a77178beb2d2f`. Record: `03_compliance/content-approval/approval-record-symptom-overlay-screen-2026-09-16.md`.
ClickUp `869f2jyce`.
**Pre-flight:** ran 2026-09-16, two passes, one of them independent. Deterministic floor clean on
the payload and on this whole file. Judgement pass: **1 HARD, closed in §4a; 8 items owed.**

**Why this document exists.** CA-047 signed three pieces of on-screen copy that have never been
assembled and have never existed in the product. Their pre-flight failed on 2026-09-15 for a reason
no sentence-level check could see: the Q5 red-flag list was examined on its own, and what was
missing sat **above** it. The pieces are therefore assembled here first and pre-flighted as a whole
screen, which is the unit a reader actually receives.

⚠ **EVERY DOWNSTREAM DOC SAYS "THE COMPOSITE", SINGULAR. THERE ARE THREE CASES AND ONLY TWO HAVE
WORDING.** Round 2 Q7 signed two panel-suggestion wordings, one per kit. **Kit 3 is a third case
with no wording at all**, and it is §4a.

---

## 1. Provenance: every block, and what signed it

| Block | Source | Signed | New here? |
|---|---|---|---|
| "Read this part first. Call 999 now if:" | Live on `cholesterol-test`:251 | Ewa, **2026-08-18**, narrow follow-up Q1 = A (13:19 UTC) | no |
| The 999 escalation itself | `signs-of-stress-in-men`:115, then placed on `cholesterol-test`:253 | Ewa, **2026-08-18**, same ruling | ⚠ Lifted to a **new surface class** |
| Red-flag GP list | `2026-07-17-retest-cadence-table.md` §4 Q4(b) | Ewa, **2026-09-15**, CA-047 round 1 Q5 = A, verbatim | ⚠ Its **lead-in** is new |
| Panel suggestion A | §4 Q4(a), first wording | Ewa, **2026-09-15**, round 2 Q7 = A, verbatim | no |
| Panel suggestion B | §4 Q4(a), second wording | Ewa, **2026-09-15**, round 2 Q7 = A, verbatim | no |
| The conditional connective | — | **nothing** | 🔴 **entirely new** |

✅ **"VERBATIM" IS MEASURED HERE, NOT CLAIMED.** All four signed blocks were diffed against their
sources word for word: **four of four identical.** The emergency wording was compared against the
LIVE article rather than against the approval record's quotation of it, and that mattered: the
record drops the NHS citation the live version carries, so a lift made from the record would not
have been verbatim.

⚠ **THE WORDING HAS ALREADY MIGRATED ACROSS SURFACES ONCE, WITH HER APPROVAL OF THE DESTINATION.**
It originated on `signs-of-stress-in-men` and Q1 = A approved **placing it on** `cholesterol-test`,
minus its stress-specific sentence. That strengthens rather than weakens the case for this transfer,
and it is the precedent to put in front of her. **What differs here is the surface CLASS:** both
prior homes are articles, read by someone browsing. This is a results screen, read by a man who has
just been measured and has said he is unwell.

~~🔴 **Exactly TWO sentences on this screen carry no signature** (the lead-in and the
connective).~~ ✅ **BOTH SIGNED 2026-09-16.** The lead-in by Q2 = B and the connective by Q3 = A,
each chosen against a stated alternative rather than waved through. **Every sentence on this screen
now carries a signature.** See §4.

---

## 2. Composite A: Kit 1, testosterone in range

Shown on a **Kit 1** result where the testosterone state is in range and the man has recorded that
he is still unwell. **Not Kit 3** — see §4a.

Block 2's lead-in and block 3's connective are ⚠ **NEW and unsigned**. They are marked in §4 rather
than inside the copy, so a copy-paste build cannot ship the annotation.

```copy
Read this part first. Call 999 now if:

You have sudden or severe chest pain, pain that spreads to your arm, neck, jaw or back, or chest
pain with breathlessness, sweating or feeling sick. Don't talk yourself out of it. Rule out your
heart first, every time (NHS, Chest pain).

See your GP now, rather than testing again, if any of these apply:

chest pain, breathlessness at rest or on light exertion, unexplained weight loss, blood in stool or
urine, a new lump, fainting, or any symptom that is new and getting worse week on week.

If none of the above applies to you:

Your testosterone results are in range. If you are still not feeling right, the markers behind
energy and recovery are the next sensible thing to look at: Vitamin D, Active B12, ferritin and
hs-CRP. If you would rather not test again, speak to your GP.
```

## 3. Composite B: Kit 2, energy and recovery in range

Shown on a **Kit 2** result where the energy and recovery markers are in range and the man has
recorded that he is still unwell. **Not Kit 3** — see §4a.

```copy
Read this part first. Call 999 now if:

You have sudden or severe chest pain, pain that spreads to your arm, neck, jaw or back, or chest
pain with breathlessness, sweating or feeling sick. Don't talk yourself out of it. Rule out your
heart first, every time (NHS, Chest pain).

See your GP now, rather than testing again, if any of these apply:

chest pain, breathlessness at rest or on light exertion, unexplained weight loss, blood in stool or
urine, a new lump, fainting, or any symptom that is new and getting worse week on week.

If none of the above applies to you:

Your energy and recovery markers are in range. If you are still not feeling right, testosterone is
the next sensible thing to look at. If you would rather not test again, speak to your GP.
```

🔴 **THE NHS CITATION MUST SHIP AS A LINK, AND THE ESCALATION NEEDS A CONTAINER.** Both blocks above
render it as plain text; the live version does not. `cholesterol-test`:253 carries
`(NHS, [Chest pain](https://www.nhs.uk/conditions/chest-pain/))`, and the whole block sits **inside
a `SystemAlert`** titled *"When to see your GP, not us"*. On a safety escalation a dead citation is
a downgrade of the substantiation, and ordering alone does not reproduce the visual weight of an
alert box. Either carry both, or record why not.

---

## 4. The two sentences that were unsigned, and how she ruled on them

### The lead-in, and the disambiguator it drops

*"See your GP now, rather than testing again, if any of these apply:"*

✅ **SIGNED 2026-09-16, Q2 = B: THIS SENTENCE STANDS, AND SHE DECLINED THE ALTERNATIVE.** The
argument below was put to her verbatim, with the precedent, as option A. She chose B.
⚠ **A considered ruling, not an oversight. Anyone who later inserts an "Otherwise," is reversing a
clinical ruling, not tidying a sentence.** The unresolved analysis is kept below exactly as it was
written, because a ruling is only checkable against the case that was put.

🔴 **THE CASE THAT WAS PUT, AND LOST.** Ewa's list opens with an unqualified **"chest pain"**, and the block above
routes *sudden or severe* chest pain to 999. A man with sudden severe chest pain matches **both
lists**. The live signed implementation handles exactly that: the `cholesterol-test` FAQ at `:56-66`
prepends the 999 sentence and resumes her signed text after an **"Otherwise,"**. This draft has no
equivalent. **That is the single most useful thing to put in front of her.**

~~⚠ **"now" is unsigned urgency.**~~ ✅ **Signed with the sentence, Q2 = B.** Retained for the
record: Q5 ratified a list of symptoms, not an urgency qualifier. "Call 999
**now**" and "See your GP **now**" flatten the two-tier gradient the whole stack exists to create.
Directionally conservative, and still new clinical framing on a safety boundary.

✅ *"rather than testing again"* is the safest part: it suppresses a sale and echoes the register of
her own signed closing line. One imprecision, not worth rewording her adjacent sentence over: on
Composite A the suppressed action is a **different** panel, not a repeat test.

### The connective, and the gate it creates

*"If none of the above applies to you:"*

**Why something has to sit there.** §2a's routing is an ordered path, and the red-flag list is the
case where a man **skips step 1 and goes straight to the GP**. Three blocks stacked with nothing
between them show him the step he was signed to skip, and put a panel to buy directly beneath an
instruction to see a doctor now.

✅ **SIGNED 2026-09-16, Q3 = A: THE CONNECTIVE STANDS, AND ENGINE-SIDE SUPPRESSION WAS DECLINED.**
Both routes were put to her with the objection to each. 🔴 **The consequence worth carrying: no
red-flag symptom capture is built, so no new special-category data is collected and the DPIA is
untouched.** The objection below was stated in the question and she ruled against it.

🔴 **THE OBJECTION THAT WAS PUT, AND LOST.** The 999 block says **"Don't talk yourself out of it."** The
connective then invites precisely that self-assessment, against a list containing chest pain,
fainting, blood in stool and a new lump. A man who minimises his symptoms, which is the exact
failure mode the 999 sentence warns against, passes his own gate and lands on the buy-a-panel
sentence.

⚠ **THIS IS A CHOICE, NOT A NECESSITY, AND AN EARLIER DRAFT OF THIS SECTION PRESENTED IT AS ONE.**
The alternative is **engine-side suppression**: where the red-flag branch is known, do not render
the panel block at all, and no new copy exists to sign.

| Route | Cost | Risk |
|---|---|---|
| Reader self-triage (the connective) | one unsigned sentence | the self-assessment gate above |
| Engine-side suppression | **no new copy** | needs red-flag symptom capture that does not exist |

🔴 **§2a ASSERTS THE DATA IS ALREADY THERE. IT IS NOT.** `classifier.ts:16` takes
`symptomAnswers: Array<{ questionKey: string; answer: unknown }>`, and every fixture carries `[]` or
`energy_symptoms: true`. **Nothing captures chest pain, weight loss, blood in stool, a new lump or
fainting.** Adding it is **new special-category health data (Art 9)**, so it triggers CONTEXT.md's
DPIA update rule, and asking a man to tick "blood in stool" during checkout is its own compliance
question. The connective is probably the right route, but Ewa should be ruling on a trade-off rather
than ratifying a necessity.

---

## 4a. 🔴 Kit 3 is a third case, and it has no wording

**Kit 3 measures all nine markers.** `lib/kits/panel.ts:144` makes `hormone-recovery` the union of
the other two panels. So for a **Kit 3 man, in range, still unwell, there is no untested panel to
widen to**, and both signed wordings depend on there being one. Composite A would offer him vitamin
D, Active B12, ferritin and hs-CRP; Composite B would offer him testosterone. **He has just bought
and read both.**

⚠ **AN EARLIER DRAFT OF THIS FILE SCOPED BOTH COMPOSITES TO KIT 3, WHICH IS WHERE THE ERROR WOULD
HAVE SHIPPED FROM.** It was found by reading the panel definition, not by reading the copy: the copy
reads perfectly well while being wrong about who is looking at it. ⚠ **A Kit 3 all-clear satisfies
BOTH stated trigger conditions at once**, so the "mutually exclusive" framing this file opened with
holds for Kit 1 and Kit 2 and fails here.

**Four rules break at once on Kit 3, so this is determinate rather than a judgement call:**

1. **§2a's scope limit** — *"step 1 can only ever suggest an **untested** panel from our own range."*
2. **CA-047 round 2 Q8 = A** — never repeat an in-range marker early, with **no floor needed**
   precisely because the widen-first path was held to be the whole answer. On Kit 3 that path does
   not exist, so nothing catches it.
3. **The 2026-07-08 complement rule** — a man who just tested a marker is not sold a kit re-testing it.
4. **The CA-014 defence in §4 collapses.** The panel suggestion survives the adjacency objection
   because a complement cross-sell offers markers we have **not** measured. On Kit 3 it is not a
   complement and it does re-measure, so the exemption being relied on does not apply.

🔴 **AND THE EXISTING CODE GUARD GIVES ZERO PROTECTION HERE.** `resultMayCarryRetestOffer()` returns
`!states.some(s => badgeFor(s).label === 'See Your GP')`. On this screen **every marker is in range
by the trigger condition**, so no state carries a GP badge, the guard returns `true`, and nothing
stops the offer. The protection has to live in the **trigger conditions**. Same shape as the defect
that rule was written to close: a per-item check cannot see a per-collection rule.

⚠ **CORRECTING THIS FILE'S OWN EARLIER CLAIM, because it was wrong and the error mattered.** An
earlier draft said the Kit 3 case *"has no signed copy and nobody has listed it"*, and compared it
to `fai-reported`, the state that was missing from every record. **That comparison was false.** §2a's
step-1 table lists Kit 3 explicitly — *"Kit 3 (superset) | — | none left → **GP**"* — decided by
Keith on **2026-07-17**. **The routing was decided; what is missing is only a sentence that says it
to the man.** The distinction is the whole cost of the item: an undecided case needs a ruling from
Ewa, an unworded one needs wording against a decision that already exists.

✅ **CLOSED 2026-09-16, Q4 = A. The third composite has its closing wording**, accepted as drafted:

```copy
Your results are in range across every marker we measure. If you are still not feeling right, that
is worth taking to your GP. There is nothing further we can test for you here.
```

It carries the same first two blocks as the other two composites, and **nothing to buy**. That is
the point of it: Kit 3 is the one case where the reader has spent the most and has the fewest
remaining options, and the screen now says so rather than offering him something.

---

## 5. What the copy does

- Frames every marker statement as a measurement of a result, never as a statement about the person.
- Routes the acute case to emergency care above everything else, in wording already live and signed.
- Routes the red-flag case to a doctor, and offers that reader nothing to buy.
- Offers, to the remaining reader, a panel we have **not** measured, which re-measures nothing
  (**on Kit 1 and Kit 2 only** — see §4a).
- Names markers, and attaches one functional domain to the set: *"the markers behind energy and
  recovery"*. ⚠ **Correcting an earlier draft of this line, which claimed "no benefit attached to
  any of them".** That was not accurate, and it understated the claim surface to the person being
  asked to rule on it. See §6 item 2.
- Keeps the escalation, the referral and the suggestion in descending order of urgency.
- Carries the NHS source on the emergency wording, as the live version does.

## 6. Open items — five closed by the ruling, three carried to the build

✅ **ANSWERED 2026-09-16, ALL FIVE: `1: A 2: B 3: A 4: A 5: A`.** Sent 2026-09-15 23:42 UTC,
answered 00:04 UTC, **22 minutes**. Thread `1a0a77178beb2d2f`, reply `1a0a78774f57f01f`.
**Five letters against five questions. The expected count of 5 was written down before sending, and
the ROWS were counted as well as the answers** — the CA-047 lesson, where a reply matched its
expected answer count while the shortfall sat in rows.

**Items 1 to 5 below are struck through with her answer.** ⚠ **Items 6 to 8 were deliberately NOT in
the email**, because mixing a build task into a clinical packet spends the scarcest attention in the
business on retrieval instead of judgement. **They are still owed, and so is Keith's business
sign-off.**

1. ~~**Ewa — the transfer.**~~ ✅ **Q1 = A: it carries over EXACTLY as it appears on the articles.** ⚠ That includes the **live NHS hyperlink**, which this draft rendered as plain text, so item 6's first half is decided rather than open. Original question retained: Ask the concrete form, not the general one. The 2026-08-18 record's own
   lesson is that *"a C answer is usually a badly-framed question rather than an undecided
   reviewer"*: the general question came back C, the concrete one came back A in two minutes. So ask
   *"On the Kit 1 in-range-but-still-unwell screen, is this exact three-block stack, in this order,
   the right thing to show?"* One named screen, one named stack.
   ✅ **SAFE DEFAULT, written down rather than left implied: if this screen ships while the ruling is
   pending, it ships WITH the 999 block.** Omitting it is the hazard; including it only ever widens
   escalation. Without this line, a cautious-looking flag builds a live path back to the exact
   2026-09-15 defect, a screen routing all chest pain to a GP.
2. ~~**Ewa — the vitamin D framing.**~~ ✅ **Q5 = A: it stands as she wrote it.** These are blood markers to measure, not an ingredient claim, so the EFSA ingredient table is not engaged. Original question retained: *"The markers behind energy and recovery ... Vitamin D"*. The
   EFSA table permits vitamin D3 → normal muscle function; energy runs through Active B12, and V7.2
   made that re-routing deliberate. Mitigating: these are named as blood markers to measure, not as
   ingredients being sold, and the table is scoped to ingredients. Aggravating: **vitamin D3 and
   Active B12 are both Daily Stack ingredients**, so a man who reads this and is then sold the stack
   has received an implied ingredient claim by the shortest possible route. Her wording, verbatim,
   so it is hers to rule on and not ours to reword.
3. ~~**Ewa — the lead-in**~~ 🔴 **Q2 = B: the drafted lead-in stands and the "Otherwise," option was DECLINED.** See §4. Original question retained:, and specifically the missing **"Otherwise,"** disambiguator (§4).
4. ~~**Ewa — the connective**~~ ✅ **Q3 = A: reader self-triage, engine-side suppression declined. No new special-category data, DPIA untouched.** Original question retained:, presented as the trade-off in §4, not as a necessity.
5. ~~**Ewa — the missing Kit 3 closing wording**~~ ✅ **Q4 = A: accepted as drafted.** See §4a. Original question retained: (§4a). Against a routing Keith already decided.
6. 🔴 **STILL OWED. Keith / build — the alert container and the live NHS link** (§3). ⚠ **The link half is settled by Q1 = A; the container was NOT put to her.** Original note, with a clinical read on
   whether the container carries across to a results surface.
7. 🔴 **STILL OWED. Build — sweep every surface this lands on for a second, machine-read copy.** The
   `cholesterol-test` FAQ at `:56-66` is live proof this is a real trap, not a theoretical one, and
   it is also where the **"Otherwise,"** precedent lives.
8. 🔴 **STILL OWED. Build — the render obligation is not discharged.** Nothing here has been rendered. Contrast,
   truncation and whether the 999 block clears the fold on a phone are all failures that leave the
   string correct in the DOM, so no text-level check can see them.

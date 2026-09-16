# Approval Record — Retest wording, the early-claim rule, and the escalation container (v1)

| Field | Value |
|---|---|
| Register ID | CA-049 |
| Artefact path | Three separate things that shared one packet: the retest sentence owed to the **flagged ten** result states (`retest-mechanism-map.md` §6 owed item 9 / defect 3f); **which results let a member pull his retest date forward** (owed item 7 / defect 3d); and whether the 999 escalation keeps its **alert container** on a results screen (CA-048 build condition 2) |
| Version | v1 (asked 2026-09-16) |
| Content type | Two clinical rulings that become on-screen copy and a scheduling rule, plus one presentation ruling on a safety escalation |
| Submitted by | Keith Antony |
| Submitted date | 2026-09-16 |
| Required signers | Ewa (clinical) + Keith (business) |
| Decision | ✅ **Ewa IN, 2026-09-16.** 🔴 **Keith's business sign-off owed.** ⚠ **Q3 = B contradicted two live cards and they were corrected the same day** (§3) |

## 1. Pre-flight evidence (mandatory)

**This packet asked for rulings; it shipped no copy.** The deterministic scanner is not the
applicable gate for two of the three items, the same disposition as CA-043 and CA-047's logic half.
The evidence that matters here is what was verified **before** asking:

| Control | How it was verified | Result |
|---|---|---|
| The two live cards quoted in Q1 and Q2 are the real ones | Every field (`stateLabel`, `explanation`, `recommendation`) diffed against `lib/results/biomarker-copy.ts` | ✅ **6 of 6 verbatim** |
| Those cards are genuinely live | `NOT APPROVED` markers confirmed present **on `main`**, the branch Coolify builds, not in the working tree | ✅ Live, 40 days |
| The flagged ten are the right ten | Derived from `badgeFor()` (3 `Action Needed` + 7 `Monitor`), never from a hand-written list | ✅ 10 |
| Format | `signoff-email/validate.js` | ✅ exit 0 |
| Answer count | Recorded before sending; rows counted as well as answers | ✅ 5 of 5 |

⚠ **Q1 and Q2 belong to CA-044, not here.** They closed **CA-044 §2 item A** as an amendment, with
**no copy change**: both cards approved exactly as written. They are recorded on that register row
and in ClickUp `869eqnga8`. **No new CA number was stamped for them.**

## 2. Items flagged for human decision

Sent 2026-09-16, answered 02:03 UTC. Gmail thread `1a0a7e88d3e90ab6`, reply `1a0a7f4d1ae8e132`.
The preamble stated that answering all five **is** the sign-off.

**`1: A  2: A  3: B  4: B  5: A`**

| Q | Item | Answer | Meaning and effect |
|---|---|---|---|
| 3 | What the **flagged ten** cards say about testing again | 🔴 **B** | *"Your GP decides when to repeat this, not us"*, **the same answer she gave for the GP-routed ten**. She declined "one sentence covering all ten" and declined "nothing at all". ⚠ **The 3-month interval she signed on 2026-09-15 survives as a scheduling value but may NOT be stated on the card as our recommendation** |
| 4 | Which results let a member **pull his retest forward** | **B** | Any result with a flagged marker, brought forward to **3 months**. This was the blast-radius option: it dispatches a physical kit sooner |
| 5 | The **alert container** on the 999 block | **A** | Presented the same way as on the article. It must not read as ordinary text on a results screen. **Closes CA-048 build condition 2** |

### The one that looks like a contradiction and is not

Q3 says the card tells him his GP decides the timing. Q4 says a flagged result lets him bring his
retest forward to three months. **These sit on different surfaces**: the result card versus the
member's entitlement. They are compatible, and the build must keep them apart. 🔴 **The three months
must never surface on the card as our recommendation**, which is exactly what Q3 forbids.

## 3. 🔴 Q3 = B PUT TWO LIVE CARDS IN BREACH, AND THEY WERE CORRECTED THE SAME DAY

`shbg-low` and `shbg-high` are two of the flagged ten. On production they rendered:

> **"Retest in 6–12 months"** → `/kits`

**Verified on `main` before acting**: `classifier.ts:428-430`, label at `:65`. Two of her own rulings
contradicted it at once: the **interval** was wrong (she moved both to 3 months on 2026-09-15,
CA-047 round 2 Q3 = B and Q4 = B) and the **offer** should not have been there at all (Q3 = B here).

⚠ **WHY IT SURVIVED BOTH, AND THE SHAPE IS THE LESSON.** One branch covered three states:

```ts
if (state === 'shbg-low' || state === 'shbg-normal' || state === 'shbg-high') {
  return { ...base, primaryCta: CTAS.retestReminder }
}
```

**It is correct for `shbg-normal`**, which genuinely is a 6-to-12-month `maintenance` state. **A line
that is right for one of its three branches reads as right.** And `shbg-low` and `shbg-high` are
**in-range** states sitting under the sign-off table's all-clear bucket heading, so no amount of
re-reading bucket B would have found them.

🔴 **NEITHER RULING COULD HAVE CORRECTED IT.** `RETEST_CADENCE` holds the correct 3-month rule for
both states and **is inert**, so the map could not contradict the card. Two layers held the same
fact and only one was ever swept.

✅ **Corrected 2026-09-16.** The branch is split: `shbg-normal` keeps the offer, `shbg-low` and
`shbg-high` return `primaryCta: null`, the same shape `ft-low` and `suboptimal-ferritin` already use
and both of those are in the same flagged cohort. Guarded in
`scripts/test-classifier-regressions.ts` **from both directions**, because stripping
`shbg-normal`'s offer too would assert a rule stricter than the one approved. ⚠ **The guard was
watched failing**: restoring the old three-state branch fails it with both states named, and the
file was restored and hash-compared.

⚠ **The interval is NOT replaced on those cards, and that is deliberate.** The sentence the flagged
ten are owed is new customer-facing copy for ten states and owes its own pre-flight. Removing a
wrong offer and adding a new sentence are two changes; only the first has been made. Until the
second lands those cards say nothing about re-measuring, which is the 3f gap, and 3f is tracked.

## 4. Sign-off

| Signer | Role | Decision | Date |
|---|---|---|---|
| Dr Ewa Lindo | Clinical | ✅ **Agreed, 5 of 5.** `1: A 2: A 3: B 4: B 5: A`, direct written reply 02:03 UTC | 2026-09-16 |
| Keith Antony | Business | 🔴 **Owed** | — |

## 5. What this leaves owed

1. 🔴 **Keith — business sign-off on this record.**
2. **The flagged-ten sentence.** Her ruling gives the substance; the wording for ten cards is new
   copy and owes a pre-flight before it ships.
3. **The early-claim rule (Q4 = B) is unbuilt.** It touches dispatch, so it needs the clamp that
   already exists for the membership clock reset, and its own verification.
4. ~~**The alert container (Q5 = A) is unbuilt**, along with the rest of the CA-048 screen.~~
   ✅ **BUILT 2026-09-16.** The overlay renders inside `SystemAlert`, which is literally the
   component the article uses, so her answer is implemented rather than approximated. **All four
   CA-048 conditions are now discharged.** 🔴 **The screen still reaches nobody: the trigger it
   reads is written by nothing in the product.**
5. ⚠ **The `NOT APPROVED` markers in `biomarker-copy.ts:81` and `:170` should come out**, since Q1
   and Q2 approved both cards. A comment change, not a copy change.

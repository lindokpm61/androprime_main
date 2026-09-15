# Approval Record — Homepage direction F imagery: nine items (v1)

| Field | Value |
|---|---|
| Register ID | CA-045 |
| Artefact path | `09_website-app/frontend/public/home/img-1..7.jpg` + the hero film and poster (`09_website-app/design/mockups/directions/assets/f/`) + the hero range-geometry field. All on branch `redesign/direction-f`, which deploys nothing |
| Version | v1 (film replaced 2026-08-27, commit `63f13e2`; img-6/img-7 commissioned 2026-09-01) |
| Content type | Generated imagery, no copy in frame (customer-facing once the branch is promoted) |
| Submitted by | Keith Antony |
| Submitted date | 2026-09-15 (packet drafted 2026-09-02, sent 2026-09-15 19:46 UTC) |
| Required signers | Ewa (clinical) + Keith (business) |

## 1. Pre-flight evidence (mandatory)

- **Deterministic scanner: N/A, and this is a recorded precedent, not an omission.**
  `.claude/skills/compliance-preflight/scan.js` reads copy. Every artefact in this record is an
  image with no words rendered into it, so there is no input for the scanner to read. Same
  disposition as CA-039.
- **The applicable evidence is the judgement pass**, and for imagery that means the clinical
  reviewer looking at the image itself. **All ten image files were attached to the sign-off email**
  rather than described, precisely because the prior evidence line on this gate had been
  established on a description rather than on the images.
- **Run date:** 2026-09-15.
- **Result:** 🔴 HARD 0 / 🟠 REVIEW 0 available from the scanner (not applicable). Judgement pass
  completed by Ewa on the attached files.

### ⚠ A correction carried INTO the packet, deliberately

The register's prior evidence line on this gate read *"no people, hands, clinic, blood or sample"*.
**That was established on the hero film frame, not on the photographs**, and `img-3` contains
people, hands **and** a sample collection tube. The packet said so in its own Q2 preamble rather
than letting the reviewer inherit the error. Two further descriptions in the register came from
`alt` attributes and were wrong (`img-5`'s alt says "putting on a trainer"; the photograph shows a
man hunched forward, motionless, and it was asked as its own question for that reason). **Every
description sent for judgement was written from the image, not from the alt text or the register.**

## 2. Items flagged for human decision

Nine items, asked as seven lettered questions. Answering 1 to 7 was stated in the packet to be the
whole sign-off, with no separate approval question.

| Q | Item | Question put | Ewa's answer | Meaning |
|---|---|---|---|---|
| 1 | Hero film (`q1-hero-film-frame.jpg`) | Does the sheet on the table read as a lab result? | **A** | *"No, it reads as handwriting. Clear as it is."* |
| 2 | `img-3`, Kit 3 card, caption "Five minutes, at home" | Is a plain collection tube in a kitchen acceptable on this card? | **A** | *"Yes, clear as it is."* **This image had never actually been cleared before** |
| 3 | `img-1`, `img-2`, `img-4`, `img-6` | Do these four read as ordinary life rather than as illness? | **A** | *"Yes, all four are clear."* She did not invoke option B (clear except the ones I name) |
| 4 | `img-5`, changing room, caption "A demo account" | Does this man read as unwell rather than as tired? | **A** | *"No. Clear as it is."* Not B (clear, but not under this caption) |
| 5 | `img-7`, Kit 2 card, caption "Not bouncing back" | Does this photograph, on this kit, imply a cause for how he feels? | **A** | *"No. Clear as it is."* Not B (clear only if the caption changes) |
| 6 | Hero range-geometry field (`q6-hero-as-it-ships.png` + `q6-hero-field-revealed.png`) | Is this a data display? | **A** | *"No, it is texture. Clear as it is."* |
| 7 | hs-CRP and SHBG rows drawn in the field but shown nowhere on the page | Should the two unshown markers come out? | **A** | *"No, leave all six."* |

## 3. Conditions of approval

**Ewa attached no conditions.** She answered A to all seven, which was the unconditional option in
every case. Three things follow that are worth stating explicitly, because a clean sheet is easy to
over-read:

1. **Q6 = A, not B, so the opacity is NOT pinned.** Option B was *"clear, but the opacity must
   never be raised without asking you again."* She did not take it. **There is therefore no
   standing instruction to re-ask her if the hero field's opacity is raised**, and the packet's own
   argument for why the field is texture rather than data rested on it being faint. Treat a
   material opacity increase as a new question anyway; nothing in this record obliges it.
2. **Q7 = A leaves hs-CRP and SHBG in the pattern.** The build check asserting that the four shared
   markers match the page's sample result **cannot by its nature cover these two**, because they
   appear nowhere else on the page. That asymmetry is now approved, not closed.
3. ✅ **THE `img-7` TRAINER LOGO IS RULED: KEITH, 2026-09-15, "img-7 is fine."** It was a
   **trademark question, not a clinical one**, flagged in the packet as his and explicitly outside
   Ewa's answer. **Decision: leave the asset as generated, no inpaint, no replacement.**

   What he ruled on, so the scope of the ruling is not over-read later: both trainers carry a dark
   angular chevron on the outer side panel, in the position real running brands use. It is
   generated (gpt_image_2 via Higgsfield, 2026-09-01) and reads as the *category* rather than any
   one brand. It was reviewed at 4x crop and in both shipped renders. Mitigations on record: every
   surface applies `filter: grayscale(1)`, and at real card width the mark is roughly 20px across.
   **No trademark register search was performed**, and the ruling is Keith's business judgement,
   not a clearance opinion.

## 4. Signature block — humans only

| Role | Name | Decision | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims (Ewa) | Dr Ewa Lindo | **APPROVED** | none attached; `1: A 2: A 3: A 4: A 5: A 6: A 7: A` | 2026-09-15 |
| Business (Keith) | Keith Antony | **APPROVED** | direct instruction, "CA-45 approved"; separately ruled the `img-7` trainer question closed the same day | 2026-09-15 |
| Contractual (Solicitor) | n/a | not required | no contractual/money clause | — |

**Evidence for Ewa's signature.** Direct written reply from `ewalindo@live.co.uk`, 2026-09-15
20:07 UTC. Gmail thread `1a062879e02a792c`; sent message `1a0a69bb572668cf`, reply
`1a0a6aec215686b1`. Seven letters returned against seven questions asked; expected answer count
met exactly, so nothing is inferred from an adjacent answer.

## 5. Outcome

- Final decision: ✅ **APPROVED, 2026-09-15.** Both required signers in: Ewa (clinical, direct
  written reply, no conditions) and Keith (business, direct instruction "CA-45 approved").
- ✅ **The `img-7` trainer trademark question is CLOSED**, ruled by Keith the same day ("img-7 is
  fine", asset unchanged). See condition 3. **It was ruled separately and the business sign-off was
  not inferred from it**, which is why both are recorded with their own evidence.
- 🟢 **This clears one of the three Direction F merge blockers.** Remaining: CA-046 (the public
  `/demo`) and the 48-row copy-register reconciliation.
- ⚠ **Approved is copy-approved, and two conditions in §3 survive it**: the hero field's opacity is
  **not** pinned (Ewa took Q6 = A, not the option that would have required re-asking her), and
  hs-CRP and SHBG stay in the hero pattern where the build check cannot cover them. Neither is
  closed by this approval; both are recorded so nobody reads a clean sheet as a clean slate.
- ClickUp `869eur84c` set to `approved` and renamed with the APPROVED prefix, 2026-09-15, on
  Keith's explicit instruction. Register updated the same day.

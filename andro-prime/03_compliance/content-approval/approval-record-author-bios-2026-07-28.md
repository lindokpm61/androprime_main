# Approval Record — Author Bios, Keith Antony entry (v1, live since 2026-05-27)

| Field | Value |
|---|---|
| Register ID | CA-029 |
| Artefact path | `02_brand/author-bios.md` (Keith Antony entry) |
| Version | v1 (unchanged since 2026-05-27) |
| Content type | Customer-facing author bio / personal story, rendered on `/authors/keith-antony`, Article schema `author` Person block, and reused verbatim on two LinkedIn surfaces |
| Submitted by | Keith Antony |
| Submitted date | 2026-07-28 |
| Required signers | Ewa (clinical/claims) + Keith (business) |

## 1. Pre-flight evidence (mandatory)

- **Command:** `node .claude/skills/compliance-preflight/scan.js andro-prime/02_brand/author-bios.md`
- **Run date:** 2026-07-28
- **Result:** `🔴 HARD: 1   🟠 REVIEW: 9`
- **Judgement pass:** done. Checked EFSA wording, Phase-0 boundary, silent-ingredient (name absent, confirmed), FM-CTA gate, retest framing.
- **Disposition of every HARD hit:**

**`author-bios.md:35` «treating»** — "My GP said it wasn't worth treating."

Not fixed, and deliberately so. This is reported speech: Keith recounting what a GP told him about his own result. It makes no claim that Andro Prime treats anything, offers nothing, and sits inside a personal history rather than product or results copy. It is customer-facing, so this is **not** the documented rulebook-quoting exception used by CA-007 and CA-009; it is a genuine live occurrence of a flagged term whose use is benign.

It was inside the artefact Ewa reviewed. Keith's email linked the live author page and quoted the surrounding passage, and she approved the bio as-is. The line is therefore covered by her sign-off rather than exempted from the rule. Recorded here rather than silently rewritten, per the standing rule that Keith's copy is surfaced, not rewritten.

The 9 REVIEW hits are all «TRT» occurrences in Ewa's own credential entry further down the file (Harley Street TRT-trained, the certificate storage row, the `hasCredential` schema row). None are in Keith's bio and none are customer-facing CTAs. Substantiation for the "Harley Street TRT-trained" claim is already recorded in `03_compliance/credentials`.

## 2. Items flagged for human decision

| `file:line` | Phrase (verbatim) | Risk / rule | Signer | Decision |
|---|---|---|---|---|
| `author-bios.md` (Keith entry) | "I was tired by 2pm every day, training four times a week and getting nowhere, losing focus in meetings I used to run... My testosterone came back borderline... Tested SHBG, Free T, the markers the standard panel skips. That's when I understood why the first test had missed it." | Moves from general fatigue/energy symptoms to testosterone. `03_compliance/CONTEXT.md` Kit 1 scoping rule: Kit 1 tests testosterone only and must not be framed as explaining general fatigue or energy, which belongs to Kit 2 and Kit 3. | Ewa | ☑ APPROVED as-is, no softening requested |
| `author-bios.md:35` | "My GP said it wasn't worth treating." | Scanner HARD on «treating». Benign use, reported speech. | Ewa | ☑ Covered by the as-is approval |
| `author-bios.md` (Keith entry, closing) | "I got the right support. It changed everything." | Reads as a treatment outcome on a business not offering treatment in Phase 0. Already removed from the LinkedIn version by Keith before submission. | Ewa | ☑ Stays on the site bio (see §3) |

## 3. Conditions of approval

**Scope.** The sign-off covers three surfaces carrying the same framing, cleared together: this bio and the rendered `/authors/keith-antony` page; the About section of Keith's LinkedIn profile (`linkedin.com/in/keithantony`); and the LinkedIn post `instrumentation-problem`, post id `7487903563306733568`.

**The two surfaces diverge, and that divergence is approved.** The closing line "I got the right support. It changed everything." remains on the site bio and is absent from the LinkedIn version. Ewa's reply approved the current state of each surface rather than answering the question Keith asked about that line specifically. **Keith's decision, 2026-07-28: accept that reading, do not reconcile the two.** Recorded so a later consistency pass does not read the mismatch as drift and align them.

**Limits of the approval, stated plainly.** The reply came three minutes after the submission and did not engage the Kit 1 scoping conflict by name, though that conflict was set out explicitly in the email with the rule quoted. The approval is valid, given by the GMC-registered medical lead with the passage and the rule in front of her. If the framing is challenged externally, this record is the substantiation trail and its limits are visible here rather than dressed up.

**No countersignature owed.** Direct written sign-off received from Ewa's own address, same pattern as CA-011 and CA-009/CA-010. This is not a Keith-representation transcription.

**Not re-opened by:** any future edit to the bio. A change to the personal-story portion needs a fresh submission, because the three surfaces inherit from this file.

## 4. Signature block — humans only

| Role | Name | Decision | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims (Ewa) | Dr Ewa Lindo | APPROVED | As-is, no amendment. Verbatim: "All is fine to go ahead as is ...approval granted" | 2026-07-28 |
| Business (Keith) | Keith Antony | APPROVED | Original bio approval 2026-05-27; scope decision on the LinkedIn divergence 2026-07-28 | 2026-05-27 / 2026-07-28 |
| Contractual (Solicitor) | n/a | n/a | Not a contractual artefact | n/a |

Ewa's row is transcribed from her direct written reply sent from `ewalindo@live.co.uk` at 2026-07-28 20:48 UTC, in reply to Keith's submission at 20:45 UTC. Thread filed at `03_compliance/correspondence/2026-07-28-keith-ewa-author-bio-signoff.md`.

## 5. Outcome

- Final decision: **APPROVED**
- Register updated: 2026-07-28
- Notes: closes the longest-standing open compliance item in the repo, open since 2026-05-27 while live on the site. Downstream effects applied the same day: `06_marketing/content-machine/assets/2026-07-28-instrumentation-problem.md` moved `preflight` amber-ewa to green and `status` scripted to done, clearing the red content board; `06_marketing/content-machine/STATE.md` carries the dated entry.

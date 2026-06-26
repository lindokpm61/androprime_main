# Approval Record — Feeling-First Subject/Preview Rewrites

**Date:** 2026-06-26
**Approver (business):** Keith
**Clinical sign-off:** Not required — no EFSA ingredient claims, no clinical-boundary content, no results-report wording changed. Two amber tone-flags accepted by Keith (below).
**Pre-flight:** Deterministic scan 0 HARD / 0 REVIEW; judgement pass 0 HARD, 2 amber (accepted).
**Reason for change:** Feeling-first content doctrine (`06_marketing/master-plan/2026-06-26-feeling-first-content-strategy.md`). Acquisition/nurture subjects must lead with the body-feel, not a test/biomarker. Bodies UNCHANGED; only subject + preview lines amended.

---

## Items amended

### 1. Newsletter issue-001 (CRP) — `06_marketing/content/email/newsletter/issue-001-crp-blood-test.md`
- **Subject:** ~~A "bit raised, nothing to worry about" is not an answer.~~ → **Worn down for months. The bloods came back "normal".**
- **Preview:** ~~What a CRP number actually tells you, and the one thing it can't.~~ → **What a raised CRP actually tells you, and the one thing it can't.**
- Underlying body + CA-012 approval (2026-05-31, Keith + Ewa) unchanged.

### 2. seq-01 waitlist, Email 3 — `09_website-app/frontend/email-templates/sequences/seq-01-waitlist.md`
- **Subject:** ~~What 4 blood markers can tell you that your GP isn't checking.~~ → **The fatigue, the slow recovery, the flatness: four things worth checking.**
- **Preview:** ~~The markers most likely to explain why active men in their 40s feel off.~~ → **Why active men in their 40s feel off, and the markers most likely to explain it.**

### 3. seq-06 quiz-nurture, Email 3 — `09_website-app/frontend/email-templates/sequences/seq-06-quiz-nurture.md`
- **Subject:** ~~What most men actually discover with this test.~~ → **The most common reaction to results isn't surprise. It's relief.**
- **Preview:** ~~Not always what they expected.~~ → **Why knowing the number is easier than wondering.**

---

## Amber flags accepted by Keith (not escalated to Ewa)

1. **#1 GP/NHS framing** — the skeptical quotes around "normal" lean on GP-dismissal. Body handles the nuance correctly (test-design distinction per tone-of-voice §7). Accepted as-is; safer fallback on file if ASA ever queries: "Worn down for months, and the bloods looked fine."
2. **#2 efficacy-adjacent preview** — "the markers most likely to explain it" is a hedged claim about the *test's* explanatory power, not supplement efficacy or treatment. Within the "we test and explain the number" lane. Accepted as-is.

## Checks cleared
- No banned terms (diagnose/treat/cure/fix/"you have"). No TRT/clinical-availability claim. No Ashwagandha. No FM trigger. No em dashes.
- EFSA: no ingredient benefit claims in any line.
- Kit scoping: #2 correctly frames Kit 2 energy panel, not Kit 1 testosterone.
- Phase-0 boundary: clean.

## Ops note
These are copy-file amendments. Each send remains a separate human go/no-go per the existing build notes.

**Customer.io sync (2026-06-26, workspace 219186):**
- **seq-01** Email 3 (action 6, template 4) — subject + preview (`preheader_text`) updated in CIO. Campaign state: `draft` (not running).
- **seq-06** Email 3 (action 67, template 33) — subject + preview updated in CIO. Campaign state: `draft` (not running).
- **Newsletter issue-001** (newsletter id 2, content template 52) — subject + preview updated in CIO. Body (11.7KB, CA-012 approved) was already built; state `draft`.
- **Previews now wired** on all three templates (4, 33, 52) — `preheader_text` was previously null; closed in this pass.
- All sends remain a separate human go/no-go.

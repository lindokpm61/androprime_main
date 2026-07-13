# Content Approval — How This Directory Works

This is the **approval log** required by `03_compliance/CONTEXT.md` ("Log approved
copy in `content-approval/` with the reviewer name and date"). It is the audit
trail that proves a given piece of external-facing content was signed off by a
named human before it shipped.

## Hard rules

1. **CONTEXT.md is the law.** This directory records *decisions*; it does not
   define the rules. The red-flag table, EFSA claims, and Phase-0 boundary live
   in `03_compliance/CONTEXT.md`. If they disagree, CONTEXT.md wins.
2. **Only a named human approves.** Claude / automation never writes "APPROVED"
   in the register or a record. The pre-flight scanner and judgement pass are a
   *gate*, not an approval — a clean pre-flight still requires sign-off.
3. **No sign-off, no ship.** Nothing external-facing (email, LP, ad, social,
   affiliate/influencer brief, results-report wording) goes live, and no CIO
   campaign reaches `state: running`, until its register row reads APPROVED with
   a reviewer name + date.
4. **Pre-flight is mandatory and recorded.** Every submission runs
   `.claude/skills/compliance-preflight/scan.js` + the judgement pass first; the
   result (date, HARD/REVIEW counts, disposition) is attached to its record.

## Who signs what

| Decision area | Signer |
|---|---|
| Clinical / health claims / EFSA wording / silent-ingredient approach | Dr Ewa Lindo |
| Business framing / pricing / incentives / FM (non-cash) framing | Keith Antony |
| Contractual / money clauses (recoup, dispute, attestation legal wording) | Solicitor |

A submission may require more than one signer; it is APPROVED only when **all
required signers** have signed.

## Article & webpage sign-off lives in ClickUp, not here

Blog articles and webpages are **not** approved in this register. Ewa reviews and
signs off each one as a task in the ClickUp **"Content Review" list** (Phase 0
Launch folder; list `901218140081`, workspace `90121729875`). Each task carries
the rendered preview link plus a sign-off checklist; **marking the task complete
= approved**, and change requests are left as task comments. That ClickUp list is
the article-approval register.

This repo register (`content-approval-register.md`) covers the **other**
external-facing content types: partner/affiliate briefs, email sequences and
newsletters, results-engine wording, and consent UI. A blog article appears here
only by exception (e.g. CA-016 `why-am-i-always-tired`, logged in both). So **a
live article with no row here is normal, not a compliance gap**: check the
ClickUp list for its sign-off before concluding anything is missing. (Added
2026-07-13 after that exact false alarm.)

## Files in this directory

- **`content-approval-register.md`** — the master ledger. One row per content
  artefact submitted for approval. Status starts PENDING and only a named human
  changes it.
- **`approval-record-template.md`** — copy this for each submission to
  `approval-record-<artefact>-<YYYY-MM-DD>.md`. Holds the pre-flight evidence,
  the flagged items, and the signature block.
- **`incident-<YYYY-MM-DD>.md`** — kill-switch / regulator-query incident logs
  (see `pt-programme.md` §8.4 and CONTEXT.md). Different lifecycle from
  approvals; same directory by convention. Not scaffolded yet — create per
  incident from the kill-switch protocol.

## Flow

```text
draft copy ─▶ compliance pre-flight (scan.js + judgement) ─▶ approval-record-*.md created
          ─▶ register row added (PENDING) ─▶ required humans sign ─▶ register row APPROVED
          ─▶ copy may ship / campaign may go live
```

*Created 2026-05-18. Owner: Keith Antony. Law: `03_compliance/CONTEXT.md`.*

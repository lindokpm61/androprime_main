# Content Approval — How This Directory Works

This is the **approval log** required by `03_compliance/CONTEXT.md` ("Log approved
copy in `content-approval/` with the reviewer name and date"). It is the audit
trail that proves a given piece of external-facing content was signed off by a
named human before it shipped.

## Check ClickUp FIRST: this directory is the copy, not the original

**ClickUp is the central hub for approvals (decided 2026-07-31). The files here
are a mirror of it.** Any question of the form "has this been signed off", "is
this approved", "what is the status of CA-NNN", or "does this still need Ewa" is
answered by reading ClickUp, and only then by reading the repo for the detail.

| What you are asking about | Read this FIRST | Repo mirror |
|---|---|---|
| A numbered approval (CA-NNN): any external copy, brief, sequence, consent UI, results wording | ClickUp list **`901219880207`** (Approvals & Sign-offs, in the Compliance & Approvals folder `901212628113`). One task per CA number, task status carries APPROVED / PENDING. | `content-approval-register.md` + the `approval-record-*.md` for the evidence |
| A blog article or webpage | ClickUp list **`901218140081`** (the blog-article Content Review list, Phase 0 Launch folder). **Completing the task IS the approval**; change requests are comments. | usually nothing; a blog row here is the exception |
| An internal RULE or PROCEDURE that needs Keith alone (no clinical content, not customer copy) | ClickUp list **`901220442060`** (Rules & Procedures, in the *Keith-Only Sign-offs* folder `901213093318`). **Moving the task to `approved` IS the approval**, same model as the blog Content Review list. Added 2026-08-17. | same as a CA: a row in `content-approval-register.md` + an `approval-record-*.md` |

**On the Keith-only list the COLUMN is the signature, and the task name carries the
artefact only.** `approved` is a closed-type status, so ClickUp stamps who moved it
and when, and that timestamp is the approval date the register mirrors — nothing has
to be hand-recorded, and the audit trail is the status history rather than a
sentence someone remembered to type. **Only Keith moves a task to `approved`**; a
drag is still writing APPROVED, so hard rule 2 below covers it.

⚠️ **Do not repeat the state in the task name.** The older board prefixes names with
PENDING/APPROVED *and* carries a status, which is one fact in two places, and it has
already drifted: **CA-037 reads APPROVED in its name while its status is `pending`**.
That is the same shape as the stale `{/* TODO Ewa */}` markers described above, on
the hub this file calls the source of truth. New rows on either board should carry
the artefact only.

**The CA numbering is one sequence across both approval boards.** The board decides
*where it gets signed*, never *what it is called*: CA-039 sits on the Keith-only
list and CA-040 on Approvals & Sign-offs, and both mirror into the same register.
Two sequences would make "what is the next number" answerable two ways.

**Entry test for the Keith-only list — all four, or it goes to `901219880207`:**
(1) no health, biomarker, symptom, outcome, dosage or ingredient claim anywhere in
the artefact; (2) not customer-facing copy, though a rule *about* copy qualifies;
(3) Ewa is not asserted to have ruled anything in it, and **one sentence claiming
her judgement is enough to disqualify it**; (4) it is a rule, procedure, threshold
or config decision rather than a piece of content. Unsure means route up. The cost
of a wrong routing is an unsigned clinical assertion.

**Why it exists (2026-08-17):** the public-media-bucket rule was written on
2026-08-14, shipped as code the same day with three enforcing controls, and then
had **nowhere to be signed**. It sat unapproved for three days, flagged only by a
paragraph in `03_compliance/STATE.md`, which is a reminder and not an approval
surface. This register is built for external-facing copy, so a Keith-only internal
rule had no row and no board. **A control that ships before its rule is approved is
the right order for the control and the wrong order for the rule.**

Workspace `90121729875` on every call.

**Never report an outstanding human sign-off without reading ClickUp.** The repo
lags: a status can change in ClickUp minutes after a reviewer acts and nothing
in git moves. Worse, an artefact can carry its own stale marker (a `TODO`, a
"pending Ewa" note, a checklist box) that reads as authoritative and is not. On
2026-07-31 two published articles were escalated as having outstanding
pull-quote sign-offs on the strength of `{/* TODO Ewa */}` comments still in
their bodies; both had been approved in ClickUp weeks earlier, one of them after
the reviewer was explicitly asked about that exact quote, twice. The markers had
simply never been deleted. Read the hub, not the artefact.

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
signs off each one as a task in the ClickUp blog-article **Content Review** list
(Phase 0 Launch folder; list `901218140081`, workspace `90121729875`). Each task
carries the rendered preview link plus a sign-off checklist; **marking the task
complete = approved**, and change requests are left as task comments. That
ClickUp list is the article-approval register.

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

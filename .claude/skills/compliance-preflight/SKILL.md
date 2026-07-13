---
name: compliance-preflight
description: >
  Run the Andro Prime compliance pre-flight on any external-facing copy before
  it ships — email, landing page, ad, social post, affiliate/influencer brief,
  results-report wording, or an internal doc that could go external. Use when
  the task is "compliance check this", "is this copy compliant", "pre-flight
  before publish", or before activating/sending anything customer-facing. This
  is Guardrail #1 from the root CLAUDE.md. Produces a findings report; it does
  NOT rewrite Keith's copy and never approves copy on Ewa's behalf.
---

# Compliance Pre-Flight

Codifies the mandatory pre-publish check in `andro-prime/03_compliance/CONTEXT.md`
into a repeatable pass. The deterministic floor is a bundled scanner; the
judgement ceiling (EFSA claim wording, Phase-0 boundary, efficacy-adjacent
phrasing) is yours, done with CONTEXT.md loaded.

## Hard invariants (violating any of these is a defect)

1. **CONTEXT.md is the source of truth, not this skill.** Always read
   `andro-prime/03_compliance/CONTEXT.md` (and root `andro-prime/CLAUDE.md`
   guardrails) at the start of every run. The red-flag table, EFSA approved
   claims, and special cases can change — the skill is the *process*, that file
   is the *law*. If they disagree, CONTEXT.md wins and the skill is stale.
2. **Flag, never silently rewrite.** Efficacy-adjacent or claim-adjacent
   phrasing on Keith's copy is surfaced for Ewa, not edited. Only HARD literal
   banned terms get a proposed replacement, and even then you propose — you do
   not commit the change unless asked.
3. **Compliance overrides persuasion.** Decision Priority #1. A conversion or
   tone argument never beats a HARD finding.
4. **Ashwagandha is business-ending.** Any mention, any context, any channel,
   is a HARD fail. The ASA complaint lands on Andro Prime. No exceptions.
5. **You do not approve.** This skill produces findings and a recommendation.
   Sign-off on flagged items is Ewa's (clinical/claims) or Keith's (business).
   Never mark copy "approved" yourself.

## Workflow

### 1. Load the law (read-only)
- Read `andro-prime/03_compliance/CONTEXT.md` in full — red-flag table, EFSA
  approved-claims table, Phase-0 / post-CQC boundary, special cases.
- Skim root `andro-prime/CLAUDE.md` guardrails (ashwagandha, wellness/clinical
  split, FM non-cash, retest framing).
- Identify the content type (supplement claim · kit claim · FM CTA · results
  copy · TRT reference) — it determines which tables apply.

### 2. Run the deterministic scanner
```bash
node .claude/skills/compliance-preflight/scan.js <file> [<file> ...]
```
It reports `🔴 HARD` (literal banned terms — must fix; exits 2) and
`🟠 REVIEW` (heuristics needing a decision; does not fail the gate). A clean
scan does **not** mean compliant — it means the mechanical floor passed.

### 3. Judgement pass (the part the scanner can't do)
With CONTEXT.md loaded, read the copy and check:
- **EFSA wording.** Every ingredient benefit must be the *exact* approved
  claim for that ingredient. No rephrasing, extension, or implication. Zinc →
  testosterone maintenance only; D3 → muscle function; Active B12 → energy-
  yielding metabolism / psychological function; Vitamin C → collagen for
  cartilage. Magnesium claim is retired (V7.2). Unlisted ingredient + any
  benefit = fail.
- **Phase-0 / post-CQC boundary.** Nothing may imply clinical services, TRT
  prescribing, or confirmatory testing are live. "Be first when we launch" is
  fine; "TRT is available" is not.
- **FM CTA gate.** Founding-member language is valid only on a confirmed
  T < 12 nmol/L (Kit 1/3) result — never inferred from Kit 2 energy markers,
  never with payment/"securing"/deposit framing (deposit shelved 2026-05-08).
- **Kit scoping & results wording.** Kit 1 = testosterone only (not general
  fatigue). Results copy: "Your results indicate…", never "You have…". Retest:
  "find out how your levels have changed", never "fixed/cured".
- **Efficacy-adjacent voice.** Lines that ride close to a health claim without
  naming a banned term (e.g. "the subjective experience usually follows the
  blood marker") → FLAG FOR EWA, verbatim, not rewritten.

### 4. Report — three buckets, nothing else
- **🔴 HARD FAIL** — `file:line`, the term, why, the permitted alternative
  from CONTEXT.md. Must be resolved before publish/activation.
- **🟠 FLAG FOR EWA** — `file:line`, the phrase verbatim, why it's risky, which
  table/rule. Keith's copy stays as written; Ewa decides. (Clinical/claims →
  Ewa; FM/business framing → Keith.)
- **🟢 PASS** — what was checked and cleared, so the report is auditable.

State explicitly: "Not approved — N items pending Ewa/Keith sign-off" or
"Deterministic + judgement pass clean; sign-off still required per CONTEXT.md."

### 5. Log (only when asked, or when copy is being shipped)
Per CONTEXT.md, approved copy is logged in
`andro-prime/03_compliance/content-approval/` with reviewer name + date. This
skill never writes that entry itself — it hands the report to whoever signs.

### 6. Stamp the asset file (only when the target is a content-machine asset)
If the copy you checked *is* a content-machine asset file (in
`andro-prime/06_marketing/content-machine/assets/`) or is the body of one,
record the verdict in that file's frontmatter so the gate scanner can read it:
- `preflight: green` — deterministic + judgement pass clean, nothing pending.
- `preflight: amber-ewa` — one or more 🟠 items are with Ewa/Keith; also set
  `ewa_task:` to the ClickUp task URL once that review task exists.
- `preflight: red` — an unresolved 🔴 HARD fail.
Always set `preflight_date: YYYY-MM-DD` (today) alongside it. This stamps the
*pre-flight result* only; it is not an approval and does not move `status` —
that gate is `/content-status`'s, and sign-off is still Ewa's or Keith's per
invariant 5. If the target is not an asset file, skip this step.

## When to fire this
Before: sending/activating any CIO campaign, publishing a page or LP, shipping
an ad or social post, issuing an affiliate/influencer brief, finalising
results-report wording. It pairs with `cio-sequence-build` (run this on the
copy file before the campaign goes anywhere near `state: running`).

---
name: compliance-preflight
description: >
  Run the Andro Prime compliance pre-flight on any external-facing copy before
  it ships — email, landing page, ad, social post, affiliate/influencer brief,
  results-report wording, social profile copy (bio, display name, headline,
  profile link, pinned post), or an internal doc that could go external. Use when
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
  copy · TRT reference · social profile copy) — it determines which tables apply.
- **For social profile copy** (bio, display name, headline, profile link, pinned
  post), also read `06_marketing/content/social-channel-setup.md`: it owns the
  per-channel name-field convention, the medical-lead naming rule, the
  disclaimer line and the UTM rule. Profile copy is advertising and is the most
  persistent copy on the account, but it is written once and never re-checked,
  so it had no trigger until now. (Observation 79.)

### 1b. If this is a REWRITE, diff it against the approved version FIRST

When the target already has an approval record, the absolute finding count is
meaningless: a long approved article carries findings that were cleared months
ago, and reporting them as if they were new buries the handful that matter and
invites re-litigating settled copy.

So before the scanner: diff the target against the approved version, and scan
**both**. Split the report into:

- **New copy** — findings that exist in the new version and not the old. This
  is the only list the reviewer needs to read.
- **Carried over, previously cleared** — findings present in both, with the
  approval record reference.

**When nothing in the changed set flags, say so explicitly.** "Zero findings
introduced, zero removed, identical sets to the approved baseline" is the
strongest possible result and it is invisible if you only report totals.
(Observation 43. Used on 2026-07-31 for two live-article CTA fixes: absolute
count was 2 HARD / 9 REVIEW, delta was zero.)

### 2. Run the deterministic scanner
```bash
node .claude/skills/compliance-preflight/scan.js <file> [<file> ...]
```
It reports `🔴 HARD` (literal banned terms — must fix; exits 2) and
`🟠 REVIEW` (heuristics needing a decision; does not fail the gate). A clean
scan does **not** mean compliant — it means the mechanical floor passed.

**Banned-term sweeps need synonym expansion, and hits need classifying.** A
scan for the exact token misses the case that matters. (a) Build the synonym
set: exact term, brand names, Latin/scientific name, common and street names.
(b) Scan the whole tree, then re-scan the shipping surface with ignored files
included (`rg --no-ignore`, excluding only `node_modules` and build caches).
(c) Classify every hit into **LEAK** (facing copy naming it positively),
**ENFORCEMENT** (the rule or checklist that forbids it), or
**LEGITIMATE-INTERNAL** (formulation, B2B, compliance record). Only LEAK is a
finding. Reporting a count without that split makes the rule that forbids a
term indistinguishable from a breach of it. (Observation 27.)

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
- **Depicted outcomes must match the real logic.** When copy shows a specific
  outcome for a specific input (a results mockup, an example dashboard, a
  "what happens next" card, a worked example with a number), open the governing
  logic — `04_products/results-engine/` thresholds, `lib/results/classifier.ts`,
  the routing map — and confirm that input actually produces that outcome.
  Prefer routing-neutral phrasing in mockups unless the depicted value
  unambiguously triggers the stated path. A mockup is advertising, and one that
  contradicts the live product is a claim we cannot substantiate.
  (Observation 23.)
- **Availability claims.** "Coming soon", "launching shortly", "be first when we
  launch", "no kit to sell you today" are all claims about commercial state and
  they go stale silently. Check each against what is actually purchasable now
  (`10_launch-ops/STATE.md` for gate status, the live kit pages for reality) and
  scope the claim to the specific unlaunched thing, never to the brand. On
  2026-07-31 a live article still said our checks had not launched, two clicks
  from three buyable kits.

### 4. Report — three buckets, nothing else
- **🔴 HARD FAIL** — `file:line`, the term, why, the permitted alternative
  from CONTEXT.md. Must be resolved before publish/activation.
- **🟠 FLAG FOR EWA** — `file:line`, the phrase verbatim, why it's risky, which
  table/rule. Keith's copy stays as written; Ewa decides. (Clinical/claims →
  Ewa; FM/business framing → Keith.)
- **🟢 PASS** — what was checked and cleared, so the report is auditable.

State explicitly: "Not approved — N items pending Ewa/Keith sign-off" or
"Deterministic + judgement pass clean; sign-off still required per CONTEXT.md."

**Write the report as an allowlist of what the copy DOES, never a list of what
it avoids.** "Framed as measurement, never as outcome" carries exactly the same
information as spelling out the banned terms, and is scanner-clean. A note that
enumerates prohibitions puts every one of those terms back into a file that gets
scanned, so the next run flags your own compliance note. `03_compliance/CONTEXT.md`
already states this for the silent ingredient; it applies to the whole red-flag
table. This has recurred three times (an X batch note on 2026-07-29, nine of ten
REVIEW hits across five video assets on 2026-07-31, and once recursively where
the note explaining the fix re-tripped the gate). (Observations 53, 70.)

**Before proposing a compliance ask, check whether one already exists.** For any
cluster flagged compliance-gated, read ClickUp list `901219880207` and grep
`03_compliance/claims-and-labels/` for an existing pack or CA before proposing a
new Ewa ask. If one exists, the recommendation is "chase that sign-off", not
"commission a pack". An approved pack that nobody remembers is
indistinguishable from no pack, and the cost lands on the scarcest person in the
business. (Observation 30.)

**Never write a CA number onto a draft.** Numbers are stamped from the register
at sign-off, in order of actual approval. An artefact that self-assigns "expected
CA-NNN" will be wrong the moment anything else is signed first, and prose
reservations have now been overtaken twice. Unapproved artefacts say "CA number
assigned on approval" with no number. Before writing any new sequential ID
anywhere, grep the repo for that ID and the next two, and treat a hit outside the
register as an unresolved reservation rather than decoration.
(Observations 31, 65.)

### 5. Log (only when asked, or when copy is being shipped)
Per CONTEXT.md, an approval is logged in **ClickUp first** (the hub) and then
mirrored into `andro-prime/03_compliance/content-approval/` with reviewer name +
date. This skill never writes either entry itself — it hands the report to
whoever signs.

**Before reporting anything as awaiting sign-off, read ClickUp.** Prior approval
is a fact about the hub, not about the repo and never about the artefact:

- Numbered approvals (CA-NNN): list `901219880207` (Approvals & Sign-offs).
- Articles and webpages: list `901218140081` (blog-article Content Review);
  **task complete = approved**.
- Workspace `90121729875` on every call.

Never conclude "this still needs Ewa" from a `TODO`, a "pending Ewa" note, an
unticked checklist box, or a missing repo row. Those go stale the moment the
reviewer acts, and each one has already produced a false escalation: a missing
register row on 2026-07-13, and two residual `{/* TODO Ewa */}` markers on
2026-07-31 in articles she had already approved. Read the hub, then report.

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

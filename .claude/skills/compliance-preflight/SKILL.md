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

**The corpus has three parts, and they fail differently.** Rules tell you what is
prohibited; **approvals** tell you what was cleared; **rulings** tell you what was
examined and found NOT to be a breach. Load all three. A pass loaded with only the
rules table regenerates settled questions forever, and its false positives cost
more than its misses: they spend Ewa's attention re-litigating her own decisions
and erode confidence in the true findings standing next to them. Two independent
passes once both graded a phrase HARD that a corrections document had adjudicated
compliant five weeks earlier, on a fine distinction between two near-identical
verbs. (Observation 126.)

- Read `andro-prime/03_compliance/CONTEXT.md` in full — red-flag table, EFSA
  approved-claims table, Phase-0 / post-CQC boundary, special cases.
- **Read the rulings/corrections layer too**, not just the rules table and the
  approval register: `03_compliance/STATE.md` and any corrections or precedent
  worksheet in `03_compliance/`. A prior adjudication outranks a fresh reading of
  the rules table. Where a rule turns on a fine distinction between near-synonyms,
  that distinction belongs back in the rules table, or every future reviewer
  re-derives it wrongly.
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

#### 2a. Separate the PAYLOAD from the APPARATUS before you scan, and scan them separately

The scanner matches strings without modelling their speech act, so **naming a
forbidden thing is indistinguishable from asserting it**. That means it punishes
hardest exactly the documents that implement a control most explicitly, and the
obvious remediation removes the control. This has now recurred in four shapes:

| Shape | Example | Where the hits land |
|---|---|---|
| Exclusion list | Google Ads negative-keyword list | The terms being blocked |
| Internal spec prose | `## Email 1` body plus trigger/dependency spec in one `.md` | The spec, not the email |
| Decision commentary | A section explaining why a flag was resolved | The explanation |
| Prohibition list | A brief listing what must not be said | The list itself |

**A single blended count over a mixed-content file measures the document's
structure, not its risk.** Extract the shippable copy (ad headlines and
descriptions, the `## Email N` body, the article body) into its own scan and
report that count as the headline. Report apparatus hits as a distinct,
non-blocking bucket. On a live example the blended number was 3 HARD + 3 REVIEW
and the shippable copy was 0 + 0, i.e. 100% false positives, and deleting the
flagged terms would have stripped the negative-keyword list and let therapy-intent
traffic through. (Observations 20, 64, 132.)

Until `scan.js` can tell payload from apparatus, the narrower rule stands and must
be stated rather than rediscovered: **internal commentary inside a scanned asset
file must avoid the regulated vocabulary entirely, including benign English uses**
("regard X as approved", never "treat X as approved"), because the scanner cannot
tell commentary from copy. (Observation 64.)

#### 2b. The scanner reads source; the claim is made in what RENDERS

A source-level scan tests the authoring, not the claim. Markup splits phrases that
the rendered page joins: `A real doctor<br />designed your report.` contains the
banned sentence on screen and nowhere in the source, so an exact-string search
returns clean. **The gap is invisible in the case that matters most — headings,
where the strongest claims live and where designers most often break lines.**
So: scan the rendered surface where one exists (rendered email HTML, the served
page), or match the shortest distinctive fragment that cannot span a tag ("real
doctor") rather than the full sentence. (Observation 122.)

#### 2c. Never narrow a value search by piping into a subject filter

`grep -rn "30mg" | grep -i "zinc"` is line-scoped, so it discards every true
positive whose subject sits on a neighbouring line — which is the normal shape of
an object literal, a table, or any formatted block:

```js
{ name: 'Zinc',
  num: '01',
  dose: '30mg',      // matches "30mg", contains no "Zinc" -> filtered out
```

The bare search would have found it; **adding the filter to reduce noise is what
lost it**, and the report gives no signal that it narrowed anything. Search the
bare value, accept the noise, discard false positives by reading them. Where noise
is unmanageable, widen the window (`grep -B3 -A3`) rather than filtering. After
any bulk value change, **re-grep the bare value across the whole tree and confirm
every remaining hit is intentional.** (Observation 129.)

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

#### 2d. A signed claims-pack exception is declared, never re-argued

A claims pack can authorise a red-flag term for one specific compliant use.
CA-028 permits "andropause treatment" and "diagnose andropause" as a **search
term echoed in a question and answered in a non-treatment frame**. Removing them
fails the keyword-coverage invariant, so "fix all HARD" and the coverage rule
collide and the drafter is stuck re-establishing Ewa's own sign-off every run.

Declare it in the target's frontmatter and the scanner clears it as
🔵 SIGNED EXCEPTION, citing the pack:

```yaml
preflight_exceptions:
  - treatment @ CA-028 : keyword echoed in an FAQ question, answered in a non-treatment frame
  - diagnose @ CA-028 : same
```

**This is a channel for a signed exception, not a way for a file to declare
itself compliant.** The limits are enforced in code, not by convention:

| Rule | Behaviour |
|---|---|
| Only terms with a recognised compliant use (diagnose / cure / treat) | anything else is REFUSED |
| **Ashwagandha can never be exempted** | inexemptable by construction; invariant 4 |
| A refused attempt | is itself a 🔴 HARD finding, present in the file or not |
| Malformed line, or no valid `CA-NNN` | ignored, so the hit stays gated (fail closed) |
| Declared but matching nothing | reported as a stale exemption |
| Gate G5 (`content-status/scan.js`) | does NOT honour this channel |

**Never invent a CA number to clear a gate.** If no pack authorises the use, the
term comes out. Suite: `node .claude/skills/compliance-preflight/test-signed-exceptions.js`
(12 cases, nine of them adversarial). (Observation 32.)

#### 2e. FRAGMENT COPY is checked against its source, never on its own

A carousel slide, a hook, a spoken script line and a short post are **compressions
of something already signed off**. The prose scanner is calibrated on sentences
with room for a qualifier; a fragment has no such room, and **the qualifier is the
first thing cut for length**. The result reads clean in isolation, because the
claim is now implicit rather than stated and a scanner looking for stated claims
sees nothing. (Observation 180.)

So a fragment is never scanned alone:

```bash
node .claude/skills/compliance-preflight/fragment-scan.js \
  --fragment <deck-or-copy-file> --source <the signed-off article> \
  --render <the rendered PNG/MP4 or its directory>   # repeatable per pair
```

It applies the same HARD/REVIEW tables (required from `compliance-tables.js`, so
the literal floor cannot drift from the prose scanner's) and adds three checks
that only exist in the delta between fragment and source:

| Check | Grade | Why it only works against a source |
| --- | --- | --- |
| **No `--source`** | 🔴 HARD | "Reads clean" is not evidence about a compression. Refuse. |
| **Figure not in the source** | 🔴 HARD | Compression is where a threshold gets rounded or misremembered, and a wrong number on a slide reads as fact. |
| **Qualifier the source carried, dropped** | 🟠 REVIEW | The observation's exact failure mode. Reported with both texts, and with whether **anything else on that slide still hedges it**. |

**Read the two qualifier grades differently.** "The slide hedges elsewhere" is a
reading-order question — at feed size the headline is often the only line read.
"NOTHING on this slide hedges it" is a sharpened claim with nothing holding it,
and is the one to act on.

**Text-clean is not a clearance when the copy ships as a picture.** Where copy and
image ship as one unit, the unit is the thing to be checked: a trend arrow, a
before/after, a red-to-green move carries claim weight the text does not. The
scanner cannot read an image, so it prints a RENDER OBLIGATION naming the files a
human must actually look at, and a declared render that does not exist is a 🔴
HARD stop — an obligation claimed and unmet is worse than one never claimed.
**Never report a fragment pass without discharging that obligation.**

Suite: `node .claude/skills/compliance-preflight/test-fragment-scan.js` (12 cases;
case 3 is a mutation test, without which a silently-inert number check would pass
every other case).

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
- **Inverted defaults are a compliance finding, not a code-style nit.** For any
  flag selecting between a more and a less protective behaviour (data region,
  encryption, consent gating, redaction, sandbox-vs-live), **assert that an absent
  or malformed value resolves to the PROTECTIVE option.** Flag
  `=== 'true' ? protective : permissive` as an inverted default on sight. A region
  selector written that way sent consent-gated health-derived traits to US
  endpoints for an unknown period because the variable was simply absent from the
  production environment: correct in the local env file, correct in the example
  file, wrong nowhere in the repo. Nothing errored; the only signal came from the
  vendor's own compliance alerting. **"Someone forgets to set it" is not an edge
  case, it is the expected long-run behaviour of any environment variable.**
  (Observation 135.)
- **A compliance document stating a technical fact needs a pointer to the code or
  config that enforces it** (region, retention, encryption, consent gating), so
  the claim is falsifiable rather than aspirational. In the case above, the
  data-protection assessment asserted the protective routing as fact, so the
  written record described a state of affairs that was not in operation and no
  amount of reading the docs could have caught it. (Observation 135.)
- **Availability claims.** "Coming soon", "launching shortly", "be first when we
  launch", "no kit to sell you today" are all claims about commercial state and
  they go stale silently. Check each against what is actually purchasable now
  (`10_launch-ops/STATE.md` for gate status, the live kit pages for reality) and
  scope the claim to the specific unlaunched thing, never to the brand. On
  2026-07-31 a live article still said our checks had not launched, two clicks
  from three buyable kits.

### 4. Report — five buckets, nothing else
- **🔴 HARD FAIL** — `file:line`, the term, why, the permitted alternative
  from CONTEXT.md. Must be resolved before publish/activation.
- **🟠 FLAG FOR EWA** — `file:line`, the phrase verbatim, why it's risky, which
  table/rule. Keith's copy stays as written; Ewa decides. (Clinical/claims →
  Ewa; FM/business framing → Keith.)
- **🔵 PREVIOUSLY ADJUDICATED, NO ACTION** — the phrase, the ruling document, its
  date, and who signed it. **Before grading anything HARD, grep `03_compliance/`
  for the literal phrase**; a hit inside a corrections or ruling document is a
  prior adjudication and outranks a fresh read of the rules table. Report these
  rather than omitting them, so the reviewer can see the question was asked and
  answered instead of silently dropped. (Observation 126.)
- **⚪ APPARATUS, NON-BLOCKING** — hits on the document's own control machinery
  (exclusion lists, prohibition lists, internal spec prose, decision commentary)
  per step 2a. Never fold these into the headline count, and never "fix" them.
- **🟢 PASS** — what was checked and cleared, so the report is auditable.

**A document that permanently self-flags needs an inline note saying so**, or the
next reader re-escalates it — the same failure as the stale `{/* TODO Ewa */}`
markers that produced a false escalation to a clinician who had already answered.

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

**Before surfacing any conflict for a human ruling, go to the workspace that OWNS
the question.** A contradiction is *discovered* where two consumers disagree, but
it is *resolved* where the fact is owned. Resolve the owner from the root routing
table (claims questions → `/03_compliance`) and read its `CONTEXT.md` **and**
`STATE.md`, even when the conflict surfaced elsewhere. Add an explicit line to the
escalation: *"owning workspace checked: `<path>`, prior ruling found: yes/no"*.
When a prior ruling exists and points the other way it must appear **as an option
in the question, not as background** — the user cannot pick an option they were
never shown. Two docs once disagreed on whether a phrase was prohibited and Keith
was asked to arbitrate; `03_compliance/STATE.md` held a same-day retraction plus a
pointer to a ruling that had cleared that exact string under Ewa's sign-off. Both
docs read were consumers; neither was the owner. And if the user's ruling reverses
one carrying someone else's sign-off, say so at the moment of the ruling, not at
wrap. (Observation 130.)

**Never bundle "verify this fact" with "now rule on it" in one numbered item.**
The answerer resolves to the half they can answer quickly, and the skipped half
leaves no gap in the reply to mark its absence, so the answer looks complete and
is not. Asked to confirm the Daily Stack's zinc/D3 figures *and* rule on whether
the doses were acceptable, Ewa replied "drop to 25mg and 4,000 IU is fine" — a
clean ruling that silently skipped the verification, leaving the scope ambiguous
(page? spec? both?) and crowding out an adjacent linked question she was never
asked. Either resolve the fact from the repo first and state it as given ("the
spec says X, confirm the dose is acceptable"), or split it into two numbered
items so a skipped verification shows up as an unanswered number. **Where the repo
can answer the factual half, it must** — asking the signer to verify something
already recorded spends the scarcest attention in the business on retrieval
instead of judgement. Before sending, check whether any item's premise is stated
as unverified, and try to verify it from the repo first. (Observation 128.)

**Before creating by hand any artefact a repo tool normally generates** (a review
task, an approval request, a scheduled job), read that tool's source first and
port its safeguards, not just its output shape. An automation's value is often not
the labour it saves but the **invariants it enforces**, and those live in the code,
not in the artefact — so a hand-made copy looks correct precisely because what is
missing was never visible in the finished product. A reviewer task built by hand
with eight questions in a description table reproduced the exact defect the
automated submitter exists to prevent: it turns each question into a real checklist
item the gate refuses to approve until ticked, so eight questions became one
completion click and eight silent yeses. If you must hand-roll, **state in the
artefact which safeguards are absent.** (Observation 111.)

### 6. Record the verdict on the DATABASE ROW (only when the target is a content-machine asset)
If the copy you checked *is* a content-machine asset file (in
`andro-prime/06_marketing/content-machine/assets/`) or is the body of one,
record the verdict on that asset's `content_assets` row, joined by `slug`:
- `preflight = 'green'` — deterministic + judgement pass clean, nothing pending.
- `preflight = 'amber-ewa'` — one or more 🟠 items are with Ewa/Keith; also set
  `ewa_task` to the ClickUp task URL once that review task exists.
- `preflight = 'red'` — an unresolved 🔴 HARD fail.
Always set `preflight_date = CURRENT_DATE` alongside it.

**Never write any of those four keys into the file's frontmatter** (Phase 1,
2026-08-01; `06_marketing/content-machine/CONTEXT.md`, section "The asset file
owns IDENTITY and CRAFT. The database owns STATE."). The file owns identity and
craft only. `preflight`, `preflight_date`, `ewa_task` and `ewa_signed_at` are
all on `.claude/skills/content-status/db-owned-keys.json`: `scan.js` HARD-fails
each one as `[STATE]` naming the owning column, and `content-doctor` invariant 9
fails the nightly run. **The gate scanner does not read the pre-flight result
any more and cannot**: the approval gate is the `content_assets_approval_gate`
CHECK constraint in `09_website-app/database/migrations/20260801_content_state_guards.sql`,
which reads the row, not the file.

If you cannot write the row, report the verdict in your findings and say the row
was not updated. **Do not park it in frontmatter as a stand-in** — that is the
dual store this phase removed, and it fails both detectors on the next run.

This records the *pre-flight result* only; it is not an approval and does not
move `status`. Sign-off is still Ewa's or Keith's per invariant 5, and
`ewa_signed_at` is written only by the sign-off sync, never by this skill and
never by hand. If the target is not an asset file, skip this step.

## Known scanner limits — read before trusting a count

One live defect remains, and it needs Keith's call because loosening a HARD gate
is not a decision this skill makes. Four others were fixed on 2026-08-05 and are
recorded at the bottom so a stale memory of them does not linger.

1. **The scanner cannot tell a claim from a prohibition list.** Covered in step 2a
   above, which is the process mitigation. The code-level fix (suppressing hits
   inside a fenced block, or under a heading matching
   `/negative|prohibit|exclud|forbidden|banned/i`, into a non-blocking bucket) is
   NOT applied, because it would suppress by document structure in files nobody
   reviewed for that purpose, and the documented v2.2 breach is the same shape
   inverted: there, printing a banned term inside its own prohibited-list WAS a
   real fail. Separate the copy by hand per step 2a instead. (Observation 132.)

2. **This scanner cannot read an image.** Fragment mode names the renders a human
   must view (step 2e) and grades a missing declared render HARD, but nothing
   checks what the picture actually claims. A chart, a before/after or a
   colour move is cleared by a person or not at all.

### Fixed 2026-08-11

- **The negation guard no longer depends on which apostrophe was typed.** Every
  contraction in `NEG` matched U+0027 only, so `"Signs aren't diagnoses."` cleared
  and `"Signs aren’t diagnoses."` — the same sentence in the typographic
  apostrophe house style actually uses — was graded 🔴 HARD by the same scanner.
  Verified both ways before and after. **This makes a HARD gate marginally more
  permissive and was flagged as such rather than slipped in**: the guard's intent
  was always that a negated term is a disclaimer, and typography is not a
  compliance signal. `NEG` is shared with gate G5, so the fix lands in
  `compliance-tables.js` and both consumers get it. Found by running the new
  fragment scanner over the ALREADY-APPROVED vitamin D deck and watching it fail
  a headline nobody had ever doubted — a checker whose false positives land on
  known-good copy gets switched off within a week. Suite:
  `node .claude/skills/compliance-preflight/test-curly-negation.js` (18 cases,
  five adversarial, asserting the widened class did not turn the guard into a
  bypass).

### Fixed 2026-08-05, recorded so a stale memory does not linger

- **Signed claims-pack exceptions now have a channel** (step 2d above), so a
  permission lives in the asset with a CA citation instead of being re-argued
  each run. Only diagnose / cure / treat are exemptable; ashwagandha is
  inexemptable by construction; refusals are HARD findings; malformed or
  untraceable entries fail closed; stale entries are named. One implementation
  note worth keeping, because it is the skill's own lesson biting inside its own
  fix: **the declaration lines had to be excluded from the scan.** An exception
  naming "treatment" necessarily contains the word, so the scanner graded the
  control as the copy, the entry silently marked itself used, and a stale
  exemption would have looked live forever. Same defect as step 2a, one level
  further in. Caught by the stale-entry test, the only case where the difference
  is observable. (Observation 32.)

- **The detector is now ONE definition.** `HARD`, `REVIEW` and `NEG` live in
  `compliance-preflight/compliance-tables.js` and are required by both this
  scanner and `content-status/scan.js` (gate G5, the copy `/wrap` wires into the
  commit gate). They were previously typed out in both files under a comment
  promising they matched. **Correction to how this was first reported:** the two
  tables were byte-identical at the time, so no verdict on real copy was ever
  wrong, and the suppression machinery that differs (`FM_BLOCK`, `SPLITTER`,
  `CONTRAST_TAIL`) is frontmatter-scoped while G5 scans the body only, so it could
  never have fired there. The defect was the *absence of a mechanism*, not a live
  divergence. Verified byte-identical scanner output before and after the merge.
  (Observation 97.)
- **The scan now normalises markup before matching.** `You have low<br
  />testosterone` and `clinically<em> </em>proven` are caught and annotated
  "found only after stripping markup". Strictly additive: raw-line matches report
  exactly as before, and a disclaimer split by a tag still clears. Regression
  suite `node .claude/skills/compliance-preflight/test-markup-split.js` (9 cases,
  including an adversarial one asserting that stripping tags does not JOIN two
  innocent phrases into a claim). Mutation-verified by disabling the
  normalisation and confirming the four split cases fail. (Observation 122.)
- **The em-dash guard now matches the shape of prose, not the character.** A lone
  glyph standing in for an empty value passes (`{v ?? '—'}`, `<td>—</td>`, a
  `| — |` cell); every prose use still blocks, including one on the same line as
  a placeholder. Narrowed by pattern rather than by path allowlist, so there is no
  path list to drift. Suite `node .claude/hooks/test-em-dash-guard.js` is now 28
  cases. **The hook is gitignored and local-only**, so this fix does not travel
  with the repo and has to be reapplied on another machine. (Observation 138.)

## When to fire this
Before: sending/activating any CIO campaign, publishing a page or LP, shipping
an ad or social post, issuing an affiliate/influencer brief, finalising
results-report wording. It pairs with `cio-sequence-build` (run this on the
copy file before the campaign goes anywhere near `state: running`).

**On atomised copy, fire it BEFORE the fragment is committed to an expensive
surface.** A carousel headline is printed into a photograph by a paid inpaint
call whose mask is valid for one geometry only, so a headline rejected after the
frame exists is paid for twice. The words clear first, then they get rendered.
Same logic for a script line before it is filmed.

**Also fire it on SOURCE material before anything is extracted from it**, not just
on the finished copy. Scope work on the material, never on a description of it: an
owner's one-line summary reports what they think they recorded, not what is in it,
and in a regulated domain that gap is a compliance exposure. A corpus described as
"voice recordings about my journey" turned out to be a sequenced illness memoir
mixed with unrelated business recordings, whose central biographical fact is a
clinical contraindication for the product category. A voice or style pass tests
cadence and structure and would never have caught it, so the fact would have
travelled into downstream copy invisibly. Read the material, map its subject and
date clusters, and run a content-risk read for regulated-domain facts
(contraindications, third-party names, identifying detail, claims) **before**
scoping the extraction — and route that read to the clinical owner, not to the
copy-review stage where it surfaces too late. (Observation 42.)

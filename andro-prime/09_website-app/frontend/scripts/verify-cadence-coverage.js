#!/usr/bin/env node
/**
 * EVERY RESULT STATE MUST APPEAR IN BOTH CADENCE DOCUMENTS.
 *
 * ── WHY THIS EXISTS ───────────────────────────────────────────────────────
 * `RETEST_CADENCE` is to be `Record<ResultState, RetestRule>`, which makes a
 * missing cell a COMPILE error. That protection starts the day the map is
 * written. Until then the same gap is invisible, and it has already bitten
 * twice in one day:
 *
 *   1. `high-testosterone` (T > 29) and `high-vitamin-d` (> 250) were signed by
 *      Ewa in CA-047 round 1 Q3 — the question enumerated both by band — but
 *      the sign-off table had no rows for them, because it was written before
 *      the 2026-08-07 upper bands existed. Her answer covered TEN states; the
 *      table offered EIGHT rows.
 *   2. `fai-reported` was in NEITHER document, and had never been in either.
 *
 * 🔴 THE PART WORTH UNDERSTANDING: none of the checks in place could have found
 * either one. Both sign-off rounds were validated by comparing the reply's
 * answer count against an expected count recorded before sending, and both
 * matched exactly. That is a real control and it caught real problems — but
 * **the count is of ANSWERS and the shortfall was in ROWS**. A reply can be
 * complete against the questions asked while the questions are incomplete
 * against the artefact. And a state absent from BOTH records is invisible to
 * any check that reads either one.
 *
 * So the only check that works is the one that starts from the type — the
 * artefact neither document can silently under-describe.
 *
 * ── WHAT IT DOES ──────────────────────────────────────────────────────────
 * Parses the `ResultState` union from `lib/results/types.ts`, then asserts
 * every member appears in both `2026-07-17-retest-cadence-table.md` (as a row)
 * and `2026-09-15-retest-cadence-by-rule-kind.md` (as a mapped cell).
 *
 * ⚠ THE ALLOWLIST IS DATED DEBT, NOT A SCOPE. It exists so a KNOWN, RECORDED
 * gap does not block the build while a NEW one still fails loudly. It is
 * checked in both directions: an entry that turns out to be covered fails too,
 * with an instruction to delete it. That is deliberate — this repo has just
 * been bitten by a carve-out enumerated by instance that went stale silently
 * because the list still read as complete.
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const REPO = path.resolve(ROOT, '..', '..', '..')
const DOCS = path.join(REPO, 'andro-prime', '04_products', 'results-engine')

const TYPES = path.join(ROOT, 'lib', 'results', 'types.ts')
const TABLE = path.join(DOCS, '2026-07-17-retest-cadence-table.md')
const MAP = path.join(DOCS, '2026-09-15-retest-cadence-by-rule-kind.md')

/**
 * Known, recorded gaps. Each entry MUST name where the decision is tracked, so
 * an allowlisted state is a visible debt with an owner rather than a silence.
 */
const KNOWN_GAPS = {
  // ✅ EMPTY, AND THE FACT THAT IT EMPTIED THE SAME DAY IS THE POINT.
  // `fai-reported` was the first and only entry, recorded 2026-09-15 when this
  // script was written and removed hours later when Keith decided the cell
  // (`none`, the sixth kind — build checklist item 2b). It was never allowed
  // to become furniture.
  //
  // ⚠ IF YOU ARE ADDING AN ENTRY HERE, IT IS DEBT, NOT SCOPE. Name where the
  // decision is tracked, and expect to delete it. The staleness check below
  // fails the build once an entry becomes covered, precisely so that an
  // allowlist cannot quietly outlive the gap it records and mask the next one.
}

function fail(lines) {
  console.error('\n🔴 verify-cadence-coverage FAILED\n')
  for (const l of lines) console.error('   ' + l)
  console.error('')
  process.exit(1)
}

// ── The union, read from the type rather than from either document ──────────
const types = fs.readFileSync(TYPES, 'utf8')
const union = types.match(/export type ResultState =([\s\S]*?)\nexport type CtaType/)
if (!union) fail(['could not parse the ResultState union out of lib/results/types.ts'])
const states = [...union[1].matchAll(/^\s*\|\s*'([a-z0-9-]+)'/gm)].map((m) => m[1])
if (states.length < 20) fail([`parsed only ${states.length} states; the regex is probably wrong`])

// ── Rows in the sign-off table, bucket by bucket ────────────────────────────
// Row labels are annotated rather than bare state names ("normal-testosterone
// (low half)", "elevated-crp / moderate-crp, **joints = no**"), so a state is
// covered when a label names it, not only when a label equals it.
// ⚠ EVERY `###` HEADING CLOSES THE PREVIOUS SECTION, not just a recognised one.
// The first draft only opened sections and never closed them on an unrecognised
// heading, so a later non-bucket heading inherited the previous bucket and its
// rows were silently attributed to it. It gave the right total by luck. A
// counter that is right by luck is the thing this script exists to replace.
const ROW_BEARING = /^### (Bucket [ABC]|Outside the three buckets)/
const tableRows = []
let inSection = false
for (const line of fs.readFileSync(TABLE, 'utf8').split(/\r?\n/)) {
  if (/^#{2,3} /.test(line)) inSection = ROW_BEARING.test(line)
  if (inSection && /^\| [a-z]/.test(line)) tableRows.push(line.split('|')[1].trim())
}
const namedInTable = (s) =>
  tableRows.some((r) => new RegExp(`(^|[^a-z0-9-])${s}([^a-z0-9-]|$)`).test(r))

// ── Cells in the rule-kind map ──────────────────────────────────────────────
// ⚠ A STATE BEING MENTIONED IN THE MAP IS NOT THE SAME AS IT HAVING A CELL.
// The map documents its own gaps, so `fai-reported` appears in it inside a
// section headed "NO CELL". Counting a mention as coverage would let the
// document satisfy this check by describing the hole it has — which is exactly
// the shape of self-certifying claim this script exists to stop. So: only rows
// inside a kind section count, and a section can opt itself out by saying so in
// its heading.
// 🔴 SPLIT ON `/\r?\n/`, NOT `'\n'`, AND THE FAILURE IT PREVENTS LOOKS CLINICAL.
// Found 2026-09-19. This repo sets `core.autocrlf=true` and ships no
// `.gitattributes`, so a checkout rewrites these documents as CRLF. Splitting on
// `'\n'` then leaves a trailing `\r` on every line, and `\r` is a LINE
// TERMINATOR in JavaScript regexes: `.` will not match it, so `/^### (.*)$/`
// matches NOTHING and `kindSection` is never set. Every state then reports as
// missing from the map. The output reads as fifty unsigned clinical states — a
// catastrophic, entirely false finding produced by a line ending. It passed on
// one branch and failed on the next purely because a `git checkout` had
// rewritten the file in between. `verify-env-contract.js` already splits the
// tolerant way; this one did not, and 25 scripts here still split on `'\n'`.
// The root fix is a `.gitattributes` pinning LF, which is a separate deliberate
// change because it renormalises the whole working tree.
const mappedStates = new Set()
let kindSection = null
for (const line of fs.readFileSync(MAP, 'utf8').split(/\r?\n/)) {
  const h = line.match(/^### (.*)$/)
  if (h) kindSection = /NO CELL/.test(h[1]) ? null : h[1]
  else if (/^## /.test(line)) kindSection = null
  if (!kindSection) continue
  // One cell can name more than one state: the CRP rows are split by joint
  // symptoms and read "`elevated-crp` / `moderate-crp`, **joints = no**". Take
  // every backticked identifier in the first cell, not just the leading one.
  if (!/^\|/.test(line)) continue
  const firstCell = line.split('|')[1] ?? ''
  for (const m of firstCell.matchAll(/`([a-z0-9-]+)`/g)) mappedStates.add(m[1])
}

// ── Assert ──────────────────────────────────────────────────────────────────
const problems = []

for (const s of states) {
  const missingFrom = []
  if (!namedInTable(s)) missingFrom.push('table')
  if (!mappedStates.has(s)) missingFrom.push('map')
  if (missingFrom.length === 0) continue

  const known = KNOWN_GAPS[s]
  if (!known) {
    problems.push(
      `'${s}' is in the ResultState union but missing from the ${missingFrom.join(' and ')}.`,
      `    Add its row/cell, or record it in KNOWN_GAPS with where the decision is tracked.`,
    )
  } else if (known.missingFrom.join(',') !== missingFrom.join(',')) {
    problems.push(
      `'${s}' is allowlisted as missing from [${known.missingFrom.join(', ')}] but is actually`,
      `    missing from [${missingFrom.join(', ')}]. Update or remove the KNOWN_GAPS entry.`,
    )
  }
}

// The allowlist must not outlive the gap it records.
for (const [s, entry] of Object.entries(KNOWN_GAPS)) {
  if (!states.includes(s)) {
    problems.push(`KNOWN_GAPS names '${s}', which is no longer a ResultState. Remove the entry.`)
    continue
  }
  const stillMissing = (!namedInTable(s) ? 1 : 0) + (!mappedStates.has(s) ? 1 : 0)
  if (stillMissing === 0) {
    problems.push(
      `'${s}' is allowlisted in KNOWN_GAPS but is now covered by both documents.`,
      `    DELETE the entry — a stale allowlist hides the next real gap. (${entry.tracked})`,
    )
  }
}

if (problems.length > 0) fail(problems)

const allow = Object.keys(KNOWN_GAPS)
console.log(
  `verify-cadence-coverage: ${states.length} result states, ${tableRows.length} table rows, ` +
    `${allow.length} recorded gap${allow.length === 1 ? '' : 's'}` +
    (allow.length ? ` (${allow.join(', ')})` : ''),
)
for (const [s, e] of Object.entries(KNOWN_GAPS)) {
  console.log(`  ⚠ '${s}' missing from ${e.missingFrom.join(' + ')} — tracked: ${e.tracked}`)
}

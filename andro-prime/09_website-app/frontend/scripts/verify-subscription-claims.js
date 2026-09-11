#!/usr/bin/env node
/**
 * A page may not tell a buyer there is no subscription while the site is
 * selling one.
 *
 *   node andro-prime/09_website-app/frontend/scripts/verify-subscription-claims.js
 *
 * WHY THIS EXISTS. Keith ruled on 2026-09-07 that the first 30 days of
 * membership are included in the kit price and that **on day 31 the card is
 * charged £47 automatically**, with no re-consent step. Every kit buyer becomes a
 * subscriber. The ruling also specifies the disclosure that ships with it, and on
 * 2026-09-11 extended that line to the three `/lp/` kit landing pages.
 *
 * 🔴 WHAT NOBODY SWEPT IS THE COPY THAT SAYS THE OPPOSITE. Thirteen sentences
 * across seven surfaces still assert a one-off purchase with no subscription,
 * including **CA-026 C1 on `/kits`**, which is approved, pre-flighted copy
 * rendered verbatim inside the inverted panel: *"no subscription unless you
 * choose one"*. Under the adopted model nobody chooses one; it arrives with the
 * kit. That sentence is not merely missing a disclosure, it is an affirmative
 * statement that is false, on the page that takes the money.
 *
 * THE FLAG IS WHAT MAKES IT SAFE TODAY AND DANGEROUS TOMORROW. With
 * `MEMBERSHIP_ENABLED` off there is no membership, nothing renders the
 * disclosure, and "no subscription" is true. The moment the flag goes on, both
 * halves are live at once and the page contradicts itself on one screen. So the
 * interlock is not "remove the claims" and it is not "never ship the line"; it is
 * that the two states may not coexist.
 *
 * WHAT IT DOES. It always REPORTS every claim it finds, so the list is visible in
 * any run. It FAILS only when `MEMBERSHIP_ENABLED=true`, which is the exact
 * condition under which the claims become false. That means:
 *
 *   - the ordinary flag-off build stays green, because nothing is wrong yet;
 *   - the conformance and screenshot runs, which set the flag, fail loudly;
 *   - and turning the flag on for real is impossible until the copy is swept.
 *
 * ⚠ THIS IS A COPY GATE, NOT A LINT. The fix is never to edit these sentences to
 * get the build green. They are approved customer-facing copy; rewriting them
 * needs Keith, then a compliance pre-flight, and CA-026 C1 needs a fresh CA
 * record. Record the replacement wording in `redesign-copy-register.md` and
 * update `CLAIMS` below in the same change.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const SCOPE = [path.join(ROOT, 'app')]

/* The phrases that assert the absence of a subscription or the one-off nature of
   the purchase. Matched case-insensitively against rendered text only: a JSX
   comment explaining the problem is documentation, not a claim. */
const CLAIMS = [
  'no subscription',
  'one-off purchase',
  'one-off payment',
  'not a subscription',
]

const SKIP_DIR = new Set(['node_modules', '.next', '.git', '.impeccable', 'out'])

function die(m) { console.error(`ERROR: ${m}`); process.exit(1) }

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIR.has(e.name)) walk(path.join(dir, e.name), acc) }
    else if (e.name.endsWith('.tsx')) acc.push(path.join(dir, e.name))
  }
  return acc
}

const read = (f) => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n')
const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/')

/* Blank out comments so a note ABOUT the defect is not counted AS the defect,
   and so the wording of this script's own reasoning cannot fail the build.
   Replaced with spaces rather than removed, so line numbers survive. */
function stripComments(s) {
  return s
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + ' '.repeat(m.length - p1.length))
}

const files = SCOPE.flatMap((d) => walk(d))
if (files.length < 20) die(`found only ${files.length} route files. The layout changed; fix this collector rather than trusting a pass.`)

const flagOn = process.env.MEMBERSHIP_ENABLED === 'true'
const found = []

for (const f of files) {
  const src = stripComments(read(f))
  const lines = src.split('\n')
  lines.forEach((line, i) => {
    const hay = line.toLowerCase()
    for (const claim of CLAIMS) {
      if (hay.includes(claim)) found.push({ file: rel(f), line: i + 1, claim, text: line.trim().slice(0, 120) })
    }
  })
}

console.log('\nSubscription claims vs the auto-renew ruling\n')
console.log(`  MEMBERSHIP_ENABLED = ${flagOn ? 'true' : 'unset/false'}`)
console.log(`  ${found.length} claim(s) asserting no subscription or a one-off purchase\n`)

const byFile = new Map()
for (const c of found) {
  if (!byFile.has(c.file)) byFile.set(c.file, [])
  byFile.get(c.file).push(c)
}
for (const [file, cs] of [...byFile.entries()].sort()) {
  console.log(`  ${file}`)
  for (const c of cs) console.log(`    :${c.line}  ${c.text}`)
}

if (!found.length) {
  console.log('\n  ok   nothing asserts a one-off purchase. The copy sweep is done.\n')
  process.exit(0)
}

if (!flagOn) {
  console.log(`
  ok   MEMBERSHIP_ENABLED is off, so no membership exists and these sentences
       are still true. They are listed above because the moment the flag goes
       on they become false and this check turns red.

       Owed: rewritten copy from Keith, then a compliance pre-flight. CA-026 C1
       on /kits needs a fresh CA record because it is approved verbatim copy.
`)
  process.exit(0)
}

console.error(`
  FAIL MEMBERSHIP_ENABLED is TRUE and ${found.length} sentence(s) above still tell a
       buyer there is no subscription. Under
       01_strategy/2026-09-07-auto-renew-at-day-30.md every kit buyer is charged
       £47 on day 31, so each of those sentences is false and sits on a page
       that takes the money.

       DO NOT edit them to clear this check. They are approved customer-facing
       copy: the fix is a rewrite from Keith, a compliance pre-flight, and a
       fresh CA record for CA-026 C1. Update CLAIMS in this script in the same
       change.
`)
process.exit(1)

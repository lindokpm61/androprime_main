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
/* 🔴 `public/` JOINED THE SCOPE ON 2026-09-11, AND IT IS THE REASON THIS CHECK
   NEARLY SHIPPED USELESS. The first version walked `app/` and `.tsx` only. An
   independent pre-flight found `public/llms.txt` serving the CA-026 C1 paragraph
   **verbatim**, including "no subscription unless you choose one", under the
   heading "One Price, Nothing Hidden". It is published on the apex and written
   specifically for AI ingestion, so it is the copy most likely to be quoted back
   at us by a model, and this check reported GREEN over it.

   The lesson is about how the scope was chosen rather than about the file: it was
   set to where the claims HAPPENED TO BE FOUND (seven page components) rather
   than to where customer-facing copy CAN live. A scope drawn around the known
   instances can only ever confirm the search that produced it. */
const SCOPE = [path.join(ROOT, 'app'), path.join(ROOT, 'public')]
const EXT = ['.tsx', '.txt', '.md']

/* The phrases that assert the absence of a subscription or the one-off nature of
   the purchase. Matched case-insensitively against rendered text only: a JSX
   comment explaining the problem is documentation, not a claim. */
const CLAIMS = [
  'no subscription',
  'one-off purchase',
  'one-off payment',
  'not a subscription',
]

/* 🔴 THE MIRROR SET, ADDED 2026-09-11. THE CHECK WAS ONE-DIRECTIONAL AND THAT WAS
   A REAL BLIND SIDE, NOT A LIMITATION.

   The first version failed only when `MEMBERSHIP_ENABLED` was ON with an old
   "no subscription" claim still present. It could not see the opposite and more
   dangerous state: NEW copy asserting a GBP 47 recurring charge while the flag is
   OFF, against `app/api/checkout/kit/route.ts`, which is `mode: 'payment'` with a
   single line item, no `subscription_data` and no `trial_period_days`. That page
   would tell every buyer he is being charged on day 31 for a membership that no
   code creates and that he cannot be sold, and this check would report GREEN.

   `MembershipDisclosure`'s header already argues why that is the worse direction:
   *"a page promising thirty included days in front of a checkout that bills
   immediately is a worse position than saying nothing, because it is a promise
   rather than an omission."* A gate guarding one direction of a two-sided
   contradiction is not half a gate, it is a gate that certifies the side it does
   not check. */
const RENEWAL_CLAIMS = [
  'days of membership',
  '/month after',
  'a month unless you stop it',
  'becomes £47',
  'charged £47',
]

/* Surfaces allowed to state the renewal with the flag off, because they are the
   flag's own machinery or never render to a customer while it is off.
   `/membership` calls `notFound()` when the flag is off; the disclosure component
   returns null. Both are the interlock, not a breach of it. */
const RENEWAL_ALLOW = [
  'app/(marketing)/membership/page.tsx',
  'components/commerce/MembershipDisclosure.tsx',
  'lib/membership/disclosure.ts',
]

const SKIP_DIR = new Set(['node_modules', '.next', '.git', '.impeccable', 'out'])

function die(m) { console.error(`ERROR: ${m}`); process.exit(1) }

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIR.has(e.name)) walk(path.join(dir, e.name), acc) }
    else if (EXT.some((x) => e.name.endsWith(x))) acc.push(path.join(dir, e.name))
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
const renewal = []

for (const f of files) {
  const src = stripComments(read(f))
  const lines = src.split('\n')
  const allowed = RENEWAL_ALLOW.includes(rel(f))
  lines.forEach((line, i) => {
    const hay = line.toLowerCase()
    for (const claim of CLAIMS) {
      if (hay.includes(claim)) found.push({ file: rel(f), line: i + 1, claim, text: line.trim().slice(0, 120) })
    }
    if (allowed) return
    for (const claim of RENEWAL_CLAIMS) {
      if (hay.includes(claim.toLowerCase())) renewal.push({ file: rel(f), line: i + 1, claim, text: line.trim().slice(0, 120) })
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

/* THE MIRROR CHECK. Fails when the flag is OFF and customer copy already promises
   the renewal, because the mechanic does not exist yet. */
if (renewal.length) {
  console.log(`\n  ${renewal.length} line(s) stating the renewal outside the interlock\n`)
  for (const c of renewal) console.log(`    ${c.file}:${c.line}  ${c.text}`)
  if (!flagOn) {
    console.error(`
  FAIL MEMBERSHIP_ENABLED is OFF and the line(s) above already promise a
       recurring charge. Kit checkout is \`mode: 'payment'\` with no
       \`subscription_data\` and no \`trial_period_days\`, so no membership is
       created and none can be sold. A page promising thirty included days in
       front of a checkout that bills once is a PROMISE rather than an omission,
       which is the worse of the two directions.

       Render it behind \`isMembershipEnabled()\`, as \`MembershipDisclosure\`
       does, or add the surface to RENEWAL_ALLOW if it genuinely cannot reach a
       customer with the flag off.
`)
    process.exit(1)
  }
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

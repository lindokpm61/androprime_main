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
 *
 * ── HOW TO READ THE COUNT (changed 2026-09-13) ────────────────────────────
 * It now reports **13 sentences on 7 pages, plus 1 non-page surface**, with the
 * raw figures in brackets. Before this it printed a bare `16`, because a line
 * matching two CLAIMS was pushed twice and `public/llms.txt` was counted in with
 * the pages. Thirteen-across-seven is also what this header and
 * `redesign-copy-register.md` row 46 say, so the two now reconcile.
 *
 * That mattered more than a tidy number: a reader comparing the register's 13 to
 * the tool's 16 would reasonably conclude three sentences had crept in since, and
 * go looking for copy that does not exist. **A count that cannot be reconciled
 * with the record it enforces sends the reader hunting for a phantom discrepancy
 * instead of fixing the defect**, which is worse than saying nothing, because it
 * looks like information.
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
/* 🔴 `components` ADDED 2026-09-15, and it is the THIRD axis of the same defect.
   The scope had been widened once already — from "the seven page components where
   the claims happened to be found" to `app` + `public` — and still omitted the one
   directory whose whole purpose is copy rendered on MORE than one page. So
   `components/commerce/BundleChoice.tsx:116` rendered the chip "One-off test" on
   all three kit detail pages, unseen, with the widened scope reporting green.
   A shared component is the highest-leverage place for a claim to hide, because a
   single instance reaches every page that mounts it and no page's own file
   contains the string. */
const SCOPE = [path.join(ROOT, 'app'), path.join(ROOT, 'public'), path.join(ROOT, 'components')]
const EXT = ['.tsx', '.txt', '.md']

/* The phrases that assert the absence of a subscription or the one-off nature of
   the purchase. Matched case-insensitively against rendered text only: a JSX
   comment explaining the problem is documentation, not a claim.

   🔴 WIDENED 2026-09-15, AND THE REASON IS THIS FILE'S OWN ARGUMENT TURNED ON
   ITSELF. The header above says a scope drawn around the known instances "can
   only ever confirm the search that produced it", and fixes that for the
   DIRECTORY SCOPE. The PHRASE LIST had exactly the same defect and nobody
   noticed, because both were derived from the same thirteen sentences: the four
   entries below the line were the four ways those thirteen happened to be
   worded. The check therefore reported GREEN over `/kits/page.tsx:201` —

       "Choose your kit. Pay once. Kit dispatched the same working day."

   — which is the plainest statement of the thing the auto-renew ruling made
   false, on the page that takes the money, in step 01 of how-it-works. Three
   more sat in buy-adjacent chips. Found by the independent pre-flight pass on
   2026-09-15 (Phase 4), not by this check.

   The lesson generalises past this file: when a check is corrected for
   overfitting along one axis, look for the SAME overfitting along every other
   axis of the same check, because they were almost certainly derived from the
   same sample. A widened scope searching for a narrow list is still a narrow
   search; it just looks thorough. */
const CLAIMS = [
  'no subscription',
  'one-off purchase',
  'one-off payment',
  'not a subscription',
  // Added 2026-09-15 — each of these was rendering on a live buy surface while
  // the check above reported clean.
  'pay once',        // app/(marketing)/kits/page.tsx:201, step 01
  'one-off test',    // components/commerce/BundleChoice.tsx:116, all 3 kit pages
  'all-in, one-off', // app/lp/energy-recovery:376, app/lp/hormone-recovery:536
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

/* 🔴 SENTENCES THAT LIVE IN MORE THAN ONE STORE, AND THE GREP THAT WILL NOT FIND
   THEM BOTH. ADDED 2026-09-13.

   CA-026 C1's paragraph is rendered on `/kits` AND published verbatim in
   `public/llms.txt`. A rewrite has to reach both, and **the obvious way to find
   them does not work**: in the JSX the sentence is wrapped across a newline
   between "no" and "surprise", so `grep "no surprise second test"` matches the
   .txt and silently misses the page. Checked 2026-09-13 — a single-line grep
   returns exactly one of the two stores.

   That is the repo's own "never let a patch anchor span a newline" rule biting
   from the other end: not a write that fails, but a SEARCH that succeeds and
   returns an incomplete answer, which is the more dangerous shape because it
   produces a confident partial sweep. `llms.txt` is the copy written for AI
   ingestion, so it is also the copy most likely to be quoted back at us, and it
   is the half a page-focused rewrite drops.

   Matched whitespace-tolerantly below so the check cannot inherit the defect it
   exists to warn about. Add an entry whenever a sentence is knowingly duplicated
   into a second store. */
const LINKED_COPY = [
  {
    label: 'CA-026 C1, the conflict-free paragraph',
    /* Whitespace-tolerant: \s+ spans the JSX line wrap. */
    pattern: /no\s+surprise\s+second\s+test/i,
    /* ⚠ CORRECTED 2026-09-13, same day. This note first read: "the clause to
       change sits INSIDE the conflict-free statement, whose GP half is the brand
       position, so rewriting it is a compliance pass on the whole sentence, not
       a clause swap." That OVERSTATED it, and in the expensive direction: it
       would have pulled Ewa back into a rewrite the 2026-09-11 ruling had already
       settled as business rather than clinical.

       Read against the approved C1 text rather than from memory, the paragraph is
       FOUR sentences. "no subscription unless you choose one" is the tail of the
       third. The GP-and-we-earn-nothing claim is the fourth, structurally
       independent, and can be left untouched. */
    note: [
      'ONE PARAGRAPH, FOUR SENTENCES. The clause to change is the tail of the',
      'third ("no subscription unless you choose one"). The GP-and-we-earn-',
      'nothing claim is the fourth and is separable, so it need not be reopened.',
      'Keep sentence four byte-identical and Ewa does not re-enter: the rewrite',
      'was ruled business rather than clinical on 2026-09-11.',
    ],
  },
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

// ⚠ THE GATE MUST SEE THE FLAG THE BUILD WILL SEE, and until 2026-09-14 it did
// not. `next build` loads `.env.local`; a plain `node` script does not. So a
// developer who set `MEMBERSHIP_ENABLED=true` in `.env.local` — which is how
// the file itself says to do it — got a green run here and a membership-enabled
// build, which is the precise pair this interlock exists to make impossible.
//
// dotenv does NOT override variables already present in the environment, which
// is also Next's precedence, so `MEMBERSHIP_ENABLED=false npm run build` still
// wins over the file. Same inputs, same answer, either way of setting it.
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })

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

/* 🔴 COUNT DISTINCT SENTENCES, NOT RAW MATCHES, AND SPLIT PAGES FROM THE REST.
   ADDED 2026-09-13.

   The loop above pushes once per CLAIM per line, so a line reading "One-off
   purchase. Includes lab fees & delivery. No subscription." matched twice and
   was printed twice. With `public/llms.txt` counted alongside the pages, the
   headline read **16** while `redesign-copy-register.md` row 46 and this file's
   own header both say **thirteen sentences across seven surfaces**.

   Both numbers were correct and they were describing different things: 16 raw
   matches, 14 distinct locations, 13 of them on 7 rendered pages plus one in
   llms.txt. Nobody had added a sentence. But a reader comparing 13 to 16 would
   reasonably conclude three had crept in, and go looking for copy that does not
   exist. **A count that cannot be reconciled with the register it is supposed to
   enforce sends the reader to hunt for a discrepancy rather than to fix the
   defect**, which is a worse failure than being silent, because it looks like
   information. */
const PAGE_SURFACE = (f) => f.startsWith('app/') && f.endsWith('.tsx')

const byLocation = new Map()
for (const c of found) {
  const key = `${c.file}:${c.line}`
  if (!byLocation.has(key)) byLocation.set(key, { ...c, claims: [] })
  byLocation.get(key).claims.push(c.claim)
}
const locations = [...byLocation.values()]
const pageHits = locations.filter((c) => PAGE_SURFACE(c.file))
const otherHits = locations.filter((c) => !PAGE_SURFACE(c.file))
const pageFiles = new Set(pageHits.map((c) => c.file)).size

console.log('\nSubscription claims vs the auto-renew ruling\n')
console.log(`  MEMBERSHIP_ENABLED = ${flagOn ? 'true' : 'unset/false'}`)
console.log(
  `  ${pageHits.length} sentence(s) on ${pageFiles} page(s)` +
    (otherHits.length ? `, plus ${otherHits.length} on ${new Set(otherHits.map((c) => c.file)).size} non-page surface(s)` : '') +
    `  [${found.length} raw matches, ${locations.length} distinct lines]\n`,
)

const byFile = new Map()
for (const c of locations) {
  if (!byFile.has(c.file)) byFile.set(c.file, [])
  byFile.get(c.file).push(c)
}
for (const [file, cs] of [...byFile.entries()].sort()) {
  console.log(`  ${file}${PAGE_SURFACE(file) ? '' : '   (not a rendered page)'}`)
  for (const c of cs.sort((a, b) => a.line - b.line)) {
    const tag = c.claims.length > 1 ? `  [matches: ${[...new Set(c.claims)].join(', ')}]` : ''
    console.log(`    :${c.line}  ${c.text}${tag}`)
  }
}

/* THE MULTI-STORE REPORT. Not a pass/fail of its own: it exists so the person
   doing the rewrite is told, at the moment they are looking at the list, that one
   of these sentences lives somewhere a grep will not find it. */
for (const linked of LINKED_COPY) {
  const stores = files.filter((f) => linked.pattern.test(read(f))).map(rel).sort()
  if (stores.length > 1) {
    console.log(`\n  ⚠ ONE SENTENCE, ${stores.length} STORES: ${linked.label}`)
    for (const s of stores) console.log(`      ${s}`)
    console.log(`      A rewrite must reach all ${stores.length}. A single-line grep will NOT find`)
    console.log('      them all: the JSX wraps the phrase across a newline.')
    for (const line of linked.note ?? []) console.log(`      ${line}`)
  } else if (stores.length === 1) {
    console.log(`\n  ok  ${linked.label} now appears in one store only (${stores[0]}).`)
  }
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
  FAIL MEMBERSHIP_ENABLED is TRUE and ${pageHits.length} sentence(s) on ${pageFiles} page(s)${otherHits.length ? ` and ${otherHits.length} elsewhere` : ''} still tell a
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

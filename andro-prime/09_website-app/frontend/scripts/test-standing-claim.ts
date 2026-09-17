// Unit tests for CA-026 A1, the standing claim, behind the MEMBERSHIP_ENABLED
// interlock (lib/membership/subscriptionCopy.ts). Register row 42b, defect H2b.
// Same runner-free style as the other suites: assert loudly, exit non-zero on
// any failure. Run with `npm test` or `npx tsx scripts/test-standing-claim.ts`.
//
// ── WHY THE FIXTURES COME FROM OTHER FILES, NOT FROM THIS ONE ──────────────
// 🔴 A SUITE DRAWN FROM THE IMPLEMENTER'S MODEL CANNOT FIND AN ERROR IN THAT
// MODEL. Both ends of this deletion already exist in the repo, written by
// someone else under the same rulings, so neither end is typed here:
//
//   - the flag-OFF string must equal **A1 as the approved wording pack states
//     it**, `02_brand/2026-07-22-conflict-free-wording-pack.md`. That file is
//     the signed artefact; a literal in this test would only assert that two
//     copies I typed agree with each other.
//   - the flag-ON string must equal **the paragraph `public/llms.txt` already
//     serves**, which took the identical cut on 2026-09-17 because a static
//     file cannot read a flag. If the two ever diverge, one of the two stores
//     is publishing a formulation the other has retired, which is exactly the
//     defect H2 found and H2b inherited.
//
// ── WHAT IT IS ACTUALLY GUARDING ───────────────────────────────────────────
// H2b was not a wording problem. The paragraph lived as a LITERAL in four page
// stores plus a static file, and `verify-subscription-claims.js` could not see
// any of them because its CLAIMS list greps for "no subscription", "one-off"
// and "pay once" and A1 says it as "one price". With that entry missing the
// gate printed "0 sentence(s) on 0 page(s)" and the verdict "the copy sweep is
// done". Case 7 below is the one that stops it coming back: it asserts the
// literal is absent from all four pages, so a future re-import fails here even
// if someone reverts the CLAIMS entry.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { subscriptionCopy } from '../lib/membership/subscriptionCopy'
import { MEMBERSHIP_FIRST_CHARGE_DAY } from '../lib/membership/disclosure'

let failures = 0
let checks = 0

function eq(label: string, actual: unknown, expected: unknown) {
  checks++
  if (actual !== expected) {
    failures++
    console.error(`  ✗ ${label}\n      expected: ${JSON.stringify(expected)}\n      actual:   ${JSON.stringify(actual)}`)
  } else {
    console.log(`  ✓ ${label}`)
  }
}

function ok(label: string, condition: boolean, detail = '') {
  checks++
  if (!condition) {
    failures++
    console.error(`  ✗ ${label}${detail ? `\n      ${detail}` : ''}`)
  } else {
    console.log(`  ✓ ${label}`)
  }
}

const ROOT = join(__dirname, '..')
const off = subscriptionCopy(false)
const on = subscriptionCopy(true)

/**
 * 🔴 SCAN THE COPY, NOT THE APPARATUS. Cases 7 and 8 both failed on their first
 * run against comments written in the SAME change — the `/about` block comment
 * explaining which sentence was removed quotes that sentence, and the homepage
 * metadata note quotes "One price, nothing hidden." twice. Neither renders.
 *
 * This repo has already paid for that lesson once: `dump-subscription-copy.ts`
 * exists because "the scanner matches strings without modelling their speech
 * act, so a blended scan of the module measures its comment block rather than
 * its copy." A source file that documents a retired claim is the NORMAL state
 * of a file that retired one, so a grep over raw source cannot tell a claim
 * from a record of having removed it, and would push the next author to delete
 * the explanation to get the suite green.
 *
 * ⚠ Deliberately does not strip trailing `//` comments, only whole-line ones:
 * stripping mid-line would eat the `//` of any URL in the file. Good enough for
 * a claim scan, and the narrower rule cannot silently hide a string literal.
 */
function strippedSource(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/^[ \t]*\/\/.*$/gm, ' ')
}

// ── 1. The approved source ─────────────────────────────────────────────────
// A1 sits in the wording pack as a blockquote under its own bold heading.
console.log('\n1 · Flag OFF is CA-026 A1 exactly as the approved pack states it')
const pack = readFileSync(
  join(ROOT, '..', '..', '02_brand', '2026-07-22-conflict-free-wording-pack.md'),
  'utf8',
)
const packLines = pack.split(/\r?\n/)
const a1Index = packLines.findIndex((l) => l.includes('**A1 (recommended, plain):**'))
ok('the pack still carries an A1 heading', a1Index !== -1, 'wording pack structure changed')
const a1Quote = packLines.slice(a1Index + 1).find((l) => l.trim().startsWith('> '))
ok('A1 has a blockquote under it', Boolean(a1Quote))
const APPROVED_A1 = (a1Quote ?? '').trim().replace(/^>\s*/, '')
eq('flag-off standingClaim === approved A1, byte for byte', off.standingClaim, APPROVED_A1)

// ── 2. The other store that already took this cut ──────────────────────────
console.log('\n2 · Flag ON is what public/llms.txt already serves')
const llms = readFileSync(join(ROOT, 'public', 'llms.txt'), 'utf8')
const llmsClaim = llms
  .split(/\r?\n/)
  .map((l) => l.trim())
  .find((l) => l.startsWith('Testing and selling are kept apart'))
ok('llms.txt still carries the standing claim', Boolean(llmsClaim))
eq('flag-on standingClaim === the llms.txt paragraph, byte for byte', on.standingClaim, llmsClaim)

// ── 3. It is a DELETION, not a rewrite ─────────────────────────────────────
console.log('\n3 · The difference between the two states is one whole sentence, removed')
const DEAD_SENTENCE = ' You pay one price for the test.'
ok('flag-off contains the sentence', off.standingClaim.includes(DEAD_SENTENCE))
ok('flag-on does not', !on.standingClaim.includes(DEAD_SENTENCE))
eq(
  'flag-on is flag-off minus exactly that sentence, nothing else moved',
  off.standingClaim.replace(DEAD_SENTENCE, ''),
  on.standingClaim,
)
ok(
  'flag-on asserts no single price in any casing',
  !/one\s+price/i.test(on.standingClaim),
  on.standingClaim,
)

// ── 4. Ewa's sentence is untouched, which is why she does not re-enter ──────
console.log("\n4 · The conflict-free GP sentence is byte-identical in both states")
const GP = 'Any result that needs a doctor, low testosterone included, goes to a GP, and those results earn us nothing.'
ok('flag-off ends on the GP sentence', off.standingClaim.endsWith(GP))
ok('flag-on ends on the GP sentence', on.standingClaim.endsWith(GP))
eq(
  'and it is the same sentence in both, character for character',
  off.standingClaim.slice(off.standingClaim.length - GP.length),
  on.standingClaim.slice(on.standingClaim.length - GP.length),
)

// ── 5. The /about chip ─────────────────────────────────────────────────────
console.log('\n5 · The /about spec chip')
eq('flag-off label is what shipped', off.aboutFactLabel, 'One price')
eq('flag-off sub is what shipped', off.aboutFactSub, 'For the test, and nothing after it')
ok('flag-on label asserts no single price', !/one\s+price/i.test(on.aboutFactLabel))
ok('flag-on sub asserts no single price', !/one\s+price/i.test(on.aboutFactSub))
// The flag-on pair introduces NO new word: it is C1's flag-on heading with the
// full stops dropped to match the chip row's convention. If someone rewords the
// heading, this fails and the chip has to be re-decided rather than drift.
eq('flag-on label is c1Heading[0] without its full stop', on.aboutFactLabel + '.', on.c1Heading[0])
eq('flag-on sub is c1Heading[1] without its full stop', on.aboutFactSub + '.', on.c1Heading[1])

// ── 6. Nothing in the flag-off payload changed ─────────────────────────────
console.log('\n6 · The flag-off payload is still the approved one everywhere else')
ok('flag-off c1 heading unchanged', off.c1Heading[0] === 'One price.' && off.c1Heading[1] === 'Nothing hidden.')
ok('flag-off kit footnote unchanged', off.kitFootnote === 'One-off purchase. Results in your personal dashboard. No GP needed.')

// ── 7. THE ANTI-RE-IMPORT CASE ─────────────────────────────────────────────
// This is the one that matters. H2b existed because the paragraph was a literal
// in four files and a page-only sweep re-imports it from the pack.
console.log('\n7 · No page carries the claim as a literal any more')
const PAGES = [
  'app/(marketing)/about/page.tsx',
  'app/(marketing)/how-it-works/page.tsx',
  'app/lp/collagen/page.tsx',
  'app/lp/daily-stack/page.tsx',
]
for (const rel of PAGES) {
  const src = strippedSource(rel)
  // Whitespace-tolerant: how-it-works wrapped the sentence across three JSX
  // lines, which is the exact reason a single-line grep missed it.
  ok(`${rel} states no single price`, !/you\s+pay\s+one\s+price/i.test(src), 'the literal is back')
  ok(`${rel} renders it from the module`, src.includes('copy.standingClaim'))
}

// ── 8. The share cards ─────────────────────────────────────────────────────
console.log('\n8 · Homepage metadata carries no single-price claim')
const home = strippedSource('app/(marketing)/page.tsx')
const metaStart = home.indexOf('export const metadata')
const metaBlock = home.slice(metaStart, home.indexOf('\n}', metaStart))
ok('no "one price" in title/description/openGraph/twitter', !/one\s+price/i.test(metaBlock), metaBlock.slice(0, 300))

// ── 9. THE EXEMPTION'S JUSTIFICATION, NOT JUST THE EXEMPTION ─────────────────
// 🔴 AN EXEMPTION IS A CLAIM ABOUT A LINE, AND NOTHING WAS CHECKING THE LINE.
// CA-051 item J-3: `verify-subscription-claims.js` now exempts "one price" on
// `/lp/hormone-recovery`, because there it means Kit 3 against Kit 1 plus Kit 2
// rather than payments over time. That reasoning is true of the CURRENT sentence
// and of nothing else. Without this case, rewriting that heading into a real
// single-price claim would inherit an exemption granted for a different sentence,
// and the gate would report clean over it — an exemption that widens silently is
// worse than no exemption, because it looks like a decision someone took.
//
// So the exemption is guarded by its own evidence: the heading AND the paragraph
// that prices the comparison. Change either and this fails, which forces the
// exemption to be re-argued rather than quietly inherited.
console.log('\n9 · The J-3 exemption still describes the line it was granted for')
const hormoneLp = strippedSource('app/lp/hormone-recovery/page.tsx')
ok(
  'the heading is still the two-kits comparison',
  /One test instead of two\.[\s\S]{0,80}One price instead of two\./.test(hormoneLp),
  'the heading changed: re-argue the CLAIMS_ALLOW entry for this file',
)
ok(
  'and the paragraph under it still prices that comparison',
  /those two kits cost\s*&pound;218/.test(hormoneLp) && /nine markers for\s*&pound;179/.test(hormoneLp),
  'the pricing paragraph changed: the exemption rested on it',
)

// ── 10. H-A: A CHARGE DATE MAY NOT BE STATED WITHOUT ITS STARTING POINT ───
// 🔴 THIS IS THE RULE H-A BROKE, AND IT BROKE BECAUSE IT WAS ONLY PROSE.
// CA-052. The independent pre-flight found `On day 31 that card is charged GBP
// 47 a month` sitting in a paragraph anchored on *today*, while day 1 is the day
// the RESULT lands. The homepage sentence in the very same payload already said
// it correctly. So the rule was known, written down, and obeyed by one surface
// out of four — and nothing could tell the difference, which is the whole
// argument for asserting it instead of restating it.
//
// The test is over the WHOLE flag-on payload rather than a list of fields, so a
// new sentence that names the charge day inherits the rule automatically. That
// is the same reason `dump-subscription-copy.ts` walks the object instead of
// enumerating it.
console.log('\n10 · No flag-on string names the charge day without the starting point')
const ANCHOR = 'It starts when your first result lands'
const chargeDayMentions: string[] = []
for (const value of Object.values(on) as unknown[]) {
  for (const str of (Array.isArray(value) ? value : [value]) as unknown[]) {
    if (typeof str === 'string' && str.includes(`day ${MEMBERSHIP_FIRST_CHARGE_DAY}`)) {
      chargeDayMentions.push(str)
    }
  }
}
ok(
  `the payload states the charge day somewhere (found ${chargeDayMentions.length})`,
  chargeDayMentions.length > 0,
  'nothing mentions the charge day: this test would pass vacuously',
)
for (const str of chargeDayMentions) {
  ok(
    `anchored: "${str.slice(0, 46)}…"`,
    str.includes(ANCHOR),
    'states the charge day with no starting point — this is defect H-A',
  )
}

// ── 10b. ONE FACT, ONE WORDING ─ the F4 rule, mechanised ───────────────
// Keith ruled F4 on 2026-09-17 because one fact was rendering in two
// vocabularies within a screen. C1 used to say "that card is charged" where the
// homepage said "it becomes". Both are true; having both is the defect.
//
// ⚠ THE FIRST VERSION OF THIS CASE WENT VACUOUS UNDER EXACTLY THE CONDITION IT
// EXISTS FOR, and it was caught by mutation-testing rather than by reading it.
// It derived the reference clause from `chargeDayMentions[0]` and compared the
// others against it. Revert the FIRST surface to the un-anchored wording and
// `indexOf(ANCHOR)` returns -1, `slice(-1)` yields one character, and every
// string contains one character — so all four assertions passed while the
// defect was present. **A check that reads its own expected value out of the
// data it is checking cannot fail when the data is wrong in the first row.**
// It now derives nothing: it requires every mention to yield a clause, and
// requires the set of clauses to have exactly one member.
const CANCEL = 'Cancel anytime.'
const clauses = chargeDayMentions
  .filter((str) => str.includes(ANCHOR) && str.includes(CANCEL))
  .map((str) => str.slice(str.indexOf(ANCHOR), str.indexOf(CANCEL) + CANCEL.length))
console.log('\n10b · Every surface states it in the SAME wording')
ok(
  `every charge-day mention yielded a clause (${clauses.length} of ${chargeDayMentions.length})`,
  clauses.length === chargeDayMentions.length && clauses.length > 0,
  'a mention states the charge day without the anchored clause',
)
ok(
  `and they are all the same one (${new Set(clauses).size} distinct)`,
  new Set(clauses).size === 1,
  'a second vocabulary for the renewal fact — this is what F4 ruled against:\n      '
    + [...new Set(clauses)].join('\n      '),
)

// ── 10c. THE ANCHOR WORDING IS ATTESTED, NOT INVENTED ────────────────
// Same discipline as cases 1 and 2: the phrase is read out of the approved
// draft rather than typed here. ⚠ Only the ANCHOR is asserted, not the whole
// sentence: F4 later replaced that draft's cancel clause ("unless you stop it")
// and the draft writes GBP rather than the symbol, so a whole-string comparison
// would be asserting against a superseded artefact. The scope of the fixture is
// the scope of what the draft still governs.
console.log('\n10c · The anchor phrase comes from the approved draft, not from this test')
const draft = readFileSync(join(ROOT, '..', '2026-09-11-subscription-copy-rewrite-draft.md'), 'utf8')
ok('the 2026-09-11 draft still carries the anchor phrase', draft.includes(ANCHOR),
   'the draft changed: re-derive the wording rather than keeping this literal')

console.log(`\n${checks - failures}/${checks} assertions passed`)
if (failures > 0) {
  console.error(`\n${failures} FAILED`)
  process.exit(1)
}
console.log('standing-claim interlock ok')

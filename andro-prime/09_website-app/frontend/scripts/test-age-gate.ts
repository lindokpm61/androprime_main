/**
 * The 18+ eligibility gate, driven over a table.
 *
 *   npx tsx scripts/test-age-gate.ts
 *
 * WHY THIS EXISTS. Andro Prime is 18+ only and the fact is collected at three
 * points. On 2026-09-08 the auth frame found it ENFORCED at two of them and
 * optional at `/auth/signup`, and Keith ruled it closed. Before that ruling
 * NOTHING in `npm test` touched the rule at all: `lib/auth/actions.ts` had no
 * test importing it, so the one place the gate did exist was unverified and the
 * one place it did not was undetected. An eligibility rule with compliance weight
 * should not be in that state.
 *
 * Same shape as `test-host-routing.ts` and `test-quiz-wtp.ts`: the rule lives in
 * a pure module so it can be driven directly, rather than being welded to a
 * server action that redirects and talks to Supabase.
 *
 * MUTATION-TESTED 2026-09-08, four mutations, three killed:
 *   floor 18 -> 13 ................. killed
 *   under-age branch removed ....... killed
 *   refusal sentence reworded ...... killed
 *   blank-input guard removed ...... SURVIVED, and it is an EQUIVALENT MUTANT
 *
 * ⚠ That survivor is not a hole in this file, and it is recorded so nobody
 * "fixes" it. `Number('')` is 0, not NaN, and `Number(null ?? '')` is 0 too, so
 * every blank and whitespace input falls through to the `< MIN_AGE` branch and is
 * refused there anyway. Removing the early return changes no observable
 * behaviour, so no test can distinguish it. The guard stays because
 * `if (!trimmed)` states the intent, where relying on `Number('') === 0` is a
 * coincidence the next reader has to rediscover.
 */

import { MIN_AGE, UNDER_AGE_ERROR, parseEligibleAge } from '../lib/auth/eligibility'

let pass = 0
let fail = 0

function eq(desc: string, got: unknown, want: unknown) {
  if (JSON.stringify(got) === JSON.stringify(want)) {
    pass++
  } else {
    fail++
    console.error(`  FAIL ${desc}\n       want ${JSON.stringify(want)}, got ${JSON.stringify(got)}`)
  }
}

console.log('\nThe 18+ gate: what it refuses\n')

/* REFUSED. Each of these is a way the field can arrive without a usable age, and
   every one of them must be a refusal rather than a stored null: storing null is
   what signup did before the ruling. */
for (const raw of [
  undefined,
  null,
  '',
  '   ',
  'abc',
  'eighteen',
  '17',
  '17.99',
  '0',
  '-1',
  '-20',
  'NaN',
]) {
  eq(`refuses ${JSON.stringify(raw)}`, parseEligibleAge(raw), null)
}

console.log('\nThe 18+ gate: what it admits\n')

/* ADMITTED, and the returned value is what gets WRITTEN, so these assert the
   value and not just the pass. */
eq('admits the boundary, exactly 18', parseEligibleAge('18'), 18)
eq('admits 19', parseEligibleAge('19'), 19)
eq('admits 45', parseEligibleAge('45'), 45)
eq('trims surrounding space', parseEligibleAge('  42  '), 42)

/* ⚠ KNOWN-LOOSE, PINNED DELIBERATELY. These pass, because `Number()` accepts them
   and the shipped `consentAction` has always accepted them. Neither is an
   eligibility failure, so tightening them would be a behaviour change riding in
   on a ruling that did not ask for one. Pinned so the next reader knows they were
   considered rather than missed, and so tightening them later is a visible,
   deliberate edit to this file. */
eq('KNOWN-LOOSE: a fractional age passes', parseEligibleAge('18.5'), 18.5)
eq('KNOWN-LOOSE: exponent notation passes', parseEligibleAge('1e3'), 1000)
eq('KNOWN-LOOSE: an implausible age passes', parseEligibleAge('200'), 200)

console.log('\nThe shared constants\n')

eq('the floor is 18', MIN_AGE, 18)
/* The refusal is shared so the two entry points cannot drift into two sentences
   for one rule. This pins the exact string a customer sees. */
eq('one refusal sentence', UNDER_AGE_ERROR, 'You must be 18 or over to use Andro Prime.')

/* THE REGRESSION THIS FILE WAS WRITTEN FOR. Both entry points must reach the gate
   through this module rather than re-implementing it, which is how the asymmetry
   arose in the first place. Read off the source, because a copy that agrees today
   is invisible until the day it does not. */
console.log('\nBoth entry points use the shared gate\n')
{
  const fs = require('fs') as typeof import('fs')
  const path = require('path') as typeof import('path')
  const src = fs.readFileSync(path.join(__dirname, '..', 'lib', 'auth', 'actions.ts'), 'utf8')
  const uses = (src.match(/parseEligibleAge\(/g) || []).length
  eq('signupAction and consentAction both call parseEligibleAge', uses, 2)
  eq('no inline age comparison survives in the actions', /age\s*<\s*18/.test(src), false)
  eq('no second copy of the refusal sentence', (src.match(/You must be 18 or over/g) || []).length, 0)
}

console.log(`\ntest-age-gate: ${pass} passed, ${fail} failed`)
if (fail > 0) process.exit(1)

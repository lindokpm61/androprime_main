// Regression tests for the test-selector scoring map (getResult in
// components/marketing/TestSelectorQuiz.tsx). Same runner-free style as the
// other suites: assert loudly, exit non-zero on any failure. Run with
// `npm test` or `npx tsx scripts/test-quiz-routing.ts`.
//
// WHY THIS EXISTS. The map is compliance-relevant and had no coverage at all.
// CA-025 is a hard rule: Kit 1 measures testosterone only and must never be
// offered as the answer to general tiredness or brain fog. Until 2026-08-12 the
// quiz broke that rule through a path nobody had asserted against. Q1 option (a)
// read "I am knackered, my drive has gone, or I just do not feel like myself
// anymore", which is two presentations in one option, so a reader arriving from
// the brain fog, B12 or tiredness carousels picked it, answered desk-based on
// Q2, and was routed to a testosterone-only kit. The 30-day run points at this
// quiz from close A on ten posts, so the path was about to carry real traffic.
//
// The rule under test is therefore not "the map returns what it returned
// yesterday". It is: NO combination of answers that presents fatigue or
// cognitive symptoms without a hormonal complaint may return Kit 1.

import { getResult } from '../components/marketing/TestSelectorQuiz'

let failures = 0
let passes = 0
function check(label: string, condition: boolean): void {
  if (condition) {
    passes += 1
  } else {
    failures += 1
    console.error(`FAIL  ${label}`)
  }
}

const Q2 = ['a', 'b'] // a = trains hard, b = desk-based
const Q3 = ['a', 'b', 'c'] // a = never tested, b = prior low/borderline T, c = general bloods only

/* ---------------------------------------------------------- the hard rule --- */

// q1 = 'd' is the fatigue / brain fog presentation. Kit 1 is testosterone only,
// so it is never a permitted answer here, whatever else the reader says.
for (const q2 of Q2) {
  for (const q3 of Q3) {
    const r = getResult('d', q2, q3)
    check(`CA-025: fatigue presentation (d,${q2},${q3}) must not return Kit 1, got ${r.kit}`, r.kit !== 'kit1')
    check(`fatigue presentation (d,${q2},${q3}) routes to Kit 2, got ${r.kit}`, r.kit === 'kit2')
  }
}

// Kit 2 is the kit whose markers actually answer that presentation. Assert the
// marker copy too, so a future edit that renames the kit but leaves the routing
// cannot silently make the reason line wrong.
const fatigue = getResult('d', 'b', 'a')
check('fatigue result names the Kit 2 markers', /Vitamin D, Active B12, hs-CRP, and Ferritin/.test(fatigue.reason))
check('fatigue result links to the Kit 2 page', fatigue.href === '/kits/energy-recovery')

// The same guard for Kit 1, which is the one that failed: on 2026-08-29 this
// reason line named three of the five markers and had omitted FAI and Albumin
// since they joined the panel. The marker copy now comes from lib/kits/panel.ts;
// assert the whole panel appears so a change there cannot understate the kit.
const hormonal = getResult('a', 'b', 'a')
check(
  'hormonal result names all five Kit 1 markers',
  /Total Testosterone, SHBG, Free Androgen Index, Albumin, and Free Testosterone/.test(hormonal.reason),
)

/* ------------------------------------------- the approved map, unchanged --- */

// Splitting option (a) must not have moved anyone else. These are the outcomes
// approved 2026-05-18 and updated 2026-05-26.
check('hormonal + trains hard → Kit 3', getResult('a', 'a', 'a').kit === 'kit3')
check('hormonal + desk-based → Kit 1', getResult('a', 'b', 'a').kit === 'kit1')
check('recovery + prior low/borderline T → Kit 3', getResult('b', 'a', 'b').kit === 'kit3')
check('recovery + no prior low T → Kit 2', getResult('b', 'a', 'a').kit === 'kit2')
check('no specific complaint → Kit 1', getResult('c', 'a', 'a').kit === 'kit1')
check('no specific complaint, any Q3 → Kit 1', getResult('c', 'b', 'c').kit === 'kit1')

// Fallback must never be the dearest kit.
check('unknown q1 falls back off Kit 3', getResult('z', 'a', 'a').kit !== 'kit3')

/* ----------------------------------------------------------------- total --- */

console.log(`\n${passes} passed, ${failures} failed`)
if (failures > 0) process.exit(1)

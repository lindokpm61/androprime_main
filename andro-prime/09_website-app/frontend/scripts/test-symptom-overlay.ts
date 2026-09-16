// The symptom overlay (lib/results/symptomOverlay.ts), CA-048 + CA-049 Q5.
// Same runner-free style as the other suites: assert loudly, exit non-zero on
// any failure. Run with `npm test` or `npx tsx scripts/test-symptom-overlay.ts`.
//
// 🔴 SECTION (1) READS THE APPROVED ARTEFACT OFF DISK AND DIFFS EVERY SIGNED
// STRING AGAINST IT. That is the point: a test that restates the copy in its
// own source asserts only that two copies of my typing agree. The authority
// here is an external document with two signatures on it, so the document is
// the comparator.
//
// ⚠ WHAT IS NORMALISED, stated because a normalisation is exactly the class of
// difference the check can no longer see: line wrapping and the soft/straight
// apostrophe, nothing else. Punctuation, capitalisation, ordering and every
// word are compared as-is. The apostrophe is normalised because the artefact
// and the module may legitimately differ there; a mismatch found that way once
// already.
//
// Covers:
//   (1) every signed string, verbatim against the approved artefact
//   (2) the trigger: it fires for nobody unless BOTH conditions hold
//   (3) one closing paragraph per kit, and Kit 3 is not a variant of the others
//   (4) the two rulings a later pass will be tempted to reverse
//   (5) the CA-014 boundary: this screen offers nothing to buy

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  CLOSING_BY_KIT,
  CONNECTIVE,
  EMERGENCY_BODY_AFTER_CITATION,
  EMERGENCY_BODY_BEFORE_CITATION,
  EMERGENCY_CITATION_TEXT,
  EMERGENCY_HEADING,
  GP_LEAD_IN,
  GP_RED_FLAG_LIST,
  NHS_CHEST_PAIN_URL,
  OVERLAY_ALERT_TITLE,
  STILL_UNWELL_QUESTION_KEY,
  allMarkersInRange,
  symptomOverlayFor,
} from '../lib/results/symptomOverlay'
import type { KitType, ResultState } from '../lib/results/types'

let failures = 0
let passes = 0
function check(label: string, condition: boolean): void {
  if (condition) {
    passes += 1
  } else {
    failures += 1
    console.error(`[FAIL] ${label}`)
  }
}

const norm = (t: string) => t.replace(/’/g, "'").replace(/\s+/g, ' ').trim()

// ───────────────────────────────────────────────────────────────────────────
// (1) EVERY SIGNED STRING, AGAINST THE APPROVED ARTEFACT
// ───────────────────────────────────────────────────────────────────────────

const ARTEFACT = join(
  __dirname,
  '..',
  '..',
  '..',
  '04_products',
  'results-engine',
  '2026-09-16-symptom-overlay-screen-copy.md',
)
const approved = norm(readFileSync(ARTEFACT, 'utf8'))

check('(1a) the approved artefact was found and is not empty', approved.length > 2000)

const signed: Array<[string, string]> = [
  ['the emergency heading', EMERGENCY_HEADING],
  ['the emergency body, up to the citation', EMERGENCY_BODY_BEFORE_CITATION],
  ['the GP lead-in (CA-048 Q2 = B)', GP_LEAD_IN],
  ['the red-flag list (CA-047 r1 Q5 = A)', GP_RED_FLAG_LIST],
  ['the connective (CA-048 Q3 = A)', CONNECTIVE],
  ['the Kit 1 closing (r2 Q7 = A)', CLOSING_BY_KIT.testosterone],
  ['the Kit 2 closing (r2 Q7 = A)', CLOSING_BY_KIT['energy-recovery']],
  ['the Kit 3 closing (CA-048 Q4 = A)', CLOSING_BY_KIT['hormone-recovery']],
]

for (const [label, text] of signed) {
  check(`(1b) ${label} appears verbatim in the approved artefact`, approved.includes(norm(text)))
}

check('(1c) the citation text is the article’s link text', EMERGENCY_CITATION_TEXT === 'Chest pain')
check('(1d) the citation points at the NHS page the article links to',
  NHS_CHEST_PAIN_URL === 'https://www.nhs.uk/conditions/chest-pain/')
check('(1e) the emergency body closes the parenthesis the citation opened',
  EMERGENCY_BODY_BEFORE_CITATION.trimEnd().endsWith('(NHS,')
    && EMERGENCY_BODY_AFTER_CITATION === ').')
check('(1f) the container title is the one the article uses (CA-049 Q5 = A)',
  OVERLAY_ALERT_TITLE === 'When to see your GP, not us')

// House rule: no em dash in customer-facing copy.
const allCopy = [...signed.map(([, t]) => t), EMERGENCY_BODY_AFTER_CITATION, OVERLAY_ALERT_TITLE]
check('(1g) no em dash anywhere in the copy', allCopy.every((t) => !t.includes('—')))

// ───────────────────────────────────────────────────────────────────────────
// (2) THE TRIGGER
//
// 🔴 BOTH CONDITIONS, ALWAYS. A result that is merely all-clear must not show
// this screen: it is for a man who has SAID he still feels wrong. And a man who
// says so on a flagged result already has that card's own treatment, which is
// not this.
// ───────────────────────────────────────────────────────────────────────────

const UNWELL = [{ questionKey: STILL_UNWELL_QUESTION_KEY, answer: true }]
const ALL_CLEAR: ResultState[] = ['optimal-testosterone', 'shbg-normal', 'ft-normal']

check('(2a) all-clear AND still unwell renders the overlay',
  symptomOverlayFor({ kitType: 'testosterone', states: ALL_CLEAR, symptomAnswers: UNWELL }) !== null)
check('(2b) all-clear and NOT still unwell renders nothing',
  symptomOverlayFor({ kitType: 'testosterone', states: ALL_CLEAR, symptomAnswers: [] }) === null)
check('(2c) an explicit "no" renders nothing',
  symptomOverlayFor({
    kitType: 'testosterone',
    states: ALL_CLEAR,
    symptomAnswers: [{ questionKey: STILL_UNWELL_QUESTION_KEY, answer: false }],
  }) === null)
check('(2d) a flagged marker renders nothing, even when he says he is unwell',
  symptomOverlayFor({
    kitType: 'testosterone',
    states: [...ALL_CLEAR, 'shbg-low'],
    symptomAnswers: UNWELL,
  }) === null)
check('(2e) a GP-routed marker renders nothing, even when he says he is unwell',
  symptomOverlayFor({
    kitType: 'testosterone',
    states: [...ALL_CLEAR, 'high-crp'],
    symptomAnswers: UNWELL,
  }) === null)
check('(2f) an empty panel renders nothing rather than an all-clear by vacuous truth',
  symptomOverlayFor({ kitType: 'testosterone', states: [], symptomAnswers: UNWELL }) === null)

// ⚠ `fai-reported` is IN RANGE for this purpose and the distinction is
// deliberate: we draw no conclusion from that number, so it cannot be the thing
// that is wrong with him. If this ever flips, the overlay silently stops
// reaching every Kit 1 and Kit 3 man, because FAI is on both panels.
check('(2g) a report-only marker does not block the overlay',
  allMarkersInRange([...ALL_CLEAR, 'fai-reported']))

// ───────────────────────────────────────────────────────────────────────────
// (3) ONE CLOSING PER KIT, AND KIT 3 IS NOT A VARIANT
// ───────────────────────────────────────────────────────────────────────────

const KITS: KitType[] = ['testosterone', 'energy-recovery', 'hormone-recovery']
for (const kit of KITS) {
  const copy = symptomOverlayFor({ kitType: kit, states: ALL_CLEAR, symptomAnswers: UNWELL })
  check(`(3a) ${kit} gets its own closing paragraph`, copy?.closing === CLOSING_BY_KIT[kit])
}
check('(3b) the three closings are all different',
  new Set(Object.values(CLOSING_BY_KIT)).size === 3)

// 🔴 THE KIT 3 DEFECT, AS AN ASSERTION. Kit 3 measures all nine markers, so
// offering it either of the other two panels offers a man something he has just
// bought. An earlier draft of the artefact scoped both composites to Kit 3 and
// this is what would have caught it.
const kit3 = CLOSING_BY_KIT['hormone-recovery']
check('(3c) the Kit 3 closing does not point at the energy panel', !kit3.includes('Active B12'))
check('(3d) the Kit 3 closing does not point at testosterone as a next test',
  !kit3.includes('testosterone is the next'))
check('(3e) the Kit 3 closing routes to the GP', kit3.includes('taking to your GP'))
check('(3f) and tells him there is nothing left to sell him',
  kit3.includes('nothing further we can test for you here'))

// ───────────────────────────────────────────────────────────────────────────
// (4) THE TWO RULINGS A LATER PASS WILL BE TEMPTED TO REVERSE
//
// Neither of these is arithmetic. They exist so that a plausible-looking
// "improvement" is a failing build rather than a silent reversal of a clinical
// ruling. Both were put to Ewa with the counter-argument stated, and both came
// back against the reviewer's recommendation.
// ───────────────────────────────────────────────────────────────────────────

check('(4a) CA-048 Q2 = B: the lead-in carries NO "Otherwise,"',
  !/otherwise/i.test(GP_LEAD_IN))
check('(4b) and it is the sentence she chose, not the one that was recommended',
  GP_LEAD_IN === 'See your GP now, rather than testing again, if any of these apply:')

// CA-049 Q3 = B: a man acting on a finding is told his GP decides the timing.
// No closing paragraph may state an interval as our recommendation.
for (const kit of KITS) {
  const c = CLOSING_BY_KIT[kit]
  check(`(4c) the ${kit} closing states no retest interval`,
    !/\b\d+\s*(?:to\s*\d+\s*)?months?\b/i.test(c) && !/\b\d+\s*weeks?\b/i.test(c))
}

// ───────────────────────────────────────────────────────────────────────────
// (5) THE CA-014 BOUNDARY: THIS SCREEN SELLS NOTHING
//
// The overlay renders on an all-clear result, so CA-014 does not bind it. That
// is exactly why it is asserted: the rule that would have stopped a purchase
// link here does not apply, so nothing else is watching.
// ───────────────────────────────────────────────────────────────────────────

const copy = symptomOverlayFor({
  kitType: 'testosterone',
  states: ALL_CLEAR,
  symptomAnswers: UNWELL,
})!
const rendered = [
  copy.emergencyHeading, copy.emergencyBodyBeforeCitation, copy.gpLeadIn,
  copy.gpRedFlagList, copy.connective, copy.closing,
].join(' ')

check('(5a) no price appears anywhere on the screen', !/£\d/.test(rendered))
check('(5b) the only link is the NHS citation', copy.citationHref === NHS_CHEST_PAIN_URL)
check('(5c) and nothing points at a kit route', !/\/kits?\b/.test(rendered))

// ───────────────────────────────────────────────────────────────────────────

console.log('')
console.log(`  ${signed.length} signed strings diffed against the approved artefact.`)
console.log('  Trigger requires BOTH all-clear and a recorded symptom; nothing writes that today.')
console.log('')
console.log(`test-symptom-overlay: ${passes} passed, ${failures} failed`)
if (failures > 0) process.exit(1)

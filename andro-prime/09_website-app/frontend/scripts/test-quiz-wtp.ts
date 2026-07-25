// Unit tests for the Van Westendorp WTP block's pure logic (lib/quiz/wtp.ts).
// Same runner-free style as the other suites: assert loudly, exit non-zero on
// any failure. Run with `npm test` or `npx tsx scripts/test-quiz-wtp.ts`.
//
// Covers:
//   (1) parsePrice: symbol/comma/whitespace stripping, bounds, penny rounding.
//   (2) parseWtpAnswers: all-or-nothing parsing.
//   (3) isMonotonic: soft ordering flag (never enforced, only reported).
//   (4) buildWtpProps: answered vs skipped payload shapes; skipped rows carry
//       no answers (denominator-only).
//   (5) KIT_TO_BUNDLE stays in sync with the server-side BUNDLE_CONFIG
//       (lib/bundles/config.ts), which the client deliberately does not import.

import {
  AGE_BANDS,
  KIT_TO_BUNDLE,
  WTP_MAX_GBP,
  buildWtpProps,
  isMonotonic,
  parsePrice,
  parseWtpAnswers,
  type QuizKitSlug,
} from '../lib/quiz/wtp'
import { BUNDLE_CONFIG, BUNDLE_TYPES } from '../lib/bundles/config'

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

// (1) parsePrice
check('(1a) plain integer', parsePrice('120') === 120)
check('(1b) decimal', parsePrice('120.50') === 120.5)
check('(1c) pound symbol stripped', parsePrice('£120') === 120)
check('(1d) commas + whitespace stripped', parsePrice(' 1,20 ') === 120)
check('(1e) rounds to pennies', parsePrice('99.999') === 100)
check('(1f) zero rejected', parsePrice('0') === null)
check('(1g) negative rejected', parsePrice('-5') === null)
check('(1h) over cap rejected', parsePrice(String(WTP_MAX_GBP + 1)) === null)
check('(1i) at cap accepted', parsePrice(String(WTP_MAX_GBP)) === WTP_MAX_GBP)
check('(1j) empty rejected', parsePrice('') === null)
check('(1k) garbage rejected', parsePrice('abc') === null)
// parseFloat('12abc') === 12: the leading-number quirk is accepted noise, the
// user typed a number first. Document the behaviour so a refactor is a choice.
check('(1l) leading-number garbage parses the number', parsePrice('12abc') === 12)

// (2) parseWtpAnswers: all-or-nothing
const rawGood = { tooCheap: '80', bargain: '140', expensive: '190', tooExpensive: '260' }
const good = parseWtpAnswers(rawGood)
check('(2a) all four parse', good !== null && good.tooCheap === 80 && good.tooExpensive === 260)
check('(2b) one bad -> null', parseWtpAnswers({ ...rawGood, bargain: '' }) === null)
check('(2c) one over cap -> null', parseWtpAnswers({ ...rawGood, expensive: '5000' }) === null)

// (3) isMonotonic: soft flag only
check('(3a) ordered -> true', good !== null && isMonotonic(good))
check(
  '(3b) equal neighbours still monotonic',
  isMonotonic({ tooCheap: 100, bargain: 100, expensive: 150, tooExpensive: 150 }),
)
check(
  '(3c) inverted -> false',
  !isMonotonic({ tooCheap: 200, bargain: 140, expensive: 190, tooExpensive: 260 }),
)

// (4) buildWtpProps payload shapes
const answered = buildWtpProps({
  recommendedKit: 'energy-recovery',
  symptomFlags: ['recovery_energy', 'physically_active'],
  answers: good,
  ageBand: '35-44',
})
check('(4a) answered: skipped false', answered.skipped === false)
check('(4b) answered: bundle concept mapped', answered.bundle_concept === 'prove_it')
check('(4c) answered: prices are numbers', typeof answered.wtp_bargain === 'number' && answered.wtp_bargain === 140)
check('(4d) answered: age band carried', answered.age_band === '35-44')
check('(4e) answered: monotonic flag computed', answered.monotonic === true)
check('(4f) answered: kit + flags carried', answered.recommended_kit === 'energy-recovery' && Array.isArray(answered.symptom_flags))

const skipped = buildWtpProps({
  recommendedKit: 'testosterone',
  symptomFlags: ['hormonal_symptoms'],
  answers: null,
  ageBand: '',
})
check('(4g) skipped: skipped true', skipped.skipped === true)
check('(4h) skipped: no answer keys', !('wtp_bargain' in skipped) && !('age_band' in skipped) && !('monotonic' in skipped))
check('(4i) skipped: kit + bundle still carried', skipped.recommended_kit === 'testosterone' && skipped.bundle_concept === 'confirmation')

// (5) KIT_TO_BUNDLE mirrors BUNDLE_CONFIG (baseKitType -> bundle type). The
// client keeps a local copy to avoid importing server-leaning modules; this
// assertion is what keeps the copy honest.
for (const bundleType of BUNDLE_TYPES) {
  const base = BUNDLE_CONFIG[bundleType].baseKitType as QuizKitSlug
  check(`(5) ${base} -> ${bundleType}`, KIT_TO_BUNDLE[base] === bundleType)
}
check('(5x) map covers exactly the three kits', Object.keys(KIT_TO_BUNDLE).length === BUNDLE_TYPES.length)

// (6) Age bands: five bands, placeholder '' is not one of them.
check('(6a) five bands', AGE_BANDS.length === 5)
check('(6b) no empty band', !AGE_BANDS.includes('' as never))

console.log(`test-quiz-wtp: ${passes} passed, ${failures} failed`)
if (failures > 0) process.exit(1)

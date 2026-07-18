// Regression suite for the Bucket A/B additions (2026-07-17):
//   - lib/flags.ts dark-launch flags (strict === 'true', default OFF)
//   - lib/account/exportResults.ts CSV shape (RFC 4180, header-only when empty)
//
// Same runner-free style as test-maintenance-offer.ts: assert loudly, exit
// non-zero on any failure. Run with `npm test` or
// `npx tsx scripts/test-account-export.ts`.

import {
  isAccountDataControlsEnabled,
  isGpHandoffEnabled,
  isKitScopeNoteEnabled,
} from '../lib/flags'
import { resultsToCsv } from '../lib/account/exportResults'
import type { DashboardData, ClassifiedResult } from '../lib/results/types'

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

// ── (a) Flags: default OFF, strict === 'true' ────────────────────────────────
const FLAGS: Array<[string, () => boolean]> = [
  ['ACCOUNT_DATA_CONTROLS_ENABLED', isAccountDataControlsEnabled],
  ['GP_HANDOFF_ENABLED', isGpHandoffEnabled],
  ['KIT_SCOPE_NOTE_ENABLED', isKitScopeNoteEnabled],
]

for (const [env, fn] of FLAGS) {
  delete process.env[env]
  check(`(a) ${env}: absent -> false`, fn() === false)
  process.env[env] = 'true'
  check(`(a) ${env}: 'true' -> true`, fn() === true)
  process.env[env] = 'TRUE'
  check(`(a) ${env}: 'TRUE' (wrong case) -> false`, fn() === false)
  process.env[env] = '1'
  check(`(a) ${env}: '1' -> false`, fn() === false)
  process.env[env] = 'false'
  check(`(a) ${env}: 'false' -> false`, fn() === false)
  delete process.env[env]
}

// ── (b) CSV: non-'ready' states yield a header-only document ──────────────────
const HEADER = 'Kit,Collected,Marker,Value,Unit,Reference low,Reference high,Status'

for (const state of ['no-results', 'pre-results', 'sample-failed'] as const) {
  const data = { state } as unknown as DashboardData
  const csv = resultsToCsv(data)
  check(`(b) ${state}: first line is the header`, csv.split('\r\n')[0] === HEADER)
  check(`(b) ${state}: header only (one data-less line + trailing CRLF)`, csv === HEADER + '\r\n')
}

// ── (c) CSV: a ready result flattens correctly, with RFC 4180 quoting ─────────
function marker(partial: Partial<ClassifiedResult>): ClassifiedResult {
  return {
    markerName: 'Testosterone',
    value: 18.4,
    unit: 'nmol/L',
    referenceLow: 8.6,
    referenceHigh: 29,
    displayZones: [],
    state: 'normal-testosterone',
    stateLabel: 'Your results indicate testosterone in the normal range',
    explanation: '',
    educationContext: '',
    recommendation: '',
    recommendationStrategy: 'single',
    primaryCta: null,
    secondaryCta: null,
    requiresQualifier: false,
    qualifierKey: null,
    ...partial,
  }
}

const ready: DashboardData = {
  state: 'ready',
  userAge: 42,
  kits: [
    {
      kitType: 'testosterone',
      results: [
        {
          resultId: 'r1',
          collectedAt: '2026-07-01T09:30:00.000Z',
          hasQualifierPending: false,
          markers: [
            marker({}),
            // A value/label with a comma to exercise quoting.
            marker({
              markerName: 'Ferritin',
              value: 24,
              unit: 'ug/L',
              referenceLow: 30,
              referenceHigh: 400,
              state: 'low-ferritin',
              stateLabel: 'Low, needs follow-up',
            }),
          ],
        },
      ],
    },
  ],
}

const csv = resultsToCsv(ready)
const lines = csv.trimEnd().split('\r\n')

check('(c) header present', lines[0] === HEADER)
check('(c) one row per marker (2)', lines.length === 3)
check(
  '(c) testosterone row correct',
  lines[1] === 'Testosterone Health Check,2026-07-01,Testosterone,18.4,nmol/L,8.6,29,Your results indicate testosterone in the normal range'
)
check(
  '(c) ferritin row quotes the comma-bearing status',
  lines[2] === 'Testosterone Health Check,2026-07-01,Ferritin,24,ug/L,30,400,"Low, needs follow-up"'
)
check('(c) trailing CRLF', csv.endsWith('\r\n'))

// A cell containing a double quote is doubled and wrapped.
const quoted = resultsToCsv({
  state: 'ready',
  userAge: null,
  kits: [
    {
      kitType: 'testosterone',
      results: [
        {
          resultId: 'r2',
          collectedAt: null,
          hasQualifierPending: false,
          markers: [marker({ stateLabel: 'has "quotes" inside' })],
        },
      ],
    },
  ],
})
check(
  '(c) double quotes escaped per RFC 4180',
  quoted.includes('"has ""quotes"" inside"')
)
check('(c) null collectedAt renders as empty cell', quoted.split('\r\n')[1].startsWith('Testosterone Health Check,,Testosterone,'))

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`\naccount-export: ${passes} passed, ${failures} failed`)
if (failures > 0) process.exit(1)

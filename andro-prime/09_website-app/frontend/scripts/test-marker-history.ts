/*
 * `lib/results/markerHistory.ts`: pairing a marker's readings across results.
 *
 *   npx tsx scripts/test-marker-history.ts
 *
 * The case that matters most is (3): a Kit 3 baseline retested with a Kit 2.
 * `getDashboardData` puts those in two different `KitData` buckets, so anything
 * that trusts the grouping finds no pairs at all. That is the defect this module
 * exists to avoid and it is asserted directly.
 */
import {
  markerHistories,
  remeasured,
  measuredOnce,
} from '../lib/results/markerHistory'
import type { ClassifiedResult, KitData, KitType } from '../lib/results/types'

let passed = 0
let failed = 0
function check(name: string, ok: boolean) {
  if (ok) {
    passed += 1
  } else {
    failed += 1
    console.error(`  FAIL ${name}`)
  }
}

/* A marker stub. Only the fields this module reads are real; the rest of
   ClassifiedResult is classifier output and irrelevant to pairing. */
function marker(markerName: string, value: number): ClassifiedResult {
  return {
    markerName,
    value,
    unit: 'nmol/L',
    referenceLow: null,
    referenceHigh: null,
    displayZones: [],
    state: 'optimal',
    stateLabel: '',
    explanation: '',
    educationContext: '',
  } as unknown as ClassifiedResult
}

function kit(
  kitType: KitType,
  results: { id: string; at: string | null; markers: ClassifiedResult[] }[],
): KitData {
  return {
    kitType,
    // getDashboardData hands these over newest first, so the fixtures do too:
    // the module must not depend on receiving them in a helpful order.
    results: results.map((r) => ({
      resultId: r.id,
      collectedAt: r.at,
      markers: r.markers,
      hasQualifierPending: false,
    })),
  }
}

// ───────────────────────────────────────────────────────────────────────────
// (1) One result
// ───────────────────────────────────────────────────────────────────────────

const single = markerHistories([
  kit('testosterone', [{ id: 'r1', at: '2026-04-01T08:00:00Z', markers: [marker('Vitamin D', 30)] }]),
])
check('(1a) one marker, one reading', single.length === 1 && single[0].readings.length === 1)
check('(1b) a lone reading has no previous', single[0].previous === null)
check('(1c) it is both latest and first', single[0].latest === single[0].first)
check('(1d) nothing is remeasured', remeasured(single).length === 0)
check('(1e) it is measured once', measuredOnce(single).length === 1)

// ───────────────────────────────────────────────────────────────────────────
// (2) Two results, same kit, handed over newest first
// ───────────────────────────────────────────────────────────────────────────

const sameKit = markerHistories([
  kit('testosterone', [
    { id: 'r2', at: '2026-08-01T08:00:00Z', markers: [marker('Vitamin D', 62)] },
    { id: 'r1', at: '2026-04-01T08:00:00Z', markers: [marker('Vitamin D', 30)] },
  ]),
])
check('(2a) the two readings become one history', sameKit.length === 1 && sameKit[0].readings.length === 2)
check('(2b) readings come back OLDEST first', sameKit[0].readings[0].marker.value === 30)
check('(2c) latest is the newest reading', sameKit[0].latest.marker.value === 62)
check('(2d) previous is the older one', sameKit[0].previous?.marker.value === 30)
check('(2e) with two readings, previous IS first', sameKit[0].previous === sameKit[0].first)
check('(2f) it counts as remeasured', remeasured(sameKit).length === 1)

// ───────────────────────────────────────────────────────────────────────────
// (3) 🔴 THE CASE THE KIT GROUPING BREAKS: a Kit 3 baseline, a Kit 2 retest
// ───────────────────────────────────────────────────────────────────────────

const crossKit = markerHistories([
  kit('energy-recovery', [
    { id: 'r2', at: '2026-08-01T08:00:00Z', markers: [marker('Vitamin D', 62), marker('Ferritin', 80)] },
  ]),
  kit('hormone-recovery', [
    {
      id: 'r1',
      at: '2026-04-01T08:00:00Z',
      markers: [marker('Vitamin D', 30), marker('Ferritin', 95), marker('Testosterone', 14)],
    },
  ]),
])

check('(3a) every distinct marker appears once', crossKit.length === 3)

const vitD = crossKit.find((h) => h.markerName === 'Vitamin D')!
check('(3b) a marker on BOTH kits pairs across them',
  vitD.previous !== null && vitD.previous.marker.value === 30 && vitD.latest.marker.value === 62)
check('(3c) the pair carries the two different kit types',
  vitD.first.kitType === 'hormone-recovery' && vitD.latest.kitType === 'energy-recovery')

const testosterone = crossKit.find((h) => h.markerName === 'Testosterone')!
check('(3d) a marker the retest did not measure has no partner', testosterone.previous === null)
check('(3e) and it keeps its original reading as latest', testosterone.latest.marker.value === 14)

check('(3f) two of three remeasured, one measured once',
  remeasured(crossKit).length === 2 && measuredOnce(crossKit).length === 1)
check('(3g) measuredOnce names the right marker',
  measuredOnce(crossKit)[0].markerName === 'Testosterone')

// ───────────────────────────────────────────────────────────────────────────
// (4) Three readings: previous and first stop being the same
// ───────────────────────────────────────────────────────────────────────────

const three = markerHistories([
  kit('testosterone', [
    { id: 'r3', at: '2026-12-01T08:00:00Z', markers: [marker('Vitamin D', 75)] },
    { id: 'r2', at: '2026-08-01T08:00:00Z', markers: [marker('Vitamin D', 62)] },
    { id: 'r1', at: '2026-04-01T08:00:00Z', markers: [marker('Vitamin D', 30)] },
  ]),
])
check('(4a) previous is the one immediately before latest', three[0].previous?.marker.value === 62)
check('(4b) first is the baseline, not previous', three[0].first.marker.value === 30)
check('(4c) they are now DIFFERENT readings', three[0].previous !== three[0].first)

// ───────────────────────────────────────────────────────────────────────────
// (5) 🔴 An undated reading must never be taken as the latest
// ───────────────────────────────────────────────────────────────────────────

const undated = markerHistories([
  kit('testosterone', [
    { id: 'rX', at: null, markers: [marker('Vitamin D', 999)] },
    { id: 'r1', at: '2026-04-01T08:00:00Z', markers: [marker('Vitamin D', 30)] },
  ]),
])
check('(5a) the dated reading is latest, not the undated one', undated[0].latest.marker.value === 30)
check('(5b) the undated one sorts oldest and is still present',
  undated[0].first.marker.value === 999 && undated[0].readings.length === 2)

// ───────────────────────────────────────────────────────────────────────────
// (6) Determinism and empties
// ───────────────────────────────────────────────────────────────────────────

check('(6a) no kits is no histories', markerHistories([]).length === 0)
check('(6b) a kit with no results is no histories',
  markerHistories([kit('testosterone', [])]).length === 0)
check('(6c) markers come back in a stable alphabetical order',
  crossKit.map((h) => h.markerName).join() === 'Ferritin,Testosterone,Vitamin D')

console.log(`test-marker-history: ${passed} passed, ${failed} failed`)
process.exit(failed === 0 ? 0 : 1)

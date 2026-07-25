// Confirmation-bundle result decision — the pure, DB-free core of the result
// hook in lib/results/processResult.ts.
//
// A 'confirmation' bundle owes the customer a SECOND Kit 1 (testosterone). When
// the first result lands, its testosterone value decides what happens to the
// prepaid second kit:
//
//   - low (shouldTriggerConfirmation, i.e. < 12 nmol/L, aligned to the GP-referral
//     low-T threshold per Keith/Ewa 2026-07-25): the recheck is owed. We stamp
//     triggered_at = the result instant
//     and due_at = result + CONFIRMATION_INTERVAL_DAYS (default 0 = due
//     immediately). status stays 'scheduled' so the daily sweep matures + ships
//     it — this hook only ever SETS DATES, it never dispatches.
//
//   - not low (>= 12 nmol/L: borderline 12–<15 or all-clear >=15): the kit is
//     BANKED, not refunded. This is the
//     bank-not-refund decision taken 2026-07-24 (approved bundle plan, "All-clear
//     on a Confirmation bundle = BANK by default, refund on request"): refunding
//     the £70 second-test portion loses the Stripe fee on the full £169 and drops
//     contribution below a single kit, so instead we re-schedule the prepaid kit
//     to auto-dispatch at the 6-to-12-month recheck window. due_at = result +
//     BANK_RECHECK_MONTHS (6mo = the start of that window); triggered_at stays
//     null (the trigger was never "met" — the kit is deferred, not owed on a low
//     result). status stays 'scheduled' and the same sweep dispatches at due_at.
//     A refund-on-request is a manual ops path, not this code.
//
// Kept pure and DB-free so the clinical boundary + the date arithmetic are unit
// testable with a fixed clock (scripts/test-bundle-confirmation.ts) — the hook in
// processResult.ts is the only place that touches the row.

import {
  shouldTriggerConfirmation,
  CONFIRMATION_INTERVAL_DAYS,
  BANK_RECHECK_MONTHS,
} from './config'

// Both branches emit ISO strings for the timestamptz columns (due_at,
// triggered_at). 'bank' carries triggered_at = null (see above).
export interface ConfirmationOutcome {
  kind: 'trigger' | 'bank'
  triggeredAt: string | null
  dueAt: string
}

export function resolveConfirmationOutcome(
  testosteroneValue: number,
  asOf: Date,
): ConfirmationOutcome {
  if (shouldTriggerConfirmation(testosteroneValue)) {
    // Low / borderline: confirmatory retest owed. due_at = asOf + interval days.
    // Day arithmetic via setDate (mirrors the month arithmetic of retestDueAtUnix
    // in lib/results/processResult.ts). Default interval 0 -> due_at === asOf.
    const due = new Date(asOf)
    due.setDate(due.getDate() + CONFIRMATION_INTERVAL_DAYS)
    return {
      kind: 'trigger',
      triggeredAt: asOf.toISOString(),
      dueAt: due.toISOString(),
    }
  }

  // All-clear: bank the prepaid kit to the recheck window (bank-not-refund,
  // 2026-07-24). due_at = asOf + BANK_RECHECK_MONTHS. setMonth carries the year
  // correctly (e.g. 2026-09-15 + 6mo -> 2027-03-15).
  const due = new Date(asOf)
  due.setMonth(due.getMonth() + BANK_RECHECK_MONTHS)
  return {
    kind: 'bank',
    triggeredAt: null,
    dueAt: due.toISOString(),
  }
}

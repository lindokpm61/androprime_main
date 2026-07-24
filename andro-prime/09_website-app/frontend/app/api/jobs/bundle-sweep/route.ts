// Daily bundle sweep — advances the bundle_dispatches state machine.
//
// Mirrors the results job (app/api/jobs/process-result): QStash-signature-
// verified, driven by a QStash Schedule. Do NOT use one long ~90-day QStash
// delay (it exceeds the max single-message delay) — store a date, act when it
// arrives, poll daily. Idempotent: each pass guards on status, so a double run
// never double-emails or double-dispatches.
//
// QStash Schedule to register ONCE (NOT registered here — do it via the QStash
// Schedules dashboard/API alongside the existing results-job usage):
//   Cron:        0 6 * * *            (daily, ~06:00 UTC)
//   Destination: POST https://andro-prime.com/api/jobs/bundle-sweep
//
// Gated behind BUNDLES_ENABLED: with the flag OFF the route verifies the
// signature and returns { skipped: true } without touching any row.

import { NextRequest, NextResponse } from 'next/server'
import { verifyQStashRequest } from '@/lib/qstash/verify'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isBundlesEnabled } from '@/lib/flags'
import { emitEvent } from '@/lib/customerio/emit'
import { cioKeyForUserId } from '@/lib/customerio/identity'
import { dispatchSecondKit } from '@/lib/bundles/dispatch'
import { ADDRESS_CHECK_WINDOW_DAYS } from '@/lib/bundles/config'
import { isTriggerMatured, needsAddressCheck, isWindowElapsed } from '@/lib/bundles/sweep'

const DAY_MS = 24 * 60 * 60 * 1000

export async function POST(request: NextRequest) {
  try {
    await verifyQStashRequest(request)
  } catch {
    return NextResponse.json({ error: 'Invalid QStash signature' }, { status: 401 })
  }

  if (!isBundlesEnabled()) {
    return NextResponse.json({ skipped: true })
  }

  const supabase = createSupabaseAdminClient()
  const now = new Date()
  const nowIso = now.toISOString()

  let matured = 0
  let addressChecked = 0
  let dispatched = 0
  let failures = 0

  // Pass A — 'scheduled' + due_at reached -> 'trigger_met'. The DB filter narrows
  // the set; the pure predicate is the authoritative gate. triggered_at is only
  // stamped if not already set (Confirmation rows carry it from the result hook).
  const { data: scheduledRows, error: scheduledError } = await supabase
    .from('bundle_dispatches')
    .select('*')
    .eq('status', 'scheduled')
    .not('due_at', 'is', null)
    .lte('due_at', nowIso)

  if (scheduledError) {
    console.error('[bundle-sweep] Failed to load scheduled rows:', scheduledError.message)
  }

  for (const row of scheduledRows ?? []) {
    try {
      if (!isTriggerMatured(row, now)) continue
      const { error } = await supabase
        .from('bundle_dispatches')
        .update({ status: 'trigger_met', triggered_at: row.triggered_at ?? nowIso })
        .eq('id', row.id)
        .eq('status', 'scheduled')
      if (error) {
        console.error('[bundle-sweep] Failed to mature row', row.id, error.message)
        failures += 1
        continue
      }
      matured += 1
    } catch (err) {
      console.error('[bundle-sweep] Error maturing row', row.id, err)
      failures += 1
    }
  }

  // Pass B — 'trigger_met' -> address-check email -> 'awaiting_window'.
  const { data: triggeredRows, error: triggeredError } = await supabase
    .from('bundle_dispatches')
    .select('*')
    .eq('status', 'trigger_met')

  if (triggeredError) {
    console.error('[bundle-sweep] Failed to load trigger_met rows:', triggeredError.message)
  }

  for (const row of triggeredRows ?? []) {
    try {
      if (!needsAddressCheck(row)) continue
      const cioKey = await cioKeyForUserId(supabase, row.user_id)
      if (cioKey) {
        await emitEvent(cioKey, {
          name: 'bundle_address_check',
          data: {
            bundle_type: row.bundle_type,
            kit_type: row.kit_type,
            parent_order_id: row.parent_order_id,
          },
        })
      }
      const { error } = await supabase
        .from('bundle_dispatches')
        .update({ status: 'awaiting_window', address_check_at: nowIso })
        .eq('id', row.id)
        .eq('status', 'trigger_met')
      if (error) {
        console.error('[bundle-sweep] Failed to advance row to awaiting_window', row.id, error.message)
        failures += 1
        continue
      }
      addressChecked += 1
    } catch (err) {
      console.error('[bundle-sweep] Error sending address check for row', row.id, err)
      failures += 1
    }
  }

  // Pass C — 'awaiting_window' + soft window elapsed -> second dispatch.
  const cutoffIso = new Date(now.getTime() - ADDRESS_CHECK_WINDOW_DAYS * DAY_MS).toISOString()
  const { data: waitingRows, error: waitingError } = await supabase
    .from('bundle_dispatches')
    .select('*')
    .eq('status', 'awaiting_window')
    .not('address_check_at', 'is', null)
    .lte('address_check_at', cutoffIso)

  if (waitingError) {
    console.error('[bundle-sweep] Failed to load awaiting_window rows:', waitingError.message)
  }

  for (const row of waitingRows ?? []) {
    try {
      if (!isWindowElapsed(row, now)) continue
      const result = await dispatchSecondKit(supabase, row)
      if (result.ok) {
        dispatched += 1
      } else {
        // Left in 'awaiting_window' by dispatchSecondKit — the next daily run
        // retries. Counted as a failure for this run's observability.
        failures += 1
      }
    } catch (err) {
      console.error('[bundle-sweep] Error dispatching second kit for row', row.id, err)
      failures += 1
    }
  }

  return NextResponse.json({ matured, addressChecked, dispatched, failures })
}

// Daily bundle sweep — advances the bundle_dispatches state machine.
//
// Mirrors the results job (app/api/jobs/process-result): QStash-signature-
// verified, driven by a QStash Schedule. Do NOT use one long ~90-day QStash
// delay (it exceeds the max single-message delay) — store a date, act when it
// arrives, poll daily. Idempotent: each pass guards on status, so a double run
// never double-emails or double-dispatches.
//
// QStash Schedule: REGISTERED 2026-07-26 (scheduleId scd_5YpFh9tnXmSe2uZewrHZ6iNT3rTW).
//   Cron:        0 6 * * *            (daily, ~06:00 UTC)
//   Destination: POST https://andro-prime.com/api/jobs/bundle-sweep
//   Manage via the QStash Schedules API/dashboard; it fires daily but no-ops
//   (returns { skipped: true }) while BUNDLES_ENABLED is off.
//
// Gated behind BUNDLES_ENABLED: with the flag OFF the route verifies the
// signature and returns { skipped: true } without touching any row.

import { NextRequest, NextResponse } from 'next/server'
import { verifyQStashRequest } from '@/lib/qstash/verify'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isBundlesEnabled, isMembershipEnabled } from '@/lib/flags'
import { emitEvent } from '@/lib/customerio/emit'
import { cioKeyForUserId } from '@/lib/customerio/identity'
import { dispatchSecondKit } from '@/lib/bundles/dispatch'
import { ADDRESS_CHECK_WINDOW_DAYS } from '@/lib/bundles/config'
import { isTriggerMatured, needsAddressCheck, isWindowElapsed } from '@/lib/bundles/sweep'
import { isRetestDispatchable } from '@/lib/membership/entitlement'

const DAY_MS = 24 * 60 * 60 * 1000

export async function POST(request: NextRequest) {
  try {
    await verifyQStashRequest(request)
  } catch {
    return NextResponse.json({ error: 'Invalid QStash signature' }, { status: 401 })
  }

  // Two independent sources now flow through this state machine: bundles and
  // membership retests. Either flag on is enough to justify a pass, and each
  // pass filters rows by source so one flag can never process the other's work.
  const bundlesOn = isBundlesEnabled()
  const membershipOn = isMembershipEnabled()

  if (!bundlesOn && !membershipOn) {
    return NextResponse.json({ skipped: true })
  }

  /** A row belongs to a source whose flag is on. */
  const sourceEnabled = (source: string | null) =>
    source === 'membership' ? membershipOn : bundlesOn

  const supabase = createSupabaseAdminClient()
  const now = new Date()
  const nowIso = now.toISOString()

  let matured = 0
  let addressChecked = 0
  let dispatched = 0
  let failures = 0
  let retestsOwed = 0

  // Pass 0 - membership retests become owed kits.
  //
  // This is the ONLY thing membership adds to dispatch: it converts "this
  // member's retest date has arrived" into the same bundle_dispatches row the
  // rest of this file already knows how to carry. Everything after it is
  // shared, which is why membership needed no second dispatch path.
  //
  // The active check happens HERE, at dispatch time, never at sign-up. The
  // entitlement is conditional on being an active member ON the retest date, so
  // a lapsed member whose date has passed is owed nothing. isRetestDispatchable
  // is the single named rule for that, unit-tested in scripts/test-membership.ts.
  if (membershipOn) {
    const { data: dueMemberships, error: dueError } = await supabase
      .from('memberships')
      .select('id, user_id, status, next_retest_due_at, retest_claimed_at')
      .is('retest_claimed_at', null)
      .not('next_retest_due_at', 'is', null)
      .lte('next_retest_due_at', nowIso)

    if (dueError) {
      console.error('[bundle-sweep] Failed to load due memberships:', dueError.message)
    }

    for (const m of dueMemberships ?? []) {
      try {
        // The DB filter narrows the set; the pure predicate is the gate.
        if (!isRetestDispatchable(m, now)) continue

        // Retest the kit they last took. Without a prior order there is nothing
        // to retest, so skip rather than guess a panel for them.
        const { data: lastOrder } = await supabase
          .from('kit_orders')
          .select('kit_type')
          .eq('user_id', m.user_id)
          .order('ordered_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (!lastOrder) {
          console.warn('[bundle-sweep] Membership', m.id, 'is due a retest but has no prior kit order')
          continue
        }

        // Claim FIRST. If the insert then fails, tomorrow's sweep sees the claim
        // already set and under-dispatches, which a human can fix. Claiming
        // second would risk a second real kit and real postage on a retry. Of
        // the two failure modes only one is recoverable.
        const { error: claimError } = await supabase
          .from('memberships')
          .update({ retest_claimed_at: nowIso })
          .eq('id', m.id)
          .is('retest_claimed_at', null)

        if (claimError) {
          console.error('[bundle-sweep] Failed to claim retest for membership', m.id, claimError.message)
          failures += 1
          continue
        }

        const { error: insertError } = await supabase.from('bundle_dispatches').insert({
          user_id: m.user_id,
          kit_type: lastOrder.kit_type,
          bundle_type: 'membership_retest',
          source: 'membership',
          membership_id: m.id,
          status: 'scheduled',
          due_at: nowIso,
        })

        if (insertError) {
          console.error('[bundle-sweep] Failed to create retest dispatch for membership', m.id, insertError.message)
          failures += 1
          continue
        }

        retestsOwed += 1
      } catch (err) {
        console.error('[bundle-sweep] Error owing retest for membership', m.id, err)
        failures += 1
      }
    }
  }

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
      if (!sourceEnabled(row.source)) continue
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
      if (!sourceEnabled(row.source)) continue
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
      if (!sourceEnabled(row.source)) continue
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

  return NextResponse.json({ retestsOwed, matured, addressChecked, dispatched, failures })
}

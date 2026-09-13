/**
 * The one admin control for a member's retest date (defect A1).
 *
 * ── WHY THIS EXISTS ───────────────────────────────────────────────────────
 * A1 surfaced underneath 3d and was written up nowhere. The admin dashboard
 * touches kit orders only, so moving a member's retest date meant editing
 * Postgres by hand. **If the membership ships before the cadence table exists,
 * this is the only lever support has**, and a hand-written UPDATE against a
 * production table is not a lever you want a person using under time pressure.
 *
 * It is worth having even if every other retest item is deferred, because it is
 * what makes the rest of them survivable in the meantime: 3d's middle branch is
 * blocked on Ewa, and until it lands "email support" is the answer the member is
 * given. This is what support does next.
 *
 * ── 🔴 WHAT THIS CONTROL ACTUALLY DOES ────────────────────────────────────
 * **Moving a date into the past makes tonight's sweep post a real kit.** That is
 * the point of it — it is how support grants an early retest — and it is also
 * why every refusal below exists. The sweep selects on `next_retest_due_at <=
 * now`, so this field is the trigger for real postage and real cost. The caller
 * is told, in as many words, when a move will dispatch.
 *
 * ── WHAT IT DOES NOT DO ───────────────────────────────────────────────────
 * It moves a DATE. It never claims, never inserts a dispatch, never cancels one,
 * never touches `retest_claimed_at`. The sweep stays the only code path that
 * turns a row into postage, exactly as in 3d.
 *
 * The validation is PURE and clock-injected, like `entitlement.ts` and
 * `earlyRetest.ts`, so the whole refusal table is drivable from a test.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import { entitlementState, type MembershipLike } from '@/lib/membership/entitlement'

type Admin = SupabaseClient<Database>

/** An audit line with "x" in it is not an audit line. */
export const MIN_REASON_LENGTH = 10

/**
 * Nothing sensible is more than five years out, and a fat-fingered year is the
 * realistic way this field gets a wrong value. Refusing is recoverable; a
 * member silently parked in 2125 is not noticed by anybody.
 */
export const MAX_YEARS_AHEAD = 5

export type RetestMoveRefusal =
  | 'no-reason'
  | 'reason-too-short'
  | 'bad-date'
  | 'too-far-out'
  | 'in-flight-backwards'
  | 'no-entitlement'

export const REFUSAL_MESSAGE: Record<RetestMoveRefusal, string> = {
  'no-reason': 'A reason is required. It is written to the audit trail.',
  'reason-too-short': `The reason must be at least ${MIN_REASON_LENGTH} characters, so it is readable in six months.`,
  'bad-date': 'That date could not be read.',
  'too-far-out': `That date is more than ${MAX_YEARS_AHEAD} years away. Check the year.`,
  'in-flight-backwards':
    'A retest kit for this member is already in the post. Moving the date back could make the sweep claim a second one and dispatch nothing. Wait until it arrives.',
  'no-entitlement': 'This membership has no retest date to move.',
}

export type RetestMoveCheck =
  | {
      ok: true
      /**
       * TRUE when the new date is in the past, which means the next nightly
       * sweep will owe this member a kit. The UI says so before the button is
       * pressed: it is the difference between an administrative tidy-up and
       * putting a physical box in the post.
       */
      dispatchesOnNextSweep: boolean
    }
  | { ok: false; refusal: RetestMoveRefusal }

/**
 * May this move be made, and does it ship a kit?
 *
 * ⚠ A DATE IN THE PAST IS ALLOWED ON PURPOSE. Support granting an early retest
 * is the main use of this control, and the way to grant one is to move the date
 * to now. Refusing past dates would remove the only reason the control exists.
 * What is refused is the case that breaks the machine rather than the case that
 * costs a kit.
 */
export function validateRetestMove(args: {
  membership: MembershipLike | null
  newDueAt: Date
  reason: string
  now: Date
}): RetestMoveCheck {
  const { membership, newDueAt, reason, now } = args

  const trimmed = reason.trim()
  if (trimmed.length === 0) return { ok: false, refusal: 'no-reason' }
  if (trimmed.length < MIN_REASON_LENGTH) return { ok: false, refusal: 'reason-too-short' }

  if (Number.isNaN(newDueAt.getTime())) return { ok: false, refusal: 'bad-date' }

  const ceiling = new Date(now)
  ceiling.setFullYear(ceiling.getFullYear() + MAX_YEARS_AHEAD)
  if (newDueAt.getTime() > ceiling.getTime()) return { ok: false, refusal: 'too-far-out' }

  if (!membership?.next_retest_due_at) return { ok: false, refusal: 'no-entitlement' }

  // 🔴 THE ONE REFUSAL THAT IS ABOUT THE MACHINE RATHER THAN THE MONEY.
  // `claimed` inside the in-flight window means a kit is physically in the post
  // and the sweep has already rolled the date a year forward. Moving it back to
  // now would put this membership straight back into the sweep's selection; the
  // sweep claims BEFORE it inserts, and the open-dispatch unique index would
  // then refuse the insert, so the member would be stamped claimed and sent
  // nothing. That is exactly the 3b failure mode, re-entered by hand.
  const state = entitlementState(membership, now)
  if (state.kind === 'claimed' && newDueAt.getTime() <= now.getTime()) {
    return { ok: false, refusal: 'in-flight-backwards' }
  }

  return { ok: true, dispatchesOnNextSweep: newDueAt.getTime() <= now.getTime() }
}

/* ------------------------------------------------------------ the database */

export interface AdminMembershipView {
  membershipId: string
  userId: string
  email: string
  status: string
  nextRetestDueAt: string | null
  retestClaimedAt: string | null
  entitlement: ReturnType<typeof entitlementState>['kind']
}

/**
 * Find a member by email. Deliberately email-only: support is reading it off a
 * ticket, and the order-lookup panel above already handles references and
 * Vitall ids for the kit side.
 */
export async function findMembershipByEmail(
  supabase: Admin,
  email: string,
  now: Date,
): Promise<AdminMembershipView | null> {
  const cleaned = email.trim().toLowerCase()
  if (!cleaned) return null

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email')
    .ilike('email', cleaned)
    .maybeSingle()

  if (userError) {
    console.error('[admin-retest] user lookup failed:', userError.message)
    return null
  }
  if (!user) return null

  const { data: m, error } = await supabase
    .from('memberships')
    .select('id, user_id, status, next_retest_due_at, retest_claimed_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('[admin-retest] membership lookup failed:', error.message)
    return null
  }
  if (!m) return null

  return {
    membershipId: m.id,
    userId: m.user_id,
    email: user.email ?? cleaned,
    status: m.status as string,
    nextRetestDueAt: m.next_retest_due_at,
    retestClaimedAt: m.retest_claimed_at,
    entitlement: entitlementState(m, now).kind,
  }
}

export type RetestMoveResult =
  | { ok: true; dispatchesOnNextSweep: boolean; previousDueAt: string | null }
  | { ok: false; message: string }

/**
 * Move the date and record why.
 *
 * The reason is written to `lifecycle_events`, which is already this app's
 * general per-user event log with a free-form payload — the contact form writes
 * into it, so this is not a Customer.io mirror being borrowed for the wrong job.
 *
 * ⚠ A jsonb event row is a WEAKER audit trail than a dedicated table: no foreign
 * key to the membership, no constraint on the shape. It is chosen because it
 * needs no migration against the production database for a control that should
 * be used rarely. **If this starts being used often, the upgrade is a real
 * `membership_retest_adjustments` table**, and that is a decision with a
 * migration attached rather than something to slip in.
 */
export async function applyRetestMove(
  supabase: Admin,
  args: {
    membershipId: string
    userId: string
    previousDueAt: string | null
    newDueAt: Date
    reason: string
    actorEmail: string
    dispatchesOnNextSweep: boolean
  },
): Promise<RetestMoveResult> {
  // Compare-and-set on the date we showed the operator. If the nightly sweep, a
  // 3d clock reset, or another admin moved it in between, this updates no rows
  // rather than overwriting a change nobody has seen.
  let update = supabase
    .from('memberships')
    .update({ next_retest_due_at: args.newDueAt.toISOString() })
    .eq('id', args.membershipId)

  update = args.previousDueAt
    ? update.eq('next_retest_due_at', args.previousDueAt)
    : update.is('next_retest_due_at', null)

  const { data: updated, error } = await update.select('id')

  if (error) {
    console.error('[admin-retest] update failed:', error.message)
    return { ok: false, message: 'The update failed. Nothing was changed.' }
  }
  if (!updated || updated.length === 0) {
    return {
      ok: false,
      message:
        'This membership changed while you were looking at it, so nothing was written. Search again and re-read the date before retrying.',
    }
  }

  // The audit line. Written AFTER the change, and a failure here is logged
  // loudly but does not roll the move back: the member's date is already
  // correct, and losing the reason is the lesser of the two problems.
  const { error: auditError } = await supabase.from('lifecycle_events').insert({
    user_id: args.userId,
    event_name: 'membership_retest_date_moved',
    payload: {
      membership_id: args.membershipId,
      previous_due_at: args.previousDueAt,
      new_due_at: args.newDueAt.toISOString(),
      reason: args.reason.trim(),
      actor_email: args.actorEmail,
      dispatches_on_next_sweep: args.dispatchesOnNextSweep,
    },
  })

  if (auditError) {
    console.error(
      '[admin-retest] 🔴 DATE MOVED BUT THE AUDIT LINE FAILED:',
      args.membershipId,
      auditError.message,
    )
  }

  return {
    ok: true,
    dispatchesOnNextSweep: args.dispatchesOnNextSweep,
    previousDueAt: args.previousDueAt,
  }
}

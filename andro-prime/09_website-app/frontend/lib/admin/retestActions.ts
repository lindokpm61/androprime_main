'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth/session'
import { isAdmin } from '@/lib/auth/isAdmin'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isMembershipEnabled } from '@/lib/flags'
import {
  REFUSAL_MESSAGE,
  applyRetestMove,
  findMembershipByEmail,
  validateRetestMove,
} from './retestDate'

/**
 * Defect A1: move a member's retest date, with a reason recorded.
 *
 * 🔴 THE GATE IS RE-CHECKED HERE AND THAT IS NOT BELT-AND-BRACES. A server
 * action is its own POST endpoint: it does not inherit the page's guard, and
 * `/admin` is not in the middleware matcher (the dashboard's own header records
 * that its in-page check is the ONLY gate). An action that trusted the page
 * would be an unauthenticated write to a production table by anyone who could
 * find its id.
 */

export interface MoveRetestState {
  ok: boolean
  message: string
  /** Set when the move went through and the next sweep will post a kit. */
  dispatches?: boolean
}

export async function moveRetestDateAction(
  _prev: MoveRetestState | null,
  formData: FormData,
): Promise<MoveRetestState> {
  const user = await getCurrentUser()
  if (!isAdmin(user)) {
    return { ok: false, message: 'Not permitted.' }
  }

  // The flag gates the write as well as the screen. With membership off there
  // are no real memberships to administer, and a control that works before the
  // product does is a way to put a date on a seeded row by accident (A2).
  if (!isMembershipEnabled()) {
    return {
      ok: false,
      message: 'MEMBERSHIP_ENABLED is off, so there are no live memberships to administer.',
    }
  }

  const email = String(formData.get('email') ?? '')
  const dateRaw = String(formData.get('newDueAt') ?? '')
  const reason = String(formData.get('reason') ?? '')

  if (!email.trim()) return { ok: false, message: 'Enter the member email.' }
  if (!dateRaw.trim()) return { ok: false, message: 'Enter a new retest date.' }

  const supabase = createSupabaseAdminClient()
  const now = new Date()

  const member = await findMembershipByEmail(supabase, email, now)
  if (!member) return { ok: false, message: 'No membership found for that email.' }

  // Parsed as midnight UTC rather than local, so the date the operator typed is
  // the date that is stored. Every date on this site was formatted in whatever
  // timezone the runtime happened to be in until 2026-09-12; this is the same
  // trap on the way in rather than on the way out.
  const newDueAt = new Date(`${dateRaw}T00:00:00.000Z`)

  const check = validateRetestMove({
    membership: {
      status: member.status as never,
      next_retest_due_at: member.nextRetestDueAt,
      retest_claimed_at: member.retestClaimedAt,
    },
    newDueAt,
    reason,
    now,
  })

  if (!check.ok) return { ok: false, message: REFUSAL_MESSAGE[check.refusal] }

  const result = await applyRetestMove(supabase, {
    membershipId: member.membershipId,
    userId: member.userId,
    previousDueAt: member.nextRetestDueAt,
    newDueAt,
    reason,
    actorEmail: user?.email ?? 'unknown',
    dispatchesOnNextSweep: check.dispatchesOnNextSweep,
  })

  if (!result.ok) return { ok: false, message: result.message }

  revalidatePath('/admin/dashboard')

  return {
    ok: true,
    dispatches: result.dispatchesOnNextSweep,
    message: result.dispatchesOnNextSweep
      ? `Moved. This member is now due, so TONIGHT'S SWEEP WILL OWE HIM A KIT. Previous date: ${result.previousDueAt ?? 'none'}.`
      : `Moved. Previous date: ${result.previousDueAt ?? 'none'}.`,
  }
}

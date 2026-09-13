'use client'

import { useActionState } from 'react'
import { moveRetestDateAction, type MoveRetestState } from '@/lib/admin/retestActions'

/**
 * Defect A1: the one admin control for a member's retest date.
 *
 * A client component only because it needs the action's reply on screen. The
 * gate is not here and must never be: `moveRetestDateAction` re-checks `isAdmin`
 * itself, because a server action is its own POST endpoint and does not inherit
 * the page's guard.
 *
 * 🔴 THE WARNING ABOVE THE BUTTON IS THE POINT OF THE DESIGN. This field is the
 * sweep's trigger, so a date in the past means a real kit in a real jiffy bag at
 * our cost. That is a legitimate thing for support to do — it is how an early
 * retest gets granted — but it must never be a thing somebody does without
 * noticing. The reason box is required for the same purpose: it makes the
 * operator state what they are doing before they can do it.
 */
export function RetestDatePanel({ defaultEmail = '' }: { defaultEmail?: string }) {
  const [state, formAction, pending] = useActionState<MoveRetestState | null, FormData>(
    moveRetestDateAction,
    null,
  )

  return (
    <form action={formAction} style={{ marginTop: 14, maxWidth: '52ch' }}>
      {/* `.f-formrow` + `.f-blab` + `.f-inp` is this design system's field, used
          by every other form in the app. Two internal-only class names were
          invented here first and removed: the panel needs no CSS of its own, and
          `f-primitives.css` already carries a note that grepping before naming
          is how a collision gets avoided. */}
      <div className="f-formrow">
        <label className="f-blab" htmlFor="rd-email">Member email</label>
        {/* Prefilled from the member just looked up. Found by looking at the
            rendered page rather than the source: the operator had to type the
            same address twice, once to see the date and once to move it, which
            on a support screen is where a typo puts the change on the wrong
            member. `key` forces React to pick up a new default when a different
            member is looked up, since defaultValue alone does not re-apply. */}
        <input id="rd-email" name="email" type="email" className="f-inp" required
          key={defaultEmail} defaultValue={defaultEmail}
          placeholder="name@example.com" autoComplete="off" />
      </div>

      <div className="f-formrow">
        <label className="f-blab" htmlFor="rd-date">New retest date</label>
        <input id="rd-date" name="newDueAt" type="date" className="f-inp" required />
        <p className="f-fine" style={{ marginTop: 6 }}>
          A date today or earlier makes tonight&rsquo;s sweep owe this member a kit.
        </p>
      </div>

      <div className="f-formrow">
        <label className="f-blab" htmlFor="rd-reason">Reason</label>
        <textarea id="rd-reason" name="reason" className="f-inp" rows={2} required
          minLength={10} placeholder="Ticket 412: GP asked for an earlier recheck." />
        <p className="f-fine" style={{ marginTop: 6 }}>
          Recorded against the member, with your email and both dates.
        </p>
      </div>

      <button type="submit" className="f-btn" disabled={pending}>
        {pending ? 'Moving…' : 'Move the date'}
      </button>

      {state && (
        <div
          className={state.ok ? 'f-banner' : 'f-banner f-banner-err'}
          role="status"
          aria-live="polite"
          style={{ marginTop: 16 }}
        >
          <span className="f-banner-k">{state.ok ? (state.dispatches ? 'Moved, kit owed' : 'Moved') : 'Not moved'}</span>
          {state.message}
        </div>
      )}
    </form>
  )
}

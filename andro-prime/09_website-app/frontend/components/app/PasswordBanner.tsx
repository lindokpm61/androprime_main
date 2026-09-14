'use client'

import { useRef, useState, useTransition } from 'react'
import { dismissPasswordPromptAction, setPasswordAction } from '@/lib/dashboard/actions'

/**
 * THE PASSWORD PROMPT, rebuilt in Direction F on 2026-09-14 (defect register C1).
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WHY IT WAS STILL V2.0 ON A ROUTE THE REPORT SCORES AS FINISHED
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 32 V2.0 tokens, 0 Direction F classes, rendering BY DEFAULT at the top of the
 * results dashboard — it is suppressed only by a dismissal cookie, so it is the
 * first thing a new customer sees on the screen batch 3 rebuilt. The route
 * scored full marks throughout, because `route-conformance` counts the classes a
 * ROUTE renders and cannot see inside a component. That gap is C4.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * EVERY WORD IS THE ONE THAT SHIPPED, AND FOUR LETTER CASES ARE NOT
 * ─────────────────────────────────────────────────────────────────────────
 *
 * The prompt sentence, the two validation messages, the minimum-characters line
 * and the confirmation are character for character what was there. The action
 * calls, the 8-character rule, the match check and the dismissal are untouched.
 *
 * `SET PASSWORD`, `SAVE PASSWORD`, `PASSWORD` and `CONFIRM PASSWORD` are now
 * sentence case. The capitals were V2.0 STYLING typed into strings — each of
 * those elements also carried `uppercase` in its class list, so the shouting was
 * said twice — and under Direction F a `.f-btn` label is sentence case while
 * `.f-blab` uppercases in CSS, so the two field labels still RENDER in capitals
 * from a sentence-case source. Register row 41 made the identical call on
 * `/checkout/details`: "the only text difference anywhere is letter case on two
 * form-control labels." The arrow moved out of the `SAVE PASSWORD  →` string
 * and into `.f-pip`, which is where every other arrow in the direction lives.
 *
 * Design and layout only, so no pre-flight of its own.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * 🔴 THE MODAL IS GONE, AND THAT IS A DECISION RATHER THAN A RESTYLE
 * ─────────────────────────────────────────────────────────────────────────
 *
 * The V2.0 version opened a fixed overlay: a `bg-black/60` scrim and a bordered
 * card, dismissed by clicking the backdrop. It had NO `role="dialog"`, no
 * `aria-modal`, no focus trap, no Escape handler and no scroll lock, so a
 * keyboard user could tab straight out of it into the page behind and a screen
 * reader was never told a dialog had opened. Porting it would have meant porting
 * four accessibility defects into a fresh file, and building it properly would
 * have meant adding the first real modal to a system that has none — for three
 * fields.
 *
 * So the form is DISCLOSED IN PLACE instead: the same card grows a `.f-well`
 * holding the same three controls. `aria-expanded` and `aria-controls` say what
 * the button does, focus is never stolen and never needs returning, and there is
 * nothing to trap. This is the one behaviour change in the rebuild, and it is
 * flagged here rather than folded in quietly.
 *
 * ⚠ AND A LIVE DEFECT FOUND ON THE WAY IN, NOT FIXED HERE. `setPasswordAction`
 * ends with `revalidatePath('/results-dashboard')`, and the server only renders
 * this component while the dismissal cookie is absent — the same action sets it.
 * So on success the parent stops rendering this component, and the confirmation
 * below (and the V2.0 toast before it) is unmounted with it, probably before
 * anybody reads it. The success branch is kept because it is correct whenever
 * the client wins the race, but a confirmation that only shows sometimes is a
 * server-action question, not a styling one, and belongs with whoever owns
 * `lib/dashboard/actions.ts`.
 */
export function PasswordBanner() {
  const [formOpen, setFormOpen] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [isPending, startTransition] = useTransition()
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleDismiss() {
    // Hide optimistically: the banner is cosmetic, and the dismiss cookie is set
    // server-side regardless of whether the session is still alive.
    setDismissed(true)
    startTransition(async () => {
      await dismissPasswordPromptAction()
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const password = String(formData.get('password') ?? '')
    const confirm = String(formData.get('confirm') ?? '')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Minimum 8 characters.')
      return
    }

    setError('')
    startTransition(async () => {
      const result = await setPasswordAction(formData)
      if ('error' in result && result.error) {
        setError(result.error)
        return
      }
      setFormOpen(false)
      setSuccess(true)
      if (toastRef.current) clearTimeout(toastRef.current)
      toastRef.current = setTimeout(() => setSuccess(false), 4000)
    })
  }

  if (dismissed) return null

  if (success) {
    return (
      <div className="f-pwd">
        <div className="f-pwd-in">
          <p className="f-pwd-t">
            Password set. You can now sign in with your email and password.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="f-pwd">
      <div className="f-pwd-in">
        <div className="f-pwd-row">
          <p className="f-pwd-t">
            Set a password to make it easier to sign in next time.
          </p>
          <div className="f-pwd-acts">
            <button
              type="button"
              onClick={() => setFormOpen((open) => !open)}
              aria-expanded={formOpen}
              aria-controls="password-fields"
              className="f-btn f-btn-sm"
            >
              Set password
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss"
              className="f-pwd-x"
            >
              &times;
            </button>
          </div>
        </div>

        {formOpen && (
          <form id="password-fields" onSubmit={handleSubmit} className="f-well">
            <div className="f-pwd-fields">
              <label className="f-formrow">
                <span className="f-blab">Password</span>
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="f-inp"
                  placeholder="Minimum 8 characters"
                />
              </label>
              <label className="f-formrow">
                <span className="f-blab">Confirm password</span>
                <input
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="f-inp"
                  placeholder="Repeat password"
                />
              </label>
            </div>

            <p className="f-fine">Minimum 8 characters.</p>

            {/* Not red, and `role="alert"` rather than colour: the status triad
                owns saturation and a form validation message is not a verdict
                about anybody's blood (tokens/colours.css). Same treatment as
                every other F form error. */}
            {error && (
              <p className="f-err" role="alert">
                {error}
              </p>
            )}

            <div className="f-pwd-save">
              <button type="submit" disabled={isPending} className="f-btn">
                {isPending ? 'Saving…' : 'Save password'}
                <span className="f-pip" aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

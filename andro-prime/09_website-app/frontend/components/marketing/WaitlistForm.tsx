'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'

/**
 * THE PANEL WAITLIST FORM, rebuilt in Direction F on 2026-09-09.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NOT ONE WORD CHANGED, AND NOT ONE BRANCH.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Every string here is the one that shipped: the placeholder, both button
 * labels, the consent sentence, the error line and the whole success block.
 * The endpoint, the email regex, the `canSubmit` gate and the four-state
 * machine are untouched. What changed is the class attributes and nothing else,
 * which is why this needs no pre-flight of its own (`redesign-copy-register.md`,
 * "what does not belong here: pure design and layout changes that leave the
 * words alone").
 *
 * IT INVENTS NO CONTROLS. `.f-inp`, `.f-consent`, `.f-btn`, `.f-blab` and the
 * two banners are the layer `/test-selector` added on 2026-09-08 and `/auth/*`
 * reused the same day, and DESIGN.md names this file as one of the four surfaces
 * they were named generically FOR: *"they are named for what they are rather
 * than for that page, so `/contact`, `/waitlist`, `/checkout/details` and the
 * five `/auth/*` routes inherit them rather than each inventing a set."*
 *
 * 🔴 THE SUCCESS BLOCK IS A RAISED BANNER AND THE FAILURE IS A RECESSED ONE, and
 * that is the auth ruling rather than a fresh choice. `.f-banner-msg` is a white
 * core with a hairline ring and the ambient shadow; `.f-banner-err` is `--sunk`
 * with an inset ring and a mono key. Raised-versus-recessed is this direction's
 * governing idea, so it is the distinction a reader is already trained on, and
 * it is what carries the hierarchy now that `--flag` is ink and there is no
 * accent to give the message instead.
 *
 * ⚠ THE ERROR IS NOT RED AND MAY NOT BE. `tokens/colours.css`: the status triad
 * owns saturation and a failed form POST is not a verdict about anybody's blood.
 * `role="alert"` announces it instead of tinting it, which is the better
 * mechanism regardless. Same reasoning, same wording, as the `.f-err` block in
 * f-primitives.css.
 *
 * ⚠ NO 18+ GATE HERE, DELIBERATELY. Keith's ruling of 2026-09-08 names three
 * collection points (`/auth/signup`, `/auth/consent`, `/checkout/details`) and
 * `lib/auth/eligibility.ts` is the single rule behind all three. This form
 * collects an email address for a marketing list and creates no account, buys
 * nothing and reads no health data, so it is not a fourth. Adding a date-of-birth
 * field to a two-field newsletter opt-in would collect more personal data for
 * less reason, which is the opposite of what the ruling is for.
 */

type Status = 'idle' | 'submitting' | 'success' | 'error'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface WaitlistFormProps {
  align?: 'left' | 'center'
}

// Client form for the waitlist page (server component, so the interactive
// bits live here). POSTs to /api/forms/waitlist, which upserts the user with
// marketing_consent: true, so submission is gated on an explicit, unticked
// consent checkbox (UK GDPR; no implied/pre-ticked consent for marketing).
export function WaitlistForm({ align = 'left' }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<Status>('idle')

  const emailValid = EMAIL_REGEX.test(email)
  const canSubmit = emailValid && consent && status !== 'submitting'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('submitting')
    try {
      const res = await fetch('/api/forms/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  /* 520px rather than the form's own measure, because the success block is
     prose and the field row is a control. `.f-banner-msg` supplies the ground,
     the ring and the shadow. */
  const centred = align === 'center'

  if (status === 'success') {
    return (
      <div
        className="f-banner f-banner-msg"
        style={{ maxWidth: 520, marginTop: 0, ...(centred ? { marginInline: 'auto' } : null) }}
      >
        <p className="f-blab" style={{ marginBottom: 8 }}>You&rsquo;re on the list</p>
        <p className="f-sub" style={{ fontSize: 15, marginTop: 0 }}>
          Thanks. We&rsquo;ll email you when a new panel lands. If you want one of the three that are
          already available, they&rsquo;re on the <Link href="/kits" className="f-tlink">tests page</Link>.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 520, ...(centred ? { marginInline: 'auto', textAlign: 'left' } : null) }}
    >
      {/* The label is `sr-only` rather than absent. A placeholder is not a label:
          it disappears on the first keystroke, and a reader who has typed and
          come back has nothing left telling them what the field wants. Every
          other F form states the label visibly; this one is a single-field
          inline row where a `.f-blab` above a 520px pill reads as a section
          opener, so the name goes to assistive tech and the placeholder carries
          the sighted case. */}
      <label className="sr-only" htmlFor="waitlist-email">Your email address</label>
      <div className="f-inprow">
        <input
          id="waitlist-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="f-inp"
        />
        <button type="submit" disabled={!canSubmit} className="f-btn">
          {status === 'submitting' ? 'Joining…' : 'Join Waitlist'}
          <span className="f-pip" aria-hidden="true">&rarr;</span>
        </button>
      </div>

      <label className="f-consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>
          Email me when new panels launch, and occasional offers. I can unsubscribe at
          any time. See our{' '}
          <Link href="/privacy">Privacy Policy</Link>.
        </span>
      </label>

      {status === 'error' && (
        <p className="f-err" role="alert">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  )
}

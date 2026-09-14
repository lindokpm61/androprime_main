'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { getPageAttribution } from '@/lib/analytics/page-attribution'

/**
 * THE NEWSLETTER CAPTURE, rebuilt in Direction F on 2026-09-14 (defect register
 * C1). It is the blog's only email capture: `/blog` and, through
 * `ArticleLayout`, the footer of all 22 articles.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WHY IT WAS STILL V2.0 ON ROUTES THE REPORT SCORES AS FINISHED
 * ─────────────────────────────────────────────────────────────────────────
 *
 * `route-conformance.md` counts the distinct `f-` classes a ROUTE renders. This
 * file carried 27 V2.0 tokens and 0 F classes while sitting inside `.fb-news`,
 * which is Direction F, on pages full of Direction F. A per-route count cannot
 * see inside a component, so `/blog` scored full marks with its only conversion
 * control untouched. That is C4, and it is why this rebuild ships with a check
 * that reads FILES rather than routes.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NOT ONE WORD CHANGED, AND ONE LETTER CASE DID
 * ─────────────────────────────────────────────────────────────────────────
 *
 * The consent sentence, both button labels, the error line and the success
 * sentence are the strings that shipped, character for character. The endpoint,
 * the email regex, the `canSubmit` gate and the four-state machine are
 * untouched, so this needs no pre-flight of its own (`redesign-copy-register.md`,
 * "pure design and layout changes that leave the words alone").
 *
 * The one difference is the placeholder, `ENTER EMAIL ADDRESS` → `Enter email
 * address`. The capitals were V2.0 STYLING typed into a string — the old class
 * list set `uppercase` on the same element, so the shouting was said twice — and
 * `.f-inp` is sentence case. Register row 41 made the identical call on
 * `/checkout/details`: *"the only text difference anywhere is letter case on two
 * form-control labels."*
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE `theme` PROP IS GONE, AND THE RAMP IS WHAT REPLACES IT
 * ─────────────────────────────────────────────────────────────────────────
 *
 * It took `'dark' | 'light'` and hand-built a 7-entry class table for each. Both
 * call sites passed `'dark'`, so the light half had never rendered. Under
 * Direction F the parent's ground decides: `.f-on-ink` re-points the ink ramp
 * on itself, so the SAME classes read correctly on paper and on ink with no
 * branch here at all. A prop that re-implements the cascade is the thing the
 * ramp was added to delete, not something to port across.
 *
 * 🔴 THE CONTROLS NEEDED A DARK TREATMENT THAT DID NOT EXIST, and this was the
 * first F form to sit on ink. `.f-on-ink` does not re-point `--core` or
 * `--paper`, which is exactly what `.f-inp` and `.f-btn` paint with, so the
 * field rendered white-on-white and the submit rendered white-on-white. Fixed in
 * `f-primitives.css` ("THE FORM LAYER ON A DARK PANEL"), in the stylesheet
 * rather than here, because `/faq`, `/contact` and any future dark panel with a
 * control on it inherit the same defect.
 *
 * ⚠ THE DISABLED SUBMIT IS THE DEFAULT STATE, so it is the one to look at.
 * "Subscribe" needs a valid address AND a ticked consent box, so the newsletter
 * panel OPENS with a disabled button on both surfaces. Verified as a rendered
 * screenshot rather than a source read.
 *
 * ⚠ THE ERROR IS NOT RED AND MAY NOT BE. `tokens/colours.css`: the status triad
 * owns saturation, and a failed form POST is not a verdict about anybody's
 * blood. `role="alert"` announces it instead of tinting it. Same reasoning, same
 * wording, as `WaitlistForm` and the `.f-err` block in f-primitives.css.
 *
 * POSTs to /api/forms/newsletter, which upserts with marketing_consent: true —
 * so submission is gated on an explicit, unticked consent box (UK GDPR; no
 * implied or pre-ticked consent for marketing). Mirrors WaitlistForm.
 */

type Status = 'idle' | 'submitting' | 'success' | 'error'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface NewsletterFormProps {
  // Where this form sits, recorded as the signup source on both the CIO profile
  // and the first-party `events` row so capture points can be compared.
  source?: string
}

export function NewsletterForm({ source = 'blog' }: NewsletterFormProps) {
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
      const res = await fetch('/api/forms/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, ...getPageAttribution() }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  /* `marginTop: 0` because `.f-banner` carries a bottom margin meant for a
     banner sitting ABOVE a form, and this one replaces the form. */
  if (status === 'success') {
    return (
      <div className="f-banner f-banner-msg" style={{ marginTop: 0, marginBottom: 0 }}>
        <p style={{ margin: 0 }}>
          You&rsquo;re subscribed. Look out for the next deep-dive in your inbox.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* The label is `sr-only` rather than absent, for the reason WaitlistForm
          states: a placeholder is not a label, it disappears on the first
          keystroke, and a reader who has typed and come back has nothing left
          telling them what the field wants. The id carries the source so two
          instances on one page could never collide. */}
      <label className="sr-only" htmlFor={`newsletter-email-${source}`}>Your email address</label>
      <div className="f-inprow">
        {/* `id`, `name` and a real `<label for>` are defect register M3, which
            said this field had none of the three and was named only by its
            placeholder. `name` is not needed by the POST — the value is React
            state, not FormData — and is here because M3 asks for it and because
            it is what a password manager and an autofill heuristic read. */}
        <input
          id={`newsletter-email-${source}`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          className="f-inp"
        />
        <button type="submit" disabled={!canSubmit} className="f-btn">
          {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
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
          Email me the newsletter. I can unsubscribe at any time. See our{' '}
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

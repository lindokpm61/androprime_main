'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'

/**
 * THE SUPPLEMENT EARLY-ACCESS FORM.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * TWO WORLDS, ONE COMPONENT, AND THE HOST DECLARES WHICH. Added 2026-09-09.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 🔴 WHY A VARIANT AND NOT A REPLACEMENT. Six routes render this form. Four of
 * them (`/supplement-waitlist`, `/supplements`, `/supplements/daily-stack`,
 * `/supplements/collagen`) were rebuilt in Direction F on 2026-09-09. Two of them
 * (`/lp/collagen`, `/lp/daily-stack`) are still V2.0 and are BLOCKED from rebuild
 * behind the 2026-09-07 auto-renew ruling. Restyling this file outright therefore
 * moved the seam rather than closing it: the conformance run immediately after
 * showed `/lp/collagen` and `/lp/daily-stack` jumping from 0 F classes to 10,
 * which is not progress, it is a Direction F card sitting inside a brutalist page
 * nobody has reviewed.
 *
 * That is precisely the finding DESIGN.md records as gap 4 for `RelatedArticles`,
 * whose six call sites also spanned two deliberately-different worlds, and the
 * ruled fix there is the fix here: *"make the component render in its HOST's
 * world (a variant prop)... The host declares its own world, which is the one
 * thing the host reliably knows."*
 *
 * ⚠ IT DEFAULTS TO `'v2'`, so the two untouched routes are byte-identical to
 * what they rendered before this change, down to the class strings. Same default
 * direction as `RelatedArticles`, and for the same reason: the pages that did not
 * ask to change should not have to opt out of changing.
 *
 * ⚠ THERE IS NO AUTO-DETECTION AND THERE SHOULD NOT BE. A client component
 * could read the pathname, and that would couple the routing table to the design
 * system: an `/lp/x` page moved to `/offers/x` would silently change appearance.
 * Same reasoning `RelatedArticles` records.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * BEHAVIOUR IS SHARED AND IS UNCHANGED IN BOTH WORLDS.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Every string is the one that shipped: the field label, the consent sentence,
 * both button labels, the fine print, and both success headings with their shared
 * body. The endpoint, the five-state machine, the `alreadyListed` branch, the
 * server error passthrough and the three hidden source fields are untouched, and
 * they live once, above the two renderers, so the two worlds cannot drift on
 * anything except appearance.
 *
 * 🔴 IN THE F WORLD: a tray holding a core, because this holds a TRANSACTION.
 * The containment ruling of 2026-09-02 keeps a card for an instrument or a
 * transaction and gives prose none; an opt-in that writes a row and takes a
 * consent is the second kind. No second field vocabulary is invented: `.f-inp`,
 * `.f-consent`, `.f-blab`, `.f-btn f-btn-block` and the two banners are the layer
 * `/test-selector` added and `/auth/*` reused.
 *
 * ⚠ THE F ERROR IS NOT RED. It carries `role="alert"` and takes `.f-banner-err`'s
 * recessed ground, per the 2026-09-03 saturation ruling: the status triad owns
 * saturation and a failed POST is not a verdict about anybody's blood. The V2.0
 * branch rendered it in a bordered grey box, so this is not a change of weight.
 *
 * 🔴 A COPY DEFECT WAS FOUND HERE AND DELIBERATELY NOT FIXED, because fixing it
 * is a copy change and that pass was a restyle. `/supplement-waitlist`'s FAQ
 * answers *"Can I choose which product I want updates about?"* with *"Yes. The
 * form lets you tell us whether you are interested in the Daily Stack, the Joint
 * and Recovery Collagen, or both. You can change your mind later."* THIS FORM HAS
 * NO SUCH CONTROL in either world and never has: `interestedInProduct` is a prop
 * the PAGE sets and this component forwards as a hidden field. The claim reads as
 * true because the two detail routes pass a real value, so the FIELD exists in
 * the payload while the CONTROL does not. Either the control gets built or the
 * answer gets rewritten; both are Keith's. Register row 38; OBS-670.
 */

export interface SupplementWaitlistFormProps {
  sourceMarker?: string
  sourceKit?: string
  interestedInProduct?: string
  /** The host's design world. Defaults to the V2.0 markup that shipped. */
  variant?: 'v2' | 'f'
}

type Status = 'idle' | 'submitting' | 'success' | 'already' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Phase 0a supplement early-access opt-in form. No payment, no commitment.
// Submission is gated on an explicit, unticked GDPR consent checkbox (UK
// GDPR rules out pre-ticked marketing consent). Copy avoids medicinal
// claims, EFSA-restricted wording, and em-dashes per the Andro Prime
// brand voice rules.
export function SupplementWaitlistForm({
  sourceMarker,
  sourceKit,
  interestedInProduct,
  variant = 'v2',
}: SupplementWaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const emailValid = EMAIL_RE.test(email)
  const canSubmit = emailValid && consent && status !== 'submitting'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('submitting')
    setErrorMessage(null)

    try {
      const res = await fetch('/api/supplement-waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent: true,
          source_marker: sourceMarker,
          source_kit: sourceKit,
          interested_in_product: interestedInProduct,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setErrorMessage(data?.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      const data = await res.json()
      setStatus(data.alreadyListed ? 'already' : 'success')
    } catch {
      setErrorMessage('Network error. Please try again.')
      setStatus('error')
    }
  }

  const done = status === 'success' || status === 'already'

  /* The three hidden fields, identical in both worlds. */
  const hidden = (sourceMarker || sourceKit || interestedInProduct) ? (
    <>
      {sourceMarker && <input type="hidden" name="source_marker" value={sourceMarker} />}
      {sourceKit && <input type="hidden" name="source_kit" value={sourceKit} />}
      {interestedInProduct && (
        <input type="hidden" name="interested_in_product" value={interestedInProduct} />
      )}
    </>
  ) : null

  /* ------------------------------------------------------------------ F ---- */

  if (variant === 'f') {
    if (done) {
      return (
        <div className="f-tray">
          <div className="f-core">
            <p className="f-blab">
              {status === 'already' ? 'Already on the list' : 'You’re on the list'}
            </p>
            <h3 className="f-h4" style={{ marginTop: 10 }}>
              {status === 'already'
                ? 'Good news. We already had you.'
                : 'Thanks. We’ll be in touch.'}
            </h3>
            <p className="f-sub" style={{ fontSize: 15 }}>
              You will be one of the first to know when our supplement range is
              ready. No payment was taken. You can unsubscribe at any time by
              emailing{' '}
              <a href="mailto:hello@andro-prime.com" className="f-tlink">
                hello@andro-prime.com
              </a>
              .
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="f-tray">
        <div className="f-core">
          <form onSubmit={handleSubmit}>
            <label className="f-formrow">
              <span className="f-blab">Email</span>
              <input
                type="email"
                inputMode="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="f-inp"
                autoComplete="email"
              />
            </label>

            <label className="f-consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                Email me when the supplement range is ready, plus occasional
                early-access offers. I can unsubscribe at any time. See our{' '}
                <Link href="/privacy">Privacy Policy</Link>.
              </span>
            </label>

            {errorMessage && (
              <div className="f-banner f-banner-err" role="alert">
                <span className="f-banner-k">Error</span>
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="f-btn f-btn-block"
              style={{ marginTop: 20 }}
            >
              {status === 'submitting' ? 'Joining…' : 'Join the early-access list'}
              <span className="f-pip" aria-hidden="true">&rarr;</span>
            </button>

            <p className="f-fine" style={{ marginTop: 14 }}>
              No payment. No commitment. We email you when the supplement range is
              ready.
            </p>

            {hidden}
          </form>
        </div>
      </div>
    )
  }

  /* ---------------------------------------------------------------- V2.0 ----
     Byte-identical to what shipped before 2026-09-09. `/lp/collagen` and
     `/lp/daily-stack` render this and must keep rendering exactly this until
     they are rebuilt. Do not "tidy" it. */

  if (done) {
    return (
      <div className="bg-white border-4 border-black p-8 md:p-10 text-left">
        <div className="data-label mb-3">
          {status === 'already' ? 'Already on the list' : 'You’re on the list'}
        </div>
        <h3 className="text-2xl md:text-3xl font-sans font-black uppercase tracking-tighter mb-3">
          {status === 'already'
            ? 'Good news. We already had you.'
            : 'Thanks. We’ll be in touch.'}
        </h3>
        <p className="font-serif text-base leading-relaxed">
          You will be one of the first to know when our supplement range is
          ready. No payment was taken. You can unsubscribe at any time by
          emailing{' '}
          <a href="mailto:hello@andro-prime.com" className="font-bold underline">
            hello@andro-prime.com
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-4 border-black p-6 md:p-8 space-y-5"
    >
      <label className="block">
        <span className="data-label block mb-2">Email</span>
        <input
          type="email"
          inputMode="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-2 border-black px-4 py-3 font-serif text-base bg-white focus:outline-none focus:bg-gray-50"
          autoComplete="email"
        />
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 w-5 h-5 shrink-0 border-2 border-black accent-black"
        />
        <span className="font-serif text-sm leading-relaxed">
          Email me when the supplement range is ready, plus occasional
          early-access offers. I can unsubscribe at any time. See our{' '}
          <Link href="/privacy" className="underline hover:no-underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {errorMessage && (
        <p className="font-serif text-sm text-black border-2 border-black bg-gray-100 p-3">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-white"
      >
        {status === 'submitting' ? 'Joining…' : 'Join the early-access list'}
      </button>

      <p className="font-serif text-xs text-gray-600">
        No payment. No commitment. We email you when the supplement range is
        ready.
      </p>

      {hidden}
    </form>
  )
}

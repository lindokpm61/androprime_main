'use client'

import { useState } from 'react'

/**
 * Starts the membership Stripe Checkout session.
 *
 * A membership is a subscription SLUG, not a new subsystem, so this posts to
 * the same route every other recurring product uses. That route re-checks
 * MEMBERSHIP_ENABLED server-side: this button being on screen is never what
 * authorises the sale.
 */
export function JoinButton({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  async function handleClick() {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/checkout/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug: 'membership' }),
      })

      if (res.status === 401) {
        window.location.href = '/auth/login?next=/account/membership'
        return
      }

      const data = await res.json()

      // He is already a member, or became one between this page rendering and
      // this click — a double submit, or a tab left open. The button is only
      // ever on /account/membership, so reloading it is what corrects the stale
      // view: the page re-derives member-versus-paywall state and shows him the
      // membership he has. Retrying would be refused again, and the generic
      // error below would invite exactly that.
      if (res.status === 409 && data.reason === 'already-a-member') {
        window.location.href = '/account/membership'
        return
      }

      if (data.url) {
        window.location.href = data.url
        return
      }
      setError(true)
    } catch {
      setError(true)
    }
    setLoading(false)
  }

  return (
    <>
      <button onClick={handleClick} disabled={loading} className="f-btn">
        {loading ? 'Redirecting to checkout…' : children}
      </button>
      {error && (
        <p role="alert" className="f-err">
          We could not start checkout. Please try again.
        </p>
      )}
    </>
  )
}

'use client'

import { useState } from 'react'

/**
 * The route to Stripe's hosted billing portal.
 *
 * 🔴 THE CLICK USED TO BE A SILENT NO-OP AND THAT WAS THE WHOLE DEFECT (fixed
 * 2026-09-11, batch 3). The handler read `data.url` and navigated if it was
 * there. If it was not, and `app/api/checkout/portal/route.ts` 404s for any
 * customer with no row in `supplement_subscriptions`, which under the
 * 2026-09-07 auto-renew ruling is EVERY membership-only kit buyer, then the
 * function fell through, re-enabled the button, and changed nothing. The
 * customer clicked "Manage billing" on the one page that exists to let him
 * cancel, and the page did nothing at all, with no error and nothing in view to
 * suggest a retry would help.
 *
 * It now fails visibly. That is deliberately ALL this change does: the
 * underlying gap (a membership owns a row in `memberships`, which neither
 * `getSubscriptions` nor the portal route reads) is a data and billing decision
 * recorded in 09_website-app/STATE.md, and inventing a second lookup here would
 * put that decision in the least visible possible place. A button that says it
 * failed is honest about the same state the silent one hid.
 *
 * The error copy names no cause, because the causes are different (no Stripe
 * customer, no subscription row, a portal configuration error) and this
 * component cannot tell them apart. It offers the one route that always works.
 */

interface Props {
  className?: string
  children: React.ReactNode
}

export function BillingPortalButton({ className, children }: Props) {
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  async function handleClick() {
    setLoading(true)
    setFailed(false)
    try {
      const res = await fetch('/api/checkout/portal', {
        method: 'POST',
      })

      if (res.status === 401) {
        window.location.href = '/auth/login'
        return
      }

      // A non-OK response has no portal URL to read, and reading one out of a
      // 404 body is what made the old failure invisible.
      if (!res.ok) {
        setFailed(true)
        setLoading(false)
        return
      }

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
        return
      }
      // 200 with no url. Should not happen, and if it does it is still a failure
      // rather than a reason to do nothing.
      setFailed(true)
    } catch {
      // Network error. Same visible outcome: the customer needs to know the
      // click did not work, not to be left guessing.
      setFailed(true)
    }
    setLoading(false)
  }

  return (
    <>
      <button onClick={handleClick} disabled={loading} className={className}>
        {loading ? 'Opening portal…' : children}
      </button>
      {failed && (
        <p className="f-err" role="alert">
          We could not open the billing portal. Email{' '}
          <a href="mailto:support@andro-prime.com">support@andro-prime.com</a> and we will sort it
          out.
        </p>
      )}
    </>
  )
}

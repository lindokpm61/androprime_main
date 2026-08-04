'use client'

// Error boundary for the signed-in app (results dashboard, subscriptions, account,
// status pages). Added 2026-08-04: before this, the app had NO error.tsx anywhere,
// so any thrown error fell through to global-error.tsx: an unstyled page with no
// branding, no explanation and no way back. A customer who had just paid for a blood
// test saw a bare "Something went wrong" and had no route to their results.
//
// The common case here is an expired or destroyed session: a server action calls
// revalidatePath, the (app) layout re-renders, requireAuthenticatedUser() calls
// redirect(), and the thrown NEXT_REDIRECT surfaces to the client as
// "An unexpected response was received from the server." So this boundary leads
// with signing back in, which resolves it in the overwhelming majority of cases.

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import Link from 'next/link'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex justify-center w-full pb-24">
      <div className="w-full max-w-[560px] px-6 pt-16 flex flex-col gap-8">
        <section className="bg-black text-white py-8 px-6 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-white shrink-0 inline-block" />
            <span className="font-mono text-xs tracking-[0.15em] uppercase mt-0.5">
              Something went wrong
            </span>
          </div>
          <h1 className="font-black font-sans text-[1.6rem] leading-tight uppercase tracking-tighter">
            We could not load this page.
          </h1>
          <p className="font-serif text-[15px] leading-relaxed">
            This is usually because you have been signed out. Your results are safe and
            nothing has been lost. Signing back in usually sorts it.
          </p>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/auth/login?next=/results-dashboard"
            className="border-2 border-black bg-black px-5 py-3 font-sans text-xs font-black uppercase tracking-[0.18em] text-white text-center transition hover:bg-white hover:text-black"
          >
            Sign in again
          </Link>
          <button
            type="button"
            onClick={reset}
            className="border-2 border-black bg-white px-5 py-3 font-sans text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-black hover:text-white"
          >
            Try again
          </button>
        </div>

        <p className="font-serif text-sm text-gray-600">
          Still stuck? Email{' '}
          <a href="mailto:support@andro-prime.com" className="underline">
            support@andro-prime.com
          </a>
          {error.digest ? ` and quote reference ${error.digest}.` : '.'}
        </p>
      </div>
    </div>
  )
}

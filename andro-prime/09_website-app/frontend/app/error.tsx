'use client'

// Root error boundary for the marketing site. Added 2026-08-04 alongside
// app/(app)/error.tsx: the app previously had no error.tsx at all, so every error
// anywhere fell through to global-error.tsx, which renders its own bare <html> with
// no styling, no branding and no navigation. global-error.tsx is now what it should
// be: the last resort for a failure in the root layout itself, not the routine
// handler for any thrown error.

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import Link from 'next/link'

export default function RootError({
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
    <div className="flex justify-center w-full min-h-[60vh] pb-24">
      <div className="w-full max-w-[560px] px-6 pt-16 flex flex-col gap-8">
        <p className="data-label">Error</p>
        <h1 className="font-black font-sans text-3xl uppercase tracking-tighter">
          Something went wrong.
        </h1>
        <p className="font-serif text-[15px] leading-relaxed">
          Sorry, this page failed to load. It has been logged and we will look into it.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={reset}
            className="border-2 border-black bg-black px-5 py-3 font-sans text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border-2 border-black bg-white px-5 py-3 font-sans text-xs font-black uppercase tracking-[0.18em] text-black text-center transition hover:bg-black hover:text-white"
          >
            Back to site
          </Link>
        </div>

        <p className="font-serif text-sm text-gray-600">
          Need help? Email{' '}
          <a href="mailto:support@andro-prime.com" className="underline">
            support@andro-prime.com
          </a>
          {error.digest ? ` and quote reference ${error.digest}.` : '.'}
        </p>
      </div>
    </div>
  )
}

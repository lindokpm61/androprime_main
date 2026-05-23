import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/session'
// NOTE(merge): getSupplementWaitlistStatus is being built on Agent 1's branch
// alongside the SupplementWaitlistForm component. If this import is unresolved
// when this branch lands, the type-check will fail until both branches are
// merged together.
// FIXME(merge): Agent 1's lib helper
import { getSupplementWaitlistStatus } from '@/lib/supplement-waitlist/getSupplementWaitlistStatus'

export const metadata: Metadata = {
  title: 'Supplement Waitlist Status',
  robots: { index: false, follow: false },
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function SupplementWaitlistStatusPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const status = await getSupplementWaitlistStatus(user.id)

  const eyebrow = 'Supplement waitlist'
  const heading = status.isOnList
    ? "You're on the supplement waitlist."
    : 'Not on the waitlist yet.'
  const body = status.isOnList
    ? `You were added on ${status.listedAt ? formatDate(status.listedAt) : 'an earlier date'}. We'll email you the moment our supplement range is ready to ship, including details of your founding-customer discount. No payment is required.`
    : 'You are not on the supplement waitlist yet. Joining is free. No payment, no commitment. We email you when the range is live.'
  const cta = status.isOnList ? null : { label: 'Join the supplement waitlist', href: '/supplement-waitlist' }

  return (
    <div className="founding-member-status">
      <div className="founding-member-status__inner">
        <div className="founding-member-status__panel">
          <p className="data-label text-xs mb-6">{eyebrow}</p>
          <h1 className="founding-member-status__heading">{heading}</h1>
          <p className="founding-member-status__body">{body}</p>
          {cta && (
            <Link
              href={cta.href}
              className="inline-block bg-black text-white font-mono text-xs uppercase tracking-wider px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              {cta.label}
            </Link>
          )}
        </div>

        <div className="mt-8">
          <p className="font-serif text-sm" style={{ color: 'var(--color-gray-500)' }}>
            Want to be removed from the list? Email{' '}
            <a href="mailto:hello@andro-prime.com" className="underline">hello@andro-prime.com</a>
            {' '}and we&rsquo;ll take you off.
          </p>
        </div>
      </div>
    </div>
  )
}

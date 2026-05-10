import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/session'
import { getFoundingMemberListStatus } from '@/lib/founding-member/getFoundingMemberListStatus'

export const metadata: Metadata = {
  title: 'Founding Member Status',
  robots: { index: false, follow: false },
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function FoundingMemberStatusPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const status = await getFoundingMemberListStatus(user.id)

  const eyebrow = 'Founding member'
  const heading = status.isOnList
    ? "You're on the founding-member list."
    : 'Not on the list yet.'
  const body = status.isOnList
    ? `You were added on ${status.listedAt ? formatDate(status.listedAt) : 'an earlier date'}. We'll be in touch as soon as our regulated TRT programme is live. No payment is required.`
    : 'You are not on the founding-member list yet. Joining is free — no payment, no commitment. We email you when our regulated TRT programme is live.'
  const cta = status.isOnList ? null : { label: 'Join the founding-member list', href: '/founding-member' }

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

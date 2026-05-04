import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/session'
import { getDepositStatus } from '@/lib/founding-member/getDepositStatus'
import type { DepositState } from '@/lib/founding-member/getDepositStatus'

export const metadata: Metadata = {
  title: 'Founding Member Status',
  robots: { index: false, follow: false },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

interface PanelContent {
  eyebrow: string
  heading: string
  body: string
  cta?: { label: string; href: string }
}

function getPanelContent(deposit: DepositState): PanelContent {
  switch (deposit.state) {
    case 'not-started':
      return {
        eyebrow: 'Founding member',
        heading: 'Reserve your place',
        body: 'Pay the £75 deposit now to secure your place at the front of the queue when we launch TRT. Fully refundable, applied as credit when you sign up.',
        cta: { label: 'Learn more and pay deposit', href: '/founding-member' },
      }
    case 'pending':
      return {
        eyebrow: 'Founding member',
        heading: 'Your deposit is being processed',
        body: "We've received your payment request. This usually clears within a few minutes. Check back shortly.",
      }
    case 'paid':
      return {
        eyebrow: 'Founding member: confirmed',
        heading: "You're in.",
        body: `Your £75 deposit was confirmed on ${formatDate(deposit.paidAt)}. You'll be among the first contacted when Andro Prime launches TRT. We'll be in touch.`,
      }
    case 'cancelled':
      return {
        eyebrow: 'Founding member',
        heading: 'Deposit cancelled',
        body: 'Your deposit was not completed. If this was unexpected, contact us at support@andro-prime.com.',
        cta: { label: 'Try again', href: '/founding-member' },
      }
    case 'refunded':
      return {
        eyebrow: 'Founding member',
        heading: 'Deposit refunded',
        body: "Your deposit has been returned. You're welcome to re-apply when TRT launches.",
        cta: { label: 'Learn more', href: '/founding-member' },
      }
  }
}

export default async function FoundingMemberStatusPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const deposit = await getDepositStatus(user.id)
  const panel = getPanelContent(deposit)

  return (
    <div className="founding-member-status">
      <div className="founding-member-status__inner">
        <div className="founding-member-status__panel">
          <p className="data-label text-xs mb-6">{panel.eyebrow}</p>
          <h1 className="founding-member-status__heading">{panel.heading}</h1>
          <p className="founding-member-status__body">{panel.body}</p>
          {panel.cta && (
            <Link
              href={panel.cta.href}
              className="inline-block bg-black text-white font-mono text-xs uppercase tracking-wider px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              {panel.cta.label}
            </Link>
          )}
        </div>

        <div className="mt-8">
          <p className="font-serif text-sm" style={{ color: 'var(--color-gray-500)' }}>
            Questions? Email{' '}
            <a
              href="mailto:support@andro-prime.com"
              className="underline"
            >
              support@andro-prime.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

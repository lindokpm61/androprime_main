import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/session'
import { getSubscriptions } from '@/lib/subscriptions/getSubscriptions'
import type { SubscriptionRow, SubscriptionStatus } from '@/lib/subscriptions/getSubscriptions'
import { BillingPortalButton } from '@/components/commerce/BillingPortalButton'

export const metadata: Metadata = {
  title: 'Your Subscriptions',
  robots: { index: false, follow: false },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active:     'Active',
  trialing:   'Trial',
  past_due:   'Payment due',
  incomplete: 'Incomplete',
  unpaid:     'Unpaid',
  cancelled:  'Cancelled',
}

const STATUS_CLASS: Record<SubscriptionStatus, string> = {
  active:     'status-indicator--optimal',
  trialing:   '',
  past_due:   'status-indicator--warning',
  incomplete: 'status-indicator--warning',
  unpaid:     'status-indicator--warning',
  cancelled:  'status-indicator--gp-block',
}

function SubscriptionCard({ sub }: { sub: SubscriptionRow }) {
  return (
    <div className="subscriptions__card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="subscriptions__product">{sub.productName}</h2>
          {sub.price && (
            <p className="subscriptions__price">{sub.price}</p>
          )}
        </div>
        <span className={`font-mono text-xs uppercase tracking-wider ${STATUS_CLASS[sub.status]}`}>
          {STATUS_LABELS[sub.status]}
        </span>
      </div>
      <p className="subscriptions__meta">
        Started {formatDate(sub.startedAt)}
      </p>
      <div className="mt-6 pt-4 border-t-2 border-gray-100">
        <BillingPortalButton className="subscriptions__manage">
          Manage billing
        </BillingPortalButton>
      </div>
    </div>
  )
}

export default async function SubscriptionsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const subscriptions = await getSubscriptions(user.id)

  if (subscriptions.length === 0) {
    return (
      <div className="subscriptions">
        <div className="subscriptions__inner">
          <p className="data-label text-xs mb-8">Your subscriptions</p>
          <div className="subscriptions__empty">
            <p className="font-serif text-base mb-6" style={{ color: 'var(--color-gray-600)' }}>
              You don't have an active subscription.
            </p>
            <Link
              href="/supplements"
              className="inline-block bg-black text-white font-mono text-xs uppercase tracking-wider px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              Browse supplements
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="subscriptions">
      <div className="subscriptions__inner">
        <p className="data-label text-xs mb-8">Your subscriptions</p>
        {subscriptions.map((sub) => (
          <SubscriptionCard key={sub.id} sub={sub} />
        ))}
      </div>
    </div>
  )
}

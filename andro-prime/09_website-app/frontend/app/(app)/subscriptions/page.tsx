import type { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth/session'
import { markViewedCancelPage } from '@/lib/customerio/emit'
import { getSubscriptions } from '@/lib/subscriptions/getSubscriptions'
import type { SubscriptionRow, SubscriptionStatus } from '@/lib/subscriptions/getSubscriptions'
import { BillingPortalButton } from '@/components/commerce/BillingPortalButton'
import { urlFor } from '@/lib/hosts'

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
        <span
          className={`border-2 border-black px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.15em] ${
            sub.status === 'active' || sub.status === 'trialing'
              ? 'bg-white text-black'
              : 'bg-black text-white'
          }`}
        >
          {STATUS_LABELS[sub.status]}
        </span>
      </div>
      <p className="subscriptions__meta">
        Started {formatDate(sub.startedAt)}
      </p>
      <div className="mt-6 pt-4 border-t-2 border-gray-200">
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

  // Viewing the billing/subscriptions screen is a cancel-intent signal. Flag the
  // CIO profile (viewed_cancel_page) so segment 20 can enrol the customer into
  // the seq-05 churn-prevention campaign. Resilient + idempotent (see helper);
  // run alongside the data fetch so it doesn't add serial latency.
  const [subscriptions] = await Promise.all([
    getSubscriptions(user.id),
    markViewedCancelPage(user.email),
  ])

  if (subscriptions.length === 0) {
    return (
      <div className="subscriptions">
        <div className="subscriptions__inner">
          <p className="data-label text-xs mb-8">Your subscriptions</p>
          <div className="subscriptions__empty">
            <p className="font-serif text-base mb-6" style={{ color: 'var(--color-gray-600)' }}>
              You don't have an active subscription.
            </p>
            {/* Cross-host: /supplements is MARKETING on the apex. */}
            <a
              href={urlFor('/supplements')}
              className="inline-block bg-black text-white border-4 border-black font-sans font-black text-sm uppercase tracking-widest px-6 py-3 hover:bg-white hover:text-black transition-colors"
            >
              Browse supplements
            </a>
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

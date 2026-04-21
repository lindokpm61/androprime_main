import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/session'
import { getAccountData } from '@/lib/account/getAccountData'
import type { KitOrderSummary, OrderStatus } from '@/lib/account/getAccountData'

export const metadata: Metadata = {
  title: 'Your Account',
  robots: { index: false, follow: false },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending:           'Order placed',
  paid:              'Payment confirmed',
  dispatched:        'Kit dispatched',
  sample_registered: 'Sample registered',
  processing:        'Processing',
  results_received:  'Results ready',
  cancelled:         'Cancelled',
  refunded:          'Refunded',
}

function OrderRow({ order }: { order: KitOrderSummary }) {
  return (
    <div className="account__order-row">
      <span className="font-serif">{order.kitName}</span>
      <span style={{ color: 'var(--color-gray-500)' }}>
        {ORDER_STATUS_LABELS[order.status]}
      </span>
      <span style={{ color: 'var(--color-gray-500)' }}>{formatDate(order.orderedAt)}</span>
      <span>
        {order.hasResults ? (
          <Link href="/results-dashboard" className="underline text-black">
            View results
          </Link>
        ) : (
          <span style={{ color: 'var(--color-gray-400)' }}>Awaiting results</span>
        )}
      </span>
    </div>
  )
}

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const account = await getAccountData(user.id, user.email ?? '')

  return (
    <div className="account">
      <div className="account__inner">
        <p className="data-label text-xs mb-8">Your account</p>

        {/* Profile */}
        <div className="account__section">
          <h2 className="account__section-heading">Profile</h2>
          <div className="account__profile-field">
            <span className="account__profile-label">Email</span>
            <span className="account__profile-value">{account.email}</span>
          </div>
          {account.age !== null && (
            <div className="account__profile-field">
              <span className="account__profile-label">Age</span>
              <span className="account__profile-value">{account.age}</span>
            </div>
          )}
        </div>

        {/* Test history */}
        <div className="account__section">
          <h2 className="account__section-heading">Test history</h2>
          {account.orders.length === 0 ? (
            <div>
              <p className="account__empty">No tests ordered yet.</p>
              <Link
                href="/kits"
                className="inline-block mt-4 bg-black text-white font-mono text-xs uppercase tracking-wider px-6 py-3 hover:bg-stone-800 transition-colors"
              >
                Browse tests
              </Link>
            </div>
          ) : (
            <>
              <div className="account__order-header">
                <span>Kit</span>
                <span>Status</span>
                <span>Date</span>
                <span>Action</span>
              </div>
              {account.orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </>
          )}
        </div>

        {/* Quick links */}
        <div className="account__section">
          <h2 className="account__section-heading">Manage</h2>
          <Link
            href="/subscriptions"
            className="account__quicklink"
          >
            {account.hasActiveSubscription ? 'Your subscriptions' : 'Browse supplements'}
          </Link>
          <Link
            href="/founding-member-status"
            className="account__quicklink"
          >
            {account.hasDeposit ? 'Founding member status' : 'Become a founding member'}
          </Link>
          <a
            href="mailto:support@andro-prime.com"
            className="account__quicklink"
          >
            Contact support
          </a>
        </div>
      </div>
    </div>
  )
}

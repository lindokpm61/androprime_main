import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/session'
import { getAccountData } from '@/lib/account/getAccountData'
import type { KitOrderSummary, OrderStatus } from '@/lib/account/getAccountData'
import { isAccountDataControlsEnabled, isAccountAddressEnabled } from '@/lib/flags'
import { DataPrivacySection } from '@/components/account/DataPrivacySection'
import { AddressSection } from '@/components/account/AddressSection'
import { getAddress } from '@/lib/account/getAddress'
import { urlFor } from '@/lib/hosts'

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
  sample_failed:     'Sample issue: recollection',
  cancelled:         'Cancelled',
  refunded:          'Refunded',
}

function OrderRow({ order }: { order: KitOrderSummary }) {
  return (
    <div className="account__order-row">
      <span className="font-serif">
        {order.kitName}
        {order.orderRef && (
          <span className="block font-mono text-xs mt-1" style={{ color: 'var(--color-gray-500)' }}>
            {order.orderRef}
          </span>
        )}
      </span>
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

  // Delivery-address surface: dark behind ACCOUNT_ADDRESS_ENABLED (default OFF),
  // so the address is only queried when the section is actually rendered and the
  // page is byte-identical to before when the flag is unset. Flip on alongside
  // BUNDLES_ENABLED so the bundle address-check email links to a live surface.
  const address = isAccountAddressEnabled() ? await getAddress(user.id) : null

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
              {/* Cross-host: /kits is MARKETING on the apex, this page is on
                  the app host. Must be a plain <a>, never next/link, which
                  cannot client-navigate across origins. */}
              <a
                href={urlFor('/kits')}
                className="inline-block mt-4 bg-black text-white border-4 border-black font-sans font-black text-sm uppercase tracking-widest px-6 py-3 hover:bg-white hover:text-black transition-colors"
              >
                Browse tests
              </a>
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
          {/* Founding-member quick-link removed 2026-06-04 (FM take-down: low-T routing decision).
              account.isOnFoundingMemberList still resolves; restore this link if the list reopens. */}
          <a
            href="mailto:support@andro-prime.com"
            className="account__quicklink"
          >
            Contact support
          </a>
        </div>

        {/* Delivery address (dark behind ACCOUNT_ADDRESS_ENABLED). Edits the
            same users-row columns the bundle second-kit dispatch reads. */}
        {address && <AddressSection initial={address} />}

        {/* Data & privacy (export + data-use statement + erasure request).
            Dark behind ACCOUNT_DATA_CONTROLS_ENABLED (default OFF): the account
            page is byte-identical to before when the flag is unset. Pending a
            compliance read of the data-use wording + Keith confirming the
            erasure ops-alert address/SLA. See
            docs/2026-07-17-bucket-ab-implementation-plan.md. */}
        {isAccountDataControlsEnabled() && <DataPrivacySection />}
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { isAdmin } from '@/lib/auth/isAdmin'
import { getCashPosition } from '@/lib/admin/getCashPosition'
import { getGateMetrics } from '@/lib/admin/getGateMetrics'
import { findOrders, type OrderSearchResult } from '@/lib/admin/findOrders'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
}

// Live data only — never cache or pre-render.
export const dynamic = 'force-dynamic'

function gbp(n: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(n)
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

interface PageProps {
  searchParams: Promise<{ q?: string | string[] }>
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login?next=/admin/dashboard')
  if (!isAdmin(user)) redirect('/')

  const params = await searchParams
  const qParam = params.q
  const orderQuery = (Array.isArray(qParam) ? qParam[0] : qParam)?.trim() ?? ''

  const [cash, gate, orders] = await Promise.all([
    getCashPosition(),
    getGateMetrics(),
    orderQuery ? findOrders(orderQuery) : Promise.resolve(null),
  ])

  return (
    <main id="main-content" style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
      <header style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-gray-500)', margin: 0 }}>
          Andro Prime · internal
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '4px 0 0' }}>Admin dashboard</h1>
      </header>

      <section
        aria-label="Cash position"
        style={{
          border: '2px solid #000',
          padding: '24px 28px',
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0, color: 'var(--color-gray-500)' }}>
          Stripe cash position
        </h2>

        {cash.error ? (
          <p style={{ color: '#000000', marginTop: 16 }}>
            Stripe Balance API error: {cash.error}
          </p>
        ) : (
          <>
            <p style={{ fontSize: 40, fontWeight: 700, margin: '8px 0 4px' }}>
              {gbp(cash.totalGbp)}
            </p>
            <p style={{ margin: '0 0 16px', color: 'var(--color-gray-500)' }}>
              Available {gbp(cash.availableGbp)} · Pending {gbp(cash.pendingGbp)}
            </p>
            <p style={{ fontSize: 12, color: 'var(--color-gray-500)', margin: 0 }}>
              Live from Stripe Balance API · fetched {formatTimestamp(cash.fetchedAt)}
            </p>
          </>
        )}
      </section>

      <section
        aria-label="Gate metrics"
        style={{
          border: '2px solid #000',
          padding: '24px 28px',
        }}
      >
        <h2 style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0, color: 'var(--color-gray-500)' }}>
          Gate metrics
        </h2>

        {gate.error ? (
          <p style={{ color: '#000000', marginTop: 16 }}>
            Gate metrics fetch error: {gate.error}
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
            <tbody>
              <MetricRow label="Total kits sold" value={String(gate.totalKitsSold)} target="Gate 0A: 50+" />
              <MetricRow label="Founding-member list opt-ins (non-cash)" value={String(gate.fmListOptins)} target="—" />
              <MetricRow
                label="Kit 2/3 → subscription conversion"
                value={gate.kit23ToSubConversionPct === null ? '—' : `${gate.kit23ToSubConversionPct.toFixed(1)}%`}
                target="Gate 0B: 10%+"
              />
              <MetricRow label="Active supplement subscriptions" value={String(gate.activeSubCount)} target="Gate 0C: 30+" />
              <MetricRow label="Supplement MRR" value={gbp(gate.supplementMrrGbp)} target="Gate 0C: £1,000+" />
            </tbody>
          </table>
        )}

        <p style={{ fontSize: 12, color: 'var(--color-gray-500)', margin: '16px 0 0' }}>
          Source: v_gate_tracker · fetched {formatTimestamp(gate.fetchedAt)}
        </p>
      </section>

      <OrderLookup result={orders} query={orderQuery} />

      <p style={{ fontSize: 12, color: 'var(--color-gray-500)', margin: '24px 0 0' }}>
        Plan-vs-actual variance not yet wired. See task 38 / memory item 53.
      </p>
    </main>
  )
}

const KIND_LABELS: Record<OrderSearchResult['kind'], string> = {
  order_ref: 'order reference',
  email: 'customer email',
  vitall_order_id: 'Vitall order id',
}

/**
 * Support lookup. `AP-10042` is only useful if the customer quoting it can be
 * found, so this is the other half of the order-reference work: paste whatever
 * they gave you and the query works out whether it is a reference, an email, or
 * a Vitall id.
 */
function OrderLookup({ result, query }: { result: OrderSearchResult | null; query: string }) {
  return (
    <section
      aria-label="Order lookup"
      style={{ border: '2px solid #000', padding: '24px 28px', marginTop: 24 }}
    >
      <h2 style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0, color: 'var(--color-gray-500)' }}>
        Order lookup
      </h2>

      <form method="get" style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        <label htmlFor="q" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
          Order reference, customer email, or Vitall order id
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="AP-10042, name@example.com, or 322947256"
          style={{
            flex: '1 1 320px',
            border: '2px solid #000',
            padding: '10px 12px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 15,
          }}
        />
        <button
          type="submit"
          style={{
            border: '2px solid #000',
            background: '#000',
            color: '#fff',
            padding: '10px 22px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Find
        </button>
      </form>

      {result === null ? (
        <p style={{ fontSize: 13, color: 'var(--color-gray-500)', margin: '16px 0 0' }}>
          Searches `kit_orders` with the service role, so it finds any customer&rsquo;s order.
        </p>
      ) : result.error ? (
        <p style={{ color: '#000000', marginTop: 16 }}>Order lookup error: {result.error}</p>
      ) : result.hits.length === 0 ? (
        <p style={{ marginTop: 16, fontFamily: 'Georgia, serif' }}>
          No order matching that {KIND_LABELS[result.kind]}.
        </p>
      ) : (
        <>
          <p style={{ fontSize: 12, color: 'var(--color-gray-500)', margin: '16px 0 0' }}>
            {result.hits.length} {result.hits.length === 1 ? 'order' : 'orders'} matching that {KIND_LABELS[result.kind]}
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #000' }}>
                  {['Ref', 'Customer', 'Kit', 'Status', 'Ordered', 'Vitall', 'UUID'].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '8px 12px 8px 0',
                        fontSize: 11,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--color-gray-500)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.hits.map((hit) => (
                  <tr key={hit.id} style={{ borderTop: '1px solid var(--color-gray-200)' }}>
                    <td style={{ padding: '10px 12px 10px 0', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {hit.orderRef ?? '-'}
                      {hit.isTest && (
                        <span
                          style={{
                            marginLeft: 8,
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            border: '1px solid #000',
                            padding: '1px 5px',
                          }}
                        >
                          Test
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px 10px 0', fontFamily: 'Georgia, serif' }}>
                      {hit.name ? `${hit.name} · ` : ''}
                      {hit.email ?? '-'}
                    </td>
                    <td style={{ padding: '10px 12px 10px 0', whiteSpace: 'nowrap' }}>{hit.kitType}</td>
                    <td style={{ padding: '10px 12px 10px 0', whiteSpace: 'nowrap' }}>{hit.status}</td>
                    <td style={{ padding: '10px 12px 10px 0', whiteSpace: 'nowrap' }}>
                      {hit.orderedAt ? formatTimestamp(hit.orderedAt) : '-'}
                    </td>
                    <td style={{ padding: '10px 12px 10px 0', whiteSpace: 'nowrap' }}>{hit.vitallOrderId ?? '-'}</td>
                    <td style={{ padding: '10px 12px 10px 0', fontSize: 11, color: 'var(--color-gray-500)' }}>{hit.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}

function MetricRow({ label, value, target }: { label: string; value: string; target: string }) {
  return (
    <tr style={{ borderTop: '1px solid var(--color-gray-200)' }}>
      <td style={{ padding: '12px 0', fontFamily: 'Georgia, serif' }}>{label}</td>
      <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 700, fontFamily: 'Inter, system-ui, sans-serif' }}>{value}</td>
      <td style={{ padding: '12px 0 12px 24px', textAlign: 'right', color: 'var(--color-gray-500)', fontSize: 13, whiteSpace: 'nowrap' }}>{target}</td>
    </tr>
  )
}

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { isAdmin } from '@/lib/auth/isAdmin'
import { getCashPosition } from '@/lib/admin/getCashPosition'
import { getGateMetrics } from '@/lib/admin/getGateMetrics'

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

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login?next=/admin/dashboard')
  if (!isAdmin(user)) redirect('/')

  const [cash, gate] = await Promise.all([getCashPosition(), getGateMetrics()])

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
          <p style={{ color: '#b00020', marginTop: 16 }}>
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
          <p style={{ color: '#b00020', marginTop: 16 }}>
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

      <p style={{ fontSize: 12, color: 'var(--color-gray-500)', margin: '24px 0 0' }}>
        Plan-vs-actual variance not yet wired. See task 38 / memory item 53.
      </p>
    </main>
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

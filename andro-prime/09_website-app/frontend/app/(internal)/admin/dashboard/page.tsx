import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { isAdmin } from '@/lib/auth/isAdmin'
import { getCashPosition } from '@/lib/admin/getCashPosition'
import { getGateMetrics } from '@/lib/admin/getGateMetrics'
import { findOrders, type OrderSearchResult } from '@/lib/admin/findOrders'
import {
  InternalStrip,
  InternalHead,
  InternalPanel,
  Metric,
  MetricRow,
  DataTable,
} from '@/components/internal/InternalChrome'

/**
 * /admin/dashboard, rebuilt in Direction F on 2026-09-12.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO FRAME EXISTS AND NONE IS OWED. The journey set draws what a customer
 * walks through; this is a tool, and its layout is decided here.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 🔴 WHAT IT WAS: 286 lines with every rule written as an inline `style={{}}`
 * object. Nineteen hard-coded `#000`s, a 2px black border on every section, and
 * two font stacks named by hand, `Inter, system-ui` and `Georgia, serif`.
 * Neither is a brand face: Inter was replaced on 2026-08-31 because it is a
 * neo-grotesque and the type ruling names a humanist, and the serif is
 * Merriweather. So the one page that reads the company's cash position was
 * rendering it in a typeface the company had stopped using, and no check could
 * see it, because an inline style is invisible to every one of them.
 *
 * 🔴 IT ALSO HAD NO `.f-page` ROOT, which is the defect underneath that one.
 * `globals.css` still sets `p, li, blockquote { font-serif }` for V2.0, so every
 * paragraph on this page was serif by inheritance rather than by choice. The
 * route group's layout supplies the root now.
 *
 * WHAT DID NOT CHANGE: every number, every label, every data source, and the
 * admin gate. `getCashPosition`, `getGateMetrics` and `findOrders` are untouched,
 * and the three error branches still say the same sentences.
 *
 * 🔴 THE GATE IS STILL CHECKED HERE, IN THE PAGE, and that is deliberate: it is
 * the ONLY gate. Neither `/admin` nor `/ops` is in the middleware matcher, and a
 * layout is not a security boundary in Next. See the note in the route group's
 * layout.
 *
 * ⚠ THE PANEL NUMBERS ARE ADDRESSES, NOT A SEQUENCE. Unlike a marketing page,
 * where `FPage` counts its own sections, these are typed: the number is how a
 * panel gets referred to out loud, so it has to survive one being inserted above
 * it.
 */

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
    <>
      <InternalStrip label="Admin" right={`Stripe read ${formatTimestamp(cash.fetchedAt)}`} />

      <div className="f-intwrap">
        <InternalHead title="Admin dashboard">
          Live from Stripe and Postgres, never cached. Three panels: what is in the account, where the
          gates stand, and who an order reference belongs to.
        </InternalHead>

        {/* ---------- 01 · CASH ---------- */}
        <InternalPanel
          n={1}
          title="Stripe cash position"
          sub="The balance as Stripe reports it, not as a ledger computes it. Available is settled and payable; pending has not cleared."
        >
          {cash.error ? (
            <div className="f-banner f-banner-err">
              <span className="f-banner-k">Stripe Balance API error</span>
              {cash.error}
            </div>
          ) : (
            <>
              <MetricRow>
                {/* The page's one headline number, and the only `.f-int-lead` on
                    it: this is the figure the page is opened for. */}
                <Metric label="total" value={gbp(cash.totalGbp)} lead />
                <Metric label="available" value={gbp(cash.availableGbp)} />
                <Metric label="pending" value={gbp(cash.pendingGbp)} />
              </MetricRow>
              <p className="f-fine" style={{ marginTop: 18 }}>
                Live from the Stripe Balance API · fetched {formatTimestamp(cash.fetchedAt)}
              </p>
            </>
          )}
        </InternalPanel>

        {/* ---------- 02 · GATES ---------- */}
        <InternalPanel
          n={2}
          title="Gate metrics"
          sub="The Phase 0 gates, each against its own target. A dash in the target column means the row is tracked but gates nothing."
        >
          {gate.error ? (
            <div className="f-banner f-banner-err">
              <span className="f-banner-k">Gate metrics fetch error</span>
              {gate.error}
            </div>
          ) : (
            <DataTable head={['Metric', 'Value', 'Target']} minWidth={480}>
              <GateRow label="Total kits sold" value={String(gate.totalKitsSold)} target="Gate 0A: 50+" />
              <GateRow label="Founding-member list opt-ins (non-cash)" value={String(gate.fmListOptins)} target="—" />
              <GateRow
                label="Kit 2/3 to subscription conversion"
                value={gate.kit23ToSubConversionPct === null ? '—' : `${gate.kit23ToSubConversionPct.toFixed(1)}%`}
                target="Gate 0B: 10%+"
              />
              <GateRow label="Active supplement subscriptions" value={String(gate.activeSubCount)} target="Gate 0C: 30+" />
              <GateRow label="Supplement MRR" value={gbp(gate.supplementMrrGbp)} target="Gate 0C: £1,000+" />
            </DataTable>
          )}

          <p className="f-fine" style={{ marginTop: 16 }}>
            Source: v_gate_tracker · fetched {formatTimestamp(gate.fetchedAt)}
          </p>
        </InternalPanel>

        {/* ---------- 03 · ORDER LOOKUP ---------- */}
        <OrderLookup result={orders} query={orderQuery} />

        <p className="f-intfoot">
          Plan-vs-actual variance not yet wired. See task 38 / memory item 53.
        </p>
      </div>
    </>
  )
}

/**
 * A gate row. The value is right-aligned against the target rather than left
 * with the label, because the only reading anyone does here is value against
 * target, and two columns that have to be compared belong beside each other.
 */
function GateRow({ label, value, target }: { label: string; value: string; target: string }) {
  return (
    <tr>
      <td>{label}</td>
      <td className="f-int-num">{value}</td>
      <td>{target}</td>
    </tr>
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
    <InternalPanel
      n={3}
      title="Order lookup"
      sub="Paste a reference, an email or a Vitall id. The query works out which it is."
    >
      <form method="get" className="f-intsearch">
        <label htmlFor="q" className="sr-only">
          Order reference, customer email, or Vitall order id
        </label>
        <input
          id="q"
          name="q"
          type="search"
          className="f-inp"
          defaultValue={query}
          placeholder="AP-10042, name@example.com, or 322947256"
        />
        <button type="submit" className="f-btn">
          Find
        </button>
      </form>

      {result === null ? (
        <p className="f-fine" style={{ marginTop: 16 }}>
          Searches <code>kit_orders</code> with the service role, so it finds any customer&rsquo;s order.
        </p>
      ) : result.error ? (
        <div className="f-banner f-banner-err" style={{ marginTop: 16, marginBottom: 0 }}>
          <span className="f-banner-k">Order lookup error</span>
          {result.error}
        </div>
      ) : result.hits.length === 0 ? (
        <p className="f-sub" style={{ marginTop: 16 }}>
          No order matching that {KIND_LABELS[result.kind]}.
        </p>
      ) : (
        <>
          <p className="f-fine" style={{ margin: '16px 0 12px' }}>
            {result.hits.length} {result.hits.length === 1 ? 'order' : 'orders'} matching that {KIND_LABELS[result.kind]}
          </p>
          <DataTable head={['Ref', 'Customer', 'Kit', 'Status', 'Ordered', 'Vitall', 'UUID']} minWidth={900}>
            {result.hits.map((hit) => (
              <tr key={hit.id}>
                <td>
                  {hit.orderRef ?? '-'}
                  {hit.isTest && (
                    <span className="f-int-tag" style={{ marginLeft: 8 }}>
                      Test
                    </span>
                  )}
                </td>
                <td>
                  {hit.name ? `${hit.name} · ` : ''}
                  {hit.email ?? '-'}
                </td>
                <td>{hit.kitType}</td>
                <td>{hit.status}</td>
                <td className="f-int-num">{hit.orderedAt ? formatTimestamp(hit.orderedAt) : '-'}</td>
                <td className="f-int-num">{hit.vitallOrderId ?? '-'}</td>
                <td className="f-int-num" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{hit.id}</td>
              </tr>
            ))}
          </DataTable>
        </>
      )}
    </InternalPanel>
  )
}

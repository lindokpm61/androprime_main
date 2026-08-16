import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { isAdmin } from '@/lib/auth/isAdmin'
import { getContentBoard, type ContentBoard, type KindGroup, type LaneSummary } from '@/lib/ops/getContentBoard'

export const metadata: Metadata = {
  title: 'Content ops',
  robots: { index: false, follow: false },
}

// Live data only. A cached ops board is a board that lies at exactly the moment you consult it.
export const dynamic = 'force-dynamic'

function when(iso: string | null): string {
  if (!iso) return 'never'
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function Panel({ n, title, sub, children }: {
  n: number; title: string; sub?: string; children: React.ReactNode
}) {
  return (
    <section style={{ marginTop: '2.5rem' }}>
      <h2 style={{
        fontSize: '.72rem', letterSpacing: '.14em', textTransform: 'uppercase',
        color: '#6b6862', margin: '0 0 .2rem', fontWeight: 600,
      }}>
        {String(n).padStart(2, '0')} · {title}
      </h2>
      {sub ? <p style={{ margin: '0 0 .9rem', fontSize: '.82rem', color: '#918d84' }}>{sub}</p> : null}
      <div style={{ borderTop: '1px solid #dedad1', paddingTop: '.9rem' }}>{children}</div>
    </section>
  )
}

function Stat({ label, value, tone }: { label: string; value: string | number; tone?: 'bad' | 'warn' | 'ok' }) {
  const colour = tone === 'bad' ? '#9e2a20' : tone === 'warn' ? '#9a5b00' : tone === 'ok' ? '#06724f' : '#1a1917'
  return (
    <div style={{ minWidth: '9rem' }}>
      <div style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-.02em', color: colour, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
      <div style={{ fontSize: '.72rem', color: '#6b6862', lineHeight: 1.35 }}>{label}</div>
    </div>
  )
}

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: '1.6rem' }
const cell: React.CSSProperties = { padding: '.45rem .6rem', borderBottom: '1px solid #ededea', fontSize: '.82rem' }
const th: React.CSSProperties = {
  ...cell, fontSize: '.66rem', letterSpacing: '.08em', textTransform: 'uppercase',
  color: '#918d84', fontWeight: 600, textAlign: 'left', borderBottom: '1px solid #c9c4b8',
}

function LaneTable({ lanes }: { lanes: LaneSummary[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '46rem' }}>
        <thead>
          <tr>
            <th style={th}>Lane</th><th style={th}>Account</th><th style={th}>Rows</th>
            <th style={th}>Moved</th><th style={th}>Next 7d</th><th style={th}>Last published</th>
            <th style={th}>Route proven</th>
          </tr>
        </thead>
        <tbody>
          {lanes.map((l) => {
            const empty = l.total === 0
            return (
              <tr key={`${l.channel.platform}/${l.channel.format}`} style={empty ? { background: '#faf9f5' } : undefined}>
                <td style={{ ...cell, fontWeight: 600 }}>
                  {l.channel.platform}/{l.channel.format}
                  {!l.channel.inPlan ? <span style={{ color: '#918d84', fontWeight: 400 }}> · not in plan</span> : null}
                </td>
                <td style={{ ...cell, color: '#6b6862' }}>{l.channel.account ?? '—'}</td>
                <td style={{ ...cell, fontVariantNumeric: 'tabular-nums' }}>
                  {empty ? <span style={{ color: '#9a5b00' }}>0 (empty lane)</span> : l.total}
                </td>
                <td style={{ ...cell, fontVariantNumeric: 'tabular-nums', color: l.total > 0 && l.moved === 0 ? '#9e2a20' : undefined }}>
                  {l.moved}
                </td>
                <td style={{ ...cell, fontVariantNumeric: 'tabular-nums' }}>{l.scheduledNext7}</td>
                <td style={{ ...cell, color: '#6b6862' }}>{when(l.lastPublishedAt)}</td>
                <td style={{ ...cell, color: l.channel.routeVerifiedAt ? '#06724f' : '#9a5b00' }}>
                  {l.channel.routeVerifiedAt ? 'yes' : 'never'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function KindBlock({ g }: { g: KindGroup }) {
  return (
    <div style={{ marginBottom: '1.8rem' }}>
      <h3 style={{ fontSize: '1rem', margin: '0 0 .15rem', fontWeight: 700 }}>
        {g.label}
        {g.stalled ? <span style={{ color: '#9e2a20', fontWeight: 600, fontSize: '.78rem' }}> · STALLED</span> : null}
      </h3>
      <p style={{ margin: '0 0 .7rem', fontSize: '.78rem', color: '#6b6862' }}>
        {g.total} rendition{g.total === 1 ? '' : 's'}, {g.moved} past to-produce. Needs {g.input}.
        {g.stalled ? ` One blocked input, not ${g.lanes.length} separate problems.` : ''}
      </p>
      <LaneTable lanes={g.lanes} />
    </div>
  )
}

export default async function OpsContentPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login?next=/ops/content')
  if (!isAdmin(user)) redirect('/')

  const b: ContentBoard = await getContentBoard()

  return (
    <main style={{
      maxWidth: '76rem', margin: '0 auto', padding: '2.5rem 1.5rem 6rem',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif', color: '#1a1917',
    }}>
      <header style={{ borderBottom: '2px solid #1a1917', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-.03em', margin: 0 }}>
          Content ops
        </h1>
        <p style={{ margin: '.35rem 0 0', fontSize: '.8rem', color: '#6b6862' }}>
          Read-only. Live from Postgres, never cached. Read {when(b.fetchedAt)}.
        </p>
      </header>

      {b.error ? (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f6e5e3', border: '1px solid #9e2a20', fontSize: '.85rem' }}>
          <strong>This board did not read its data.</strong> {b.error} Every number below is absent,
          not zero.
        </div>
      ) : null}

      <Panel n={1} title="What needs you"
        sub="Blockers first. An empty list here means nothing is waiting on a person, not that nothing is wrong.">
        {b.needsYou.length === 0 ? (
          <p style={{ fontSize: '.85rem', color: '#06724f', margin: 0 }}>Nothing is waiting on you.</p>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {b.needsYou.map((n, i) => (
              <li key={i} style={{ padding: '.6rem 0', borderBottom: '1px solid #ededea', display: 'flex', gap: '.9rem' }}>
                <span style={{
                  fontSize: '.62rem', fontWeight: 700, letterSpacing: '.08em', padding: '.15rem .45rem',
                  height: 'fit-content', whiteSpace: 'nowrap',
                  background: n.severity === 'blocker' ? '#f6e5e3' : '#f6ecdc',
                  color: n.severity === 'blocker' ? '#9e2a20' : '#9a5b00',
                }}>
                  {n.severity === 'blocker' ? 'BLOCKER' : 'ATTENTION'}
                </span>
                <span style={{ fontSize: '.85rem' }}>
                  <strong>{n.count} · {n.what}</strong>
                  <span style={{ color: '#6b6862' }}>: {n.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel n={2} title="Every lane, by production kind"
        sub="Grouped by how a thing is MADE, not where it goes. Twenty-one shot renditions across four platforms are one filming day, not four backlogs. Empty lanes are listed: a lane with no rows cannot report itself.">
        {b.kinds.map((g) => <KindBlock key={g.kind} g={g} />)}
      </Panel>

      <Panel n={3} title="Channels"
        sub="What each channel requires, from the channel row itself. Adding a platform should cost a row.">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '52rem' }}>
            <thead>
              <tr>
                <th style={th}>Channel</th><th style={th}>Publisher</th><th style={th}>Brand</th>
                <th style={th}>Media</th><th style={th}>Aspect</th><th style={th}>Thumb</th>
                <th style={th}>Body max</th><th style={th}>In plan</th>
              </tr>
            </thead>
            <tbody>
              {b.channels.map((c) => (
                <tr key={`${c.platform}/${c.format}`}>
                  <td style={{ ...cell, fontWeight: 600 }}>{c.platform}/{c.format}</td>
                  <td style={{ ...cell, color: '#6b6862' }}>{c.publisher ?? '—'}</td>
                  <td style={{ ...cell, color: '#6b6862', fontVariantNumeric: 'tabular-nums' }}>{c.publisherBrand ?? '—'}</td>
                  <td style={cell}>
                    {c.mediaKind === 'none' ? 'none' : `${c.mediaKind} ${c.mediaMin}${c.mediaMax ? `–${c.mediaMax}` : '+'}`}
                  </td>
                  <td style={{ ...cell, color: '#6b6862' }}>{c.mediaAspect ?? '—'}</td>
                  <td style={{ ...cell, color: '#6b6862' }}>{c.thumbSpec}</td>
                  <td style={{ ...cell, color: '#6b6862', fontVariantNumeric: 'tabular-nums' }}>{c.bodyMaxChars ?? '—'}</td>
                  <td style={{ ...cell, color: c.inPlan ? '#1a1917' : '#918d84' }}>{c.inPlan ? 'yes' : 'no'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel n={4} title="Media"
        sub="Files, and whether the renditions that need them have them. Measured against each channel's own requirement.">
        <div style={row}>
          <Stat label="files registered" value={b.media.files} tone={b.media.files === 0 ? 'warn' : undefined} />
          <Stat label="renditions with media linked" value={b.media.linkedToRenditions} />
          <Stat label="missing media their channel requires" value={b.media.owedByChannelSpec}
            tone={b.media.owedByChannelSpec ? 'bad' : 'ok'} />
          <Stat label="thumbnails owed" value={b.media.thumbsOwed} tone={b.media.thumbsOwed ? 'warn' : 'ok'} />
        </div>
      </Panel>

      <Panel n={5} title="Approvals"
        sub="ClickUp remains the approvals hub and is untouched by this board. These are the database's own record.">
        <div style={row}>
          <Stat label="pre-flight RED" value={b.approvals.preflightRed} tone={b.approvals.preflightRed ? 'bad' : 'ok'} />
          <Stat label="awaiting Ewa" value={b.approvals.assetsAwaitingEwa} tone={b.approvals.assetsAwaitingEwa ? 'warn' : 'ok'} />
          <Stat label="no business approval" value={b.approvals.assetsAwaitingBusiness} />
          <Stat label="pre-flight not run" value={b.approvals.preflightNotRun} tone={b.approvals.preflightNotRun ? 'warn' : 'ok'} />
        </div>
      </Panel>

      <Panel n={6} title="Health"
        sub="Coverage and health are different questions. A row existing is coverage; a row moving is health. Rows that exist and never move are the state in which every store agrees and nothing is happening.">
        <div style={row}>
          <Stat label="coverage slots" value={b.health.coverageSlots} />
          <Stat label="rendition rows" value={b.health.coverageFilled} />
          <Stat label="rows that never moved" value={b.health.coverageFilledButUnmoved}
            tone={b.health.coverageFilledButUnmoved ? 'warn' : 'ok'} />
          <Stat label={`routes proven of ${b.health.routesTotal}`} value={b.health.routesProven}
            tone={b.health.routesProven < b.health.routesTotal ? 'warn' : 'ok'} />
        </div>
      </Panel>

      <Panel n={7} title="Effect"
        sub="The panel the proposal omitted. Every other number here is a production count; this is the only one that is an outcome.">
        <div style={{ ...row, marginBottom: '1.1rem' }}>
          <Stat label="renditions with any capture" value={b.effect.capturedRenditions}
            tone={b.effect.capturedRenditions ? undefined : 'warn'} />
          <Stat label="captures recorded" value={b.effect.totalCaptures} />
          <Stat label="latest capture" value={b.effect.latestCaptureAt ? when(b.effect.latestCaptureAt) : 'none'} />
        </div>
        {b.effect.savesByVariant.length ? (
          <>
            <p style={{ fontSize: '.78rem', color: '#6b6862', margin: '0 0 .5rem' }}>
              The A/B/C close test. Saves must be compared at a FIXED AGE, so a running total here
              ranks the closes by publish date rather than by performance. This is raw, not the answer.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', minWidth: '26rem' }}>
                <thead>
                  <tr><th style={th}>Variant</th><th style={th}>Posts</th><th style={th}>With saves</th><th style={th}>Total saves</th></tr>
                </thead>
                <tbody>
                  {b.effect.savesByVariant.map((v) => (
                    <tr key={v.variant}>
                      <td style={{ ...cell, fontWeight: 600 }}>{v.variant}</td>
                      <td style={{ ...cell, fontVariantNumeric: 'tabular-nums' }}>{v.posts}</td>
                      <td style={{ ...cell, fontVariantNumeric: 'tabular-nums', color: v.withSaves ? undefined : '#9a5b00' }}>{v.withSaves}</td>
                      <td style={{ ...cell, fontVariantNumeric: 'tabular-nums' }}>{v.totalSaves}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p style={{ fontSize: '.82rem', color: '#9a5b00', margin: 0 }}>
            No variant has a capture yet. Until one does, the close test has no readable result.
          </p>
        )}
      </Panel>

      <footer style={{ marginTop: '3.5rem', paddingTop: '1rem', borderTop: '1px solid #dedad1', fontSize: '.72rem', color: '#918d84', lineHeight: 1.7 }}>
        Read-only by design (plan step 7.1): a wrong number stays a wrong number rather than becoming
        a wrong action. Write actions arrive at 7.3, for the three things that are genuinely gates.
        <br />
        This board replaces <code>review.html</code>, the social dashboard and <code>/content-status</code>.
        <code> content-doctor</code> stays as the nightly alarm, because a board nobody opens cannot alarm.
        ClickUp stays as the approvals hub.
      </footer>
    </main>
  )
}

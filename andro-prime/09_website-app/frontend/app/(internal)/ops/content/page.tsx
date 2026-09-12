import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { isAdmin } from '@/lib/auth/isAdmin'
import { getContentBoard, type ContentBoard, type KindGroup, type LaneSummary } from '@/lib/ops/getContentBoard'
import {
  InternalStrip,
  InternalHead,
  InternalPanel,
  Metric,
  MetricRow,
  DataTable,
} from '@/components/internal/InternalChrome'

/**
 * /ops/content, rebuilt in Direction F on 2026-09-12.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO FRAME EXISTS AND NONE IS OWED: the journey set draws what a customer
 * walks through, and this is a tool.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 🔴 WHAT IT WAS: 376 lines in which every rule was an inline style object,
 * including a private `cell`, `th` and `row` trio and a local `Panel` and `Stat`
 * that duplicated what `/admin/dashboard` had already written differently. Eight
 * hard-coded greys, three hard-coded tone hexes repeated twenty-six times, and a
 * font stack (`ui-sans-serif, system-ui`) that is not the brand face. The two
 * internal tools had already drifted into different type scales for the same
 * roles, which is what a copied style object does and what
 * `components/internal/InternalChrome.tsx` now prevents.
 *
 * EVERY NUMBER, LABEL AND SENTENCE IS UNCHANGED. This is a presentation
 * rebuild: `getContentBoard()` is untouched, the eight panels keep their order,
 * their titles and their standfirsts, and the prose under panels 6 and 7 is
 * carried word for word, because each of those paragraphs states a rule
 * (a superseded pin is not a takedown; coverage and health are different
 * questions) that the numbers alone would be misread without.
 *
 * 🔴 THE THREE TONES SURVIVE, AND THEY ARE THE ONE THING HERE THAT IS A
 * DESIGN QUESTION RATHER THAN A TIDY-UP. Keith ruled on 2026-09-03 that
 * saturated colour means a clinical verdict and nothing else. This board is
 * admin-gated and no customer can reach it, and its red/amber/green say "this
 * lane is blocked", not "this number of yours needs watching" — but they are
 * the same three colours a customer meets on a results card, and that ruling was
 * made precisely because a reader does not read tokens. They are kept, moved off
 * twenty-six inline hexes onto three variables of their own in
 * `f-internal.css`, and deliberately NOT wired to `--color-status-*`. The
 * question is flagged there and in STATE.md. **Every tone is paired with a word**
 * (`BLOCKER`, `ATTENTION`, `empty lane`, `never`), so colour is never the only
 * carrier and the answer changes nothing about what the board can say.
 *
 * 🔴 THE GATE IS STILL CHECKED IN THE PAGE. It is the only one: neither `/ops`
 * nor `/admin` is in the middleware matcher, and a layout is not a security
 * boundary in Next.
 */

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

const LANE_HEAD = ['Lane', 'Account', 'Rows', 'Moved', 'Next 7d', 'Last published', 'Route proven'] as const

function LaneTable({ lanes }: { lanes: LaneSummary[] }) {
  return (
    <DataTable head={LANE_HEAD} minWidth={760}>
      {lanes.map((l) => {
        const empty = l.total === 0
        const stalled = l.total > 0 && l.moved === 0
        return (
          <tr key={`${l.channel.platform}/${l.channel.format}`} className={empty ? 'f-int-empty' : undefined}>
            <td>
              {l.channel.platform}/{l.channel.format}
              {!l.channel.inPlan ? <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}> · not in plan</span> : null}
            </td>
            <td>{l.channel.account ?? '—'}</td>
            <td className="f-int-num">
              {/* "0 (empty lane)" rather than a bare zero: a lane with no rows
                  cannot report itself, and a zero that means "nothing to say"
                  reads identically to a zero that means "nothing happened". */}
              {empty ? <span className="f-int-warn">0 (empty lane)</span> : l.total}
            </td>
            <td className={stalled ? 'f-int-num f-int-bad' : 'f-int-num'}>{l.moved}</td>
            <td className="f-int-num">{l.scheduledNext7}</td>
            <td className="f-int-num">{when(l.lastPublishedAt)}</td>
            <td className={l.channel.routeVerifiedAt ? 'f-int-ok' : 'f-int-warn'}>
              {l.channel.routeVerifiedAt ? 'yes' : 'never'}
            </td>
          </tr>
        )
      })}
    </DataTable>
  )
}

function KindBlock({ g }: { g: KindGroup }) {
  return (
    <div style={{ marginBottom: 30 }}>
      <h3 className="f-h4" style={{ marginBottom: 4 }}>
        {g.label}
        {g.stalled ? <span className="f-int-bad" style={{ fontSize: 12, letterSpacing: '0.08em' }}> · STALLED</span> : null}
      </h3>
      {/* lanesWithWork comes from the data layer, never recounted here: this string and the
          needs-you message state the SAME fact, and deriving it twice is how they disagreed. */}
      {/* `.f-intpanel-sub`, not `.f-fine`: this is a sentence with two clauses,
          and `.f-fine` is the mono register, which is right for a timestamp or a
          source note and wrong for prose. The board's other mono lines are all
          machine output. */}
      <p className="f-intpanel-sub" style={{ marginBottom: 12 }}>
        {g.total} rendition{g.total === 1 ? '' : 's'}, {g.moved} past to-produce. Needs {g.input}.
        {g.stalled ? ` One blocked input, not ${g.lanesWithWork} separate problems.` : ''}
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
    <>
      <InternalStrip label="Content ops" right={`Read ${when(b.fetchedAt)}`} />

      <div className="f-intwrap">
        <InternalHead title="Content ops">
          Read-only. Live from Postgres, never cached. Read {when(b.fetchedAt)}.
        </InternalHead>

        {b.error ? (
          <div className="f-banner f-banner-err">
            <span className="f-banner-k">This board did not read its data</span>
            {b.error} Every number below is absent, not zero.
          </div>
        ) : null}

        <InternalPanel
          n={1}
          title="What needs you"
          sub="Blockers first. An empty list here means nothing is waiting on a person, not that nothing is wrong."
        >
          {b.needsYou.length === 0 ? (
            <p className="f-sub f-int-ok" style={{ marginTop: 0 }}>Nothing is waiting on you.</p>
          ) : (
            <ul className="f-intlist">
              {b.needsYou.map((n, i) => (
                <li key={i}>
                  <span className={n.severity === 'blocker' ? 'f-int-tag f-int-bad' : 'f-int-tag f-int-warn'}>
                    {n.severity === 'blocker' ? 'Blocker' : 'Attention'}
                  </span>
                  <span>
                    <b>{n.count} · {n.what}</b>
                    <span>: {n.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </InternalPanel>

        <InternalPanel
          n={2}
          title="Every lane, by production kind"
          sub="Grouped by how a thing is MADE, not where it goes. Twenty-one shot renditions across four platforms are one filming day, not four backlogs. Empty lanes are listed: a lane with no rows cannot report itself."
        >
          {b.kinds.map((g) => <KindBlock key={g.kind} g={g} />)}
        </InternalPanel>

        <InternalPanel
          n={3}
          title="Channels"
          sub="What each channel requires, from the channel row itself. Adding a platform should cost a row."
        >
          <DataTable
            head={['Channel', 'Publisher', 'Brand', 'Media', 'Aspect', 'Thumb', 'Body max', 'In plan']}
            minWidth={860}
          >
            {b.channels.map((c) => (
              <tr key={`${c.platform}/${c.format}`}>
                <td>{c.platform}/{c.format}</td>
                <td>{c.publisher ?? '—'}</td>
                <td className="f-int-num">{c.publisherBrand ?? '—'}</td>
                <td>
                  {/* A range whose min equals its max is just a number: "video 1", not "video 1-1". */}
                  {c.mediaKind === 'none'
                    ? 'none'
                    : c.mediaMax === null
                      ? `${c.mediaKind} ${c.mediaMin}+`
                      : c.mediaMin === c.mediaMax
                        ? `${c.mediaKind} ${c.mediaMin}`
                        : c.mediaMin === 0
                          ? `${c.mediaKind} up to ${c.mediaMax}`
                          : `${c.mediaKind} ${c.mediaMin} to ${c.mediaMax}`}
                </td>
                <td>{c.mediaAspect ?? '—'}</td>
                <td>{c.thumbSpec}</td>
                <td className="f-int-num">{c.bodyMaxChars ?? '—'}</td>
                <td className={c.inPlan ? undefined : 'f-int-warn'}>{c.inPlan ? 'yes' : 'no'}</td>
              </tr>
            ))}
          </DataTable>
        </InternalPanel>

        <InternalPanel
          n={4}
          title="Media"
          sub="Files, and whether the renditions that need them have them. Measured against each channel's own requirement."
        >
          <MetricRow>
            <Metric label="files registered" value={b.media.files} tone={b.media.files === 0 ? 'warn' : undefined} />
            <Metric label="renditions with media linked" value={b.media.linkedToRenditions} />
            <Metric
              label="missing media their channel requires"
              value={b.media.owedByChannelSpec}
              tone={b.media.owedByChannelSpec ? 'bad' : 'ok'}
            />
            <Metric label="thumbnails owed" value={b.media.thumbsOwed} tone={b.media.thumbsOwed ? 'warn' : 'ok'} />
          </MetricRow>
        </InternalPanel>

        <InternalPanel
          n={5}
          title="Approvals"
          sub="ClickUp remains the approvals hub and is untouched by this board. These are the database's own record."
        >
          <MetricRow>
            <Metric label="pre-flight RED" value={b.approvals.preflightRed} tone={b.approvals.preflightRed ? 'bad' : 'ok'} />
            <Metric label="awaiting Ewa" value={b.approvals.assetsAwaitingEwa} tone={b.approvals.assetsAwaitingEwa ? 'warn' : 'ok'} />
            <Metric label="no business approval" value={b.approvals.assetsAwaitingBusiness} />
            <Metric label="pre-flight not run" value={b.approvals.preflightNotRun} tone={b.approvals.preflightNotRun ? 'warn' : 'ok'} />
          </MetricRow>
        </InternalPanel>

        <InternalPanel
          n={6}
          title="Claim ledger"
          sub="Plan steps 5.1 to 5.4. Ewa signs a versioned claim set at the TOPIC; a derivative pins to a version and inherits it. Tier 1 auto-passes with no Ewa, tier 2 goes to her itemised, tier 3 goes back to the article (ruled 2026-08-18, Q14)."
        >
          <p className="f-intsub">The ledger</p>
          <MetricRow style={{ marginBottom: 26 }}>
            <Metric label="topics with a claim set" value={b.claims.topics} />
            <Metric label="signed sets" value={b.claims.signedSets} tone={b.claims.signedSets ? 'ok' : 'warn'} />
            <Metric
              label={`derivatives pinned of ${b.claims.pinnable} covered`}
              value={b.claims.pinned}
              tone={b.claims.unpinned ? 'warn' : 'ok'}
            />
            <Metric
              label="classified against their set"
              value={b.claims.classified}
              tone={b.claims.pinnedNeverClassified ? 'warn' : 'ok'}
            />
          </MetricRow>

          <p className="f-intsub">The ladder</p>
          <MetricRow style={{ marginBottom: 26 }}>
            <Metric label="tier 1, auto-passed (no Ewa)" value={b.claims.autoPassed} tone="ok" />
            <Metric label="tier 2 open, for Ewa itemised" value={b.claims.openTier2} tone={b.claims.openTier2 ? 'warn' : 'ok'} />
            <Metric label="tier 3 open, back to the article" value={b.claims.openTier3} tone={b.claims.openTier3 ? 'bad' : 'ok'} />
            <Metric
              label="pinned, never classified"
              value={b.claims.pinnedNeverClassified}
              tone={b.claims.pinnedNeverClassified ? 'warn' : 'ok'}
            />
          </MetricRow>

          <p className="f-intsub">Pinned to a superseded set (5.4)</p>
          <MetricRow>
            <Metric label="pinned to a superseded version" value={b.claims.pinsSuperseded} tone={b.claims.pinsSuperseded ? 'warn' : 'ok'} />
            <Metric
              label="…and edited since, still on the old pin"
              value={b.claims.supersededAndEdited}
              tone={b.claims.supersededAndEdited ? 'bad' : 'ok'}
            />
          </MetricRow>

          <p className="f-sub" style={{ fontSize: 13.5, marginTop: 22, maxWidth: '62ch' }}>
            A superseded pin is not a takedown. Ruled Q13: live derivatives keep running and are re-pinned
            at their next edit, so the first number is a worklist and the second is the duty going unpaid.
            A new version only exists when the MEANING of a claim changes (Q12), so a re-optimisation that
            rewords without moving a claim supersedes nothing and appears here not at all.
          </p>
          <p className="f-sub" style={{ fontSize: 13.5, maxWidth: '62ch' }}>
            <strong>An open tier 2 or tier 3 blocks its rendition from being scheduled</strong>, by database
            gate, on arrival only: nothing already live comes down. The two right-hand counts above are the
            holes no gate can see, because a pin with no classification behind it reads exactly like a
            checked one.
          </p>
        </InternalPanel>

        <InternalPanel
          n={7}
          title="Coverage, then health"
          sub="Two different questions, kept apart because reading them as one overstates both. Coverage asks whether a published article has reached a planned channel at all. Health asks whether anything then happened to it."
        >
          <p className="f-intsub">Coverage</p>
          <MetricRow style={{ marginBottom: 26 }}>
            <Metric label="slots (published articles x planned channels)" value={b.health.coverageSlots} />
            <Metric
              label="slots filled"
              value={b.health.gridFilled}
              tone={b.health.gridFilled < b.health.coverageSlots / 2 ? 'warn' : 'ok'}
            />
            <Metric label="backlog" value={b.health.gridBacklog} tone={b.health.gridBacklog ? 'warn' : 'ok'} />
            <Metric
              label="coverage"
              value={b.health.coverageSlots ? `${Math.round((b.health.gridFilled / b.health.coverageSlots) * 100)}%` : 'n/a'}
              tone="warn"
            />
          </MetricRow>

          <p className="f-intsub">Health</p>
          <MetricRow>
            <Metric label="rendition rows in total (NOT coverage)" value={b.health.renditionRows} />
            <Metric label="rows that never moved" value={b.health.rowsNeverMoved} tone={b.health.rowsNeverMoved ? 'warn' : 'ok'} />
            <Metric
              label={`routes proven of ${b.health.routesTotal}`}
              value={b.health.routesProven}
              tone={b.health.routesProven < b.health.routesTotal ? 'warn' : 'ok'}
            />
          </MetricRow>

          <p className="f-sub" style={{ fontSize: 13.5, marginTop: 22, maxWidth: '58ch' }}>
            Rendition rows exceed filled slots because several rows can share one cell, and rows on a
            channel that is not in plan fill no cell at all. Thirty carousel rows currently fill none
            of them.
          </p>
        </InternalPanel>

        <InternalPanel
          n={8}
          title="Effect"
          sub="The panel the proposal omitted. Every other number here is a production count; this is the only one that is an outcome."
        >
          <MetricRow style={{ marginBottom: 20 }}>
            <Metric
              label="renditions with any capture"
              value={b.effect.capturedRenditions}
              tone={b.effect.capturedRenditions ? undefined : 'warn'}
            />
            <Metric label="captures recorded" value={b.effect.totalCaptures} />
            <Metric
              when
              label="latest capture"
              value={b.effect.latestCaptureAt ? when(b.effect.latestCaptureAt) : 'none'}
              tone={b.effect.latestCaptureAt ? undefined : 'warn'}
            />
          </MetricRow>

          {b.effect.savesByVariant.length ? (
            <>
              <p className="f-fine" style={{ marginBottom: 12 }}>
                The A/B/C close test. Saves must be compared at a FIXED AGE, so a running total here
                ranks the closes by publish date rather than by performance. This is raw, not the answer.
              </p>
              <DataTable head={['Variant', 'Posts', 'With saves', 'Total saves']} minWidth={420}>
                {b.effect.savesByVariant.map((v) => (
                  <tr key={v.variant}>
                    <td>{v.variant}</td>
                    <td className="f-int-num">{v.posts}</td>
                    <td className={v.withSaves ? 'f-int-num' : 'f-int-num f-int-warn'}>{v.withSaves}</td>
                    <td className="f-int-num">{v.totalSaves}</td>
                  </tr>
                ))}
              </DataTable>
            </>
          ) : (
            <p className="f-sub f-int-warn" style={{ marginTop: 0 }}>
              No variant has a capture yet. Until one does, the close test has no readable result.
            </p>
          )}
        </InternalPanel>

        <footer className="f-intfoot">
          Read-only by design (plan step 7.1): a wrong number stays a wrong number rather than becoming
          a wrong action. Write actions arrive at 7.3, for the three things that are genuinely gates.
          <br />
          This board replaces <code>review.html</code>, the social dashboard and <code>/content-status</code>.
          <code> content-doctor</code> stays as the nightly alarm, because a board nobody opens cannot alarm.
          ClickUp stays as the approvals hub.
        </footer>
      </div>
    </>
  )
}

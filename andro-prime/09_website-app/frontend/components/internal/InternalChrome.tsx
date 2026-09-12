import React from 'react'

/**
 * THE INTERNAL TOOLS' SHARED ASSEMBLY, added 2026-09-12.
 *
 * The same job `FPage` does for marketing and `AppShell` does for the signed-in
 * product: the parts an internal board is made of, composed rather than
 * copy-pasted. Before this, `/admin/dashboard` and `/ops/content` each carried
 * their own local `Panel`, their own `Stat`, their own `th`/`cell` style objects
 * and their own header, in inline styles, and the two had already drifted into
 * different type scales and different greys for the same roles.
 *
 * ⚠ IT IS NOT `AppShell`. That one is a sticky explanatory sidebar beside a
 * column of trays, sized for a customer's own screen at the marketing measure.
 * A board is full-width, dense and tabular, and the sidebar's job (saying what
 * this screen is for, in the customer's terms) is done here by the strip and the
 * header in one line each.
 */

/* ------------------------------------------------------------ InternalStrip */

type StripProps = {
  /** Which tool this is. Rendered uppercase by the stylesheet. */
  label: string
  /** The freshness of the data, almost always. Hidden under 560px. */
  right?: React.ReactNode
}

/**
 * The internal surfaces' one inverted block. Direction F caps a page at one
 * inverted panel; a marketing route spends it on a conformity statement, an app
 * route on which screen you are on, and an internal tool on the same, plus the
 * one thing a board must never be wrong about: when it last read its data.
 */
export function InternalStrip({ label, right }: StripProps) {
  return (
    <div className="f-intstrip">
      <div className="f-intstrip-in">
        <b>Andro Prime</b>
        <span aria-hidden="true">·</span>
        <span>{label}</span>
        {right !== undefined && <span className="f-intstrip-r">{right}</span>}
      </div>
    </div>
  )
}
InternalStrip.displayName = 'InternalStrip'

/* ------------------------------------------------------------- InternalHead */

export function InternalHead({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <header className="f-inthead">
      <p className="f-blab">Internal</p>
      <h1>{title}</h1>
      {children ? <p>{children}</p> : null}
    </header>
  )
}
InternalHead.displayName = 'InternalHead'

/* ------------------------------------------------------------ InternalPanel */

type PanelProps = {
  /** The panel's own number, rendered zero-padded in the label. */
  n: number
  title: string
  /** One line on what the panel is counting, and what a zero in it means. */
  sub?: React.ReactNode
  children: React.ReactNode
}

/**
 * A numbered panel: a mono label, an optional standfirst, a hairline, the body.
 *
 * ⚠ THE NUMBER IS PASSED, NOT COUNTED, which is the opposite of `FPage`'s rule
 * that nobody types `n` or `of`. `FPage` counts because a marketing page's
 * sections are a sequence a reader is walked through and the total is part of
 * the device. These are eight independent panels with no total on screen: the
 * number is a stable address ("panel 5 is wrong"), so it must survive a panel
 * being added above it, which a positional count would not.
 */
export function InternalPanel({ n, title, sub, children }: PanelProps) {
  return (
    <section className="f-intpanel" aria-label={title}>
      <p className="f-blab">
        {String(n).padStart(2, '0')} · {title}
      </p>
      {sub ? <p className="f-intpanel-sub">{sub}</p> : null}
      <div className="f-intpanel-body">{children}</div>
    </section>
  )
}
InternalPanel.displayName = 'InternalPanel'

/* ------------------------------------------------------------------- Metric */

export type Tone = 'bad' | 'warn' | 'ok'

const TONE_CLASS: Record<Tone, string> = {
  bad: 'f-int-bad',
  warn: 'f-int-warn',
  ok: 'f-int-ok',
}

type MetricProps = {
  label: React.ReactNode
  value: React.ReactNode
  tone?: Tone
  /** A timestamp rather than a count: same row, smaller, so it does not read as
   *  the biggest number in it. */
  when?: boolean
  /** The one number the page is opened for. At most one per page, for the same
   *  reason a marketing route spends at most one inverted panel. */
  lead?: boolean
}

export function Metric({ label, value, tone, when, lead }: MetricProps) {
  const cls = [
    'f-counts-n',
    when ? 'f-int-when' : '',
    lead ? 'f-int-lead' : '',
    tone ? TONE_CLASS[tone] : '',
  ].filter(Boolean).join(' ')
  return (
    <div>
      <span className={cls}>{value}</span>
      <span className="f-counts-k">{label}</span>
    </div>
  )
}
Metric.displayName = 'Metric'

/** A row of metrics. `.f-counts` is the app layer's; `.f-int-counts` tightens it. */
export function MetricRow({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="f-counts f-int-counts" style={style}>
      {children}
    </div>
  )
}
MetricRow.displayName = 'MetricRow'

/* ---------------------------------------------------------------- DataTable */

/**
 * A dense data table in a scroller.
 *
 * `minWidth` is per-table because the column counts differ (four to eight) and
 * the point of the scroller is that a row never wraps: a wrapped row in a board
 * of counts puts two numbers on one line and they stop being comparable down
 * the column, which is the only way this table is read.
 */
export function DataTable({ head, minWidth, children }: {
  head: readonly string[]
  minWidth?: number | string
  children: React.ReactNode
}) {
  return (
    <div className="f-int-tablewrap">
      <table className="f-int-table" style={minWidth ? { minWidth } : undefined}>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}
DataTable.displayName = 'DataTable'

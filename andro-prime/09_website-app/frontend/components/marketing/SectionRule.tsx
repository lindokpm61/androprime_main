/**
 * The measurement track, promoted from a chart to the page's own furniture.
 *
 * WHY. A critique found that nothing outside the copy made the homepage
 * identifiably ours: the design would sit as comfortably on a tech brand or a
 * makeup brand. Measuring the page showed why. It was twelve floating rounded
 * cards holding seventy-odd rounded pills on near-white, which is the shared
 * surface kit of premium consumer software and premium beauty, and it is the
 * exact territory `02_brand/brand-guidelines.md` §11 tells us to avoid ("White
 * wellness: correct palette, wrong energy. Too soft and medicated"). The brand's
 * stated target in §1 is a quality British print publication meeting precise
 * health reporting, and the page had neither register outside its words.
 *
 * The one thing the product owns and nobody in the category has is the two-range
 * readout: a recessed track, the laboratory's band, ours, and a cased needle. It
 * appeared once, in one card, halfway down the page. These two components spend
 * that vocabulary as page structure so the design carries the argument instead
 * of only the copy carrying it.
 *
 * 🔴 THE NEEDLE MEASURES SOMETHING REAL, and that is the whole point rather than
 * a nicety. A track with a mark at a decorative position would be an instrument
 * face reading a number that does not exist, which is the one thing a brand
 * built on "here are your actual numbers" cannot put on its own homepage. It
 * reads the reader's position in the page, which is true, checkable and nothing
 * to do with anybody's blood.
 */

/**
 * A section opener: the readout's own track, band and cased needle, with the
 * section's position in mono at the right.
 *
 * `aria-hidden` in full. It is a navigational restatement of the heading
 * structure that follows it, so exposing it would make a screen reader announce
 * a position before every section for no gain. Nothing here is information that
 * exists only in this element.
 */
export function SectionRule({ n, of }: { n: number; of: number }) {
  const pos = Math.max(0, Math.min(100, (n / of) * 100))
  const pad = (v: number) => String(v).padStart(2, '0')

  return (
    <div className="f-srule" aria-hidden="true">
      <span className="f-srule-track">
        <span className="f-srule-band" style={{ width: `${pos}%` }} />
        <span className="f-srule-you" style={{ left: `${pos}%` }} />
      </span>
      <span className="f-srule-n">
        {pad(n)} / {pad(of)}
      </span>
    </div>
  )
}

/**
 * A print sidenote: a figure reference and its counts, set in mono in a narrow
 * column beside the prose. Publications annotate their figures in the margin;
 * the category does not, because it has nothing to put there.
 *
 * ⚠ EVERY LINE MUST BE A COUNT OF SOMETHING ALREADY DRAWN ON THIS PAGE.
 * "Four markers, three splits" describes the readout the reader has just
 * scrolled past, and the interpretation column already says the same thing in
 * words. That keeps this device at zero new claims.
 *
 * 🔴 THE STRONGER VERSION IS NOT THIS ONE AND IS NOT OURS TO SHIP. Hanging the
 * actual ranges here (the lab's 37.5+ against our 25 to 70 for B12, and so on
 * per marker) is the version that would really read as health reporting. Those
 * figures exist, derived from `04_products/results-engine/thresholds.md` and
 * Ewa-ratified, but they live in the source COMMENTS beside the readout data and
 * have never been rendered to a customer. Putting them on screen is new
 * clinical content on a marketing page and needs Ewa, not a redraw. Do not
 * promote them out of the comments to fill this column.
 */
export function Marginalia({ fig, lines }: { fig: string; lines: string[] }) {
  return (
    <aside className="f-marg" aria-hidden="true">
      <span className="f-marg-fig">{fig}</span>
      {lines.map((l) => (
        <span key={l}>{l}</span>
      ))}
    </aside>
  )
}

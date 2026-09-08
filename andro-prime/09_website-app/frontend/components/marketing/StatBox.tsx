interface Props {
  label: string
  children: React.ReactNode
}

/**
 * RUNG 6: leaves the `--sunk` ladder and rises to `--core` behind an inset
 * hairline. This is the first piece that reads as an OBJECT sitting on the
 * page rather than as an indentation of it.
 *
 * ⚠ `data-label` is gone. That is the V2.0 label class and it is still used on
 * ~50 files site-wide, so it was not edited; this component simply stops
 * reading it and uses the blog's own `.fb-stat-k`, which is the same idea in F
 * tokens. Do not reintroduce it here: it would pull a V2.0 rule into an F page.
 */
export default function StatBox({ label, children }: Props) {
  return (
    <div className="fb-mx fb-stat">
      <span className="fb-stat-k">{label}</span>
      {children}
    </div>
  )
}

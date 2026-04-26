'use client'

export function ScanAgainButton() {
  return (
    <button
      type="button"
      onClick={() => window.close()}
      className="font-sans font-black text-sm uppercase tracking-widest underline"
    >
      Scan again
    </button>
  )
}

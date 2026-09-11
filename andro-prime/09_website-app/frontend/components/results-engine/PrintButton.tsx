'use client'

// Print / save-as-PDF trigger for the GP handoff page. Zero dependency: uses
// the browser's native print dialog, which offers "Save as PDF" everywhere.
// Hidden on the printed page itself via print:hidden.
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="f-btn print:hidden"
    >
      Print or save as PDF
    </button>
  )
}

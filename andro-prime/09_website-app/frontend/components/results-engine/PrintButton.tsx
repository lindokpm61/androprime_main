'use client'

// Print / save-as-PDF trigger for the GP handoff page. Zero dependency: uses
// the browser's native print dialog, which offers "Save as PDF" everywhere.
// Hidden on the printed page itself via print:hidden.
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden inline-block bg-black text-white font-mono text-xs uppercase tracking-wider px-6 py-3 hover:bg-gray-800 transition-colors"
    >
      Print or save as PDF
    </button>
  )
}

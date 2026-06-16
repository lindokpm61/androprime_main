// Ambient type for the client-side gtag.js global installed by GoogleAnalytics.tsx.
// gtag is intentionally loosely typed: it's a variadic command bus
// (`gtag('consent','update',{...})`, `gtag('event', name, {...})`, etc.).
export {}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

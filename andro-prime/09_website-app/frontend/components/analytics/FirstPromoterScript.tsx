"use client";

import Script from "next/script";

/**
 * FirstPromoter referral-tracking pixel.
 *
 * Loads the FirstPromoter loader script and primes it with our account's
 * tracking ID before the CDN script arrives. The CDN script then drains the
 * pre-queued `init` + `click` calls and sets the `_fprom_tid` cookie when a
 * visitor lands with a `?fpr=<code>` (or `?ref=<code>`) URL parameter. That
 * cookie is what the checkout API routes read server-side and forward to
 * Stripe as session metadata so the Stripe webhook can credit the sale to
 * the right affiliate via the FirstPromoter API.
 *
 * Renders nothing if `NEXT_PUBLIC_FIRSTPROMOTER_TRACKING_ID` is not set, so
 * the absence of an env var is a soft fail (no console errors, no broken
 * page) rather than a hard one — useful in local/dev where the env may be
 * intentionally absent.
 */
export default function FirstPromoterScript() {
  const cid = process.env.NEXT_PUBLIC_FIRSTPROMOTER_TRACKING_ID;
  if (!cid) return null;

  // FirstPromoter's official loader pattern: stub `fpr` with a queue so any
  // calls issued before the CDN script arrives are buffered and then
  // drained on script load. `cid` is `JSON.stringify`-d defensively even
  // though it comes from our own build-time env (cheap; future-proof).
  const initSrc =
    `(function(w){w.fpr=w.fpr||function(){w.fpr.q=w.fpr.q||[];` +
    `w.fpr.q[arguments[0]=='set'?'unshift':'push'](arguments);};})(window);` +
    `fpr("init",{cid:${JSON.stringify(cid)}});` +
    `fpr("click");`;

  return (
    <>
      <Script id="fpr-init" strategy="afterInteractive">
        {initSrc}
      </Script>
      <Script
        src="https://cdn.firstpromoter.com/fpr.js"
        strategy="afterInteractive"
      />
    </>
  );
}

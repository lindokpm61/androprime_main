/**
 * FirstPromoter server-side conversion tracking.
 *
 * Records a sale against the referral that brought the buyer in. The
 * referral cookie (`_fprom_tid`) is set client-side by `fpr.js` when a
 * visitor lands on a `?fpr=<code>` URL; the checkout API routes read it
 * off the inbound request and forward it as Stripe Checkout
 * `metadata.fp_tid`. Then on `checkout.session.completed` the Stripe
 * webhook calls this helper with that same `tid`, the buyer's email, and
 * the order amount — FirstPromoter credits the affiliate and the loop
 * closes.
 *
 * No-ops (with a warn) when `FIRSTPROMOTER_API_KEY` is not configured —
 * keeps local/dev flows working without a key. Also no-ops on an organic
 * purchase (no `tid` cookie); there's nothing to attribute. Errors during
 * the call are logged but never thrown: a failed referral credit must not
 * break the Stripe webhook (which would block the order from completing
 * and would cause Stripe to retry indefinitely).
 */

const FIRSTPROMOTER_TRACK_URL = "https://firstpromoter.com/api/v1/track/sale";

type TrackSaleInput = {
  /**
   * Stripe event id. FirstPromoter accepts an `event_id` for idempotency,
   * which matters because the Stripe webhook can deliver the same event
   * more than once on retry. Passing the Stripe id makes this safe to
   * call repeatedly.
   */
  eventId: string;
  /** Buyer's email address. Required by FirstPromoter. */
  email: string;
  /** Amount in pence (Stripe minor units). */
  amountPence: number | null | undefined;
  /** Our internal user id. Optional — useful for cross-referencing later. */
  uid?: string | null;
  /**
   * Referral tracking id from the `_fprom_tid` cookie. `null` / empty
   * means an organic purchase; we skip the API call in that case rather
   * than send an unattributable sale.
   */
  tid?: string | null;
};

export async function trackFirstPromoterSale(input: TrackSaleInput): Promise<void> {
  const apiKey = process.env.FIRSTPROMOTER_API_KEY;
  if (!apiKey) {
    console.warn("[firstpromoter] FIRSTPROMOTER_API_KEY not set; skipping sale ping");
    return;
  }

  // Organic purchase — no referral to attribute. Cheap to skip rather than
  // send FirstPromoter a sale it can't match to a referrer.
  if (!input.tid) return;

  const payload: Record<string, string | number> = {
    event_id: input.eventId,
    email: input.email,
    amount: input.amountPence ?? 0,
    tid: input.tid,
  };
  if (input.uid) payload.uid = input.uid;

  try {
    const res = await fetch(FIRSTPROMOTER_TRACK_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(
        "[firstpromoter] /track/sale returned",
        res.status,
        text || "(no body)",
      );
    }
  } catch (err) {
    console.error("[firstpromoter] /track/sale call failed:", err);
  }
}

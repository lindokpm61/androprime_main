# Supplement Pre-Order Terms

**Last updated:** April 2026
**Version:** 1.0

---

## Purpose

This document governs how supplement pre-orders work during the period between Phase 0 launch and supplement stock availability. Pre-orders are the primary mechanism for validating demand and triggering Gate 0A (25+ pre-orders with deposits before placing the manufacturer MOQ).

---

## How Pre-Orders Work

### What the customer is buying

A pre-order is a full-price purchase of a supplement subscription, placed before the product is physically available. The customer pays the subscription price upfront. The product ships when manufacturing is complete and stock is available.

### Products available for pre-order

| Product | Pre-order price | Subscription price (ongoing) |
|---|---|---|
| Daily Stack | [£TBC — pending manufacturer quote] | [£TBC]/month |
| Joint & Recovery Collagen | [£TBC — pending manufacturer quote] | [£TBC]/month |
| Complete Men's Stack | [£TBC — pending manufacturer quote] | [£TBC]/month |

**Note:** Pre-order prices are locked at time of purchase. If subscription pricing changes before the product ships, pre-order customers pay the price they agreed to at checkout. The ongoing subscription price after the first month may differ.

### When pre-orders are triggered

Pre-orders are presented to customers after they receive their kit results, where those results indicate a relevant deficiency or marker. The results dashboard displays the supplement recommendation alongside a pre-order option.

Pre-orders may also be available directly on the supplement product pages for customers who wish to purchase without a kit result.

### What happens after pre-order

1. Customer places pre-order and pays full first-month price via Stripe.
2. Andro Prime records the pre-order in the database with timestamp and product.
3. When Gate 0A is met (25+ pre-orders), Andro Prime places the manufacturer MOQ.
4. Manufacturing and fulfilment takes approximately [4-6 weeks] from MOQ placement.
5. When stock arrives, Andro Prime ships the product to the customer and activates their monthly subscription.
6. The pre-order payment covers their first month. Second billing occurs 30 days after shipment.

---

## Refund Terms

### Customer-initiated refund (before product ships)

The customer can request a full refund at any time before their product is dispatched. No questions asked. Refunds are processed to the original payment method within 5-10 working days.

Email: hello@androprime.co.uk

### Automatic refund (product not launched within 90 days)

If the product has not been dispatched within 90 days of the pre-order date, Andro Prime will automatically refund the full pre-order amount to the customer's original payment method.

The customer will be notified by email at least 7 days before the automatic refund is processed. If the customer wishes to remain on the pre-order list beyond 90 days, they may opt in to an extended wait by responding to the notification email. In that case, the 90-day window resets.

### Andro Prime-initiated refund (gate not met)

If Andro Prime decides not to proceed with a supplement product (e.g. insufficient pre-orders to justify manufacturing), all pre-order customers for that product will receive a full automatic refund within 14 days of the decision. Customers will be notified by email.

### Post-shipment

Once the product has been dispatched, the pre-order converts to a standard subscription. Normal subscription cancellation and refund terms apply (see main Terms and Conditions).

---

## Consumer Rights

Pre-orders are covered by the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013. The 14-day cooling-off period begins on the day the customer receives the product, not on the day the pre-order is placed.

The customer's statutory rights under the Consumer Rights Act 2015 are not affected by these terms.

---

## What We Tell the Customer

### At checkout (pre-order page)

The following information must be clearly displayed before the customer completes their pre-order:

- This is a pre-order. The product is not yet available.
- Expected shipping: [X weeks] from pre-order (update this as manufacturing timeline becomes clearer).
- Full refund available at any time before dispatch. Email hello@androprime.co.uk.
- If the product is not dispatched within 90 days, you will receive an automatic full refund.
- After dispatch, your pre-order converts to a monthly subscription at [£TBC]/month. You can cancel at any time from your account dashboard.

### In the confirmation email

- Confirmation of pre-order amount and product.
- Reminder that the product is not yet available and will ship when ready.
- Estimated shipping window.
- Refund process (email hello@androprime.co.uk, any time before dispatch).
- Link to full pre-order terms.

### On the results dashboard

- Supplement recommendation based on results.
- Clear label: "Pre-order — ships when available."
- No language that implies the product is in stock or will ship immediately.

---

## Internal Gate Logic

This section is not customer-facing. It governs how pre-orders feed into Gate 0A.

| Metric | Threshold | Action |
|---|---|---|
| Total supplement pre-orders (all products) | 25+ | Trigger Gate 0A review. If confirmed, place manufacturer MOQ. |
| Pre-orders for a single product | 10+ | Sufficient to include that product in the MOQ order. |
| Pre-orders for a single product | <10 at Gate 0A review | Consider excluding from first MOQ run. Refund those customers or offer alternative product. |
| Days since first pre-order | 90 | Auto-refund any unshipped pre-orders unless customer opted in to extended wait. |

---

## Stripe Implementation Notes

- Pre-orders should be processed as a one-time Stripe payment (not a subscription).
- When the product ships, create a new Stripe subscription for the customer starting 30 days after shipment. The pre-order payment covers month one.
- Refunds use Stripe's standard refund API to the original payment method.
- Tag pre-orders with metadata: `type: pre-order`, `product: daily-stack`, `gate: 0A`.

---

## Review

These terms should be reviewed and updated when:
- Manufacturer quotes are received and retail pricing is confirmed
- Gate 0A is met and manufacturing begins
- Any pre-order product is cancelled or materially changed

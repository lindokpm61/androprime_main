# Transactional Emails

**Platform:** Customer.io
**Triggered by:** Stripe webhooks and API route events (see `automations/customerio/sequences.md` for event reference)
**Tone:** Plain English. Keith's voice. Functional first — tell them what happened, what's next, nothing more.

All emails use a minimal single-column layout. No hero images. Black on white. Andro Prime wordmark at top. Unsubscribe footer (required by law even for transactional).

---

## T-01 — Kit Order Confirmed

**Trigger:** `purchase` event (kit_type = any)
**Send:** Immediate

---

**Subject:** Your order is confirmed. Kit on its way.
**Preview text:** Here's what happens next.

---

Hi [first_name],

Order confirmed. Here's what you ordered:

**{{ kit_name }}**
Order ref: {{ order_id }}
Amount: £{{ amount }}

Your kit will be dispatched within 1 working day. You'll get a second email with your tracking link when it's on its way.

Once you've taken your finger-prick sample and posted it back using the pre-paid Royal Mail envelope inside, your results will be ready within 48 hours of the lab receiving it.

You'll get an email the moment they're in.

Your dashboard: https://andro-prime.com/account

— Keith
Andro Prime

---

_One-off purchase. No subscription. No further charges._

---

## T-02 — Kit Dispatched

**Trigger:** `kit_dispatched` event
**Send:** Immediate

---

**Subject:** Your kit has been dispatched.
**Preview text:** Here's your tracking link and what to do when it arrives.

---

Hi [first_name],

Your {{ kit_name }} has been dispatched and is on its way to you.

**Track your delivery:** {{ tracking_url }}

When your kit arrives, here's the drill:

1. Best taken fasted, first thing in the morning. Hormone baselines are most accurate before food.
2. Wash your hands in warm water for 30 seconds before you start. It makes a real difference to blood flow.
3. Use the side of your fingertip, not the tip. Less nerve endings, less sensation.
4. Fill the collection tube to the line. There are extra lancets in the kit in case you need a second attempt.
5. Seal the vial, pop it in the pre-paid return envelope, and drop it in any Royal Mail priority postbox.

Your results will be ready within 48 hours of the lab receiving your sample. We'll email you the moment they're in.

Any questions, reply to this email.

— Keith
Andro Prime

---

## T-03 — Results Ready

**Trigger:** `result_received` event
**Send:** Immediate
**Note:** This is also seq-02 Email 3. Build it once in Customer.io as a transactional send. Do not duplicate in seq-02.

---

**Subject:** Your results are ready.
**Preview text:** Log in to see what your blood is telling you.

---

Hi [first_name],

Your {{ kit_name }} results are in.

View them here: https://andro-prime.com/account

Your results are shown in plain English alongside the reference ranges and, where relevant, a specific recommendation based on your numbers. Dr Ewa Lindo has reviewed them.

If you have any questions about what you're looking at, reply to this email.

— Keith
Andro Prime

---

_Results are for informational purposes only and do not constitute a diagnosis or medical advice._

---

## T-04 — Founding Member Deposit Confirmed

**Trigger:** `founding_member_deposit` event
**Send:** Immediate

---

**Subject:** Founding member deposit received. You're in.
**Preview text:** What this means and what happens next.

---

Hi [first_name],

Your £75 founding member deposit has been received. You're secured as one of the first men through the door when our TRT service launches.

**What you've secured:**
- First-in-line access when the clinical service goes live
- Your £75 deposit applied in full as credit on your first month
- The founding member price, locked in

**What happens next:**
We're working through CQC registration. This is a regulatory process — it takes the time it takes. We will keep you updated at every meaningful milestone. You won't hear from us with filler.

Your deposit is fully refundable at any time. No questions asked. Just reply to this email.

You can check your founding member status at any time here: https://andro-prime.com/founding-member-status

— Keith
Andro Prime

---

_Your deposit of £75 is held separately from operating revenue and is fully refundable on request._

---

## T-05 — Supplement Subscription Started

**Trigger:** `subscription_started` event
**Send:** Immediate

---

**Subject:** Subscription confirmed. First delivery on its way.
**Preview text:** What to expect and when.

---

Hi [first_name],

Your {{ product_name }} subscription is confirmed.

**What you're getting:** {{ product_name }} — £{{ amount }}/month
**First delivery:** Within 3 working days
**Subsequent deliveries:** Monthly, same date each month

Your first sachet/serving covers 30 days. The goal is consistency. Most markers take 8 to 12 weeks to move meaningfully — we'll prompt you to retest at the right point so you can see the difference in your numbers.

Manage your subscription (pause, cancel, update payment) here: https://andro-prime.com/account

— Keith
Andro Prime

---

_Cancel any time from your account. No lock-in._

---

## T-06 — Subscription Renewal Receipt

**Trigger:** `invoice.payment_succeeded` event (subscription only)
**Send:** Immediate

---

**Subject:** Your Andro Prime subscription has renewed.
**Preview text:** Receipt for this month's delivery.

---

Hi [first_name],

Your {{ product_name }} subscription has renewed.

**Amount charged:** £{{ amount }}
**Date:** {{ renewal_date }}
**Next renewal:** {{ next_renewal_date }}

Your next delivery will be with you within 3 working days.

Manage your subscription: https://andro-prime.com/account

— Andro Prime

---

_Questions about your subscription? Reply to this email._

---

## T-07 — Failed Payment

**Trigger:** `invoice.payment_failed` event
**Send:** Immediate, then +3 days if not resolved, then +7 days (final)

---

**Subject:** There was a problem with your payment.
**Preview text:** Your subscription is on hold. Here's how to fix it quickly.

---

Hi [first_name],

We weren't able to take your {{ product_name }} payment of £{{ amount }}.

Your subscription is currently paused. Your next delivery is on hold until this is resolved.

**Update your payment details here:** https://andro-prime.com/account

If this was a temporary issue with your card, it should only take a minute to sort. If you'd like to cancel instead, you can do that from the same page.

— Andro Prime

---

_If you're having trouble, reply to this email and we'll help._

---

**+3 days follow-up (if still unresolved):**

Subject: Reminder: your Andro Prime payment is still outstanding.
Preview text: Your subscription is still paused.

Hi [first_name],

Just a reminder — we still haven't been able to process your {{ product_name }} payment of £{{ amount }}.

Update your details here: https://andro-prime.com/account

If you'd prefer to cancel, that's fine. You can do it from the same page.

— Andro Prime

---

**+7 days (final notice):**

Subject: Final notice: your subscription will be cancelled tomorrow.
Preview text: Action needed to keep your subscription active.

Hi [first_name],

We've tried to process your {{ product_name }} payment three times and haven't been able to. Your subscription will be cancelled tomorrow unless you update your payment details.

Update here: https://andro-prime.com/account

If you want to restart at any point, you're welcome to. No hard feelings.

— Keith
Andro Prime

---

## T-08 — Subscription Cancelled

**Trigger:** `customer.subscription.deleted` event
**Send:** Immediate

---

**Subject:** Your subscription has been cancelled.
**Preview text:** Sorry to see you go. A couple of things worth knowing.

---

Hi [first_name],

Your {{ product_name }} subscription has been cancelled. No further payments will be taken.

Your final delivery (if already dispatched) will still arrive. No action needed on your part.

If you cancelled because you weren't seeing results, it's worth knowing that most markers take 8 to 12 weeks to move. If you haven't retested yet, that's the most reliable way to see what's changed.

If the timing just isn't right, you can restart any time from your account.

https://andro-prime.com/account

— Keith
Andro Prime

---

_Your data and account remain intact. Nothing is deleted._

---

## Customer.io Build Notes

| ID | Trigger event | Delay | Suppression |
|----|--------------|-------|-------------|
| T-01 | `purchase` | Immediate | None |
| T-02 | `kit_dispatched` | Immediate | None |
| T-03 | `result_received` | Immediate | Also suppresses seq-02 Email 3 |
| T-04 | `founding_member_deposit` | Immediate | None |
| T-05 | `subscription_started` | Immediate | None |
| T-06 | `invoice.payment_succeeded` | Immediate | Suppress if `subscription_started` fired within last 10 mins (avoid double-send on first payment) |
| T-07 | `invoice.payment_failed` | Immediate + Day 3 + Day 7 | Stop on payment success |
| T-08 | `customer.subscription.deleted` | Immediate | Suppress if cancellation was triggered by T-07 Day 7 (already warned) |

**Liquid variables required:**
- `{{ customer.first_name }}`
- `{{ event.kit_name }}` — map from `kit_type`: `testosterone` → "Testosterone Health Check", `energy-recovery` → "Energy & Recovery Check", `hormone-recovery` → "Hormone & Recovery Check"
- `{{ event.order_id }}`
- `{{ event.amount }}`
- `{{ event.tracking_url }}`
- `{{ event.product_name }}` — map from `product_slug`
- `{{ event.renewal_date }}`
- `{{ event.next_renewal_date }}`

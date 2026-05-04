# seq-05: Churn Prevention

**Platform:** Customer.io
**Trigger:** Active supplement subscriber who has not opened the last 3 emails, OR has visited `/account` or `/subscriptions` (set attribute `viewed_cancel_page: true` via page event).
**Goal:** Retain the subscriber, or convert to a pause instead of a cancellation.
**Tone:** Frank, personal, zero pressure. This is not a win-back sequence with discounts and urgency. It's a direct conversation. If they're done, let them go well. If there's something fixable, fix it.

---

## Email 1 - Day 0: Check-in

**Subject:** Everything okay?
**Preview:** No pitch. Just checking in.

---

Hi {{ customer.first_name }},

Quick one: you haven't opened the last few emails and I wanted to check in.

No pitch here. I just want to know if everything is okay with your subscription, your results, or anything else.

If the supplement isn't doing what you hoped, reply and tell me. If you're thinking about cancelling, that's your call, but I'd rather you told me why than have you quietly drift. There might be something fixable that I'm not aware of.

If everything's fine and you just haven't had time to read emails: no problem. Carry on.

Your account page if you need it: https://andro-prime.com/account

Keith
Andro Prime

---

## Email 2 - +3 days: If it's not working

**Subject:** If it's not working - here's why that might be.
**Preview:** The most common reasons supplements don't produce results. And what to do about them.

---

Hi {{ customer.first_name }},

If you're still on the subscription but starting to wonder whether it's worth continuing: this email is for you.

The most common reasons supplements don't produce the results men expect:

**1. Timing expectations**

Vitamin D and B12 take 8 to 12 weeks to move meaningfully in the blood. The subjective experience (energy, recovery, mental clarity) usually follows the blood marker, not the other way around. If you're at 4 to 6 weeks and nothing feels different, that's not unusual. It's also not failure.

**2. No before/after comparison**

Without a retest, there's no way to know whether your levels have moved. Most men who discontinue do so because they're going by feel alone. A retest removes the guesswork. If your levels have improved and you don't know it, that's information worth having, especially if you're about to cancel.

**3. Inconsistency**

Supplements work on the same principle as training: consistency over time produces the result. One week on, one week off doesn't build up in the system the way daily use does.

**4. Wrong product for your result**

If the recommendation you received doesn't match what your markers actually showed, it won't work as well. Reply to this email and tell me your result; I'll check that the product you're on is the right one.

If none of these apply and you genuinely want to cancel, there's no lock-in: https://andro-prime.com/account

Keith
Andro Prime

---

## Email 3 - +7 days: A frank word from Keith

**Subject:** A frank word from me.
**Preview:** This isn't a retention email. It's just honest.

---

Hi {{ customer.first_name }},

I'm going to be straight with you.

I don't want you on the subscription if it's not the right thing for you. I mean that. A man cancelling his subscription because he doesn't need it anymore, or because he tried it and it didn't fit, is a reasonable outcome. I'm not interested in trapping anyone.

What I am interested in is whether there's something fixable that I don't know about.

If the problem is: the supplement isn't working and you don't know whether to trust the process: the honest answer is that the retest at 3 months is the only way to know for certain. I'd rather you stayed for that window and had real data than cancelled now on feel alone.

If the problem is: money is tight: you can pause your subscription from your account page. Not cancel. Pause. Your next delivery holds, your subscription stays active, and you can restart when it suits you. No penalty.

If the problem is something else entirely: reply here. I read these.

If you've decided to cancel, the account page is: https://andro-prime.com/account

No hard feelings, and no spam after you're gone. Your results and account stay intact.

Keith
Andro Prime

---

## Customer.io Build Notes

| # | Delay | Notes |
|---|-------|-------|
| 1 | Day 0 (trigger met) | Check-in |
| 2 | +3 days | If no reply or action |
| 3 | +7 days | If still no action |

**Trigger conditions:**
- Subscriber has not opened last 3 emails sent to them (Customer.io engagement filter), OR
- `viewed_cancel_page = true` (set via page event on `/account` or `/subscriptions` page view)

**Stop conditions:**
- Subscription cancelled: stop sequence, no further sends
- Subscription paused: stop sequence
- Email opened and replied: stop sequence (manual flag or use Customer.io's reply detection)
- Subscription renewed/payment processed: stop sequence and clear the churn signal

**After Email 3:** If no response and subscription is still active, suppress further seq-05 sends for 60 days. Reset `viewed_cancel_page` to false.

**seq-04 coordination:** Pause seq-04 emails while seq-05 is active. Resume seq-04 after seq-05 resolves without cancellation.

**Pause vs cancel:** Email 3 references a pause option. Confirm that Stripe subscription pause is implemented in the account portal before activating this sequence. If pause is not yet built, remove the reference in Email 3 and replace with "take a month off" framing using a Stripe pause or a manual hold process.

**Liquid variables required:**
- `{{ customer.first_name }}`
- `{{ customer.active_product_slug }}` : for potential personalisation in Email 2 if needed

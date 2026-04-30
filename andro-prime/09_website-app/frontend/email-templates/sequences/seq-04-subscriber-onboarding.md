# seq-04 — Supplement Subscriber Onboarding

**Platform:** Customer.io
**Trigger:** `subscription_started` event
**Goal:** Prevent early churn. Set accurate expectations on supplement timelines. Drive retest at Day 90.
**Tone:** Supportive, realistic. Like a coach who's been through it. No hype. No false promises. Keith's voice.

**Compliance note:** Never frame the retest as "find out if the supplement fixed you." Use: "find out how your levels have changed." Supplements support — they do not cure.

---

## Email 1 — Immediate: Subscription confirmed

**This email = T-05 (already written in `transactional/transactional-emails.md`)**

Build it once in Customer.io as a transactional send triggered by `subscription_started`. Reference it here. Do not duplicate.

---

## Email 2 — +5 days: What to expect in the first few weeks

**Subject:** Day 5: what to expect over the next 8 weeks.
**Preview:** The honest timeline on supplement results — and what to look for.

---

Hi {{ customer.first_name }},

You're a few days into your {{ customer.active_product_slug | replace: '-', ' ' | capitalize }} subscription. A quick note on what the next 8 weeks actually look like — because most people expect results faster than supplements deliver them.

The honest timeline:

**Weeks 1–2:** Nothing measurable. The supplement is building up in your system. This is normal. Don't read anything into how you feel in the first fortnight.

**Weeks 3–5:** Some men notice changes — improved energy in the morning, slightly faster recovery between sessions, less of the mental flatness. Others notice nothing yet. Both are normal. Blood markers at this point would still show little change.

**Weeks 8–12:** This is the window where most markers move meaningfully and where the subjective changes become more consistent. This is also the right window for a retest — your before and after comparison.

**The one thing that matters most:** Consistency. Taking it occasionally doesn't produce the same effect as taking it daily. If mornings are easier, set it next to something you already do in the morning — coffee, toothbrush, whatever. The habit is the product as much as the supplement.

If you have any questions about your subscription, your result, or anything else, reply to this email.

— Keith
Andro Prime

---

## Email 3 — +20 days: Check-in

**Subject:** Three weeks in — how's it going?
**Preview:** We genuinely want to know. And if something's not right, now is the time to say.

---

Hi {{ customer.first_name }},

Three weeks in. A quick check-in, because this is the point where most people either feel like something is starting to work, or they're starting to wonder if it is.

If something's working — good. Keep going. The changes compound over the next month.

If you're not noticing anything yet: that's still normal at this stage. For Vitamin D and B12 in particular, the blood marker moves before the subjective experience does. You won't necessarily feel a step-change — it's more gradual than that. The retest at 8 to 12 weeks is the most reliable indicator.

If something is wrong — if there's a delivery problem, a billing issue, or you want to adjust or pause — your account page is the quickest route: https://andro-prime.com/account. Or reply here and I'll sort it personally.

One thing I'd ask, if you're willing: what's been the biggest change you've noticed, if any? Or what's still the same that you were hoping would shift? I read every reply. It helps us understand what's actually happening for the men using this.

— Keith
Andro Prime

---

## Email 4 — +30 days: Second delivery + retest prompt

**Subject:** Your second delivery is on its way. And one thing worth knowing.
**Preview:** The 3-month retest — why it matters and when to do it.

---

Hi {{ customer.first_name }},

Your second delivery is on its way. You should have it within 3 working days.

A month in. Here's the one thing I'd encourage you to think about for the next 60 days.

**The retest.**

The most common reason men cancel a supplement subscription isn't that it stopped working. It's that they have no way to know whether it's working, so the motivation drifts.

The retest closes that loop. At 3 months, your markers will show whether your levels have moved — specifically, how much. For Vitamin D and B12, the change is almost always visible at 90 days of consistent supplementation. For hs-CRP, the same. The number tells you something you can't feel.

There's a subscriber discount on your retest kit. When you're at the 80-day mark, we'll send you the details. No action needed from you right now — just know it's coming.

Managing your subscription: https://andro-prime.com/account

— Keith
Andro Prime

---

## Email 5 — +75 days: Retest prompt

**Subject:** 75 days in — it's time to check your numbers.
**Preview:** Your subscriber retest discount. Book it now to have results by Day 90.

---

Hi {{ customer.first_name }},

You're 75 days into your subscription. This is the prompt I mentioned at Day 30.

The 3-month retest is the most useful thing you can do right now. Here's why timing matters: if you order today, the kit arrives within 1 to 2 days, and with a 48-hour lab turnaround, you'll have your results around Day 90 — exactly the right window to see meaningful marker movement from 3 months of consistent supplementation.

{% if customer.active_product_slug == 'daily-stack' or customer.active_product_slug == 'complete-mens-stack' %}
{% if customer.kit_type_latest == 'energy-recovery' %}
**Your retest — Kit 2, Energy & Recovery Check:**
The same panel you started with — Vitamin D, B12, hs-CRP, Ferritin. Your before result is in your dashboard. The after result will sit alongside it.

**Kit 2 at 10% subscriber discount — £107.10:** https://andro-prime.com/kits/energy-recovery?discount=SUBSCRIBER10

{% elsif customer.kit_type_latest == 'hormone-recovery' %}
**Your retest — Kit 3, Hormone & Recovery Check:**
Full panel retest — all 9 markers. Your before result is in your dashboard.

**Kit 3 at 10% subscriber discount — £161.10:** https://andro-prime.com/kits/hormone-recovery?discount=SUBSCRIBER10

{% elsif customer.kit_type_latest == 'testosterone' %}
**Your retest — Kit 1, Testosterone Health Check:**
Testosterone, SHBG, Free Androgen Index, Albumin. Your before result is in your dashboard.

**Kit 1 at 10% subscriber discount — £89.10:** https://andro-prime.com/kits/testosterone?discount=SUBSCRIBER10
{% endif %}
{% endif %}

The discount code `SUBSCRIBER10` is applied automatically at the link above. It's valid for 14 days.

Three outcomes from the retest — and all of them are useful:

1. **Levels improved:** Confirmation the supplement is working. Most men find this motivating enough to stick with it long-term.
2. **Levels unchanged:** Worth investigating why — absorption, dose, something else. Reply here and we'll help you think it through.
3. **Levels worsened:** Time for a closer look. Sometimes there's an underlying cause that a supplement alone won't address. Knowing that is still better than not knowing.

— Keith
Andro Prime

---

## Customer.io Build Notes

| # | Delay | Notes |
|---|-------|-------|
| 1 | Immediate | = T-05. Reference transactional template. |
| 2 | +5 days | Sequence email |
| 3 | +20 days | Sequence email |
| 4 | +30 days | Sequence email |
| 5 | +75 days | Sequence email — retest prompt |

**Stop goal:** None — this sequence runs to completion regardless of engagement. Individual emails may be suppressed by churn signals (if seq-05 is active, pause seq-04 to avoid conflicting messaging).

**Retest discount code:** `SUBSCRIBER10` (10% off). Must be set up as a Stripe coupon before Email 5 sends. The discount links use a `?discount=` query param — confirm your checkout handles this via URL param before activating.

**Email 5 Liquid note:** The retest kit recommendation branches on `kit_type_latest` (the kit they originally bought). If `kit_type_latest` is not set for some users, add a fallback that links to the test selector rather than a specific kit.

**seq-04 / seq-05 coordination:** If seq-05 (churn prevention) fires while seq-04 is active, suppress seq-04 Emails 3–5 until seq-05 resolves. Conflicting messaging (retention check-in from seq-05 alongside a neutral "how's it going" from seq-04) will feel disjointed.

**Liquid variables required:**
- `{{ customer.first_name }}`
- `{{ customer.active_product_slug }}` — set via identifyUser() at subscription_started
- `{{ customer.kit_type_latest }}` — set at result_received

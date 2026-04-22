# seq-01 — Pre-Launch Waitlist

**Platform:** Customer.io
**Trigger:** `waitlist_signup` event
**Audience:** Anyone who signs up to the waitlist before launch day.
**Goal:** Purchase at launch (kit, any). Secondary: build trust and anticipation through the wait.
**Tone:** Insider access, early adopter energy. Keith's voice — personal, direct. These people signed up before there was anything to buy. Treat them like they made a smart call.

**Important — Email 4 (launch day):** This cannot fire as a time-delay in the sequence because the launch date is not fixed. Build Emails 1–3 as a standard time-delay sequence. Email 4 is a separate one-time broadcast to the `waitlist_signed_up` segment, sent manually on launch day. Do not wire Email 4 as a sequence delay.

---

## Email 1 — Immediate: Welcome

**Subject:** You're on the list. Here's what's coming.
**Preview:** Why this exists, and what you'll get when we launch.

---

Hi {{ customer.first_name }},

You're on the list.

Here's the short version of what you've signed up for. Andro Prime sells at-home blood test kits for men — testosterone, energy markers, inflammation, iron stores — followed by specific recommendations based on your actual results. Not guesses. Not generic supplements. Your numbers, in plain English, with a clear next step.

The reason this exists: UK men over 35 are routinely told their levels are "normal" by GPs who are screening for pathology, not optimising performance. Normal means not ill. It doesn't mean good. The gap between those two things is where most men are stuck.

We launch soon. When we do, you'll hear from me first — before it's public — with a discount that's only available to people on this list.

Until then, I'll send you a couple of emails worth reading. Not filler.

— Keith
Andro Prime

---

## Email 2 — +4 days: The GP gap

**Subject:** The men's health system in the UK has a problem.
**Preview:** Why "your levels are normal" is the wrong answer to the wrong question.

---

Hi {{ customer.first_name }},

Here's the problem, as plainly as I can put it.

If you're a UK man over 35 and you go to your GP because you're knackered all the time, your recovery from exercise has gone to hell, or you've just stopped feeling like yourself — you'll probably be sent for a blood test. If your testosterone comes back above 8 or 9 nmol/L, you'll be told everything is fine.

The NHS reference range for testosterone runs from roughly 8 to 29 nmol/L. A man at 10 nmol/L and a man at 25 nmol/L are both "normal." Most research on how men feel, perform, and function suggests levels below 12 to 15 nmol/L correlate significantly with exactly the symptoms you went to the GP with. But your GP isn't measuring for that. They're measuring for clinical hypogonadism — the diagnostic threshold, not the functional one.

The same problem applies to Vitamin D, B12, and iron stores. The NHS doesn't test these unless you specifically ask, and even then the reference range is built around deficiency, not optimisation.

The result is millions of men who are genuinely unwell — not ill enough for the NHS, not healthy enough to function at their best — with no useful information about what's actually causing it.

That's the gap Andro Prime exists to close. Test first. Tell you what your blood is showing. Give you a specific recommendation based on your actual numbers.

More on how it works in a few days.

— Keith
Andro Prime

---

## Email 3 — +8 days: The panel explained

**Subject:** What 4 blood markers can tell you that your GP isn't checking.
**Preview:** The markers most likely to explain why active men in their 40s feel off.

---

Hi {{ customer.first_name }},

The Energy & Recovery Check (Kit 2) tests four markers. Here's why each one was chosen — and what a result in each direction actually means.

**Vitamin D**
Vitamin D functions like a hormone. It has receptors in muscle tissue, the immune system, and the cells that govern testosterone production. UK men are chronically deficient between October and April. Supplementation at 4,000 IU/day is the standard correction protocol, and it works. Most men don't know their level because their GP doesn't test it unless they ask. It's one of the most correctable causes of fatigue and poor recovery.

**B12 (Active B12)**
B12 is essential for red blood cell production and neurological function. Low B12 produces fatigue that doesn't respond to sleep, mental flatness, and difficulty concentrating. B12 absorption gets less efficient with age — which is why it's disproportionately common in men over 40 even with a decent diet.

**hs-CRP (Inflammation)**
hs-CRP is a sensitive marker of systemic inflammation. In active men, elevated hs-CRP often reflects cumulative joint and connective tissue stress. The soreness that used to clear in a day and now takes three. When it's elevated without joint symptoms, it usually points to training overload, sleep debt, or diet. In either case, it's measurable, and knowing where you sit changes what you do about it.

**Ferritin (Iron Stores)**
Ferritin measures your body's stored iron, separate from circulating iron. Low ferritin causes fatigue and reduced exercise capacity that's easily mistaken for overtraining or low motivation. If it comes back low, we won't try to sell you an iron supplement — iron needs precise dosing by a GP. Instead, you get a template letter to take to your NHS appointment.

That's the panel. When we launch, Kit 2 is £44. Kit 1 (testosterone only) is £29. Kit 3 covers all nine markers combined for £69.

You'll get first access — and a discount — when we go live.

— Keith
Andro Prime

---

## Email 4 — Launch day: We're live (broadcast send)

**Subject:** We're live. Your 10% discount is below.
**Preview:** The kits are available. Here's your code — for the next 48 hours.

**Trigger:** Manual broadcast to `waitlist_signed_up` segment on launch day. Not a sequence delay.

---

Hi {{ customer.first_name }},

We're live.

The kits are available to order now. Three options:

**Kit 1 — Testosterone Health Check — £29**
Total testosterone, SHBG, Free Androgen Index, Albumin. Find out where your testosterone actually stands.
https://andro-prime.com/kits/testosterone

**Kit 2 — Energy & Recovery Check — £44**
Vitamin D, Active B12, hs-CRP, Ferritin. The four markers most likely to explain why active men stop recovering like they used to.
https://andro-prime.com/kits/energy-recovery

**Kit 3 — Hormone & Recovery Check — £69**
All nine markers. Testosterone and the energy panel combined. The most complete picture.
https://andro-prime.com/kits/hormone-recovery

**Your 10% discount code: {{ event.discount_code }}**
Valid for 48 hours. One use. Applied at checkout.

Not sure which to start with? The quiz takes 2 minutes and recommends the right kit based on your symptoms:
https://andro-prime.com/test-selector

Dr Ewa Lindo reviews every result. UKAS ISO 15189 accredited lab. Results in your dashboard within 48 hours of the lab receiving your sample.

Thank you for waiting.

— Keith
Andro Prime

---

## Customer.io Build Notes

| # | Delay | Notes |
|---|-------|-------|
| 1 | Immediate | Sequence email |
| 2 | +4 days | Sequence email |
| 3 | +8 days | Sequence email |
| 4 | Launch day | Manual broadcast — separate from sequence |

**Email 4 implementation:** Create a separate one-time broadcast campaign in Customer.io. Audience: segment `waitlist_signed_up = true` AND `has_purchased = false`. Send manually on launch day. The discount code (`{{ event.discount_code }}`) should be set up as a Stripe coupon before this send — 10% off, one use per customer, 48-hour expiry.

**Stop goal for sequence (Emails 1–3):** Any kit `purchase` event. Stop sequence immediately.

**Suppression:** If a user purchases before launch (unlikely but possible if you soft-launch), suppress Email 4 broadcast for that user.

**Liquid variables required:**
- `{{ customer.first_name }}`
- `{{ event.discount_code }}` — Stripe coupon code, set as event attribute on the broadcast send

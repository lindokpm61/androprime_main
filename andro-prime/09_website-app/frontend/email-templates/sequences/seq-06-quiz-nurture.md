# seq-06 — Quiz Nurture (No Purchase)

**Platform:** Customer.io
**Trigger:** `quiz_complete` event where no `purchase` event fires within 24 hours.

**Audience:** Men who completed the test selector quiz but didn't buy.
**Goal:** Kit purchase. Stop sequence immediately on any kit purchase.
**Tone:** Keith's voice. No urgency pressure. Explain the value of knowing — not the value of the product.

**User attributes to set at quiz_complete:**
- `quiz_recommended_kit` — from event payload `recommended_kit` field (`testosterone`, `energy-recovery`, `hormone-recovery`)
- `quiz_symptom_flags` — from event payload `symptom_flags` array

---

## Email 1 — Immediate (sent after 24h delay if no purchase): Your quiz result

**Subject:** Your Andro Prime quiz result.
**Preview:** Based on what you told us — here's what we'd recommend.

---

Hi {{ customer.first_name }},

You completed the Andro Prime test selector. Based on what you told us, here's what we'd recommend:

{% if customer.quiz_recommended_kit == 'testosterone' %}
**Kit 1 — Testosterone Health Check — £29**

The symptoms you described are most commonly linked to testosterone. The most direct way to find out whether that's the cause is to test it. Kit 1 checks total testosterone, SHBG, Free Androgen Index, and Albumin. Results in 48 hours of the lab receiving your sample.

**Order Kit 1:** https://andro-prime.com/kits/testosterone

{% elsif customer.quiz_recommended_kit == 'energy-recovery' %}
**Kit 2 — Energy & Recovery Check — £44**

What you described points to the energy and recovery panel. Vitamin D, B12, hs-CRP, and Ferritin are the four markers that most directly explain why active men stop recovering like they used to. Kit 2 checks all four. Results in 48 hours of the lab receiving your sample.

**Order Kit 2:** https://andro-prime.com/kits/energy-recovery

{% elsif customer.quiz_recommended_kit == 'hormone-recovery' %}
**Kit 3 — Hormone & Recovery Check — £69**

The ambiguity in what you described is what pointed us to Kit 3. It covers 9 markers across testosterone, energy, and inflammation — so wherever the cause is, you'll find it in one test. Results in 48 hours of the lab receiving your sample.

**Order Kit 3:** https://andro-prime.com/kits/hormone-recovery
{% endif %}

If the recommendation doesn't feel right, or you want to talk it through, just reply.

— Keith
Andro Prime

---

## Email 2 — +2 days: The gap

**Subject:** The gap between suspecting something's off and actually knowing.
**Preview:** Most men wait too long to find out.

---

Hi {{ customer.first_name }},

Most men who take one of our tests know something's off before they buy it. They've known for a while.

They just haven't had a number to point to.

That gap — between feeling like something has changed and having data that confirms it — is where a lot of energy gets wasted. Trying to fix the wrong thing. Putting it down to stress or age or working too hard. Waiting for it to improve on its own.

The test doesn't change your life by itself. What it does is tell you whether what you're experiencing is measurable, and if so, what's causing it. That's the part that makes the next step obvious.

{% if customer.quiz_recommended_kit == 'testosterone' %}
Kit 1 is £29. Five minutes of your time when the kit arrives. The finger-prick sample goes in a pre-paid Royal Mail envelope. Results within 48 hours of the lab receiving it.

**Order here:** https://andro-prime.com/kits/testosterone

{% elsif customer.quiz_recommended_kit == 'energy-recovery' %}
Kit 2 is £44. Same process — finger-prick, pre-paid envelope, 48-hour turnaround from the lab.

**Order here:** https://andro-prime.com/kits/energy-recovery

{% elsif customer.quiz_recommended_kit == 'hormone-recovery' %}
Kit 3 is £69 for 9 markers. Same process — finger-prick, pre-paid envelope, 48-hour turnaround.

**Order here:** https://andro-prime.com/kits/hormone-recovery
{% endif %}

— Keith
Andro Prime

---

## Email 3 — +5 days: What men find

**Subject:** What most men actually discover with this test.
**Preview:** Not always what they expected.

---

Hi {{ customer.first_name }},

Something worth knowing about men who go through this: the most common reaction when results come in isn't surprise. It's relief.

Not always because the news is good. Sometimes it's because having a real number — even one that needs attention — is easier to deal with than not knowing.

The alternative is the GP appointment. Which often ends with "your levels are normal" — no context, no trend, no explanation of what normal means for you specifically. And you're back where you started, but a few weeks later.

{% if customer.quiz_recommended_kit == 'testosterone' %}
Kit 1 gives you your testosterone, SHBG, Free Androgen Index, and Albumin. In plain English. With Dr Ewa Lindo's review attached. No referral needed, no waiting list, no GP appointment.

**Order Kit 1 — £29:** https://andro-prime.com/kits/testosterone

{% elsif customer.quiz_recommended_kit == 'energy-recovery' %}
Kit 2 gives you your Vitamin D, B12, hs-CRP, and Ferritin — the four markers most likely to explain what active men put down to "just getting older." In plain English, with Dr Ewa Lindo's review.

**Order Kit 2 — £44:** https://andro-prime.com/kits/energy-recovery

{% elsif customer.quiz_recommended_kit == 'hormone-recovery' %}
Kit 3 gives you 9 markers across hormones, energy, and inflammation. The full picture. In plain English, with Dr Ewa Lindo's review.

**Order Kit 3 — £69:** https://andro-prime.com/kits/hormone-recovery
{% endif %}

— Keith
Andro Prime

---

## Email 4 — +10 days: Final

**Subject:** Last one from us on this. Just the facts.
**Preview:** What you get, what it costs, what happens next.

---

Hi {{ customer.first_name }},

Last email on this. Just the facts.

{% if customer.quiz_recommended_kit == 'testosterone' %}
**Kit 1 — Testosterone Health Check — £29**

You take a finger-prick blood sample at home. It goes in a pre-paid Royal Mail envelope included in the kit. Our UKAS-accredited lab processes it. Within 48 hours of receiving your sample, your results are in your dashboard — testosterone, SHBG, Free Androgen Index, and Albumin — in plain English with Dr Ewa Lindo's review.

One-off payment. No subscription. No further charges.

**Order here:** https://andro-prime.com/kits/testosterone

{% elsif customer.quiz_recommended_kit == 'energy-recovery' %}
**Kit 2 — Energy & Recovery Check — £44**

Finger-prick sample at home. Pre-paid Royal Mail envelope. 48-hour turnaround from the lab. Results in plain English with Dr Ewa Lindo's review: Vitamin D, B12, hs-CRP, Ferritin.

If something's flagged, you get a specific recommendation based on your numbers. If everything's fine, you get a baseline. One-off payment. No subscription.

**Order here:** https://andro-prime.com/kits/energy-recovery

{% elsif customer.quiz_recommended_kit == 'hormone-recovery' %}
**Kit 3 — Hormone & Recovery Check — £69**

Nine markers: total testosterone, SHBG, Free Androgen Index, Albumin, Free T, Vitamin D, B12, hs-CRP, Ferritin. Finger-prick sample, pre-paid envelope, 48-hour lab turnaround. Plain English results with Dr Ewa Lindo's review. One-off payment. No subscription.

**Order here:** https://andro-prime.com/kits/hormone-recovery
{% endif %}

If you've decided it's not for you right now, no problem. You won't hear from us about this again.

— Keith
Andro Prime

---

## Customer.io Build Notes

| # | Delay | Notes |
|---|-------|-------|
| 1 | +24h from `quiz_complete` (if no purchase) | Check no purchase event in preceding 24h |
| 2 | +2 days from Email 1 | Time delay |
| 3 | +5 days from Email 1 | Time delay |
| 4 | +10 days from Email 1 | Time delay |

**Trigger:** `quiz_complete` event. Use a 24-hour delay before Email 1 fires, with a suppression check for any `purchase` event in that window. If they purchase during the 24h window, suppress entire sequence.

**Stop goal:** Any `purchase` event. Stop immediately.

**Suppression:** If user is already in seq-01 (waitlist) or seq-02 (post-purchase), seq-06 should not run.

**User attributes to set at `quiz_complete` via identifyUser():**

| Attribute | Value |
|-----------|-------|
| `quiz_recommended_kit` | From event payload `recommended_kit` |
| `quiz_symptom_flags` | From event payload `symptom_flags` (array) |

Add these two attributes to the `identifyUser()` call in `/api/forms/test-selector` route.

**Liquid variables required:**
- `{{ customer.first_name }}`
- `{{ customer.quiz_recommended_kit }}` — `testosterone`, `energy-recovery`, or `hormone-recovery`

**New event needed:** `quiz_complete` is already defined in sequences.md and emitted by `/api/forms/test-selector`. Confirm `recommended_kit` is in the payload and being forwarded to Customer.io.

# seq-03c — Normal Results

**Platform:** Customer.io
**Trigger:** `result_received` event where no seq-03a or seq-03b/03d conditions are met.

Specifically:
- `kit_type = testosterone` AND `total_testosterone ≥ 15 nmol/L`
- OR `kit_type = energy-recovery` AND all markers in range (no `low_vitamin_d`, no `low_b12`, no `elevated_crp`, no `low_ferritin`)
- OR `kit_type = hormone-recovery` AND all markers in range AND `total_testosterone ≥ 15 nmol/L`

**Suppression:** Do not fire if seq-03a, seq-03b, or seq-03d is active for the same user.

**Goal:** Supplement purchase OR Kit 1/2 cross-sell purchase. Stop sequence on either.

**Tone:** Honest and low-pressure. Good news, but not euphoric. Give them something useful even when there's nothing to fix.

---

## Email 1 — Day 0: Results in

**Subject:** Your results: everything came back in range.
**Preview:** Here's what that actually means.

---

Hi {{ customer.first_name }},

Your {{ event.kit_name }} results are in. The short version: everything came back in range.

View your full results here: https://andro-prime.com/account

Dr Ewa Lindo has reviewed them. Your results are shown in plain English alongside the reference ranges, so you can see exactly where your numbers sit.

{% if customer.kit_type_latest == 'testosterone' %}
Your testosterone is {{ customer.testosterone_value }} nmol/L, which puts you comfortably within the normal range. SHBG, Free Androgen Index, and Albumin all look fine.

One thing worth knowing: normal means you're not deficient. It doesn't tell you where your levels were 5 or 10 years ago, or which direction they're heading. That's what a second test, 6 to 12 months from now, is for.
{% elsif customer.kit_type_latest == 'energy-recovery' %}
Your Vitamin D, B12, hs-CRP, and Ferritin all came back in range. No deficiencies, no flags.

This is useful in two ways. It rules out the obvious causes. And it gives you a baseline to compare against when you retest in 6 to 12 months.
{% elsif customer.kit_type_latest == 'hormone-recovery' %}
Your testosterone, Vitamin D, B12, hs-CRP, and Ferritin all came back in range. No deficiencies, no flags across the panel.

This is a solid baseline. The most useful thing you can do with a good result is retest consistently, so you have a trend rather than a single data point.
{% endif %}

Any questions about what you're looking at, reply to this email.

— Keith
Andro Prime

---

## Email 2 — +2 days: Normal isn't the same as optimal

**Subject:** Normal doesn't mean optimal.
**Preview:** The number you got — and what it doesn't tell you.

---

Hi {{ customer.first_name }},

Your results came back in range. Worth taking a minute to explain what that actually means.

{% if customer.kit_type_latest == 'testosterone' %}
The NHS "normal" range for testosterone runs from roughly 8 to 29 nmol/L. That's a wide range. A man at 16 nmol/L at 28 and a man at 16 nmol/L at 48 are both "normal" — but the trajectory behind those numbers is very different.

What the result tells you: you're not deficient. What it doesn't tell you: whether your levels are where they were a decade ago, and whether they're holding or declining slowly. Testosterone drops roughly 1 to 2% per year after 35. That's not dramatic year to year. But over a decade, it adds up.

The men who get the most useful information from testing are the ones who test twice — a baseline and a follow-up at 6 to 12 months. If your levels hold, you're in good shape. If they've shifted, you've caught it early.
{% else %}
Being "in range" for Vitamin D, B12, and hs-CRP doesn't mean those levels are fixed. Vitamin D deficiency is common in UK men between October and March — sunlight can't maintain adequate levels regardless of diet. B12 absorption gets less efficient with age. hs-CRP can shift with training load, sleep, and stress.

What changes this: consistent testing. A second reading in 6 to 12 months tells you whether your markers are holding or beginning to drift. That's more valuable than any single result.
{% endif %}

Nothing urgent here. Just useful context.

— Keith
Andro Prime

---

## Email 3 — +7 days: What to do from here

**Subject:** One honest recommendation given your results.
**Preview:** Not nothing — but not dramatic either.

---

Hi {{ customer.first_name }},

{% if customer.kit_type_latest == 'testosterone' %}
Your testosterone is in range. Here's the honest take on what makes sense from here.

There's nothing to treat. But Zinc is the most well-evidenced mineral for testosterone maintenance — not raising it, keeping it where it is. Most UK men, particularly those training consistently or under chronic stress, don't hit the recommended daily intake from diet alone. Magnesium and Vitamin D both support the same hormonal systems.

The Daily Stack contains 30mg of Zinc, 400mg of Magnesium Glycinate, 4,000 IU of D3, and 1,000mcg of B12. It won't move your testosterone number significantly. What it does is support the conditions that allow your body to maintain it.

Zinc contributes to the maintenance of normal testosterone levels.
Magnesium contributes to the reduction of tiredness and fatigue.
Vitamin D contributes to normal muscle function.

**Daily Stack — £34.95/month:** https://andro-prime.com/supplements/daily-stack

Cancel any time from your account.

{% if customer.symptom_flags contains 'fatigue' or customer.symptom_flags contains 'energy' %}
One more thing: based on what you told us when you took the quiz, you've been dealing with fatigue or energy issues. Your testosterone is fine — so that rules out one cause. But Vitamin D, B12, and inflammation are the other main drivers of exactly those symptoms, and we can't see those from this test. Kit 2 checks all four energy markers for £44.

**Kit 2 — Energy & Recovery Check:** https://andro-prime.com/kits/energy-recovery
{% endif %}

If you'd rather just hold the baseline and retest in 6 to 12 months, that's a completely reasonable call.

{% elsif customer.kit_type_latest == 'energy-recovery' %}
Your markers are all in range. Nothing to fix right now.

If you've been experiencing fatigue or slow recovery and your results haven't explained them, it's worth looking at testosterone. It's a different mechanism, different test. Kit 1 checks your testosterone, SHBG, and Free Androgen Index for £29.

**Kit 1 — Testosterone Health Check:** https://andro-prime.com/kits/testosterone

If everything genuinely feels fine and you just wanted a baseline, a retest in 6 to 12 months is the right next step.

{% elsif customer.kit_type_latest == 'hormone-recovery' %}
Your results are solid. Nothing to act on right now.

A retest in 6 to 12 months will tell you whether your markers are holding. Vitamin D and B12 in particular can shift meaningfully between seasons in the UK.

When you're ready: https://andro-prime.com/kits
{% endif %}

— Keith
Andro Prime

---

## Email 4 — +30 days: Retest prompt

**Subject:** One month since your results. Quick note on timing.
**Preview:** When it makes sense to test again.

---

Hi {{ customer.first_name }},

A month since your results came back in range. A quick note on the retest question.

For most markers: 6 to 12 months is the right interval. Vitamin D and B12 can shift significantly between seasons. Testosterone declines roughly 1 to 2% per year after 35 — gradual enough to miss year to year, but meaningful over time.

Testing once gives you a number. Testing consistently gives you a trend. That's the more useful thing to have.

When you're ready: https://andro-prime.com/kits

No rush. Just worth having on your radar.

— Keith
Andro Prime

---

## Customer.io Build Notes

| # | Delay | Trigger condition |
|---|-------|------------------|
| 1 | Day 0 | `result_received` — all markers normal |
| 2 | +2 days | Time delay |
| 3 | +7 days | Time delay |
| 4 | +30 days | Time delay |

**Suppression:** Fire only when `low_testosterone = false`, `low_vitamin_d = false`, `low_b12 = false`, `elevated_crp = false`, `low_ferritin = false`, and `testosterone_value ≥ 15` (if kit_type includes testosterone).

**Stop goal:** Any supplement purchase OR any kit purchase.

**Liquid variables required:**
- `{{ customer.first_name }}`
- `{{ customer.kit_type_latest }}` — set via identifyUser() at result_received
- `{{ customer.testosterone_value }}` — numeric nmol/L
- `{{ customer.symptom_flags }}` — array, set from quiz_complete event payload; used in Email 3 branch
- `{{ event.kit_name }}` — mapped from kit_type at event emission

**New user attribute needed:** `symptom_flags` — set at quiz_complete via identifyUser(), persists to result_received sequence. Array of strings (e.g. `['fatigue', 'energy', 'recovery']`).

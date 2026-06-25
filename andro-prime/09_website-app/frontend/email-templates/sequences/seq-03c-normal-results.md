# seq-03c: Normal Results

> **Phase 0a version marker:** v1 (Phase 0a). The Email 3 Daily Stack CTA is replaced by a supplement-waitlist mechanic because supplements do not ship in Phase 0a. v2 reinstates the direct Daily Stack CTA when supplements ship in Phase 0b. See `01_strategy/2026-05-23-phase0-supplements-deferred-plan.md`.

**Platform:** Customer.io
**Trigger:** `result_received` event where no seq-03a or seq-03b/03d conditions are met.

Specifically:
- `kit_type = testosterone` AND `total_testosterone ≥ 15 nmol/L`
- OR `kit_type = energy-recovery` AND all markers in range (no `low_vitamin_d`, no `low_b12`, no `elevated_crp`, no `low_ferritin`)
- OR `kit_type = hormone-recovery` AND all markers in range AND `total_testosterone ≥ 15 nmol/L`

**Suppression:** Do not fire if seq-03a, seq-03b, or seq-03d is active for the same user.

**Goal:** Keep a healthy wellness customer on the platform via their own data, not via clinical pressure. Secondary: a maintenance supplement or a future retest, both framed as adding to their record, never as something they need. Stop on supplement or kit purchase.

**Tone:** Honest and low-pressure. Good news, not euphoric. This customer tested normal: there is no clinical question for them and we never imply one. The reason to come back is that the data is theirs and a single reading is less useful than a record over time. (V7 wellness-cohort path: no TRT, no founding-member, no clinical nudge anywhere in this sequence by design.)

---

## Email 1 - Day 0: Results in

**Subject:** Your results: everything came back in range.
**Preview:** Here's what that actually means, and where your data lives.

---

Hi {{ customer.first_name }},

Your {{ event.kit_name }} results are in. The short version: everything came back in range.

View your full results here: https://andro-prime.com/account
<!-- TRACKER: once My Story tracker page is live, update this link to /tracker -->

Your results are shown in plain English alongside the reference ranges, so you can see exactly where your numbers sit. Every marker is explained to a standard signed off by Dr Ewa Lindo, a GMC-registered GP. That dashboard is yours. We don't hand you a number and keep the record. You keep it, and every test you ever do with us lands in the same place.

{% if customer.kit_type_latest == 'testosterone' %}
Your testosterone came back comfortably within the normal range, and your SHBG, Free Androgen Index, and Albumin all look fine. Your exact numbers are in your dashboard.

One thing worth knowing: normal means you're not deficient. It doesn't tell you where your levels were 5 or 10 years ago, or which direction they're heading. That's what a second reading, 6 to 12 months from now, adds to your record.
{% elsif customer.kit_type_latest == 'energy-recovery' %}
Your Vitamin D, B12, hs-CRP, and Ferritin all came back in range. No deficiencies, no flags.

This is useful in two ways. It rules out the obvious causes. And it gives you a baseline in your own record to compare against when you test again in 6 to 12 months.
{% elsif customer.kit_type_latest == 'hormone-recovery' %}
Your testosterone, Vitamin D, B12, hs-CRP, and Ferritin all came back in range. No deficiencies, no flags across the panel.

This is a solid baseline. The most useful thing you can do with a good result is keep testing on the same record, so you have a trend rather than a single data point.
{% else %}
Your markers came back in range. No deficiencies, no flags.

This is a useful baseline. The most useful thing you can do with a good result is keep testing on the same record, so you have a trend rather than a single data point.
{% endif %}

Your numbers are fine, so there's no clinical question here and nothing for you to chase. This is just your baseline, saved and yours to keep. Any questions about what you're looking at, reply to this email.

Keith
Andro Prime

---

## Email 2 - +2 days: Normal isn't the same as optimal

**Subject:** Normal doesn't mean optimal.
**Preview:** The number you got, and why one reading is only half the picture.

---

Hi {{ customer.first_name }},

Your results came back in range. Worth taking a minute to explain what that actually means.

{% if customer.kit_type_latest == 'testosterone' %}
The NHS "normal" range for testosterone runs from roughly 8 to 29 nmol/L. That's a wide range. A man at 16 nmol/L at 28 and a man at 16 nmol/L at 48 are both "normal," but the trajectory behind those numbers is very different.

What the result tells you: you're not deficient. What it doesn't tell you: whether your levels are where they were a decade ago, and whether they're holding or declining slowly. Testosterone drops roughly 1 to 2% per year after 35. That's not dramatic year to year. But over a decade, it adds up.

The men who get the most out of testing are the ones who build a record: a baseline now, a follow-up at 6 to 12 months, both sitting in the same dashboard so you can see them side by side. If your levels hold, you know. If they've shifted, you caught it early. Either way, the record is yours.
{% else %}
Being "in range" for Vitamin D, B12, and hs-CRP doesn't mean those levels are permanent. Vitamin D deficiency is common in UK men between October and March; sunlight can't maintain adequate levels regardless of diet. B12 absorption gets less efficient with age. hs-CRP can shift with training load, sleep, and stress.

What changes this: a record, not a one-off. A second reading in 6 to 12 months, kept alongside this one, tells you whether your markers are holding or beginning to drift. That comparison is the value, and it only exists if the data stays in one place that belongs to you.
{% endif %}

Nothing urgent here. Your baseline is already saved in your dashboard. Just useful context.

Keith
Andro Prime

---

## Email 3 - +7 days: What to do from here

**Subject:** One honest recommendation given your results.
**Preview:** Not nothing, but not dramatic either.

---

Hi {{ customer.first_name }},

{% if customer.kit_type_latest == 'testosterone' %}
Your testosterone is in range. Here's the honest take on what makes sense from here.

There's nothing here that's a problem. There's also nothing for us to sell you today: our own Daily Stack formulation isn't on sale yet. We're launching it shortly, as soon as our manufacturing partner is confirmed. If you join the supplement waitlist now, you'll get a founding-customer discount when it ships, and you'll be among the first to know.

**Join the supplement waitlist:** https://andro-prime.com/supplement-waitlist

If you'd like to support your levels in the meantime, the building blocks worth knowing about: Zinc is the most well-evidenced mineral for testosterone maintenance (not raising it, keeping it where it is); Vitamin D3 and Active B12 (Methylcobalamin) both support the same energy and hormonal systems. All three are widely available over the counter in UK pharmacies and supermarkets.

Zinc contributes to the maintenance of normal testosterone levels.
Active B12 contributes to normal energy-yielding metabolism and normal psychological function.
Vitamin D contributes to normal muscle function.

{% if customer.quiz_symptom_flags contains 'fatigue' or customer.quiz_symptom_flags contains 'energy' %}
One more thing: based on what you told us when you took the quiz, you've been dealing with fatigue or energy issues. Your testosterone is fine, so that rules out one cause. But Vitamin D, B12, and inflammation are the other main drivers of exactly those symptoms, and we can't see those from this test. Kit 2 checks all four energy markers for £119, and the result lands in the same dashboard as this one.

**Kit 2: Energy & Recovery Check:** https://andro-prime.com/kits/energy-recovery
{% endif %}

If you'd rather just hold the baseline and add a second reading in 6 to 12 months, that's a completely reasonable call. There's no clinical decision waiting on you here.

{% elsif customer.kit_type_latest == 'energy-recovery' %}
Your markers are all in range. Nothing here is a problem right now.

If you've been experiencing fatigue or slow recovery and your results haven't explained them, it's worth looking at testosterone. It's a different mechanism, different test. Kit 1 checks your testosterone, SHBG, and Free Androgen Index for £99, and it lands in the same record as this result.

**Kit 1: Testosterone Health Check:** https://andro-prime.com/kits/testosterone

If everything genuinely feels fine and you just wanted a baseline, holding it and retesting in 6 to 12 months is the right next step. No pressure either way.

{% elsif customer.kit_type_latest == 'hormone-recovery' %}
Your results are solid. Nothing to act on right now.

A second reading in 6 to 12 months, kept next to this one, tells you whether your markers are holding. Vitamin D and B12 in particular can shift meaningfully between seasons in the UK.

When you're ready: https://andro-prime.com/kits
{% else %}
Your results are in range. There's nothing here that needs action and no clinical decision waiting on you.

If you'd like to add a second reading to your record in 6 to 12 months, that's the honest next step. No pressure either way: https://andro-prime.com/kits
{% endif %}

Keith
Andro Prime

---

## Email 4 - +30 days: Your record, and when to add to it

**Subject:** One month on. Your data's still there when you want it.

**Preview:** No clinical pressure. Just when a second reading is worth it.

---

Hi {{ customer.first_name }},

A month since your results came back in range. Nothing here needs a decision from you. This is just the honest note on what a healthy result is actually worth.

A single good reading tells you that you're fine today. It doesn't tell you the direction. That only shows up when there are two points on the same record: this one, and one more 6 to 12 months out. Vitamin D and B12 can shift significantly between seasons. Testosterone declines roughly 1 to 2% per year after 35, gradual enough to miss year to year, meaningful over time.

So there's no rush, and there's nothing clinical to weigh up. Your baseline is in your dashboard, it's yours, and it'll be there whenever you want to look at it or add to it.

Your dashboard: https://andro-prime.com/account
<!-- TRACKER: once My Story tracker page is live, update this link to /tracker -->

When a second reading makes sense: https://andro-prime.com/kits

No rush. Just worth knowing the data's yours and the record's open.

Keith
Andro Prime

---

## Customer.io Build Notes

| # | Delay | Trigger condition |
|---|-------|------------------|
| 1 | Day 0 | `result_received`: all markers normal |
| 2 | +2 days | Time delay |
| 3 | +7 days | Time delay |
| 4 | +30 days | Time delay |

**Suppression:** Fire only when `low_testosterone = false`, `borderline_testosterone = false`, `low_vitamin_d = false`, `low_b12 = false`, `elevated_crp = false`, `low_ferritin = false`. Do NOT use a raw `testosterone_value ≥ 15` check in CIO — use the two boolean flags to confirm testosterone is neither low nor borderline.

**Stop goal:** Any supplement purchase OR any kit purchase. **Phase 0a:** Supplement purchase events will not fire (no supplements on sale); add `supplement_waitlist_joined` as an additional stop trigger. Restore the original list in Phase 0b v2.

**Wellness-cohort guardrail (V7, ClickUp 869d99m80):** This sequence must never reference TRT, the founding-member list, clinical assessment, or any clinical next step. A customer who tests normal is a standalone wellness customer, not a clinical lead. The engagement loop is data ownership (their record, kept in their dashboard) plus an honest retest cadence. Removing clinical pressure is the point of the sequence, not an omission.

**Liquid variables required:**
- `{{ customer.first_name }}`
- `{{ customer.kit_type_latest }}` : set via identifyUser() at result_received
- `{{ customer.testosterone_value }}` : numeric nmol/L
- `{{ customer.quiz_symptom_flags }}` : array, set via identifyUser() at `quiz_complete` (canonical attribute name; the event payload key is `symptom_flags` but the persisted customer attribute is `quiz_symptom_flags`). Used in Email 3 testosterone branch. (Corrected 2026-05-19: copy previously read the non-existent `customer.symptom_flags`, so the branch never fired.)
- `{{ event.kit_name }}` : mapped from kit_type at event emission

**Tracker note:** Live copy links to `/account` (true at launch). The `<!-- TRACKER -->` annotations mark the deep-links to swap to `/tracker` once the My Story view ships (M3-M4). Copy is written so it is accurate before the tracker ships — "your record / your dashboard / a second point" is true on day one; nothing claims a live trend visualisation or any interpretation layer (tracker is observation-only).

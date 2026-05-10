# seq-03d: Borderline Testosterone (12–15 nmol/L)

**Platform:** Customer.io
**Trigger:** `result_received` event where `kit_type = testosterone` OR `kit_type = hormone-recovery` AND `total_testosterone` is between 12 and 15 nmol/L (inclusive).

This is the variant of seq-03b noted in sequences.md. The founding-member CTA is not present. The founding member list is not mentioned. The framing is honest without being alarming.

**Suppression:** Do not fire if seq-03a is active for the same order (energy deficiencies take their own path). Do not fire if seq-03b conditions are met (T < 12 nmol/L).

**Goal:** Daily Stack purchase OR Kit 1/3 retest purchase. Stop sequence on either.

**Tone:** Measured. This is a gray zone result. No drama, no false reassurance. Give them a clear picture and a practical next step.

---

## Email 1 - Day 0: Results in

**Subject:** Your results: your testosterone is at the lower end of normal.
**Preview:** What {{ customer.testosterone_value }} nmol/L actually means.

---

Hi {{ customer.first_name }},

Your {{ event.kit_name }} results are in.

View them here: https://andro-prime.com/account

Your testosterone came back at {{ customer.testosterone_value }} nmol/L. The NHS reference range runs from around 8 to 29 nmol/L, so you're within normal limits. But you're at the lower end, and that's worth understanding, not dismissing.

At this level, some men feel completely fine. Others experience exactly the things you might have been noticing: energy not quite what it was, recovery slower, drive slightly off. The number alone doesn't tell us whether that's the cause. But it's the kind of result that's worth paying attention to and tracking over time.

Dr Ewa Lindo has reviewed your results. Your full panel (testosterone, SHBG, Free Androgen Index, and Albumin) is in your dashboard.

Any questions about what you're looking at, reply to this email.

Keith
Andro Prime

---

## Email 2 - +1 day: What this range means

**Subject:** Why {{ customer.testosterone_value }} nmol/L matters - even if your GP says you're fine.
**Preview:** The difference between "not deficient" and where most men feel best.

---

Hi {{ customer.first_name }},

Your testosterone is {{ customer.testosterone_value }} nmol/L.

You're not deficient. The clinical threshold for hypogonadism (the point at which most NHS GPs would consider treatment) is around 8 to 10 nmol/L. You're above that, so if you took this result to your GP, you'd likely hear "everything is normal."

That's not wrong. But "not deficient" and "optimal" are different things.

Most research looking at how men actually feel (energy, drive, recovery, focus, body composition) finds that levels tend to correlate with wellbeing somewhere in the 15 to 25 nmol/L range. Being at 12 to 15 doesn't mean something is wrong. But it does mean the margin is tighter than it was 10 years ago.

It also means the trend matters. Testosterone declines roughly 1 to 2% per year after 35. That's not dramatic in any given year, but it means where you are now is worth tracking. A second test in 3 months tells you whether your levels are holding steady or declining, and at what pace. That's the most useful thing you can know.

More on that in a couple of days.

Keith
Andro Prime

---

## Email 3 - +3 days: What to do

**Subject:** Two practical steps given your result.
**Preview:** Nothing dramatic. Just the most sensible next moves.

---

Hi {{ customer.first_name }},

Two practical things based on your result.

**1. Support what you've got**

Zinc is the most well-evidenced mineral for testosterone maintenance. Not raising it; maintaining it. Most UK men are chronically below the recommended daily intake, particularly if training volume is high or sleep is inconsistent. Vitamin D and Active B12 both support the same energy and hormonal systems.

The Daily Stack covers all three: 30mg Zinc, 4,000 IU D3, 1,000mcg Active B12 as Methylcobalamin. There's no claim here that it will move your testosterone number significantly. What it does is support the conditions your body needs to maintain the levels it has.

Zinc contributes to the maintenance of normal testosterone levels.
Active B12 contributes to normal energy-yielding metabolism and normal psychological function.
Vitamin D contributes to normal muscle function.

**Daily Stack, £34.95/month:** https://andro-prime.com/supplements/daily-stack

Cancel any time from your account. No lock-in.

**2. Retest at 3 months**

A single result is a data point. A second result is a trend. Testing again at the 3-month mark tells you whether your levels are holding, improving, or declining, and at what rate. That's the information that actually determines what, if anything, you need to do next.

When you're ready: https://andro-prime.com/kits/testosterone

No obligation on either. These are just the clearest next steps based on what your results show.

Keith
Andro Prime

---

## Email 4 - +30 days: Trend check

**Subject:** A month on - it's worth thinking about a second test.
**Preview:** Why the 3-month window matters for tracking testosterone.

---

Hi {{ customer.first_name }},

A month since your results. Your testosterone was {{ customer.testosterone_value }} nmol/L, lower end of normal.

A quick note on timing, because it's relevant here.

Three months is the right window for a follow-up testosterone test. It's long enough that the result is meaningful (short-term fluctuations even out), and short enough that you can act on the information before too much time passes.

The men who find testosterone testing most useful aren't necessarily the ones with the lowest numbers. They're the ones who test consistently enough to know what direction they're heading, and to catch a trend before it becomes a problem.

Retest when you're ready: https://andro-prime.com/kits/testosterone

Keith
Andro Prime

---

## Customer.io Build Notes

| # | Delay | Trigger condition |
|---|-------|------------------|
| 1 | Day 0 | `result_received`: testosterone 12–15 nmol/L |
| 2 | +1 day | Time delay |
| 3 | +3 days | Time delay |
| 4 | +30 days | Time delay |

**Trigger filter:** `testosterone_value >= 12` AND `testosterone_value <= 15` AND (`kit_type_latest = 'testosterone'` OR `kit_type_latest = 'hormone-recovery'`)

**Suppression:** Do not fire if seq-03b is active (T < 12). Do not fire if seq-03a is active for same order (energy deficiencies fire their own sequence; run in parallel only if kit_type = hormone-recovery and both conditions are true; in that case, seq-03a handles energy results, seq-03d handles the borderline T arm).

**Stop goal:** Daily Stack purchase OR any kit retest purchase.

**Liquid variables required:**
- `{{ customer.first_name }}`
- `{{ customer.testosterone_value }}` : numeric nmol/L, set via identifyUser() at result_received
- `{{ customer.kit_type_latest }}`
- `{{ event.kit_name }}`

**Subject line note:** Emails 1 and 2 use `{{ customer.testosterone_value }}` in the subject. Customer.io supports attribute interpolation in subject lines. Test with a fallback value (e.g. "your testosterone result") in case the attribute is missing.

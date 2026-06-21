# Newsletter Issue 002 — "Within range" was never meant to mean "well"

**Platform:** Customer.io broadcast (not a triggered campaign)
**Audience segment:** `Newsletter Subscribers` (`newsletter_subscriber = true`)
**Source article:** `09_website-app/frontend/content/blog/myth-of-normal-range.mdx` (Ewa-approved, published 2026-06-18)
**Soft pointer:** the 2-minute quiz (`/test-selector`), one only
**Status:** DRAFT — pending compliance pre-flight + Ewa sign-off + Keith voice check + send go/no-go. (Pillar C / testosterone = higher-sensitivity; Ewa sign-off mandatory before build.)

**No-name rule:** subscribers gave email only. `{{ customer.first_name | default: 'there' }}` is mandatory.

---

**Subject:** "Within range" was never meant to mean "well"

**Preview:** What the testosterone normal range actually measures, and the one question it can't answer.

---

Hi {{ customer.first_name | default: 'there' }},

A man brought me his GP results recently. Total testosterone, 12 nmol/L. "Within normal range." His GP had told him so, and moved on.

I asked him one question.

What's the range?

8 to 29 nmol/L.

Most men assume that's a healthy band. It isn't. It's a statistical band: the spread you'd get if you took blood from every adult man between 18 and 70 and drew a line at the 2.5th and 97.5th percentile.

Athletes. Sedentary. Lean. Overweight. 22-year-olds. 68-year-olds. All in one pot.

So this one is about that range. What it was actually built to measure, why it's so wide, and the single question it can't answer about you.

**What "normal" actually means**

The range was built to answer one question: is this man clinically ill? It wasn't built to answer: is this man well?

Those are two different questions. The NHS test answers one of them. Most men who feel off are asking the other.

Here's how far apart "normal" stretches. Two men, one at 9 nmol/L, one at 25 nmol/L, both get the same word back: "within range". Clinically they are not the same man. The one at 9 is far more likely to report the fatigue, the flat libido, the recovery that won't close. Both are filed as normal.

**Why the range is so wide**

Two things stretch it, and neither is about whether UK men are healthy.

Age is the big one. Testosterone peaks in your early 20s and falls roughly 1 to 2% a year from 30. By 45 the average man is 15 to 30% below his peak. By 60, more than 40%. That whole decline is baked into one band, because the sample runs from teenagers at their peak to men in their 70s.

Body composition is the other. Fat tissue carries an enzyme, aromatase, that converts testosterone into oestrogen. More body fat, more conversion, lower testosterone. UK obesity has nearly tripled since 1980, and the range gets resampled from the population as it is now. "Normal" today is lower than "normal" was thirty years ago.

**The bit nobody mentions on the phone**

There are three bands that actually matter.

Below 8 nmol/L is the NHS referral line: that's a clinical conversation, and it belongs with a doctor.

8 to 12 is the grey zone. Most men sitting here, with the classic symptoms, get told they're fine.

Above 12, the framework calls you normal and takes no further action, even if you're in the lowest decile for your age.

And here's the number that reframes the whole thing. A 2010 European study of 3,369 men aged 40 to 79 found that three or more classic low-T symptoms became statistically likely below 11 nmol/L. Eleven. Not eight. The NHS refers a full 3 nmol/L below where the symptoms actually tend to start.

The framework isn't lying. It just isn't answering the question you're asking.

**What to do with that**

A single reading is a snapshot. It's the second one that tells you anything.

Get the full picture (Total T, SHBG, Free Androgen Index, Albumin, Free T), take it as a baseline, change one variable, sleep, training, body composition, the beers you'd rather not count, then retest in 8 to 12 weeks. Now the number is moving, and the direction is the answer in a way one reading against a wide band never is.

**Where this stops being our lane**

Plainly, because it matters more than any of the above. We don't offer TRT; that's a clinical decision for a clinician. So:

- Total T below 8 nmol/L is a same-week GP conversation, the NHS referral line.
- A result sitting persistently between 8 and 11 across two tests, with three or more classic symptoms, is one to take to your GP within a few weeks.
- Unexplained weight loss, severe mood changes, or a sudden collapse in libido alongside any reading is a GP appointment, not a wellness one.
- If you're under 30 and thinking about fertility, have a known pituitary condition, or you're already on prescription TRT, that's a GP conversation from the start.

We'd rather lose a sale than have a man read a newsletter when he should be sitting in front of his doctor.

**If you want to know where yours sits**

If reading this made you realise you've got a "normal" you don't actually trust, the 2-minute quiz points you to the right starting test based on what you're feeling. The full testosterone panel above sits in the Testosterone Health Check. No pressure, no rush: it's there when you want it.

Take the quiz: https://andro-prime.com/test-selector?utm_source=newsletter&utm_medium=email&utm_campaign=issue-002-normal-range

That's the one for this month. The next lands when it's ready.

Keith
Andro Prime

---

## Customer.io build notes

- **Type:** Broadcast to the `Newsletter Subscribers` segment. Not a triggered campaign, no delays, no stop goal.
- **Attribution:** the quiz link carries `utm_source=newsletter&utm_medium=email&utm_campaign=issue-002-normal-range` so the first-party `events` table + GA4 mirror attribute newsletter → quiz_start → purchase.
- **Liquid:** `{{ customer.first_name | default: 'there' }}` (no-name rule). One-click unsubscribe in footer via `{% unsubscribe_url %}` (TAG, not a variable).
- Stays **DRAFT** until the full sign-off gate is cleared.

## Compliance notes (checked against 03_compliance/CONTEXT.md, pending formal pre-flight + Ewa)

- All numbers, bands and referral thresholds are carried verbatim in substance from the Ewa-approved `myth-of-normal-range.mdx`. No threshold has been softened (8 nmol/L referral line, 8–11 grey-zone + 3 symptoms, Wu 2010 sub-11 finding all reproduced exactly).
- No medical-act or efficacy verbs in the body. Testosterone is framed as a measured marker, not a verdict; none of the banned efficacy verbs appear.
- **TRT framing held to Phase 0 boundary:** the body states "We don't offer TRT; that's a clinical decision for a clinician." It does not present TRT as live or on sale, and carries no "be first when we launch" framing.
- **No founding-member CTA** (content-to-FM is a CQC/ASA boundary risk; FM stays dashboard-only). The sole action is the quiz.
- No ingredient health claims; no ingredient named, so the silent-ingredient rule is respected by omission.
- Kit named in context only (the full panel sits in the Testosterone Health Check); no kit buy-now button, one soft pointer (quiz).
- GP-referral guardrails reproduced in full ("Where this stops being our lane").
- Sources already verified in the source article (North Bristol NHS, Hackett et al. 2023 BSSM, NHS Digital obesity trend, Wu et al. 2010 NEJM EMAS); none added.
- **Pillar C / testosterone is higher-sensitivity than Issue-001 (CRP).** Ewa sign-off on the testosterone framing + thresholds is mandatory before this is built as a CIO broadcast.

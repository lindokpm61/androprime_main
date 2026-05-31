# Newsletter Issue 001 — CRP: the number that lies on its own

**Platform:** Customer.io broadcast (not a triggered campaign)
**Audience segment:** `Newsletter Subscribers` (`newsletter_subscriber = true`)
**Source article:** `09_website-app/frontend/content/blog/crp-blood-test.mdx` (Ewa-approved, blanket sign-off 2026-05-27)
**Soft pointer:** the 2-minute quiz (`/test-selector`), one only
**Status:** APPROVED — CA-012 (2026-05-31, Keith + Ewa). Pre-flight clean (0 HARD / 0 REVIEW). Build as a Customer.io DRAFT broadcast; the send itself is a separate human go/no-go.

**No-name rule:** subscribers gave email only. `{{ customer.first_name | default: 'there' }}` is mandatory.

---

**Subject:** A "bit raised, nothing to worry about" is not an answer.

**Preview:** What a CRP number actually tells you, and the one thing it can't.

---

Hi {{ customer.first_name | default: 'there' }},

Here is a sentence thousands of men hear every year, usually over the phone, usually in about four seconds:

"Your CRP's a bit raised, nothing to worry about, we'll retest in a few months."

Then they go home and Google it. Eight minutes later they are convinced they are seriously ill.

So this one is about CRP. What the number is, what counts as high in the UK, and the single most important thing it will not tell you on its own.

**What CRP actually is**

C-reactive protein is something your liver releases when your immune system is responding to something: an infection, an injury, a hard week, low-grade irritation that has been sitting there quietly. It does not tell you what is causing the response. It tells you the response is happening, and roughly how much.

That last part matters, because the most common reason a healthy man gets a "surprise high CRP" is dull and reassuring: he had a cold a fortnight ago. Or a hard training session in the last 48 hours. Or dental work last week. Or a fresh vaccination. Any of those will push the number up temporarily without changing anything about his actual baseline.

**What counts as high, in UK terms**

Most articles on this use American ranges with no UK context. Here are the numbers that apply here.

On a standard NHS CRP test, under 5 mg/L is reported as normal. That cutoff was built to flag the loud stuff: active infection, a flare, post-surgical recovery.

Private labs usually run the high-sensitivity version, hs-CRP, which reads the quieter range. The bands there:

- Under 1.0 mg/L: low. Where you want to sit.
- 1.0 to 3.0 mg/L: average. Common, not a crisis, not a clean read either.
- Over 3.0 mg/L: elevated. Worth understanding why, worth a retest in 4 to 8 weeks.
- Over 10 mg/L on a non-acute baseline: your GP that week, not a wellness conversation.

**The one thing it will not tell you**

A single CRP reading is a snapshot. It does not diagnose anything, it does not predict much on its own, and "high CRP equals cancer" is simply not how the marker works. Most raised readings in otherwise well men come down to recent infection or one of a handful of lifestyle drivers.

The honest version of this test is not the first number. It is the second one.

Take a baseline. Change one thing: the training that has outrun your recovery, the six hours of sleep that should be seven, the fortnight of more beers than you would like to admit. Wait 4 to 8 weeks. Retest. Now the number is moving, and the direction is the answer.

A single reading is a snapshot. A retest is a sentence. A year of readings is a paragraph. The story is always in the movement, never the snapshot.

**Where this stops being our lane**

Plainly, because it matters more than any of the above:

- CRP over 10 mg/L on a non-acute baseline is a same-week GP conversation.
- hs-CRP persistently above 3 mg/L across two retests 8 weeks apart, with no obvious lifestyle cause, is a GP referral.
- Any reading alongside unexplained weight loss, night sweats, or a persistent fever is a GP appointment, urgently, whatever the number says.
- If you are under 18, pregnant, or living with a chronic condition, this is a GP conversation from the start, not a wellness one.

We would rather lose a sale than have a man read a newsletter when he should be sitting in front of his doctor.

**If you want to know where yours sits**

If reading this made you realise you have a number with no context, or no number at all, the 2-minute quiz points you to the right starting test based on what you are actually feeling. hs-CRP sits in the Energy and Recovery panel, alongside ferritin, vitamin D and B12. No pressure, no rush: it is there when you want it.

Take the quiz: https://andro-prime.com/test-selector?utm_source=newsletter&utm_medium=email&utm_campaign=issue-001-crp

That is the one for this month. The next lands when it is ready.

Keith
Andro Prime

---

## Customer.io build notes

- **Type:** Broadcast to the `Newsletter Subscribers` segment. Not a triggered campaign, no delays, no stop goal.
- **Attribution:** the quiz link carries `utm_source=newsletter&utm_medium=email&utm_campaign=issue-001-crp` so the first-party `events` table + GA4 mirror attribute newsletter → quiz_start → purchase.
- **Liquid:** `{{ customer.first_name | default: 'there' }}` (no-name rule). One-click unsubscribe in footer.
- Stays **DRAFT** until the sign-off gate below is cleared.

## Compliance notes (checked against 03_compliance/CONTEXT.md, pending formal pre-flight)

- All CRP numbers, bands, confounders and referral thresholds are carried verbatim in substance from the Ewa-approved `crp-blood-test.mdx`. No threshold has been softened.
- No medical-act or efficacy verbs in the body. CRP is framed as a descriptive marker, not a verdict (the one negation, "it does not diagnose anything", is a compliant disclaimer).
- No ingredient health claims. No ingredient is named at all, so the silent-ingredient rule is respected by omission.
- Kit named in context only (hs-CRP sits in the Energy and Recovery panel); the sole action is the quiz. No kit buy-now CTA, no founding-member CTA, no clinical-service or prescribing reference. Phase 0 boundary held.
- GP-referral guardrails reproduced in full ("Where this stops being our lane").
- Sources already verified in the source article (NHS, BHF, Pearson 2003, Cerqueira 2020, Irwin 2016); none added.
- **Sign-off complete (CA-012, 2026-05-31):** pre-flight clean, Ewa + Keith approved. Only the send go/no-go remains (and a meaningful subscriber list — guest capture was fixed today).

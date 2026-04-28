# seq-03a — Energy & Recovery Results Sequence

**Platform:** Customer.io
**Trigger:** `result_received` where `kit_type = energy-recovery` OR `kit_type = hormone-recovery` AND at least one marker is below optimal (low Vit D, low B12, elevated hs-CRP, or low Ferritin).
Set user attributes via `identifyUser()` at result processing: `low_vitamin_d`, `low_b12`, `elevated_crp`, `crp_level` (numeric), `joint_symptoms_confirmed`, `low_ferritin` before firing this sequence.

**Goal:** Supplement subscription. Secondary: Kit 1 cross-sell at Day 30.
**Tone:** Specific, data-led, plain English. Each email should feel like it's talking about their result, not a generic result. Use Liquid throughout.

**Compliance notes:**
- All supplement claims must use EFSA-approved language only (see CLAUDE.md).
- Do not say "reduces inflammation" or "heals joints" — medicinal claims.
- Do not say B12 improves mood or treats brain fog — use EFSA claims only.
- Do not trigger founding member deposit CTA from Kit 2 result alone. Only Kit 1 or Kit 3 confirmed low-T result may trigger that CTA. It does not appear in this sequence.
- Ferritin < 30 µg/L: GP referral only. No supplement CTA.
- hs-CRP > 10 mg/L: GP referral only. No supplement CTA.

---

## Email 1 — Day 0: Results in

**Subject:** Your results: here's what we found.
**Preview:** The markers that came back flagged — and what each one means.

---

Hi {{ customer.first_name }},

Your {{ event.kit_name }} results are in. Dr Ewa Lindo has reviewed them.

View your full results here: https://andro-prime.com/account

Your results are shown in plain English alongside the reference ranges, with Dr Ewa's notes on each marker. Here's the short version of what came back flagged:

{% if customer.low_vitamin_d %}
**Vitamin D:** Below optimal. This is common in the UK, particularly from October to March, and it directly affects energy and muscle function.
{% endif %}
{% if customer.low_b12 %}
**Vitamin B12:** Below optimal. B12 plays a direct role in energy metabolism and how well your brain functions day to day.
{% endif %}
{% if customer.elevated_crp and customer.crp_level <= 10 %}
**hs-CRP (inflammation marker):** Elevated. In active men this often reflects training-related stress on joints and connective tissue.
{% endif %}
{% if customer.elevated_crp and customer.crp_level > 10 %}
**hs-CRP (inflammation marker):** Significantly elevated. At this level, we'd recommend speaking to your GP before making any supplement changes. Full detail in your dashboard.
{% endif %}
{% if customer.low_ferritin %}
**Ferritin (iron stores):** Below optimal. Iron needs careful dosing — we don't sell iron supplements, and we wouldn't recommend self-supplementing here without GP input. More on that tomorrow.
{% endif %}

This is what your blood is telling you. The detail — what each number means specifically for you — is in your dashboard.

Any questions about what you're looking at, reply to this email.

— Keith
Andro Prime

---

_Results are for informational purposes only and do not constitute a diagnosis or medical advice._

---

## Email 2 — +1 day: What your specific result means

**Subject:** What your result actually means for your body.
**Preview:** The science behind the markers that came back flagged — in plain English.

---

Hi {{ customer.first_name }},

A bit more detail on what your flagged markers actually mean — and why they matter.

{% if customer.low_vitamin_d %}
**Low Vitamin D**

Vitamin D isn't just a vitamin — it functions more like a hormone. Almost every cell in your body has Vitamin D receptors, including the ones in your muscle tissue. When levels are below optimal, the cascade effects include impaired muscle function, reduced energy production, and (in active men) slower recovery from training. UK men are chronically low, particularly between October and March, because we don't get enough sunlight to maintain adequate levels regardless of diet. Supplementation is the only reliable fix.

{% endif %}
{% if customer.low_b12 %}
**Low B12**

B12 is essential for producing red blood cells and for the neurological processes that govern focus, mood, and mental clarity. When it's low, the most common effects are fatigue that sleep doesn't fix, difficulty concentrating, and a kind of mental flatness that's hard to put into words. B12 absorption gets less efficient as you get older, which is why men in their 40s and 50s are disproportionately affected even if their diet is good. The active form — Methylcobalamin — is absorbed significantly better than the cheaper synthetic form used in most supplements.

{% endif %}
{% if customer.elevated_crp and customer.crp_level <= 10 %}
**Elevated hs-CRP**

hs-CRP is a marker of inflammation in the body. In active men, a mildly elevated reading often reflects the cumulative load on joints and connective tissue — the soreness that takes three days to clear when it used to take one. It can also be driven by sleep debt, chronic stress, or dietary factors. An elevated reading isn't inherently alarming; it's telling you that your body is under more repair demand than it can currently handle efficiently.

{% endif %}
{% if customer.elevated_crp and customer.crp_level > 10 %}
**Significantly elevated hs-CRP**

Your hs-CRP is above 10 mg/L. At this level, the inflammation marker warrants a conversation with your GP — not because it's necessarily serious, but because at that reading it's outside the range we'd attribute to training or lifestyle alone, and a GP can investigate the cause properly. We'd recommend booking an appointment before making any supplement changes. Reply to this email if you'd like more context on what to say to your GP.

{% endif %}
{% if customer.low_ferritin %}
**Low Ferritin (iron stores)**

Ferritin is the marker of your body's iron stores, separate from the iron currently in your bloodstream. Low ferritin causes fatigue, reduced exercise capacity, and poor recovery — symptoms almost identical to other deficiencies, which is why it often goes unidentified. Here's the important part: iron supplementation carries a real risk of overdose, and the correct dose depends on how low your levels are and the cause of the depletion. We don't sell iron supplements for this reason. What we'd recommend instead is taking this result to your GP, who can prescribe the right dose and investigate the underlying cause. We've put together a template letter you can use at your GP appointment — it's in your dashboard alongside your result.

{% endif %}

More on what to do about this tomorrow.

— Keith
Andro Prime

---

## Email 3 — +3 days: Recommendation

**Subject:** Based on your results, here's exactly what we recommend.
**Preview:** Specific to your markers — not a generic supplement pitch.

---

Hi {{ customer.first_name }},

Based on your results, here's what we'd specifically recommend.

{% if customer.low_ferritin and customer.crp_level > 10 %}
Your results include markers that need GP attention before any supplement change. See your dashboard for the GP letter template on your Ferritin result. For hs-CRP above 10 mg/L, booking a GP appointment is the right next step. There's nothing for us to sell you here — your results are pointing you toward a clinical conversation, and we want to be straight about that.

{% elsif customer.low_ferritin %}
Your Ferritin result warrants a GP conversation rather than a supplement recommendation — iron needs to be dosed correctly based on your specific levels. The GP letter template is in your dashboard. For your other flagged markers:

{% endif %}

{% assign flagged_count = 0 %}
{% if customer.low_vitamin_d %}{% assign flagged_count = flagged_count | plus: 1 %}{% endif %}
{% if customer.low_b12 %}{% assign flagged_count = flagged_count | plus: 1 %}{% endif %}
{% if customer.elevated_crp and customer.crp_level <= 10 and customer.joint_symptoms_confirmed %}{% assign flagged_count = flagged_count | plus: 1 %}{% endif %}

{% if flagged_count >= 2 %}
**Complete Men's Stack — £54.95/month**

Your results flagged more than one marker. Rather than addressing each deficiency with a separate supplement, the Complete Men's Stack covers everything your results indicate — Daily Stack plus Joint & Recovery Collagen — at £54.95/month instead of £64.90 if purchased separately.

{% if customer.low_vitamin_d %}
Vitamin D3 (4,000 IU) — contributes to normal muscle function.
{% endif %}
{% if customer.low_b12 %}
B12 Methylcobalamin (1,000mcg) — contributes to normal energy-yielding metabolism and normal psychological function.
{% endif %}
Zinc (30mg) — contributes to the maintenance of normal testosterone levels.
{% if customer.elevated_crp and customer.crp_level <= 10 and customer.joint_symptoms_confirmed %}
Hydrolysed Collagen Peptides (10g) with Vitamin C — contributes to normal collagen formation for the normal function of cartilage.
{% endif %}

**Complete Men's Stack — £54.95/month:** https://andro-prime.com/supplements/complete-mens-stack

{% elsif customer.elevated_crp and customer.crp_level <= 10 and customer.joint_symptoms_confirmed and customer.low_vitamin_d == false and customer.low_b12 == false %}
**Joint & Recovery Collagen — £29.95/month**

Your inflammation marker is elevated and you've confirmed joint soreness or stiffness. In active men, this pattern typically reflects connective tissue under more repair demand than the body can handle efficiently. Joint & Recovery Collagen provides 10g of hydrolysed collagen peptides plus Vitamin C, which contributes to normal collagen formation for the normal function of cartilage.

Do not take collagen as an anti-inflammatory supplement — that's not what this is. It supports the structural integrity of connective tissue. The distinction matters.

**Joint & Recovery Collagen — £29.95/month:** https://andro-prime.com/supplements/collagen

{% elsif customer.elevated_crp and customer.crp_level <= 10 and customer.joint_symptoms_confirmed == false %}
**On your hs-CRP result:**

Your inflammation marker is elevated but you haven't reported joint symptoms. At this level, elevated CRP is often driven by training load, sleep, or diet rather than joint stress specifically. The most evidence-backed interventions here are non-supplement: consistent sleep (7+ hours), reduced training volume for 2–3 weeks, and limiting ultra-processed foods. A retest in 6–8 weeks will tell you whether those changes moved the needle.

If you develop joint symptoms in the meantime, the Collagen recommendation above becomes relevant.

{% elsif customer.low_vitamin_d and customer.low_b12 == false %}
**Daily Stack — £34.95/month**

Your Vitamin D is below optimal. The Daily Stack contains 4,000 IU of D3 — the dose most research suggests for correction — alongside Zinc and Active B12. Vitamin D3 contributes to normal muscle function.

Most men see their Vitamin D levels improve within 8 to 12 weeks of consistent supplementation. Your 3-month retest will show you exactly how much yours has moved.

**Daily Stack — £34.95/month:** https://andro-prime.com/supplements/daily-stack

{% elsif customer.low_b12 and customer.low_vitamin_d == false %}
**Daily Stack — £34.95/month**

Your B12 is below optimal. The Daily Stack contains 1,000mcg of B12 as Methylcobalamin — the active form your body absorbs most efficiently, not the cheaper synthetic form found in most supplements. B12 contributes to normal energy-yielding metabolism and normal psychological function.

**Daily Stack — £34.95/month:** https://andro-prime.com/supplements/daily-stack

{% elsif customer.low_vitamin_d and customer.low_b12 %}
**Daily Stack — £34.95/month**

Both your Vitamin D and B12 came back below optimal. The Daily Stack contains 4,000 IU of D3 and 1,000mcg of Active B12 as Methylcobalamin — both at doses designed to correct a deficiency, not just maintain. It also includes Zinc, which supports testosterone maintenance.

Vitamin D contributes to normal muscle function. B12 contributes to normal energy-yielding metabolism and normal psychological function.

**Daily Stack — £34.95/month:** https://andro-prime.com/supplements/daily-stack
{% endif %}

Cancel any time from your account. No lock-in.

— Keith
Andro Prime

---

## Email 4 — +7 days: Check-in

**Subject:** A quick question about your results.
**Preview:** Have you started? And is there anything we can help with?

---

Hi {{ customer.first_name }},

Quick one.

It's been a week since your results came in. I wanted to check whether you've started on the supplement recommendation, and whether there's anything that's been unclear about your results or the next step.

If you've started — good. The honest timeline: most markers take 8 to 12 weeks to move meaningfully. The first few weeks are the foundation, not the result. Consistency matters more than anything else here.

If you haven't started yet, that's fine. Sometimes the result takes a bit of time to sit with. If there's something specific you're unsure about — whether the recommendation is right, whether it's worth it, anything — reply to this email. I'll give you a straight answer.

If you had a GP referral in your results (Ferritin or elevated hs-CRP above 10): how did that go? We genuinely want to know. Reply if you want to share.

— Keith
Andro Prime

---

## Email 5 — +14 days: What to expect at Week 6

**Subject:** What most men notice around the 6-week mark.
**Preview:** The markers you can feel vs the ones you can only measure.

---

Hi {{ customer.first_name }},

If you've been consistent with the supplement recommendation, you're roughly at the halfway point to when the first measurable changes typically show up.

A few things worth knowing about what to expect between now and your retest.

**What you might notice first:**

{% if customer.low_b12 %}
B12 tends to produce the most noticeable early changes — the mental flatness and energy dips that don't respond to sleep. Most men who were below optimal on B12 report a difference in focus and mental clarity within 3 to 5 weeks of consistent supplementation.
{% endif %}
{% if customer.low_vitamin_d %}
Vitamin D takes longer to move at the cellular level, but muscle recovery and general energy typically improve within 4 to 6 weeks of consistent dosing at 4,000 IU.
{% endif %}
{% if customer.elevated_crp and customer.crp_level <= 10 and customer.joint_symptoms_confirmed %}
Collagen has a longer build cycle — the connective tissue remodelling that reduces joint soreness takes 8 to 12 weeks. Week 6 is often when men first notice the soreness duration beginning to shorten.
{% endif %}

**What you can only measure:**

The blood marker itself — your Vitamin D level, your B12, your CRP — won't be visible until you retest. That's why the retest matters. Without it, you're going by feel alone. With it, you can see exactly how much your levels have moved.

We'll prompt you on the right retest timing. You don't need to think about it now.

— Keith
Andro Prime

---

## Email 6 — +30 days: Kit 1 cross-sell

**Subject:** Ready to complete the picture?
**Preview:** There's one thing your test didn't check — and it may explain the rest.

---

Hi {{ customer.first_name }},

A month since your results. If you've been consistent with the recommendations, you're on the right track for your 3-month retest.

One thing worth knowing, if you haven't already acted on it.

{% if customer.kit_type_latest == 'energy-recovery' %}
Your Energy & Recovery Check tested Vitamin D, B12, hs-CRP, and Ferritin. It didn't test testosterone. Testosterone directly affects recovery speed, muscle response to training, energy, and drive — and it's a completely separate mechanism from the markers you've already checked.

If you're over 40, or if your energy and recovery haven't fully improved even with the supplement recommendation, checking your testosterone is the logical next step.

Kit 1 checks your total testosterone, SHBG, Free Androgen Index, and Albumin for £29. At-home finger-prick. 48-hour turnaround.

**Kit 1 — Testosterone Health Check — £29:** https://andro-prime.com/kits/testosterone

{% elsif customer.kit_type_latest == 'hormone-recovery' %}
You've already tested both your energy markers and your testosterone. You've got the full picture.

The next step, when you're ready, is a retest to see how your levels have moved since starting the supplement. We'll be in touch at the right point to prompt that.
{% endif %}

— Keith
Andro Prime

---

## Customer.io Build Notes

| # | Delay | Subject |
|---|-------|---------|
| 1 | Day 0 | Your results: here's what we found. |
| 2 | +1 day | What your result actually means for your body. |
| 3 | +3 days | Based on your results, here's exactly what we recommend. |
| 4 | +7 days | A quick question about your results. |
| 5 | +14 days | What most men notice around the 6-week mark. |
| 6 | +30 days | Ready to complete the picture? |

**Stop goal:** Any supplement purchase (Daily Stack, Collagen, or Complete Men's Stack). Stop sequence at Email 3 on purchase. Emails 4–6 continue even after purchase — they support retention, not conversion.

**Trigger filter:** `kit_type_latest = 'energy-recovery'` OR `kit_type_latest = 'hormone-recovery'` AND at least one of: `low_vitamin_d = true`, `low_b12 = true`, `elevated_crp = true`, `low_ferritin = true`.

**Email 6 suppression:** Suppress Kit 1 cross-sell (Email 6) if `kit_type_latest = 'hormone-recovery'` (they've already tested testosterone). Only send Kit 1 cross-sell to `kit_type_latest = 'energy-recovery'` buyers.

**Parallel sequence handling:** If `kit_type_latest = 'hormone-recovery'` AND `testosterone_value < 12`, seq-03b also fires. Ensure Email 3 of seq-03a does not conflict with seq-03b Email 3 — they address different result categories. The founding member CTA lives only in seq-03b and must not appear in seq-03a.

**User attributes required (set before sequence fires):**
- `low_vitamin_d` — bool
- `low_b12` — bool
- `elevated_crp` — bool
- `crp_level` — numeric mg/L (needed for hs-CRP > 10 branching)
- `joint_symptoms_confirmed` — bool (set from qualifier response on dashboard)
- `low_ferritin` — bool
- `kit_type_latest` — string

**Note on `crp_level`:** This attribute is not in the original `identifyUser()` list in sequences.md. Add it to the result processing logic in `lib/results/classifier.ts` and the `identifyUser()` call at result_received.

**Liquid logic note:** Email 3 uses Liquid to count flagged supplement-relevant markers and branch accordingly. The count excludes Ferritin and hs-CRP > 10 from the supplement recommendation count since those go to GP referral. Test all branches before activating.

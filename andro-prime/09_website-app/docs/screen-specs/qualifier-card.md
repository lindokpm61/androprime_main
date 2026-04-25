# Screen Specs — Qualifier Card (hs-CRP Gate)

**Version:** 1.0
**Date:** 2026-04-24
**Status:** Active
**Used in:** `/app/dashboard` post-results state, inside the hs-CRP biomarker result card

---

## Purpose

When hs-CRP is elevated (> 1 mg/L), the recommendation cannot be determined without knowing whether the customer has joint symptoms. This card replaces Parts 4 and 5 of the hs-CRP result card, presenting a single question that unlocks the correct recommendation.

This is a UX decision point — not a clinical assessment. It must feel simple and conversational.

---

## Trigger

hs-CRP result > 1 mg/L. The qualifier card appears inline within the hs-CRP biomarker card, immediately after Part 3 (Educate), separated by `border-t-2 border-black`.

---

## Layout

`border-t-2 border-black mt-8 pt-8`

**Eyebrow:**
```
ONE QUESTION
```

**Question (Inter font-black ~1.25rem):**
```
Do you experience joint stiffness or soreness after training?
```

**Subtext (Merriweather text-sm text-gray-600):**
```
Your answer helps us show you the most relevant recommendation for your result.
```

**Answer options:**

Two buttons side by side (or stacked on mobile). Not standard CTA buttons — these are selection buttons.

```
[ YES ]     [ NO ]
```

Style: `border-2 border-black rounded-none px-10 py-4 font-sans font-black uppercase tracking-widest text-sm bg-white text-black`.

Selected state: `bg-black text-white border-2 border-black`. Selection is immediate on tap — no submit step.

On selection, Parts 4 and 5 animate in below (or load in without animation — consistent with brand's no-animation direction). The question and buttons remain visible above, with the selected answer shown in the selected state.

---

## Post-Answer States

### Yes — joint symptoms reported

Parts 4 and 5 load below the qualifier.

**Part 4 — Recommend:**

For hs-CRP 1–3 mg/L with joint symptoms:
```
Your inflammation marker is elevated. In active men, this often reflects joint and connective tissue stress — the soreness that takes longer to go away than it used to. Joint & Recovery Collagen provides 10g of hydrolysed collagen peptides plus Vitamin C, which contributes to normal collagen formation for the normal function of cartilage.
```

For hs-CRP > 3 mg/L with joint symptoms, same copy plus:
```
Your level is moderately elevated. If joint soreness persists after supplementing and adjusting training load, it's worth reviewing with your GP.
```

**Part 5 — Convert:**
Primary button: `BUY JOINT & RECOVERY COLLAGEN — £24.95/MO  →`
Compliance note: "Supplements support general health. They do not treat or diagnose any medical condition."

---

### No — no joint symptoms

Parts 4 and 5 load below the qualifier.

**Part 4 — Recommend:**

For hs-CRP 1–3 mg/L, no joint symptoms:
```
Your inflammation marker is mildly elevated. Without joint symptoms, this is most commonly driven by training recovery, sleep quality, or diet rather than connective tissue stress. No supplement is needed right now — the most effective steps are below.
```

Lifestyle guidance list (Merriweather text-sm, `border-l-4 border-black pl-4`):
- "Prioritise 7–9 hours of sleep — the single most impactful recovery lever"
- "Reduce ultra-processed food intake, which directly raises systemic inflammation"
- "Allow 48–72 hours between high-intensity sessions targeting the same muscle groups"

For hs-CRP > 3 mg/L, no joint symptoms, same guidance plus:
```
At this level, if your CRP stays elevated on your next test, speak to your GP. It's worth ruling out other causes.
```

**Part 5:** No CTA shown. Part 5 container is hidden.

---

### hs-CRP > 10 mg/L (either answer)

The qualifier question is still shown for completeness, but regardless of the answer, the output is:

**Part 4:**
```
This level of inflammation warrants a conversation with your doctor before taking any supplement. We'd recommend booking a GP appointment to discuss this result.
```

**Part 5:**
Primary button: `SPEAK TO YOUR GP  →`
Links to NHS GP finder (external link, opens in new tab).

No supplement CTA shown. No collagen CTA shown.

---

## Answer Persistence

The customer's answer is saved to Supabase immediately on selection. If they return to the dashboard later, the qualifier shows their previous answer in the selected state and the correct Parts 4–5 are displayed. They can change their answer by tapping the other option — the recommendation updates immediately and the new answer is saved.

---

## Mobile

- YES / NO buttons: full width, stacked vertically
- Qualifier question: `text-xl` (slightly reduced from desktop)
- All other layout unchanged

---

## Component Reference

| Component | Token / class |
|---|---|
| Qualifier container | `border-t-2 border-black mt-8 pt-8` |
| Question text | Inter font-black text-xl leading-tight |
| Answer button (unselected) | `border-2 border-black rounded-none px-10 py-4 font-sans font-black uppercase tracking-widest text-sm bg-white text-black` |
| Answer button (selected) | `border-2 border-black rounded-none px-10 py-4 font-sans font-black uppercase tracking-widest text-sm bg-black text-white` |
| Lifestyle guidance block | `border-l-4 border-black pl-4 font-serif text-sm text-gray-600 space-y-2` |

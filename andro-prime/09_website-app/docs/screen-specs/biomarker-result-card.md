# Screen Specs — Biomarker Result Card

**Version:** 1.0
**Date:** 2026-04-24
**Status:** Active
**Used in:** `/app/dashboard` post-results state

---

## Purpose

The core unit of the results dashboard. One card per biomarker. Follows the 5-part structure: Result → Explain → Educate → Recommend → Convert. Each card is self-contained — the customer can read it independently without context from other cards.

---

## Card Structure

Full-width column. `border-t-4 border-black`. Padding `py-12 px-6` (matches dashboard section padding). No card border — the top divider line is the structural separator.

---

### Part 1 — Result

**Biomarker label row:**

Left: Biomarker name in JetBrains Mono uppercase tracking-[0.15em] text-xs.
Example: `TOTAL TESTOSTERONE`

Right: Flag indicator (only shown if `flag` field is `H` or `L`):
- Low: `L` in a `border-2 border-black rounded-none px-2 py-0.5` tag. Inter font-black text-xs uppercase. No colour — black border on white.
- High: `H` same treatment.
- Normal: no flag shown.

**Result number:**
Large. Inter font-black. `text-[4rem] leading-none tracking-tighter`. Black.
Example: `14.2`

**Unit + reference range** on the same line below the number, in JetBrains Mono uppercase text-xs text-gray-400:
```
NMOL/L   ·   REFERENCE: 10–35
```

**Range indicator:**

Horizontal bar. Full width. Height: 8px. `rounded-none`. `bg-gray-200` track.

The bar is divided into three zones using CSS gradients or pseudo-elements:
- Low zone (left): width proportional to the reference range
- Optimal zone (centre): green fill `#059669`
- High zone (right): amber fill `#D97706`

A square marker (8×8px, `bg-black`) is positioned along the bar at the exact position corresponding to the customer's result value. The marker sits above the track, centred on the result position.

Below the bar, three small JetBrains Mono labels at left, centre, and right:
```
LOW          OPTIMAL          HIGH
```
`text-[10px] uppercase tracking-[0.15em] text-gray-400`

This visual gives an instant read — the customer sees where their number sits before reading any copy.

---

### Part 2 — Explain

`border-t-2 border-black mt-8 pt-8`

**Eyebrow:**
```
WHAT THIS MEANS
```

**Body (Merriweather text-base leading-relaxed):**
Personalised to their specific number and position in range. 2–3 sentences. Examples:

- T in range, lower half: "Your testosterone is within the normal range, sitting in the lower half. This is common for men in their late thirties and forties — it's not deficient, but it's not in the upper zone either."
- T below range: "Your testosterone is below the level considered optimal for adult men. This range is associated with the symptoms many men describe — persistent fatigue, reduced drive, and difficulty maintaining muscle — though other factors can also play a role."
- Low Vitamin D: "Your Vitamin D is lower than the level most research considers adequate for energy and muscle function. In the UK, this is very common between October and March — limited sunlight means most men can't maintain healthy levels through exposure alone."

Language rules:
- Use "Your results indicate..." not "You have..."
- Do not imply diagnosis
- Do not compare to clinical thresholds in clinical language

---

### Part 3 — Educate

`border-t-2 border-black mt-8 pt-8`

**Eyebrow:**
```
THE EVIDENCE
```

**Body (Merriweather text-base leading-relaxed):**
Brief, honest, evidence-based. What does this biomarker do? Why does it matter for a man? No product mention. 3–5 sentences maximum.

Example — Testosterone:
"Testosterone affects energy levels, mood stability, sleep quality, body composition, and libido. Levels decline naturally from the mid-thirties onwards — roughly 1–2% per year. The 'normal' reference range spans 10–35 nmol/L, which is a four-fold difference. Where you sit in that range affects how you feel day to day, not just whether you're technically deficient."

Example — Vitamin D:
"Vitamin D functions more like a hormone than a vitamin — it regulates hundreds of processes including muscle function, immune response, and mood. Deficiency is associated with fatigue, muscle weakness, and low mood. Most adults in the UK are below optimal levels for at least half the year."

---

### Part 4 — Recommend

`border-t-2 border-black mt-8 pt-8`

**Eyebrow:**
```
WHAT WE RECOMMEND
```

**Content:** Conditional based on result state. See flow-4-results-to-action.md Part C for full logic.

The recommendation is presented as a data-led conclusion, not a sales pitch.

Example — T 12–20 nmol/L, Daily Stack:
"Your testosterone is in range. Zinc is the single most well-evidenced mineral for maintaining it — and most UK men don't get enough from diet alone. The Daily Stack contains 30mg alongside Magnesium and Vitamin D3 to support the wider systems that keep your levels where they are."

Example — T < 12 nmol/L, founding member:
"Your testosterone is below the level where lifestyle changes alone are likely to move the needle significantly. The most effective treatment for this is TRT — which requires clinical assessment and a prescription. We're building that service now."

Example — Ferritin < 30, GP referral:
"Your iron stores are lower than they should be. We don't sell iron supplements — iron overdose is a real clinical risk and it needs to be dosed based on your specific numbers by a GP. Here's what your result means and what to tell your doctor."

Example — hs-CRP elevated: qualifier gate fires here before recommendation is shown (see qualifier-card.md).

**No recommendation states (no product CTA shown):**
- T > 20 nmol/L
- Normal hs-CRP
- Normal Ferritin
- Normal markers with no cross-sell conditions met

For these, Part 4 still appears but shows an informational conclusion rather than a product recommendation:
"Your [biomarker] is within the optimal range. No action needed — retesting in 3–6 months will confirm it's staying there."

---

### Part 5 — Convert

`mt-6`

Only shown when there is an actionable recommendation. Not shown for normal results or GP-referral-only results.

**Layout:** Stacked or inline actions depending on whether there is a primary + secondary CTA.

**Primary CTA (left or top):**
Standard primary button: `bg-black text-white border-2 border-black rounded-none px-8 py-4 font-sans font-black uppercase tracking-widest text-sm`.

Examples:
- `BUY DAILY STACK — £34.95/MO  →`
- `SECURE YOUR PLACE  →` (founding member)
- `GET KIT 2 — £119  →` (cross-sell)
- `SPEAK TO YOUR GP  →` (GP referral — links to NHS GP finder or letter template download)

**Secondary CTA (right or below, only when applicable):**
Secondary button: `bg-white text-black border-2 border-black rounded-none px-8 py-4`.

Examples:
- `DAILY STACK — £34.95/MO  →` (shown as secondary below founding member primary)
- `LEARN MORE` (opens product page in a new tab)

**Compliance note (shown below CTAs where applicable):**
Merriweather text-sm text-gray-500 italic. Only shown for supplement CTAs.
```
Supplements support general health. They do not treat or diagnose any medical condition.
```

**Founding member secondary copy:**
Shown below the founding member primary CTA as a separate subsection, not inside the CTA row:

Heading (Inter font-black text-base uppercase): `WHILE YOU WAIT — SUPPORT THE BASICS`

Body (Merriweather text-sm text-gray-600):
"These won't replace TRT — and we'll be straight about that. But Zinc, Magnesium, Vitamin D, and B12 are the four building blocks your body needs to function as well as it can. Most men with low testosterone are also below optimal on at least two of these."

Secondary button: `DAILY STACK — £34.95/MO  →`

---

## hs-CRP Qualifier Gate

When hs-CRP is elevated, Parts 4 and 5 are replaced by the qualifier card before the recommendation unlocks. See [qualifier-card.md](./qualifier-card.md).

---

## Card States

| State | Behaviour |
|---|---|
| Normal result, no action | Parts 1–3 shown. Part 4 shows informational conclusion. Part 5 hidden. |
| Actionable result | All 5 parts shown. |
| GP referral only | Parts 1–4 shown. Part 5 shows GP CTA only, no supplement button. |
| hs-CRP elevated | Parts 1–3 shown, qualifier gate shown in place of 4–5 until answered. |
| `warning` field populated | Vitall has flagged a critical result. Copy is reviewed by Andro Prime team before display. Standard card shown with additional clinical note if approved. |

---

## Mobile

- Result number: `text-[3rem]` on mobile (reduced from 4rem)
- Range indicator: full width, marker visible
- CTAs: full-width stacked buttons on mobile
- All `border-t-2` dividers between parts preserved

---

## Component Reference

| Component | Token / class |
|---|---|
| Card container | `py-12 px-6 border-t-4 border-black` |
| Biomarker label | JetBrains Mono uppercase tracking-[0.15em] text-xs |
| Flag tag | `border-2 border-black rounded-none px-2 py-0.5 font-sans font-black text-xs uppercase` |
| Result number | `font-sans font-black text-[4rem] leading-none tracking-tighter` |
| Unit / reference | JetBrains Mono uppercase text-xs text-gray-400 |
| Range track | `w-full h-2 bg-gray-200 rounded-none relative` |
| Range marker | `absolute w-2 h-3 bg-black rounded-none -translate-x-1/2 -top-0.5` |
| Range zone labels | JetBrains Mono text-[10px] uppercase tracking-[0.15em] text-gray-400 |
| Part divider | `border-t-2 border-black mt-8 pt-8` |
| Part eyebrow | JetBrains Mono uppercase tracking-[0.15em] text-xs mb-3 |
| Body copy | `font-serif text-base leading-relaxed` |
| Compliance note | `font-serif text-sm text-gray-500 italic mt-3` |

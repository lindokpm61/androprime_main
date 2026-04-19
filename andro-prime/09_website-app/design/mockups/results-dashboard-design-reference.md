# Results Dashboard — Design Reference

**Date:** April 2026
**Source:** Thriva partner page (thriva.co/for-partners) — mobile results UI screenshot
**Purpose:** Visual reference for Andro Prime results dashboard. Adopt the design language, not the limitations.

---

## Reference: Thriva Results UI

**Save the screenshot from the Thriva partner page into this directory as `thriva-results-ui-reference.png`.**

### What their UI shows (per biomarker)

Each biomarker is presented as a card/row with:

1. **Marker name** as heading (e.g. "Omega-3 Index", "Thyroid-stimulating hormone (TSH)")
2. **Value + unit** displayed prominently, left-aligned, large font (e.g. "1.45 %", "1.87 mIU/L", "3.27 mIU/L")
3. **Horizontal range bar** — colour-coded zones showing where the value falls:
   - Red/orange zone = low or high (outside healthy range)
   - Green zone = normal/optimal
   - A marker dot or line indicating the customer's actual position on the bar
   - Numeric scale labels along the bar (e.g. 0, 1.5, 2.5, 3.5, 4.5, 5.5)
4. **Status badge** — pill-shaped label to the right of the range bar:
   - "LOW" (orange/red background)
   - "NORMAL" (green background)
   - "OPTIMAL" (green/teal background)
5. **Expand/collapse chevron** — each marker row can be expanded for detail

Below all marker rows:
6. **Doctor's report** — personalised section with GP photo, name ("Dr. Williams"), and conversational opening ("Hi Ben, Your Omega-3 Index is in the...")

### Navigation
- "Jump to..." dropdown at top for quick navigation between markers
- Back arrow for returning to previous view

### Visual style
- White background, clean sans-serif typography
- Generous spacing between marker rows
- Range bar is the dominant visual element per row — immediately scannable
- Mobile-first layout (screenshot shows phone in hand)
- Minimal chrome — no sidebars, no heavy navigation

---

## What to adopt for Andro Prime

### Keep from Thriva's pattern
- Horizontal range bar with colour zones — this is the clearest way to show "where am I?"
- Status badge (LOW, NORMAL, OPTIMAL) — instant answer before the customer reads anything else
- Value + unit prominently displayed
- Marker name as clear heading
- Clean, generous spacing
- Mobile-first layout
- Doctor's report section with named GP (maps directly to Dr Ewa Lindo)

### Adapt to Andro Prime brand
- Use Andro Prime design system tokens for colours, not Thriva's palette
- Status badge colours should map to your existing status tokens:
  - `--color-status-optimal` for OPTIMAL
  - `--color-status-warning` for borderline/elevated
  - Black or brand dark for LOW and GP-block states
- Typography: use your brand serif for explanation text, sans-serif for data values
- Range bar styling: heavier, bolder — matches your "anti-corporate, plain-speaking" brand. Not delicate health-app gradients.
- Border treatment: your existing `border-4 border-black` panel style from the Phase 5 CSS spec

### Add (not present in Thriva's UI)

This is where the Andro Prime dashboard diverges from a standard results viewer. Each marker panel has five sections, not two:

| Section | Component | What it does | Thriva equivalent |
|---|---|---|---|
| 1. Value | `ResultValue` | Range bar, value, unit, status badge | Yes — this exists in Thriva's UI |
| 2. Explain | `ResultExplain` | Plain-English interpretation: "Your results indicate your testosterone is below the range where most men feel their best." | Partially — their doctor's report covers this |
| 3. Educate | `ResultEducate` | What this marker does in your body. No product names. No sales language. | No equivalent |
| 4. Recommend | `ResultRecommend` | "Here's what you can do about this." EFSA claims. Supplement framing. Or GP referral. Or retest. | No equivalent |
| 5. Convert | `ResultConvert` | CTA buttons: supplement pre-order, founding member deposit, Kit 2 cross-sell, GP referral link | No equivalent |

Plus:
- **QualifierGate** — interactive yes/no question card for hs-CRP joint symptoms qualifier. Appears between Educate and Recommend when the classifier needs more information before it can resolve a CTA. Not present in Thriva's UI at all.

### Doctor's report section

Thriva shows a generic doctor's report below all results. For Andro Prime:

- Feature Dr Ewa Lindo by name and photo
- Report is per-kit, not per-marker (one summary, not seven)
- Written in Keith's brand voice, not clinical language
- Signed off by Ewa but reads like a real person talking to you
- Positioned at the top of the results page (before individual markers) as the "here's what your blood is telling you" summary, or at the bottom as a closing context piece. Test both positions.

---

## Layout Structure (mobile-first)

```
┌─────────────────────────────────┐
│  Your Results                    │
│  Kit 3 — Hormone & Recovery     │
│  Results received: 14 Apr 2026  │
├─────────────────────────────────┤
│                                  │
│  Dr Ewa's Summary               │
│  "Keith, here's what your       │
│   blood is telling you..."      │
│                                  │
├─────────────────────────────────┤
│                                  │
│  ┌─ Testosterone ─────────────┐ │
│  │  9.5 nmol/L         [LOW]  │ │
│  │  ═══●═══════════════════   │ │
│  │  0    12    20    30       │ │
│  │                             │ │
│  │  Your results indicate...   │ │
│  │                             │ │
│  │  ┌ What testosterone does ┐ │ │
│  │  │ (education panel)      │ │ │
│  │  └────────────────────────┘ │ │
│  │                             │ │
│  │  What you can do about it   │ │
│  │                             │ │
│  │  [Founding Member ▸]        │ │
│  │  [Daily Stack ▸]            │ │
│  └─────────────────────────────┘ │
│                                  │
│  ┌─ Vitamin D ────────────────┐ │
│  │  30 nmol/L          [LOW]  │ │
│  │  ═══●═══════════════════   │ │
│  │  ...                        │ │
│  └─────────────────────────────┘ │
│                                  │
│  (repeat for each marker)       │
│                                  │
└─────────────────────────────────┘
```

---

## Implementation notes

- The Phase 5 implementation plan (`09_website-app/docs/phase5-implementation-plan.md` v1.2) defines the full component architecture and data flow
- The range bar component should be extracted as a reusable `<RangeBar>` shared component — it will also be useful on landing pages and marketing materials
- Status badge text should come from the classifier's `stateLabel`, not be hardcoded in the component
- All copy comes from the `COPY` constant in the classifier — the components render, they don't decide what to say
- The doctor's summary section is not yet in the Phase 5 plan. It will need its own data source — either a template system with variable interpolation, or a static summary per kit type. Add this as a Phase 5 follow-up.

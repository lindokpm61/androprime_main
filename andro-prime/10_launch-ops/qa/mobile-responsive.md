# QA: Mobile Responsiveness
## Code-level audit — April 2026

Audit method: review of responsive Tailwind classes across LP and canonical pages.
Visual rendering cannot be verified without a live browser — items marked NEEDS_LIVE_TEST require browser QA.

---

## Responsive Structure (code review)

### Grid system
All pages use Tailwind responsive grid consistently:
- `grid-cols-1` → `md:grid-cols-2` → `lg:grid-cols-4` (process steps)
- `lg:grid-cols-12` with `lg:col-span-6` (hero sections)
- `grid-cols-2 md:grid-cols-4` (trust bars)

**Result: PASS**

### Typography scaling
- H1: `text-6xl md:text-7xl lg:text-[80px]` across LP variants — scales down on mobile
- H2: `text-5xl md:text-6xl` or `text-5xl md:text-7xl` — scales
- Body: `text-lg md:text-xl` — scales
- Data labels: fixed `text-xs` / `text-sm` — may be tight on 320px screens

**Result: PASS — verify readability at 375px in browser**

### CTA buttons
- `flex flex-col sm:flex-row` on CTA groups — stacks vertically on mobile
- `w-full sm:w-auto` on buttons — full-width on mobile

**Result: PASS**

### Nav — LP variant
- Logo and single CTA visible at all widths
- No hamburger in LP variant (`showLinks = variant !== 'lp'`)

**Result: PASS**

### Nav — marketing variant
- Desktop links hidden on mobile: `hidden md:flex`
- Hamburger shown on mobile: `md:hidden`
- Mobile drawer: `md:hidden border-t-2 border-black` — renders below header

**Result: PASS**

### Sample report panels (hero)
- Floating label badges: `hidden md:block` — correctly hidden on mobile
- Report card itself: no hidden class — visible on all screen sizes

**Result: PASS**

### Sticky order card (energy-recovery LP)
- `lg:sticky lg:top-32` — only sticky on large screens
- Stacks below FAQ on mobile and tablet

**Result: PASS**

### Process step cards
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` — single column on mobile

**Result: PASS**

### Biomarker panels
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` — single column on mobile

**Result: PASS**

### Compare table (hormone-recovery LP)
- `overflow-x-auto` wrapper with `min-w-[800px]` table — horizontally scrollable on mobile

**Result: PASS**

### min-width enhancement queries
- Tailwind classes use `min-width` breakpoints by default (`sm:`, `md:`, `lg:`) — matches checklist preference

**Result: PASS**

---

## Live Browser Test Checklist

Run at: 375px (iPhone SE), 390px (iPhone 15), 768px (iPad), 1280px (desktop), 1440px (large desktop).

| Check | Breakpoints | Priority |
|-------|-------------|----------|
| Hero text readable, not overflowing | 375px, 390px | P0 |
| CTA buttons full-width, not clipped | 375px | P0 |
| No horizontal page-level scroll | 375px | P0 |
| LP nav: logo + CTA only, no hamburger | 375px | P0 |
| Marketing nav: hamburger opens drawer | 375px | P0 |
| Sample report panel: visible on mobile | 375px | P1 |
| Floating report badges: hidden on mobile | 375px | P1 |
| Trust bar: 2×2 on mobile, 1×4 on desktop | 375px, 1280px | P1 |
| Process steps: 1 column on mobile | 375px | P1 |
| Sticky order card: not sticky on mobile | 375px | P1 |
| Compare table: horizontal scroll on mobile | 375px | P1 |
| FAQ accordion: tap targets usable | 375px | P1 |
| Footer: readable at small sizes | 375px | P2 |
| Data label text readable | 375px | P2 |
| Collagen/daily-stack hero: 7/5 col layout collapses | 375px | P1 |
| Hormone-recovery compare table: 4-col → scroll | 375px | P1 |

---

## Known Potential Issues (verify in browser)

1. **Large H1 at 375px**: `text-6xl` = 60px line height, which may cause line wrapping with very short viewport width on some headline copies (e.g. "Stop guessing which supplements you need" at 80px font).
2. **Mono data values in report cards**: Large mono `data-value` text may feel crowded on 375px.
3. **9-item biomarker grid (hormone-recovery LP)**: `md:col-span-2 lg:col-span-1` on the Ferritin card — verify collapses to single column correctly on mobile.
4. **Sticky order card (energy-recovery)**: On iPad (768px, which is `md` not `lg`), the card is not sticky — confirm this feels correct UX.

---

## Blocked By

LP and marketing pages can be tested locally with `npm run dev` — no env vars needed for static content.
Authenticated pages (results dashboard, account, subscriptions) require Supabase project to test at all breakpoints.

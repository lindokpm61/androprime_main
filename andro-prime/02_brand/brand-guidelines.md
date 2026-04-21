# ANDRO PRIME — BRAND GUIDELINES

## Visual Identity & Design System | April 2026

**Version:** 2.0
**Owner:** Keith Antony
**Status:** Active
**Cross-reference:** `09_website-app/frontend/canonical-site/home/index.html`, root `CLAUDE.md` (Brand Voice)

---

## 1. Brand Overview

Andro Prime is a UK men's health company built on one principle: blood data should precede every recommendation. Test first, then act.

The brand is light, direct, and editorial. Not a wellness brand. Not a supplement shop. Not a sterile clinic. Think quality British print publication meets precise medical reporting. The visual language says: we have nothing to prove, here are your numbers.

This replaces the previous dark/cockpit aesthetic. The rationale: the dark glass/glow system is now ubiquitous in men's health DTC. The light editorial direction differentiates at category level and better matches the 38-54 ICP who responds to authority signals, not tech-startup atmosphere.

---

## 2. Logo

**Wordmark:** "AndroPrime" set in Inter, `font-black` (weight 900), `uppercase`, `tracking-tighter`.

**Logo mark:** Square container (`rounded-none`), black fill, white "AP" text in Inter font-black.

| Context | Treatment |
| ------- | --------- |
| Primary (light background) | `#000000` on `#FFFFFF` |
| Inverted (rare, dark section) | `#FFFFFF` on `#000000` |
| Minimum wordmark size | 16px |
| Clear space | Minimum 1x the height of the "A" on all sides |

**Usage rules:**

- Never stretch, rotate, or add effects to the wordmark
- No pill shape, no rounded corners on the logo container — always `rounded-none`
- No taglines attached to the logo lockup

---

## 3. Colour Palette

### 3.1 Core System (two colours)

| Token | Value | Usage |
| ----- | ----- | ----- |
| `--color-black` | `#000000` | Primary — all text, borders, buttons, filled containers |
| `--color-white` | `#FFFFFF` | Background — page, cards, surfaces |

No brand accent colour. Black and white only on all marketing and UI surfaces.

### 3.2 Grays (functional only)

| Tailwind class | Approx hex | Usage |
| -------------- | ---------- | ----- |
| `gray-50` | `#F9FAFB` | Hover state on cards, section background variant |
| `gray-100` | `#F3F4F6` | Inset data panels, ghost number backgrounds |
| `gray-200` | `#E5E7EB` | Progress bar tracks in data displays |
| `gray-400` | `#9CA3AF` | Secondary text in large headings (contrast device only) |
| `gray-500` | `#6B7280` | Subscript text (e.g. `/mo` on prices) |
| `gray-600` | `#4B5563` | Trust bar supporting text |

### 3.3 Data Display Exception

Progress bars and biomarker status indicators in the results dashboard may use a single muted functional colour to distinguish optimal from warning states. This is the **only** permitted use of non-black/white colour on the site:

| State | Suggested value | Usage |
| ----- | --------------- | ----- |
| Optimal | `#059669` (muted green) | Progress bar fill, status dot |
| Warning / borderline | `#D97706` (muted amber) | Progress bar fill, status dot |
| Low / flag | `#000000` (black) | Progress bar fill in marketing hero panels |

Marketing pages and hero data panels use solid black bars. Colour differentiation applies only in the authenticated results dashboard where interpreting good vs. concerning is the functional purpose.

### 3.4 What to Avoid

- No blue accent of any kind (`#005BEA` is retired)
- No gradient fills, ambient glows, or radial light effects
- No mid-tone backgrounds — everything is either white, near-white gray, or black

---

## 4. Typography

### 4.1 Font Stack

| Role | Family | Weights | Source |
| ---- | ------ | ------- | ------ |
| Headlines & UI | **Inter** | 300, 400, 500, 600, 700, 900 | Google Fonts |
| Body copy | **Merriweather** | 300, 400, 700, 400 italic | Google Fonts |
| Data labels | **JetBrains Mono** | 400, 500, 700 | Google Fonts |

```css
--font-sans:  'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-serif: 'Merriweather', Georgia, serif;
--font-mono:  'JetBrains Mono', monospace;
```

### 4.2 Type Scale

| Name | Size | Family | Weight | Tracking | Line height | Usage |
| ---- | ---- | ------ | ------ | -------- | ----------- | ----- |
| Hero | `clamp(~6rem, 6vw, 100px)` | Inter | 900 | `-0.03em` (tracking-tighter) | 0.85 | Homepage H1, CTA section headline |
| H2 | `clamp(3rem, 5vw, ~7rem)` | Inter | 900 | `-0.03em` | 0.9–1.0 | Section headings |
| H3 | `1.5rem–3rem` | Inter | 900 | `-0.03em` | tight | Sub-section headings, card titles |
| Body XL | `1.25rem` | Merriweather | 400 | default | 1.6–1.7 | Section intro paragraphs |
| Body | `1rem` | Merriweather | 400 | default | 1.6–1.7 | Card descriptions, content paragraphs |
| Body SM | `0.875rem` | Merriweather | 400 | default | 1.65 | Supporting copy, table text |
| UI Label | `0.875rem–1rem` | Inter | 900 | `-0.05em` (tracking-tight) | 1.2 | Inline labels, trust bar titles, nav links |

### 4.3 Monospace Scale (JetBrains Mono)

| Name | Size | Usage |
| ---- | ---- | ----- |
| Data label | `0.625rem–0.75rem` (`text-[10px]` to `text-xs`) | Section eyebrows, biomarker names, status text |

**Mono rules:**

- Always `text-transform: uppercase`
- Always `letter-spacing: 0.15em`
- Colour is `#000000` (or `#FFFFFF` on inverted/black panels)

### 4.4 Headline Characteristics

Headlines are **black-weight and compressed.** `font-black` (900) with `uppercase` and `tracking-tighter` creates the bold editorial authority. This is the opposite of the previous light/wide approach.

**Contrast device:** A secondary line in `text-gray-400` (e.g. "That's not an answer." in a section heading) creates a two-tone headline rhythm. Use sparingly — one per section maximum.

**Italic serif quotes:** Large pull quotes use `font-serif italic` at `text-xl` to `text-2xl`, set off by a left border (`border-l-[6px] border-black`).

### 4.5 Headline Weight Rule

All `<h1>` through `<h4>` use `font-sans font-black`. Never use light or regular weight for headings. Body copy uses `font-serif` exclusively for paragraphs.

---

## 5. Buttons

All buttons use `rounded-none`. No pill shapes. No rounded corners. This is non-negotiable.

### 5.1 Button Types

| Class | Background | Text | Border | Use case |
| ----- | ---------- | ---- | ------ | -------- |
| Primary | `bg-black` | `text-white` | `border-2 border-black` | Hero CTA, primary page action |
| Primary hover | `bg-white` | `text-black` | `border-2 border-black` | Inverts on hover |
| Secondary | `bg-white` | `text-black` | `border-2 border-black` | Secondary CTA alongside primary |
| Secondary hover | `bg-gray-100` | `text-black` | `border-2 border-black` | Subtle fill |
| Card CTA (ghost) | transparent | `text-black` | `border-2 border-black` | Standard card action |
| Card CTA (solid) | `bg-black` | `text-white` | `border-2 border-black` | Featured card action |
| Nav CTA | `bg-black` | `text-white` | `border-2 border-black` | Navigation bar |

### 5.2 Button Specs

```text
Font:     Inter, font-black, uppercase, tracking-widest
Size:     text-sm (0.875rem)
Padding:  px-8 py-4 (primary) | px-5 py-2.5 (nav) | px-6 py-4 (card CTA)
Border:   2px solid black
Radius:   0 (rounded-none)
Shadow:   none
```

### 5.3 Hover States

All button transitions: `transition-colors` at default `200ms`.

- Primary button inverts: `bg-white text-black border-black`
- Ghost/secondary button fills: `bg-black text-white`
- Nav CTA inverts: `bg-white text-black`

### 5.4 Arrow Icons in Buttons

Buttons may include a trailing SVG arrow (`stroke-linecap="square" stroke-linejoin="miter"`). Size: `20px`. No hover translation animation — the inversion on hover is the feedback.

### 5.5 Rules

- One primary CTA per page
- Include the price in the primary CTA text where possible (e.g. "Explore Test Kits" or "Choose your test")
- Never use a filled accent-colour button
- Never use `border-radius` other than `0` on any button

---

## 6. Cards

### 6.1 Standard Card

```css
background:    #FFFFFF
border:        2px solid #000000
border-radius: 0
padding:       2.5rem (p-10)
```

**Hover:** `hover:bg-gray-50` — subtle fill only. No lift, no shadow.

### 6.2 Featured / Inverted Card

Used for the primary option in a comparison set (e.g. Kit 3, process step 4):

```css
background:    #000000
border:        4px solid #000000
border-radius: 0
```

Text inverts to white. Featured badge sits above the card, centred, in black fill with white text.

### 6.3 Inset Data Panel (inside a card)

```css
background:    #F3F4F6 (gray-100)
border:        2px solid #000000
border-radius: 0
padding:       1.25rem (p-5)
```

Used for "Triggered By Diagnostic Result" blocks inside supplement cards.

### 6.4 Supplement Cards — Left Accent Border

```css
border-left-width: 12px
border-left-color: #000000
```

This is the only permitted use of a thick asymmetric border as a visual accent.

### 6.5 Rules

- No `border-radius` on any card
- No `backdrop-filter` or glass effects
- No box shadows on cards
- Minimum padding: `p-10` (2.5rem) on desktop, `p-6` (1.5rem) on mobile

---

## 7. Layout & Spacing

### 7.1 Content Width

| Tailwind class | Value | Usage |
| -------------- | ----- | ----- |
| `max-w-7xl` | `1280px` | Standard content container |
| `max-w-4xl` | `896px` | Narrow centred content (CTA sections) |
| `max-w-3xl` | `768px` | Section intro text blocks |

### 7.2 Section Padding

| Context | Class | Value |
| ------- | ----- | ----- |
| Standard section | `py-32` | `8rem` top and bottom |
| Hero CTA section | `py-40` | `10rem` top and bottom |
| Page horizontal | `px-6` | `1.5rem` on all widths |

### 7.3 Section Dividers

Sections are separated by thick horizontal rules, not whitespace alone:

```css
border-top:    4px solid #000000   /* border-t-4 border-black */
border-bottom: 4px solid #000000   /* border-b-4 border-black */
```

Trust bar and stats rows use `border-y-2 border-black` (2px).

### 7.4 Grid System

| Component | Grid | Collapse |
| --------- | ---- | -------- |
| Kit cards | `grid-cols-1 lg:grid-cols-3`, `gap-8` | Single column below `lg` |
| Trust / stats bar | `grid-cols-2 md:grid-cols-4` | 2-col on mobile |
| Bento / founders | `grid-cols-1 md:grid-cols-12` | Single column below `md` |
| Process steps | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` | Stacks to single on mobile |
| Problem section | `lg:grid-cols-2`, `gap-20` | Single column below `lg` |

### 7.5 Responsive Breakpoints

| Breakpoint | Triggers |
| ---------- | -------- |
| `lg` / 1024px | Grid collapses, nav hides links, data panels shown/hidden |
| `md` / 768px | 2-column grids collapse, mobile layout applies |

---

## 8. UI Patterns & Components

### 8.1 Section Eyebrow

JetBrains Mono, uppercase, `tracking-[0.15em]`, black. Flanked by thin horizontal lines.

```html
<div class="data-label flex items-center gap-4">
  <span class="w-12 h-[2px] bg-black"></span>
  Section Label
  <span class="w-12 h-[2px] bg-black"></span>
</div>
```

Left-aligned variant (most sections) omits the trailing line.

### 8.2 Navigation

Full-width sticky nav. `bg-white border-b border-black`. Fixed at `top: 0`. Height `h-20`.

- Logo: square black box + wordmark
- Links: Inter `font-bold uppercase tracking-widest text-sm`, `hover:underline`
- CTA: solid black pill-less button (see Section 5)
- Trust signal inline: data-label + static square dot, hidden below `lg`

No floating pill. No `backdrop-filter`. No blur.

### 8.3 Status Dots

Small square indicator dots (not circles — `rounded-none`).

```css
width: 8px; height: 8px;
border-radius: 0;
background: #000000;
```

No pulse animation. No glow. Static only. Used in nav status labels and card headers. On black panels, fill is `#FFFFFF`.

### 8.4 Large Ghost Numbers

Background depth device on process/step cards. Large numeral in `text-[150px] font-sans font-black text-gray-100`, absolutely positioned behind content.

```css
position: absolute;
top: 0; right: 0;
font-size: 150px;
color: #F3F4F6;
pointer-events: none;
select: none;
```

### 8.5 Pull Quotes / Blockquotes

```html
<blockquote class="pl-8 border-l-[6px] border-black py-4 bg-gray-50">
  <p class="font-serif italic text-2xl leading-snug">Quote text here.</p>
</blockquote>
```

Or inline within body copy:

```html
<p class="font-serif italic font-bold border-l-4 border-black pl-6">Quote text.</p>
```

### 8.6 Inline Code / Highlight Labels

Small inline label blocks used to highlight clinical terms or data values within body copy:

```css
background: #E5E7EB (gray-200)
border:     1px solid #000000
padding:    0.1em 0.5em
font-family: Inter, font-black, uppercase, tracking-widest
font-size:  0.875rem
```

### 8.7 Progress Bars (Data Panels)

```css
container:  height: 8px; background: #E5E7EB; border-radius: 0; overflow: hidden;
fill:       background: #000000; (marketing panels)
fill:       background: #059669 / #D97706; (results dashboard only)
```

No rounded caps. No gradient fills. Flat and square.

### 8.8 SVG Icon Style

All icons use:

```text
stroke-linecap:  square
stroke-linejoin: miter
stroke-width:    2–3
```

Consistent square linecaps throughout. No rounded linecaps anywhere.

---

## 9. Photography & Imagery

### 9.1 Photography Style

| Do | Don't |
| -- | ----- |
| Real men, ages 38–55 | Fitness models or bodybuilders |
| Natural settings: kitchens, offices, gyms | Studio setups with white backgrounds |
| Candid, unposed | Posed stock photography |
| Desaturated treatment via CSS `grayscale` filter | Bright, saturated imagery |
| Product-only shots on white or near-white | Busy lifestyle collages |

Photography is a high-risk area for this design. The light editorial system has no decorative UI to carry a page if imagery is weak. Do not go live without real photography.

### 9.2 Image Treatment on Site

Hero video / image uses:

```css
filter: grayscale(100%);
opacity: 0.6;
object-fit: cover;
object-position: center 30%;
```

With a `bg-white/40` overlay div on top to blend into the white background.

### 9.3 Product Photography

Kit product shots should be:

- On solid white background
- Lit with clean, even light
- No props, no hands. Just the kit.

---

## 10. Tone of Voice (Visual Summary)

The visual and verbal identities express the same thing in different media. Both are:

| Principle | Visual expression | Verbal expression |
| --------- | ----------------- | ----------------- |
| **Data first** | Biomarker readout panels, mono data labels, progress bars | "Find out what your blood is actually telling you." |
| **Founder-visible** | Keith and Ewa have dedicated sections with real copy | Keith's voice in every email and ad |
| **Plain-speaking** | Clean white layouts, no decorative noise | "Knackered all the time" not "suboptimal energy levels" |
| **Evidence-led** | UKAS badge, GMC credential labels, trust bar | EFSA-approved claims only |
| **Anti-corporate** | Bold compressed type, editorial weight, no softening radius | "Your GP said normal. That's not the same as good." |

---

## 11. What This Brand Is NOT

| Territory | Example brands | Why we avoid it |
| --------- | -------------- | --------------- |
| White wellness | Hims, Numan | Correct palette, wrong energy. Too soft and medicated. |
| Clinical sterile | Medichecks, Forth | No personality. Feels like a form. |
| Dark glass / cockpit | Previous Andro Prime V1 | Ubiquitous in men's health DTC. No longer differentiating. |
| Supplement bro | MyProtein, Bulk | Wrong audience. Too loud. |
| Luxury private clinic | Balance My Hormones | Too expensive-feeling. Wrong entry point. |

---

## 12. Quick Reference for Builders

When building any new page or component:

1. `bg-white text-black` is the default. Everything is light.
2. Use CSS custom properties or Tailwind tokens. No hardcoded hex values except `#000000` / `#FFFFFF`.
3. Font load order: Inter (300–900) + Merriweather (300, 400, 700, 400i) + JetBrains Mono (400, 500, 700)
4. `rounded-none` on every interactive element, card, button, and container. No exceptions.
5. Section borders are structural: use `border-t-4 border-black` to separate sections.
6. Mobile-first layout. Desktop enhancements via `min-width` (`md`, `lg`) media queries.
7. All button and link transitions: `transition-colors duration-200`.
8. All position/transform transitions: `transition-transform duration-300`.
9. Test everything on a white `#FFFFFF` background. If something looks thin or lost, increase border weight — do not add colour.
10. Photography placeholder rule: if real photography is not available, use a gray-100 box with a data-label. Never use placeholder stock.

---

*Version 2.0 — April 2026*
*Owner: Keith Antony / Andro Prime*
*Derived from: `09_website-app/frontend/canonical-site/home/index.html` and all canonical-site pages*
*Supersedes: V1.0 (dark cockpit system)*

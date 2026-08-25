# 01 — Evidence

Consolidated from five subagents, all briefed blind and all forbidden from scoring. Every finding
below carries a citation. Findings without one were rejected.

Line references are into `design/mockups/results-range-placement-study.html`.

> **Source note, added 2026-08-25.** This audit was run against
> `design/mockups/results-range-placement-study.html` as it stood on 2026-08-22, and cites it
> by line number, so that file is preserved unchanged as the frozen audit subject. **It has since
> been superseded** and must not be republished: it draws total testosterone against 6.68 to 25.70
> where Vitall's confirmed male interval is 8.64 to 29.00, and it predates the dual-range marker
> card. The live source is `design/mockups/2026-08-21-where-the-range-sits.html`.
> **Two findings below are already fixed there**: the range bar now carries a
> `role="img"` with a descriptive `aria-label`, and the marker card states both the
> laboratory interval and our action cutoff in text rather than by colour alone.

**B** = lines 363–483 (`div.app` 370–475). **D** = lines 598–729 (`div.app` 607–721).
Shared CSS = lines 1–226.

---

## A. The shared baseline

B and D use **byte-identical markup** for the nav, statusbar, sidebar, report head, the testosterone
marker block, the first recommend strip, the consent box and the footer. Only the shelf differs.
Every defect in this section belongs to both candidates equally, and most belong to A and C too.

### A1. Light theme fails WCAG AA on most small text

The `--ink-3` token is `#8A8E94` on `--page #FFFFFF` = **3.29:1**, against a 4.5:1 requirement for
small text. It carries: `.main-eyebrow`, `.main-date`, `.mk-unit`, `.scale-ends`, `.pdose`, `.cl`
(the EFSA claim on every card), `.parrow`, `.consent-box b`, `.foot`.

Worse: `.rec-l b` "What we recommend" is `#8A8E94` on `--strip #F4F4F2` = **2.99:1** (CSS 95, 97).

Worst: `.bt-eb` "FOOD SUPPLEMENT" on the pack shots renders at **4.13px** (B) / **4.47px** (D) at
**2.40:1** over the shaded end of the pack gradient (CSS 125, 137–138). Not small text. Decoration
shaped like text.

Dark theme lifts `--ink-3` to `#7B7F85` = 4.58:1 and passes, except `.rec-l b` at **4.20:1** and
`.bt-eb`, which never themes at all.

### A2. Non-text contrast fails

`--line` borders measure **1.43:1** light / 1.41:1 dark (CSS 111, 81), against a 3:1 requirement for
component boundaries. The focus ring clears 3:1 by only 0.11–0.43 in light (`--focus #1E9E63` =
3.43:1 on `--page`, 3.11:1 on `--strip`).

### A3. The range bar conveys its meaning by colour alone

The four zone segments (B 399–403, D 636–639) carry no text, no pattern, no border, no label. Which
band is low, borderline or in-range is available only as red/amber/green. Adjacent segments are
separated by hue, not luminance: `mid/ok` measures **1.28:1** light, **1.05:1** dark. The `.tick`
marking where the reader's own result falls (CSS 87) has no label, no role, no accessible name, and
fails 3:1 against its band in dark (**1.95:1**).

This is the single most information-dense element on a blood-test results page.

### A4. Six primary actions are unreachable by keyboard

The nav items, "Log out" and "Speak to our team" are `<span>`s. The consent control is an empty
`<i>` styled as an 11×11 box (CSS 106) with no `<input>`, no `<label>`, no state, no focusability
(B 468, D 715).

### A5. Semantics are almost absent

One landmark per candidate (`<main>`). `<aside class="side">` resolves to `role=generic`, not
`complementary`, because it is unnamed inside sectioning content. Zero `role`, `aria-*`, `alt` or
`title` attributes exist inside either `div.app`. No skip link. The first heading is `h3`; levels 1
and 2 are absent.

**The shelf block has no heading element in either candidate.** In D, the block's own title is a
`<p>` (line 661). A reader navigating by heading gets `h3 Your results`, `h4 What your blood is
telling you`, and nothing for the commerce.

Each product card's accessible name computes to 137 characters, announcing the product name twice
and the dose twice before the price:
`"ANDROPRIME AP FOOD SUPPLEMENT VITAMIN D3 D3 4,000 IU VITAMIN D3 4,000 IU · 365 TABS Contributes to normal muscle function. Price TBC VIEW →"`

### A6. States are absent

| State | `a.prod` | `a.btn.ghost` |
|---|---|---|
| hover | present (CSS 113, 155, 156) | **missing** — no `.btn:hover` rule exists |
| focus | present, and good (CSS 37 + 113/155/156) | partial — global ring only |
| disabled / loading / error / success / empty | **all missing** | **all missing** |

No `:active` rule anywhere in the file.

### A7. `prefers-reduced-motion` is only partially respected

CSS 225 neutralises `.prod`'s transition and hover transform. It does **not** reset `.parrow`'s
colour transition (CSS 154), so 3 elements per candidate still animate. It also does not neutralise
the `:focus-visible` transform, so the card still shifts 3px on keyboard focus.

### A8. Dark mode is fully correct — with two hardcoded exceptions

All 16 tokens are defined in bare `:root` (7–14), redefined under `prefers-color-scheme` guarded as
`:root:not([data-theme="light"])` (15–24), and redefined again under `:root[data-theme="dark"]`
(25–32). `body` takes an explicit token background (35). No colour has its only definition inside a
media query. The light escape hatch correctly beats an OS dark preference.

But **18 hardcoded literals inside `div.app` never theme**: the nav and statusbar (CSS 54–60) and
the entire pack-shot component (CSS 123–144). Measured consequence in dark: `.nav #0B0B0C` against
`--page #131416` = **1.07:1**, and `.statusbar #161719` = **1.03:1**. The nav merges into the page.
`#8A8E94` and `#3F4247` in the pack artwork are literal copies of the light-theme values of
`--ink-3` and `--ink-2`.

### A9. The nav is clipped at 390px

`.nav` has scrollWidth 406px inside a 348px box, clipped by `.app{overflow:hidden}` (CSS 53).
"ACCOUNT" is cut off at the right edge. Identical in both.

### A10. Weight is not a differentiator

**0 bytes of JavaScript** in both (three independent confirmations: grep, runtime `script` count,
CDP resource log). 0 idle animations (`document.getAnimations()` empty on every run; zero
`@keyframes` in the file). 0 modals, 0 fixed or sticky overlays.

6 network requests, of which **82,340 bytes (60.5% of wire weight) is Google Fonts** — one
render-blocking cross-origin stylesheet (line 4, no preload, no local fallback) plus 4 woff2 files.
Measured: first paint followed that stylesheet by 99ms; blocking the font hosts collapsed
`loadEventEnd` from 2,674ms to **21ms**. Neither candidate can shed a byte of it.

`domInteractive` sits in a 34–44ms band across every configuration and the B/D ordering flips
between runs. The difference is measurement noise.

### A11. Copy: what is clean

All three EFSA claims are **verbatim-exact** against the authorised table in
`03_compliance/CONTEXT.md:106-112`. No unauthorised claim, no rephrasing, no retired magnesium
claim. **Ashwagandha appears nowhere** — the silent-ingredient rule holds. **Zero em dashes** in the
whole file. No marketing superlatives anywhere: no "best", "leading", "proven", "clinically proven".

### A12. Copy: what is not

- **"personalised biomarker insights"** (B 382, D 619) is on the red-flag list at
  `03_compliance/CONTEXT.md:96` as implying bespoke per-customer clinical interpretation. The
  mandated alternative is "Ewa-approved recommendation logic".
- **"This is our full range" / "our whole range"** (B 462, D 708) conflicts with
  `04_products/catalogue/product-catalogue-v7-1.md:25-26`, which lists Daily Stack and Joint &
  Recovery Collagen as the supplement SKUs. Three bottles are not the documented catalogue.
- **Hidden cost.** Three purchase-shaped whole-card links with a price slot reading "Price TBC", a
  nav asserting a "Subscriptions" area exists, and **no billing frequency, term or cancellation
  copy anywhere in frame**.
- **Bundled consent.** One control binds two purposes: retention of a health result on file, and
  marketing email about a future service (B 468–471, D 714–717). A UK GDPR problem, not a design
  preference.
- **"Ewa-approved recommendation logic"** sits in the footer, *below* the shop block, unscoped. A
  named GP's approval appears to cover the commerce above it.
- **"All four markers are within range"** with a "4/4" statusbar, against a Kit 1 panel documented
  as five biomarkers at `product-catalogue-v7-1.md:49`.
- **"I can unsubscribe any time"** and **"Speak to our team"** — neither mechanism exists.

---

## B. Candidate B — specific evidence

### B1. B's shelf is byte-identical to a clinical marker block at every frame-level property

Declaration by declaration, `div.supblock` (421) against `div.mk` (394):

| Device | Shelf | Marker | |
|---|---|---|---|
| Top border | CSS 170 `border-top:1px solid var(--hair)` | CSS 75, same | **identical** |
| Grid ratio | CSS 170 `1.28fr 1fr` | CSS 75 `1.28fr 1fr` | **identical** |
| Background | inherits `--page` | inherits `--page` | **identical** |
| Left column | CSS 76, incl. `border-right:1px solid var(--line)` | CSS 76 | **identical** |
| Right column | CSS 77 | CSS 77 | **identical** |
| Header row | `.mk-top > .mk-name` (423) | `.mk-top > .mk-name` (396) | **identical classes** |
| Chip | `span.chip.out` "Same on every report" (423) | `span.chip.out` "In range" (396) | **identical CSS** |
| Right-col heading | "What this means" + SVG `M13 2 3 14h7l-1 8 10-12h-7z` (452) | same text, **same SVG path** (406) | **identical** |
| Trailing strip | `div.rec` (460), CSS 95 | `div.rec` (414), CSS 95 | **identical** |
| Slot in sequence | block then grey strip | block then grey strip | **identical** |

The only frame-level differences are `.supblock .mk-l{display:flex}` (CSS 171) and the card size
token (CSS 173), both governing left-column *contents*, not the block's frame.

**The only things distinguishing B's shop from B's clinical content are text strings**: the
`.mk-name` reads "Our supplement range", the `.chip.out` reads "Same on every report", and the left
column holds cards instead of a number.

Vertical rules measured: `.mk-l` right edge at **x=788.4** in both blocks. Exact alignment.

### B2. The status-chip component carries a marketing disclosure

`span.chip.out` appears twice inside `div.app` with identical styling and opposite semantic
function: the reader's clinical result status (396), and a commercial disclaimer (423).

### B3. B's cards are invisible against their ground

`.prod{background:var(--page)}` (CSS 111) on a `.supblock` that is also `--page`. Measured
card-against-ground contrast: **1.00:1** in both themes. Only the 1.43:1 border separates them.
Every other placement of `.prod` in the file puts it on a contrasting ground.

### B4. Label-to-behaviour mismatches in B

1. **"See the range"** (464) points at a range rendered immediately above (424–449), one line under
   prose saying "This is our full range, listed for reference" (462).
2. **"What we recommend / Nothing"** (461–463) vs a strip whose only control is the onward path
   into the shop (464).
3. Result-status chip reused for a marketing disclosure (B2 above).
4. **"View →"** per card (431/439/447) and **"See the range"** per strip (464) are two
   differently-scoped, unstated destinations for the same three products.

### B5. B's orphan styles

Four: the 1.00:1 card ground (B3); `.mk-l` becoming a flex column only here (CSS 171); the grid
ratio restated as a duplicated literal rather than shared (CSS 170); and `.chip.out` carrying two
meanings (B2). Plus the shared `.pdose` defect below.

---

## C. Candidate D — specific evidence

### C1. D's device inventory against a marker block

Added: a 2px top rule (vs 1px); a 2px bottom rule (marker has none, CSS 210); an inverted `--chip`
bar with its own eyebrow and 21px/800 headline (CSS 202–206); a `--strip` shelf ground (vs `--page`,
CSS 207); full-bleed margins on bar and shelf; a `1.42fr 1fr` grid (vs 1.28fr); `border-top:0` on
the shelf itself; and **removal of the `.chip.out`**.

Carried over unchanged: `.mk-l`/`.mk-r` classes and padding including the `.mk-l` `border-right`;
`.mk-top`/`.mk-name` header classes; the `.mk-sec`/`.mk-sec-h` right column **including the
identical SVG icon and the identical "What this means" heading**; and the trailing `.rec` "What we
recommend" strip.

**The declaration changed. The grammar underneath it did not.**

### C2. The 22.5px misalignment — a visible, jarring defect

`.supblock.declared{grid-template-columns:1.42fr 1fr}` (CSS 207) is a *third* ratio for the same
two-column grammar. Measured consequence: **the shelf block's vertical rule sits at x=810.9 while
the marker block's above it sits at x=788.4 — a 22.5px misalignment in the same column of the same
page.** Visible in `option-3-light.png`. B's two rules align exactly.

### C3. The 2px top rule is a dead declaration

`.declare{border-top:2px solid var(--hair)}` (CSS 202) sits on `background:var(--chip)`. `--hair`
and `--chip` resolve to the same value in both themes (`#0B0B0C` light, `#F2F2F0` dark). Measured
**1.000:1**. The rule never renders as a rule. It only makes the bar 2px taller.

The matching `.rec.declared-end{border-bottom:2px solid var(--hair)}` (CSS 210) *does* render,
because `.rec` is `--strip`. So the region is closed at the bottom and open at the top.

### C4. `opacity` on text is used nowhere else in the file

CSS 204 (`.58`) and 206 (`.78`). Every other de-emphasis in the file is a token. Candidate C solves
the identical problem on the same kind of dark ground with explicit hex. The opacity generates four
effective colours that exist in no token: `#989899`, `#C9C9CA` (light), `#6C6C6B`, `#3E3E3E` (dark).

It also degrades unevenly: `.declare .sup-lab` measures **6.83:1** light but **4.69:1** dark, a 31%
loss, clearing AA by 0.19.

### C5. Further one-off values in D

- `.declare{grid-template-columns:minmax(0,1fr) minmax(0,1.02fr)}` (CSS 203). `1.02fr` is unique in
  the file; measured 427.7px / 436.3px, an **8.6px asymmetry** with no rationale.
- `--shotpad:19px` (CSS 209) appears in no other rendered spacing.
- `.prod-row{gap:14px}` (CSS 208) overrides the 12px base (CSS 172) by 2px.
- `text-wrap:balance` (CSS 205) is used on no other element.
- Removing the chip leaves `.mk-top`'s `justify-content:space-between` (CSS 78) operating on a
  single child.

### C6. Three copy defects specific to D

1. **"End of your results" (660) is false.** Below that bar, the consent box asks the reader to
   consent to Andro Prime processing "my testosterone result" (714–717) and the footer reads
   "Questions about your **results**? Speak to our team" (718). The eyebrow announces an end that
   is not one.
2. **"Your numbers above do not point at any of these." (708)** is a per-reader conclusion about
   products, stated as static copy, tying the shelf to the reader's blood — in a block whose own bar
   says "Nothing below was chosen for you" (663). It is the exact failure the design exists to
   prevent, and B has no equivalent.
3. **"The shelf is fixed. It does not read your results, so it cannot respond to them. The only
   thing your result decides is whether it appears at all."** (702–703). Two sentences that
   contradict each other to any reader not already holding the GP-routing rule.

### C7. D asserts a state it does not implement

D's copy states the shelf is conditionally absent on a GP-referral result (703). Nothing in CSS or
markup implements a hidden state, **and nothing ties `.declare` to the shelf's presence** — so the
declaration bar would remain on screen announcing a shop that did not render.

### C8. D's cards on the grey ground

`.prod` `--page` on `.supblock.declared`'s `--strip`: **1.10:1** light / 1.09:1 dark. Better than
B's 1.00:1, still far under 3:1.

### C9. D's own text contrast is good

Everything the `.declare` bar and the `--strip` shelf carry passes: `.declare-line` 19.67:1 light /
17.55:1 dark (and qualifies as large text at 21px/800); `.declare-sub` 11.89 / 9.54; `.mk-name`
17.86 / 15.07; shelf body copy 9.16 / 8.10. All AAA except the `.sup-lab` eyebrow (C4).

---

## D. Shared system-level observations

**Type scale is not a scale.** 14 sizes in B, 15 in D, with 0.5px steps below 12px (7, 7.5, 8, 8.5,
9, 9.5, 10, 10.5, 11, 11.5, 12) then a jump to 20, 27, 44. D's 21px `.declare-line` sits 1px from
the existing 20px `.main-head h4`. Pack artwork runs on a separate `calc(--bw × k)` scale entirely.

**Spacing scale is 20 values in B, 21 in D.** The four candidates use `--shotpad` 12/18/19/22 and
`--bw` 64/96/104/124: four one-off pairs, no shared step.

**`.pdose` inherits a UA default margin.** It is the only `<p>` inside `.app` with no margin reset
(CSS 149), so it takes `margin-block: 1em` = 8.5px, while `.pinfo`'s flex `gap` is 3px (CSS 147).
The dose line sits 11.5px from its neighbours where every other card row sits 3px apart. Present
identically in both. 8.5px is not a designed value; it is an oversight that entered the spacing set.

**Theme differences beyond colour: none.** A full element-by-element diff of position, size,
display, visibility, opacity, font metrics, borders, padding, margin and grid across light and dark
returned **0 differences** for B (148 elements) and 0 for D (152 elements).

---

## E. Known gaps

- No real assistive-technology output. Accessible names and roles come from Chrome's accessibility
  tree via CDP, not from NVDA, JAWS or VoiceOver.
- Tab order and reflow at ≤900px were not re-verified, nor 1.4.10 reflow at 320px or 400% zoom.
- `prefers-contrast` and forced-colors were not tested; no such block exists in the stylesheet.
- Text-only zoom untested. Every size is `px`, and pack type is tied to card width, not font size.
- All destinations are `href="#"`. Actual click behaviour is unverifiable from this file, and the
  author's "click goes to" commentary was excluded from evidence by scope.
- No compressed-transfer measurement; `file://` applies no gzip, so the +842-byte D-over-B delta is
  an upper bound.
- These are mockups. The 4 `<main>` elements in one document, the `href="#"` targets and the
  non-functional consent control may be mockup artefacts rather than design decisions. Nothing in
  the file distinguishes the two, and the audit scores what is present.
- Whether the shipped implementation preserves the 0-JS property is outside what was measured.

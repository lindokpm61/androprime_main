---
name: Andro Prime, Direction F
description: A machined, instrument-like field for men's blood-test results. Recessed trays holding raised cores, a serif display over a humanist sans, and colour reserved for clinical meaning.
colors:
  ink: "#0A0B0D"
  ink-2: "#4A4F57"
  ink-3: "#6B7078"
  paper: "#FFFFFF"
  core: "#FFFFFF"
  tray: "#F1F2F4"
  sunk: "#E7E9EC"
  hair: "rgba(10, 11, 13, 0.10)"
  hair-2: "rgba(10, 11, 13, 0.16)"
  flag: "#E0A458"
  flag-f: "rgba(224, 164, 88, 0.14)"
  flag-f2: "rgba(224, 164, 88, 0.26)"
  lab: "rgba(10, 11, 13, 0.13)"
  ours: "rgba(10, 11, 13, 0.30)"
  status-optimal: "#059669"
  status-warning: "#d97706"
  status-critical: "#b91c1c"
typography:
  display:
    fontFamily: "var(--font-newsreader), Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.4rem, 5.6vw, 4.1rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "var(--font-newsreader), Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.6rem, 3.4vw, 2.5rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.018em"
  subhead:
    fontFamily: "var(--font-source-sans), -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  standfirst:
    fontFamily: "var(--font-source-sans), -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(1.05rem, 1.6vw, 1.22rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body:
    fontFamily: "var(--font-source-sans), -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.68
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-jetbrains), monospace"
    fontSize: "11.5px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.13em"
rounded:
  container: "28px"
  inset: "22px"
  pill: "999px"
  none: "0px"
spacing:
  section-gap: "130px"
  section-below: "20px"
  card: "34px 32px"
  card-sm: "26px 22px"
  gutter: "20px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
    typography: "{typography.subhead}"
  button-primary-with-pip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "14px 9px 14px 22px"
  pip:
    backgroundColor: "rgba(255, 255, 255, 0.18)"
    rounded: "{rounded.pill}"
    size: "32px"
  button-ghost:
    backgroundColor: "rgba(255, 255, 255, 0.55)"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
  button-sm:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  tray:
    backgroundColor: "{colors.tray}"
    rounded: "{rounded.container}"
    padding: "6px"
  core:
    backgroundColor: "{colors.core}"
    rounded: "{rounded.inset}"
    padding: "34px 32px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-3}"
    rounded: "{rounded.pill}"
    padding: "5px 11px"
  flagchip:
    backgroundColor: "{colors.flag}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
---

# Design System: Andro Prime, Direction F

> **This file records an INCUMBENT system. It is not the authority.**
>
> Direction F was chosen by Keith from six directions on 2026-08-27. Its authority, in order:
>
> 1. `design/mockups/directions/F-field.html` — the approved direction. Wins any disagreement.
> 2. `styles/components/f-primitives.css` — the implementation, and what ships.
> 3. `design/mockups/journey/*-F.html` — 13 per-page frames, drawn later. **Demonstrably drifted
>    from the direction twice** (section rhythm, container width) and are owed a sweep.
> 4. `12_operations/automation/reconcile-f-css.js` — diffs 2 against 3 and reports.
>
> This file exists so design tooling has product-specific ground to judge against instead of
> generic taste. **Where it disagrees with 1 or 2, it is stale and they win.** Written 2026-08-31.

## Overview

Direction F is an instrument, not a brochure. The governing idea is a **recessed tray holding a
raised core**: a soft grey well with a white card sitting inside it, concentric radii, and a single
very large, very low-opacity ambient shadow. Nothing is hard-edged, nothing is flat, and nothing
carries a drop shadow.

It reads as measurement equipment because the product is measurement. The page is mostly white and
grey; the only saturated colour in the entire system is a single amber, and it is fenced. A serif
display sits over a humanist sans, and small monospace labels mark the parts that are data.

Its own description, from the direction file: *Soft Structuralism, asymmetrical bento.* The four
places it deliberately spends its permission are radius (28px squircle with a concentric inner
core), shadow (very large, very low opacity, never hard), typeface, and ground (a soft luminance
wash rather than flat white).

**North star: it should look like something that measures you, and refuses to sell you the answer.**

## Colors

Three families, and the boundaries between them are the whole system.

**Ink, for everything that is type or a filled surface.** `ink` #0A0B0D is primary text and any
filled button. `ink-2` #4A4F57 is body copy at rest. `ink-3` #6B7078 is captions, units and
sub-labels, and the direction annotates it as *"the floor for functional text"* at 4.99:1 on paper.

**Grounds, four of them, which is the depth ladder.** `paper` #FFFFFF is the page. `tray` #F1F2F4 is
a recessed section ground. `core` #FFFFFF is a raised card sitting inside a tray. `sunk` #E7E9EC is
the deepest inset: bar tracks and wells. Hairlines `hair` and `hair-2` are ink at 10% and 16%, used
as inset rings rather than borders.

**Amber, once, and fenced.** `flag` #E0A458 is the only saturated colour in the system. It marks a
borderline or flagged state and a "most complete" chip. **Text on it is always `ink`, never white.**

🔴 **The status triad is not decoration and is fenced by rule.** `status-optimal`, `status-warning`
and `status-critical` carry clinical meaning and may appear **only** on range-bar fills and status
dots **inside a results or sample-report panel**. They never touch headings, body copy, buttons,
CTAs, backgrounds, icons or eyebrows. A coloured bar outside a results panel is a bug, not a style
choice. Red in particular is reserved for the GP-block state; decorative red anywhere near health
copy collides with that meaning and carries ASA risk.

## Typography

**A serif display over a humanist sans** (Keith's ruling, 2026-08-30). Three faces do three jobs and
they do not overlap.

- **Display, Newsreader.** All headings. Weight 500, tracking -0.02em, leading 1.1. These are
  deliberately *not* grotesque settings: -0.045em at weight 700 makes a serif look broken, and the
  values were re-judged rather than carried across from the previous system.
- **Body, Source Sans 3.** A humanist sans, chosen in a comparison where Inter, a neo-grotesque,
  lost. Body copy sits at 16px / 1.68 and a standfirst clamps between 1.05rem and 1.22rem.
- **Label, JetBrains Mono.** Section eyebrows, units, spec keys, step meta and trust lines. Uppercase
  at 11.5px with 0.13em tracking.

**Two optical corrections are load-bearing and must survive a face change.** `.f-page` carries
`font-size-adjust: 0.53` (x-height, matched to the Geist the frames were drawn in) and the eight
display rules carry `cap-height 0.71`. Every declared `font-size` still matches its frame; both
corrections self-correct when the licensed faces land.

⚠ Headings sit about 12% low on x-height and that is **intrinsic to a serif over a humanist sans**,
not a defect. Cap-height, which is what the eye reads as headline size, is correct.

⚠ Both faces are stand-ins. Newsreader stands in for a licensed serif and Source Sans 3 for the
humanist sans. `--font-serif` means Merriweather body copy in 517 places and was deliberately not
repointed.

## Layout

A single 1180px container with a 20px gutter, carried by `.f-wrap`. `.f-narrow` is 880px for
long-form.

**Section rhythm is the signature and it is token-driven.** `--f-sec-gap` is 72px on mobile and
**130px above 900px**; `--f-sec-below` is 20px. A section is a `.f-wrap.f-sec` header block followed
by a sibling `.f-wrap` of content, so the gap between two sections is paid **once**, by the next
header's top padding. This differs structurally from the direction file, which wraps a whole section
in `.sec` and therefore pays 130 twice per boundary.

**More space above a heading than below it.** 130 above, 20 below. That ratio is the rhythm.

Hero grids run `1.35fr 1fr` with a 44px gap. Card grids collapse to one column below 800px. Wide
content (comparison tables) scrolls inside its own `overflow-x: auto` wrapper; the page body never
scrolls horizontally.

## Elevation & Depth

**One elevation, in two states.** `--shadow-ambient` is `0 26px 60px -20px rgba(10,11,13,.16),
0 6px 18px -12px rgba(10,11,13,.10)`: very large, very soft, very low opacity, offset downward.
`--shadow-ambient-lift` is the same elevation raised, `0 40px 90px -24px rgba(10,11,13,.22), 0 10px
26px -14px rgba(10,11,13,.12)`, and it is used ONLY on `:hover`, by the two things the direction
lifts: a tray and a button. That is not a scale of two, it is one elevation and its hover state. **Do
not add a third.** **There is no hard drop shadow anywhere in the system and adding one is a
category error**, because flatness is exactly what this direction was chosen to escape.

**A tray rises 2px on hover and a button does not move**; the button answers with the lift and with
its arrow. Both are `prefers-reduced-motion` guarded.

**Depth is carried by ground, not by borders.** The ladder is: nothing, sunk, sunk-with-accent, core,
core-with-ring, tray, tray-with-wash, inverted. Rings are `inset 0 0 0 1px var(--hair)`, drawn inside
the shape rather than around it.

⚠ **The tray/core pair intentionally carries both an inset ring and an ambient shadow.** Generic
design guidance calls that a "ghost card" and says to declare elevation once. Here it is the
double-bezel, it is the signature of the direction, and it is approved. Do not collapse it.

## Shapes

**A 28px squircle with a concentric 22px inner core.** The direction names the radius as *"the single
largest contributor to not flat"*. The concentricity is arithmetic, not taste: 28 minus the 6px tray
padding is 22, so the inner and outer curves stay parallel.

Pills at 999px for CTAs, chips and status. Zero radius survives in exactly three places: data tables,
rule lines, and the logo mark.

⚠ Generic guidance caps card radii at 12 to 16px. **This system is 28px by ruling.** That is not
drift.

## Components

**Tray + core.** The base surface pair. A tray is `--tray` at 28px with 6px of padding and the
ambient shadow; the core is white at 22px inside it. Almost every block on a page is one of these.

**Buttons.** Pill, ink fill, white text, 14px/24px padding at 15px type, 9px gap to a trailing arrow.
A ghost variant swaps to transparent with a 1px hairline. A `sm` variant at 10px/18px and 13.5px is
for in-table and secondary actions.

**Mono label (`.f-blab`).** Uppercase JetBrains Mono at 11.5px / 0.13em, sitting above a section
heading. ⚠ It must be re-asserted at (0,2,0) as `.f-page .f-blab`, because `.f-page p` is (0,1,1) and
beats a bare class: 37 of 51 labels silently rendered in the body sans before that was found. A
larger named variant `.f-blab-lg` exists for the inverted panel's lead label.

**Sample report row.** Label, sub-label, value, status word, and a track with a filled bar. The
status word and the bar are driven from the same value so they cannot disagree. **A report-only
marker renders no bar at all**, because a coloured bar is a verdict.

**Step card.** A ghost numeral at `opacity: 0` behind a mono index, a title, body, and a meta row.
The ghost numeral reveals on hover; on touch, scroll position drives the same state.

**Comparison table.** Full-width, hairline row rules, hover tint, and a highlighted column via
`.f-col-hi` using `flag-f2`. Its content is derived from `lib/kits/panel.ts` and `lib/pricing.ts`.

**Inverted panel.** Ink ground with the whole type ramp flipped to white at graded opacities. Used
once per page at most, for a conformity statement.

**Button pip.** A 32px translucent circle around the arrow, paper at 18% on an ink button and ink at
8% on a ghost. On hover it nudges `translate3d(3px,-1px,0) scale(1.06)`. ⚠ **The arrow is the
typographic glyph `&rarr;` as text, never a drawn SVG**: it is set in the button's own face, so it
follows the type ruling instead of drifting from it. The asymmetric padding that seats the circle
against the right edge is applied through `:has(.f-pip)`, so a button with no arrow stays even.

**Bento.** The direction's asymmetrical 12-column grid, `.f-bento` with `.f-c-3` through `.f-c-12`,
collapsing to one column below 900px. This is the homepage's layout idiom; the kit pages use simpler
even grids.

**The two-range readout.** The homepage instrument and the concrete mechanic of the product's
argument: the LABORATORY reference band and OUR action band drawn on one recessed track, with the
sample value as a 3px ink marker. Bands are neutral ink at two opacities (`--lab`, `--ours`) and
never the status triad, because this is a comparison of two scales rather than a verdict. The verdict
is carried in words underneath, and a row where the two disagree puts its second word in the amber
pill. 🔴 **Every band position is arithmetic from `04_products/results-engine/thresholds.md` and the
working is written beside each row in the page source. A value moved without re-deriving its
percentage is a page that contradicts the results engine.**

**Photography.** `.f-shot`, greyscale at rest easing toward colour on tray hover, with a frosted
caption pill. Greyscale is not decoration: it stops photography competing with the single accent the
system allows.

**The hero film.** A silent, half-speed, crossfade-looped clip under a 90%-to-26% white wash, so it
reads as the ground moving rather than as a picture and the headline stays dark ink on light. 🔴 The
gate is a `media` attribute on the `<source>`, NOT `display: none` in CSS: hiding a video still
downloads and decodes it.

## Do's and Don'ts

**Do**

- Read the frame's own stylesheet and port its declarations. Self-authored CSS is the exception and
  needs a stated reason.
- Derive marker sets, prices and panel copy from `lib/kits/panel.ts` and `lib/pricing.ts`. Never
  hand-write them onto a surface.
- Keep colour inside the results panel. A grey page with one amber chip is correct.
- Probe the built page with `getComputedStyle` and selector counts. A declaration diff cannot see an
  absence, and absences are this system's most common defect.
- Check a frame's stated section count against the sections it actually draws. Two frames failed that
  checksum by one on 2026-08-31.
- **Diff for ABSENCE, not only for disagreement.** Six of the eight defects found by eye on
  2026-08-31 were declarations present in the direction and simply never carried: `overflow: hidden`
  on the card, the tray's hover lift, the button's hover lift, the button's rest shadow, the arrow
  pip, and the hero's `min-height`. The reconciler saw none of them, because its compare loop skips a
  property the app does not declare at all.
- **Verify a hover by hovering, and a video by watching the network.** Reading the CSS would have
  passed a `display: none` that still downloaded 726KB, and a `.f-btn-ghost` rule that never applied.

**Don't**

- **Don't remove the mono eyebrow above section headings.** Generic anti-slop guidance bans a kicker
  above a heading outright. This system uses one on every section, in the approved direction and all
  13 frames. It is the committed world and it overrides that ban.
- **Don't flatten the radius to 12 to 16px, and don't collapse the ring-plus-shadow double bezel.**
  Both are rulings, both are the signature, and both read as generic-guidance violations.
- Don't add a hard offset shadow, a gradient, glass, or a colour gradient of any kind.
- Don't put status colour outside a results panel, and don't put white text on the amber.
- Don't give a report-only marker a bar, or restore any framing that makes FAI a stand-in for free
  testosterone in men. That is retracted clinical copy.
- Don't invent a dispatch cutoff, testimonial, review count, customer number or press mention. None
  exist. See `PRODUCT.md`, Evidence on Hand.
- Don't use an em dash. Anywhere, in any external-facing text.
- Don't trust the journey frames over the direction. They have drifted twice already.
- **Don't write a second rule block for a selector that already has one.** `.f-btn-ghost` was
  declared twice and the older `background: transparent` sat later in the file, so it silently beat
  the frosted background at equal specificity and the button rendered fully transparent. `.f-btn` had
  the same shape and its `transition` was being overwritten. Both are now single blocks. Two blocks
  for one selector in this file should be read as a defect.
- **Don't set a container's height "later".** A container's aspect ratio is an input to
  `object-fit`, so a missing `min-height` silently re-crops the media inside it. The hero without one
  was throwing away a quarter of the film's height.

## Known gaps in this system

Recorded so they are not rediscovered as surprises.

1. 🔴 **No dark mode is implemented.** The direction and all 13 frames ship a complete,
   contrast-annotated dark palette; the app has no `prefers-color-scheme`, no `data-theme` and no
   dark token values. Blocked by the shared chrome: 25 marketing routes wear the F nav and footer and
   only 5 are Direction F, so enabling it would give 20 V2.0 pages a dark shell around light content.
   Unblocks when the F rebuild covers the marketing surface.
2. 🟠 **`.f-spec-k` fails contrast.** `--ink-3` on `--sunk` at 10px is 4.1:1 against a 4.5:1 floor, on
   12 instances. The token is correct and the pairing is wrong: the direction defines `--ink-3` as
   the functional-text floor **on paper**, not on a recessed well.
3. 🟠 **No `:focus-visible` styling exists in the F layer.** Nothing sets `outline: none`, so the
   browser default ring shows. Focus is visible but undesigned. This is now the most visible
   remaining interaction gap, since hover has been restored everywhere and focus has not.
6. 🔴 **CA-045 gates the homepage imagery and is OPEN.** Five generated photographs and the hero film
   ship in `public/home/`. Signers are Ewa and Keith. The gate's own condition is that it arms when a
   direction is built into the site, which has now happened, so it blocks the merge to `main`.
7. ⚠ **The reconciler has two structural blind spots**, both recorded in `12_operations/CONTEXT.md`:
   its `RULED` table is consulted in only one of its emit branches, and its compare loop cannot see a
   declaration one side omits entirely. Do not read a clean run as a clean layer.
4. 🟠 **`RelatedArticles` is still V2.0** and is the visible seam on every rebuilt page.
5. ⚠ **The journey frames are owed a sweep** on container width and section rhythm, both of which the
   direction wins. Recorded in the reconciler's `RULED` table meanwhile.

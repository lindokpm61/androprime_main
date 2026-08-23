# Vitall kit dieline — reference and measured coordinates

**Filed:** 2026-08-22. Source: Ben Starling, 2026-06-03, thread "Andro Prime - kit packaging
and branding (operational)" (`19e80ec01a3f40e6`), via two Google Drive links in his reply.

`vitall-2025-box-design.png` (677 x 1149 px, 414 KB) is the flat dieline artwork, filed here
because until today it existed only in `~/Downloads` with no version history, and it is the
single design input for a print run.

**The two heavy sources stay out of git for now** and remain in `~/Downloads`:
`2025 Box Design.eps` (14.5 MB) and `2025 Box Design.pdf` (59 MB).

**The `.eps` HAS been read (2026-08-22)** and the figures below are now taken from it, not from
the raster. It carries a DOS EPS binary wrapper (magic `C5 D0 D3 C6`), which is why it will not
open as text: the PostScript body starts at byte offset **119,322** and runs 14,364,796 bytes,
behind a 119 KB TIFF preview. Seek past the 30-byte header and it is ordinary PostScript.

## Provenance, from the DSC header

| | |
|---|---|
| Source document | `2025 Box Design.indd` |
| Creator | Adobe InDesign 20.5 (Macintosh) |
| Author | **laurasutton** (Laura Sutton, Vitall Head of Growth) |
| Created | **14 August 2025** |
| Colours | `DocumentProcessColors: Cyan Magenta Yellow Black`, `DocumentCustomColors:` **empty** |

## It is NOT a dieline

There are **no spot colours and no custom colours**, so there is no cut, crease or fold layer:
a real dieline carries those as a named spot. There are also no `re` rectangle operators at all
and only one page. **This file is Vitall's printed artwork, not a cutter guide.**

That matters for the open item recorded in `../../../STATE.md` as "fold coords from the
dieline": **it cannot be closed from this file.** Either ask Ben for an actual cutter guide, or
take the fold as the midpoint, which the geometry supports exactly (861.7323 / 2 = 430.87 pt =
152.00 mm, matching the stated face height to two decimal places).

## Layout, confirmed exactly

`%%HiResBoundingBox: 0 0 507.4016 861.7323` points. At 0.352778 mm/pt that is
**179.00 x 304.00 mm**, so the 179 x 152 mm face in `../../../STATE.md` is confirmed by the
source file rather than inferred, and the flat is two faces stacked with the lower rotated 180
degrees (which is why half the type reads upside down).

Raster scale for anyone working from the PNG: **3.7801 px/mm** (1149 px / 303.96 mm).

## CORRECTION 2026-08-23: it is a DIE-CUT APERTURE, not a printed white panel

Keith checked a physical kit. **The board is cut through.** Vitall's kit-details label is stuck to
the box underneath, and it shows through the hole in the sleeve. Everything below that calls this a
"white compliance window" was written before that was known, and the geometry is unaffected, but the
nature of it is not: **we are specifying a hole, and a hole needs a die.**

Three consequences.

1. **It explains why Vitall's file has no cut layer.** That file is the printed artwork. The die is a
   separate tool held by whoever kits the boxes, which is also why the area is simply left white.
2. **A cutter guide stops being optional.** It was already needed for the fold. It is now needed for
   the aperture too, and the aperture is the higher-consequence of the two.
3. **Corner radius is now a live dimension.** Measured off the raster at **~3.2 mm** (12 px on the
   left edge, 13 px on the top, at 3.7801 px/mm). Sharp internal corners tear, so a die always
   carries a radius; the true value is almost certainly a round **3.0 or 3.5 mm**. Confirm it.
4. **Matching the existing die exactly is what avoids tooling cost.** A die already exists, because
   the sleeve Keith received was cut with one. Any change to size, position or radius is a new tool.

## The aperture, from the vector

A clean 5-point closed rectangle at **x 96.63 to 402.77 pt, y 135.35 to 296.93 pt**, appearing
three times in the content stream. In millimetres:

| | Exact | Notes |
|---|---|---|
| Width | **108.00 mm** | 60.3% of the 179 mm face width |
| Height | **57.00 mm** | 37.5% of the 152 mm face height |
| Left margin | **34.09 mm** | |
| Right margin | **36.91 mm** | **Not horizontally centred: 2.8 mm asymmetric, sitting left of centre** |
| Vertical | centred on its face to within 0.25 mm | ~47.5 mm clear above and below |
| Area | **6,156 mm²** | **22.7% of the panel** |

108.00 x 57.00 are round numbers, which is what you would expect of a designed frame and is a
good check that the parse is right. The earlier raster measurement (107.88 x 56.88 at 34.11 mm)
was accurate to 0.12 mm, so nothing laid out against it is wrong, but use these.

**Which face: SETTLED 2026-08-23 (Keith). Only the BACK face carries a window; the front is
clear.** The identically sized rectangle found on the other face of Vitall's artwork is their
lifestyle photo frame reusing the same dimensions, which is why it is not rendered white in the
raster. Not a second compliance panel. This closes the question and means a hero front can be
designed without reserving anything.

## This corrects the placeholder in `../concept-sleeve-v5.html`

That file reserves a window at `x=196 y=112 w=324 h=206` on a 716 x 608 viewBox (exactly
4 px/mm), and its own notes flag the rectangle as approximate and still to be lifted from the
dieline. Lifted:

| | Concept v5 | Artwork file | Delta |
|---|---|---|---|
| Width | 81.0 mm | **108.00 mm** | **27.0 mm wider** |
| Height | 51.5 mm | **57.00 mm** | 5.5 mm taller |
| Left margin | 49.0 mm | **34.09 mm** | 14.9 mm further left |
| Vertical placement | 28.0 mm from top | **centred, ~47.5 mm clear** | **~19.5 mm lower** |

The real window is **47% larger in area** and sits noticeably lower and further left. Any
artwork laid out against the v5 placeholder needs re-checking, because a 26.8 mm width increase
is well past what a nudge absorbs.

## Two things to confirm with Ben before print

1. ~~Which face the window lands on~~ **CLOSED 2026-08-23: back face only** (Keith). No longer
   an ask.
2. **A real cutter guide.** This file has no cut or fold layer (see above), so the fold has to
   be assumed at the 152.00 mm midpoint. That is almost certainly right and it is still an
   assumption.

## What their artwork carries, and why the sleeve matters more than branding

Two direct customer-capture routes are printed on this box:

- a **QR code** captioned "Scan here for step-by-step support", sitting immediately below the
  white window
- a footer line reading **"Visit Vitall.co.uk for orders, results, and help"**

On 2026-08-21 Ben switched off every Vitall-side transactional email, and the synthetic patient
address makes their account creation moot (`../../../../05_partners/labs/vitall/CONTEXT.md`).
**The printed box is the remaining channel, and it cannot be switched off remotely.** Our sleeve
covering it is the physical half of that same control, not a branding nicety. Worth carrying
into the first-run scope decision, because it means the sleeve is doing compliance work.

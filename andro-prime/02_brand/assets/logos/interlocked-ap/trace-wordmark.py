#!/usr/bin/env python3
"""
Andro Prime - vectorise the ANDRO PRIME wordmark from the approved raster.

    python trace-wordmark.py

WHY THIS EXISTS. Keith's decision, 2026-09-02: the lockup stays as approved rather than being reset
in any of the candidate faces. The wordmark on `SOURCE-approved-2026-08-30.png` is therefore the
artwork, and it is not a typeface. Measured against the three candidates with tracking tuned so the
total advance matches, the closest disagrees on 74% of ink, so there is no font to set it in and no
font to outline. It has to be traced.

THE RESOLUTION PROBLEM, AND WHAT IS DONE ABOUT IT. The wordmark exists once, at a cap height of 120
pixels, inside a 2048px sheet. Tracing a 120px bitmap directly gives visibly faceted curves once the
logo is set larger than it was drawn. But the source is ANTI-ALIASED, and the grey values along
every edge encode where that edge really falls to a fraction of a pixel. So the region is upscaled
with a Lanczos filter FIRST and thresholded after, which recovers that sub-pixel edge position
rather than inventing detail: it is the same reasoning `build-icons.js` uses in reverse when it
thresholds before downsampling. Traced at 8x, the contour follows the edge the anti-aliasing implies
rather than the staircase of the pixel grid.

Output is JSON on stdout in the same contract as `outline-wordmark.py`, so the two are
interchangeable to the caller: cap height = 1000, baseline y = 0, y increasing downward, and the
path already placed by --post-scale/--dx/--dy.
"""
import argparse
import json
import sys

import numpy as np
import potrace
from PIL import Image

# The wordmark's own bounds on the approved sheet, measured, excluding the small mark to its left.
SHEET = "SOURCE-approved-2026-08-30.png"
BOX = (486, 1696, 1918, 1816)   # left, top, right, bottom (PIL box, right/bottom exclusive)
UPSCALE = 8


def load_mask(path, box, upscale):
    """Greyscale crop -> upscaled -> thresholded boolean array, True where there is ink."""
    im = Image.open(path).convert("L").crop(box)
    w, h = im.size
    im = im.resize((w * upscale, h * upscale), Image.LANCZOS)
    a = np.asarray(im)
    return a < 128


def trim(mask):
    """Crop to the ink's own bounding box, so cap height is exactly the array height."""
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)
    y0, y1 = np.where(rows)[0][[0, -1]]
    x0, x1 = np.where(cols)[0][[0, -1]]
    return mask[y0:y1 + 1, x0:x1 + 1]


def pt(p):
    return (p.x, p.y) if hasattr(p, "x") else (p[0], p[1])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--post-scale", type=float, default=1.0)
    ap.add_argument("--dx", type=float, default=0.0)
    ap.add_argument("--dy", type=float, default=0.0)
    ap.add_argument("--alphamax", type=float, default=1.0,
                    help="potrace corner threshold; 0 keeps every corner sharp, 1.34 is maximally smooth")
    ap.add_argument("--opttolerance", type=float, default=0.2)
    ap.add_argument("--svg", help="also write a standalone SVG here, for eyeballing")
    args = ap.parse_args()

    mask = trim(load_mask(SHEET, BOX, UPSCALE))
    h, w = mask.shape

    # potrace.Bitmap's constructor calls invert() on whatever it is handed: it expects "True means
    # LIGHT", because it is built for greyscale where high values are white. Passing the ink mask
    # directly makes it trace the BACKGROUND, which comes back as a near-perfect inverse and scores
    # 0.57% agreement against the source. Hand it the complement.
    bmp = potrace.Bitmap(~mask)
    path = bmp.trace(turdsize=4 * UPSCALE, alphamax=args.alphamax,
                     opticurve=True, opttolerance=args.opttolerance)

    # Cap height (the array's height, since the text is all caps) maps to 1000, baseline at y = 0.
    s = (1000.0 / h) * args.post_scale
    ox = args.dx
    oy = args.dy - 1000.0 * args.post_scale   # top of caps sits 1000 above the baseline

    def X(v):
        return v * s + ox

    # potrace returns coordinates in the array's own index space, y increasing downward with the
    # rows, verified by comparing the traced extents against the array's shape. No flip is needed;
    # an earlier one was added on a misread of the render and made things worse.
    def Y(v):
        return v * s + oy

    parts = []
    for curve in path:
        sx, sy = pt(curve.start_point)
        d = [f"M{X(sx):.2f} {Y(sy):.2f}"]
        for seg in curve:
            ex, ey = pt(seg.end_point)
            if seg.is_corner:
                cx, cy = pt(seg.c)
                d.append(f"L{X(cx):.2f} {Y(cy):.2f}L{X(ex):.2f} {Y(ey):.2f}")
            else:
                c1x, c1y = pt(seg.c1)
                c2x, c2y = pt(seg.c2)
                d.append(f"C{X(c1x):.2f} {Y(c1y):.2f} {X(c2x):.2f} {Y(c2y):.2f} {X(ex):.2f} {Y(ey):.2f}")
        d.append("Z")
        parts.append("".join(d))

    advance = (w / h) * 1000.0
    out = {
        "source": f"{SHEET} {BOX}, upscaled x{UPSCALE} before threshold",
        "text": "ANDRO PRIME",
        "traced": True,
        "contours": len(parts),
        "capHeightPx": h // UPSCALE,
        "advance": advance,
        "advanceFinal": advance * args.post_scale,
        "path": " ".join(parts),
    }

    if args.svg:
        with open(args.svg, "w", encoding="utf-8") as f:
            f.write(
                f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -1000 {advance:.2f} 1000" '
                f'width="{advance:.2f}" height="1000">\n'
                f'  <path d="{out["path"]}" fill="#000000" fill-rule="evenodd"/>\n</svg>\n'
            )
        print(f"wrote {args.svg}", file=sys.stderr)

    print(json.dumps(out))


if __name__ == "__main__":
    main()

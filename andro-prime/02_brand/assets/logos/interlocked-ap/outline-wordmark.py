#!/usr/bin/env python3
"""
Andro Prime - outline a wordmark to SVG path data.

    python outline-wordmark.py --font fonts/ArchivoBlack-Regular.ttf --text "ANDRO PRIME"

WHY THIS EXISTS. Every master in ../refined-monogram/ is outlined vector paths, specifically so the
logo renders identically without the font installed: print, partner decks, email, third-party use.
The replacement has to meet the same bar, so the wordmark is cut to paths here rather than set as
<text>. This is the half of the old gen-component.js that WAS reusable in principle; the mark half
is not, because the Interlocked AP is a custom glyph in no typeface.

Shaping goes through HarfBuzz, not a naive advance-width loop, so real kerning is applied. "AN",
"RO" and "PR" all kern in these faces and a loop would set them loose.

Output is JSON on stdout: the path data, the advance width, and the cap height. By default the
coordinate space has cap height = 1000, baseline at y = 0, y increasing DOWNWARD (SVG convention).

THE FINAL PLACEMENT IS APPLIED HERE, NOT BY THE CALLER, via --post-scale/--dx/--dy. That is not
tidiness: SVGPathPen emits H and V shorthand and implicit linetos after a moveto, so a path is NOT
a flat list of coordinate pairs. A caller that rescales it by pattern-matching pairs of numbers
pairs an H's single x with the next command's y, and the wordmark renders as a black smear. Ask the
caller for the transform instead, and the path leaves here already in its final place, untouched.
"""
import argparse
import json
import sys

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform
import uharfbuzz as hb


def load(path, weight):
    """Return (TTFont, bytes) with a variable font pinned at `weight`."""
    font = TTFont(path)
    data = open(path, "rb").read()
    if "fvar" in font and weight is not None:
        axes = {a.axisTag: a for a in font["fvar"].axes}
        if "wght" in axes:
            ax = axes["wght"]
            w = max(ax.minValue, min(ax.maxValue, weight))
            if w != weight:
                print(f"note: wght {weight} clamped to {w} for {path}", file=sys.stderr)
            font = instancer.instantiateVariableFont(font, {"wght": w}, inplace=False)
            from io import BytesIO
            buf = BytesIO()
            font.save(buf)
            data = buf.getvalue()
            font = TTFont(BytesIO(data))
    return font, data


def cap_height(font):
    """Cap height in font units, measured off 'H' if the OS/2 field is absent or zero."""
    os2 = font.get("OS/2")
    if os2 is not None and getattr(os2, "sCapHeight", 0):
        return os2.sCapHeight
    glyphs = font.getGlyphSet()
    name = font.getBestCmap().get(ord("H"))
    if name is None:
        raise SystemExit("no 'H' glyph and no sCapHeight: cannot establish cap height")
    from fontTools.pens.boundsPen import BoundsPen
    bp = BoundsPen(glyphs)
    glyphs[name].draw(bp)
    return bp.bounds[3]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--font", required=True)
    ap.add_argument("--text", required=True)
    ap.add_argument("--weight", type=float, default=900.0)
    ap.add_argument("--tracking", type=float, default=0.0,
                    help="letter-spacing in 1/1000 of cap height, applied after shaping")
    ap.add_argument("--post-scale", type=float, default=1.0,
                    help="uniform scale applied after cap normalisation, so the caller's units win")
    ap.add_argument("--dx", type=float, default=0.0, help="x translation, in post-scale units")
    ap.add_argument("--dy", type=float, default=0.0, help="y translation, in post-scale units (baseline)")
    args = ap.parse_args()

    font, data = load(args.font, args.weight)
    upem = font["head"].unitsPerEm
    cap = cap_height(font)
    glyph_set = font.getGlyphSet()
    order = font.getGlyphOrder()

    face = hb.Face(data)
    hb_font = hb.Font(face)
    buf = hb.Buffer()
    buf.add_str(args.text)
    buf.guess_segment_properties()
    hb.shape(hb_font, buf, {"kern": True, "liga": False})

    # Cap height = 1000 first, then the caller's own placement, folded into one transform so the
    # path is emitted already positioned and nothing downstream has to parse it.
    scale = (1000.0 / cap) * args.post_scale
    track = args.tracking * (cap / 1000.0)  # tracking arrives in cap-height units

    parts = []
    x = 0.0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = order[info.codepoint]
        pen = SVGPathPen(glyph_set, ntos=lambda v: f"{v:.2f}")
        # Flip Y (font units go up, SVG goes down) and scale to cap-height space.
        t = Transform(scale, 0, 0, -scale,
                      (x + pos.x_offset) * scale + args.dx,
                      -pos.y_offset * scale + args.dy)
        glyph_set[name].draw(TransformPen(pen, t))
        d = pen.getCommands()
        if d:
            parts.append(d)
        x += pos.x_advance + track

    print(json.dumps({
        "font": args.font,
        "weight": args.weight,
        "text": args.text,
        "upem": upem,
        "capHeight": cap,
        "advance": x * (1000.0 / cap),   # total width with cap height = 1000, before --post-scale
        "advanceFinal": x * scale,        # total width in the caller's own units
        "path": " ".join(parts),
    }))


if __name__ == "__main__":
    main()

# Interlocked AP — the approved logo direction

**Status:** 🟢 **DIRECTION APPROVED (Keith, 2026-08-30).** 🟢 **THE MARK IS DRAWN AS VECTOR
(2026-09-02), verified against the approved raster at 99.53% pixel agreement.** 🟡 **The LOCKUP is
cut and waiting on one decision: which grotesque the wordmark is set in.** See "The vector build"
below.
**Supersedes:** Refined Monogram (`../refined-monogram/`, chosen 2026-06-12), which stays on disk and
**stays live on every surface except the icon set**, which migrated 2026-08-30. See the table below.
**Source of truth for the rules:** `../../../visual-identity.md`.

## What Keith approved

The **Interlocked AP**: the A and the P cut as a single geometric glyph sharing one vertical stem,
with **no enclosing square and no container of any kind**, plus the horizontal lockup of that mark to
the left of **ANDRO PRIME** in a heavy grotesque sans, uppercase.

Approved from `SOURCE-approved-2026-08-30.png`, which is the generated reference showing both the
standalone mark and the lockup. `SOURCE-mark-only.png` is the mark cropped to its own bounds and
squared, which is what the 16px check was run against.

## 🔴 These are reference rasters, not assets

`SOURCE-*.png` are **PNG output from a generative model** (Higgsfield `gpt_image_2`, 2026-08-30). They
are what the approval was given against. **They are not shippable and must not be placed on any
surface.**

🔴 **AND `SOURCE-mark-only.png` IS CLIPPED. The approved artwork is `SOURCE-approved-2026-08-30.png`,
confirmed by Keith 2026-09-02.** The sentence below calling the mark-only file "cropped to its own
bounds" is wrong and is left in place so the error is legible: it has **60px cut off the foot of the
stem**. Measured against the big mark on the approved sheet, every other landmark is identical to the
pixel (stem x 627..835, counter bottom y 613, diagonal baseline y 985, bowl height 614) and only the
stem's foot differs, **1196 against 1136**. On a mark whose whole idea is a P stem dropping past the
bowl, a 5% short descender is a proportion rather than a rounding error.

**Consequences, both live:** `build-icons.js` sources the clipped file, so **the favicon, app icon,
apple-touch and PWA icons on `main` all carry the short stem**, and so did the 16px gate that chose
this concept over the other five. `gen-logo.js` reads the sheet instead, and `--verify` diffs against
the sheet, so the vector master is correct. **Re-cutting the icon set from `icon.svg` is the obvious
follow-on and has not been done**: it changes assets that are already live. Every master in `../refined-monogram/` is **outlined vector paths**, specifically so the
logo renders identically without Inter installed (print, partner decks, email, third-party use), and
the replacement has to meet the same bar.

**What was owed, and where it stands (2026-09-02):**

| File owed | Mirrors | Status |
|---|---|---|
| `icon.svg` (standalone mark) | `../refined-monogram/icon.svg` | 🟢 **DRAWN AND VERIFIED.** In this folder. No container, `fill="currentColor"`, 767 bytes |
| `lockup-light.svg` / `lockup-dark.svg` | `../refined-monogram/lockup-*.svg` | 🟡 **CUT, IN `out/`, HELD.** Waiting on the wordmark face; re-run with `--face` once it is chosen |
| `Logo.tsx` regenerated from the outlined paths | `09_website-app/frontend/components/shared/Logo.tsx` | 🔴 **NOT INSTALLED.** `out/logoArt.data.json` carries the path data; installing it is the same decision as the lockup |

**Light and dark are ONE artwork** (Keith, 2026-09-02): a single set of paths, `currentColor` on the
icon, and `lockup-light.svg` / `lockup-dark.svg` emitted as the same geometry with the ink flipped,
so the two cannot drift apart. That is the failure the Refined Monogram had and the reason its
successor sat half-installed for three days.

✅ **The icon set is DONE and is the exception** (2026-08-30): `favicon.ico` (16/32/48), `icon.png`
512, `apple-icon.png` 180 and the PWA 192/512 all ship the Interlocked AP, built by `build-icons.js`
in this folder. **It could go ahead of the vector because it is the one surface a raster source does
not compromise** — every output is a fixed-size raster, and the vector requirement exists for print
and font-independence. ⚠️ **This puts the site in a deliberate mixed state**: new mark in the browser
tab, old mark in the page header, until `Logo.tsx` moves.

The **old** regeneration procedure in `../../../visual-identity.md` does not transfer: it outlines
Inter Black glyphs to paths, and this mark is a **custom-drawn interlock in no typeface**, so there is
nothing to outline. `build-icons.js` replaces it for the icon set. Everything else waits on the mark
being drawn as vector by hand.

## The vector build

`gen-logo.js` is the generator. It replaces `gen-component.js`, which `logoArt.ts` still names in its
header and which is **not in the repo** and was never recovered. That absence is why the site sat in
a mixed state: there was no route from an approved mark to a shipped component.

```
bash fetch-fonts.sh                   # the candidate faces, OFL, gitignored
python -m pip install fonttools uharfbuzz

node measure-source.js                # re-derive the geometry from the approved raster
node fit-bowl.js                      # re-derive the bowl's construction
node gen-logo.js --face archivo       # masters into ./out
node gen-logo.js --verify             # pixel-diff the redraw against the approved raster
node gen-logo.js --compare            # the three-face sheet, out/face-compare.png
```

**Every constant in the generator is measured, not eyeballed**, and the two measuring scripts are
kept so the numbers can be re-derived rather than trusted.

**The bowl is a stadium.** Straight top and bottom off the stem, then a true semicircle whose radius
is exactly half the bowl's height, drawn with SVG arcs so it is exact at any size. This is the one
thing worth carrying forward if the mark is ever redrawn again: a superellipse *appeared* to fit it
at an rms of 8.9px on a 1392px glyph, and was wrong by 184px at the top of the bowl, because a
superellipse has poles and the real shape has a flat top. The average hid it and the render did not.

**The mark carries more weight than the reference**, which is what the note further down this file
asks for. The reference's strokes are uneven (stem 209, diagonal 200, bowl waist 181, bowl top and
bottom 174, crossbar 171, in source px), and the bowl, the largest shape on the mark, has the
lightest strokes, so the whole thing reads light. The redraw resolves this to one vertical weight
(224) and one horizontal weight (193, at 86% of the vertical, the normal optical correction) and
adds **7.2% ink** overall. The outer silhouette is untouched: all weight is added inwards, so it is
the same mark.

🔴 **THE ONE OPEN DECISION: which grotesque.** The approved spec says the wordmark is "a heavy
grotesque sans", and the site's body sans is **Source Sans 3, which is humanist, not grotesque**, so
the cheapest option quietly departs from what was approved. `out/face-compare.png` sets the same
lockup three ways at 52px, 22px and 14px:

| Face | Licence | Advance per cap | Note |
|---|---|---|---|
| **Archivo Black** | OFL, free | 11.44 | A true neo-grotesque. Closest to the approved render, which measured **11.93** |
| **Figtree Black** | OFL, free | 9.96 | Geometric, more modern, narrower |
| **Source Sans 3 Black** | OFL, free, already loaded | 9.55 | The body sans. Humanist, so it reads warmer and less like the reference |

Two sheets are kept for the decision, and they answer different questions.
**`variants-compare-2026-09-02.png` is the one to look at**: the approved sheet's own composition,
big mark above lockup, redrawn as vector once per face and set beside the original raster, so the
comparison has a control. `face-compare-2026-09-02.png` is the legibility ladder, the same lockups
at 52px, 22px and 14px. Regenerate either with `--variants` or `--compare`.

**Effra Heavy is the fourth answer and is not testable yet**: the licence is only part-verified
(`../../../STATE.md`, 2026-08-31) and the file is not on disk. If Effra is bought, re-run with a
fourth entry in `FACES` rather than redrawing anything.

**The 25mm packaging gate is still unrun.** The 16px gate passed, on the raster and now on the
vector, but Vitall's sleeve print is the second gate and the vector is what unblocks running it.

## What this direction settles, and what it does not

✅ **It closes the rounding question.** `2026-08-29-direction-f-supersedes-v2-non-negotiables.md` §5
held open whether Direction F may round the AP square 9px / 7px, against an explicit prohibition in
`visual-identity.md`. **The Interlocked AP has no square**, so there is no container to round and the
prohibition has nothing left to apply to. The question is closed by removal, not by a ruling on it.

✅ **It decouples the mark from the site typeface.** The Refined Monogram's glyphs are **Inter Black
outlined to paths**, which tied the mark to the typeface decision. A custom-drawn interlock is not any
typeface, so the mark was never gated on it. (That decision has since been made anyway: a serif
headline over a humanist sans, Keith 2026-08-30, `09_website-app/STATE.md` item 1. Neither Inter nor
Geist was ever a brand choice; both were defaults.)
>
> ✅ **ANSWERED 2026-08-30 (Keith): the wordmark stays a HEAVY GROTESQUE, uppercase.** The typeface was
> ruled the same day (a serif headline over a humanist sans, `../../../STATE.md`), which made this
> question answerable, and it was put to him as a three-way render against this mark at 52px, 22px and
> 14px, each lockup also shown above a real serif headline. He took the grotesque. **The lockup spec
> above is therefore confirmed, not changed.** The remaining detail is which grotesque: cheapest is the
> body sans at its heaviest weight rather than a third family. **So neither half of the lockup is
> blocked on typography any more; both are blocked on the mark being drawn as vector.**

🔴 **It has not been tested at 25mm.** The 16px check passed (`size-ladder-2026-08-30.png`) but ran
on the raster, and the mark was the lightest of the **four** that held. **Weight is the thing to
watch when it is redrawn**: it needs more than the reference shows before it is safe on a busy tab
strip, and 25mm on packaging is the second gate, still unrun, while the sleeve artwork is near a
print decision.

🔴 **Colour variants, clear space and minimum size are not yet restated for this mark.** The
Refined Monogram's rules assumed a filled square, and several do not transfer: "clear space = the
height of the A" was measured off a container that no longer exists, and the **outlined large-format
packaging variant has no meaning for a mark that is already an open glyph**. See `visual-identity.md`.

---

## How it was chosen, and what was deleted

Six concepts were generated on 2026-08-30 (Higgsfield `gpt_image_2`, 1:1, 2k, quality `high`, 51
credits), briefed against ruling A2 and Keith's same-day correction of the register to "health
reporting". `size-ladder-2026-08-30.png` is the check that decided it: every mark cropped to its own
bounds, padded to the square box a favicon actually gets, rendered at **96 / 48 / 32 / 16 px**.

| # | Concept | Outcome |
|---|---|---|
| **1** | **Interlocked AP** — one glyph, shared stem, no container | 🟢 **APPROVED (Keith, 2026-08-30)** |
| 2 | Masthead rule — heavy bar broken by a gap with AP set in | ❌ failed the 16px gate: **7.26:1**, so a square favicon reduces it to a 2px smear. Also reads as a redaction bar, and "AP" in a black bar is Associated Press |
| 3 | Index stack — four graded rules, one heavy | ❌ failed: blurs at 16px, and reads as the text-align-centre icon at every size above it |
| 4 | Punched A — solid square, A and circle knocked out | held at 16px, not chosen |
| 5 | Record spread — A formed between two pages | held at 16px, not chosen |
| 6 | Architectural P — circular bowl, A implied | held, but reads P only |

**Concept 1 was the lightest of the four that survived 16px.** That is the note to carry into the
drawing: it needs more weight than the reference shows before it is safe on a busy tab strip.

🔴 **The five unchosen concepts were DELETED at Keith's instruction on 2026-08-30**, along with the
exploration folder, so that only the approved mark is on disk. They were untracked and are **not
recoverable from git**. The table above and `size-ladder-2026-08-30.png` are the whole surviving
record of what was considered. **Round 1 (2026-08-29) was left in place** at
`../explorations-2026-08-29/`, because it is a different day's work and `../../STATE.md` cites it.

**Not tried, and still the obvious next call if this ever needs revisiting:** `openai_hazel`, the
catalogue's other OpenAI image model and the only other one tagged for logos, and `recraft_v4_1` with
`model_type: vector` for genuine vector output. Note that **"GPT Image 2.5" does not exist** in the
Higgsfield catalogue, verified 2026-08-30; re-query `models_explore` rather than trusting this line.

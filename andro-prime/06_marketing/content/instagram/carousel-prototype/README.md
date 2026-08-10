# Instagram carousel prototype: "14 signs of low vitamin D"

Working prototype for the daily Instagram carousel on `keith.antony.ai`. **Prototyped, not adopted.
Nothing here has shipped and no copy has been through `/compliance-preflight`.**

Open `review.html` in a browser. It is the review artefact: current cover, the six base photos, the
three shortlisted animated covers, and a record of what was superseded and why.

Moved into the repo 2026-08-10 from a session scratchpad, where it was the only record of the
base-photo change and the mask position and would have been lost on cleanup.

## What is here

| File | What it is |
| --- | --- |
| `review.html` | The review page. Start here. |
| `base-1..6.jpg` | The six approved base photos, 1122x1402, greyscale, band baked in. |
| `cover-current-b2.jpg` | The selected cover: base-2 with the eyes opened. |
| `eyes-before-after.jpg` | The eye fix, native resolution, same crop box. |
| `cover-final-lookup.mp4` | Shortlisted animation 1. Replicate, Kling v2.1. |
| `cover-final-hf-sip.mp4` | Shortlisted animation 2. Higgsfield, Kling 3.0. |
| `cover-final-hf-lookup.mp4` | Shortlisted animation 3. Higgsfield, Kling 3.0. |
| `png/slide-02..08.png` | Body slides, rendered deterministically from brand tokens. |
| everything else | Superseded stills, kept for the decision record. |

Images were re-encoded on the way in: 44 MB of PNG masters became 9.8 MB of JPEG. The type-heavy body
slides stayed PNG because JPEG rings on flat-background type. The three shortlisted videos are
verbatim; the two superseded ones were downscaled.

## Regenerating

```sh
node build.js     # copy + brand tokens -> slides/*.html
node render.js    # slides/*.html -> png/*.png via headless Chrome (1080x1350)
node render.js slide-03   # just one
```

Render online: the slides pull Inter, Merriweather and JetBrains Mono from Google Fonts, and the
fallback face changes the type metrics. Set `CHROME_PATH` if Chrome is not in a standard location.

**`render.js` skips slide 01 by design.** The cover template overlays the headline on a text-free
photo (direction A). The live cover is direction B: the headline is printed inside the photograph and
the band is already baked in, so template-rendering it stacks the headline twice. Under direction B
the cover is the photo itself rescaled to 1080x1350, at `png/slide-01.jpg`.

`cover.js`, `inpaint.js` and `video.js` call Replicate and read `REPLICATE_API_TOKEN` via
`replicate-token.js`, which resolves the repo-root `.env` relative to the checkout. They previously
hardcoded an absolute path that only worked on one machine.

Regenerated slides match the committed originals at 0.996 to 0.998 SSIM; the remainder is font
antialiasing, not content.

> **`build.js` arrived corrupted and was repaired.** Its curly apostrophes and em dashes had been
> double-encoded (`’` stored as `â€™`), plus a stray BOM, so a rebuild produced "Signs arenâ€™t
> diagnoses." on slide 02. The committed PNGs predate the corruption, which is why the damage was
> invisible until the pipeline was actually run. Fixed 2026-08-10. If you edit this file, check it
> stays UTF-8 without a BOM.

## The two things that decide whether this becomes a channel

1. **The headline swap is unsolved.** The cover has its headline printed into the photograph, so 30
   posts needs 30 swaps. That needs masked inpainting, which keeps every pixel outside the headline
   box identical and is what holds the character steady across a grid. The existing `mask.png` was
   drawn against a superseded base at 1086x1448 and **does not apply to the current cover**; it has to
   be re-authored. Route is Replicate (Ideogram v3, about £0.07 a call). **Higgsfield cannot do this
   at all**: no model in its catalogue accepts a mask input, so every edit re-renders the whole frame
   and the subject drifts.

2. **Metricool may not be able to schedule an Instagram carousel through its API.** Untested, and
   upstream of everything here. One real post answers it.

## Higgsfield findings (2026-08-10)

- No masked inpainting anywhere in the catalogue. This is the blocker above.
- Kling 3.0 has **no `negative_prompt`**. The Replicate call relied on one to stop the printed headline
  warping. Without it, low-motion scenes hold and high-motion scenes do not.
- The pro plan's **unlimited allowance does not apply over MCP** (`unlim.available: false`).
  Generations spend credits: 2 to 7 per image, 5 to 7.5 per video.
- It returns the requested aspect ratio **exactly**, stretching to reach it. Record the source
  dimensions before the call and rescale on return, or faces come back subtly widened.

## Known defects to fix before this ships

- The brand band is baked at a different height in every base, 195px on base-5 to 263px on base-1.
  It should be composited at a fixed height from the template.
- Source material is the binding constraint, not production: of 18 published articles only about 12
  map to a live kit marker, so 30 daily posts means re-cutting roughly 12 topics two or three ways.

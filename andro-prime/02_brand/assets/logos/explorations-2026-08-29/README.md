# Logo explorations, 2026-08-29

**Status:** 🔴 **EXPLORATION ONLY. Not assets, not approved, not for use anywhere.**
**Owner:** Keith Antony
**Why these exist:** Direction F rounds the AP mark (9px footer, 7px nav), which contradicts an explicit
prohibition in `visual-identity.md` ("do not... round the square's corners") and in `brand-guidelines.md`
§2. Rather than rule on rounding the existing square, Keith asked for alternative marks to review.
Related: `../../2026-08-29-direction-f-supersedes-v2-non-negotiables.md` §5, which is the open item.

---

## What was generated

| File | Concept | Territory |
|---|---|---|
| `concept-1-prime-notation.png` | **A′**: heavy geometric A with a mathematical prime tick | notational / data |
| `concept-2-aperture-dial.png` | **Aperture**: keyline ring with a gap and a solid square seated on the path | geometric / diagrammatic |
| `concept-3-masthead-a.png` | **Masthead A**: high-contrast Didone serif A, crossbar extended as a rule | editorial / print |

Each image shows the standalone mark large, with the horizontal lockup beneath it.

## How they were made

- **Tool:** Higgsfield MCP, `generate_image_batch`.
- **Model:** `gpt_image_2` (OpenAI GPT Image 2), 1:1, 2k, quality `high`. **Keith asked for "GPT Image
  2.5"; there is no such model in the Higgsfield catalogue.** The nearest OpenAI image model is GPT
  Image 2, which is what ran. (`cinematic_studio_2_5` is "Cinema Studio Image 2.5" but is a cinematic
  stills model, not a logo or typography model, and is not GPT.)
- **Cost:** 8.5 credits per image, 25.5 total.
- **Brief fed to the model:** the full current-logo spec from `visual-identity.md` (solid square, AP
  monogram reversed out, Inter Black, black and white only, no rounded corners), plus the brand
  identity from `brand-guidelines.md` §1 (light, direct, editorial; quality British print publication
  meets precise health reporting (register corrected from "medical" by Keith, 2026-08-30); explicitly not wellness, not supplement shop, not sterile clinic,
  not dark cockpit tech), plus the ICP (British men 38 to 54, GP said normal, respond to authority not
  atmosphere, presbyopia demographic), plus the constraints (must read at 16px favicon and 25mm on
  packaging, must work standing alone without the wordmark).
- **Deliberately avoided:** the two directions already explored and rejected on 2026-06-12,
  **Threshold Cell** (a horizontal rule splitting the square, A above and P below) and **Mono Bracket**
  (`[AP]` in JetBrains Mono). See `../logo-preview.html`.

## What these are NOT

**They are raster PNGs from a generative model.** A shippable mark has to be redrawn as vector with
optical correction, and every master in `../refined-monogram/` is outlined vector paths precisely so the
logo renders identically without Inter installed. Treat these as **direction**, not artwork.

**None has been tested at size.** The 16px favicon and 25mm packaging cases are hard requirements in
`visual-identity.md`, and concepts 2 and 3 both carry fine strokes that will thin out, which is the
same failure mode that doc already records for the outlined packaging variant. A size ladder
(96 / 48 / 32 / 16 px) is the next check before any of these is taken seriously.

**Recommended tool for a next round:** `recraft_v4_1` with `model_type: vector`, which is built for
logos and icons and emits SVG-like vector output rather than pixels.

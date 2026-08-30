# Visual Identity — Logo & Identity Assets

**Owner:** Keith Antony · **Status:** Active · **Last updated:** 2026-08-30

> 🟢 **THE LOGO DIRECTION CHANGED ON 2026-08-30. Keith approved the "Interlocked AP".** The A and the
> P cut as a single geometric glyph sharing one stem, **with no container**, replacing the Refined
> Monogram's filled square. Reference and full detail: `assets/logos/interlocked-ap/README.md`.
>
> 🔴 **THE APPROVAL IS OF THE DIRECTION, AND THE VECTOR ARTWORK STILL DOES NOT EXIST.** What was
> approved is a raster PNG from a generative model, where every shipped master is outlined vector
> paths. **Do not treat any section of this document as void on the strength of the approval alone**
> — each carries a dated note where the new direction changes it.
>
> ⚠️ **THE SITE IS NOW IN A MIXED STATE, DELIBERATELY (2026-08-30).** The **icon set has migrated**
> and the **lockup has not**:
>
> | Surface | Carries |
> |---|---|
> | `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`, `public/icon-192.png`, `public/icon-512.png` | 🟢 **Interlocked AP** |
> | `components/shared/Logo.tsx` (nav, footer, activate header) | 🔴 still Refined Monogram |
> | OG cards, packaging sleeve renders, social profiles | 🔴 still Refined Monogram |
>
> So a page currently shows the **new mark in the browser tab and the old mark in its own header.**
> That is expected, not a defect, and it is not deployed: it is on `redesign/direction-f`, and a push
> to `main` is what deploys. **The icon set could move first because it is the one surface where a
> raster source costs nothing** — every output is a fixed-size raster, and the vector requirement
> exists for print and font-independence. The lockup cannot follow until the mark is drawn as vector,
> and its wordmark also waits on the Inter-to-Geist ruling.
>
> ✅ **One thing the approval settles immediately:** the mark has no square, so the rounding question
> held open in `2026-08-29-direction-f-supersedes-v2-non-negotiables.md` §5 is closed by removal.

## Purpose & scope

This document is the source of truth for the **Andro Prime logo and core identity assets**: the mark, its variants, the master files, the favicon/app-icon set, and usage rules.

It deliberately does **not** restate the full design system. Colour, typography, buttons, cards, layout, components, photography, and tone live in [brand-guidelines.md](brand-guidelines.md) (the "Visual Identity & Design System" doc), with the implemented tokens in [`09_website-app/frontend/tailwind.config.ts`](../09_website-app/frontend/tailwind.config.ts) and the brand CSS rules in `09_website-app/frontend/app/globals.css`. See the [Colour & type summary](#colour--type-quick-summary) below for the short version plus pointers.

> **Supersession note:** brand-guidelines.md §2 ("Logo") predates the productionised mark and still describes the wordmark as `tracking-tighter` and the logo as an inline CSS box. For the logo specifically, **this document overrides** it: the wordmark is set at **`letter-spacing: 0`** (Inter natural), and the mark now ships as outlined vector files plus a React component, not inline CSS.

---

## The logo

**Direction: "Interlocked AP" (approved by Keith, 2026-08-30).** The A and the P cut as a single
geometric glyph sharing one vertical stem, **with no enclosing square and no container of any kind**,
plus the horizontal lockup of that mark to the left of **ANDRO PRIME**. Reference and production gap:
`assets/logos/interlocked-ap/README.md`.

🔴 **The composition spec below still describes the Refined Monogram, because that is what is still
live.** The Interlocked AP has no vector masters yet, so nothing has been re-cut. Read the rest of
this section as the rules governing the mark currently on every surface, not as a description of the
approved direction.

**Previous direction: "Refined Monogram"** (chosen 2026-06-12 from three explored directions; the
others, Threshold Cell and Mono Bracket, were rejected and kept for the record under `assets/logos/`).
Superseded as the direction on 2026-08-30; **still the live mark** until the replacement is drawn.

**Composition — horizontal lockup:**

1. **Mark:** a solid square (`100×100` in the master viewBox), with the monogram **"AP"** reversed out in **Inter Black (900)**, optically centred, kerned tight (`letter-spacing: -3` at the master scale).
2. **Wordmark:** **"ANDROPRIME"** in Inter Black (900), uppercase, **`letter-spacing: 0`**, set to the right of the mark.

The mark may be used on its own (square icon); the wordmark is not used without the mark.

**Glyphs are outlined to vector paths** in every master file, so the logo renders identically with or without Inter installed (print, partner decks, email, third-party use).

### Colour variants

| Variant | Square | "AP" | Wordmark | Use on |
| ------- | ------ | ---- | -------- | ------ |
| **Dark** (default) | `#000000` | `#FFFFFF` | `#000000` | Light backgrounds (`#FFFFFF` / near-white) |
| **Light** (inverted) | `#FFFFFF` | `#000000` | `#FFFFFF` | Black / dark sections |

Black and white only. No accent colour, no gradient, no shadow, no rounded corners — consistent with the core brand rules.

> ✅ **RESOLVED 2026-08-30, by removal rather than by a ruling.** This note previously held the mark
> square while Direction F's `chrome-F.html` rounded it 9px / 7px against an explicit prohibition, with
> the question waiting on Keith. **The approved Interlocked AP has no square**, so there is no container
> to round and the prohibition has nothing to apply to. `chrome-F.html`'s rounded lockup is moot: it
> rounds a container the new mark does not have. Record: `2026-08-29-direction-f-supersedes-v2-non-negotiables.md` §5.
>
> 🔴 **Until the new masters exist the live mark is still the square Refined Monogram**, and while that
> is true the old rule still binds: do not round it. The packaging renders, the icon set and the OG
> cards all carry the square today.

### Outlined variant (large-format / packaging)

> 🔴 **This whole variant has no successor in the approved direction (noted 2026-08-30).** It exists
> because a *filled square* reads too heavy at large scale, so it swaps the fill for a keyline. The
> Interlocked AP is **already an open glyph with no fill to remove**, so there is nothing for an
> "outline variant" to be. When the new masters are drawn, either this section retires or a genuinely
> different large-format treatment has to be designed and approved. It is not a carry-over.

For **large-format and packaging** use, the standalone mark may be rendered as an **outlined ("line") emblem**: a square keyline (no fill) enclosing the "AP", instead of the solid filled block. At large sizes the solid square reads too heavy and dominates the composition; the outlined version keeps the mark's presence while staying light and premium.

| | Square | "AP" | Use on |
| --- | ------ | ---- | ------ |
| **Outline dark** | keyline `#000000`, no fill | `#000000` | Light / warm-white backgrounds |
| **Outline light** | keyline `#FFFFFF`, no fill | `#FFFFFF` | Black / dark backgrounds |

- **Keyline weight:** ~1.7% of the mark's width (proportional — it scales with the mark). Square linecaps, no corner radius.
- **Use it for:** the standalone mark at large scale — packaging hero emblem, covers, oversized brand moments (roughly ≥ 25 mm / large canvases).
- **Do not use it for:** the favicon, app icon, small UI, or inside the horizontal lockup — at small sizes the keyline thins out and the "AP" loses legibility. Small and lockup use the **solid** master.
- The **wordmark and the horizontal lockup are unaffected** — they always use the solid mark.
- This outlined emblem is the **one sanctioned exception** to the "no effects" rule below, and only for the standalone mark. Approved for packaging 2026-06-12 (Keith).

### Usage rules

- **Clear space:** keep at least the height of the "A" clear on all sides.
- **Minimum size:** wordmark lockup no smaller than ~16px tall; below that, use the square mark alone.
- **Do not** stretch, rotate, recolour, add effects/shadows, round the square's corners, attach a tagline to the lockup, or re-letterspace the wordmark. (The outlined large-format variant above is the only sanctioned exception, and only for the standalone mark.)

> **Two of these need restating for the Interlocked AP and have NOT been (2026-08-30).** *Clear space*
> is defined as the height of the "A" measured off a container that no longer exists, and *minimum
> size* says "below 16px use the square mark alone", which names a square there is no longer. **"Round
> the square's corners" retires with the square.** These are open, and they belong with the master
> drawing rather than ahead of it.

---

## Asset inventory & file locations

### Brand masters — `02_brand/assets/logos/`

| File | What it is |
| ---- | ---------- |
| `refined-monogram/lockup-light.svg` | Full lockup, dark variant (black on transparent) — for light backgrounds |
| `refined-monogram/lockup-dark.svg` | Full lockup, light variant (white on transparent) — for dark backgrounds |
| `refined-monogram/icon.svg` | Square mark only (solid), favicon/avatar-ready |
| `refined-monogram/icon-outline.svg` | Outlined mark, dark — large-format / packaging on light backgrounds |
| `refined-monogram/icon-outline-light.svg` | Outlined mark, light — large-format / packaging on dark backgrounds |
| `logo-preview.html` | Side-by-side comparison of all explored directions on light/dark panels |
| `threshold-cell/`, `mono-bracket/` | Rejected exploration directions (kept for the record) |
| `interlocked-ap/` | 🟢 **The approved direction (2026-08-30).** Reference rasters plus the production gap. **No vector masters yet** |

All `refined-monogram/*.svg` files are **outlined paths** (font-independent). The two `icon-outline*.svg` files are the sanctioned large-format / packaging variant (see [Outlined variant](#outlined-variant-large-format--packaging)).

### Live site (Next.js) — `09_website-app/frontend/`

| Path | Role |
| ---- | ---- |
| `components/shared/Logo.tsx` | 🔴 **Still the Refined Monogram** (2026-08-30): needs the vector master before it can move. Reusable React logo. `variant="dark" \| "light"`, accepts standard SVG props (size via `className`). Inline outlined SVG; the single source of truth used in-app. |
| `app/favicon.ico` | Multi-resolution favicon (16/32/48). 🟢 **Interlocked AP since 2026-08-30**, PNG-embedded, built by `assets/logos/interlocked-ap/build-icons.js` |
| `app/icon.png` | 512px PNG icon (Next auto-injects `<link rel="icon">`). 🟢 **Interlocked AP since 2026-08-30** |
| `app/apple-icon.png` | 180px Apple touch icon |
| `public/icon-192.png`, `public/icon-512.png` | PWA manifest icons |
| `app/manifest.ts` | Web app manifest (`theme_color #000000`, `background_color #ffffff`) |

`Logo.tsx` is currently used in the primary nav ([`components/shared/Nav.tsx`](../09_website-app/frontend/components/shared/Nav.tsx)), the [footer](../09_website-app/frontend/components/shared/Footer.tsx), and the [activate-flow header](../09_website-app/frontend/app/activate/layout.tsx). Use it for any new placement rather than re-creating the mark in markup.

---

## Colour & type (quick summary)

Full spec in [brand-guidelines.md](brand-guidelines.md) §3–§4. Implemented tokens in `tailwind.config.ts`.

- **Core palette:** black `#000000` + white `#FFFFFF` only on marketing/UI. Functional grays for surfaces (`surfaceElevated #F3F4F6`, `textMuted #666666`). The **only** non-mono colour is in the authenticated results dashboard: `statusOptimal #059669`, `statusWarning #D97706`. No blue, no gradients, no glows.
- **Type:** Inter (headlines/UI, weights to 900), Merriweather (body serif), JetBrains Mono (data labels, uppercase, `0.15em` tracking). Self-hosted via `next/font` in `app/layout.tsx`.
- ~~**Hard rules:** `rounded-none` everywhere (no border-radius), no box-shadow, square SVG linecaps, structural black borders instead of whitespace.~~
  🔴 **DEMOTED TO ADVISORY 2026-08-27** (Keith; `STATE.md`). These four were named in the release
  verbatim. Direction F replaces them with a radius scale (`--r: 28px` / `--r-in: 22px` / pill), an
  ambient shadow (`--amb`), and hairline-plus-elevation depth. **Exception: the logo mark itself.** The
  release listed page surfaces and did not mention the mark; F rounds it at 7 to 9px and that is still
  open, because the mark is also on packaging, the icon set and the OG cards. See `02_brand/2026-08-29-direction-f-supersedes-v2-non-negotiables.md` §5.

---

## Regenerating the assets

> 🔴 **THIS PROCEDURE DOES NOT TRANSFER TO THE APPROVED MARK (2026-08-30).** Every step below starts
> by **outlining Inter Black glyphs to paths**, which works because the Refined Monogram is two typed
> letters inside a square. The Interlocked AP is a **custom-drawn interlock and is not any typeface**,
> so there is no font to outline and step 1 has nothing to run on. The mark has to be **drawn as vector
> first**, by hand, and the build fed from that drawing. Rewriting this build is part of producing the
> new masters, not a follow-up to it.
>
> The **wordmark** half still outlines from a font. ✅ **Which KIND of font is ruled (Keith,
> 2026-08-30, commit `c4d477c`): a heavy grotesque, uppercase**, confirmed against this mark at 52px,
> 22px nav and 14px minimum. Which specific grotesque is open, and the cheapest answer is the site's
> body sans at its heaviest weight rather than licensing a third family. The site's headline face was
> ruled the same day as a **serif over a humanist sans**, so the lockup pairs a grotesque wordmark
> with a serif headline **deliberately**; do not file that as a defect. **Neither half of the lockup
> is blocked on typography now. Both are blocked on the mark being drawn as vector.**
>
> ✅ **The ICON SET half is already rebuilt and does not use this procedure**:
> `assets/logos/interlocked-ap/build-icons.js` produces `favicon.ico` (16/32/48, PNG-embedded), the
> 512 / 192 / 180 PNGs, and installs them. It works from the approved raster, which is legitimate
> here and only here, because every output is a fixed-size raster. Re-run it against the hand-drawn
> vector when that exists; the geometry it encodes (tile treatment, 6% margin, threshold-then-resample)
> is a verified decision and should carry over unchanged.

The outlined masters and favicon set are produced by an isolated build (kept out of the app's dependencies) that outlines Inter Black glyphs to paths, rasterises the icon, and packs the `.ico`. If the mark or wordmark spacing ever changes, regenerate rather than hand-editing path data:

1. In the scratch build dir: `node build.js` (writes outlined SVGs + PNGs + `favicon.ico` to `out/`).
2. `node gen-component.js` (regenerates `Logo.tsx` from the outlined paths).
3. Copy `out/` masters into `02_brand/assets/logos/refined-monogram/` and the favicon files into the Next `app/` + `public/` locations above.
4. Verify with `next build` and a smoke test of `/favicon.ico`, `/icon.png`, `/apple-icon.png`, `/manifest.webmanifest`.

---

*Logo direction and productionisation shipped 2026-06-12 (commit `e442d2b`). For the full design system, see [brand-guidelines.md](brand-guidelines.md).*

# Visual Identity — Logo & Identity Assets

**Owner:** Keith Antony · **Status:** Active · **Last updated:** 2026-06-12

## Purpose & scope

This document is the source of truth for the **Andro Prime logo and core identity assets**: the mark, its variants, the master files, the favicon/app-icon set, and usage rules.

It deliberately does **not** restate the full design system. Colour, typography, buttons, cards, layout, components, photography, and tone live in [brand-guidelines.md](brand-guidelines.md) (the "Visual Identity & Design System" doc), with the implemented tokens in [`09_website-app/frontend/tailwind.config.ts`](../09_website-app/frontend/tailwind.config.ts) and the brand CSS rules in `09_website-app/frontend/app/globals.css`. See the [Colour & type summary](#colour--type-quick-summary) below for the short version plus pointers.

> **Supersession note:** brand-guidelines.md §2 ("Logo") predates the productionised mark and still describes the wordmark as `tracking-tighter` and the logo as an inline CSS box. For the logo specifically, **this document overrides** it: the wordmark is set at **`letter-spacing: 0`** (Inter natural), and the mark now ships as outlined vector files plus a React component, not inline CSS.

---

## The logo

**Direction:** "Refined Monogram" (chosen 2026-06-12 from three explored directions; the others, Threshold Cell and Mono Bracket, were rejected and kept for the record under `assets/logos/`).

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

### Usage rules

- **Clear space:** keep at least the height of the "A" clear on all sides.
- **Minimum size:** wordmark lockup no smaller than ~16px tall; below that, use the square mark alone.
- **Do not** stretch, rotate, recolour, add effects/shadows, round the square's corners, attach a tagline to the lockup, or re-letterspace the wordmark.

---

## Asset inventory & file locations

### Brand masters — `02_brand/assets/logos/`

| File | What it is |
| ---- | ---------- |
| `refined-monogram/lockup-light.svg` | Full lockup, dark variant (black on transparent) — for light backgrounds |
| `refined-monogram/lockup-dark.svg` | Full lockup, light variant (white on transparent) — for dark backgrounds |
| `refined-monogram/icon.svg` | Square mark only, favicon/avatar-ready |
| `logo-preview.html` | Side-by-side comparison of all explored directions on light/dark panels |
| `threshold-cell/`, `mono-bracket/` | Rejected exploration directions (kept for the record) |

All three `refined-monogram/*.svg` files are **outlined paths** (font-independent).

### Live site (Next.js) — `09_website-app/frontend/`

| Path | Role |
| ---- | ---- |
| `components/shared/Logo.tsx` | Reusable React logo. `variant="dark" \| "light"`, accepts standard SVG props (size via `className`). Inline outlined SVG; the single source of truth used in-app. |
| `app/favicon.ico` | Multi-resolution favicon (16/32/48) |
| `app/icon.png` | 512px PNG icon (Next auto-injects `<link rel="icon">`) |
| `app/apple-icon.png` | 180px Apple touch icon |
| `public/icon-192.png`, `public/icon-512.png` | PWA manifest icons |
| `app/manifest.ts` | Web app manifest (`theme_color #000000`, `background_color #ffffff`) |

`Logo.tsx` is currently used in the primary nav ([`components/shared/Nav.tsx`](../09_website-app/frontend/components/shared/Nav.tsx)), the [footer](../09_website-app/frontend/components/shared/Footer.tsx), and the [activate-flow header](../09_website-app/frontend/app/activate/layout.tsx). Use it for any new placement rather than re-creating the mark in markup.

---

## Colour & type (quick summary)

Full spec in [brand-guidelines.md](brand-guidelines.md) §3–§4. Implemented tokens in `tailwind.config.ts`.

- **Core palette:** black `#000000` + white `#FFFFFF` only on marketing/UI. Functional grays for surfaces (`surfaceElevated #F3F4F6`, `textMuted #666666`). The **only** non-mono colour is in the authenticated results dashboard: `statusOptimal #059669`, `statusWarning #D97706`. No blue, no gradients, no glows.
- **Type:** Inter (headlines/UI, weights to 900), Merriweather (body serif), JetBrains Mono (data labels, uppercase, `0.15em` tracking). Self-hosted via `next/font` in `app/layout.tsx`.
- **Hard rules:** `rounded-none` everywhere (no border-radius), no box-shadow, square SVG linecaps, structural black borders instead of whitespace.

---

## Regenerating the assets

The outlined masters and favicon set are produced by an isolated build (kept out of the app's dependencies) that outlines Inter Black glyphs to paths, rasterises the icon, and packs the `.ico`. If the mark or wordmark spacing ever changes, regenerate rather than hand-editing path data:

1. In the scratch build dir: `node build.js` (writes outlined SVGs + PNGs + `favicon.ico` to `out/`).
2. `node gen-component.js` (regenerates `Logo.tsx` from the outlined paths).
3. Copy `out/` masters into `02_brand/assets/logos/refined-monogram/` and the favicon files into the Next `app/` + `public/` locations above.
4. Verify with `next build` and a smoke test of `/favicon.ico`, `/icon.png`, `/apple-icon.png`, `/manifest.webmanifest`.

---

*Logo direction and productionisation shipped 2026-06-12 (commit `e442d2b`). For the full design system, see [brand-guidelines.md](brand-guidelines.md).*

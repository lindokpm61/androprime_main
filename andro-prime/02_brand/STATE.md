# Brand — Creative Production State

Volatile status of creative/design production. Durable rules are in `CONTEXT.md` and the source-of-truth docs (`brand-guidelines.md`, `visual-identity.md`, `tone-of-voice.md`, `messaging-framework.md`). Update the date on each change.

_Last updated: 2026-07-01._

---

## Logo — SHIPPED (2026-06-12, `e442d2b`)

Refined Monogram productionised and live. Master SVGs are **outlined Inter-Black glyph paths** (font-independent) at `assets/logos/refined-monogram/` (`lockup-light`, `lockup-dark`, `icon`, `icon-outline`, `icon-outline-light`). Wired as `09_website-app` `components/shared/Logo.tsx` (Nav, Footer). **Favicon set** added via Next app-router conventions (`app/favicon.ico`, `icon.png`, `apple-icon.png`, `manifest.ts`) — the site previously had none. Regenerate from the isolated scratch build at `~/Downloads/ap-logo-build/` (`node build.js` → `node gen-component.js`). Outlined variant codified in `visual-identity.md` for large format (≥~25mm) only.

## Kit packaging — PAUSED (2026-06-12), UNCOMMITTED

Direction is set; production is paused pending other decisions, and **all packaging files + the `visual-identity.md` outline-variant edits are uncommitted.**

- **Model = SLEEVE + universal INSERT, not a custom rigid box** (Vitall-confirmed 2026-06-03). Vitall dispatches in an AP-supplied sleeve over their existing kit + includes an AP welcome/instruction insert. We do NOT control the box interior, so the "premium reveal / die-cut tray" ideal is **not** deliverable now — premium must live on **sleeve finish + insert card**. A full rigid box may become possible when Vitall moves to in-house printing (next few months) = a Phase-2 upgrade.
- **MOQ 500 sleeves, kitting FOC.** Insert + sleeve-back are **universal** across kits; only the sleeve **front** is kit-specific (each = its own 500 run).
- **Hard constraints:** match Vitall's exact kit dimensions (dieline `2025 Box Design.pdf`/`.eps` in `~/Downloads`, NOT in repo; faces 179×152mm); **leave a white cutout on the BACK** for Vitall's lot/expiry/compliance label (do NOT design our own LOT/expiry block); do NOT reproduce or alter Vitall's validated collection steps on our insert (validity/liability — our insert = welcome + dashboard-activation pointer only; collection steps stay on Vitall's IFU, which can carry our logo); kit is pre-linked at order creation, so wording is "**activate / see your results**", never "register your kit".
- **Design direction (research-led):** warm-white-led exterior (ivory ~#F4F1EA, not surgical white — black is the *riskiest* choice in a health frame), **promote UKAS/IVD/CE credentials to a legible front line** (they're the #1 trust lever, not back-panel fine print), premium comes from **material** (heavy uncoated board, soft-touch, deboss, black/gunmetal foil) not artwork, and a **welcome card** is the evidenced anxiety-reducer. Large emblem uses the **outlined** mark (solid reads too heavy at format).
- **Artefacts** in `assets/packaging/`: `concept-sleeve-v5.html` (real assets), `concept-sleeve-fronts-all-kits.html`, `printer-brief.md` (quote-ready, unknowns flagged `[TBC]`).
- **Open before any print:** first-run scope (rec: Kit 1 + Kit 2 sleeves 500 ea + 500 universal inserts; defer Kit 3); exact white-window + fold coords from the dieline; insert size vs kit interior; Ewa/compliance sign-off on insert copy; warm-white-vs-pure-white + ink-black-vs-#000 brand calls. **QR fix owed:** per the `/activate` deprecation, the generic sampling QR goes on the **insert** (not the sleeve back) and "activate your kit" → "scan to see how to take your sample" — the committed v5 concept predates that decision.

## Blog skin (`.blog-skin`) — SHIPPED (2026-05-29, `ec42a54`)

Brutalist editorial category live: layout + listings + 10 MDX components (`ClinicalInsight`, `SystemAlert`, `PublishedEvidence`, `InlineKitCTA`, `SysHeading`, `NumberedHeading`, `BlogToc`, etc.), all 5 articles converted + em-dash-free, listings rebuilt with dynamic category filter, TOC surfaces SystemAlert/References. Cream surface + scoped block-shadows; accent red dropped. Implementation + CSS-cascade gotchas are in `09_website-app` (`styles/base/blog-skin.css`; custom classes like `brutal-shadow` are plain CSS, NOT Tailwind utilities — apply unprefixed). _(The old memory index line calling this "uncommitted / listings filter open" is stale — it shipped.)_

## Design system — FORMALIZED (2026-04-27)

Audit done + system formalized: tokens in `brand-guidelines.md` v2.0 + `09_website-app` `canonical-site/shared/design-system.css` + `styles/themes/{brand,app}-theme.css`, living style guide at `canonical-site/design-system/index.html`. Radius 0 + no shadows globally enforced via `!important`; palette black/white + `gray-*` only (no `stone-*`/`zinc-*`); status colours app-only. Known CSS-cascade gotcha (`.glass-panel` forces `bg-white`, overrides any `bg-*`) is tracked in `09_website-app`.

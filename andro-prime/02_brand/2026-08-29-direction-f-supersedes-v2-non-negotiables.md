# Propagating the 2026-08-27 brand release into the guidelines, the tokens and the build

**Date:** 2026-08-29
**Owner:** Keith Antony
**Status:** ✅ **APPLIED.** The 2026-08-27 ruling is now carried by `brand-guidelines.md`, `visual-identity.md`, the token layer and `tailwind.config.ts`. 🔴 **Two items are NOT covered by that ruling and remain open: the accent-as-status-colour collision (§4) and the logo mark's radius (§5).**
**Source of the ruling being propagated:** `02_brand/STATE.md` — *"The visual brand guidelines are now ADVISORY, not binding (Keith, 2026-08-27)"*, restated as a standing permission in `09_website-app/design/homepage-direction-brief.md` §2.
**Touches:** `brand-guidelines.md` §3.1, §3.3, §3.4, §5, §5.2, §12.2, §12.4, §12.9 · `visual-identity.md` §Hard rules · `frontend/styles/tokens/` · `frontend/tailwind.config.ts`

---

## 1. This is not a new ruling. It is the sweep that never ran.

Keith demoted the visual guidelines from binding to advisory on **2026-08-27**, before the direction exercise:

> "the brand guidelines were written at a very early stage when we needed to come up with a design, and we have stuck to them religiously. The business has moved on. **Take inference from them, but where moving away from them is needed to produce a better quality modern website, do it.**"

The release was explicit about what it covered: *"`rounded-none` everywhere, no box-shadow, white-background-only, black-type-only with no accent colour, Inter Black uppercase `tracking-tighter` headlines, no gradients or effects, and 'structural black borders instead of whitespace'."* The homepage brief restated it as a standing decision, not a one-off, and recorded that Keith had signed it off.

**What never happened is the propagation.** Two days later Direction F was approved across forty frames, and in between:

- `brand-guidelines.md` went on asserting `rounded-none` as "non-negotiable" (§5) and "No exceptions" (§12.4).
- `visual-identity.md:97` went on listing the same as "**Hard rules**".
- The four token files in `frontend/styles/tokens/` went on citing those sections as their source, with `--radius: 0px` and `--shadow: none`.
- **`tailwind.config.ts` went on enforcing them at the framework level**, as top-level (not `extend`) overrides zeroing every radius and shadow utility, with comments stating that no such utility could compile to a non-zero value.

So an approved direction built on a 28px radius and an ambient shadow was **uncompilable in the codebase that had already been given permission to build it**, and the failure was silent: `rounded-3xl` compiled to `0px` and emitted no error. A page rebuilt against F would have rendered flat, looked slightly wrong, and given no clue why. This document closes that gap.

## 2. What is now propagated

| # | Rule as written in V2.0 | Where it said so | Now |
|---|---|---|---|
| 1 | "All buttons use `rounded-none`... **This is non-negotiable.**" | §5 | Radius scale: `--r: 28px` containers and cards, `--r-in: 22px` nested, `999px` pills. `0` stays correct for data tables and rule lines. |
| 2 | "`rounded-none` on every interactive element, card, button, and container. **No exceptions.**" | §12.4 | Same. |
| 3 | "Radius: 0 / Shadow: none" | §5.2 | Radius per scale; `--amb` where the element sits on a raised surface. |
| 4 | "no box-shadows on cards, buttons, or components... Border weight carries all visual hierarchy" | `tokens/shadows.css`, §6/§8 | `--amb: 0 26px 60px -20px rgba(10,11,13,.16), 0 6px 18px -12px rgba(10,11,13,.10)`. Depth is the hairline border plus elevation. |
| 5 | "No hardcoded hex values except `#000000` / `#FFFFFF`." | §12.2 | Ink ramp `--ink:#0A0B0D`, `--ink-2:#4A4F57`, `--ink-3:#6B7078`. Pure `#000000` retired as the text default. |
| 6 | "everything is either white, near-white gray, or black" | §3.4 | Four-surface elevation set: `--paper`, `--core` (`#FFFFFF`), `--tray:#F1F2F4`, `--sunk:#E7E9EC`. Still all near-white; now a deliberate ladder. |
| 7 | "increase border weight — do not add colour" | §12.9 | Withdrawn as the depth rule. |
| 8 | "**No brand accent colour.**" | §3.1 | **Released 2026-08-27.** An accent is permitted. Which accent, and where it may appear, is §4. |

**Unaffected, and it matters that this list is explicit:** typography (Inter / Merriweather / JetBrains Mono, weights, tracking), the voice rules, the photography placeholder rule, prohibited terms, and **everything in `03_compliance/CONTEXT.md`**. The 08-27 ruling named that boundary itself and said the distinction must never blur. Brand sign-off is Keith; Ewa is clinical and claims only.

## 3. Why applying it was safe

Checked before `tailwind.config.ts` was unlocked: the codebase uses **only** `rounded-none` (52 occurrences) and `shadow-none` (7). No other radius or shadow utility appears in any page or component. Both keep their existing values under the new scale, so the unlock changed **zero rendered pixels**. It makes Direction F buildable; it does not begin building it.

---

## 4. 🔴 OPEN: F's accent is the borderline status colour, and that was not what 08-27 released

The 08-27 ruling released *"no accent colour"* as an aesthetic constraint. It did not address **which** colour, and the specific thing Direction F does was never put to anyone.

`--flag:#E0A458` enters the system in the approved direction file, `design/mockups/directions/F-field.html:109`, commented:

> `--flag:#E0A458;        /* borderline chip fill. Text on it is --ink, never white. */`

It arrives as **a results-status colour**. In `kits-F.html` the same variable is re-described as *"The marketing accent"* and does both jobs on one page:

- **As status:** the sample-report bar fill (`.bar i`), the Monitor / borderline chip underline (`.st.hot`).
- **As sales:** CTA fills, list bullets, step numerals, hover borders, pull-quote rules, and `table.cmp .k3` — the tint highlighting **the Kit 3 column**, the £179 product, in the price comparison.

So as drawn, the colour telling a man his result needs monitoring is the hex highlighting the most expensive kit.

**Two reasons this is not settled by the 08-27 release:**

1. **The 08-27 "may not move" list is scoped to `03_compliance/CONTEXT.md`.** The rule this crosses lives in `brand-guidelines.md` §3.3 and reads as compliance reasoning rather than taste: *"Colour appears ONLY on the range-bar fills and status dots inside a results or sample-report panel. It never touches headings, body copy, buttons, CTAs, backgrounds... A coloured bar outside a results/sample-report panel is a bug."* It was in neither list.

2. **Keith ruled this exact question the other way two days AFTER the release.** On 2026-08-29, specifying the blog skin, accent red was dropped, and `CONTEXT.md` records why: *"red is reserved for the results-dashboard critical/GP-block status; decorative red near health copy collides with that meaning + ASA risk."* Amber is reserved identically (`--color-status-warning: #D97706`). The collision here is stronger than the red case: not an adjacent hue, but one variable serving both meanings.

### Options

**A. Separate them (recommended).** `--flag` is the marketing accent. Results panels revert to the dashboard status tokens (`#059669` / `#D97706` / `#B91C1C`). Cost: F's sample-report frames need bar and chip colours re-pointed, a change to approved frames. Benefit: status colour keeps one meaning, the §3.3 fence survives, and §3.3's own "preview = real" continuity note gets easier.

**B. Merge them.** One warm accent doing both jobs. Cheapest, changes no frame, and reverses the accent-red ruling by implication.

**C. A different accent.** Keep F's radius, shadow and surfaces; choose a marketing accent outside the status palette. Blue is retired (§3.4), so this is a new colour and it changes every F frame.

**Recommendation: A.**

**Current state:** `--flag` is *defined* in the token layer and wired into Tailwind as `flag` / `flagFaint` / `flagFaint2`, but **applied to nothing**. No page renders it, because the rebuild has not started. There is no live exposure. This only has to be settled before the first page is built against F.

## 5. 🔴 OPEN: F rounds the logo mark, and the logo was not in the 08-27 list

`chrome-F.html` renders the AP mark with `border-radius:9px` on the 26px footer lockup and `7px` on the 22px nav lockup. The guidelines call the square container an identity rule (§2: *"No pill shape, no rounded corners on the logo container — always `rounded-none`"*), and `visual-identity.md` is the logo's source of truth and repeats it.

The 08-27 release listed page-level surface rules. **It did not mention the logo**, and the logo is not a page surface: it is on the packaging sleeves rendered this week, the favicon and app-icon set, the OG cards and the social profiles. Rounding it on the website alone desynchronises the mark from print, and the sleeve artwork is close to a print decision that is expensive to redo.

**Held, deliberately.** This needs a yes or no from Keith, and if yes it is a `visual-identity.md` change plus a re-render of every asset that carries the mark, not a token change.

---

## Related

- `02_brand/STATE.md` — the 2026-08-27 ruling being propagated.
- `09_website-app/design/homepage-direction-brief.md` §2 — the same ruling as a standing permission, with the compliance list that bounds it.
- `02_brand/brand-guidelines.md` — now carrying dated notes at each affected section.
- `02_brand/visual-identity.md` — the "Hard rules" line, now noted.
- `09_website-app/frontend/styles/tokens/` and `tailwind.config.ts` — the executable half.
- `09_website-app/STATE.md` — "design tokens first, not page by page" (2026-08-27), which this unblocks.

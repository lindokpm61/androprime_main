# Interlocked AP — the approved logo direction

**Status:** 🟢 **DIRECTION APPROVED (Keith, 2026-08-30).** 🔴 **ARTWORK NOT PRODUCED.**
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
surface.** Every master in `../refined-monogram/` is **outlined vector paths**, specifically so the
logo renders identically without Inter installed (print, partner decks, email, third-party use), and
the replacement has to meet the same bar.

**What has to be drawn before anything ships:**

| File owed | Mirrors |
|---|---|
| `lockup-light.svg` / `lockup-dark.svg` | `../refined-monogram/lockup-*.svg` |
| `icon.svg` (standalone mark) | `../refined-monogram/icon.svg` |
| `Logo.tsx` regenerated from the outlined paths | `09_website-app/frontend/components/shared/Logo.tsx` |

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

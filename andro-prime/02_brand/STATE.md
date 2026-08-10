# Brand: Creative Production State

Volatile status of creative/design production. Durable rules are in `CONTEXT.md` and the source-of-truth docs (`brand-guidelines.md`, `visual-identity.md`, `tone-of-voice.md`, `messaging-framework.md`). Update the date on each change.

_Last updated: 2026-08-11._

---

## Retrofit COMPLETE: all 18 published articles passed through the structural audit (2026-08-10)

Ran the v1.3 audit (below) over the whole published library, staged: 3 articles first for Keith's read, then the remaining 15. **16 of 18 changed; 2 needed nothing.**

**The convergence was in repeated SENTENCES, not in the headings.** The H2 slot repetition recorded below was real but was the smaller half. The sweep found verbatim prose shared across articles:

| Repeated verbatim | Articles |
| --- | --- |
| "The point of testing isn't the number. It's the loop." | 4 |
| "Here's where the line is, plainly." | 4 |
| "You probably didn't go looking for X. Something put it in front of you." | 3 (near-verbatim) |
| "...as if each were equally likely." | 2 |
| "A fortnight of honest changes tells you whether..." | 2 |
| "Here's the honest part." | 2 |
| "That isn't us being cautious. It's the honest line." | 2 |

`brain-fog` and `why-am-i-always-tired` were **near-twins**: same skeleton, same opening move, near-identical pull quotes. `why-am-i-always-tired` is the hub and published first, so it kept the original wording and the spoke was varied.

**Done:** 13 duplicated H2s renamed across 8 articles; the repeated section openers under them varied per article; the "Here's ..." family cut from 26 instances to 9 (survivors are functional table intros in different articles); 4 throat-clearing openers cut; `andropause-male-menopause` lost five restated-lesson section closes, keeping the one that lands hardest.

**Deliberately not changed, and this matters as much as what was:** `## Your next move` (18/18) and `How Andro Prime will measure this` (3) are product template slots and explicitly not findings. `We don't diagnose` / `See your GP` / `is a GP conversation` are required compliance lines where repetition is correct. `free-androgen-index`, `signs-of-stress-in-men`, `myth-of-normal-range`, `14-signs-of-vitamin-d-deficiency` audited clean and were left alone rather than edited to a quota. Frontmatter excerpts are meta descriptions and out of scope for a prose pass.

**Integrity.** No claim changed, no citation removed, no compliance line touched. 13 files keep "We don't diagnose", 14 keep "See your GP", every `primary_query` still present, em dashes 0 across all 18. Bodies written to `blog_articles.body` with pre-edit revision snapshots, revalidated, verified two-sided on served HTML: **13/13 PASS** on the second batch, 4/4 on the first.

**One incident, self-caught and fully reverted.** The first push moved `free-androgen-index` by 199 bytes with zero copy changed: the repo MDX is CRLF, the stored bodies are LF, and the frontmatter stripper added a leading and trailing blank line. Sync had been verified for the two files being edited and not for the third, on the false reasoning that an unedited file cannot diverge; the divergence came from the transport. Restored byte-identical from its prior revision and confirmed by direct comparison. The push script now normalises line endings, validates against an unchanged control record, and treats a failed history snapshot as an abort rather than a warning. Logged as observation 201.

Commits: `9019f17` (first 3), `589b9a4` (remaining 15).

---

## Voice spec v1.3: the structural layer, from measuring the library rather than reading advice (2026-08-10)

**The problem Keith named:** content is in his voice and no longer wooden, but still carries "a hint of being written by AI". Trigger was evaluating an external repo (`NulightJens/humanizer-stack`) against this library.

**Diagnosis, and it is measured, not asserted.** The whole anti-AI apparatus operated on words and sentences. Scanning all 18 published articles found the word layer already clean: **zero hits** for copula avoidance, -ing pseudo-analysis, vague attribution and generic positive conclusions; the only "false range" hits were legitimate (`from October to March`). Six of eight candidate surface rules fire nowhere. **The residue is shape**, and shape was unmeasured and partly mandated:

| Repeated element | Frequency |
| --- | --- |
| `## Your next move` as the closing H2 | 18 of 18 |
| `## What changes when you actually have the number` | 7 of 18, verbatim |
| `## Why your GP ordered it, or why your panel includes it` | 5 of 18, verbatim |
| `## How Andro Prime measures [marker]` | 10 of 18 |

**`tone-of-voice.md` bumped v1.2 → v1.3.** New **§4 "Constructions you don't use"** (six preventive entries, each recorded as scanned-and-absent on 2026-08-10, so nobody re-adds them as live rules). New **§9a check 7**, empty inline-header lists, the one word-level tell actually present (40 instances across 16 of 18 articles) and shipped with a discriminator because most uses are correct. New **§9b** pointing at the structural audit.

**`references/narrative-devices.md` bumped v1.0 → v1.1.** New "The structural audit": six audits (theme explicitness, structural tidiness, emotion mode, reference specificity, reader engagement, shape convergence), an eleven-item intervention menu, and the rotation rule. Audits 4 and 5 are marked expect-to-pass with the measurements behind that claim (reader-address 3.6–4.5 per 100 words, numeric density 2.2–3.6, 8–17 named sources).

**Two house rules were themselves generating the tell, and both are now qualified in place.** §6's "each H2 section is one Keith arc" mandated an identical skeleton per section; it now reads as a default shape available to a section. And the Move 4 reframe is **once per piece, not once per section** — six consecutive sections of `andropause-male-menopause` close on a restated lesson, every one a good sentence, which is exactly why the word-level pass cleared them all.

**The brief layer had to be swept, because `/article` invariant 1 says the brief wins over the skill.** Two briefs were silently overriding the voice spec: `pillar-E-hub-andropause-male-menopause.md` mandated one arc per H2 (superseded in place), and `pillar-C-spoke-myth-of-normal-range.md` instructed the verbatim "I asked one question" opener that was **retired on 2026-07-27** (corrected in place). The second is a pre-existing defect, not a consequence of this change. Historical voice-self-check records in completed briefs were left alone as audit trail.

**Evidence grade.** The StoryScope basis (93.2% macro-F1 from discourse features alone) was verified against the paper, [arXiv 2604.03136](https://arxiv.org/abs/2604.03136). Its corpus is ~5,000-word prompted fiction, so the percentages are direction for UK health copy, not thresholds; this is stated in the audit itself.

**OPEN, needs Keith's ruling.** §5 lists "Most men don't realise…" as preferred; §9a bans narrator-from-a-distance; three live social assets sit in the gap. A discriminator is written into §9a as a **proposal**: a sentence replacing a *directive* stays, one replacing a *moment* gets rewritten into the moment. Confirm it, or take the alternative of a social carve-out.

---

## Social banners committed to the repo (2026-07-30)

**NEW `assets/social/`**, holding the two live channel headers plus a README with specs, per-channel copy, safe areas and the regeneration warning.

| File | Size | Channel |
| --- | --- | --- |
| `x-header-1500x500-black.png` | 1500 x 500 | X, `@KeithAndroPrime` |
| `youtube-banner-2560x1440-black.png` | 2560 x 1440 | YouTube, `@keithandroprime` |

- **The X header is a recrop of the YouTube banner**, not a new design: same black/grey system, same `A` watermark, same AP lockup, same cutout, same marker strip. Only the aspect ratio and the sub-line changed. Produced through an image model on 2026-07-30 from the YouTube file as reference.
- **They were only ever in Downloads until now.** The YouTube banner has been live since 2026-06-28 with its only copy sitting in a personal downloads folder and its design in Figma. That is the gap this closes.
- **Marker strip is a compliance surface, recorded in the README.** Every marker named on a banner must sit in a currently available kit. The current five do. Adding cortisol, thyroid or metabolic markers before those kits launch would put an unavailable product on a permanent public asset.
- **Regeneration warning, deliberately loud in the README:** image models rewrite faces, and that cutout is a real photograph of Keith carrying recognition across four channels. Figma (`O4K7R8RlCKRM7EQ7WxFtCn`) stays the source of truth; generated output must be diffed against the original before it goes anywhere.

**Not filed, both known:** the white/light YouTube variant, and `keith-bw-nbg.png`, the background-removed cutout that every banner and avatar in the stack depends on and which currently exists only in Figma. The cutout is the one worth committing next, because it is a single point of failure with no version history.

---

## Voice spec v1.2: AI-tells section + narrative devices from the spoken corpus (2026-07-27)

- **`tone-of-voice.md` bumped v1.1 → v1.2.** New **§9a "AI tells"**: six hard-fail checks on top of the §9 checklist (throat-clearing openers, meta-joiners, inanimate subjects doing human verbs, narrator-from-a-distance, vague declaratives, negative listing), each a rewrite not a score. Plus a **carve-out table** protecting four house devices that generic anti-AI advice bans: the rule of three, the "It's not X. It's Y." pivot, deliberate fragments, and question-led openers. Written after evaluating the third-party `stop-slop` skill, which was **rejected as a pipeline step** because 4 of its rules fight the house voice head-on; only the non-conflicting delta was ported.
- **§9a personification rule corrected the same day.** As first written it flagged 19 instances in a live article including Ewa's signed clinical quote ("The framework doesn't lie. It just answers a different question"). It now carries a **named-actor test**: can you name a human actor and keep the meaning? If yes, name them; if the inanimate thing genuinely is the actor in the claim, it stays. The rule had been derived only from examples of the failure and overfitted to their surface form.
- **Two §9 checklist boxes qualified in place** (not deferred to v2, because `/article` reads them on every draft): the diagnostic question is **not a per-section quota** in long-form, and a **flat close or open wondering** also satisfies the closing-question box in long-form. Both were LinkedIn rules over-generalised.
- **`/article` voice-pass bar corrected 11/13 → 11/14.** The checklist had grown to 14 items while the skill still scored against 13, so the bar had quietly loosened from 85% to 79%.
- **NEW `references/narrative-devices.md` (v1).** Nine structural devices derived from ~11,400 words of Keith's unscripted speech (the 2025-12-11 recordings): ordinary-build-then-rupture, name-the-state-then-interrogate-it, a physical object for an invisible state, showing the search for the word, timestamping the vantage point, the banal scene carrying the load, understatement at the peak, the flat close, and first-person-widening-only-at-the-end. **Structure only; contains no biographical content and is not a licence to reproduce any.** Read by `/article` at draft time; devices 1, 3, 6, 7 also wired into `/hook` and `/script`.
- **Voice-sample corpus gaps recorded** in `tone-of-voice.md` §10: no off-voice corpus exists (only one hand-built ON/OFF pair), and 4 of the 5 v1 samples are written while Keith is a stronger talker than writer, so the corpus over-weights his weakest medium. Both are refresh targets, not blockers.

## Conflict-free positioning wording: ✅ APPROVED, CA-026 (2026-07-22)

Keith + Ewa approved the set: §P + A1 + B1 + C1 + C2 (FAQs) + D1 + D2 + D+ + E2 (E1 retired). Register row CA-026. D2 stays ship-gated (solicitor terms + boundary ruling); F7 UKAS-cert filing owed. Sweep + money-pages rewrite unblocked. Original drafting entry below.

## Conflict-free positioning wording pack: drafting record (2026-07-22)

`2026-07-22-conflict-free-wording-pack.md`: finished customer-facing wording for the adopted positioning (standing claim A1-A3, homepage hero B1-B3, /kits money block C1-C2, bundle lines D1-D2, press line E1/E2), drafted because Keith + Ewa agreed the position and principles but wanted the marketing wording produced for them. Independent compliance-reviewer audit run same day: 1 hard fail fixed in place, 7 flags folded into the pack (headline items: the "we earn the same" absolute was reworded to the substantiable "a low result earns us nothing"; D2 is gated on solicitor terms + a Phase 0 boundary ruling on the Confirmation bundle; press line E1 needs a retirement-date decision vs the clinic-proof E2). Sign-off checklist in the pack governs; nothing ships before both signatures + the CA row. **Scope fix (Keith, same day):** the position must govern all three kits, not peg to testosterone; pack gained §P (the two-rule governing principle: doctor-tier results earn us nothing; no result changes what we offer or its price) and §D+ (per-kit conformity lines for Kits 1/2/3); testosterone wording demoted to the press-layer spearhead. Decision doc carries the matching scope note.

## GP-framing sweep (2026-07-07)

- Per-patient GP framing ("GP-built report", "personalised report") swept to the system-level ruling across brand, product, affiliate-programme, marketing, and site docs. `trust-signals.md` pending-Ewa long form now reads "GP-designed information" (adjustment noted beside its status line, included in Ewa re-review).
- **Standard chip "GP-designed report" is proposed, pending Ewa confirmation** in her sign-off session.
- Escalated, not edited: Keith's LinkedIn posts 1/2/4 ("GP-built report", review note added in-file); v2.3 partner briefs (proposal file `06_marketing/affiliates/briefs/v2.4-framing-corrections.md`); blog MDX bylines ("reviewed by our GMC-registered medical lead", CA-011 blanket, verb framing flagged for Ewa's re-review); canonical-site testimonial "interpreted by doctors" (quoted customer voice).

---

## Logo: SHIPPED (2026-06-12, `e442d2b`)

Refined Monogram productionised and live. Master SVGs are **outlined Inter-Black glyph paths** (font-independent) at `assets/logos/refined-monogram/` (`lockup-light`, `lockup-dark`, `icon`, `icon-outline`, `icon-outline-light`). Wired as `09_website-app` `components/shared/Logo.tsx` (Nav, Footer). **Favicon set** added via Next app-router conventions (`app/favicon.ico`, `icon.png`, `apple-icon.png`, `manifest.ts`): the site previously had none. Regenerate from the isolated scratch build at `~/Downloads/ap-logo-build/` (`node build.js` → `node gen-component.js`). Outlined variant codified in `visual-identity.md` for large format (≥~25mm) only.

## Kit packaging: PAUSED (2026-06-12), UNCOMMITTED

Direction is set; production is paused pending other decisions, and **all packaging files + the `visual-identity.md` outline-variant edits are uncommitted.**

- **Model = SLEEVE + universal INSERT, not a custom rigid box** (Vitall-confirmed 2026-06-03). Vitall dispatches in an AP-supplied sleeve over their existing kit + includes an AP welcome/instruction insert. We do NOT control the box interior, so the "premium reveal / die-cut tray" ideal is **not** deliverable now; premium must live on **sleeve finish + insert card**. A full rigid box may become possible when Vitall moves to in-house printing (next few months) = a Phase-2 upgrade.
- **MOQ 500 sleeves, kitting FOC.** Insert + sleeve-back are **universal** across kits; only the sleeve **front** is kit-specific (each = its own 500 run).
- **Hard constraints:** match Vitall's exact kit dimensions (dieline `2025 Box Design.pdf`/`.eps` in `~/Downloads`, NOT in repo; faces 179×152mm); **leave a white cutout on the BACK** for Vitall's lot/expiry/compliance label (do NOT design our own LOT/expiry block); do NOT reproduce or alter Vitall's validated collection steps on our insert (validity/liability: our insert = welcome + dashboard-activation pointer only; collection steps stay on Vitall's IFU, which can carry our logo); kit is pre-linked at order creation, so wording is "**activate / see your results**", never "register your kit".
- **Design direction (research-led):** warm-white-led exterior (ivory ~#F4F1EA, not surgical white; black is the *riskiest* choice in a health frame), **promote UKAS/IVD/CE credentials to a legible front line** (they're the #1 trust lever, not back-panel fine print), premium comes from **material** (heavy uncoated board, soft-touch, deboss, black/gunmetal foil) not artwork, and a **welcome card** is the evidenced anxiety-reducer. Large emblem uses the **outlined** mark (solid reads too heavy at format).
- **Artefacts** in `assets/packaging/`: `concept-sleeve-v5.html` (real assets), `concept-sleeve-fronts-all-kits.html`, `printer-brief.md` (quote-ready, unknowns flagged `[TBC]`).
- **Open before any print:** first-run scope (rec: Kit 1 + Kit 2 sleeves 500 ea + 500 universal inserts; defer Kit 3); exact white-window + fold coords from the dieline; insert size vs kit interior; Ewa/compliance sign-off on insert copy; warm-white-vs-pure-white + ink-black-vs-#000 brand calls. **QR fix owed:** per the `/activate` deprecation, the generic sampling QR goes on the **insert** (not the sleeve back) and "activate your kit" → "scan to see how to take your sample"; the committed v5 concept predates that decision.

## Blog skin (`.blog-skin`): SHIPPED (2026-05-29, `ec42a54`)

Brutalist editorial category live: layout + listings + 10 MDX components (`ClinicalInsight`, `SystemAlert`, `PublishedEvidence`, `InlineKitCTA`, `SysHeading`, `NumberedHeading`, `BlogToc`, etc.), all 5 articles converted + em-dash-free, listings rebuilt with dynamic category filter, TOC surfaces SystemAlert/References. Cream surface + scoped block-shadows; accent red dropped. Implementation + CSS-cascade gotchas are in `09_website-app` (`styles/base/blog-skin.css`; custom classes like `brutal-shadow` are plain CSS, NOT Tailwind utilities; apply unprefixed). _(The old memory index line calling this "uncommitted / listings filter open" is stale; it shipped.)_

## Design system: FORMALIZED (2026-04-27)

Audit done + system formalized: tokens in `brand-guidelines.md` v2.0 + `09_website-app` `canonical-site/shared/design-system.css` + `styles/themes/{brand,app}-theme.css`, living style guide at `canonical-site/design-system/index.html`. Radius 0 + no shadows globally enforced via `!important`; palette black/white + `gray-*` only (no `stone-*`/`zinc-*`); status colours app-only. Known CSS-cascade gotcha (`.glass-panel` forces `bg-white`, overrides any `bg-*`) is tracked in `09_website-app`.

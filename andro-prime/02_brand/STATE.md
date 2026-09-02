# Brand: Creative Production State

Volatile status of creative/design production. Durable rules are in `CONTEXT.md` and the source-of-truth docs (`brand-guidelines.md`, `visual-identity.md`, `tone-of-voice.md`, `messaging-framework.md`). Update the date on each change.

_Last updated: 2026-09-02 (🟢 **THE INTERLOCKED AP IS DRAWN AS VECTOR, AND THE LOGO IS NO LONGER
BLOCKED ON KEITH SUPPLYING FILES.** It never needed supplying: it needed measuring off the raster he
approved on 2026-08-30 and rebuilding as geometry. `assets/logos/interlocked-ap/icon.svg` is verified
against that raster at **99.53% pixel agreement**, has no container, and carries **7.2% more ink** than
the reference, which is the added weight the README asked for. `gen-logo.js` replaces the lost
`gen-component.js`, so the mark can be re-cut rather than re-drawn. 🔴 **The bowl is a STADIUM, not an
ellipse**: a superellipse fitted it at 0.6% rms and was wrong by 184px at the top, which only the render
caught. 🟡 **One decision open for Keith: which grotesque the wordmark uses.** The approved spec says
heavy grotesque and the body sans is humanist, so the cheap option departs from what he approved;
`out/face-compare.png` sets three at 52/22/14px. This unblocks the Vitall sleeve print, though the 25mm
gate is still unrun. Earlier: 2026-08-31 (🔵 **TYPEFACE LICENSING IS PART-VERIFIED, AND THE TWO FACES PRICE VERY DIFFERENTLY.** **Effra (Dalton Maag) clears the hard requirement: self-hosting is permitted and is the default**, licences are perpetual, desktop is from £31 a style and **the 2-axis variable is £185 including all 18 statics**. 🟢 **Buy the variable, not statics**: F uses `font-weight: 600` in 18 places and Effra’s statics have no 600. It also ships a **Heavy**, which closes the open wordmark detail without a third licence. **Austin (Commercial Type) publishes no price anywhere**, for any licence type: quote-only, in USD, desktop by workstation and web by unique monthly visitors. 🔴 **Their self-hosting position is unconfirmed and gates the price question rather than following it.** ⚠ **Adobe Fonts does not solve this**: it carries Effra, but Adobe forbids self-hosting and serves only from its CDN, so it can cover desktop and design work and cannot serve the site. Earlier: 🔵 **THE DESIGN GUIDELINES DO NOT NEED UPDATING, BUT THE COMPONENT LAYER HAS NO SINGLE SOURCE OF TRUTH.** Measured across all 13 journey mockups 2026-08-30: the **token layer is clean, 24 tokens and ZERO value conflicts**, and `f-primitives.css` matches the mockup majority exactly. But the component layer exists in **fourteen independent copies** (13 mockup `<style>` blocks plus `f-primitives.css`) with nothing reconciling them, and the mockups have already drifted from each other: `.btn` padding in four sizes, `.sub` measure at 70/66/64/62ch, `.eyebrow` margin split 4/4. The `results-*` frames run tighter, which looks like deliberate app density but is recorded nowhere. **Owed: a mockup-vs-primitives reconciler, and Keith's ruling on whether the app scale is deliberately denser than marketing.** Detail in `../09_website-app/STATE.md` ▶️ PICK UP HERE. Earlier: ✅ **THE LOGO CHANGED: KEITH APPROVED THE "INTERLOCKED AP" (2026-08-30)**, the A and P as one glyph sharing a stem, **with no container**, `assets/logos/interlocked-ap/`. It closes the F rounding question **by removal**, since there is no square left to round. **Direction only: there are no vector masters**, so the Refined Monogram still ships everywhere **except the icon set**, which migrated the same day (favicon, app icon, apple-touch, PWA) because a fixed-size raster output does not need a vector source. **The site is therefore in a deliberate mixed state**: new mark in the browser tab, old mark in the page header. Earlier: ✅ **THE BRAND LEAD IS RULED AND THIS WORKSPACE WAS THE ONE THE LAST SWEEP MISSED.** Keith, 2026-08-30, ruling A2 on `../01_strategy/2026-08-30-brand-lead-after-the-monitoring-thesis.md`: **conflict-free stays the lead; the Patient-owned data pillar is promoted from "privacy receipt" to PROOF LAYER** and may appear in customer copy as demonstration, still never as the opening claim. **Category noun ruled: "a UK men's health company"**, not a wellness brand (wellness is the Phase 0 regulatory tier, and `brand-guidelines.md` already says "not a wellness brand") and not a testing company (forecloses the record and the membership). `CONTEXT.md` and `messaging-framework.md` are amended. 🔴 **STILL OWED BY KEITH: the `brand-description.md` rewrite**, which is now TWO leads stale (last touched 2026-07-22, commit `647e91b`) and feeds affiliate briefs, press, the About page, the homepage meta and every social bio. The sweep re-stamped its banner and deliberately did not write the copy. **No CA-026 re-clearance is triggered**: under A2 no approved claim moves. Earlier: 2026-08-27 (**visual brand guidelines demoted to advisory by Keith**; packaging renders are product not mood, see below). Earlier: 2026-08-25 (🔴 **THE KIT SLEEVE APERTURE IS IN DISPUTE AND NOTHING MAY GO TO PRINT.** Vitall's Laura Sutton answered all nine sleeve questions on 2026-08-24 and gave the aperture as **67 x 118 mm** against the **108.00 x 57.00 mm** we lifted from her own `.eps` and recorded as "exact, not measured": 10 mm larger on both axes, which would make **both Route B print proofs wrong**. Her attached box cutter templates are the arbiter and are **still in Gmail, unmeasured**. Everything else in the sleeve spec is now CLOSED: **no new die needed** if we build to their dimensions, the sleeve does not move on the box, **we supply printed sleeves via Vitall's partner Mega-Pak** who ship direct to the fulfilment centres, setup is ~1 month but gated on Mega-Pak capacity, the **500 minimum is per design** (so Kit 1 + Kit 2 is 1,000 sleeves), and the IFU and Lab Request Form can both carry our branding. **Owed by us: the logo as SVG, and the template download.** Earlier: 2026-08-20 (**both sleeve routes now drawn; Route B recommended.** Route B keeps the board dominant and reduces the black to the channel and the table rules. ✅ **It preserves the 2026-06-12 warm-white finding, prints far cheaper, and gives the credentials the whole page** — and drawing it corrected my own call: Route B is **not** the weaker match to the bottle, it is its photographic negative, which is a stronger two-family system than a literal colour match. Earlier: sleeve fronts redrawn onto the supplement system (v6); bottle heroes on the real Nutribl bottles; the inverted black label on a white bottle scored highest; the generative-model limit tested and corrected.))_

---

## 🔵 The visual brand guidelines are now ADVISORY, not binding (Keith, 2026-08-27)

**Keith's ruling, verbatim in substance:** the brand guidelines were written at a very early stage
when we needed to come up with a design, and we have stuck to them religiously. The business has
moved on. **Take inference from them, but where moving away from them is needed to produce a better
quality modern website, do it.** Not an abandonment: a demotion from law to starting point.

**What this releases** (all aesthetic, all previously written as hard rules in `CONTEXT.md` and
`visual-identity.md:97`): `rounded-none` everywhere, no box-shadow, white-background-only,
black-type-only with no accent colour, Inter Black uppercase `tracking-tighter` headlines, no
gradients or effects, and "structural black borders instead of whitespace".

> ✅ **PROPAGATED 2026-08-29, and it had not been until then.** For two days this ruling existed only
> here and in the homepage brief. `brand-guidelines.md` still called `rounded-none` "non-negotiable"
> and "No exceptions", `visual-identity.md:97` still called the same four "Hard rules", the four token
> files still set `--radius: 0px` / `--shadow: none`, and **`tailwind.config.ts` still enforced both as
> top-level overrides that zeroed every radius and shadow utility** — so Direction F, approved on the
> strength of this very ruling, was uncompilable, silently (`rounded-3xl` resolved to `0px` with no
> error). All four layers now carry it. Record: `02_brand/2026-08-29-direction-f-supersedes-v2-non-negotiables.md`.
>
> ✅ **The accent question is RULED (Keith, 2026-08-29): separate them.** The accent is for marketing
> surfaces only and may never colour a results or sample-report panel, which keeps `brand-guidelines.md`
> §3.3's fence intact and extends it to sample reports embedded in marketing pages. Applied to
> `kits-F.html`, the only frame that had the collision. The boundary is restated beside the token in
> `colours.css`, beside the utility in `tailwind.config.ts`, and in §3.1 of the guidelines.
>
> ✅ **RESOLVED 2026-08-30, and not the way the question was asked.** This held open whether F may
> round the AP square 9px / 7px. **Keith approved a new mark instead: the Interlocked AP, which has no
> container**, so there is no square to round. The question is closed by removal. §5 of the record now
> reads CLOSED. 🔴 **What replaces it is bigger**: the packaging sleeves, the icon set, the OG cards and
> the social profiles all carry the square Refined Monogram and are now stale, and **the approved mark
> **HAD** no vector masters, so nothing could be re-cut. 🟢 **RESOLVED 2026-09-02: the mark is drawn
> as vector** (`assets/logos/interlocked-ap/icon.svg`, verified at 99.53% pixel agreement against the
> approved raster), so the sleeves, icon set, OG cards and social profiles can all be re-cut. The
> LOCKUP waits on one decision, which grotesque the wordmark is set in.
> `assets/logos/interlocked-ap/README.md`.

**What this does NOT release, and the distinction must never blur:** everything in
`03_compliance/CONTEXT.md`. The EFSA wording, the ashwagandha silence, the Phase 0 / post-CQC
boundary, "diagnose / treat / cure", the conflict-free receipt, no per-customer clinical
interpretation, and the em-dash ban. Those are compliance rails, not brand preferences, and they are
unchanged. **Brand sign-off is Keith. Ewa is clinical and claims only** (corrected 2026-08-27; a
design question had been routed toward her in error).

**The trigger.** Three homepage directions were built strictly inside the old rules and Keith's read
was that they "still look pretty flat and barren". The rules forbid shadows, gradients and accent
colour, so the only remaining levers are photography, scale, texture and motion. The guidelines were
the constraint producing the outcome he disliked.

**Already true before this ruling, and worth recording as evidence for it:** the brand had already
outgrown the guidelines in two places. The kit packaging renders are warm bone stock with serif
product names and hairline rules, none of which the guidelines permit; and `.blog-skin` is a
documented cream `#f4f4f0` departure. **The website was the only surface still following v2.0
literally.**

**Owed:** `brand-guidelines.md` and `visual-identity.md` still assert the released rules as hard.
They need a banner recording this demotion, which is a `/decision-sweep` job and was NOT done in
this session.

## Packaging renders are product, not mood imagery (Keith, 2026-08-27)

`assets/packaging/renders/kit-*-3d.jpg` are the actual product packaging, and the boxes are white.
They were used as depth imagery in the first homepage directions; Keith corrected this and asked
that they be kept available but left out of the build. Site imagery is to be generated to the
photography spec in `CONTEXT.md` (real men 38 to 55, kitchens, offices, gyms, no studios, no fitness
models, no stock) rather than borrowed from packaging.


## Kit boxes: ROUTE B RENDERED IN 3D, KITS 1 TO 3 (2026-08-20)

Route B fronts put onto the real box via nano_banana_2. Files: `renders/kit-1-testosterone-3d.png`,
`renders/kit-2-energy-recovery-3d.png`, `renders/kit-3-hormone-recovery-3d.png`; flat fronts in `renders/tex/`.
Shown at the foot of the two-routes page.

**Box built to the Vitall dieline**: front face 179 x 152 mm, depth 22 mm, a flat letterbox carton. Keith supplied the
Vitall box design for sizing and orientation only. **Their artwork was never shown to the model** — the file was read
for dimensions, and the dimensions were described in the prompt, so none of their design could bleed into ours.

🔴 **One round was rejected, and the failure mode is worth keeping.** The first Kit 1 and Kit 2 renders reproduced
**every character correctly and put them in the wrong rows**: the unit column drifted off its marker names, entirely on
Kit 1 and by one row on Kit 2. On a medical panel that is a real error, not a cosmetic one, and a character-by-character
read passes it. Fixed by stating the row rule explicitly in the prompt (name and unit share a baseline, rule underneath
the pair, every pair listed). **Kit 3 passed first time** — its two-column table left less room to reflow.

**Standing rule added:** when a generated pack image contains a table, **check the pairing, not just the characters.**
The rejected Kit 1 is kept at `renders/higgsfield-test/kit-1-REJECTED-table-decomposed.png` as the record.

The renders confirm the design intent physically: the spine runs the full height and **turns the corner onto the side**,
which is what it should do on a real sleeve, and the slim carton reads as clinical post rather than as a gift box.

## Kit sleeve fronts: BOTH ROUTES DRAWN, ROUTE B RECOMMENDED (2026-08-20)

**Artefact:** [`assets/packaging/concept-sleeve-fronts-v7-two-routes.html`](assets/packaging/concept-sleeve-fronts-v7-two-routes.html)
— Route A and Route B side by side at size with the chosen bottle, then Route B across Kits 1 to 3 in both palettes.
Supersedes the v6 file as the decision document; v6 remains the record of Route A alone.

- **Route A:** black band across the face, board channel through it. Drawn in v6.
- **Route B:** board dominant, black reduced to a full-height channel at the left edge plus the table rules.

✅ **Recommendation: Route B**, and drawing it changed my own assessment. I had called Route B "a weaker match to the
bottle". **That was wrong.** Route B and the chosen bottle are **photographic negatives of each other**: identical
geometry, identical channel width and position, identical vertical wordmark, identical mono table with the same
right-aligned unit column, with only the black and the board swapped. That is a **deliberate two-family system**, not a
weak match — the kit is the light member, the supplement is the dark member, and everything structural is shared.

It also **resolves the 2026-06-12 tension instead of overriding it.** That finding is about the object carrying the
anxiety: a blood test you are nervous about opening, where warm white is right. A supplement bottle on a bathroom shelf
carries no such weight and can go dark. **Each object gets the colour its job needs while staying one system.**

**Where Route B is concretely better:** credentials get the full width under their own rule in black on clean board,
rather than a cramped strip — and the research named credentials the number-one trust lever; the channel runs the full
152 mm and bleeds off both edges, closer to the bottle spine than Route A gets; and it is **far cheaper and safer to
print**, a narrow band plus hairlines instead of a large solid black area, which turns matt lamination from a
requirement into a choice. **Where Route A still wins:** louder at thumbnail size, and a more literal colour match.

Still open and unchanged: the clinical sign-off line needs re-confirming; marker units need checking against Vitall
report output (FAI is returned by the lab and reported without interpretation); warm white versus pure white is still
one call for the whole range; the back-face QR fix is untouched.

## Kit sleeve fronts: REDRAWN ONTO THE SUPPLEMENT SYSTEM (v6, 2026-08-20), NOT CHOSEN

Keith flagged that if the supplement design settles, the existing sleeve fronts no longer follow. Correct: the v5
sleeve is centred type on a warm-white field, and the bottle that won is a black field with a board channel carrying
the vertical wordmark and a mono table as the hero. **Artefact:**
[`assets/packaging/concept-sleeve-fronts-v6-aligned.html`](assets/packaging/concept-sleeve-fronts-v6-aligned.html),
Kits 1 to 3, both palettes from one token set, with Kit 1 shown at size beside the chosen bottle.

**The device transfers for a physical reason, not a stylistic one.** On the bottle the white channel is the bottle
showing through the label; on the sleeve it is **the board showing through the black band**, running off the top and
bottom of the band into clean board, so it reads as material rather than as a printed stripe.

**The stronger link is the table.** The supplement lists what it gives you at a dose; the kit lists what it measures in
a unit. Same mono rows, same hairline rules, same right-aligned column. That is the through-line for the whole range:
**the numbers go on the front of the box.** Kit 1 five markers, Kit 2 four, Kit 3 nine in two columns.

**Locked constraints all carried over:** dieline unchanged at 179 x 152 mm; **front only is kit-specific**, back and
insert stay universal and the back keeps the white cutout for Vitall lot/expiry; credentials (UKAS line, clinical
sign-off, IVD / CE / UKCA) **promoted to a legible front line** as the 2026-06-12 research requires, set in black on
the clean board strip rather than reversed out of the black; Kit 1 copy scope held to testosterone only.

🔴 **The decision it forces.** The 2026-06-12 direction chose warm-white on the finding that **black is the riskiest
choice in a health frame**. This concept puts a large black band on the front. Smaller departure than it looks (board
frames it, channel is bare board, credentials sit on white) but it **is** a departure. Two honest routes: accept the
band, on the argument that the black now does structural brand work; or **invert the sleeve only** — board dominant,
black reduced to the channel and the table rules — preserving the finding at the cost of a weaker match to the bottle.
Only the first is drawn. The second is one request away.

**Open:** ⚠️ the **clinical sign-off line** is carried verbatim from v5 and should be re-confirmed, since the
"GP-led / interpreted report" differentiator was retired on the basis that Ewa signs off the system, not individual
reports (the line is about thresholds, so it reads consistent, but it is external clinical copy). ⚠️ **Marker units**
(NMOL/L, PMOL/L, MG/L, µG/L, G/L, INDEX) must be confirmed against Vitall report output; **FAI is returned by the lab,
not calculated by us, and reported without interpretation**. Print: large solid black on board argues for matt
lamination, already the recommended finish. The **QR fix** owed from the /activate deprecation is untouched here
because it is a back-face item.

## Container mockups: RENDERED (2026-08-20), CONTAINER NOT CHOSEN

Daily Stack artwork put onto the three Nutribl stock containers Keith supplied, as real 3D renders.

**Artefact:** [`assets/packaging/concept-container-mockups-v1.html`](assets/packaging/concept-container-mockups-v1.html),
with the renders in `assets/packaging/renders/` and the label textures in `renders/tex/`. Portrait label artwork for the
flat packer is in [`concept-supplement-label-v3-nutribl.html`](assets/packaging/concept-supplement-label-v3-nutribl.html).

**Method matters here.** These are three.js renders with our own label PNGs UV-mapped onto the geometry at 1:1.
**No part of any label was generated by an AI image model**, so the dose table, claim line and mono type are pixel-exact
rather than plausible-looking. The scene source ships alongside the renders (`renders/_scene-source.html` +
`_serve.js`): change a label, re-export the texture, re-render, and every shot updates. Generative models were ruled out
for the label itself after checking the Higgsfield roster: **not one of its nine 3D models accepts a UV map or applies a
given texture at given coordinates**, so label pixels would have to pass through a generative texturing step.

**PET bottle heroes produced (white and black), 2026-08-20.** Nutribl offer PET in black as well as white, so both were
rendered with the same label via the pipeline below: three.js for geometry and label placement, `gpt_image_2` for the
photographic pass and the cap finish. Files: `renders/hero-pet-white-bottle.png`, `renders/hero-pet-black-bottle.png`,
plus an unrequested `renders/hero-pet-black-bottle-inverted-label.png` for comparison. **The inverted variant kills the
Spine device** (a black band on a black field has nothing to contrast against), so it is a handsome object and a weaker
brand asset.

🔴 **The QC rule earned itself immediately.** All three generated images render `1,000 µG` as `1,000 uG` — the micro
sign is lost. Harmless in a marketing image, **wrong on a pack**. And the readable-arc problem is confirmed in
photographic form: `25 MG`, `4,000 IU` and the URL all clip on the curve. The photoreal pass did not fix it because it
is the bottle, not the render. **Neither finding changes the flat-packer recommendation.**

**⚠️ CORRECTION (same day, after testing).** The line above saying generative models were ruled out for the label was
**too strong, and it was reasoning rather than evidence**. Tested against three image models with our real artwork:

- **`gpt_image_2`: reproduced every string verbatim AND kept the flat-packer geometry** (thin body, wide clip lid,
  camera angle), producing a better photograph than the raw render. Best of the three.
- **`nano_banana_2`: every string verbatim**, but drifted the geometry, inventing a deeper body and a different lid.
  Given the flat label alone with no 3D input it still produced a correct, handsome straight-on packshot.
- **`flux_kontext`: FAILED.** Small type turned to mush and **4,000 IU came back as 4,999 IU**.

The claim that survives is narrower and more useful: the **3D models** still cannot place our artwork (none accepts a
UV input), and **model choice decides whether an image model can be trusted with the type**.

**The pipeline this settles on:** the three.js render is the geometric ground truth and the design-verification
artefact (it is what exposed the readable-arc problem); a **`gpt_image_2` pass over it** produces the finished
marketing image. 🔴 **Standing rule: read every number at full zoom against the spec before any generated image is
used.** A generated packshot is a photograph of a claim, and one model silently changed a dose. Evidence images in
`assets/packaging/renders/higgsfield-test/`, comparison table at the foot of the mockups page.

**✅ Recommendation: the flat mail packer.** Three reasons, in order of weight:

1. **The whole 65 mm front is flat and readable at once.** On the round PET, the front assembly is 98 mm against a
   readable arc of roughly 50 mm, and the renders show **the dose values (25 MG, 4,000 IU, 1,000 µG) curving off the
   silhouette and clipping**. That is the physical bottle, not the render.
2. **Letterbox postage.** Nutribl's own note is that these ship as a large letter. On a monthly subscription that
   compounds twelve times a year per customer, and it removes missed deliveries.
3. **Two full 65 x 80 mm panels**, front and back, instead of one wrap split between a front field and a back panel.

**⚠️ The container choice and the design direction turn out to be the same decision.** The Spine direction was chosen
because a 20 mm black band carrying the wordmark reads across a shop floor. On a round bottle that band rolls onto the
silhouette and becomes a side element. **If a round bottle wins, the dose table has to be re-laid out** with values under
their labels rather than right-aligned across the measure, which is a different layout and not a tweak.

**A side effect on the palette question:** the flat mail packer is **white only**. A warm-white label on a bright white
bottle reads as a mismatch, so if the packer wins the ivory-vs-white call likely answers itself as pure white. Since the
label is one-colour black on stock either way, this costs nothing to decide late.

**Type floor may differ by container.** The packer's largest face is roughly 70 cm², under the 80 cm² threshold, so the
**0.9 mm** x-height floor would apply and the packer back is drawn to it. The PET is over the threshold and its wrap is
drawn at **1.2 mm**. ⚠️ Read from the regulation, not confirmed; the definition of largest surface for a cylinder is
the least certain part. Confirm both before plates.

**⚠️ Dimensions are inferred, not supplied.** Packer drawn at 75 x 94 x 25 mm (depth pinned to the 25 mm letterbox
limit), PET at 64.6 mm diameter / 300 ml. **Nutribl will have the real dielines and every label size depends on them.**
Get them before any artwork is finalised.

## Supplement label: DIRECTION CHOSEN, ARTWORK v2 DRAWN (2026-08-20), NOT PRINT-READY

✅ **Keith chose the Spine direction** (template 1) from the three in concept v1 below. That concept stays as the
exploration record; this is the chosen direction developed into real artwork.

**Artefact:** [`assets/packaging/concept-supplement-label-v2-spine.html`](assets/packaging/concept-supplement-label-v2-spine.html).
Front at size, back panel, **flat wrap with dieline and guides**, the range in the same system, and a print spec.
**Both palettes render from one token set** (`.theme-mono` / `.theme-ivory` on the wrapper), so repainting the whole
range is one class, not a redraw.

**Dieline (Daily Stack):** wrap label **203 x 90 mm** on a 198 mm circumference plus a 5 mm glue lap. Reading from the
seam: 5 mm underlap (no artwork, gets covered), **20 mm black spine**, **78 mm front field**, **95 mm back panel**, 5 mm
overlap. Joint & Recovery is 303 x 100 mm on the same logic. **The 20 mm spine is the constant across the range**; the
front field and back panel flex with the container.

**Two findings that changed the job:**

1. **It is a one-colour label.** Every face is black ink on stock: no spot, no process, no varnish build. That is a
   direct consequence of the brand having no accent colour, and it makes this the cheapest label a printer can quote.
   It also **defuses the palette conflict**: white stock and ivory stock take the *same plates*, so the ivory-vs-white
   call is now a brand decision with no print cost attached, not a blocking one. (The v1 section below states it more
   severely; that was written before the one-colour finding.)
2. **The legal type floor drove the back-panel layout.** Mandatory particulars on a food supplement need an x-height of
   **1.2 mm** where the largest surface is 80 cm² or more, which this container is. That means ~2.2 mm type in Inter,
   and at that size a single column of advisory text runs off the panel. **The back is two columns because of the
   regulation, not for looks.** ⚠️ Drawn to the 1.2 mm floor as read from the regulation; **have the printer or a
   labelling consultant confirm it against final artwork before plates.** Getting it wrong is a relabel, not an
   amendment.

**Open, and the one that can undo the direction:** ⚠️ **the bottle is assumed.** Drawn on a 250 cc HDPE packer,
63 mm diameter, which is **deliberately oversized for 60 capsules** to buy the label panel height the dose table needs.
If the manufacturer pushes to a 150 cc bottle the panel drops to roughly 65 mm, the dose table has to move to the back,
and **the reason this direction was chosen disappears**. Confirm the container before anything else.

**Also open:** the barcode is EAN-13 at 30 x 15 mm with **bar height truncated** from the nominal 20.7 mm at 80%
magnification, so a scan test is required; excipients are still indicative; the collagen face carries one real row
because the UC-II-vs-hydrolysed lane is undecided; the Omega-3 face is provisional and its **heart claim framing is an
Ewa gate**; the 12-week duration line remains an **Ewa gate**, drawn dashed.

⚠️ **This is not a complete legal artwork.** Net quantity, best-before, storage, country of origin and the
responsible business address are mandatory and are drawn as printer-applied or placeholder zones, because they depend on
the manufacturer and the final fill.

## Supplement label: CONCEPT v1 DRAWN (2026-08-20), NOT CHOSEN, NOT PRINT-READY

First artwork for the **supplement** range, as distinct from the kit sleeve. Drawn against the Daily Stack V7.2 spec
([`04_products/supplements/daily-stack.md`](../04_products/supplements/daily-stack.md)) at a 75 x 90 mm front face on a
wrap label. Artefact: [`assets/packaging/concept-supplement-label-v1.html`](assets/packaging/concept-supplement-label-v1.html).
Reuses the outlined-mark masters, so it is font-independent like the sleeve concepts.

**Three directions, adapted from label templates Keith supplied:**

- **A - Spine.** Full-height black band carrying the vertical wordmark, white field carrying the dose table, badge row redrawn as three square keylines. Best shelf-standout; the spine reads at ~15 mm.
- **B - Monolith.** Full-bleed black, giant vertical product name, mono data column. Closest to the black panels on the site and the boldest of the three. Large solid coverage is the hardest to print well.
- **C - Clinical.** Quiet white field, left-aligned, separated by hairline rules rather than whitespace. Cheapest to print, weakest on a shelf.

The **back face is identical across all three** and carries the nutrition table, ingredient declaration and advisory.

**RED: the palette conflict is the blocking decision.** The three directions are drawn in the core brand palette
(#FFFFFF / #000000). The kit sleeve deliberately is not: the 2026-06-12 direction is warm-white ivory #F4F1EA with ink
#141414, on the research finding that **black is the riskiest choice in a health frame**. A customer sees the kit and the
supplement in the same month, so they cannot be different whites. The concept file carries a fourth panel showing
direction A repainted in the sleeve palette for direct comparison. **If ivory wins, direction B is unbuildable**: a
warm-white brand does not contain a full-bleed black SKU. This is the same "warm-white-vs-pure-white and
ink-black-vs-#000" item already open against the kit sleeve below, arriving a second time from the supplement side.
Settling it once covers both.

**Compliance state of the artwork.** The zinc EFSA claim is verbatim and is the only health claim on the pack; nothing
says the product raises testosterone; **ashwagandha appears only in the ingredient declaration and the nutrition table**,
never on the front face or in the claim line, per the silent-ingredient rule. Open: the 12-week duration line is drawn
dashed and is an **Ewa gate**, taken from her 2026-08-02 liver-safety note and never approved as wording; excipients are
indicative until the manufacturer supplies a real declaration; the collagen face shows the Vitamin C claim only because
the UC-II-vs-hydrolysed lane is unresolved; the Omega-3 face is an illustration of range fit and is **not committed**.

**Open before any print:** pick one direction, since they are not mixable across a range; settle the palette call above;
confirm real bottle dimensions from the manufacturer, which decide the true dieline exactly as the Vitall dieline decided
the sleeve; matt laminate versus uncoated.

## CA-029 scope widened: the bio is approved for X (2026-08-16)

**No brand copy changed.** The Keith Antony bio is byte-identical; what moved is the **scope note**
above it, which records which surfaces its clinical sign-off covers. It read "three surfaces" and now
reads four, adding Keith's X account.

**Why it matters to this workspace rather than only to compliance:** the bio is the source text for
Keith's LinkedIn About section, his LinkedIn headline and the founder posts on X, and the scope note
is the only place recording which of those reuses are covered. **A brand asset reused on a surface
the approval does not name has no compliance history on that surface**, which is the same failure
shape as an unfiled live profile image.

⚠️ **The LinkedIn HEADLINE is still not a named surface**, and it is a brand artefact this workspace
owns: live since 2026-07-28, carrying the About section's first sentence plus a compression of its
second paragraph. Recorded here as well as in compliance because it is brand copy, and this is where
a later brand sweep would look for it.

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

## ✅ THE RULING IS NOW IMPLEMENTED LOCALLY, AND WHAT WAS MISSING WAS A CATEGORY, NOT A FACE (2026-08-31)

**Keith supplied the option label he actually chose on 2026-08-30: “**C · Serif headline over humanist
sans**”.** The options were labelled **by category, not by face**, which is exactly why the ruling reads
"the faces are NOT chosen": he was picking a system, and the free faces were only what rendered it.

🔴 **That makes the current build wrong on the ruling's own terms, not merely provisional.**
`--font-sans` resolves to **Inter, which is a neo-grotesque**, not a humanist sans. It descends from the
Helvetica / Roboto line and aims at neutrality; humanist sans faces reintroduce calligraphic
influence, varied stroke widths and organic proportions. The ruling names the sans as carrying **body
copy, UI and all data**, so this is the larger half of the decision and it is in the wrong category.

**The record has been describing this as a stand-in, which undersells it.** Newsreader is a genuine
stand-in: right category, unlicensed face. Inter is not a stand-in for a humanist sans, it is a
different classification, and it is the one the comparison's option A represented and lost.

✅ **FIXED THE SAME DAY, AND IT COST NOTHING.** `Source_Sans_3` is in this project's installed
`next/font/google`, loaded as a variable font with italic, so it covers every weight Direction F uses
including the 600 in 18 rules and the 900 ghost numeral, and the italic `f-primitives` declares.
**Verified on the running pages**: `/kits` and `/how-it-works` now render Source Sans 3 for body, UI
and data, JetBrains Mono for labels, Newsreader for headlines, and **no Inter anywhere**. No overflow
at 390.

🔴 **It was THREE binding sites, not the two the ruling records.** `typography.css` and `layout.tsx`
are the two it names, but `tailwind.config.ts` binds the family variable **directly**, bypassing the
token layer, so every Tailwind `font-sans` class would have stayed on the old face while the F rules
moved. That third site was already flagged in the record and is exactly the kind of thing that makes
a "two-file change" quietly wrong. All three are repointed and `--font-inter` no longer appears
anywhere in `app/`, `styles/` or the Tailwind config.

**Whether to then license Effra is a separate question about quality, not about correctness.**

⚠ **Worth stating plainly**: nothing here re-opens the ruling. It says the build has not implemented
it yet, and that the gap was invisible because both documents called Inter "a stand-in".

---

## 🔵 Typeface licensing: Effra is priced and self-hostable, Austin is quote-only (2026-08-31)

The 2026-08-30 ruling recorded that "licensing terms, self-hosting rights and price" were unverified
and gated any spend. **Two of the three are now verified for Effra, one is verified for Austin, and
Austin's price is not published anywhere.** Everything below is from the foundries' own pages;
nothing is estimated.

### Effra (Dalton Maag), the humanist sans

- **Self-hosting is permitted and is the default.** Their web licence is called **Host & Link**:
  "self-host 'Web' fonts and link them via CSS to your own websites". This is the one hard
  requirement, because the site serves fonts itself through `next/font`. ✅ Cleared.
- **Perpetual, one payment, upgradeable later.** All four Dalton Maag licence classes work this way.
- **Desktop (Install & Use): from £31 per style**, priced per user.
- **1-axis variable font (weight): from £95.**
- **2-axis variable font (weight + italic): from £185, and it includes a Family Pack of all 18
  static fonts.**
- **Web (Host & Link): priced by maximum page impressions per month**, tiers running from **50k** to
  **35M**. 🔴 **The per-tier figures appear only in their configurator and are NOT yet captured.**
  Andro Prime sits in the lowest tier by a wide margin.
- Prices are GBP with a currency switcher; VAT is added at checkout.

🟢 **Buy the variable font, not a stack of statics, and the reason is concrete.** Direction F uses
`font-weight: 600` in **18 places**. Effra's statics run Light, Regular, Medium, Bold, Heavy, so
there is no 600 to buy: static licensing would force every one of those rules onto 500 or 700. The
variable font gives 600 exactly. At £185 the 2-axis also brings the 18 statics with it, so it is
both the correct buy and the complete one.

🟢 **It also closes the open wordmark detail at no extra cost.** The 2026-08-30 note left one thing
open: the wordmark is specified as a *heavy grotesque* while the body sans is now a *humanist*, with
the cheapest resolution being "cut the wordmark from the body sans at its heaviest weight rather than
licensing a third family". **Effra ships a Heavy.** The family pack settles it without a third
licence.

### Austin (Commercial Type), the headline serif

- 🔴 **No price is published, anywhere, for any licence type.** Commercial Type's catalogue, EULA and
  licensing FAQ carry no figures; prices appear only in the cart, and the site says outright that
  "some of these license types may not be purchased via this website. Please contact
  info[at]commercialtype.com for details and pricing."
- **Prices are in US dollars.**
- **Desktop is priced by number of workstations. Web is priced by unique monthly visitors**,
  aggregated across all domains.
- **Discounts exist and are worth structuring for**: a base **$50 per additional family** within one
  collection, and a further discount for licensing the same family across desktop, web and app at the
  same time.
- ⚠ **Self-hosting rights are NOT yet confirmed for Commercial Type.** Their web licence exists, but
  whether it permits self-hosting under `next/font/local` has not been read out of the EULA. **This
  is the question to settle before the price question**, because a no makes the price irrelevant.
- The Austin family is **16 styles**; there are separate Austin Text and Austin News cuts.

**To get a number: add the styles to the cart on commercialtype.com, or email
info@commercialtype.com.** One of those is required; there is no published figure to look up.

### Adobe Fonts does not solve this, and it is worth knowing why

Effra is on Adobe Fonts, with web use at unlimited pageviews, which reads like a free answer if there
is already a Creative Cloud subscription. **It is not, for this site.** Adobe does not offer local
hosting: web fonts must be delivered from Adobe's CDN via their embed code, and their Terms of Use
prohibit self-hosting the files. `next/font/local` is self-hosting. **Adobe Fonts can cover desktop
and design work at no extra cost; it cannot serve the site.**

### What is still owed

1. 🔴 **Austin's price**, which needs a cart run or an email. Nothing can be estimated from public
   sources.
2. 🔴 **Commercial Type's self-hosting position**, which gates the above.
3. **Effra's Host & Link price at the lowest impressions tier**, which needs their configurator.

---

## ✅ RULED: serif headline over humanist sans (Keith, 2026-08-30)

**Keith's ruling, from a live comparison on the rebuilt `/kits/testosterone`:** the site runs a
**serif headline over a humanist sans**, with the sans carrying body copy, UI and all data. Picked
against two sans-only alternatives (Inter as-is, and a Dalton Maag humanist standing in for Effra) on
the real page at 1440 and 390, sample-report panel included, so the numerals and the mono labels were
part of the judgement rather than a specimen sheet.

**What this decides, and what it does not.** It decides the **system**: F was drawn all-sans, and it is
now a serif-headline system. It does **not** decide the faces. The comparison ran on Newsreader over
Source Sans 3, both free stand-ins chosen to test the category; the licensed candidates are **Austin**
(Commercial Type, Paul Barnes, built on Richard Austin's late-18th-century English letterforms) for the
headline over a licensed humanist sans such as **Effra** (Dalton Maag) for everything else. Austin is
higher contrast and more assertive than its stand-in, which cuts both ways at small sizes.

~~**Not yet verified, and it gates any spend:** licensing terms, self-hosting rights (the site serves
fonts itself through `next/font`, and some foundry web licences forbid that), and price. No figures
have been confirmed and none should be quoted until they are.~~ **PARTLY VERIFIED 2026-08-31, see the
entry above.** Effra: self-hosting is permitted and is the default (“Host & Link”), licences are
perpetual, desktop from £31 per style and the 2-axis variable £185 including all 18 statics; its web
tier price is still uncaptured. Austin: **no price is published anywhere** and it is quote-only, in
USD, and 🔴 **Commercial Type’s self-hosting position is unconfirmed, which gates the price question
rather than following it.**

**Cost to apply, either way: two files.** `09_website-app/frontend/styles/tokens/typography.css` plus
`app/layout.tsx`. Every Direction F rule resolves `--font-sans` / `--font-mono` rather than naming a
family, which is what made the comparison itself a runtime swap with no rebuild.

> ✅ **RECONCILED 2026-08-30: the wordmark stays a heavy grotesque (Keith).** Put to him as a
> three-way render against the approved Interlocked AP mark, at 52px, 22px nav and 14px minimum, each
> lockup also shown above a real serif page headline: **A** heavy grotesque (the approved spec),
> **B** the headline serif letterspaced, **C** a bridge treatment (sans construction, editorial
> weight and spacing). **He took A.**
>
> **The tension is accepted, not overlooked, and this note exists so nobody "fixes" it later.** A
> grotesque wordmark over serif headlines does read as two registers in the nav, and that was visible
> in the comparison when the call was made. What A buys in exchange: the wordmark matches the mark's
> own construction, since the Interlocked AP is geometric with uniform strokes and no serifs anywhere,
> and it is the option that survives the 14px minimum most comfortably. B was nearest its floor there.
>
> 🔴 **One detail this leaves open, and it is small.** A specifies a *heavy grotesque* while the
> site's body sans is now a *humanist*. Cheapest resolution is to cut the wordmark from the body sans at
> its heaviest weight rather than licensing a third family; most humanist families carry a Black. Decide
> it when the faces are chosen, not before.
>
> **The original conflict, kept for the record:** `assets/logos/interlocked-ap/README.md` records the approved lockup as the mark
> "to the left of **ANDRO PRIME** in **a heavy grotesque sans, uppercase**". That is the V2.0
> typographic register: the same heavy-sans-uppercase treatment the site has just moved away from.
> Neither decision is wrong and the pairing is a legitimate one, but **the two were made independently,
> hours apart, and nobody has looked at them together.** The question to settle: does the wordmark stay
> a heavy grotesque while headlines run serif, or does the wordmark follow the headline face? Settle it
> before the Interlocked AP vector masters are drawn, because the wordmark is cut into those masters
> and redrawing them later is the expensive version of this conversation.

### The evidence that got here, kept because the record misstated it

**Both prior candidates were somebody's default, and neither was ever chosen.**

**Keith's position, verbatim in substance:** Inter was the default we used to build the site quickly.
Geist is the direction tool's default. **A men's health company needs its own type form, one that
serves being British high quality.**

**The evidence, because the record currently misstates it.** `homepage-direction-brief.md:157` and
`09_website-app/STATE.md:2114` both call Inter *"the documented brand face"*, which reads as a
selection and was not one. And Geist's arrival is recorded at `09_website-app/STATE.md:2008` as
*"Inter to Geist, because `high-end-visual-design` bans Inter outright and keeping it would have made D
a version of B"*. Geist is the **first name on that skill's own substitutes list**
(`~/.claude/skills/high-end-visual-design/SKILL.md:15`). The same quality detector then raised **two
`overused-font` findings against Geist and Geist Mono**, *"the same finding class v1 carried on Inter"*
(`09_website-app/STATE.md:2033`). So the substitution did not even deliver the differentiation it was
made for. **Neither font was ever assessed against this brand, this register or this ICP.**

**What it is tied to, and the ordering.** The current logo mark's glyphs are **Inter Black outlined to
paths** (`visual-identity.md`), so the typeface decision governs the logo decision below rather than the
other way round. Settle the typeface first. ✅ **BOTH SETTLED 2026-08-30, and this dependency turned out
not to exist: the approved logo is a custom interlock in no typeface.** Kept for the reasoning. It also governs the app-wide rebuild, which is live now:
`09_website-app/frontend/styles/components/f-primitives.css` renders every rule through `--font-sans`
and `--font-mono`, so a ruling is a change to `styles/tokens/typography.css` plus `app/layout.tsx` and
nothing else, however many pages have been rebuilt by then.

**The register this has to serve, corrected the same day:** quality British print publication meets
precise **health** reporting, not *medical* reporting (`brand-guidelines.md` §1). Audience is men 38 to
55 who respond to authority rather than atmosphere, and the brief treats the presbyopia legibility floor
as a hard gate, so whatever is chosen has to hold at small sizes and in a data table, not only in a
headline.

**Not yet done:** no options have been researched, costed or licensed. Nothing here is a recommendation.

## Logo: SHIPPED (2026-06-12, `e442d2b`), 🔴 but the mark's radius is now an open question

> ✅ **BOTH OF THESE CLOSED LATER ON 2026-08-30. Kept for the reasoning; point 3 below has the
> outcome.** Point 1 was resolved **by removal**: Keith approved a mark with no container, so there is
> no square left to round. Point 2's exploration produced that mark.
>
> **1. Direction F rounds it, and that is not ruled (SUPERSEDED, see above).** `design/mockups/journey/chrome-F.html` renders the
> AP square with `border-radius:9px` (26px footer lockup) and `7px` (22px nav lockup). `visual-identity.md`
> lists **"round the square's corners"** among the things not to do to the mark, and the 2026-08-27
> advisory demotion listed page-level surface rules and never mentioned the logo. The mark is not a page
> surface: it is on the packaging sleeves rendered this week, the favicon and app-icon set, the OG cards
> and the social profiles, so rounding it on the website alone desynchronises it from print while the
> sleeve artwork is near a print decision. Record:
> `2026-08-29-direction-f-supersedes-v2-non-negotiables.md` §5.
>
> **2. Three alternative marks were generated for review on 2026-08-29**, at Keith's request, and are
> filed at `assets/logos/explorations-2026-08-29/` with a README recording the brief, the model and the
> cost: **A-prime** (notational, a heavy A with a mathematical prime tick), **Aperture** (a keyline ring
> with a value marked on it) and **Masthead A** (a high-contrast Didone). Higgsfield `gpt_image_2`,
> 25.5 credits. **They are EXPLORATION, not assets:** raster PNGs, where every shipped master in
> `assets/logos/refined-monogram/` is outlined vector paths so the mark renders without Inter installed.
> **None has been tested at 16px**, which is the gate the June exploration used (see `logo-preview.html`,
> which shows all three June directions at 96 / 48 / 32 / 16). Deliberately avoided in the brief: the two
> June directions already rejected, **Threshold Cell** and **Mono Bracket**.
>
> **3. ✅ APPROVED 2026-08-30: the Interlocked AP is the new logo (Keith), AND THE ICON SET IS
> ALREADY REBUILT IN IT.** `app/favicon.ico` (16/32/48), `app/icon.png`, `app/apple-icon.png`,
> `public/icon-192.png` and `public/icon-512.png` now carry the new mark, produced by
> `assets/logos/interlocked-ap/build-icons.js` and verified by decoding every installed file in a
> browser rather than trusting the build. **The icon set could move ahead of everything else because
> it is the one surface a raster source does not compromise** (fixed-size raster output; the vector
> requirement is for print and font-independence). Treatment: **white mark knocked out of a black
> tile at a 6% margin**, both decided on screen, not assumed. A bare black glyph on transparent was
> built and rejected: **it is invisible on a dark browser tab strip.** ⚠️ **The site is now in a
> deliberate mixed state, new mark in the tab and old mark in the header**, until `Logo.tsx` moves.
> Nothing is deployed.
>
> **The approval itself.** Concept 1 of the round
> below, adopted as both the standalone mark and the horizontal lockup. Filed at
> `assets/logos/interlocked-ap/` with the production gap written out; `visual-identity.md` carries the
> rules and the dated notes at each section the change touches. **The approval is of the DIRECTION: it
> is a raster PNG from a generative model, there are no vector masters, and the Refined Monogram stays
> live on every surface until there are.** The build that produces the masters **does not transfer**,
> because it works by outlining Inter Black glyphs and the new mark is a custom interlock in no
> typeface at all; the mark must be drawn as vector by hand first. Two knock-ons: the **outlined
> large-format packaging variant has no successor** (it swaps a fill for a keyline, and the new mark
> has no fill), and **clear space and minimum size are both defined off the square** and need
> restating. The mark is now independent of the Inter-to-Geist ruling; **the wordmark is not.**
>
> **The round it was chosen from (2026-08-30).** Six
> concepts, briefed against **ruling A2** (conflict-free
> leads, the record is a proof layer, "a UK men's health company") and against Keith's same-day
> correction of the register to **"health reporting", not "medical"** — none of which round 1 had.
> Higgsfield `gpt_image_2`, 51 credits. **The size ladder round 1 named as owed and never ran is now
> run** (`assets/logos/interlocked-ap/size-ladder-2026-08-30.png`, 96 / 48 / 32 / 16), **and it
> eliminated two of the six on measurable
> grounds, not taste**: the masthead-rule mark is **7.26:1**, so a square favicon reduces it to a 2px
> smear, and the index-stack mark blurs at 16px and reads as the text-align-centre icon at every size
> above it. Surviving: **Punched A** (solid square, A and a circle knocked out; strongest at 16px
> because it is the only one that is a filled field with the artwork reversed out, so its contrast does
> not degrade), **Interlocked AP** (no container at all, which dissolves the rounding question in point
> 1 rather than answering it), **Record spread** and **Architectural P**. Still raster, still untested
> at 25mm. 🔴 **"GPT Image 2.5" does not exist in the Higgsfield catalogue**, re-queried 2026-08-30
> rather than assumed; `openai_hazel` is a second OpenAI model tagged for logos and has not been tried.
> 🔴 **The five unchosen concepts were DELETED on 2026-08-30 at Keith's instruction**, so only the
> approved mark is on disk. They were untracked and are **not recoverable from git**; the size ladder
> and the outcome table in `assets/logos/interlocked-ap/README.md` are the whole surviving record.
>
> ~~**These two are one decision, not two**, and they are tied to a third: the site typeface.~~
> ✅ **OVERTAKEN 2026-08-30, and the ordering advice was wrong in the event.** It said "settle the
> typeface first", reasoning that the mark's glyphs were Inter Black outlined to paths so the typeface
> ruling governed the mark. **The approved mark is a custom-drawn interlock in no typeface at all, so
> that dependency does not exist**, and the logo was settled before the typeface rather than after.
> The typeface was then ruled the same day (`c4d477c`): a **serif headline over a humanist sans**,
> faces unchosen, and **neither Inter nor Geist was ever a brand choice**, both were defaults.



Refined Monogram productionised and live. Master SVGs are **outlined Inter-Black glyph paths** (font-independent) at `assets/logos/refined-monogram/` (`lockup-light`, `lockup-dark`, `icon`, `icon-outline`, `icon-outline-light`). Wired as `09_website-app` `components/shared/Logo.tsx` (Nav, Footer). **Favicon set** added via Next app-router conventions (`app/favicon.ico`, `icon.png`, `apple-icon.png`, `manifest.ts`): the site previously had none. Regenerate from the isolated scratch build at `~/Downloads/ap-logo-build/` (`node build.js` → `node gen-component.js`). Outlined variant codified in `visual-identity.md` for large format (≥~25mm) only.

## Kit packaging: PAUSED (2026-06-12), UNCOMMITTED

Direction is set; production is paused pending other decisions, and **all packaging files + the `visual-identity.md` outline-variant edits are uncommitted.**

- 🔴 **THE APERTURE IS IN DISPUTE, AND BOTH PRINT PROOFS MAY BE DRAWN TO THE WRONG HOLE (2026-08-24, logged 2026-08-25).** Laura Sutton at Vitall answered all nine sleeve questions on 24 Aug and gave the aperture as **67 x 118 mm**. Ours is **108.00 x 57.00 mm**, lifted from her own `.eps` on 2026-08-22 and recorded as *"exact, not measured"*. Read in the same orientation hers is **10 mm larger on both axes**. Only two readings exist and one is impossible: either she answered the question actually asked (the **label** inside the aperture) and mislabelled it, which fails because the label cannot exceed the hole, or **our figure is wrong by 10 mm each way** and `andro-prime-sleeves-routeB-print-proof.pdf` plus the pure-white variant are both wrong. **NOTHING GOES TO A PRINTER UNTIL THIS IS SETTLED.** The arbiter is the **box cutter template she attached** (`Capillary Test Kit Artwork for Window 169x122x23mm.pdf`, plus `IVI_Tasso_Kit.pdf` and three photographs of a real sleeve, on message `1a034986c56190cc`); it is **still in Gmail and not yet pulled into `assets/packaging/dieline/`**. That download and measurement is the next action on packaging, and it is the first independent check the `.eps` extraction in `dieline/README.md` has ever had. Full scoring: [`../05_partners/labs/vitall/correspondence/2026-08-24-laura-sleeve-answers-and-aperture-conflict.md`](../05_partners/labs/vitall/correspondence/2026-08-24-laura-sleeve-answers-and-aperture-conflict.md).
- ✅ **THE REST OF THE SLEEVE SPEC IS NOW CLOSED BY VITALL (Laura, 2026-08-24).** **No new die is needed** if we build to their dimensions, which confirms consequence (c) below. **The sleeve does not move on the box** (*"they fit snug/tight"*), so the aperture needs no tolerance slack. **We supply the sleeves printed, through Vitall's print partner Mega-Pak** (`mega-pak.com`), whom we contract and pay directly and have not yet met; **they ship finished sleeves straight to the fulfilment centres**, so we never take delivery. **Setup is still about a month but is now driven by Mega-Pak capacity**, which puts an unquoted third party on the critical path. The new kitting solution **has not gone in** and changes nothing. **The IFU and the Lab Request Form can both carry Andro Prime branding, done at the same time as the sleeves**, so those are one workstream rather than three. **Owed by us: our logo as SVG or vector**, which is the only thing blocking the branded IFU and request form.
- ⚠️ **CORRECTION 2026-08-23: the compliance window is a DIE-CUT APERTURE, not a printed white area** (Keith, from a physical kit). The board is cut through; Vitall's kit-details label is stuck to the box underneath and shows through the hole. Geometry unchanged (108.00 x 57.00 mm at 34.09 mm from the left trim edge), but **corner radius is now a live dimension: measured ~3.2 mm off the raster, almost certainly a round 3.0 or 3.5 mm die spec, UNCONFIRMED.** Three consequences: (a) it explains why Vitall's `.eps` carries no cut layer, since the die is a separate tool their kitting house holds; (b) **a cutter guide is no longer optional**, and the aperture matters more than the fold does; (c) **a die already exists, so matching it exactly is what avoids new tooling cost** - any change to size, position or radius is a new tool. Both print proofs now draw it as a magenta cut line with radiused corners, not a white panel.
- ✅ **APERTURE IS BACK-FACE ONLY (Keith, 2026-08-23).** The front carries none, so Route B's marker table, headline and spine are unaffected. The identically sized rectangle on the other face of Vitall's artwork is their photo frame reusing the same dimensions, not a second panel.
- ✅ **ROUTE B CHOSEN (Keith, 2026-08-23)** - board-dominant with the black spine channel, from `assets/packaging/concept-sleeve-fronts-v7-two-routes.html`. Route A (black band dominant) is dead. **Print proofs at true size, BOTH PALETTES:** `assets/packaging/andro-prime-sleeves-routeB-print-proof.pdf` (warm white, ivory #F4F1EA board / #141414 ink) and `assets/packaging/andro-prime-sleeves-routeB-purewhite-print-proof.pdf` (pure white #FFFFFF / #000000). **Geometry and copy are identical between them; only the palette differs, and the palette call is still open.** Both come out of one generator so they cannot drift apart; verified by pixel sample, not by eye. Trim verified at 178.998 x 303.996 mm, aperture at 107.999 x 56.999 mm. **ONE COPY CHANGE, Keith 2026-08-23: "Thresholds signed off by Dr Ewa Lindo, GMC-registered GP" is REMOVED from all three fronts** (removal asserted at exactly 3 matches). "ANALYSED IN A UKAS-ACCREDITED UK LABORATORY" stays. ⚠️ **The Ewa attribution still runs on the live site and inside approved copy (CA-030). Packaging-only removal is fine; if it is not needed anywhere, that is a decision sweep, not a packaging edit - not yet decided.**
- **SUPERSEDED, kept for the audit trail:** `assets/packaging/print-proof-sleeves-v6.html` + `andro-prime-sleeves-v6-print-proof.pdf` are the **v5** design transposed onto the real dimensions. They are how the 108.00 x 57.00 figure was first derived and checked, and they are NOT the chosen design. Route B supersedes them. Do not send v6 to a printer.
- **Route B had FRONTS ONLY, so the back is new work.** Drawn in the same system and banded around the aperture (brand above / aperture clear / regulatory below). Its black spine sits on the **right in reading orientation**, which lands on the same physical edge as the front's after the 180° flat rotation. **No QR on the sleeve**, per the `/activate` deprecation - the sampling QR belongs on the insert.
- **`12_operations/automation/pdf.js` written 2026-08-22**, companion to `shot.js`: renders HTML to a dimensionally exact PDF. Chrome's `--print-to-pdf` CLI rounds the page size (gave 184.83 mm for a 185 mm page), which is fine for a slide and not for artwork someone measures.
- **Model = SLEEVE + universal INSERT, not a custom rigid box** (Vitall-confirmed 2026-06-03). Vitall dispatches in an AP-supplied sleeve over their existing kit + includes an AP welcome/instruction insert. We do NOT control the box interior, so the "premium reveal / die-cut tray" ideal is **not** deliverable now; premium must live on **sleeve finish + insert card**. A full rigid box may become possible when Vitall moves to in-house printing (next few months) = a Phase-2 upgrade.
- **MOQ 500 sleeves, kitting FOC.** Insert + sleeve-back are **universal** across kits; only the sleeve **front** is kit-specific (each = its own 500 run). ✅ **The per-design reading is CONFIRMED by Vitall (Laura, 2026-08-24): *"Per sleeve design."*** It was an assumption until then, and it is what makes deferring Kit 3 a real saving rather than a presentational one: a Kit 1 + Kit 2 first run is **1,000 sleeves**, not 500.
- **Hard constraints:** match Vitall's exact kit dimensions (dieline: PNG now filed at `assets/packaging/dieline/vitall-2025-box-design.png` (2026-08-22); the print-authoritative `.eps` (14.5 MB) and `.pdf` (59 MB) stay in `~/Downloads`; faces 179×152mm, flat 179×304mm, two faces stacked with the lower one rotated 180°); **leave a white cutout on the BACK** for Vitall's lot/expiry/compliance label (do NOT design our own LOT/expiry block); do NOT reproduce or alter Vitall's validated collection steps on our insert (validity/liability: our insert = welcome + dashboard-activation pointer only; collection steps stay on Vitall's IFU, which can carry our logo); kit is pre-linked at order creation, so wording is "**activate / see your results**", never "register your kit".
- **Design direction (research-led):** warm-white-led exterior (ivory ~#F4F1EA, not surgical white; black is the *riskiest* choice in a health frame), **promote UKAS/IVD/CE credentials to a legible front line** (they're the #1 trust lever, not back-panel fine print), premium comes from **material** (heavy uncoated board, soft-touch, deboss, black/gunmetal foil) not artwork, and a **welcome card** is the evidenced anxiety-reducer. Large emblem uses the **outlined** mark (solid reads too heavy at format).
- **Artefacts** in `assets/packaging/`: `concept-sleeve-v5.html` (real assets), `concept-sleeve-fronts-all-kits.html`, `printer-brief.md` (quote-ready, unknowns flagged `[TBC]`).
- **Open before any print:** first-run scope (rec: Kit 1 + Kit 2 sleeves 500 ea + 500 universal inserts; defer Kit 3); ~~exact white-window + fold coords from the dieline~~ **WINDOW LIFTED FROM THE `.eps` 2026-08-22 (exact, not measured): 108.00 x 57.00 mm, 34.09 mm from the left edge, 36.91 mm from the right (NOT centred, 2.8 mm left of centre), vertically centred to within 0.25 mm, 22.7% of the panel. That is 27.0 mm WIDER and ~19.5 mm LOWER than the placeholder in `concept-sleeve-v5.html`, 47% more area, so v5's back face needs re-laying-out, not nudging. Trim confirmed from the file's own HiResBoundingBox: 507.4016 x 861.7323 pt = 179.00 x 304.00 mm. ⚠️ **The `.eps` is NOT a dieline: no spot colours, no cut/crease layer, one page. It is Vitall's printed artwork (InDesign, authored by Laura Sutton, 14 Aug 2025).** So the FOLD LINE cannot be closed from it and is assumed at the 152.00 mm midpoint, which the geometry supports exactly; ~~a real cutter guide is a fresh ask of Ben~~ **the cutter templates ARRIVED from Laura on 2026-08-24 and are still sitting in Gmail unmeasured, and they put the 108.00 x 57.00 figure itself in dispute at 67 x 118 mm. Treat everything in this bullet as PROVISIONAL until they are measured** (see the red item at the top of this section). Working, extraction method and provenance: `assets/packaging/dieline/README.md`;** insert size vs kit interior; Ewa/compliance sign-off on insert copy; warm-white-vs-pure-white + ink-black-vs-#000 brand calls. **QR fix owed:** per the `/activate` deprecation, the generic sampling QR goes on the **insert** (not the sleeve back) and "activate your kit" → "scan to see how to take your sample"; the committed v5 concept predates that decision.

## Blog skin (`.blog-skin`): SHIPPED 2026-05-29 (`ec42a54`), 🔴 SUPERSEDED IN DIRECTION 2026-08-29

🔴 **Keith approved `blog-F.html` on 2026-08-29 and the blog adopts Direction F.** This skin is still live and is not deleted; it retires with the rebuild. Its two departures from the brand non-negotiables (the cream ground and the hard offset block-shadow) do NOT carry into F: the block-shadow is a statement of flatness that F's ambient shadow contradicts by design, and the dot pattern has no F equivalent. Record: `09_website-app/design/mockups/journey/blog-F.html`.

Brutalist editorial category live: layout + listings + 10 MDX components (`ClinicalInsight`, `SystemAlert`, `PublishedEvidence`, `InlineKitCTA`, `SysHeading`, `NumberedHeading`, `BlogToc`, etc.), all 5 articles converted + em-dash-free, listings rebuilt with dynamic category filter, TOC surfaces SystemAlert/References. Cream surface + scoped block-shadows; accent red dropped. Implementation + CSS-cascade gotchas are in `09_website-app` (`styles/base/blog-skin.css`; custom classes like `brutal-shadow` are plain CSS, NOT Tailwind utilities; apply unprefixed). _(The old memory index line calling this "uncommitted / listings filter open" is stale; it shipped.)_

## Design system: FORMALIZED (2026-04-27)

Audit done + system formalized: tokens in `brand-guidelines.md` v2.0 + `09_website-app` `canonical-site/shared/design-system.css` + `styles/themes/{brand,app}-theme.css`, living style guide at `canonical-site/design-system/index.html`. Radius 0 + no shadows globally enforced via `!important`; palette black/white + `gray-*` only (no `stone-*`/`zinc-*`); status colours app-only. Known CSS-cascade gotcha (`.glass-panel` forces `bg-white`, overrides any `bg-*`) is tracked in `09_website-app`.

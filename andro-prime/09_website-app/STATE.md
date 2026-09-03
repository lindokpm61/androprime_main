# Website / App: Current State

Volatile, dated status: what is live / verified / owed **right now**. Durable architecture and access mechanics are in `CONTEXT.md`; this file is the moving layer. Update the date whenever a line changes.

_Last updated: 2026-09-03 (🟢 **THE DETAIL-PAGE PASS HAS STARTED, AND THE SYSTEM NOW HAS ONE
CONTAINMENT GRAMMAR.** `/kits/testosterone` is the pilot: 5 needle openers, `img-6` as a plate beside
uncontained argument prose (the SAME asset this kit uses on `/` and `/kits`, so nothing is added to
CA-045), and the panel strip under "Five numbers" linking back to `/kits`. Then the four boxed prose
grids (`.f-step`, `.f-spec`, `.f-bio`, `.f-faqgrid`) were folded into one print treatment, a rule
above and nothing else, and the temporary `-open` modifiers were retired. ⚠ **This reaches
`/how-it-works` too, by design**: it is an F page and the containment ruling is system-wide. Verified
across 8 routes: no errors, no overflow, `tsc` clean.
🔴 **I DESTROYED 1,573 OF 2,271 LINES OF `f-primitives.css` DOING IT, AND THE VERIFICATION PASSED.**
The fold script located each modifier block by its opening comment and searched forward for the next
top-level comment; the search overshot and the two deletions took **134 selectors** with them, including
the grid system, footer, cookie banner and hero film. The post-check tested **brace balance**, which
passed, because a balanced deletion is still balanced. It surfaced only when a grep for a grid class
hit the backups and not the live file. Restored from `f-primitives.css.bak-preFold` (0 selectors
missing) and redone with exact-string replacements only; the broken state is kept as
`.broken-2026-09-03`. **The lesson is the invariant, not the loop:** for a deletion, count the units
that must survive and compare, because syntax checks cannot see a well-formed deletion. Logged as
observation 581, which notes the skill already documents this exact failure under a heading about the
observation LOG, so its rules were applied there and not to the stylesheet in the same session.
▶️ **NEXT: `/kits/energy-recovery` and `/kits/hormone-recovery`**, which still have 0 section rules and
0 photographs, plus `rightFor` and the blurb's explanatory half to rehome, and `why` to add to the
`/kits` panel. Earlier: 🟢 **FRAME O2 IS BUILT ON `/kits`, AND THE ANSWER TO "IS IT CONGRUENT" WAS
NO UNTIL IT WAS.** Keith asked whether O2 was congruent with the homepage **on the dev server**.
Measured: the mockup renders Geist headings with 0 section rules, the dev server renders Newsreader
with 6 on `/`. **The journey frames predate the 2026-08-30 typeface ruling**, so judging congruence
from the mockup judges the wrong type system, and O2 as drawn had also dropped the needle device.
Both resolved by building it: `/kits` now leads with the panel (nine markers as three FUSED bands on a
shared track, absorbing the old comparison table and the cards' spec rows), then three light cards
each carrying a miniature strip, then the C1 money block moved AFTER the choice. **Pill-radius
elements 60 to 30** (the homepage is 50), **tick-list items 9 to 0**, page height 7485px to 5338px.
`tsc` clean, verified at 1440 and a true 390, bands fuse at both, no overflow. 🔴 **Building it found a
rule that had NEVER worked: `.f-tray-flag`** (Kit 3's accent ring) sits at line 100 while `.f-tray`
sets `box-shadow` at line 111, equal specificity, so the base overwrote the modifier and **Kit 3's
ring never rendered once**. Third instance of the source-order tie this file already names twice
(`.f-btn-ghost` transparent, `.f-blab` 30% oversized). Fixed on SPECIFICITY, `.f-tray.f-tray-flag`
(0,2,0), not by moving lines. ⚠ Two mobile lessons recorded in DESIGN.md: the panel track **narrows
and never stacks** (stacking gapped every row and broke the bands into nine separate rows, measured
80px where the design needs 0), and `.f-fine`'s 66ch cap plus 0.04em tracking made the trust line
wrap to three ragged lines. ▶️ **NEXT: the three kit detail pages**, then fold `.f-steps-open` and
`.f-spec-open` into their base classes. ⚠ `kits-F.html` Frame O2 is the drawn proposal and Frame O is
now stale against the code. Earlier: 🟢 **KEITH RULED THE COPY PRE-FLIGHT IS A SHIP GATE, NOT A STEP GATE, AND
THE REGISTER THAT MAKES THAT SAFE NOW EXISTS.** Redesign work on `redesign/direction-f` is in test and
is not subject to copy pre-flight at each step; the pre-flight runs once at the final stage and picks
up everything needing change or re-approval. **Same shape as the CA-045 ruling of 2026-09-01: the gate
governs SHIPPING, not creating**, and this branch deploys nothing. 🔴 **The risk the ruling creates is
not the deferral, it is the amnesia**: a pre-flight run against the finished branch reads the copy that
is THERE, never the copy that was moved, shortened, dropped or parked on the way. So
`redesign-copy-register.md` now accumulates one line per step that touches customer-facing words, and
the final pre-flight reads it first. Seeded with 8 open items, including the FAI verdict contradiction
(item 6), which is **wrong on `main` today and independent of the redesign**. Design-only changes
(typography, spacing, containment, colour) are explicitly out of scope for the register. 🟢 **FRAME O2
IS DRAWN**, `kits-F.html:1008`: /kits restructured so the panel leads as one instrument (nine markers
as three fused bands on a shared track), the cards go light and three-across carrying a miniature of
it, and the C1 money block moves after the choice. Drawing it found two things: `men's health blood
test` is an SEO-flagged underserved keyword (KD 9, kit-page intent) so that h2 is a gate not a remark,
and **adding the frame silently restyled the APPROVED Frame O** because one of 17 new class names
(`.prow`) already existed as its hero price rows. Renamed, Frame O verified intact. Frame O2 needs a
fresh sign-off: it inverts an approval, unlike everything else this session. Earlier: 🟢 **TWO HOMEPAGE TYPOGRAPHY DEFECTS FIXED, AND BOTH TURNED OUT TO BE
INHERITED RATHER THAN AUTHORED.** Keith asked whether /kits used the same fonts as /. Both pages paint
the identical three faces, so the naive answer was yes; comparing COMPUTED styles across all six F
routes instead found **13 headings rendering in the body sans**, eight on `/` including its own kit
card titles, and **the homepage price set in JetBrains Mono** while /kits set the same £ figure in
sans. 🔴 **Neither was the page's fault.** The headings: `styles/base/globals.css:25` still carries the
pre-F rule `h1,h2,h3,h4 { @apply font-sans font-black }` ("Brand rule: all headings use Inter
font-black"), superseded 2026-08-30 and never removed, so every correct F heading was one that had
individually overridden it. It wins on SOURCE ORDER, because f-primitives is `@import`ed before
`@tailwind base` and **Tailwind's `@layer base` is a build directive, not a native cascade layer**, so
a `:where()` fix tied at (0,0,1) and did nothing. Fixed with `.f-page :where(h1,h2,h3,h4)` at (0,1,0),
which beats the legacy rule and still LOSES to any family stated on purpose (RelatedArticles keeps its
sans, `.f-foot h3` keeps its mono). The price: `kprice` exists in exactly one mockup in the repo,
`directions/v1-2026-08-27/A-specimen.html`, **Direction A, rejected** — the build took F's size,
weight and tracking and A's typeface. F's own frame (`F-field.html:454`) declares no family at all.
Now sans, which also stops a commercial figure reading in the face that carries blood results.
Verified by computed-style sweep across 9 routes plus screenshots: `/` now 17 Newsreader + 2 mono + 0
sans, prices sans; `/about`, `/faq`, `/blog`, `/contact`, `/terms`, `/privacy` each show exactly one
serif heading, the shared cookie banner, which was already F. ⚠ One deliberate sans heading remains and
is correct: `.f-prow-t`, the /kits hero price-list rows. ⚠ 8 RelatedArticles headings on the three
detail pages keep an explicit Tailwind `font-sans` and are **unruled**, pending Keith. Earlier: 🟢 **`/kits` NOW SPEAKS THE HOMEPAGE'S LANGUAGE, AND THE DIAGNOSIS THAT GOT
IT THERE WAS NOT THE ONE THE RULE AUDIT PRODUCED.** Asked whether the homepage design should be copied
across, the first two answers were code-level and both ranked the problem wrong. The stylesheet is
shared, so the CSS "had already propagated": false in effect, because the 2026-09-02 rhythm rule is
`.f-h2 + .f-lede`, an ADJACENT-SIBLING selector, and on all four kit pages the heading is the last
child of its wrapper. **Same stylesheet, same class names, rule never fires, and every name-based
audit reports the page compliant.** Then a screenshot of each page showed what the rule audit could
not: **the homepage carries six photographs and the kit pages carried zero**, and the kit pages drew
every block inside a box, three grey wells nested inside a white card inside the page. A rule audit
enumerates what was RULED, and nobody rules "the homepage has photographs". **Three of the four fixes
are in on `/kits`:** the three kit cards take the SAME photographs as the homepage kit cards for the
same kits (`img-6`, `img-7`, `img-3`, matched by slug, so **nothing is added to CA-045**); the four
process steps and the three spec wells are uncontained to hairline columns, via MODIFIERS
(`.f-steps-open`, `.f-spec-open`) because `.f-step` and `.f-spec` are also drawn by the three detail
pages and `/how-it-works`; and the section openers are in, four of them, hero and closing CTA
excluded per the homepage's convention. `.f-kit .f-shot-cap` turned out to have been written on
2026-09-02 with **no call site**: the kit-card photograph was designed and never built. 🔴 **THE BAND CROP SHIPPED TWO DECAPITATED PORTRAITS AND A SCREENSHOT PASS DID NOT CATCH IT; KEITH
DID.** The band was first set at 3/1 to land the photo near the homepage's 343px, a ratio derived from
a neighbouring layout's HEIGHT, and `object-fit: cover` pays for a wide box in source height: 3/1
threw away 50% and 56% of frames whose subjects sit high, so both men lost their heads. Eased to
2.4/1 AND given a per-image focal point (`--focal`, a REQUIRED field), because ratio alone still cut
img-6's hair. **The verification pass had confirmed every property of the container** (present,
full-bleed, greyscale, correctly inset) **and nobody looked at the man.** `tsc` clean,
re-verified by screenshot at 1440 and a true 390, subjects intact, no horizontal overflow at either. 🔴 **THE FOURTH FIX
IS BLOCKED ON KEITH, NOT ON WORK: the `/kits` hero is still a white block** while the homepage hero is
full-bleed film, and all seven existing photographs are spoken for, so closing it needs either a new
generated asset (**a new CA-045 item, on a packet still sitting in drafts**) or a decision to reuse
one. ▶️ **NEXT: the three kit detail pages, then fold the two modifiers into their base classes.**
⚠ `kits-F.html` still predates all of this and has not been updated; code is ahead of the approved
frame and Keith has not yet ruled which way to reconcile. Earlier: 🟡 **THE CA-045 PACKET IS RAISED AND SITTING IN DRAFTS, NOT SENT.** Nine items as seven
questions, ten attachments, to Ewa; sending is Keith's act. Expected answer count is **7**. Building it
corrected three things this file had wrong, all found by opening the images: nothing is live (`main`
carries no `frontend/public/home/` path at all), `img-5`'s alt text describes the opposite of the
photograph, and the set is in colour rather than black and white. **Alt text is not evidence.** Earlier: 🟢 **A LONG DESIGN SESSION, AND THE HOMEPAGE IS MATERIALLY DIFFERENT FROM THE ONE
DESCRIBED FURTHER DOWN THIS FILE.** Eleven changes, all on `redesign/direction-f`, which deploys
nothing. The conflict-free receipt took the inverted ink panel; the footer stopped saying "wellness
information service" in BOTH places it said it; amber means caution only, and both sides of that
double meaning turned out to be already in breach of written rules; the emptiest bento card (67%
empty in one 423px block) is fixed; **the direction’s scroll choreography was never ported at all**,
so 36 reveals were firing at page load to an empty room; the page gained a device of its own, the
readout’s own track and needle as section furniture plus a print sidenote; **prose left its cards,
twelve down to five**, which dissolved the empty-card defect rather than patching it; the hero data
field is ported, the last unported layer bar one; the body rhythm is proportional and the measures
are capped; the captions came off the photographs. DESIGN.md and PRODUCT.md were reconciled against
all of it, and PRODUCT.md’s terminology section had been naming the wrong file and the wrong words.
🔴 **Still the only merge blocker: CA-045, now nine items, needs Ewa and Keith.** 🔴 **And twelve
verdict-vocabulary instances are live on `main`**, on the two landing pages. ▶️ **PICK UP HERE is at
the top of this file.** Earlier: 🟢 **THE RETIRED VERDICT VOCABULARY GOT A MECHANICAL CHECK, AND IT FOUND TWELVE LIVE
INSTANCES THE MOMENT IT RAN.** `compliance-preflight` reads the allowed words out of
`resultSeverity.ts`'s `BADGES` map at run time, so the scanner and the customer's result card cannot
drift; a derived allowlist rather than a blacklist, which is why it caught "Suboptimal", a word on
nobody's retired list. HARD on a verdict field, REVIEW on the prose shape. 49 new test cases, over
half negative, because `lab: 'Lab normal'` sits on the same line as a checked field and must stay
clear. 🔴 **The twelve are on `main`, not this branch**: 4 on `/lp/energy-recovery` and 8 on
`/lp/hormone-recovery`, both deployed, and one repeats the free-testosterone defect already found on
`/kits/testosterone` (graded Low at 0.231). NOT fixed here — live sample-panel copy is its own change
with its own pre-flight. ⚠ The context guard was too narrow twice in one hour and both misses were
SILENT, the second hiding all eight live rows because that page names the marker `name:` and the kit
pages say `label:`. Earlier: 🟢 **THE CRITIQUE BACKLOG'S CORRECTNESS AND ACCESSIBILITY GROUPS ARE CLEARED, AND THE KIT ROW IS FINISHED.** The retired Normal/Borderline/Low vocabulary is gone from all three surfaces including the mockup, and two of the eight instances were worse than a wrong word: the homepage's testosterone row was an unmarked third SPLIT, and `/kits/testosterone` asserted free testosterone was Low on a warn bar at a value the engine calls In range. UKAS claim standardised, 11 short-form instances to 0. A11y batch: amber foreground glyphs 2.18:1 to 8.24:1, `.f-spec-k` 4.10 to 6.78, focus designed for the first time (0 rules to 7), tap targets 13 per route to 1 exempt, `<header>` landmark added, heading skips to 0. The value marker was collateral damage from the band-contrast fix and is now a cased needle standing proud of the track. **The two cheaper kit cards are finished**: the void was photo-SHAPED, and photographs alone only halved it because the void was the missing photo HEIGHT, closed by a 4:5 portrait crop above 900px. Two new generated images, img-6 and img-7, added to CA-045. **KEITH RULED: CA-045 governs SHIPPING, not creating.** 🔴 **Still the only merge blocker: CA-045 needs Ewa and Keith.** ▶️ **PICK UP HERE is at the top of this file.** Earlier: 🟢 **THE DUAL-AGENT CRITIQUE RAN AND THREE FINDINGS WERE FIXED.** The consent banner covered the primary CTA on all six F routes at 390 including every Order button, and cleared them by 19px at 1440, which is why nobody saw it; now 0 blocked controls on 6 routes x 2 viewports. The two-range readout was 1.32:1 and 1.51:1 with no legend; now 3.17:1 with a key and the ours band nested inside the lab band. `.f-blab` rendered 30% oversized on every instance because a prior specificity fix re-asserted two of its four contested properties and left the rest losing. **Still open:** the retired status vocabulary is live on TWO pages, not one, because the 2026-08-17 ruling was applied only to the page the pre-flight was pointed at. Earlier: 🔴 **THREE MORE, AND ONE WAS A DUPLICATE RULE QUIETLY KILLING ITS OWN FIX.** The ghost button rendered **fully transparent** against the direction's frosted 55% white: `.f-btn-ghost` was declared TWICE, the frosted version added above and the older `background: transparent` sitting LATER in the file, same specificity, so source order decided it and the new rule never applied. Measured `rgba(0,0,0,0)` against the direction's `srgb 1 1 1 / 0.55`; over the hero's near-white wash a transparent button reads as a plain white one, which is exactly what Keith saw. Collapsed to one rule. **The arrow was also wrong**: every mockup sets it as the typographic glyph `&#8594;` in the button's own face and the port used a stroked SVG path, a visibly chunkier arrow. Now text, in all four pages, so it inherits the type ruling instead of drifting from it. **And the close section had 20px under it**: `.f-close` was using `--f-sec-below`, the heading-to-content value, where the direction's `.close` is a full section and takes the gap on both sides. Now 130px from the last CTA to the footer. All three verified against the direction side by side: ghost, pip size and pip background now identical, with only the FACE differing, which is the typeface ruling working. Earlier: 🔴 **KEITH FOUND FIVE MORE PORTING OMISSIONS BY EYE, AND THE RECONCILER CANNOT SEE ANY OF THEM BY CONSTRUCTION.** Square photo corners inside rounded cards (`.f-core` was missing `overflow: hidden`), **no hover lift on any panel**, no hover lift on any button, no rest shadow on a button, and **the decorated arrow chip absent entirely**. All five were sitting in `F-field.html` the whole time. 🔴 **The reconciler's compare loop does `if (!appList) continue`**, so a property the spec declares and the app OMITS is skipped rather than reported: it can only find disagreements between two present values, never an absence, which is the failure mode a port actually has. A twenty-line probe for the omission case found the rest immediately. Now ported at the direction's own values: tray and button lift to `--shadow-ambient-lift` (a new token, the same elevation's second state, not a second elevation), the tray rises 2px, and the arrow sits in a 32px translucent pip that nudges `translate(3px,-1px) scale(1.06)`. **The pip is styled on the SVG rather than a wrapper span**, because `ARROW` is one shared constant across 24 call sites in four pages. Asymmetric padding is applied via `:has(svg)` so a button without an arrow stays even. All of it reduced-motion guarded. Earlier: ✅ **THE HERO FILM IS IN, AND KEITH CAUGHT THE CROP BY EYE.** The clip was ported and the frame was sliced top and bottom: the source is 1280x720 (**1.778**) and the hero, sized to its own content, was **2.031**, so `object-fit: cover` filled the width and threw away the height. **87.5% of the frame survived, then `scale(1.14)` took another 14%.** The cause was one omitted line: the direction's `min-height: calc(100dvh - 56px)`, which makes the box NARROWER than the source so the full height survives and a little width is trimmed instead. Now 100% vertical. ⚠ **The hero's height is part of the film's framing, not just its size**, and it also makes "Scroll for a sample result" mean something. 🔴 **And a second defect the harness caught, not the eye: `@media (prefers-reduced-motion: reduce) { video { display: none } }` LOOKS correct and is not.** It hid the element while the browser went on downloading all 726KB and decoding every frame: display none, paused false, currentTime advancing. **The gate belongs on `<source media>`**, where an unmatched query means no source is picked, nothing is fetched and the poster paints. Measured after the fix: **0 mp4 requests and readyState 0** under both reduced-motion and mobile, 1 request and playing otherwise. Earlier: ✅ **THE HOMEPAGE IS BUILT IN DIRECTION F, FROM THE DIRECTION ITSELF.** Keith asked why `F-field.html` was not among the five F pages. It is not a route, it is a mockup, and the answer underneath is worse: **it is the HOMEPAGE design** (`8c8066f`, six directions, Keith picked F), five pages had been built from frames DERIVED from it, and the homepage was the one page not among them. Its headings are the monitoring thesis verbatim: *You don't know which question you're asking yet*, *We give the thinking away*, *We do not sell you the answer*. Now built, and it is the only F page with no intermediary between it and the direction. Copy is the DIRECTION's here rather than the live page's, inverting the kit-page rule, because the funnel model names the live homepage a **lag** in its own text and the direction postdates the thesis. 🔴 **CA-045 IS NOW A MERGE BLOCKER**: the five photographs are inside that gate together with the hero film, it needs Ewa AND Keith, and its own words are that it arms *when a direction is built into the site*. This is that moment. The branch deploys nothing, so building is safe and MERGING IS NOT. 🔴 **And the pre-flight found 2 HARD, both verbatim from the approved direction and neither introduced by the rebuild** ("Nothing here is a diagnosis", and "treats" in the regards-as sense). Both read as false positives; **neither is self-cleared**, because a signed exception needs a CA number. The notable part: CA-045 records the scanner as N/A for that file because the IMAGERY has no words, so **the direction's COPY has never been scanned until now.** ⚠ **The demo card ships with no CTA on purpose**: the first draft linked to `/results-dashboard/demo`, which does not exist. The demo is built only as a prototype at `design/prototypes/demo-account-interactive.html`, so the free layer's second leg is inert until that route is built. Earlier: 🔴 **THE F BUILD HAD LOST THE APPROVED DIRECTION'S SPACING, AND THE JOURNEY FRAMES ARE WHERE IT WENT.** Keith compared the running site against `directions/F-field.html`, the direction he picked out of six (`8c8066f`), and said the local site does not have the same direction. He is right and the build is not at fault: **the direction sets `.sec` to 72/72, and 130/130 above 900px. The journey frames drawn later compressed it to 38/6, and the build ported the frames faithfully**, so the whole F layer inherited a section rhythm ~3.4x tighter than the thing that was approved. Restored behind `--f-sec-gap` / `--f-sec-below` (72 mobile, 130 desktop, 20 below), and the container narrowed **1240 to 1180px**, also the direction's value. **Keith ruled the direction wins over the frames**, so the frames are now owed a sweep and both disagreements are recorded in the reconciler's `RULED` table rather than reported as defects (conflicts 19 to 16, ruled 1 to 4). ⚠ **Heading SCALE deliberately not restored**: the direction runs h1 to 88px against the build's 65.6px, but changing it re-breaks the Frame O optical audit and moves every headline's line breaks on four pages. Keith's call, left as is. Verified on all five F pages at 1440 and a true 390: no horizontal overflow, typecheck 0, `next build` 0. ✅ **An `$impeccable audit` scored the two new pages 18/20**, and its one detector finding was a verified FALSE POSITIVE (a full-width bottom rule on the nav read as a card side-tab). 🔴 **One real P1 is open and NOT fixed**: `.f-spec-k` renders `--ink-3` on `--sunk` at 10px for **4.1:1**, under the 4.5:1 floor, on 12 instances across `/kits` and `/kits/hormone-recovery`. The direction's own token comment calls `--ink-3` the *floor for functional text* at 4.99:1 **on paper**, so putting it on a recessed well breaks the direction's stated contract, not just WCAG. Earlier: ✅ **KIT 2 AND KIT 3 ARE BUILT IN DIRECTION F, AND FOUR RULINGS ARE CLOSED.** `/kits/energy-recovery` (Frame Q) and `/kits/hormone-recovery` (Frame R) are ported, typecheck 0, `next build` 0, both screenshot-verified at 1440 and a true 390 and probed with `getComputedStyle` on the built DOM. 🔴 **BOTH FRAMES ARE ONE SECTION SHORT OF THEIR OWN LABELS, AND THE LABEL IS THE THING THAT CAUGHT IT**: each frame's label states its section count, and counting the sections actually drawn found Frame Q missing the symptom checklist and Frame R drawing the `Built for` heading with NO BODY. Both restored from the live pages. **This is the third instance of that defect in one file** and the file already records the first against itself (“the page has ten sections and nine were drawn”), so the checksum existed, was never run, and cost three omissions. A third absence turned up in the same pass: Frame Q replaces the sample report's Recommendation row with **commentary about the mockup**, which would have shipped meta-text as customer copy. ⚠ **The copy rule is now explicit and evidenced**: layout comes from the frame, COPY comes from the live page. Frames Q and R both propose close headlines the live pages do not carry; the Kit 1 rebuild only looked like it adopted the frame's because Frame P happened to match live exactly. **Keith's four rulings**: density was DRIFT (the three app frames converged onto the marketing values, `.f-sub` size and leading disagreements now gone, mockup drift 33 to 31); headline x-height LEFT as is; table cell marks stay the 11px CIRCLES; and the inverted panel's big label is DELIBERATE, now a named `.f-blab-lg` at (0,2,0) in both frame and build rather than the specificity accident that produced it, measured at 18.56px with its 13 siblings holding 11.5px. Earlier: 🔴 **KEITH FOUND FOUR ACCENT AND INTERACTION DEFECTS BY EYE, ON A PAGE THE OPTICAL AUDIT HAD JUST PASSED AT UNDER 1.5%.** The kit cards had **no hover state at all** where the frame lifts them and draws a 1.5px accent ring; the comparison table’s Kit 3 column was neutral grey instead of the accent tint, with no row hover; and its Kit 3 Order button was ghost where the frame makes it solid. 🔴 **The fourth is the big one: Kit 3 was still the INVERTED card, which Frame O superseded and explains** — inverting "asked the page to change colour scheme mid-scroll, which is what stopped the inverted card working in dark mode". The build was carrying a rejected design whose defect only shows in dark mode. Now the accent-ringed card with the gold `Most complete` chip. ⚠ **The lesson is about the harness**: an optical audit measures sizes and faces and has nothing to say about a hover state that does not exist, an accent that is the wrong colour, or a card carrying a superseded design. Earlier: ✅ **EVERY TEXT COMPONENT ON `/kits` IS NOW MEASURED AGAINST FRAME O, AND FOUR WERE WRONG.** Keith asked for the H1 and then for everything. A harness measures the USED size (which `getComputedStyle` does not report once `font-size-adjust` is in play) and converts it to cap-height and x-height in real px, so faces are comparable. **All five serif headings were -4.2% on cap and -16.7% on x**, which is the face and not a size, fixed with `font-size-adjust: cap-height 0.71` on the display rules while the body keeps the x-height form. 🔴 **Four REAL drifts**: the inverted panel’s H2 was a whole size small (-20.2%, the frame clamps it to 3rem and the build inherited plain `.f-h2`), the panel row title was 15px against 16.5px, and the step meta row was **absent from `/kits` entirely** while `/kits/testosterone` kept it, and 7.6% oversized when restored. **Everything is now within 1.5% except one at 3.8%**, deliberately left because `.f-h4` is a shared generic that maps onto several different frame rules. ⚠ **Headlines are still -12% on x-height and always will be**: a serif carries a lower x-height than the sans it replaced, which is intrinsic to the pairing Keith ruled. Earlier: 🔴 **KEITH SPOTTED TWO THINGS ON `/kits` BY EYE AND THE DIAGNOSIS FOUND A THIRD THAT WAS ON EVERY F PAGE: 37 OF 51 MONO LABELS WERE RENDERING IN THE BODY SANS.** `.f-page p` is specificity (0,1,1) and a bare `.f-blab` is (0,1,0), so the body rule won on every one that was a `<p>`; spans were fine, which is why it never looked systematic. It survived a typecheck, a production build, several screenshot passes and a human review, and was found by probing `getComputedStyle` on the built page. All 51 correct now. His two: the line under the CTAs was built as `.f-fine` (66ch, block, no tick) where the frame has a dedicated `.trust` (46ch, mono, flex, hanging tick), **the fourth instance of the missing-tick defect that day**; and the hero grid was `7fr 5fr`/gap 40 against the frame’s `1.35fr 1fr`/gap 44, which all three frames declaring it agree on. Both ported. ⚠ **The standfirst measure is NOT a defect**: both declare 56ch, but `ch` is the font’s own zero, so Inter resolves it 5% narrower than the Geist the frames were drawn in. 🔴 **AND THE RECONCILER WAS BLIND TO EVERY MEDIA QUERY**, because the mockups write `(min-width:980px)` and the app writes `(min-width: 980px)`, so every responsive rule filed as unpaired while the tool exited 2 and looked healthy. Fixed; it immediately found a conflict it could never have seen. Earlier: ✅ **THE MOCKUP-VS-PRIMITIVES RECONCILER IS BUILT** (`12_operations/automation/reconcile-f-css.js`, exit 0 agree / 2 drift / 1 could not run), validated against the handoff’s hand-measured figures, which it reproduces exactly. **22 conflicts and 31 mockup-vs-mockup disagreements.** 🔴 **`.f-step .f-step-foot` disagrees with three mockups on FOUR properties at once**, in the same component whose index went missing on two pages. 🟢 **The app-vs-marketing density question now has evidence and needs Keith’s ruling**: every tighter value clusters in `account-F`, `membership-F`, `results-F` and `results-states-F`, the authenticated app. Earlier: ✅ **`/how-it-works` IS DIFFED AGAINST ITS FRAME, AND THE DRIFT WAS SIX THINGS, TWO OF THEM ALSO ON `/kits`.** The step cards rendered **no number at all** (the ghost numeral is `opacity: 0` at rest and the mono index span was never emitted, so `.f-step .f-no` sat in the stylesheet with zero users); the **accent tick glyph was missing from 19 of 19 list items**, which is the same omission as the first `/kits` pass; the **hero had no call to action** where the frame carries two; **every stacked headline lost its greyed second line**; **Kit 3 had no flagship flag**; and the trust row's gloss inherited `uppercase` against its own comment. All six fixed, plus Kit 3's marker list repointed at `panel.ts`. 🔴 **`/kits/testosterone` was faithful on both of the shared defects and was the cheapest correct reference in the repo; nobody had grepped for it.** ⚠ **Four structural disagreements are NOT fixed and are Keith's call**, because in each the build followed the LIVE page and the frame drew something else: the one-column hero, the kit cards, the after-results grid, and Dr Ewa's inverted panel. Earlier: ✅ **THE FIRST DIRECTION F SLICE IS BUILT AND RUNS LOCALLY:** the shared chrome (nav, footer, drawer, cookie banner) plus `/kits` and `/how-it-works`, with the 2026-08-30 serif ruling carried on a NEW `--font-display` token (Newsreader **stand-in**; `--font-serif` deliberately untouched, it means Merriweather body copy in 517 places). 🔴 **The first pass at `/kits` got the cards visibly wrong**, because it ported the mockup's MARKUP and re-derived its CSS instead of porting the frame's own declarations; Keith caught it by eye. Now ported. ~~**`/how-it-works` was built the same way and has NOT been re-checked.**~~ **Done 2026-08-31, six defects; see the entry at the top of this file.** 🔴 **`chrome-F.html` is still UNAPPROVED**, built to be judged running. Three defects found and fixed, one of them pre-existing and live (`.f-sec` was killing the page gutter on `/kits/testosterone`). Nothing committed at the time of writing, nothing deployed. Earlier: ✅ **THE ICON SET NOW SHIPS THE NEW LOGO.** Keith approved the **Interlocked AP** mark (2026-08-30) and `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png` and both PWA icons were rebuilt in it by `02_brand/assets/logos/interlocked-ap/build-icons.js`. 🔴 **`Logo.tsx` was NOT**, because the mark has no vector master yet, so **the site is in a deliberate mixed state: new mark in the tab, old mark in the header.** ✅ **The logo-radius question is CLOSED by removal** (no container to round). ✅ **The typeface is RULED** (Keith, `c4d477c`): a **serif headline over a humanist sans**, which changes Direction F's all-sans drawing; faces unchosen, Inter and Geist were never choices. Earlier: ✅ **THE REBUILD HAS STARTED: `/kits/testosterone` IS BUILT IN DIRECTION F**, the first of 46, with the reusable primitives extracted to `frontend/styles/components/f-primitives.css`. 🔴 **It proved the token set INCOMPLETE, which was the point: typography was missing entirely, and the typeface change Inter to Geist has never been ruled.** Building it also found two defects in the approved frame, including a routing card whose accent the CSS never rendered. 🔴 **Nothing is pushed, so nothing is deployed, and parallel sessions accidentally committed FIVE unrelated docs commits onto the redesign branch**: read the ▶️ PICK UP HERE handoff before touching git. Earlier: ✅ **THE REBUILD IS UNBLOCKED. Direction F was uncompilable in this codebase and had been since it was approved** — and Keith's ruling releasing the old rules already existed, dated 2026-08-27; it had simply never been propagated. **Three layers were enforcing the superseded rules**: the token files, a top-level `tailwind.config.ts` override zeroing every radius and shadow utility, and a `* { border-radius: 0 !important }` in `globals.css` that beat even arbitrary values. All three now carry F. **Verified a visual no-op**: 10 routes at 1440 and 390, 18 of 20 byte-identical, the other two differing by one grey level of antialiasing. 🔴 **Two things the 08-27 ruling did not cover are open**: F's accent is the borderline status colour doing double duty as a sales colour, and F rounds the logo mark. Both in `02_brand/2026-08-29-direction-f-supersedes-v2-non-negotiables.md`. Earlier: ✅ **THE FAI SWEEP IS DONE, AND IT WAS EIGHT DEFECTS ON LIVE PAGES, NOT THE THREE THE HANDOFF NAMED.** The worst were not wording: `/kits/testosterone` and `/lp/hormone-recovery` badged FAI **`Borderline`** on the one marker the engine refuses to grade, and **`/lp/testosterone`, the page every record cites as the FIXED one, was still drawing an amber verdict bar under it** — caught only by a screenshot, because a coloured bar has no words for a grep or a copy scan to find. All five unapproved surfaces now read from `frontend/lib/kits/panel.ts`; `kit-3-hormone-recovery-check.md:75` and the `kits-F.html` mockup were swept too. 🔴 **One item is escalated, not fixed:** `/faq` sells "free testosterone via FAI" in copy and schema, which is CA-026-approved wording that contradicts the ruling and misdescribes the panel; drafted replacement and owners are in the Learn entry. ⚠ Working tree only. Earlier: ✅ **`blog-F.html` APPROVED, so the blog adopts Direction F and `blog-skin.css` is superseded in direction.** Also this session: the marker-count defect fixed across six surfaces behind one new source of truth, **the 404 built** (there was none), and **eleven missing chrome surfaces found and drawn** after Keith spotted the footer. 🔴 **Nothing is deployed: all code is working tree only.** Read the ▶️ PICK UP HERE handoff first. Earlier: ✅ **THE MARKER-COUNT DEFECT IS FIXED, AND IT WAS ON SIX SURFACES, NOT TWO.** The handoff named `/how-it-works` and `/faq`; grepping the fact before editing found four more, and the worst was the pre-results dashboard calling a five-marker kit **"the two markers"**. All six now render from one new source of truth, `frontend/lib/kits/panel.ts`, so the panel cannot drift again; `scripts/test-quiz-routing.ts` guards the Kit 1 sentence the way it already guarded Kit 2. Typecheck, build and the quiz regressions pass, compliance pre-flight on the extracted copy is 0 HARD / 0 REVIEW, and every changed surface is screenshot-verified at 1440 and a true 390. ⚠ **NOT deployed: committed to the working tree only.** 🔴 **One thing is owed to Keith and one to Ewa** (see the entry below): `/kits/testosterone`, `/kits/hormone-recovery` and `/lp/hormone-recovery` still carry the FAI framing that the 2026-07-30 ruling corrected in the spec and never swept into the pages, and the new FAI/Albumin rows put clinically-ruled wording onto a marketing surface for the first time. Earlier: 🟢🟢 **THE JOURNEY SPINE IS COMPLETE.** Ten files, frames A through AD, 40 frames plus the 5 marker-card variants. The two blog frames came OFF the board (the blog keeps its own skin), and 🔴 **the gate Keith set on 2026-08-26 is now satisfied**: the mockup carries the full journey, so the rebuild is unblocked on his call. The last stage found "one template" wrong for the THIRD time (five hand-written LPs, 246 to 723 lines) and `/lp/hormone-recovery` turned out to be the Kit 3 page again, carrying a third comparison table. Earlier: ✅ **THE ACT STAGE IS DRAWN AND APPROVED**, and 🔴 **the adopted strategy has already moved under it**: the supplement shop-front spec is SUPERSEDED IN DIRECTION (2026-08-24, adopted 2026-08-25, supplements demoted to a member-priced secondary shop), so these four routes are pre-decision waitlist pages and this is the stage most likely to be redrawn. Found by the docs half of the lifecycle check; the code half showed nothing. 38 of ~47 frames drawn, **4 left**. Earlier: ✅ **THE AUTH FRAMES ARE DRAWN AND APPROVED**, and the inventory was wrong twice: 🔴 **four of the five auth routes are ONE component in four modes** (the kit-page "one template, three kits" error in reverse), and 🔴 **`/auth/consent` carries no health-data consent at all**, just an age gate and a marketing opt-in. 33 of ~46 frames drawn. Earlier: ✅ **THE BUY STAGE IS DRAWN AND APPROVED**, and it moved CA-018: 🔴 **the health-data consent is captured on `/checkout/details`**, gating payment and version-locked to `2026-06-23-v1`, not only on `/auth/consent` where the inventory had it. Buy is 4 frames not 2, because an 80-line route wraps a 177-line form holding six error strings. 29 of ~47 frames drawn. Earlier: ✅ **KEITH APPROVED `kits-F` AND `learn-F` (2026-08-29)**, on the same four boundaries as the 2026-08-28 approval, so the design record is now eight files and 25 frames. ⚠ **It approves the layouts, not the three live copy defects they surface**, which are still owed as copy fixes. Earlier: ✅ **THE LEARN STAGE IS DRAWN** (`/how-it-works`, `/about`, `/faq`), and enumerating it found a LIVE COPY DEFECT: 🔴 **the panel is understated on both Learn pages by the same two markers**, FAI and Albumin, and on `/faq` that contradicts the CA-026 approved block sitting on the same page. Also 🔴 **`/faq` is not an FAQ**: no question-and-answer pair on it, and its own schema object is called `factsSchema`. 25 of ~45 frames drawn. Earlier: ✅ **THE DEMO ACCOUNT NOW EXISTS AS AN INTERACTIVE PROTOTYPE**, `design/prototypes/demo-account-interactive.html`: the whole customer-facing app on a phone, three states, four tabs, all nine Kit 3 markers, real bands from `classifier.ts`. It is a PROTOTYPE, not a build: the funnel model's "does not exist" row still stands for the product. Copy is UNFLIGHTED and unsigned by Ewa (Keith waived it for the mockup). Earlier: ✅ **THE CHOOSE STAGE IS CLOSED**: `/kits` and the three kit pages are drawn in F, and a state nobody had inventoried was found on the way, `BUNDLES_ENABLED`, which is a second version of ALL THREE kit pages and takes the total to ≈45. Two defects were caught by looking at the render: the step numeral was crossed by body copy (a note Keith had already given once), and the CA-026 money block was unreadable in dark. Both fixed. **The page was then made less static WITHIN the motion budget rather than around it**: reader-caused responses on the kit cards and the comparison table, one load reveal spent on the sample-report bars, nothing looping, plus a proposed one-line clarification to brand-guidelines 8.3 separating ambient motion from reader-caused response. 🔴 **AND ONE FAQ QUESTION IN THE FIRST DRAFT WAS INVENTED RATHER THAN TRANSCRIBED**, now removed, with all three FAQ sets carrying their full live six and the FAQ standardised to the open grid on Keith's call. **The step cards took the selector's methodology pattern on Keith's instruction, and the adoption found a clipped glyph in the APPROVED selector file**, now fixed there too. 🔴 **Status colour is live on three marketing pages today and the redraw does not carry it across**, which is a decision that needs Keith. Earlier: 🟢 **KEITH HAS APPROVED EVERY FRAME DRAWN SO FAR ON THE JOURNEY MOCKUP** ("everything up until this point on this mock-up journey I'm happy with and is approved"). It is a DESIGN approval and it changes four things not at all: **the build is still gated** on the mockup carrying the full journey, **CA-045 stays open** because a mockup is not a live page, **the approved copy inside the frames keeps its own sign-offs**, and **`blog-F` stays not adopted** per the 2026-08-27 ruling. See the entry at the top of this file. Earlier the same day: ✅ **`/test-selector` DRAWN**, and the quiz turned out to be FIVE steps with an un-inventoried price study and email capture; the kit pages have NO shared template, so the total moves UP to ≈44. ✅ **THE STAY STAGE IS CLOSED**: `/membership`, `/account` and `/subscriptions` all drawn in F; `/founding-member-status` found RETIRED, so the stage is 5 frames not 6 and the total is ≈40. ✅ **`/membership` IS DRAWN IN F** (five frames, screenshot-verified light, dark and 390). 🔴 **THE NEXT FRAME CHANGED: `/activate` is a deprecated route and must not be drawn** — see PICK UP HERE; the frame count is now ≈41, not ≈45. Earlier: **KEITH PICKED D, then F.** F carries a film of the kitchen table on the morning the post arrived, with an illegible letter rather than the kit; his words on it are "this is the one that we will go with". Still open below: 🔴 **THE MEMBERSHIP UI AS BUILT DOES NOT MATCH THE MOCKUP, AND KEITH HAS CALLED A REDESIGN.** Diagnosis accepted: the build took the mockup's CONTENT and STRUCTURE but rendered them in the EXISTING app design system, a choice written into the top of `styles/pages/membership.css` ("same visual grammar as subscriptions.css and the results dashboard"). The two languages are systematically different: the mockup uses 1px hairline rules, a single 400px framed device with blocks divided by inner rules, JetBrains Mono tabular numerals, Inter body copy at 0.85rem, a full light/dark token set and optimal/warning washes; the build uses 4px slab borders, separate bordered cards, sans-black numerals, serif body copy and fixed black-on-white with no dark mode. **NOTHING IS TO BE BUILT until the approach is agreed** (Keith, 2026-08-26). The sequence he set: the mockup must first carry the FULL JOURNEY, every screen the user sees mapped inside it, and only then does the app get rebuilt against it. ✅ **THE FORK THAT GATED EVERYTHING ELSE IS ANSWERED (Keith, 2026-08-27): APP-WIDE.** The question was whether this is a membership-only redesign or an APP-WIDE design system change. It matters because mockup screens 1, 5 and 6 (the two-range card, the marker list, the trend) ARE the results dashboard rather than membership screens, so the mockup already assumes the whole authenticated app looks like this; and because a membership-only redesign leaves a member moving between `/results-dashboard` and `/membership` seeing two different products. **Scope, so it is not underestimated**: already drawn are the six membership screens, the two-range card (`design/mockups/2026-08-21-where-the-range-sits.html`) and the range placement study. NOT drawn are signup and passwordless login, the consent screen, checkout details, order confirmed, the pre-results tracker in its four order states, sample-failed, the results dashboard in a normal result, GP-referral routing, account, subscriptions and billing, cancellation, the retest arriving, and the failure states the mockup itself lists as omissions. Roughly 15 to 20 screens beyond what exists, several with multiple states. Proposed approach, NOT yet agreed: settle the scope fork; inventory every reachable screen and state from the live routes rather than from memory; draw the journey as a flow with no visual design so the sequence is agreed first; extend the mockup one journey stage at a time; rebuild starting from design tokens rather than page by page. Earlier: 🟢 **THE MEMBERSHIP NOW HAS A 30-DAY OFFER WINDOW, AND KITS ARE NEVER DISCOUNTED.** Decision: `01_strategy/2026-08-26-membership-offer-window.md`. **Both models run**: kits sold one-off at full retail, membership as a recurring layer on top. A membership may be JOINED only while a lab result has come back within the last 30 days; miss it and the way back in is another kit at full retail, which opens a new 30 days; nothing carries over on rejoining. **One rule covers four cases** (new customer, decliner returning, cancelled member rejoining, what carries over) which is why it is one predicate, `lib/membership/offer.ts`, and not four. It gates JOINING, never STAYING: an existing member's window is irrelevant until he cancels. **Enforced server-side** in `app/api/checkout/subscription/route.ts` (409 `offer-window-closed`), because the paywall hiding itself is not a gate; proved live, 409 with a 68-day-old result and straight through to the price lookup with a 7-day-old one. **Kits carry NO member discount for anyone**: the member coupon is off the kit checkout, the benefit is off the paywall's includes list, and `lib/membership/memberPricing.ts` is kept but DARK and re-aimed at supplements, which is what the adopted thesis actually says. It stays dark until supplements are listed in the shop, because a paywall must not sell a benefit with no delivery path. **The 'Before your first result' paywall is DELETED**: membership can no longer be bought standalone. Three top-level states now, not four: member / inside the window / outside it. The outside-it screen is a door, not a refusal, and it says so. **204 assertions (was 178), proved to fail**: sabotaging the window boundary and its anchor produced 13 failures and exit 1, including the named anti-abuse case. Typecheck, typecheck:scripts, full `npm test` and the production build all green. Earlier: 🔴 **THE COOLIFY FLAG SET HAS DRIFTED FROM `deployment/env/vars.md`, AND IT WAS FOUND THE HARD WAY.** `MEMBERSHIP_ENABLED` is **`true` in Coolify**, not off, which every doc and every commit message on this feature has assumed. So the membership UI push (`b93e832`) did not land dark: it made a £47/month paywall visible to any signed-in user, and a POST to `/api/checkout/subscription` with `productSlug: membership` returned a real **`cs_live_`** Stripe session — before the compliance read on the framing, with no membership terms, and against a price recorded as unverified. `ACCOUNT_ADDRESS_ENABLED` is **also on** and also documented `🚫 OFF` (the "Delivery address" section renders on the live `/account`), so this is a SET that has drifted, not one variable. `ACCOUNT_DATA_CONTROLS_ENABLED` appears correctly off. Keith is flipping `MEMBERSHIP_ENABLED` off in Coolify (2026-08-26) and auditing the rest against `vars.md`; **re-verify after the restart** — the check that discriminates is `/membership` for an AUTHENTICATED user, 404 when off and 200 when on, because an unauthenticated request 307s to login either way and tells you nothing. **The lesson is that a dark launch is only as dark as the deployed environment**, and nothing in this repo was checking the deployed value against the documented one: the flag convention in `lib/flags.ts` is careful and correct, and it was verified locally, which proved nothing about production. A post-deploy assertion on the live host belongs in `/wrap`. Earlier: 🟢 **MEMBERSHIP V1 IS FEATURE-COMPLETE: THE UI IS BUILT, BEHIND `MEMBERSHIP_ENABLED` (STILL OFF).** `app/(app)/membership/` is ONE route with FOUR states, not two. The paywall branch was going to print "nothing is wrong today" to a man with LOW TESTOSTERONE, because it branched on "is there a marker to log against" and folded the all-clear member together with a flagged member who has no daily behaviour to log. Caught by rendering the page against a real account rather than a fixture. "Is anything flagged" is now a SEPARATE question, and it is derived from the SAME map that badges his result card: that map moved out of `components/results-engine/StatusBadge.tsx` into `lib/results/resultSeverity.ts`, verbatim and with no copy changes, so the two surfaces cannot disagree about whether a man has a problem. **The check-in loop is marker-linked and REFUSES to cover every marker.** Vitamin D, active B12 and ferritin get a three-tap loop; testosterone and hs-CRP deliberately get NONE, because neither has an honest daily behaviour we can ask about and asking for data the app cannot act on is how a logging habit dies. **New migration `20260826_checkin_one_per_day.sql`, APPLIED and PROVED** (positive control, refusal, second positive control on the next UTC day, cleaned to zero): the table's original `unique (order_id, question_key)` stops constraining the instant order_id is NULL, so without it a double-tap inflates a member's streak. The day key is UTC in both the index and `lib/membership/checkin.ts:dayKey()`, and they must stay in step. **Member pricing resolves the DISPLAYED discount from the Stripe coupon itself**, never a hardcoded "25% off"; where a campaign code and the member price collide, `betterCoupon` gives the larger of two percentages and otherwise honours the code the customer explicitly supplied. **`scripts/test-membership.ts` is now 178 assertions (was 64) and proved to fail**: sabotaging the streak grace rule, the severity order, the adherence cap and the coupon comparison produced 7 failures and exit 1. **Flag-off proved live, not argued**: with `MEMBERSHIP_ENABLED` unset, `/membership` 404s for an authenticated user, `/api/membership/checkin` 404s, the app nav renders exactly Results / Subscriptions / Account with zero occurrences of the string "Membership", and `/api/webhooks/*` still returns 405 rather than a redirect. **The check-in write path was exercised end to end** against a real session: insert 201, update 200, unknown key 400, out-of-range 422, unauthenticated 401, and exactly one row per question per day after all of it. 🔴 **STILL NOT SWITCHABLE-ON, and the UI does not change that**: the compliance read on the membership framing is the hard gate, the membership terms are undrafted, and `STRIPE_PRICE_MEMBERSHIP` / `STRIPE_COUPON_MEMBER` are unverified. 🔴 **ASK THE CLINICIAN HAS NO DELIVERY MECHANISM.** The paywall sells it as an included benefit and the member screen renders its honest empty state; there is no table, no clinician workflow and no published answer. That is a LAUNCH dependency, not a UI gap. **Two named seams** carried forward for Ewa: the within-severity ordering in `MOVABLE_STATES` is a v1 default and not a clinical ranking, and the all-clear cadence split in `lib/membership/sync.ts` still errs in the member's favour. Earlier: 🟢 **MEMBERSHIP V1 BACKEND IS BUILT, APPLIED AND PUSHED, BEHIND `MEMBERSHIP_ENABLED` (OFF). THE UI IS THE ONLY PIECE LEFT.** Commits `f3f98e7` (schema), `47a48ba` (backend), `3a5f8b2` (cross-host fix). **Scope decision (Keith, 2026-08-26): v1 carries NO PHYSICAL SUPPLEMENTS** — the retest entitlement, dashboard and trend, the check-in loop and member pricing. That is what decouples it from a supply chain with no supplier contact yet, and it matches what Function and Superpower actually do (member PRICING, not inclusion). 🟢 **THE 'ONE LARGE ITEM' TURNED OUT TO BE MOSTLY SMALL, because two existing systems are already product-agnostic.** (1) A membership is **a new subscription SLUG**, not a new subsystem: the checkout route, `PRODUCT_MAP`, the billing portal and all FOUR Stripe lifecycle branches are slug-driven, so one slug plus one price buys checkout, renewal, dunning, cancellation and self-serve billing. (2) **`bundle_dispatches` + the `bundle-sweep` job ARE the retest mechanism** — that table was already “a kit owed to a user at a future date” with a daily sweep and an address-check email, so the sweep gained ONE pass rather than a second dispatch path. **Migration `20260826_membership_v1.sql`, APPLIED and PROVED.** `memberships` (a date plus an active check; no ledger, since the 2026-08-24 reframing made the retest an entitlement conditional on being active ON the date); `bundle_dispatches` generalised (`source`, `membership_id`, nullable `parent_order_id`); **`symptom_answers.order_id` made nullable**, which was a hard blocker — it was NOT NULL, so the between-tests check-in loop could not write a row at all. Dropping two NOT NULLs would have quietly permitted an orphaned bundle row and a shapeless symptom row, so the nullability moved into CHECK constraints keyed on the new discriminators rather than simply disappearing. **All five controls proved by attempting the write** (this repo has already shipped a CHECK that admitted the one row it forbade because `NULL or false` is NULL), **including a POSITIVE control**, without which the four refusals could equally have been an unrelated failure. Test rows cleaned up; all three tables back to zero. Types regenerated (additive but for six lines, the Row/Insert/Update variants of the two columns that became nullable). **`scripts/test-membership.ts`, 64 assertions, in `npm test`, and proved to fail.** Sabotaging the active check produced 4 failures and **exposed a defect in the suite itself**: the 36-assertion cross-product computed its expectation by calling the function under test, so it was tautological and moved with the bug. Expected set now written literally; the same sabotage produces 8. Two judgement calls are asserted rather than implied: **`past_due` COUNTS as an active member** (Stripe sets it while dunning runs and T-07 gives three emails to fix a card), `cancelled` and `unpaid` do not. Tests 3h/3i are the canaries: if a lapsed member whose date has passed is ever owed a retest, the credit ledger has returned. **Catalogue collapsed from THREE sources to one** (`PRODUCT_MAP`, the checkout route's private `SUB_PRICE_IDS`, and three dead `*_MO` constants in `lib/pricing.ts`, all naming products out of the range). Retired slugs kept but `purchasable: false`, because `productName` still feeds the account UI and four CIO payloads for anyone holding one. ⚠️ **DELIBERATE V1 SIMPLIFICATION, marked as a named seam in `lib/membership/sync.ts`: the all-clear cadence split is not yet exact.** Deciding “has this member a number to move” is a CLASSIFIER question, not a SQL one — `biomarker_values` stores only value and the lab reference range, and our action cutoff is deliberately STRICTER than the lab's (the whole point of the two-range card), so a SQL range check would wrongly mark someone all-clear. v1 errs in the MEMBER'S FAVOUR: anyone with a result gets the 90-day retest. Replace the function body with the classifier's verdict to make it exact; nothing else changes. 🔴 **THREE MORE CROSS-HOST LINKS FOUND, AND THE MISS IS THE LESSON.** The earlier audit reported “6 links in 3 files” but searched ONE DIRECTION ONLY (app routes on marketing pages) and never the mirror image. `account`, `results-dashboard` and `subscriptions` each linked to marketing routes; two were `next/link`, which cannot client-navigate across origins, so the app host could have rendered a marketing page under a noindex header. Found by accident while reading a file for its layout conventions, not by any check. Now plain `<a>` via `urlFor`. **A directional audit reports clean for the direction it was not pointed in.** ⚠️ **STRIPE: Keith created the product/price and set `STRIPE_PRICE_MEMBERSHIP` in Coolify, and it is NOT VERIFIED.** Cannot be verified from here: the local key is TEST mode, Coolify's is LIVE, and price ids do not resolve across modes, so any lookup would fail identically whether or not it was set up correctly. Owed at switch-on: confirm £47.00, GBP, recurring monthly, active, and that the id came from LIVE mode. Also confirm the four webhook events are enabled and that the Customer Portal permits cancelling this product (a member able to join but not leave is a consumer-rights problem, not a UX one). **Do NOT enable Stripe automatic tax**: under the £90k threshold no VAT is charged and £47 is the whole price. 🔴 **`MEMBERSHIP_ENABLED` IS OFF AND MUST STAY OFF until (a) the COMPLIANCE READ on the membership framing against the Phase 0 boundary and CA-026 — the hard launch gate, and the gap analysis is explicit it is a read before it is a pricing decision — and (b) the membership terms are drafted (cancellation, an unclaimed retest, results access after cancellation).** The value is the literal string `true`; it is NOT `NEXT_PUBLIC_`, so it is read live and needs no rebuild. The flag gates the SERVER path too: the checkout route refuses the slug when off, so a hidden paywall cannot be subscribed to by hand. **REMAINING: the UI** (paywall + member states from `design/mockups/membership-first-cycle.html`, the check-in loop, and the member-pricing coupon). Earlier the same day: **THE HOST MIGRATION IS COMPLETE. DEPLOY 2 IS LIVE (`d1c00cf`) AND THE 20 CUSTOMER.IO TEMPLATES WERE REPOINTED FIRST.** `andro-prime.com` now serves MARKETING ONLY; `app.andro-prime.com` serves the authenticated app. **Step 1, the templates, done BEFORE the flip so nothing depended on the 308s as a safety net.** Repointed by script (`scratchpad/cio_repoint.py`) against the App API (`https://api-eu.customer.io`, `CUSTOMERIO_APP_API_KEY`), **deliberately NOT by reading the bodies through the agent's context**: these are version-locked approved copy and retyping them risks a silent wording change. The only mutation was a regex over two exact URL shapes. **Verified by two INDEPENDENT code paths:** an action-side sweep over all 48 actions on all 23 campaigns reporting **0 remaining authenticated apex links**, and a template-side scan reporting **all 34 authenticated links on the app host, 0 on the apex, all 45 marketing links untouched and 0 wrongly moved**. Partial `PUT` semantics were proved on ONE action first: body grew by exactly 4 bytes (`app.`) and `subject`, `name`, `layout`, `preheader_text`, `from` and `sending_state` came back byte-identical. ⚠️ **The public App API has no `workflow_action_ids` field** (that is the internal shape the MCP proxies); assuming it scanned **zero** actions while reporting zero changes, which reads exactly like “nothing needed changing”. Caught only because the script prints the scanned count. Use `GET /v1/campaigns/{id}/actions`, which returns full action objects including `body`. **Step 2, Deploy 2: `CUTOVER_PHASE` 1 → 2.** Live matrix: apex `/account`, `/results-dashboard`, `/subscriptions`, `/auth/login`, `/order/confirmed`, `/supplement-waitlist-status` all **308** to the app host, and `/auth/callback?token_hash=...&type=email` **preserves the query**, which is what 308 rather than 301 was for. Apex marketing (`/`, `/kits`, `/blog`, `/authors/*`, `/supplements`, `/test-selector`) unchanged at 200. App host serves `/auth/login` and `/order/confirmed`, and 308s `/kits` and `/blog` home. **`/api/webhooks/stripe` returns 405 with no redirect on BOTH hosts.** A legacy apex `/account` link still resolves end-to-end. Apex homepage still `x-nextjs-prerender: 1` with a cache HIT; `x-robots-tag` still present on the app host and absent on the apex. ⚠️ **`protectedRoutes` in `middleware.ts` was deliberately NOT trimmed**, correcting the plan: those entries only LOOK dead: unreachable on the apex because `routeDecision` redirects first, but the app host still needs every one of them. 🔴 **Sentry lagged the deploy AGAIN and is now disproved three times as a canary:** at the moment the build id had already flipped and the behaviour had already changed, Sentry's newest release was still the PREVIOUS commit. The per-run RSC build id (`"b":"..."`) is the canary; this one went `zL3ScPGTwqsQbrX1icQZG` → `_jMn3i7owafDNQtdWQCkR`. Earlier: **HOST ROUTING IS LIVE. Deploy 1 is PUSHED AND VERIFIED IN PRODUCTION** (`c613c1d..4c66d77`). Deploy canary done properly this time: the per-run build id from the live RSC payload, captured pre-push as `lAgyCnqkAWIt0KFyMNZuC`, asserted stable across two reads, and read post-deploy as `HjTV5exWquCVS-OqYTk5o` after ~200s. **Live matrix all correct:** on `app.andro-prime.com`, `/` → 307 `/results-dashboard`, `/kits` `/blog` and `/authors/keith-antony` → 307 to the apex with the path preserved (**`/authors` is NOT swallowed by the `/auth` prefix**), `/results-dashboard` → 307 to the app-host login with `next` preserved, `/auth/login` and `/order/confirmed` serve 200. On the apex, `/` `/kits` `/blog` `/authors/*` are unchanged at 200, and `/account` → 307 to the APP-host login, which is phase 1 deliberately driving every session onto the app host. **`/api/webhooks/stripe` returns 405 with no redirect on BOTH hosts**, so Stripe/Vitall/QStash are untouched. The Cloudflare noindex rule is still present on the app host and still absent on the apex. **The apex homepage is still `x-nextjs-prerender: 1` with `x-nextjs-cache: HIT`**, so the dynamic-rendering regression did not ship. No Cloudflare purge was needed: the app host returned `cf-cache-status: DYNAMIC` throughout rather than a stale cached 200. 🟢 **VERIFIED 2026-08-26: the Supabase redirect allowlist is correct and END-TO-END SIGN-IN WORKS ON THE APP HOST.** Keith ran a real magic-link round trip on `app.andro-prime.com/auth/login` and reported it good; corroborated independently in the database rather than taken on report, `auth.users` showing a successful `last_sign_in_at` 2.9 minutes old (1 of 3 users inside 30 minutes). `verifyOtp` cannot complete unless Supabase accepted the redirect to the app host, so the round trip IS the allowlist proof. **Phase 1 is therefore complete and fully verified.** For the record, the attempt to confirm the allowlist non-destructively beforehand was INVALID and would have reported a false pass: An attempt to confirm it non-destructively via `/auth/v1/authorize?redirect_to=...` was INVALID and would have reported a false pass: a control using a deliberately bogus host returned the identical 302 to Google, proving that endpoint does not validate `redirect_to` at authorize time. Supabase enforces the allowlist only on the way BACK, so **nothing short of a real magic-link round trip on `app.andro-prime.com/auth/login` proves it**. Until that is run, the risk is that sign-in is broken for all 3 users; blast radius is sign-in only and the fix is a dashboard edit, not a revert. Originally committed as `76b7e35`, Deploy 1 of the two-stage cutover to `app.andro-prime.com` (plan: `~/.claude/plans/lets-move-to-the-delightful-honey.md`). The app host serves the authenticated app; **the apex still serves it too**, so nothing can break and the first real session on a new cookie domain has a rollback point. `CUTOVER_PHASE` is 1; flipping it to 2 is Deploy 2. 🔴 **TWO PREREQUISITES ARE KEITH'S AND MUST LAND BEFORE THIS IS PUSHED.** (1) `NEXT_PUBLIC_APP_URL=https://app.andro-prime.com` in Coolify — `NEXT_PUBLIC_` is inlined at BUILD time, so it must exist before the build, not after (the code does fall back to the same literal, so this one is belt-and-braces). (2) **`https://app.andro-prime.com/**` added to Supabase Auth → URL Configuration → Redirect URLs.** This one genuinely blocks: the middleware auth gate now sends both hosts to the APP-host login, so `emailRedirectTo` resolves to the app host, and Supabase rejects a redirect target that is not on the allowlist. Push without it and sign-in breaks. **`lib/hosts.ts` is the single source of truth for the route→host mapping**; routing and link generation read the same prefix list so they cannot drift, and `routeDecision` is pure so the rule is testable at all (it otherwise exists only in production, behind a proxy, on two hostnames, mid-cutover). `scripts/test-host-routing.ts`, 96 cases, wired into `npm test`, and **proved to fail**: sabotaging the prefix matcher to a bare `startsWith` produced exactly the three `/authors` and `/accounts-payable` failures it exists to catch, with exit 1. 🔴 **THE BLOCKER IT FIXES:** `getPublicBaseUrl` in `app/auth/callback` checked `NEXT_PUBLIC_SITE_URL` BEFORE the request host, and that is set to the apex in production, so the function was request-aware in name only — **its own comment asserted the opposite behaviour**. Harmless on one host; on two it is a login bug wearing a cookie bug's clothes (verifyOtp sets the host-only cookie on the app host, the redirect lands on the apex, the cookie is not sent, the user is logged out). 🔴 **SCOPE CORRECTION FOUND MID-BUILD: `/order/confirmed` and `/subscription/confirmed` are AUTHENTICATED pages and move too.** They sit in the `(marketing)` group but each calls `getCurrentUser()`, and the order reference is read through the **USER-scoped** Supabase client, so RLS needs the session. Left on the apex they would render permanently logged-out and the buyer would never see their order reference again, **silently reverting the 2026-08-04 fix on the highest-value page in the purchase flow**. Moving them also collapsed 4 of the 6 known cross-host links to same-host. ⚠️ **A REGRESSION I INTRODUCED AND CAUGHT ONLY BY DIFFING THE BUILD'S ROUTE TABLE:** reading `headers()` in the `(marketing)` layout to make the nav host-aware opts the **entire marketing tree** into dynamic rendering and loses the static prerender the site depends on. Typecheck, 96 unit tests, the full `npm test` chain and the rendered output were ALL green. Reverted; the marketing and LP layouts are now explicitly not host-aware, with the reason in the file. **Accepted degradation:** the two confirmation pages take one 307 back to the apex on a marketing nav click. **Rule for next time: a call added to a LAYOUT is verified by a build and its route table, never by a typecheck and a unit run.** `Nav` gained a `HostLink` that emits a plain `<a>` across hosts and a `next/link` within one, because **`next/link` cannot client-navigate across origins** and would otherwise client-render the app page on the marketing host, bypassing middleware. **`/api` is dual-served and never redirected** (Stripe, Vitall and QStash webhooks are registered against the apex). **Verified on a local production build driven with real `Host` headers:** app-host root, marketing and `/authors` all redirect correctly and **`/authors` is NOT swallowed by the `/auth` prefix**; the auth gate sends both hosts to the app-host login with `next` preserved; `/api/webhooks/stripe` returns 405 rather than a redirect on both hosts; the apex homepage is still prerendered static (`initialRevalidate: false`); and the rendered apex nav emits an absolute cross-host `<a>` for Log in while `/kits` stays relative. **Still owed after the push:** the 20 Customer.io template edits and Deploy 2. Earlier, 2026-08-25: **THE SIX UNPUSHED COMMITS ARE PUSHED AND DEPLOYED, AND THE CUSTOMER.IO LINK AUDIT IS DONE — IT WAS POINTED AT THE WRONG ROUTE.** **Three decisions taken by Keith, 2026-08-25:** (a) push all six; (b) **`/results-dashboard` MOVES to `app.andro-prime.com`, and now** — auth moves with it, which settles the cookie question, so **no wildcard `.andro-prime.com` cookie is needed and none should be set**; (c) the crawlable-duplicate exposure is closed by a **Cloudflare rule now** (Keith's action, see below), with the middleware host routing landing later as foundation item 1 rather than as an emergency fix. **PUSHED: `7143ff7..c613c1d`, and it was SIX commits, not the four the handoff said** — `0ad09a5` (Nutribl welcome pack) and `b2c74b4` (Laura's sleeve answers) sit BELOW `f8719da`, both docs-only. Worth recording because the handoff's suggested `git reset --hard f8719da` would have dropped THREE commits including `c613c1d`, the STATE commit recording the subdomain decision. Not done; nothing was rewritten. **DEPLOY VERIFIED:** Sentry's newest release is now `c613c1d2df82213a4824127dc49d4e951bf4a225`, and apex `/`, `/kits`, `/blog` and `/auth/login` all return 200. ⚠️ **But Sentry is NOT a sound primary deploy canary here, and this file previously implied it was.** Before the push, Sentry already carried releases for `07c5b7f` and `f8719da`, both of which were unpushed: a local production build with `SENTRY_AUTH_TOKEN` in the environment creates the release itself, so the signal fires on “someone built this”, not “the server deployed this”. It was usable this once only because `c613c1d` happened to be the one commit with no local build. **The primary canary stays the per-run build id served by the live host**; treat Sentry as corroboration and never as proof. 🔴 **THE CUSTOMER.IO AUDIT INVERTS THE ASSUMPTION THIS FILE HAS CARRIED. `/results-dashboard` appears in ZERO templates. TWENTY templates hardcode an absolute apex URL to a DIFFERENT authenticated route: nineteen `https://andro-prime.com/account`, and one `https://andro-prime.com/auth/login`.** So the pre-move task is real and roughly the size predicted, but it was aimed at the wrong route: work scoped from the old note would have audited the dashboard, found nothing, and read the templates as clean while twenty live templates still pointed at the old hostname. Enumerated template ids — **`/account`:** 7, 19, 22, 23, 28, 29, 35, 36, 37, 38, 39, 40, 42, 44, 45, 47, 48, 49, 55; **`/auth/login`:** 46 (T-09 Guest Purchase Account Created). Spread across the results sequences, subscriber onboarding, churn prevention, the dunning chain and the T-0x transactionals. Every OTHER absolute URL in the templates is marketing (`/kits/*`, `/test-selector`, `/supplement-waitlist`, `/`) and correctly stays on the apex. **So the move owes: 20 template edits plus 301s for `/account` and `/auth/login`, and nothing at all for `/results-dashboard`.** **Method note, because the obvious route does not work:** `GET /v1/environments/219186/templates` returns only ONE template and is not a listing of campaign content; the working call is **`POST /v1/environments/219186/templates/by_id`** with an `ids` array, which is a batch READ despite the verb. Universal search (`/search`) is fuzzy, not literal, so it cannot answer “does this exact string appear”. 🟢 **DONE AND VERIFIED 2026-08-25 — the Cloudflare rule is LIVE and correctly scoped.** Keith created it; verified by request. `X-Robots-Tag: noindex, nofollow` is PRESENT on `app.andro-prime.com` at `/`, `/kits`, `/blog`, `/auth/login`, `/kits/testosterone` and `/results-dashboard`, including on an edge-cached `x-nextjs-cache: HIT`, and ABSENT on the apex at `/`, `/kits`, `/blog`, `/kits/testosterone`, `/supplements`, `/about` and `/faq`, and on `www` (which 301s to the apex). 🔴 **It took two attempts, and the first failure is worth recording because it reported itself as healthy.** The rule was created as a **Request** Header Transform Rule, which can never affect a response, AND with the expression pasted into the visual builder's free-text Value box, so it saved as `URI Full | wildcard | r#"http.host eq "app.andro-prime.com""#` — a condition testing whether the URI wildcard-matches that literal sentence, which no request can ever satisfy. It displayed **Active** in green while matching zero requests. **The lesson for every future scoped rule: a rule that matches NOTHING is observationally identical to a correctly-scoped rule if you only verify that the blast radius is clean.** The apex-is-unaffected check passed perfectly, for the wrong reason. Assert both halves: header present on the target, absent everywhere else. **The working form is the builder, not the expression editor** — `Field: Hostname`, `Operator: equals`, `Value: app.andro-prime.com`; a raw `http.host eq "..."` expression is only valid inside the Expression Editor, which is not what the form opens in. **This rule is PERMANENT, not a stopgap.** `app.andro-prime.com` will serve an authenticated app that should never be indexed, so it stays in place after the middleware host routing lands, which is a further reason it beat a redirect: nothing has to be unpicked later. It does not stop crawlers FETCHING the app host, since `robots.txt` there still says `Allow: /`; that is intended, because they must fetch to see the header. Original recommendation, for the record: recommended shape is a **Transform Rule → Modify Response Header** adding `X-Robots-Tag: noindex, nofollow` when `http.host eq "app.andro-prime.com"`. Deliberately NOT a redirect: a redirect on that hostname would have to be unpicked the moment the middleware starts serving the app there, whereas the header is surgical, leaves humans unaffected, and composes correctly with the existing `robots.txt` (which says `Allow: /`, so crawlers still fetch the page and therefore still see the header). Remember the homepage is `s-maxage=31536000` and now edge-cached under the new hostname, so **purge Cloudflare for `app.andro-prime.com`** the first time it serves something different. Earlier the same day: **`app.andro-prime.com` IS LIVE, AND THE WEB APP GETS ITS OWN HOSTNAME UNDER THE EXISTING NEXT.JS APP.** Keith set the DNS up in-session and it verified: resolves to Cloudflare (`172.67.204.152`, `104.21.93.51`), **proxied (orange cloud)**, valid certificate, `HTTP/2 200`, `x-powered-by: Next.js`, so Coolify is already routing the hostname to the same build. **Steps 1 to 4 of the subdomain setup are done; no second service, no second deploy.** **Architecture decided (Keith, 2026-08-25): ONE Next.js app under `09_website-app/frontend`, two hostnames, routed by the `Host` header in `middleware.ts`.** No monorepo split, no forked codebase; the earlier measurement stands (the `(app)` and `(marketing)` groups share only `lib/auth/session` and `lib/flags`, so the split does not get harder by waiting). The membership app becomes new routes inside the existing `(app)` group, which already holds the dashboard, account and subscriptions. ⚠️ **Right now the subdomain serves a byte-identical copy of the marketing site**, because middleware does not yet route by host. Largely defused by accident: `lib/site-url.ts` holds a single `SITE_URL` constant, so the canonical on `app.andro-prime.com` reads `https://andro-prime.com`, the sitemap `<loc>`s all point home, and `robots.txt` names the main-domain sitemap. **Two follow-ups: `robots.txt` on the app host still says `Allow: /`** (a Cloudflare redirect or WAF rule is the no-code fix until middleware lands), and **the marketing homepage is `cache-control: s-maxage=31536000` with `x-nextjs-cache: HIT`**, so it is now edge-cached under the new hostname too and will need a Cloudflare purge for `app.andro-prime.com` the first time that host serves something different. **FOUR FOUNDATION ITEMS before any membership screen is built**, in dependency order: (1) the hostname rewrite in `middleware.ts`; (2) **`/auth/*` moves to the subdomain** so only one host ever handles a session; (3) host-aware config, a second `SITE_URL` and a `noindex` robots for the app host; (4) the membership/entitlement schema, which the gap analysis rates the one Large item and which is now just a date plus an active-membership check since the credit ledger was struck. 🟢 **DECIDED 2026-08-25, see the lead above — the auth flow MOVES to the subdomain and no wildcard cookie is set. Retained for the reasoning: the auth cookie.** `lib/supabase/middleware.ts` sets cookies with **no explicit `domain`**, so they are host-only and a session created on `andro-prime.com` will not be sent to `app.andro-prime.com`. Two routes: set the cookie domain to `.andro-prime.com`, or move the whole auth flow onto the subdomain. **Recommendation: move the auth flow.** A wildcard cookie is readable by every present and future subdomain, and this cookie gates special-category health data. 🟢 **DECIDED 2026-08-25 — YES, AND NOW (see the lead above): does the existing `/results-dashboard` move to the subdomain too?** Recommendation yes, and now, because the dashboard IS the app under the adopted decision and splitting the authenticated experience across two hostnames costs both and buys neither. Moving now costs 3 users and 1 real result; moving later costs live sessions and every results link in Customer.io. **Check first: CIO email templates are not visible from the repo and may hardcode `andro-prime.com/results-dashboard`; those need updating plus 301s.** Every in-repo reference is a relative path, so the code side is cheap. 🟢 **SUPERSEDED 2026-08-26: the pause held for new website work, but the two accessibility commits that were parked pending a decision (`e7e66db`, `07c5b7f`) were NOT reset and are now pushed and live.** The focus indicators, the `<select>` colour, the kit-tab semantics and the `aria-live` regions are in production; the evidence disclosure is live as code but dark behind `EVIDENCE_DISCLOSURE_ENABLED` (OFF), so no visible change from that one. `wip/results-a11y-2026-08-25` still exists and is now redundant. Original entry: 🛑 **ALTERATIONS TO THE LIVE WEBSITE ARE PAUSED (Keith, 2026-08-25)** until the web app is in place; the website is revisited after. Earlier the same day: **VERCEL'S `web-design-guidelines` SKILL IS INSTALLED AND HAS BEEN RUN ON THE RESULTS ENGINE; FOCUS AND ANNOUNCEMENT DEFECTS FIXED.** Installed to `.agents/skills/web-design-guidelines` (symlinked into `.claude/skills/`, `skills-lock.json` updated); it is a thin wrapper that fetches 103 rules from `vercel-labs/web-interface-guidelines/command.md` at run time. Chosen over the taste-skill family because it carries **no aesthetic opinions** and so cannot fight the brand system; taste-skill's rubric was read and would have told us to drop Inter, abandon pure black, vary the border radius, add texture and put stock imagery behind a blood result, all of which the 02_brand table forbids. 🔴 **The finding that mattered: `dashboard-panels.css` held the ONLY `:focus` rule in the entire styles tree, and what it did was `outline-none` with a white-to-#f9fafb background swap as the replacement**, which is not a perceptible indicator. Fixed: `.kit-tab` and `.result-history-select` now take `outline: 2px solid currentColor`, inset on the tabs so it stays visible against both the white inactive and black active states. **Verified by keyboard-driven screenshot in all three states**, via a temporary page since the `(app)` layout guards itself with `requireAuthenticatedUser()` independently of `middleware.ts` (that page has been deleted). Also fixed: `<select>` given an explicit `color` (appearance-none inherits the OS palette under Windows dark mode); kit tabs given `type="button"`, full `tablist`/`tab`/`aria-selected` semantics, roving tabindex and arrow-key navigation; both nurture-consent components given `role="status" aria-live="polite"` on their error and success states, **`aria-live` having appeared 0 times anywhere in the app**; the traffic-light track marked `aria-hidden` because the value, unit, range and StatusBadge verdict are all already adjacent text, so labelling it would double-announce. tsc clean, full suite green. ⚠️ **NOT fixed, needs the approval route: two em dashes in live customer-facing copy** — `OPTIONAL — STAY INFORMED` at `LowTNurtureConsent.tsx:46` and `BorderlineNurtureConsent.tsx:49`. Both files carry version-locked approved copy (CA-014, Ewa + Keith, 2026-06-04), so the label was left alone rather than edited in place. ⚠️ **Still open and now found twice:** the range bar conveys its zones by colour alone, logged by the Rams audit on 2026-08-22 at 1.28:1 amber-vs-green and found independently by the Vercel pass in a different component. Passes worth recording: `prefers-reduced-motion` covers all three animations, no `transition: all` anywhere, a skip-to-content link exists, and the `(app)` layout double-guards auth. Earlier the same day: **THE MEMBERSHIP MOCKUP IS RE-CUT TO THE ADOPTED DECISION, AND THE PUBLISHED ARTIFACT IS VERIFIED BYTE-IDENTICAL TO THE REPO SOURCE.** Reworked inside the 2026-08-25 decision sweep (commit `803cb4c`) and republished; the served artifact diffed against `design/mockups/membership-first-cycle.html` returns IDENTICAL at 60,193 characters, so the two are in step and neither needs re-doing. **Six screens now, not five**, and eight changes from v1, carried in the mockup's own changelog block: GBP 49 becomes **GBP 47**, VAT-inclusive-ready; **the GBP 99 credit is gone**, replaced by an entitlement conditional on being an active member on the stated retest date, which deletes the ledger and the expiry term; **cadence split** (day 90 is a first-cycle onboarding retest for a member with a number to move, annual thereafter, and annual from the start for the all-clear member); **a new two-range card is now the opening screen**, drawing the lab reference interval and our clinical action cutoff on one axis with the citation; **the all-clear member gains his own screen set**, deliberately not sized because the 93% non-referral figure does not transfer to a nine-marker panel and the real share is unmeasurable until about thirty results; **the check-in row is marker-linked at three taps** (sleep and steps dropped, they do not move vitamin D, and asking for data the app cannot act on is how a logging habit dies); and **Ask the clinician** appears in the published-answer form only. 🔴 **ONE FACTUAL ERROR FOUND AND FIXED ON REVIEW (2026-08-25): the paywall screen read "Price includes VAT."** Below the GBP 90,000 threshold nothing is VAT-registered and no VAT is charged, so the line asserted a tax that is not being collected, and an unregistered business must not indicate that a price includes VAT. It also contradicted the same page's own annotation two blocks down ("below it the whole GBP 47 is kept") and its own banner ("VAT position unverified"). Line deleted rather than reworded, since "cancel any time" was already carried under the CTA; the wording waits on the accountant question. **TWO MORE FOUND IN THE SAME READ.** (2) **The day-90 vitamin D row was drawn amber at 58 nmol/L.** The live classifier (`lib/results/classifier.ts`) bands vitamin D critically low under 25, low under 50, and normal to the assay ceiling, so 58 is a normal result the engine would draw green. Amber on the one number the member spent sixty days moving says the intervention failed, on the screen whose whole job is to show it worked. Now green. (3) **The h1 said "seven screens" and there are six**, and the caveat bar still called GBP 47 illustrative when it is the adopted price (the VAT treatment is what is unverified). All three corrections are listed in the mockup's own changelog. Verified by screenshot in both themes at each change, and the artifact republished from the file. ⚠️ **Flagged, not changed:** on the day-90 screen the same testosterone 10.5 that is amber and "below the action cutoff" on day 14 is drawn with the neutral "stricter than your lab" marker. Defensible either way, so it is Keith's call, not a silent edit. ⚠️ **Unchanged and still true: nothing is built, and no copy on it is compliance-checked or clinically signed.** What is no longer true is "prices illustrative" — GBP 47 is the adopted price. Earlier, 2026-08-24: **MEMBERSHIP APP MOCKUP FILED IN THE REPO, five screens, concept only.** Source: `design/mockups/membership-first-cycle.html`, published as artifact `21e25b82-cedd-4241-8817-12bb33fec378` ("The First Cycle"), https://claude.ai/code/artifact/21e25b82-cedd-4241-8817-12bb33fec378 . **Republish that file to update the artifact; keep the two in step** — filed in the repo rather than left in a scratchpad for the same reason the placement study was. Screens: day 0-14 baseline (kit tracker, three-tap check-in, results prediction), day 14-30 plan (four markers with one finding, prediction reveal, adherence streak, behaviour chart), day 30 paywall (GBP 49/month selling the retest not the app, with an explicit "your results are yours either way" decline), day 31-90 member (retest booked with a ship date, and the two-point proof rail with an empty dated second dot), and a full-width two-panel screen showing nine markers merged across two kits with the GBP 99 retest credit choice. **FAI is drawn faithfully as reported-not-interpreted per CA-034 K1**, and the behaviour chart deliberately shows behaviour rising rather than implying blood moved. Built to the live brand system: square corners, no shadows, black on white, status green/amber for data only, Inter and JetBrains Mono. Carries a black-on-white / white-on-black toggle, because the artifact viewer renders in the READER's theme and Keith read the dark render as a reversed palette. **Concept only, nothing built, prices illustrative, copy not compliance-checked or clinically signed.** Earlier: **SUPPLEMENT SHOP FRONT SPECCED, and the finding is that the commerce backend is ALREADY BUILT**: `docs/2026-08-23-supplement-shop-front-spec.md`. Subscription checkout, the `supplement_subscriptions` table, purchase / renewal / failed-payment / cancellation webhook branches, the billing portal and the account UI are all live and product-agnostic, built for the Daily Stack. What is left is a catalogue and pages job. Three findings worth acting on: **the catalogue is hardcoded in THREE files** (`lib/subscriptions/products.ts`, `SUB_PRICE_IDS` in the checkout route, `lib/pricing.ts`) and all three name products that no longer exist, so they must be collapsed before the range changes rather than fixed one at a time; **subscription checkout requires an authenticated user** while kit checkout allows a guest, which is backwards now that supplements lead the funnel, and the kit path's 3-case webhook resolution is the code to copy; and **dispatch cadence is NOT billing cadence**, which corrects a claim made earlier the same day in this file that recurring fulfilment should hook `invoice.payment_succeeded`. It should not: the D3 SKU is **365 tablets, a 12-month bottle**, and B12 and zinc are 120 capsules, 4 months each. The buy list's "per month" figures are COST per month and were read as SHIPMENT per month. Dispatch must run off a **`next_dispatch_due`** date advanced by each product's own supply duration. **There is no supplement dispatch table**, only the subscription row, and no inventory concept anywhere in the schema. **Two requirements added by Keith 2026-08-23**: products must be **CMS rows, not code** (a `supplement_products` table on the `blog_articles` pattern, one `/supplements/[slug]` template, Stripe owning price and Supabase owning editorial, and a `draft`/`live` status because copy editable without a deploy is copy editable without a compliance pre-flight); and **stock control**, where the load-bearing point is that **Stripe has no inventory management and will sell the eleventh of ten bottles**, so the gate must sit before the checkout session is created. A subscriber is a RECURRING claim on stock, so cover is measured in **subscriber-months** and the reorder alarm in **weeks of cover**, not units left. A fourth question is now owed to the 3PL: do they expose a stock feed. Earlier: **A RAMS DESIGN AUDIT OF PLACEMENTS B AND D FAILED BOTH: 13/30 and 12/30, verdict REDESIGN**, filed in `design/DESIGN-IS-2026-08-22/`. D scored LOWER than the option it was recommended over, on blind-briefed evidence. The finding that matters: the placement question is nearly orthogonal to why the design fails — 14 of the 20 principle-scores are the same number for the same reason. Both inherit **five missing interaction states**, **no heading element for the shelf**, **light-theme AA failures on the EFSA claim line of every card (3.29:1)**, a **range bar conveying its zones by colour alone** (amber vs green 1.28:1), six keyboard-unreachable actions, a **consent box binding health-data retention to marketing permission**, and an **unscoped "Ewa-approved" line sitting beneath the commerce**. None of that changes with placement. **Superseded in direction the same day**: Keith decided the shop lives at `/supplements` organised by panel, so the results page needs a route to it rather than a shelf in the report (see `01_strategy/STATE.md`). Earlier that day: (**RESULTS-PAGE SUPPLEMENT PLACEMENT: a fourth option, D "declared block", is built and recommended; Keith has not picked.** Nothing shipped, no code touched: this is a mockup decision, ClickUp `869eng0g5`, owned by `04_products/STATE.md`. **The study's source now lives in the repo** at `design/mockups/results-range-placement-study.html`, published as artifact `fbab8253-4da1-4cc4-8258-e593a3263908` ("Where the Range Sits"). It was filed because the previous session kept it only in a scratchpad, so adding option D began by recovering the source out of the published page. Republish that file to update the artifact; keep the two in step. D is B's report grammar plus an inverted full-width bar declaring the block a shop, so the thin "same on every report" chip is deleted rather than restyled. All four recorded mockup defects fixed across every variant, including **no printed price and no printed zinc dose or salt**, both being open decisions. Earlier, 2026-08-21: (**VITALL NO LONGER RECEIVES THE CUSTOMER'S REAL EMAIL OR PHONE.** `createOrder` now sends a synthetic per-user address, `${users.id}-andro-prime@vitall.co.uk`, via the new `lib/vitall/identity.ts`, and no phone at all. **VERIFIED LIVE on build `YkyBJR98Hg-R6OZScV582`** (commit `a80fb29`): build id flipped from `ZQpD7MSIamNmGhMxpVzfa`, extraction proved stable and non-empty first, site 200, and Sentry's newest release names `a80fb29bfd78e4ebd1708fc96f7d9dd02064e60a`. This is what makes Vitall's two undisableable items (auto account creation and logins on `andro-prime.vitall.co.uk`) moot rather than pending, and it removes a paid-then-400 dispatch risk when a customer already has a Vitall account under another partner. Detail in `05_partners/labs/vitall/CONTEXT.md`. Earlier, 2026-08-18: (**PLAN STEP 6.3: `gate_rendition_publish()` NOW READS THE MEDIA REQUIREMENT OFF `content_channels`**, not off `content_renditions.thumb_spec`, and the `platform`/`format` CHECK enums are replaced by a **foreign key to `content_channels (platform, format)`** — so adding a platform is one row and no code, proved by adding Pinterest with a format the database had never seen. Migrations `20260818_generic_publish_gate.sql` and `20260818_renditions_channel_fk.sql`. 🔴 **The enums had already drifted**: `platform` listed `pinterest`, `format` did not list `pin`. The media half of the gate fires on **UPDATE-arrival only** — media links cannot exist before the row does, and the INSERT path is how a run already live in Metricool gets recorded — with new invariant **I14** covering the resting state. `content_renditions.thumb_spec` deliberately NOT dropped: redundant (0/91 disagree with the channel) but five consumers read it. Doctor is now 14 invariants. Earlier the same day: **FOUR MIGRATIONS APPLIED for content-machine plan steps 5.3/5.4, the claim tier ladder**: `20260818_content_claim_tiers.sql` (`content_asset_claims`, `content_claim_sets.superseded_at`, the `content_pins_superseded` view, and `gate_rendition_publish()` re-created with a claim block), then three follow-ups — `..._tier1_nullsafe.sql`, `..._gate_on_arrival.sql`, `20260818_content_assets_claims_classified_at.sql`. **`lib/supabase/types.ts` IS regenerated** (additive only, +172 lines), which also closes the `weekly_slots` gap noted below. 🔴 **`gate_rendition_publish()` is now the phase's function, superseding `20260801_content_state_guards.sql` section 4**: every prior rule carried forward unchanged, plus one — a rendition may not ARRIVE at scheduled-or-later while its asset holds an unresolved tier 2 or tier 3 claim. **Arrival only, deliberately**: the first-applied form re-checked resting rows and would have frozen `metricool-writeback` and the id remap on 14 live assets, which makes the database wrong about the world and calls it enforcement. **A tier 1 CHECK constraint also shipped broken for ten minutes**: two branches, a nullable column, and `NULL or false` is NULL, which Postgres ADMITS — so the one row it forbade walked through it. Caught only because every control was proved by attempting the write. New nightly invariant **content-doctor I13** (13 total), RED today on 7 true findings. `tsc` clean, doctor suite green. Earlier: **Four article changes: `cholesterol-test` LIVE with the 999 chest-pain line on two surfaces (body + FAQ frontmatter), and THREE STAGED as proposed revisions rather than written to `body` (fatigue, inflammatory, and `low-vitamin-d-symptoms` correcting PHE "recommends" to "consider" on Ewa's CA-042 ruling), because on an already-published row a `body` write IS a publish via the revalidate trigger. All three held on Keith. Two mirror-sync gaps found and logged.** Earlier: **`content_channels.weekly_slots` APPLIED, and `content-doctor` I10 now measures CADENCE rather than emptiness.** Migration `20260816_content_channels_weekly_slots.sql`, smallint NOT NULL DEFAULT 1 with a `>= 1` check; only `linkedin/text-post` moves, to 2. I10 previously asked "is anything queued", which compares against 1 because 1 is the only number an emptiness test has, so a lane running at half its documented cadence passed green for two consecutive weeks. Going dark and running under cadence are now DISTINCT findings, with a regression test holding the line, and the shortfall is measured forward-only on purpose. First live run caught `linkedin/text-post` at 1 of 2 and it later cleared honestly when a real post filled the slot. ⚠️ **`lib/supabase/types.ts` is NOT regenerated for the new column** — the doctor uses its own loader so nothing is broken, but it is owed before app code reads it. Also **`compliance-tables.js` matched the fix family by hand-listed inflection**, so `fixable` walked through both advisory scanners; now matched by stem with a 19-case suite. **NOT a G5 gap**: that consumer imports `{ HARD, NEG }` only, and an earlier note claiming the commit gate shared it was wrong. Earlier: **INTERNAL LINKING IS NOW HUB-AWARE, deployed.** `app/(marketing)/blog/[slug]/page.tsx` ordered related-reading by category then recency, so an article's inbound links were whatever shared its label; it now orders hub, then siblings under the same hub, then category, then the rest, driven by a new optional `hub:` frontmatter field on `ArticleFrontmatter`. No article carries `hub:` yet, so the live ordering is unchanged until one does: **the code is live, the behaviour is dormant by design.** tsc clean. Also **`promote-keyword.ts` had a real defect**: the 4b existing-claim check parsed keywords.csv with `line.split(',')`, so any quoted field containing a comma shifted every column right and the gate refused promotions with a fabricated reason. Latent for months; the 2026-08-15 fan-out rows are the first with a comma inside quotes. Now uses a quote-aware parser. Earlier: **KIT 1 SCOPE FIX SHIPPED to four marketing pages** and verified in a real render at two viewports: the fatigue framing is narrowed to the hormonal presentation and a routing card now hands the fatigue reader to Kit 2, closing the contradiction where the results engine enforced CA-025 and the marketing pages did not. Working tree at time of writing; a push deploys it. Also: the carousel "Ewa has not signed off the 30 posts" blocker is STALE and retracted (CA-034 + CA-035 both approved); and the dev server on port 3000 500s on every page, unrelated to any change here. Earlier: 2026-08-15 (**AEO groundwork: llms.txt now lists all 18 published articles (was 2), and `/test-selector`, `/blog` and the site-wide Organization graph gained structured data; committed, deploy state recorded below.** Earlier: 🔴 **THE HETZNER SERVER INVENTORY IN THE DOCS MATCHES NOTHING REACHABLE**: there is no reachable `nc-server-01` and no box with the documented 320 GB disk, which is the whole argument for putting the second copy of shot media there; one host's SSH key has CHANGED and was deliberately not overridden. Blocks the cold archive; nothing at risk while it waits, since no asset has reached `recorded`. Earlier: **`npm test` EXITS 0 and all twelve app test files run again**, after
the last two typecheck errors were fixed; **both were live defects in the heartbeat's alarm path**,
not typing noise, and one had a green test whose fixture reproduced the bug. **D5 ANSWERED: there
is no watch path, every push builds and deploys**, proved by three markdown-only commits each
producing a Sentry release. Earlier: **three migrations for content-machine Phase 1**: `variant` on
`content_renditions` with a `NULLS NOT DISTINCT` unique key, four metric columns on
`content_metrics`, and an `instagram/carousel` channel row. **Schema baseline RE-DUMPED** the same
day and its header now names them, since baseline and migrations share a date. Types regenerated;
app typecheck 0 errors, `typecheck:scripts` still failing on the same two pre-existing
`doctor-heartbeat` errors. Earlier: **new `panel` pillar → Kit 3**, and a self-inflicted **two-minute 500** on `/blog/how-to-read-blood-test-results` from switching DB content before the code that defines the pillar had deployed; reverted inside a minute, all 19 articles re-checked at 200, then redone in the correct order. ~~**`npm test` fails on three PRE-EXISTING typecheck errors** and aborts before the rest of the suite runs.~~ **Re-tested 2026-08-15: `npm test` exits 0, the whole chain passes.** The three errors are fixed; the claim is retracted. Earlier: **two published articles gained kit CTAs** via direct `blog_articles` writes for K2, both checked as rendered images, and the **drafting workspace** was found behind live on the FAI wording while the real mirror was in sync all along. Earlier: **two live copy defects found by the carousel pre-flight and fixed**: the test-selector routing fatigue readers to a testosterone-only kit (CA-033) and the Kit 1 page grading FAI, both verified live; run start pulled in to 2026-08-17. Earlier: `/go` link-in-bio grid for the carousel run built and DEPLOYED, verified live on the real deploy; earlier: the `/waitlist` page was still pre-launch copy months after launch: fixed and verified on a real render; plus results-engine FAI report-only, the badge default, two new upper bands, and the Customer.io all-clear ceiling).))_


---

## ▶️ PICK UP HERE (2026-09-02)

Everything below is committed on `redesign/direction-f`. **The branch deploys nothing and nothing in
it is live.** A long design session; the homepage is materially different from the one described
further down this file, so read this block before the older entries.

### What changed on 2026-09-02, in one list

The retired-vocabulary scanner; the conflict-free receipt took the inverted ink panel; the footer
stopped saying "wellness information service" in both places; amber now means caution only; the
emptiest bento card; the direction's scroll choreography (36 dead reveals became live ones); a
measurement device of our own (`.f-srule`, `.f-marg`); prose left its cards, twelve down to five; the
hero data field; the body rhythm; the captions came off the photographs. DESIGN.md and PRODUCT.md
were reconciled against all of it on the same day.

### 🟡 The merge blocker: the CA-045 packet is RAISED, and is sitting in drafts

**Still the blocker, but the ball is now in Keith's court rather than mine.** The packet exists as a
Gmail DRAFT to Ewa, id `r-3136750216544571074`, subject "Nine items for sign-off before the new
homepage can ship (CA-045)". **It has NOT been sent. Sending is Keith's act.** Body, question map,
attachment list and the corrections it makes to the record:
`03_compliance/content-approval/ewa-packet-ca-045-homepage-imagery-2026-09-02.md`. Mirrored on
ClickUp task `869eqz4bd`, which is where the rulings land first.

**Nine items, asked as seven questions, ten attachments. Expected answer count is 7.** If fewer than
seven letters come back, the rest are UNANSWERED; do not infer a ruling from an adjacent answer.
Q1 the hero film's illegible sheet; Q2 `img-3`, hands and a collection tube; Q3 `img-1`, `img-2`,
`img-4`, `img-6` grouped; Q4 `img-5`; Q5 `img-7`, with the trainer mark named as **Keith's** call
because it is a trademark question and not a clinical one; Q6 the hero data field, display or
texture; Q7 the hs-CRP and SHBG rows the page never shows.

🔴 **Building it found three things this file and the register had wrong, all by opening the
images.** **(a)** Nothing is live. Both documents said the five inherited photographs were "LIVE on
`/`"; `git ls-tree -r main` returns no `frontend/public/home/` path at all. The packet would have
told a clinical reviewer that unapproved imagery was already published. **(b)** `img-5`'s alt text
says "sitting on a bench putting on a trainer" and the photograph is a man hunched forward, head
down, hands clasped, not moving: the strongest "looks unwell" image in the set, so it was asked on
its own rather than grouped with the benign four. **(c)** The photographs are in colour, not black
and white. ⚠ The general form is worth carrying: **alt text is not evidence.** It is written to be
brief and calm for a screen reader, which is the opposite bias from naming what a regulator would
notice, and the register already quotes `img-3`'s alt verbatim as its evidence of content.

**Two of the ten attachments had to be rendered, not found.** The hero data field is a canvas that
exists only at run time, so no still of it existed; the dev server was started and the hero shot at
1440. One render is the hero as it ships, the other has the 0.34 opacity and the vertical mask
removed so the geometry is visible. **That second one never ships**, and the email says so, because
Q6 cannot honestly be answered on a description of something deliberately illegible.

**What is left here:** Keith reads the draft and sends it. Nothing else on this branch moves until
the seven letters come back.

### 🔴 Twelve live verdict-vocabulary instances, and they are on `main`, not this branch

Found by the new scanner on its first run. **Four** on `app/lp/energy-recovery/page.tsx:150-153`
(Suboptimal, Low, Elevated, Normal) and **eight** on `app/lp/hormone-recovery/page.tsx:244-256`
(Borderline, Normal x3, Low x3, Elevated). Both pages are deployed. One repeats a defect already
corrected on `/kits/testosterone`: **free testosterone graded "Low" at 0.231**, where `classifier.ts`
returns `ft-low` only below the lab's `referenceLow`, so the word has to come from that check rather
than from the look of the number. Each replacement must be the label `BADGES` renders for that
marker's state, with the state named in a comment on the row. Then a pre-flight on both pages.
Keith's call whether it ships before or with the Direction F merge.

### 🔵 Three of Keith's five design calls are still open

Two were closed on 2026-09-02 (the amber double meaning, and the receipt taking the inverted panel).
Remaining, each with its substance in the dual-agent critique entry below:

1. **Naming Dr Ewa Lindo instead of "our GP".** The phrase "our GP" appears three times on a page
   making a clinical claim while she is never named. Instances at
   `app/(marketing)/page.tsx:382` and `:396`.
2. **The hero's "See the app first" button routes to a card that declines.** That card ships with no
   CTA on purpose, because `/results-dashboard/demo` does not exist; the demo is built only as
   `design/prototypes/demo-account-interactive.html`. Either build the route or change the button.
3. **The disputed-interval tint.** Tint only the interval where the two scales disagree on a split
   row, in a hue deliberately outside the status triad, because "two scales disagree here" is a fact
   rather than a severity. Gated on DESIGN.md's "never the status triad" line, which is a ruling, and
   on a pre-flight plus probably Ewa. **Recommendation: hold it until CA-045 clears her desk**, so
   she is not asked two things about the same panel in the same week.

### 🔵 From the 2026-09-02 taste audit, reported and not actioned

- **"Scroll for a sample result"** in the hero. Two rules hit it (scroll cues are banned; it is a
  fifth text element in a hero capped at four) but this file records that the hero's viewport height
  was restored partly BECAUSE that line means something. It is a content promise, not an
  instruction. Rewording keeps the promise and loses the tell, and is new copy needing a pre-flight.
- **The `01 / 06` section numbers**, built the same morning. The skill bans section-number eyebrows by
  name. My read: the ban targets decorative enumeration above a headline, and this is a position
  indicator on a measurement track carrying a real value. Surfaced deliberately rather than passed
  over because I built it.
- **`Sys.stat: online` and `Sec: AES-256`** in the footer (`components/shared/Footer.tsx:130-133`)
  read as the CLI build-footer tell that skill bans on marketing pages.
- **"Sample result · Kit 3 · nine markers"** carries two middle dots on one line, against a cap of one.

### 🟢 Cheap and self-contained, if you want a short next session

- **The hero stagger**, `mask-rise` on the headline and `fade-up` on the sub at 0.42s and the CTAs at
  0.56s. Roughly ten minutes now the observer machinery exists. The homepage's first screen is still
  the one static slab on the page.
- **Layer 2 of the hero, the drifting measurement rule**, is now the last piece the direction has and
  the build does not.
- **Decode apostrophe entities in the pre-flight's `NEG` table.** It accepts every literal apostrophe
  and no HTML entity, so `They don&rsquo;t diagnose conditions` reports HARD on a plain disclaimer.
  Pre-existing, and it means a false HARD sits on live footer copy on every page. `stripMarkup`
  already decodes `&nbsp;` and `&amp;`; extend it and the `test-curly-negation.js` suite.
- **A computed-vs-declared check** for the reconciler. Three defects on 2026-08-31 (`.f-btn` declared
  twice, `.f-btn-ghost` declared twice, `.f-blab` losing on specificity) were invisible to it by
  construction, because it compares declarations and all three declarations were present and correct.

### 🟢 The new logo is INSTALLED and live on the branch. 🔴 The favicon on `main` is still wrong

**Keith's decision, 2026-09-02: the lockup stays as approved**, not reset in a typeface. So the
wordmark is TRACED from `SOURCE-approved-2026-08-30.png` rather than set: it is not a font, and with
tracking tuned so the advance matches, the closest candidate disagrees on 74% of ink. The trace
agrees with the raster on **99.42%** across 16 contours, which is ten letters plus six counters
exactly. Cap height in the source is only 120px, so the crop is upscaled 8x with Lanczos and
thresholded AFTER, which recovers the sub-pixel edge the anti-aliasing already encodes instead of
tracing a staircase.

**Installed into the app**, by `gen-logo.js --install`:
- `components/shared/logoArt.ts` regenerated. Lockup aspect **4.7 to 9.3189**, and there is no
  container any more, so anything assuming 470x100 had to move with it.
- `Logo.tsx` rewritten: the black `<rect>` is gone, and it gained a `mark` prop. The old trick of
  passing `viewBox="0 0 100 100"` to crop down to the square icon **cannot work without the square**,
  and the results dashboard was doing exactly that; it now passes `mark`.
- The mark and wordmark need **different fill rules**: nonzero for the mark, evenodd for the traced
  wordmark, because potrace nests contours by winding. Both nonzero fills every counter.
- Three OG image sites had the old 4.7 ratio hardcoded and were rescaled to hold the wordmark's cap
  height roughly constant.
- Typecheck clean; nav and footer both verified by screenshot on the running dev server.

🔴 **STILL WRONG ON `main`, and not fixed here.** `build-icons.js` sources
`SOURCE-mark-only.png`, which is the approved mark with **60px cut off the foot of the stem**. Every
other landmark matches the approved sheet to the pixel; only the stem's foot differs, 1196 against
1136. So the favicon, app icon, apple-touch and PWA icons already shipping carry a 5% short
descender, and so did the 16px gate that chose this concept. **Re-cutting them from `icon.svg` is one
command and changes live assets, so it is Keith's call.**

⚠ **The approved sheet draws the mark at two weights** — heavy standalone, lighter inside the lockup.
That is model inconsistency, not design. The installed lockup uses the heavy mark, so the two agree
for the first time.

**Masters**, all in `02_brand/assets/logos/interlocked-ap/`: `icon.svg`, `lockup-light.svg`,
`lockup-dark.svg`. One geometry, ink flipped, so they cannot drift.
**`variants-compare-2026-09-02.png`** is the five-column record: the approved raster, the traced
vector of it, and the three typefaces that were cut and rejected.

🟢 **Vitall are unblocked** for the sleeve print. The **25mm gate is still unrun**.


**🟢 RESIZED 2026-09-02, same day, because the first install was overpowering.** Keith called it:
the logo was too big for the site. The cause is arithmetic rather than taste. **The lockup's aspect
is 9.32 where the Refined Monogram's was 4.7**, because the old one spent half its width on a black
square, so the SAME css height renders the wordmark more than twice as large. `h-6` had been correct
on a 4.7 lockup and was wrong on a 9.32 one: it put the wordmark's cap at **15.9px against nav links
whose cap is about 8.4px**, nearly double the surrounding type. The old logo sat at 7.3px, just under
the links, which is why nobody had noticed the nav's logo before.

Chosen by rendering the ladder from 14px to 24px and looking at it, not by arithmetic: **nav h-6 to
h-4** (cap 10.6px, 149px wide), **footer h-8 to h-5** (cap 13.3px), **activate h-7 to 18px**. The
dashboard is unchanged: it draws the mark alone, so the aspect problem does not reach it. Verified at
1440 and 390; at 390 the lockup is 149px of a 390px bar and clears the menu button.

`Logo.tsx` now carries the rule so it cannot drift again: **size by the wordmark's cap height, which
is 0.663 x the rendered height**, working back from the surrounding type rather than reusing a number.

⚠ The first attempt to verify this reported the old size, because the dev server was serving stale
HTML: the class in the DOM still read `h-6` while the file on disk read `h-4`. Reading the class off
the live DOM is what caught it; a screenshot alone would have been believed.

## ✅ The pointer was forging the "Most complete" ring, plus three more from the /kits critique (2026-09-03)

The 2026-09-02 dual-agent critique of `/kits` against `/`
(`frontend/.impeccable/critique/2026-09-02T23-35-47Z__app-marketing-kits-page-tsx.md`, 26/36) produced
four findings that needed no ruling and no copy pre-flight. All four are applied and measured in
Chrome against the dev server; **nothing here touches copy**, so nothing is added to
`redesign-copy-register.md`.

🔴 **`.f-tray-pick:hover` was byte-identical to `.f-tray.f-tray-flag`**, so the pointer forged the
page's single emphasis signal: Kit 1 hovered rendered identical to Kit 3 at rest, and whichever card
the cursor sat on acquired "Most complete". It was also the one place `--flag` escaped its fence,
painting on all three transactions. The hover now takes `--shadow-ambient-lift` only. **This is the
same class of defect as the flag ring that never rendered, one day later and in the same three lines**:
that one was a specificity tie, this one a duplicated value, and both were invisible because the
result still looked like a working card. `.f-tray-pick` is used on `/kits` only, so the blast radius
is one page.

🔴 **`.f-kchip` and `.f-flagchip` stretched to card width**, because `inline-flex` sets how a box
lays out inside and `align-self` decides its cross-axis size in the parent, which defaults to
`stretch` in `.f-kbody`'s column. Measured **91px in the hero against 316px in the cards**: one class
behaving as a chip in one place and a banner in another, on one page, with the amber instance the
largest coloured area on the site. Now `align-self: flex-start`, measured 197px at content width.

⚠ **`.f-btn-sm` measured 42.3px at 390**, under the 44px minimum, on all three `Order` buttons plus
"Go to test selector" and "Full process breakdown". Now `min-height: 44px`, 0 buttons under 44 across
the page. **This is site-wide by design**: the class is used in 7 files and every small button gains
1.7px.

✅ **The `/kits` close paid the section gap twice.** `.f-sec` and `.f-close` both take
`var(--f-sec-gap)` as padding-top, so wrapping one in the other spent 260px immediately before the
final ask; the homepage puts `.f-close` on a bare `.f-wrap`. `f-sec` dropped, now 0px + 130px and
matching `/`.

⚠ **One correction to the critique**, recorded because the entry will be read again: its P2 added
"same pattern for the gap between the panel and section 02", and that does not hold. Every `.f-sec`
on the page measures 130px top / 20px bottom, so panel-to-02 is the standard rhythm, not a doubling.
The close was the only genuine double. Any void there is content ending short, which is a judgement,
not a mechanical fix.

**Still owed from the same critique, and all of it blocked on a decision, not on work:** the "answer 3
questions" / "less than a minute" drift (the selector is five steps, wrong on a live page, needs its
own pre-flight); "Order" as a CTA label that leads to a product page not a basket; **the two contradictory kit
recommendations one click apart** (`/` gives the solid button to Kit 3 alone, `/kits` to Kits 1 and 3).

## 🟢 /KITS HAS A GROUND NOW: LAYER 2 OF THE HERO WAS NEVER PORTED, AND IT IS (2026-09-03)

**B5, B6, B7 checked. Two were already answered and one was real.**

✅ **B5 was fixed in `c1c6bb7`** at the start of the session. It claims a 280px gap at 1440 and 164px
at 390; measured now, **150px and 92px**, with `.f-close` on a bare `.f-wrap` exactly as on `/`. The
residual 20px against the homepage is the preceding section's own padding-bottom, not a second gap.

⚠ **B6's number is right and my first answer to Keith was wrong.** I told him it was "the standard
150px rhythm, nothing mechanical to fix" after measuring SECTION PADDING, then measured 190px from
`.f-panelfoot`, which sounds like the bottom of the panel and is not. Measuring ink to ink, from the
last element that actually paints to the next rule: **150 / 150 / 130 / 106**. So 150px is the page's
widest boundary, shared with rule 01, and the finding is exact. It is not a bug, it is **the default
applied to a boundary that should not take it**: every other boundary on that page is a topic change,
and the panel to the cards is the instrument followed by the things it measures. ✅ **RULED AND FIXED
2026-09-03.** "The gap states the relationship": `--f-sec-gap` is the boundary between two TOPICS, and
a section that continues the one above takes `--f-sec-gap-cont`, `calc(var(--f-sec-gap) * 0.66)`, via
`.f-sec.f-sec-cont`. Held as a fraction, not a second literal, so the two cannot drift. Measured ink
to ink at 1440, before **150 / 150 / 130 / 106**, after **150 / 106 / 130 / 106**: the continuation now
matches the close. At 390, 68px. ⚠ The modifier is written `.f-sec.f-sec-cont` at (0,2,0) because at
(0,1,0) it ties with `.f-sec` and source order decides, which is how three separate rules in that file
have already shipped broken.

🟢 **B7 was real and is fixed.** `/` opened on a full-bleed film plus the canvas data field; `/kits`
opened on flat white with **zero** images, canvases or videos, both at 65.6px Newsreader. The type was
carrying the whole handover. `/kits` now carries **layer 2 of the direction's three, the drifting
measurement rule** — the one layer nobody had ported. `.f-ruleground` wraps the hero outside `.f-wrap`
so the ground is full-bleed; verified 1440px wide at left 0, content above at z-index 1, no overflow at
either width, and reduced motion resolves to `animation-name: none`, which is the direction's own
static state.

🔴 **THE FIRST PORT HAD THE AXIS WRONG, AND KEITH CAUGHT IT AFTER IT SHIPPED.** The direction draws
this layer as VERTICAL hairlines, so it was ported vertical. But `HeroField` on `/` draws **horizontal
gauge rows**, one per 25px, each a full-width track with a lab band, an action band and a marker: the
readout repeated down the hero as texture. Vertical hairlines at 26px against horizontal rows at 25px
is the same rhythm rotated 90 degrees, which reads as related-but-wrong rather than as one system, and
every other instrument in the system is horizontal too. `F-field.html` predates the 2026-09-02 ruling
that made the measurement device the spine, so **faithfulness to the direction was the weaker
argument and I took it without checking it against the ruling.** Now horizontal at 0.65, down from
0.85, because a horizontal line crosses a whole line of text rather than passing between glyphs.

⚠ **The full gauge was rendered and rejected on evidence.** Adding band segments to the rows, which is
what would make them read as real gauges rather than ruled paper, puts darker segments straight
through the body copy: "you take at home" and "ISO 15189 accredited lab" both came out struck through.
The homepage carries the full gauge because its field is at 0.34, its rows fade near the headline by
distance, and its type sits on a film that already separates it. Here there is no film and the tray
occludes the right half, so the only visible ground is directly behind the type. **Rendering the
rejected option is what made the reason legible; describing it would have sounded like caution.**

🔴 **It is not data.** Unlike `HeroField`, which draws real range geometry and carries an open CA-045
question, this is a repeating gradient with no source, so it adds nothing to any packet. That mattered
to the choice: reusing the homepage film would have spent the homepage's one device on two pages, and
lifting a kit photograph above the fold would have demoted the price tray and added an above-the-fold
placement note to a packet that is **unsent and is the merge blocker**.

⚠ **Damped below 900px after looking at it, not before.** The mask holds full strength between 26% and
62% of the ground's height, and the ground is 646px at 1440 against **1167px at 390** because the hero
stacks, so the same percentages put ~420px of full-strength ticks behind the lede on a phone and the
grid started competing with the body copy. `opacity: 0.45` under 900px. Caught only because the mobile
screenshot was actually looked at; the desktop render gave no hint of it.

## 🔴 AMBER MEANT TWO OPPOSITE THINGS, AND THE MARKETING ACCENT IS NOW INK (2026-09-03)

**Ruled: saturated colour means a clinical verdict and nothing else.** The status triad owns
saturation; a marketing surface gets ink, paper and the greys between. Written into DESIGN.md and into
`tokens/colours.css` at the token itself.

The defect: `--flag` was `#E0A458` and `--color-status-warning` is `#d97706`. **Two adjacent ambers,
opposite meanings, one click apart.** On `/` amber said "this number of yours needs watching"; on
`/kits` amber said "buy this one, it is £179". 🔴 **The 2026-09-02 pass separated the TOKENS and that
was never going to fix it**, because nobody reads a token and the values were not what was being
confused. The token file had even written the collision down in full ("the colour that says a result
needs monitoring is the colour that highlights the £179 kit") and then solved it by adding a second
hex. A perceptual defect does not have a hex-value fix.

Third time this ruling has been made, first time generally: accent red left the blog skin 2026-08-29,
credential marks left amber for ink 2026-09-02, and now the accent itself. Each time the decorative
use yielded to the clinical one, and each time only for the case in front of us. The general form
should stop the fourth: **if a thing is not a verdict about the reader's blood, it is not coloured.**

Six surfaces follow the token and needed no edits of their own: Kit 3's ring and chip, `.f-pull`,
`.f-symp .f-route`, the step cards' ghost numeral, `.f-col-hi`. Only `.f-flagchip` needed a second
change, its hardcoded ink text inverting to paper, 19.69:1.

⚠ **I got the tints wrong first and measured it, rather than shipping it.** They are derived from the
old composited LIGHTNESS, not the old alpha: amber at .14 over paper is `rgb(251,242,232)` and ink at
.14 is a mid grey. Ink at .05 composited to `rgb(243,243,243)` and pushed `.f-col-hi`'s 10.5px label
from 4.72:1 to **4.48:1**, under the floor by 0.02. At .035 it composites to `rgb(246,246,247)` and
measures 4.63:1. That label is the smallest text in the system sitting on a tint, so it is the one to
re-measure against any future change to these values.

Verified across 7 routes, `tsc` clean: **the only saturated colours left anywhere on the marketing
site are `.f-bar i.warn` and its optimal sibling, both inside the sample report.** No copy-register
row: colour is explicitly out of the register's scope, and this change reduces rather than adds
emphasis on the £179 kit.

## ✅ B4 WAS ALREADY FIXED THIS SESSION, AND THE CRITIQUE TEXT STILL SAYS OTHERWISE (2026-09-03)

The `.f-tray-pick:hover` ring was fixed in `c1c6bb7`, the first commit of this session. The critique
document still describes it as live because a critique is a snapshot and nothing rewrites it when the
defect is fixed. Re-verified before touching anything: the rule now reads
`box-shadow: var(--shadow-ambient-lift)` and a simulated hover on Kit 1 returns the lift with no ring.
⚠ **The general risk this is an instance of:** a findings document is read as a description of the
present long after it has become a description of the past, and it reads as authoritative because it
is dated and specific. Re-test a finding's central claim before acting on it, especially when acting
would mean "fixing" something twice.

## 🔴 THE PRODUCT NAMES HAD 66 CALL SITES AND ONE MODULE CLAIMING TO BE THEIR SOURCE (2026-09-03)

Checking the critique's B2 row "the same product is called three different things" found something
larger underneath it. **`lib/kits/names.ts` declares itself "the single source of truth for slug ->
display name" and had exactly ONE consumer** (`lib/results/processResult.ts`). The three strings have
**66 hardcoded literal occurrences across 21 files**: `lib/pricing.ts` (so the checkout), the account
export and dashboard, the activation flow, `kitCTA.ts`, the three `/lp/*` pages, the detail-page
breadcrumbs, and `/kits` **twice** — a local `FULL_NAMES` map for the hero panel plus hand-written
JSX card titles with a manual `<br />`.

Twenty of the twenty-one agreed. **The homepage was the sole dissenter**, calling them
"Testosterone", "Energy & Recovery" and "Hormone & Recovery" one click from the page saying
"Testosterone Health Check". `/` and `/kits` now both read from the module; registered as rows 14 and
15, with row 16 recording the other 19 files so the sweep has a scope. ⚠ **This is the shape where a
one-string fix would have been actively harmful**: editing the homepage by hand makes 21 copies agree
and leaves the 22nd free to diverge, and the copies agreeing is precisely what hid this for months.

Two measured side effects, both improvements. Deleting `/kits`' hand-written `<br />` let the full
names sit on **one** line at 368px, so the cards shrank 574px -> 549px; the break was forcing a wrap
that was never needed. On `/`, the two narrow cards' heading now takes two lines at 1440 and one at
390, cards stay equal height, no overflow. `tsc` clean.

**Also fixed, same pass:** `/kits`' three card CTAs said "Order", which was a second label for one
product set one click apart AND over-promised, since it leads to a product page and not a basket.
They now say **"Start a baseline"**, the homepage's existing approved label. Measured 131px wide,
44px tall, fits the card foot beside the price at both 1440 and 390.

**Corrections to the B2 table, none of which change its conclusion:** it is **two** names, not three
(`/kits`' hero panel and its card both say the long form; only `/` differs). The divergence is **3
products for 3**, not just Testosterone: the homepage dropped the suffix from all of them, and the
table singles out one. Homepage card widths measure 561/272, not 549/260, and `/kits` cards were 574
tall, not 573. Everything else in it verified exactly, including both price components
(`.f-kprice` 32px/-1.28px against `.f-price` 35.2px/-1.584px).

✅ **RULED 2026-09-03, KIT 3 IS THE DEFAULT ON BOTH PAGES.** `/kits` moves to a solid button on Kit 3
alone, Kits 1 and 2 ghost; the cards stay price-ascending because it is a catalogue, but the weight no
longer follows the order. Verified on both pages: `Hormone & Recovery Check` is the only ink-filled
button on either. Registered as row 17 **even though no words changed**, because it steers toward the
£179 product and fair presentation is asked of the whole presentation. The superseded rationale is
recorded at the flag itself, with the warning that evening up the buttons "for balance" is exactly the
reasoning that was replaced. The state before the ruling: `/` gave the solid
button to Kit 3 alone and orders the cards 3, 1, 2; `/kits` gives solid buttons to Kits 1 and 3,
ghosts Kit 2, and orders them 1, 2, 3. 🔴 **The two are not even reasoning on the same axis.** The
homepage's rationale is commercial and is stated in its own h2: "You don't know which question you're
asking yet", so Kit 3 is the honest default. `/kits`' rationale is written in its code as a VISUAL
one: "Frame O gives Kit 2 a ghost button and Kits 1 and 3 a solid one, so the middle option is not
competing with the two it sits between." A layout-balance rule is currently deciding which product
the business recommends, and it disagrees with the argument the homepage makes thirty seconds
earlier. That is the thing to rule on, not the button styling.

## 🟢 KEITH RULED ONE SECTION GRAMMAR, AND THE HOMEPAGE ADOPTED /KITS' (2026-09-03)

The `/kits` critique's P1: `/kits` puts a mono label above every section heading and `/` puts none,
which is the clearest structural tell between the two most important commercial surfaces. **Ruled:
one grammar, the labelled one.** `[.f-srule] → .f-blab → h2 → lede` on every section that opens with
a heading, on every F page. Written into DESIGN.md beside the `.f-blab` component definition, which
is where someone looks.

**Four new labels on `/`**, matching the two-to-three-word shape `/kits` already uses: **"The two
ranges"** (02), **"Where to start"** (04), **"What's free"** (05), **"No conflict"** (06, as
`.f-blab-lg f-invert-lab` on the receipt). Measured: the three body labels render 11.5px JetBrains
Mono uppercase in `--ink-2`, identical to the existing ones; the lead label renders 18.56px at white
0.72 on ink, which is the 10.22:1 DESIGN.md already recorded for that slot. The effect the critique
predicted is real: `WHERE TO START` now sits in the same register as `04 / 06` on the rule above it,
and they read as one line. **Registered as row 13**, so the final pre-flight picks up all four.
⚠ Section 05's label inherits every prohibition its disclosure line carries: it is a section name,
never an offer.

⚠ **Sections 01 and 03 stay unlabelled, and that is the ruling, not an omission.** They open with an
object, the readout and a photo plate, rather than a heading. What leads a section may vary; the
grammar above a heading may not.

🔴 **THREE OF THE CRITIQUE'S FOUR PREMISES FOR THIS FINDING WERE WRONG, AND THE FINDING WAS STILL
RIGHT.** It named the device `.f-eyebrow`, which is the bordered pill and appears once per page in
the hero; the section device is `.f-blab`. It said "DESIGN.md records both as correct", and DESIGN.md
recorded one narrower thing, the invert panel's lead label being absent **pending a pre-flight**,
which is a statement about what a redraw may do and not a design ruling; the critique generalised it
into a page-wide grammar with standing it never had, and that framing is what made the finding look
like a stalemate needing a ruling rather than a gap needing four words. And it said every `/` section
opens `[rule] → h2 → lede`, which is true of four of six. **The lesson is not to distrust critiques.**
It is that a finding's headline can be sound while its supporting detail is not, so the premises get
checked before the options are drawn: the correct framing turned "one of them has to give" into "the
homepage is under-labelled, here is what it costs to fix". Both notes claiming the lead label was
deliberately absent were superseded in the same change, in `page.tsx` and DESIGN.md, because a fact
half-corrected is louder than one left alone.

## ✅ The eyebrow dots came off too, which is the same ruling reaching five more places (2026-09-03)

Follows directly from the entry above and from the footer-chip removal of 2026-09-02. DESIGN.md's
🔴 "A dot marks a STATE, never a credential" was applied to the last places still breaking it: the
`.f-eyebrow` dot, which the /kits critique caught as **the first element on that page**.

**Five `<i />`, five files**, all labelling a category or an identifier and none a state: `Methodology`
(`/how-it-works`), `Data first` (`/kits/energy-recovery`, `/kits/hormone-recovery`), `Diagnostic kits`
(`/kits`), `Kit 01 // Testosterone` (`/kits/testosterone`). A category is further from a state than the
footer chips that already lost theirs. ⚠ **The critique said six sites across four files and that was
wrong**; the recount is five across five. The other `<i>` elements on the site are not credential dots
and were left alone: `.f-bar > i` is a bar fill, the homepage readout's `f-k-lab` / `f-k-ours` /
`f-k-you` are legend swatches, and **`.f-navstat i` survives**, because "UKAS lab online" genuinely is
a state. Verified on all five routes: every `.f-eyebrow` now has 0 child elements, text and border
intact, nav dot still 5px ink on each.

`.f-eyebrow i` was deleted rather than left unused, which turned out to be the exact pattern the
`.f-chip i` removal set the day before, for the reason its comment gives: "a live-looking rule for a
removed element is what a later reader restores by accident." A 🔴 comment sits at the selector
instead, so re-adding a dot renders nothing and sends whoever did it to the ruling.

Design-only, so nothing is added to `redesign-copy-register.md`. ⚠ Noticed but **not** fixed, since it
is unrelated and pre-existing: the amber-ruling comment at `f-primitives.css:1947` still points a
reader at `.f-chip i`, which was deleted on 2026-09-02.

## ✅ The captions came off the photographs, and the credential dots came off the footer (2026-09-02)

A second taste-skill pass over the homepage, run against its Pre-Flight matrix and AI-Tells list with
the serif rule again set aside. **The page passed most of it**, including the skill’s self-declared
"#1 violated rule in production tests": zero em dashes, zero en dashes, hero inside the viewport at
844 of 900, nav one line at 80px, no duplicate CTA intent, exact bento cell counts, and **zero
eyebrows** above section headings across seven sections.

### What was actioned

1. 🔴 **Seven caption pills were sitting on top of the photographs** ("Thursday, 4pm", "The same
   test, later", the three kit captions, and the two free-layer ones). A label overlaid on a photo is
   one of the most reliable AI-designed signatures there is: the caption competes with the picture
   instead of serving it. All seven now sit below their image in the body sans at 12.5px.

   ⚠ **The pill was the last card-era artefact on those images.** It needed a surface to float over,
   and after the trays came off there was nothing to float over, so this is the second half of a
   change made earlier today rather than a separate idea.

2. **The two footer credential chips lost their dots.** A dot marks a state; UKAS accreditation and
   EFSA claim wording are either true or the chip should not exist. The nav dot survives because
   "UKAS lab online" genuinely is a state. Rule deleted rather than left unused, since a live-looking
   rule for a removed element is what a later reader restores by accident.

### 🔵 Reported and NOT actioned, both Keith’s call

- **"Scroll for a sample result".** Two rules hit it: scroll cues are banned outright, and it is a
  fifth text element in a hero the skill caps at four. But this file records that the hero’s
  viewport height was restored partly BECAUSE that line means something. The skill is right that
  "Scroll" is redundant and wrong that the line is worthless: it is a content promise, not an
  instruction. Rewording keeps the promise and loses the tell, and is new copy needing a pre-flight.
- 🔴 **The `01 / 06` section numbers, built the same morning.** Section 9.F bans section-number
  eyebrows by name. My read is that the ban targets decorative enumeration above a headline, and this
  is a position indicator on a measurement track carrying a real value. **Surfaced deliberately
  rather than passed over because I built it.**

### ⚠ One conflict, no action

The skill mandates dark mode. The app has none by decision, recorded as DESIGN.md gap 1 and blocked
by the shared chrome across 25 marketing routes. **A general skill run against an approved brand will
cheerfully undo the brand**: take its method, not its defaults. Same reason its serif ban is ignored
here, per its own Section 11.C.

### Also found, not yet done

- `Sys.stat: online` and `Sec: AES-256` in the footer read as the CLI build-footer tell the skill
  bans on marketing pages.
- "Sample result · Kit 3 · nine markers" carries two middle dots on one line against a cap of one.

### Verification

tsc 0, `next build` 0 with dev stopped. Measured on the running page: 7 captions, **0** absolutely
positioned, **0** still inside `.f-shot`, footer chip dots 0, nav dot 1, no horizontal overflow.
Argument plate and a kit card screenshotted.
## ✅ The body rhythm is fixed, and it was wrong in a way the cards had been hiding (2026-09-02)

Keith: the spacing in the body text is a little off. Audited with the taste skill’s redesign protocol
(Section 11, Lever 2: spacing and rhythm), which means auditing before touching. **The values were
not arbitrary, they were tuned inside cards whose 26px padding supplied the surrounding air.**
Uncontaining the prose earlier today left the gaps doing that work alone, and they were never
proportional to their type in the first place.

| Relationship | before | after |
| --- | --- | --- |
| `.f-h2` to body | 18px fixed: **0.45em** at 1440, **0.70em** at 390 | **0.62em** at both |
| `.f-h4` to body | 12-14px (0.46-0.54em) | **0.55em** |
| `.f-rstep h3` to body | 6px, **0.33em**, half what the rest of the page used | **0.55em** |
| `.f-cell h2/h3` to body | 8px (0.38em) | **0.55em** |
| `.f-rstep p` measure | uncapped, about **82ch** | **66ch** cap, renders 519px |

### The two rules, both about ownership rather than taste

1. **The gap under a heading belongs to the heading, in `em`.** It was on the paragraph, against a
   heading that clamps 25.6px to 40px, and one fixed value cannot serve both ends of a clamp.
2. **Every body class states its own measure.** `.f-rstep p` had none and ran the full column. **A
   measure held by a container is not a measure, it is a coincidence**, and it ends when the
   container does. This is the same family as the hover that would have been lost with the tray:
   removing a container removes everything it was incidentally providing.

### ⚠ Leading was not the problem, and was not changed

The ratios read inconsistent (1.60 / 1.62 / 1.68) and the obvious move was to unify them. **The
computed leadings are 26.9px and 26.7px for the two body sizes that carry the page**, which is
consistent; the ratios differ only because the font sizes do. Unifying them would have reflowed the
page to fix nothing. Measured before assuming.

### 🔴 A specificity bug that presented as a responsive bug

The rule zeroing the paragraph’s own top margin was first written with `:where()`, which has
**specificity zero by definition**, so it lost to `.f-lede` and to Tailwind’s `mt-*`. At 1440 the
heading’s new 25px exceeded the paragraph’s 18px, so margin collapsing picked the right number by
accident and the bug was invisible; it showed only at 390, where 15.9px lost to 18px. **A specificity
failure inside a margin collapse looks exactly like a breakpoint problem**, because both are "correct
at one width, wrong at the other". Rewritten with real selectors.

### ⚠ On the taste skill

Used for its redesign protocol and its spacing lever. **Its serif-as-default ban was deliberately not
applied**: Keith ruled a serif display on 2026-08-30, and the skill’s own Section 11.C says existing
brand tokens are starting material rather than optional input. A general skill run against an
approved brand will happily undo the brand; take its method and leave its defaults.

### Verification

tsc 0, `next build` 0 with dev stopped. Ratios measured at 1440 and 390: h2 0.62 at both, every
sub-head 0.55 at both. Record section screenshotted.

⚠ **One number I published was wrong and is corrected here.** The first audit reported
`.f-rstep p` at 91ch using a crude character-width estimate (font-size × 0.5). Measured against the
font’s real `0` advance it was about 82ch, and it now renders 519px, about 64ch, under a 66ch cap.
The defect and the fix are unchanged; the number was overstated by roughly a tenth.
## ✅ The hero data field is ported, the last unported layer of the direction (2026-09-02)

Layer 3 of the hero, left out of the F build on 2026-08-31 with the reason recorded as "a data
surface rather than a decoration". Keith took it. **Real range geometry from `thresholds.md`, six
markers repeated down the hero, drifting slowly behind the type and abstracted until it reads as
texture: no labels, no numbers, nothing legible.**

It is the most distinctive thing in the direction and the answer to "what makes this page ours" that
needs no explaining: the hero is made out of the product’s own data.

### 🔴 The compliance question is OPEN, recorded, and not self-cleared

Full statement in `03_compliance/STATE.md` (2026-09-02), filed against CA-045. In short: nothing is
labelled, named or readable, so our reading is texture-whose-source-is-real rather than a data
display, **and that reading is not ours to ratify.** Two of the six rows, hs-CRP and SHBG, are
markers the page does not otherwise show, which is the asymmetry most likely to matter to a reviewer.

**Safe to build, gated to merge.** Keith’s 2026-09-01 ruling that CA-045 governs shipping rather than
creating is exactly the case this is.

### 🔴 The claim that justifies it is now mechanical

The only thing making this layer defensible is that every band is a real percentage. **The field is
deliberately illegible, so drift between it and the readout would be invisible**: the page would look
identical while the claim quietly stopped being true, with no visual regression and no failing test.
So the geometry lives in `lib/home/fieldRows.ts` and `scripts/verify-hero-field.js` asserts the four
shared markers equal the homepage readout’s, parsed from the page’s own literal. 14 assertions. It
also asserts the COUNT of compared markers, so silently dropping a row from either side, which would
make every remaining comparison pass, cannot read as success.

### Three deliberate departures from the direction’s script

1. **It stops when nobody is looking.** The direction runs its `requestAnimationFrame` for the life
   of the page. This pauses when the hero leaves the viewport and when the tab is hidden. An
   unthrottled loop all session is a real battery cost, and this is a decoration: the readout’s
   draw-in earns its frames because it carries the argument, and this does not.
2. **No `prefers-color-scheme` listener.** The app has no dark mode, so that would be a listener for
   a capability that does not exist, which is the same criticism DESIGN.md already records against
   the film’s ported dark treatment.
3. **Reduced motion paints one frame and stops**, as the direction does, and it is now asserted
   rather than assumed, because the failure mode is invisible: a loop still running under reduced
   motion looks identical in a screenshot. Sampled the canvas twice 1.4s apart: **identical under
   reduced motion, different under normal.**

⚠ **z-index 1, above the film AND its wash.** The wash runs 90% white at the left edge, which is
where the headline sits, so a field underneath it would simply not exist for the first third of the
hero. It is a foreground texture over the photography, not another thing beneath it.

⚠ **The pseudo-randomness is deterministic on purpose** (`i*37 % 11`, and so on), so a screenshot of
this hero is repeatable. Replacing it with `Math.random` would make every visual check on this page
fail at random.

### Verification

tsc 0, `next build` 0 with dev stopped. 14/14 on `verify-hero-field.js`. Canvas confirmed painting at
2880x1688 with z-index 1, opacity 0.34 and the mask applied, under both motion settings. Hero
screenshotted at 1440 in both.

🔵 **Layer 2, the drifting measurement rule, is still not ported.** It is the last piece of the hero
the direction has and the build does not.
## ✅ Prose is no longer contained: 12 cards to 5, and the empty-card defect is dissolved (2026-09-02)

The third and largest of the three distinctiveness moves, and the one that most changes the register.
Keith took it after seeing the device land.

**The rule now: a card holds a transaction or an instrument. Everything else sits on the page.** The
old rule was *every block gets a tray*, which says nothing about meaning, and under it an argument in
prose and a £179 product were the same kind of object.

| | before | after |
| --- | --- | --- |
| `.f-tray` cards | **12** | **5** |
| Plates (`.f-plate`) | 0 | 4 |
| Uncontained prose (`.f-plain`) | 0 | 3 |

The five that keep a card: the readout, the three kit cards, the footer. Everything with a
photograph became a plate, where the image keeps its own `--radius-inset` edge and the text below it
sits on the page. Nothing else is contained.

### 🔴 It dissolves the empty-card defect rather than patching it

**Three of the four cards the 2026-08-31 critique measured as 32-51% empty were empty for one
reason**: a short prose block stretched to a taller sibling by `height: 100%`. Uncontained prose has
no container to look unfinished in, so the defect cannot occur. That includes the fourth card,
identified earlier today and left open, which is closed by this change without being touched
directly. Every `height: 100%` on a prose block went out with the trays.

**Unequal column heights are now normal and are not a defect.** A text column running past its
neighbour is what a document does; it was only ever hidden by making both columns full height.

### ⚠ The one thing that would have broken silently

`.f-tray:hover .f-shot img` was the rule easing a photograph toward colour. Every plate would have
lost its hover along with its tray, with **no error, no failed build, and nothing to notice except a
page that stopped responding to the pointer.** Re-scoped to `.f-plate:hover`. **A behaviour attached
to a container is a behaviour you lose when you remove the container**, and the container is the
thing you are thinking about while the behaviour is not.

### ⚠ A screenshot said the photographs were gone, and they were not

The first full-page capture after the change showed every below-fold photograph as an empty grey box,
which reads exactly like a broken image path after a structural edit. **They were lazy-loading.** A
`fullPage` screenshot does not scroll the viewport, so `next/image` never loaded them. Probing the DOM
settled it in one call: 7 images, `complete: true`, `naturalWidth: 828`. **Scroll the page before
capturing it, and check the DOM before believing a screenshot about absence** — a capture is evidence
about what painted, not about what exists.

### Verification

tsc 0, `next build` 0 with dev stopped. 39/39 on `verify-scroll-reveal.js` re-run after the
restructure, since the change moved every reveal target. Measured on the running page: 5 trays, 4
plates, 3 plain blocks, no horizontal overflow. Full page and both reworked sections screenshotted
with the images loaded.

⚠ **One count went the wrong way and it is worth knowing.** Elements at `border-radius: 999px` went
51 to 69, because the section rules added 18 of them (six rules × track, band, needle). Pills are the
correct shape for a track, so this is not a regression, but the headline number that described the
problem no longer describes it. **Count the thing you actually changed**, which here is containers: 12
to 5.
## ✅ The homepage has a device of its own, which is what the critique said it lacked (2026-09-02)

Keith raised the critique’s first finding: nothing outside the content text made the homepage uniquely
ours, and the design could belong to a tech brand or a makeup brand. **The page measures out exactly
as the critique described.**

| | count |
| --- | --- |
| Floating rounded cards (`.f-tray` / `.f-core`) | **12** |
| Elements at `border-radius: 999px` | **51** |
| At 28px / 22px | 13 / 13 |
| Full-bleed elements | 4, all chrome |
| Hairline rules | 27 |

Twelve floating rounded cards holding seventy-odd rounded pills on near-white, nothing touching an
edge, nothing breaking the column. That is the shared surface kit of premium consumer software and
premium beauty. 🔴 **And the brand doc names the trap itself**: `brand-guidelines.md` §11 lists what
the brand is NOT, and the first row is *"White wellness (Hims, Numan): correct palette, wrong energy.
Too soft and medicated."* §1 sets the target as *"quality British print publication meets precise
health reporting"*. The page had neither register outside its words, which is the same verdict the
critique reached: it passes on the strength of its writing and the composition rides the copy.

### What shipped: the one thing nobody else has, spent as structure

The two-range readout is unique to this product, it is the literal shape of the argument, and it
appeared **once**, in one card, halfway down the page.

- **`.f-srule`, a section opener** built from the readout’s own parts: `--sunk` track, `--ours` band,
  and the cased needle. Six of them on `/`, with the position in mono at the right. It gives the page
  a spine and repeats the instrument six times instead of once.
- **`.f-marg`, a print sidenote.** `Fig. 01 / Four markers / Three splits` in a 104px mono column
  beside the argument prose above 900px, stacking to one annotation line below it. Publications
  annotate their figures in the margin; the category does not, because it has nothing to put there.

🔴 **The needle measures something real.** A mark at a decorative position would be an instrument face
reading a number that does not exist, which is the one thing a brand built on "here are your actual
numbers" cannot put on its own homepage. It reads the reader’s position through the page: true,
checkable, nothing to do with anybody’s blood.

⚠ **Zero new claims, by construction.** Every sidenote line is a count of what the page already draws:
the readout has four rows and three are marked split, and the interpretation column says so in words.
Pre-flight on the changed files: 2 HARD, both the known pre-existing false positives on this page
("Nothing here is a diagnosis" and "treats" in the regards-as sense), none introduced here.

🔴 **The stronger version is owed to Ewa and was deliberately not built.** Hanging the real ranges in
the margin, the lab’s 37.5+ against our 25 to 70 for B12 and so on per marker, is what would truly
read as health reporting. Those figures exist and are Ewa-ratified, **but they live in source comments
beside the readout data and have never been rendered to a customer.** Putting them on screen is new
clinical content on a marketing page. Recorded rather than quietly skipped, because it is the better
design and somebody will reach for it.

### 🔵 Not done, and one of them is the fourth empty card

- **The structural move was NOT made.** The third suggestion was to stop containing prose and let the
  argument sections sit on the page with a rule instead of a tray, taking the page from twelve cards
  to about five. That is the change that most moves the register, and it is a bigger call than a
  device, so it is Keith’s. Worth judging now that the page has a spine of its own.
- 🔴 **The fourth of the four empty bento cards is now identified.** It is the argument section’s
  `.f-c-7` prose card: it carries `height: 100%` beside a taller photo card, so it stretches and
  leaves a large void under the lede, which the new sidenote makes more visible rather than less. Same
  defect and same fix as the interpretation card closed earlier today. Left alone to keep this change
  to what was asked for.

### Verification

tsc 0, `next build` 0 with dev stopped. Measured on the running page at 1440 and 390: six rules
stepping 1/6 to 6/6 with the band and needle at the matching percentage, the sidenote in a
`104px 447.5px` grid at 1440 and stacked at 390, no horizontal overflow at either. Screenshotted full
page and at the argument section.
## ✅ The site felt flat because the choreography was never ported (2026-09-02)

Keith: the design is good and everything flows, but it is still a little flat, with not enough
happening to hold the reader. **Not a taste problem.** The F build ported the direction’s layout, type
and spacing faithfully and dropped almost all of its motion.

| | `F-field.html` | the build, before |
| --- | --- | --- |
| Keyframes | 4 (`mask-rise`, `fade-up`, `band-in`, `you-in`) | 1 (`fRise`) |
| Scroll observers | 2 | **0** |
| Reveal | scroll-triggered, 44px + 7px blur, 0.9s, staggered 90ms | 14px, 0.7s, **fired at page load** |
| Readout bands | draw themselves across the track, 110ms per row | static |

🔴 **The sharpest number: `.f-rise` is applied 36 times across the six F routes and every one fired at
page load,** because the build kept the keyframe and left the trigger behind. There was no
`IntersectionObserver` anywhere in the app. So thirty-odd reveals played to an empty room in the first
700ms and were at rest before anyone scrolled to them. **The system had entrance motion designed into
it and a reader saw about two instances of it.** Same defect class as the hover lifts, the arrow pip
and the section rhythm: it was sitting in `F-field.html` the whole time.

### What shipped

- **The section reveal is now scroll-triggered** at the direction’s own values, `components/marketing/
  ScrollReveal.tsx`. The stagger is `(i%3)*90ms`, per row of three rather than cumulative, because a
  twelve-element page staggered cumulatively would end on a delay over a second long.
- **The readout draws itself**, and it is the only motion on the site doing an argument rather than a
  welcome. The page’s claim is that two scales disagree about the same number; a static picture
  asserts that, and the instrument now performs it. Lab band scales across, ours trails 140ms, the
  value marker lands at 500ms, rows cascade 110ms apart.
- **Two observers on two thresholds** (8% for sections, 35% for rows), because a row has to be
  properly on screen before its data draws or the reader misses the point of the animation.
- **DESIGN.md gained a Motion section.** It had none, which is part of why the choreography could go
  missing without anyone noticing.

### 🔴 The failure mode is a blank page, so it has four fallbacks and all four are tested

Everything that hides is scoped under `.js`. The class is never added when there is no
`IntersectionObserver`, under reduced motion, or with JavaScript off. The fourth case is the one that
is easy to miss: **if the class is added and hydration then never happens, nothing would ever reveal
and the page would stay invisible forever.** A 2.5s timer in the inline gate strips the class unless
`ScrollReveal` has signalled. Verified by blocking all 8 script requests after the gate ran: 12
elements hidden at load, 0 after the timer.

⚠ The gate is an inline synchronous script rather than an effect, because `.js` arriving after paint
would show every section, hide it, and fade it back in.

### Verification

tsc 0, `next build` 0 with dev stopped. **39/39** on a harness covering six routes × (load + full
scroll), plus reduced motion, JavaScript off, and the no-hydration case. Every assertion is on a
**computed style, never a status code** — today’s unstyled-page incident returned 200 with valid HTML
and dead CSS and produced entirely plausible numbers, so the suite opens by asserting a tray paints
its recessed ground. Readout captured mid-draw and at rest; the settled frame is pixel-identical to
the pre-motion static state, which is the correct end state.

🔵 **Not done, and deliberately.** The hero stagger (`mask-rise` / `fade-up`) is item 3 of the three
proposed and was not in scope; the homepage’s first screen still lands as one static slab, and it is
the obvious next increment. The hero canvas data-field stays unported: it animates real percentages
from `thresholds.md`, which makes it a data surface with a compliance question rather than a texture.
## ✅ The third of the four empty bento cards is fixed, and it was the worst of them (2026-09-02)

Keith pointed at the readout’s interpretation card. It is one of the four the 2026-08-31 critique
measured as 32-51% empty, and **it was worse than the worst figure that critique quoted**: at 1440 it
stood 747px tall carrying 244px of content, **67% empty, with the void in a single 423px block.** His
constraint was to keep the page’s overall balance.

### 🔵 Not a port omission, unlike the last several

The reflex by now is to check the direction first, because the last several defects found by eye were
things `F-field.html` had and the build dropped. **This one is the opposite.** `F-field.html:657`
writes the same `height:100%` and `justify-content:space-between` on the same short content beside the
same tall instrument, and it draws NINE marker rows where the build draws four, so the void is larger
in the approved direction than in the build. The port was faithful; the design has the defect.

### The fix is two changes, and the second is the one that matters

1. **The `.f-ro-f` sentence moved to the interpretation column.** "Three of these sit where a standard
   report would say normal and stop…" is interpretation, not instrument, so it belongs with the
   interpretation; the instrument card is now only the instrument. No new copy, byte-identical, and it
   still follows the rows on mobile because that column stacks after them. Renamed `.f-ro-note`, since
   it no longer needs a rule about the panel’s edges.
2. 🔴 **The card stops stretching.** `height: 100%` and `space-between` are gone, so it ends where its
   content ends. **Empty space INSIDE a bordered card reads as unfinished; the same pixels in the grid
   beside a card read as layout.** The void was never too much space, it was space wearing a
   container. The 8/4 asymmetry is untouched, which is what keeps the balance Keith asked for.

| at 1440 | before | after |
| --- | --- | --- |
| Card height | 747px | 506px |
| Content in it | 244px | **402px** |
| Largest void | **423px** | **24px** |
| Empty | **67%** | 21% |
| Instrument card | 727px | 637px |

⚠ **The key stays in the instrument and must not be moved here to fill space.** It was put there on
2026-08-31 exactly because this column stacks BELOW the chart on mobile, so keying the chart from here
asks a phone reader to infer which grey is which for four rows running. Recorded because an empty card
next to a chart with a legend is a standing invitation to make that mistake.

### 🔴 And the fix broke the card below it, which Keith saw immediately

Moving `.f-ro-f` out left the last marker row standing **20px off the card edge against 32px sides**,
and the instrument looked cramped at the bottom. `.f-ro-b` never had a vertical inset: **the card was
closing on `.f-ro-f`, whose own 20px bottom padding was doing that job as a side effect.**

**Removing an element removes its incidental contributions, and the padding an adjacent element was
donating is the one nobody lists.** A move is a deletion at the source, and the source’s neighbours
inherit the hole. Now explicit on `.f-ro-b`: 32px total at mobile, 40px at desktop, the latter
deliberately over the 32px side inset because content above an edge needs more than content beside one
to read as settled.

### ⚠ The measurement pass lied first, and the screenshot is what caught it

The first run reported the card 10% empty with a 16px void, against a screenshot Keith had already
shown was two-thirds empty. The numbers were correct measurements **of an unstyled page**: an earlier
`next build` had been run while `next dev` served from the same `.next`, so the dev server went on
answering **200 with valid HTML and dead CSS**. Port listening, curl 200, stylesheet tag present:
every cheap check green.

🔴 **This file already documents this trap** from 2026-08-31, it was read and quoted earlier the same
day, and it was still walked into twice. **A verification harness has to assert something that is only
true when the thing it verifies actually worked** — for a rendered page that is a computed style, not
a status code. Never run a production build against a running dev server’s `.next`: stop the server
first, or use a separate `distDir`.

### Verification

tsc 0, `next build` 0, with the dev server stopped this time. Measured and screenshotted at 1440 and
390 on a known-fresh server: void 423px to 24px, bottom inset 40px desktop and 32px mobile, `.f-ro-f`
gone from both the markup and the stylesheet.

🔵 **One of the four is still unaccounted for.** The critique named four cards; the kit row closed two,
this closes the third, and the fourth has never been identified in any record. It needs re-measuring
rather than assuming it went away.
## ✅ The amber double meaning is resolved, and both sides of it were already defective (2026-09-02)

Keith: amber means caution in the sample readout and credential in the nav and footer; change one to
a suitable colour. **Neither side was a matter of taste. Each was independently in breach of a rule
this repo had already written down**, so the fix is two token corrections rather than a new hue.

### The readout’s caution pill was on the MARKETING accent

`.f-mk-split .f-v-ours` used `var(--flag)`. `tokens/colours.css` records the 2026-08-29 accent
ruling, which forbids the accent on *"any results or sample-report panel — bar fills, status chips,
status dots"* and names this case exactly: *"on any surface, including a sample report embedded in a
marketing page."* The panel the pill sits in is that sample report.

🔴 **So the homepage was the one surface where a verdict wore the colour that also tints the £179
kit column** — precisely the collision the token file was written to stop, and it was in the file
as a worked example while the code did it anyway. The kit pages never had it: `.f-bar i.warn` has
always been `--color-status-warning`. Now `--color-status-warning` here too, ink on it at **6.18:1**
(white would be 3.19:1 and fail). Down from 9.02:1 on the old accent, which is a real reduction and
still well over the floor.

### The credential dots were the FILL-token defect, two instances after it was called closed

`.f-navstat i` and `.f-chip i` are 5px dots that were painting `--flag` at **2.18:1** on paper. That
is the same defect, at the same measured number, as the 32 amber ticks fixed on 2026-08-31 under the
rule *"`--flag` is a FILL token, never a glyph"*.

🔴 **DESIGN.md gap 8 stated that rule correctly and then listed these two as compliant**, closing
with *"It fills the pill, the nav status dot and the footer chips, and nothing else."* A 5px dot with
nothing on top of it is the glyph case the rule forbids, not the fill case it permits. **A rule and
its inventory are two separate claims, and closing an entry verifies only the first.** The sweep
enumerated `.f-ticks` because that is where the finding arrived; marking the gap CLOSED then made the
remainder invisible, because a closed gap is not re-read.

Both are now `--ink` at **19.69:1**. Ink rather than a new hue, for two reasons: it matches `.f-in`
in the comparison table, already an ink dot meaning present, and it adds nothing to a system whose
discipline is one accent. 🔵 **Explicitly not green:** `--color-status-optimal` in the chrome would
put the status triad in the nav and rebuild the same collision from the other side.

### Result

| | before | after |
| --- | --- | --- |
| Readout caution pill | `--flag` #E0A458, 9.02:1 | `--color-status-warning` #d97706, **6.18:1** |
| Nav credential dot | `--flag`, **2.18:1** | `--ink`, **19.69:1** |
| Footer credential dots (x2) | `--flag`, **2.18:1** | `--ink`, **19.69:1** |

**Amber now means caution and only caution.** The marketing accent keeps every use the 2026-08-29
ruling permits, and a DOM sweep of the homepage confirms it now paints on nothing there at all.

### Verification

tsc 0, `next build` 0. Measured and screenshotted on the running page at 1440: nav dot, both footer
chip dots and all three Monitor pills read back the intended tokens, and the deeper status amber is
visibly distinct from the marketing accent rather than a second shade of the same idea.
## ✅ The conflict-free receipt takes the inverted panel, and the footer stops saying wellness (2026-09-02)

Two of the five design calls carried from the dual-agent critique, both ruled by Keith and both
implemented. **Still on `redesign/direction-f`, which deploys nothing.**

### The receipt takes the inverted ink panel

DESIGN.md reserves the inverted panel for a conformity statement, **once per page at most**. The
homepage had one statement of that kind and was drawing it as an ordinary tray, so **it was spending
its one on nothing** and the strongest claim on the page carried the same weight as the section
above it.

🔴 **This is a departure from the direction, not a port omission.** `F-field.html:813` draws the
receipt as `tray > core > receipt` and the build was faithful to it. Keith overruled the direction.
Recorded in DESIGN.md and in a comment on the section so a future direction-vs-build comparison
reads it as ruled, the way the section-rhythm and heading-scale disagreements are.

⚠ **The container changed and not one word did.** Both sentences are byte-identical to the
pre-flighted copy, which is the same rule the `/kits` C1 panel states about itself. The panel’s
optional `.f-blab-lg` lead label was deliberately NOT added: it would be new customer-facing copy
and needs a pre-flight, not a redraw.

`.f-receipt h2` and `.f-receipt p` had one call site between them and now have none, so they were
deleted with a tombstone comment rather than left as a rule a later reader mistakes for live style.

### The footer stops contradicting ruling B, in BOTH places it was doing it

PRODUCT.md ruling B (Keith, 2026-08-30) is that the company describes itself as a men’s health
company, not a wellness brand. The shared footer said "a wellness information service" on every page
the chrome renders.

🔴 **It was two call sites, not one.** `components/shared/Footer.tsx:58` and
`app/lp/layout.tsx:17` ("Wellness information service only"), the second live on `main`. Changing
only the one that was reported would have made the site say two different things about what the
company is; a duplicated fact is invisible exactly while the copies agree, and the first correction
is what makes it visible. They cannot be collapsed to one source — the LP chrome is deliberately
separate — so they are coupled by a comment in each and nothing else.

⚠ **"information service" is load-bearing and stays.** It is the Phase-0 hedge: we provide
information, not health services, which is the line that cannot move before CQC. Ruling B changes
the adjective, not the noun.

🔵 **One instance deliberately NOT changed and owed to Ewa.**
`app/(app)/results-dashboard/handoff/page.tsx:161` says "Andro Prime is a wellness service" inside
the block commented as the not-a-diagnosis disclaimer. That sentence is addressed to a **GP**, not
to the market, and tells a clinician what kind of service this is. Ruling B governs market
self-description; changing a clinical-facing disclaimer is Ewa’s call, not a redraw’s.

### 🔴 A pre-flight defect found doing it: the negation detector cannot read an HTML entity

The scanner returns HARD on the footer’s `They don&rsquo;t diagnose conditions`, which is a plain
disclaimer. `NEG` accepts every literal apostrophe form (`'` `’` `‘` `` ` `` `´`) and no **entity**,
so `don&rsquo;t` and `don&apos;t` both read as bare claims. **Pre-existing, not introduced by this
change** — verified by testing both forms against the table. It means a false HARD has been sitting
on live footer copy on every page. Fix is small and not applied: decode apostrophe entities in
`stripMarkup`, which already decodes `&nbsp;` and `&amp;`. Suite `test-curly-negation.js` covers the
literal forms and would extend naturally.

### Verification

tsc 0, `next build` 0. Dev server restarted clean after finding **two** servers bound at once, on
3000 and 3001, which is the stale-capture trap this file already records; one listener now.
Screenshotted and measured at 1440 and 390 on a known-fresh server: one `.f-invert` on the page,
zero `.f-receipt`, heading **19.69:1**, body **11.93:1**, no horizontal overflow, both footers
reading the new wording on `/` and on `/lp/testosterone`.

⚠ The first contrast numbers reported for the body text were wrong and are corrected here: the
measuring helper took the first three integers out of `rgba(255,255,255,0.78)` and dropped the
alpha, so it reported the paragraph at 19.69:1, the same as solid white. Composited over the ink it
is 11.93:1. **A contrast helper that ignores alpha reports every translucent foreground as its
opaque colour**, which is always the flattering direction.
## ✅ The retired verdict vocabulary now has a mechanical check, and it found twelve live instances (2026-09-01)

The open half of the correctness group. The words were taken off three surfaces on 2026-08-31, but
nothing stopped them coming back — which is the whole lesson of the 2026-08-17 ruling, which was
applied to one page and reached none of the others.

### What shipped

- **`.claude/skills/compliance-preflight/badge-labels.js`** reads the allowed verdict words out of
  `lib/results/resultSeverity.ts`'s `BADGES` map **at run time**. Six labels: Optimal, In range,
  Reported, Monitor, Action Needed, See Your GP. The scanner and the customer’s result card cannot
  drift, and adding a state to the engine teaches the scanner about it in the same commit.
- **A derived allowlist rather than a blacklist of retired words**, so it also catches invented
  vocabulary nobody has used yet. `/lp/energy-recovery` was grading a marker "Suboptimal", which is
  not on anyone’s retired list because nobody knew it was there.
- **🔴 HARD on a verdict FIELD** (`status:` on a marker-row line, `ours:`, a `v-ours` span in a
  mockup) carrying a word the engine does not return. **🟠 REVIEW on the prose shape**, a retired
  verdict word alone inside `<b>`/`<strong>`/`<em>`, which is how one of the eight instances was
  written ("they read <b>borderline</b>"). Emphasis is also ordinary writing, so a human rules.
- **`test-verdict-vocabulary.js`, 49 cases, more than half of them negative.** The negative half is
  the load-bearing one: `lab: 'Lab normal'` sits on the same physical line as a checked field and
  MUST stay clear, because quoting the lab’s word is the entire point of the two-range readout.
  Also asserted: frontmatter `status: draft` clears, "Action needed" clears against the engine’s
  "Action Needed" (a casing difference is not a compliance defect), and the loader throws on a
  missing or unparseable engine file rather than returning an allowlist.
- 🔴 **The loader fails loudly by design.** An allowlist that silently came back empty would flag
  every verdict on every page; one that silently came back permissive would clear every one of them.
  Neither is a safe default, so `scan.js` stops instead of scanning without the check.

### 🔴 What it found on its first run, and it is LIVE

Zero hits on the six F routes and zero across 258 app files, 51 content assets and the blog MDX — the
redesign branch is clean. The hits are on `main`:

| Surface | Instances | Words |
| --- | --- | --- |
| `app/lp/energy-recovery/page.tsx` | 4 | Suboptimal, Low, Elevated, Normal |
| `app/lp/hormone-recovery/page.tsx` | 8 | Borderline, Normal × 3, Low × 3, Elevated |
| Five unpicked direction mockups + `2026-08-27-homepage-v2-argument.html` | 12 HARD, 20 REVIEW | Normal, Borderline, Elevated |

**The two landing pages are deployed and customer-facing**, and one of them repeats the exact defect
already found on `/kits/testosterone`: `/lp/hormone-recovery` grades free testosterone "Low" at
0.231, which needs the same `classifier.ts` referenceLow check before a word is chosen. **Not fixed
here.** Rewriting live sample-panel copy is a separate change with its own pre-flight, and it is on
`main` rather than on this branch. The mockups are unpicked directions and ship nothing; F was
chosen, and `F-field.html` is already clean.

### ⚠ The guard was too narrow twice in one hour, and both misses were silent

`status:` is a schema key across this repo, so it only counts as a verdict on a line shaped like a
marker row. That guard was written from the two files that prompted the work, and it was wrong twice:
a JSX row writes `band="warn"` rather than `band: 'warn'`, and `app/lp/hormone-recovery` names the
marker `name:` where the kit pages say `label:`. The second miss hid all eight live rows. **A
detector has two parts, the thing it matches and the context that makes the match count, and only
the first one fails loudly** — a too-narrow guard makes the file scan clean and the report say so.
Enumerate the guard’s vocabulary by grepping for the FIELD across the corpus, never for the VALUE
that prompted the rule: the value-first search finds the instances you already know about, the
field-first search finds the population.

### Verification

49/49 new cases pass; the six existing pre-flight suites still pass. 258 app files, 51 content
assets and the blog MDX scanned with zero verdict-vocabulary false positives. Rule and guard
vocabulary documented in `compliance-preflight/SKILL.md` §2d-ii.
## ✅ RESOLVED 2026-09-02 — The logo swap was blocked on vector masters, and the generator was gone (2026-09-01)

> 🟢 **RESOLVED 2026-09-02.** The masters were drawn rather than supplied: the mark is measured off
> the approved raster and rebuilt as geometry, and `gen-logo.js` replaces the lost generator. What
> follows is the original entry, kept because its account of the blast radius is still accurate and
> is what the swap has to satisfy. The one item still open is which grotesque the wordmark uses.


Keith flagged that a new logo and wordmark are coming. Recording what a swap touches, because it is
not a path swap and the surface is wider than the header.

- **The site is in a deliberate mixed state.** The Interlocked AP (Keith approved 2026-08-30) ships
  in the icon set only (favicon, app icon, apple-touch, PWA); `components/shared/Logo.tsx` still
  renders the Refined Monogram in the nav, the footer, the results dashboard and the activate layout,
  because `02_brand/assets/logos/interlocked-ap/` holds **only PNGs**, a README and `build-icons.js`.
  No vector masters exist. `02_brand/STATE.md` says the same.
- **Structural, not cosmetic.** `Logo.tsx` draws a 470x100 viewBox: a 100x100 black `<rect>` with the
  mark knocked out in white, plus a wordmark path. The Interlocked AP is specified as having **no
  container**, so the rect goes and the component changes shape.
- 🔴 **The regeneration path no longer exists.** `components/shared/logoArt.ts` carries the header
  "Regenerate via the logo build (gen-component.js); do not hand-edit path data", and
  **`gen-component.js` is nowhere in the repo** (searched whole tree, excluding node_modules). So a
  swap means rebuilding that step or outlining once by hand and re-annotating the file honestly.
  Rebuilding it is the better call: a logo that cannot be regenerated will drift the way everything
  else did this week.
- **Third consumer, easy to forget:** Vitall are owed the logo as SVG for the kit sleeve print
  (`02_brand/STATE.md`, packaging thread). The same masters unblock it.

**Needed from Keith:** SVG masters for mark and wordmark as separate files; whether light/dark is one
path inverted or two artworks; and confirmation the container is gone.

## ✅ The two cheaper kit cards are finished, and the void was never the missing photo (2026-09-01)

Keith: the price table looks unfinished for Testosterone and Energy & Recovery, and would a hover
flip revealing a photo fix it. **Diagnosis first: the void was photo-SHAPED.** Those two were
visibly the lead card minus a photograph, and `.f-kit ul { flex: 1 }` absorbed the whole difference,
so the layout spent 309px and 335px announcing an absence at the exact moment the visitor chooses.
The two cheaper products were disadvantaged by layout rather than by argument.

### 🔵 The flip was declined, and Keith's instinct was already served

A hover flip has no hover on a phone (where the void is worse, since cards stack full width), hides
information at a decision point, and is poor for keyboard and screen-reader users, which we had just
spent a pass fixing. **And the cards already do a reveal on hover**: `.f-tray:hover .f-shot img`
eases greyscale to 0.72 and lifts the tray. Giving all three cards photographs means that reveal now
applies to all three, which is the payoff the flip was reaching for, without the costs.

### What shipped

- **Two NEW generated photographs**, `public/home/img-6.jpg` (a man in a back doorway at dawn with a
  mug) and `img-7.jpg` (a man on a hallway stair after a run). gpt_image_2 via Higgsfield, 2k, ~17
  credits, briefed to contain **no clinic, no blood, no sample**, deliberately easier to clear than
  the inherited five. Now on the Kit 1 and Kit 2 cards.
- **One line per card, not a spec block.** `.f-kwho`: *"If the question is testosterone." / "If the
  question is energy and recovery." / "If you do not know which question it is."* It answers the
  question the page's own thesis says the visitor cannot answer, and makes Kit 3 the honest default
  rather than the expensive one. 🔴 Frame-constrained, not invented: §9 fixes Kit 1 as "where your
  testosterone stands" and never "why you're tired", and Kit 2 may claim nothing about testosterone.
  **Keith explicitly rejected a wall of text**, so the four-row spec block that was the first
  proposal was dropped once the photograph did the filling.
- 🔴 **A PORTRAIT crop for the narrow cards above 900px**, and this is the part that actually closed
  it. Photographs alone only halved the gap, to 192px and 217px, because **the void was never the
  missing photo, it was the missing photo HEIGHT**: at a shared 16:10 the 561px lead card gets a
  343px photo and the 272px cards get 162px, and card height is set by the tallest sibling.
  272 x 5/4 = 340px, within 3px of the lead. **After: 43 / 36 / 61px.** Below 900px the bento is one
  column and 16:10 was already exact, so the rule is scoped and does not apply there.
  Written at (0,2,1) so it beats `.f-shot-r16 img` on specificity rather than source order.

| | before | after |
|---|---|---|
| Gap, list to price, at 1440 | 36 / **192** / **217** | 43 / 36 / 61 |
| Gap at 390 | 36 / 36 / 36 | unchanged |
| Photo height at 1440 | 343 / 162 / 162 | 343 / 324 / 324 |

### 🔴 CA-045 is amended and the merge blocker is unchanged

**Keith's ruling, 2026-09-01: the gate governs SHIPPING, not creating.** Generating imagery on
`redesign/direction-f`, which deploys nothing, is not a breach; the assets must be registered and
signed before merge. The earlier reading in PRODUCT.md, that nothing could be created before
signing, was wrong and is corrected. The register row now covers **eight** assets and records two
things it did not: that the four-of-five evidence line was established on the hero FILM and does not
describe the photographs, and ⚠ **that img-7's trainers carry a logo-like mark**, which is a
trademark question rather than a clinical one and wants a look before signing.

### Verification

tsc 0, `next build` 0, `npm test` exit 0. Row measured and screenshotted at 1440 and 390.

## ✅ The value marker was collateral damage from the band fix, and is now a cased needle (2026-09-01)

Keith, looking at the built page: the range marker in black is barely visible against the two greys.
Correct, and **the previous day's fix is what caused it.** Raising `--ours` to 0.60 ink to get
lab-vs-ours from 1.51:1 to 3.17:1 took solid ink on that band from about 8:1 down to **3.31:1**, so a
3px mark was sitting on a ground nearly as dark as itself. One contrast pair was fixed by breaking
another, and nothing flagged it because the check that ran was band-vs-band.

**The fix is not to lighten the band again**, which only swaps the defect back. The marker stopped
being a FILL, whose legibility depends on whatever is behind it, and became an OBJECT that carries
its own contrast:

- **A paper casing**, 1.5px. The pair that now carries legibility is casing-against-band at
  **5.94:1**, not core-against-band at 3.31:1.
- **It stands proud of the track.** 22px tall in a 12px track, 5px over each edge, so 10px of its
  length is over white page at **19.69:1**. Same reason a ruler's tick extends past the rule.
- 🔴 **`.f-track` lost `overflow: hidden`,** which had been silently clipping the overhang the marker
  was already declared to have (`top: -3px; bottom: -3px` with a comment explaining why). Safe only
  because every band carries `border-radius: 999px` and no band's left+width exceeds 100%, checked
  across all four rows. **Verify that before adding a row.**

Measured identically at 1440 and 390: no band spill, no horizontal overflow. Legend swatch mirrors
the marker, casing included.

**The generalisable bit, and it is the third time this week.** A change that improves one measured
pair can silently degrade another pair that shares an element, and a verification scoped to the pair
you were fixing cannot see it. The contrast check has to cover every pair the element participates
in, not the pair that prompted the change.

⚠ Separately, Keith asked whether the sample results would be better in colour. **Recommendation:
no for the bands, yes for one thing.** The kit pages' bars are value fills, so status colour is a
verdict about a number and is right there; these are RANGES, and a range has no verdict, so a green
lab band would paint the exact claim the page's own heading calls not-an-answer. The narrow case
worth building is tinting only the DISPUTED interval on a split row, in a hue deliberately outside
the status triad, because "two scales disagree here" is a fact rather than a severity. Gated on
DESIGN.md's "never the status triad" line, which is a ruling, and on a pre-flight plus probably Ewa,
since the panel is the page's one piece of clinical content. Not built.

### Verification

tsc 0, `next build` 0, `npm test` exit 0. Marker geometry and all four contrast pairs measured at
both viewports. Panel confirmed by screenshot on a known-fresh server.

## ✅ Groups 1 and 2 of the critique backlog are cleared (2026-08-31)

The correctness group and the accessibility group, the two with no judgement calls in them.

### Correctness

- **The retired status vocabulary is gone from all three surfaces**, 8 instances mapped to the
  engine's own words from `lib/results/resultSeverity.ts`, and **`F-field.html` back-patched in the
  same change** so the next port cannot bring it back. Two rows were more than a wrong word:
  - The homepage's **testosterone row is a third SPLIT** and was never marked as one. 14.2 sits
    inside the lab's 8.64-29.00 (so a standard report says normal and stops) AND inside our 12-20
    band, which is `normal-testosterone`, which badges **Monitor**. Lab normal versus Monitor is a
    disagreement. The panel now shows three amber pills and the copy reads **"Three of these"**,
    which makes the page's own argument stronger, not weaker. 🔵 **Copy changed, Keith's to reverse.**
  - `/kits/testosterone` asserted **free testosterone was "Low" on a warn bar at 0.244**, when
    thresholds.md puts the reference low at 0.198 and `classifier.ts` returns `ft-low` only below it.
    The engine returns `ft-normal`, badge In range. The page was claiming a deficiency the engine does
    not find, in colour, and **a coloured bar IS a verdict**. Now In range on an ok bar. ⚠ Its `width`
    is deliberately unchanged: re-deriving bar geometry is a separate change.
- **The UKAS claim is standardised**, 11 instances to 0. 2 visible and 9 metadata, across 6 files
  including `/order/confirmed`, which was outside the F set and carried the same claim. The
  2026-07-25 CA-026 sweep had covered `app/lp/*` only. A few descriptions were trimmed by a word so
  the long form did not push them over length.

### Accessibility

| | Before | After |
|---|---|---|
| Amber ticks as a foreground glyph | **2.18:1**, 32 instances | **8.24:1** |
| `.f-blab.f-invert-lab` on ink | **3.95:1** | **19.69:1** |
| `.f-spec-k` on `--sunk` | **4.10:1** at 10px, 12 instances | **6.78:1** at 11px |
| `:focus-visible` rules | **0** (UA ring, invisible on ink pills) | 7, two rings, ink and paper |
| Tap targets under 24px | 13 per route | **1**, and it is SC 2.5.8 exempt |
| `<header>` landmark | **0** on every route | 1 |
| Heading-level skips | 1 on every route | **0** |

🔴 **The rule to keep: `--flag` is a FILL token, never a glyph.** It is designed to carry ink on top
of it, which is why the verdict pill measures 9.02:1 and passes, and it has nothing to give as ink.

⚠ **Two constraints turned out to be coupled through the banner's height.** Padding the cookie-policy
link for tap-target size grew the consent banner 6px, which pushed it back over the `/kits` hero CTA
and re-broke the P0 fixed the same day. Reverted: WCAG 2.2 SC 2.5.8 **exempts an Inline target**, one
in a sentence, which that link is. **Anything that changes the banner's layout must be re-measured
against the CTA collision.**

### ⚠ Two false alarms, both from the harness rather than the code

Worth recording so neither is rediagnosed as a regression:

1. **A heading skip and a hydration error that were both stale Turbopack cache.** The footer rendered
   `h4` after the source said `h3`, and `/how-it-works` threw a hydration mismatch. Clearing `.next`
   fixed both, and a stale chunk is exactly what produces a server/client mismatch.
2. **A screenshot that showed the OLD verdict words after they were fixed.** `next build` was run
   while `next dev` was serving from the same `.next`, which killed the dev server; the capture came
   back stale, and a second dev server had quietly bound port 3002 while a dead one held 3000
   returning 500. **When a screenshot contradicts a measurement, check the transport before believing
   either.** `curl` against the served HTML settled it in one call.

### Verification

tsc 0, `next build` 0, `npm test` exit 0. 6 routes x 2 viewports: 0 blocked controls, 0 heading
skips, 0 console errors, 0 horizontal overflow, landmarks 1/1/1/1. Served HTML greps clean: 0
"Borderline", 0 short-form UKAS. Readout and focus ring confirmed by screenshot on a known-fresh
server.

### 🔴 The half of group 1 that is NOT done

The scanner still has no rule for the retired vocabulary. Until the word list is in the pre-flight,
sourced from the engine's label map, this defect can return the same way it arrived and no mechanical
check will catch it. That is the entire lesson of the 2026-08-17 ruling repeating.

## ✅ The dual-agent critique ran, and three of its findings are fixed (2026-08-31)

`$impeccable critique` on the homepage, run twice: once single-context, then again as two isolated
parallel sub-agents because the first run was degraded. **The rerun was worth it. It found four
things the single pass missed and overturned two of its claims.** Score 16/32 applicable, bottom of
average; the design-specificity verdict was that the page passes on the strength of its writing and
the composition is riding the copy rather than carrying its own weight.

### 🔴 The three that are FIXED, all verified by measurement and by eye

1. **The consent banner covered the primary CTA on all six F routes at 390, including every "Order
   the kit" button.** `elementFromPoint` at each button's centre returned the banner's own heading.
   At 1440 it cleared them by 19px, which is exactly why nobody saw it: **the breakpoint a reviewer
   checks is systematically the roomiest one.** Fixed in three parts: the banner is compacted below
   560px (buttons share one row instead of stacking, which also STRENGTHENS the ICO equal-weight
   rule since they are now identical width), `CookieConsent.tsx` publishes its measured height as
   `--f-consent-h`, and the two hero patterns consume it. `.f-hero-film` centres in a viewport-height
   box so bottom padding lifts it; `.f-sec-hero` is for heroes that are not viewport-height, where
   only the leading offset can give. Both collapse to the design value the instant consent is
   answered: measured 282px → 34px, var removed. **After: 0 blocked controls on 6 routes × 2
   viewports**, down from 8.
2. **The two-range readout was illegible.** Lab band 1.32:1 against the track, the two bands 1.51:1
   against each other, 10px tall, no legend anywhere, for a readership PRODUCT.md puts at 40+. Now
   0.20 / 0.60 (lab↔ours **3.17:1**, ours↔track **4.89:1**), a 12px track, a key, and the ours band
   inset 2px vertically so it nests inside the lab band. ⚠ **The first fix for the coincident row
   failed and a screenshot is what caught it:** a ring on `.f-band-lab` was covered exactly by
   `.f-band-ours`, which paints later, so it was invisible in the one case it existed for. Height is
   the only axis the ours band cannot cover. **These are the approved direction's values and they are
   Keith's to reverse.**
3. **`.f-blab` rendered 30% oversized on every instance**, 15px instead of 11.5px, letter-spacing
   1.95px instead of 1.495px, because `.f-cell p` at (0,1,1) beat it at (0,1,0). 🔴 **This is the
   second half of a bug that was already fixed once.** The 2026-08-31 fix at `f-primitives.css:246`
   re-asserted only `font-family` and `font-size-adjust` and left `font-size` and `text-transform`
   behind, so the same collision was live on different properties against a different parent. **A
   specificity collision is a contest per PROPERTY, not per rule: re-assert everything the losing
   rule declares, not the properties somebody noticed were wrong.** `.f-blab-lg` was raised to
   (0,3,0) so Keith's approved large variant still wins; verified still 18.56px on `/kits`.
   Neither the detector nor the reconciler can see this class of bug: both declarations are present
   and correct and the file reads as though the rule applies. **Only `getComputedStyle` against
   declared intent finds it, and the reconciler compares declarations.**

### 🔴 What the critique found and is NOT fixed

- **The retired status vocabulary is live on TWO pages, not one.** `/` (4) and `/kits/testosterone`
  (4, including `'Low'`). The 2026-08-17 ruling was applied only to `/kits/hormone-recovery`, the
  page the pre-flight was pointed at. **A finding arrives attached to where the checker happened to
  look, and treating that location as the scope is the default failure.** Fix needs the two files,
  a back-patch of `F-field.html`, and the word list added to the scanner from `resultSeverity.ts`.
- **`--flag` used as a foreground glyph in 33 places**, 2.18:1. Recorded as DESIGN.md gap 8.
- **Zero `:focus-visible` and zero `outline: none`** across 1322 rules on all six routes. The UA ring
  ships, and on the ink-filled pill it is dark on dark and effectively invisible.
- **Tap targets:** 12 footer links at 22px on every route, 4 nav links at 18px at desktop, against
  WCAG 2.2 §2.5.8's 24px.
- **Four bento cards are 32-51% empty**, worst 360px of 702px, and at the kit row it makes the two
  cheaper products look unfinished. The layout ranks the products by how complete they look.
- **The UKAS claim has two forms on one page.** `page.tsx:536` says "UKAS accredited lab" while the
  same page's footer says "UKAS ISO 15189". The 2026-07-25 CA-026 standardisation covered `app/lp/*`
  only; `app/(marketing)/*` was never swept, and carries 2 visible and 9 metadata short forms.
- **"our GP" appears three times and Dr Ewa Lindo is never named**, on a page making a clinical claim.
- **`components/shared/Footer.tsx:58`** says "wellness information service" against PRODUCT.md ruling
  B (men's health company). Genuine tension rather than a straight defect: that line is doing
  regulatory disclaimer work in Phase 0 wellness mode. **Keith's ruling, not a redraw's.**

### ⚠ The pin was refreshed for accuracy the day before and still carried three false claims

Corrected in DESIGN.md in this change. The eyebrow **Don't** rule asserted the system "uses one on
every section, in the approved direction and all 13 frames"; `F-field.html` defines `.eyebrow` and
uses it **zero** times, so the rule would have told a future pass to ADD a component the direction
never used. The film was described as "half-speed, crossfade-looped" and is neither (`playbackRate`
measured 1, plain `loop`, no `playbackRate` in source). And `--status-optimal/warning/critical`
resolve empty because the real tokens are `--color-status-*`. **Re-reading a document finds claims
that disagree with each other, never claims that disagree with the world.**

### Verification

tsc 0, `next build` 0, `npm test` exit 0 (host-routing 97, membership 204, quiz-wtp 33, export 28,
classifier 22, vitall 21, all passing). 6 routes × 2 viewports: 0 blocked controls, 0 console errors,
0 horizontal overflow. Instrument and consent-collapse confirmed by screenshot, not by report.

## ✅ The hero film is ported, and both of its defects are worth keeping (2026-08-31)

Keith asked what had happened to the hero video. It had been left out and flagged, and the reason
given was overstated: the port is contained, because **in light mode the film is a texture, not a
dark hero.** It is greyscaled under a white wash running 90% to 26%, so the headline stays dark ink
on light. The earlier screenshot of the direction only looked dark because headless Chrome resolved
`prefers-color-scheme: dark`, which is a treatment this app cannot reach at all.

Ported: `table.mp4` (726KB, 15.46s, half speed, silent, crossfade loop) and `poster.jpg`, into
`public/home/`. Still not ported are layers 2 and 3, the drifting measurement rule and the canvas
data-field, because the field animates real percentages from `thresholds.md` and is a data surface
rather than a decoration.

### 🔴 Defect one, caught by the harness: hiding a video does not stop it

The obvious reduced-motion handling is wrong:

```css
@media (prefers-reduced-motion: reduce) { .f-film video { display: none } }
```

It hides the element and the browser goes on **downloading all 726KB and decoding every frame.**
Measured: `display: none`, `paused: false`, `currentTime` advancing. So a user who asked for less
motion paid the entire cost of the film and saw none of it, and the same rule meant to spare a phone
726KB spared it nothing.

**The gate belongs on the `<source>`, not in CSS.** An unmatched `media` attribute means the browser
picks no source at all, fetches nothing, and paints the poster:

```html
<source src="/home/table.mp4?v=1" type="video/mp4"
        media="(min-width: 641px) and (prefers-reduced-motion: no-preference)">
```

Verified after the change: **0 mp4 requests and `readyState: 0`** under reduced-motion and at 390,
1 request and playing at 1440. Pure HTML, no JS, and it cannot desync from the query.

### 🔴 Defect two, caught by Keith's eye: the hero's height is the film's framing

The clip rendered with the top and bottom of the frame sliced off. The arithmetic:

| | value |
|---|---|
| Source | 1280x720, aspect **1.778** |
| Hero box, sized to its own content | 1440x625, aspect **2.031** |
| Vertical fraction surviving `cover` | **87.5%** |
| Then `transform: scale(1.14)` | another **14%** |

A box wider than the source makes `object-fit: cover` fill the width and discard the height. The fix
is the one line that had not been ported: the direction's `min-height: calc(100dvh - 56px)`, which
makes the box **1.552**, narrower than the source, so the full height survives and cover trims a
little width instead. That is the right trade here because the wash covers the left edge anyway.
After: **100% vertical, 87.3% horizontal.**

**The lesson generalises past this clip.** A container's aspect ratio is an input to `object-fit`, so
omitting a height is not a layout detail that can be tuned later, it silently re-crops the media. And
the omitted value was doing a second job nobody would connect to it: a hero that ends above the fold
makes its own "Scroll for a sample result" hint meaningless.

### ⚠ One difference from the direction, not fixed

In the direction the nav sits inside the page and the film runs behind it. Here the nav is the shared
floating shell above `.f-page`, so it sits on white and the film starts below it. Closing that gap
means changing the chrome, which all 25 marketing routes wear, so it is left alone and recorded.

## ✅ The homepage is built in Direction F, from the direction itself (2026-08-31)

Keith asked why `F-field.html` was not one of the five F pages. It is a mockup, not a route, but the
real answer is more uncomfortable: **it is the homepage design**, picked from six on 2026-08-27
(`8c8066f`), and the homepage was the one page nobody had built from it. The five that existed were
built from the per-page journey frames, which are *derived* from this file and have now been shown to
have drifted from it twice. **This page is the only F page with no intermediary.**

Its section headings are the monitoring thesis, not a paraphrase of it:

> You don't know which question you're asking yet. / We give the thinking away. / We do not sell you
> the answer.

`07_sales/funnel/site-funnel-model.md` v2 already said this out loud: *"the live homepage leading on
kits is a lag: it is built faithfully to funnel model v1 and v2 says so on its face. The lag closes
when the page is rebuilt."* This is that rebuild.

### The copy rule inverts here, and the reason is dated

On the kit pages, live copy beat the frame because the frames proposed wording nobody had approved.
Here the opposite holds: the live homepage is built to funnel model **v1**, and this direction was
approved **after** the monitoring thesis. The direction is both the newer artefact and the approved
one, so its copy wins. The kit-page rule is not overturned; its test (which artefact is approved and
current) simply returns the other answer.

### What was NOT ported, deliberately

- **The hero film and the canvas data-field.** The film is half of CA-045 and the field animates real
  threshold percentages; both want their own pass. The hero is built to receive them.
- **Geist.** The typeface ruling supersedes the direction on faces only. Spacing, scale and rhythm
  are the direction's.

### 🔴 CA-045 is now the merge blocker on this branch

The five photographs (`assets/d/img-1..5`, now `public/home/`) are inside CA-045 together with the
hero film. Status OPEN, signers **Ewa and Keith**, and it fails the Keith-only entry test at Q2
because a homepage hero is customer-facing. **Its own words: the gate arms "when a direction is built
into the site."** This commit is that moment. `redesign/direction-f` deploys nothing, so building it
is safe and **merging it is not.**

⚠ **A discrepancy in the register worth carrying forward.** Its evidence line says four of five
judgement questions are already answered: *no people, hands, clinic, blood or sample.* That was
established on the hero FILM frame and does not describe the five photographs. `img-3`'s own alt text
is *"a man's hands at a kitchen table holding a small plain sample collection tube"*, which is people,
hands and a sample. Those questions are open for these assets, not evidenced.

### 🔴 The pre-flight found 2 HARD, and neither came from the rebuild

Both are verbatim from the approved direction, and both read as false positives:

1. **"Nothing here is a diagnosis"** trips «diagnosis». It is a disclaimer, and the scanner passes the
   same word four lines later in *"That is not a diagnosis"*. Its negation detector matches
   `is not a X` and misses a leading `Nothing here is a X`, so two identical intents get opposite
   verdicts.
2. **"the NICE guideline our GP follows TREATS 25 to 70 as an indeterminate zone"** trips «treats» as
   a medicinal claim. It is the *regards as* sense, about a numeric band.

**Neither is self-cleared.** A signed exception requires a real CA number and there is none. Both go
to the judgement pass. The genuinely notable part: CA-045 records the scanner as N/A for that file
because the imagery has no words, so **the direction's COPY has never been through the scanner until
this build.**

### ⚠ The demo card ships with no CTA, on purpose

The first draft linked *"Open the demo"* to `/results-dashboard/demo`. **That route does not exist** and
was invented. The demo is a decided part of the free layer (thesis §10.1, answered 2026-08-24) and is
built only as an interactive prototype at `design/prototypes/demo-account-interactive.html`. The card
keeps its approved copy and carries no link, so the page promises nothing it cannot do.
**Building that route is what completes "give away the thinking".**

### Verification

Typecheck 0, `next build` 0. Rendered at 1440 and a true 390 on the PRODUCTION server: no horizontal
overflow, no console errors, 5 bento grids, 4 marker rows, 2 split rows, `.f-sec` resolving 130/72.
⚠ **A false alarm worth recording so it is not rediscovered:** three images read as broken across
several passes. They are not. The optimizer returns 200 with valid JPEG and a cache HIT, and all five
load when walked into view one at a time. The harness was scrolling at roughly 10,000px per second,
which outruns the fetches; the correlation with the `r16` aspect class was coincidental, since those
three are simply the last three on the page.

### New primitives

`.f-bento` and its 12-column spans, the two-range readout (`.f-track`, `.f-band-lab`, `.f-band-ours`,
`.f-you`, `.f-verd`), `.f-shot` photography, `.f-rstep`, `.f-kit`, `.f-receipt`, `.f-lede`, plus
`--lab` and `--ours` tokens. **`.f-rstep` is deliberately not `.f-step`**: the direction's plain
bordered list row and the kit pages' ghost-numeral card are different components that shared a name
across two files.

## 🔴 The F build had lost the approved direction's spacing, and the journey frames are where it went (2026-08-31)

Keith put the running site next to `design/mockups/directions/F-field.html` and said the local site does
not carry the same direction. It did not, and **the build is not where it was lost.**

### The drift chain

| | container | section rhythm |
|---|---|---|
| **`directions/F-field.html`** — the approved direction (`8c8066f`, picked from six) | **1180px** | **72/72**, and **130/130 above 900px** |
| `journey/*-F.html` — the 13 per-page frames, drawn later | 1240px | **38/6** |
| `f-primitives.css` — ported from the frames, faithfully | 1240px | **38/6** |

The frames compressed the direction's rhythm by roughly **3.4x** and widened the container by 60px. Every
F page inherited it, which is why the build measures clean against Frame O and still does not look like
Direction F. **A page can be a perfect port of the wrong artefact.**

### What changed

- **`--f-sec-gap` / `--f-sec-below`** now drive `.f-sec` and `.f-close`: **72px mobile, 130px desktop**,
  20px below. Kit 3 goes 7,246 to 8,262px; `/how-it-works` to 7,966px.
- **`.f-wrap` is 1180px**, the direction's container.
- **Structural note that matters for anyone reading both files:** the direction wraps a WHOLE section in
  `.sec`, so a boundary costs 130 bottom **plus** 130 top, 260px. This build splits a section into a
  `.f-wrap.f-sec` header and a sibling content wrap, so the boundary is paid ONCE. `--f-sec-gap` is the
  whole boundary, not one side. Keith chose the direction's single 130 over its literal 260, because a
  7-section homepage and an 11-section kit page do not have the same scroll budget.
- **Keith ruled the direction wins over the frames**, so **the 13 journey frames are owed a sweep** on
  both values. Until then the reconciler carries both as `RULED`, not as drift: conflicts 19 to 16,
  ruled 1 to 4.

### ⚠ What was deliberately NOT changed

**Heading scale.** The direction runs `h1` at `clamp(38px,10.4vw,88px)` and `h2` at
`clamp(28px,6.6vw,50px)`; the build is `clamp(2.4rem,5.6vw,4.1rem)` and `clamp(1.6rem,3.4vw,2.5rem)`, so
the direction's headlines are larger and scale about twice as hard with viewport. It is a real part of why
the direction reads bold. It is left alone because it re-breaks the Frame O optical audit and moves every
headline's line breaks on four built pages. **Still available, still Keith's.**

### The impeccable audit, and one real defect it found

`$impeccable audit` on the two new pages: **18/20, Excellent**. A11y 3, Performance 4, Responsive 4,
Theming 3, Implementation Integrity 4.

- Its single detector finding was a **verified false positive**: `.f-navshell.f-scrolled::after` flagged
  as a "side-tab accent border", when it is a full-width **bottom** rule on the nav in `var(--ink)` that
  signals the page has scrolled under the shell. Wrong element, wrong edge, wrong purpose.
- 🔴 **P1, real, NOT fixed:** `.f-spec-k` puts `--ink-3` on `--sunk` at 10px for **4.1:1**, under
  the 4.5:1 floor. **12 instances**: 9 on `/kits`, 3 on `/kits/hormone-recovery`. The direction's own
  token comment defines `--ink-3` as the *"floor for functional text"* at **4.99:1 on paper** — so the
  defect is using it on a recessed well, which breaks the direction's stated contract as well as WCAG AA.
  One rule fixes all 12.
- **P2:** no `:focus-visible` anywhere in the F layer. Nothing sets `outline: none` either, so the UA ring
  shows; focus is visible but undesigned.
- **P2:** `Footer.tsx:77` skips h2 to h4, on every page on the site.
- **P3:** the direction and every journey frame carry a full dark-mode palette. **The app implements none**
  — no `prefers-color-scheme` or `data-theme` in `styles/tokens/`, `f-primitives.css` or `globals.css`. A
  frame reviewed in dark mode therefore shows something the site can never render, which is exactly how
  the superseded inverted Kit 3 card survived review.

## ✅ Kit 2 and Kit 3 built in Direction F, and the frames were one section short (2026-08-31)

`/kits/energy-recovery` from **Frame Q** and `/kits/hormone-recovery` from **Frame R**, the third and
fourth F pages. Typecheck 0, `next build` 0, both rendered at 1440 and a true 390 and probed on the
built DOM: 0 mono labels in the body sans across all three kit pages, 0 step cards missing an index
or a meta row, Kit 3's 9 report rows with exactly 1 unbanded (FAI), 2 founders, 5 table rows, and
`/kits/testosterone` re-probed unchanged as a control.

### 🔴 The frame labels are a checksum, and running it found three omissions

Each frame's label states its section count. **Frame Q says eight sections and draws seven; Frame R
says ten and draws nine.** Counting is one grep and it found:

- **Frame Q dropped the symptom checklist.** The live page has it and Frame P draws the equivalent
  for Kit 1. Restored.
- **Frame R draws the `Built for` heading with no body at all.** The live page has four cards and a
  closing line. Restored.
- **Frame Q replaces the sample report's Recommendation row with commentary ABOUT the mockup**
  (“Every row mirrors what the results engine would actually return for these values”), sitting
  inside the card in a `.fine` rather than outside it in a `.note`. Frame P puts the Recommendation
  row there and every live kit page carries one. Shipping it would have published meta-text as
  customer copy. This one was found because the section count had already made absence the thing to
  look for.

**The file already records this defect against itself** — its own note says Kit 3's FAQ “was
missing from the first draft of this frame: the page has ten sections and nine were drawn.” So the
failure mode was known, the verifier was sitting in the artefact, and nobody had run it. A
declaration diff cannot see an absence, because a rule with zero users still parses; a self-stated
count can.

### ⚠ Layout from the frame, COPY from the live page

Frames Q and R both propose close headlines the live pages do not carry (“Find out what's actually
slowing you down”, “The full picture, in one test”). The Kit 1 rebuild appeared to settle
this and did not: Frame P's close matched the live one **exactly**, so nothing had to be decided.
Checking `ea662ce~1` settles it — Kit 1's live close was already the frame's wording. Both new
pages therefore keep their live close copy. The same rule keeps Kit 2's four-item `.f-trustrow`,
against Frame Q's one-line `.trust` which drops “GMC-registered doctor” and “Free UK
delivery” and adds “No GP needed”: that is a change to hero trust copy, not to layout, and
Frames P and R both draw the four-item row.

### 🔴 Kit 3 keeps its biomarker grid and its process steps, and that is Keith's to reverse

Frame R draws **neither**, folding nine markers into three `.spec` rows of names only. Kit 1 and Kit 2
both keep theirs, so following the frame would leave the **£179 flagship the thinnest of the three
pages**. Given the frame is provably one section short and has an empty section elsewhere,
“incomplete” is a more economical reading than “deliberately minimal” — but it is a
design call. **Deleting the two blocks is a five-minute change; restoring them later would not be**,
which is why they are in rather than out.

### What else changed

- **The comparison table on Kit 3 is DERIVED**, from `lib/pricing.ts` and `lib/kits/panel.ts`, which
  is what Frame R's own annotation asks for (“they share four facts with nothing keeping them in
  step”). It reuses `.f-table` rather than adding the frame's second `.cmp` table system.
  🔴 Still open, and named in the frame: whether the two comparison tables collapse into one
  at all. This makes them consistent, not singular.
- **Both FAQPage schema graphs are now generated from the array the page renders.** They were
  hand-written second copies, and Kit 2's **had drifted**: the schema's “Can I test testosterone as
  well?” answer said “the full testosterone panel for £179” while the visible answer
  named the five markers. FAQPage requires the answer to match the visible page, so this fixed a real
  mismatch rather than only a maintenance risk.
- **`.f-founders` / `.f-founder` ported** from Frame R, the only frame that declares them. The quote
  is a **class**, not the frame's bare `.founder q` element selector: an element selector inside a
  card is the exact shape that produced the `.invert p` bug on this same frame.
- **The step strip is still three local copies and deliberately NOT extracted**, though the frame
  calls it “the clearest single argument for rebuilding these pages from shared parts”. The
  three are not identical: Kit 1 and Kit 3 say “Simple finger-prick at the kitchen table”,
  Kit 2's live copy says “A simple finger-prick sample you can do at the kitchen table”.
  Merging would silently pick a winner, which is a copy decision and Keith's. Worth doing once that
  one word is ruled.
- 🔴 **`RelatedArticles` is now the visible seam on both pages**: V2.0 hard black borders and
  uppercase sans sitting under a finished F page. Confirmed by eye on both screenshots.

## ✅ Four interaction and accent defects on `/kits`, all found by Keith side by side (2026-08-31)

None of these were type. All four were the accent doing its job in the frame and not in the build,
and one of them means the build had been carrying a **superseded** design.

### 1. The kit cards did not respond to the reader

Frame: `.tray.pick` lifts 3px on hover and draws a **1.5px accent ring**, the same on-state as the
step cards, so the page has one interaction idiom rather than two. The build had no hover at all.
Ported as `.f-tray-pick`, with the reduced-motion reset the frame also carries.

⚠ **Not ported: the touch equivalent.** The mockup's JS adds `.act` to whichever card is in view, so
a phone gets the same signal a pointer does. The build's step cards do not have it either, so leaving
it out keeps the two consistent. **It is owed on both, not just here.**

### 2. 🔴 Kit 3 was still the INVERTED card, which the frame superseded and says why

The build drew Kit 3 as a black inverted card. **Frame O does not**: it draws a light card with a
permanent accent ring and a gold `Kit 3 · Most complete` chip, and the frame's own annotation gives
the reason, which is worth quoting because it is a design constraint and not a preference:

> "It marks the same thing for the same reason (the selector defaults upward to Kit 3 when the
> picture is mixed) **without asking the page to change colour scheme mid-scroll, which is what
> stopped the inverted card working in dark mode.**"

So the build was carrying a version the frame had already rejected, for a reason that only shows up
in dark mode. Now the accent-ringed card, with the chip, and its CTA back to solid (it had been
`f-btn-onDark` because the card was dark). Keith reported the missing chip; the inversion underneath
it is the larger half and is the part nobody would have found by looking in light mode.

### 3. The comparison table's Kit 3 column was neutral grey

`.f-col-hi` was `var(--sunk)`. The frame is `var(--flag-f)`, the accent tint, and the **row under the
pointer deepens it to `--flag-f2`** while every other row goes grey. Both ported, with the transition
and its reduced-motion reset. The build had no row hover at all.

### 4. The table's Kit 3 Order button was ghost

The frame gives Kits 1 and 2 `btn ghost sm` and Kit 3 `btn sm`, solid. All three were ghost, so the
column the table is built to recommend had no more weight than the others.

### 🔵 One difference NOT changed, because Keith was looking straight at it and did not raise it

The frame marks the table cells with **18px rounded squares**: a filled square with a tick for yes,
an outlined one for no. The build uses **11px filled and hollow circles**. That is a real component
difference, not a rendering artefact, and it is his call rather than a silent port.

---

**Method note.** All four came from Keith comparing the two windows side by side, after a full
automated optical audit had passed everything on the same page at under 1.5%. **The audit measures
what it was told to measure**: sizes, faces, declared values. It has nothing to say about a hover
state that does not exist, an accent that is the wrong colour, or a card carrying a superseded
design. The eye found what the harness could not, on a page the harness had just declared clean.

---

## ✅ Every text component on `/kits` audited optically against Frame O, and four were wrong (2026-08-31)

Keith: "check all of the tags, including the content text, make sure everything aligns. The H1 looks
a little small." It did, and so did four other things, and the audit is now a tool rather than a
one-off reading.

### The harness, and why `getComputedStyle` was not enough

`font-size-adjust` changes the **used** size, and `getComputedStyle` still reports the **declared**
one, so reading the CSS could not answer the question. The harness measures what is actually on
screen and makes it comparable across different faces:

1. put a probe span inside the real element with `letter-spacing: normal`, so width is purely
   metrics x size;
2. measure its DOM width, which reflects the used size;
3. measure the same string on a canvas at 100px in the same font;
4. used size is the ratio, and cap-height and x-height scale by it.

Fonts are explicitly loaded and `document.fonts.check`-asserted first, because **canvas silently
measures the fallback** and returns confident identical numbers for every face. Script:
`scratchpad/optical-audit.js` (not committed; it belongs in `12_operations/automation` if it is kept).

### What it found

| | drift before | cause |
|---|---|---|
| **All five serif headings** | **-4.2% cap, -16.7% x** | face, not size: Newsreader's cap ratio is lower than Geist's |
| **H2 on the inverted panel** | **-20.2% cap** | 🔴 real drift: frame clamps it to 3rem, the build inherited plain `.f-h2` at 2.5rem |
| **Panel row title** | **-8.8% cap** | 🔴 real drift: frame 16.5px, build 15px |
| **Step meta row** | **absent** | 🔴 real drift: the frame's step cards carry one, `/kits` dropped it, `/kits/testosterone` kept it |
| **Step meta size** | **+7.6%** | 🔴 real drift: 11px against the frame's 10.5px, plus padding, gap and tracking |
| Body, buttons, prices, spec values | +0.3% to +1.4% | ✅ the sans compensation holding |
| Everything mono | +2.8% | JetBrains Mono runs slightly larger than Geist Mono. Left alone, below the threshold |

### The fix for the headings: cap-height, not x-height

`font-size-adjust: cap-height 0.71` on the eight display rules, Geist's measured ratio. The body uses
the x-height form (`0.53`) because **x-height is what the eye reads as size in running text, and
cap-height is what governs a headline's architecture**: its line breaks, its block height and its
relation to the grid. Matching the headline on x-height instead would have scaled it about 20% and
broken every line break the port has been matching all session.

⚠ **The residual is real and is a property of the pairing Keith chose.** Headlines now sit at +1.5%
on cap but still **-12% on x-height**, because a serif carries a lower x-height than the sans it
replaced. That is intrinsic to serif-over-sans and cannot be fixed without changing the architecture.
If it still reads small, the one-token change is the x-height form on the display rules.

Two-value `font-size-adjust` was **verified supported at runtime** before being relied on, and like
the body's version it self-corrects when the licensed serif replaces the stand-in.

### After

**Every component within 1.5%, except one at 3.8%.** That one is `.f-h4` at 18px against the frame's
17.6px on step titles. 🔵 **Deliberately not changed**: `.f-h4` is a shared generic that maps onto
several different frame rules (`.step h4` 17.6px, `.band h4` 15.5px), so setting it to 17.6 fixes one
caller and moves two others. It needs the component split, not a number change.

⚠ **One audit finding was the audit's own bug**, and it is worth knowing before trusting the table:
`.f-h2` matched the inverted panel's heading first in DOM order, so two rows measured the same
element and reported a phantom +21.8%. A selector-pair audit that takes the first match will conflate
a component with its own specialisation. Fixed with `:not(.f-invert-h)`.

---

## ✅ The humanist sans is in, and it needed an OPTICAL correction, not a size change (2026-08-31)

Keith, on the running site: "the font size looks a little small when I compare it against the
mockup". He was right, and the cause is measurable rather than a matter of taste.

### Measured, not eyeballed

x-height at 100px, measured in a real browser with the faces explicitly loaded:

| face | x-height | cap | width of the same sample |
|---|---|---|---|
| Inter (was in the build) | 55 | 73 | 1585 |
| **Geist** (what the mockups are drawn in) | **53** | 71 | 1520 |
| **Source Sans 3** (now) | **49** | 66 | **1359** |

**x-height is what the eye reads as "size", not the declared px.** Every `font-size` in
`f-primitives.css` was ported from a frame drawn in Geist, so the same 16px is **8% optically
smaller** on Source Sans 3. It is also a **14% narrower** face than Inter, which compounds the
impression and is the same thing that moved every `ch`-based measure.

⚠ **The first measurement was wrong and said all four faces were identical.** `canvas.measureText`
does not trigger font loading, so every face silently measured the fallback. The rewrite loads each
face explicitly and **asserts `document.fonts.check` plus a guard that fails if all values match**,
because "every face is the same" is what a fallback looks like, and it looks like a result.

### The fix: `font-size-adjust: 0.53` on `.f-page`, not 40 edited numbers

Pinning the x-height ratio to Geist’s 0.53 scales the used size by 1.082 and **leaves every declared
value in the file matching its frame**, so the porting fidelity built up over this session survives.
It is also the fix that survives the NEXT face change: whatever licensed humanist lands, it renders
at the size the mockups were drawn at with no re-editing. Use 0.55 to match Inter instead.

**Reset to `none` on all 31 rules that declare `--font-mono` or `--font-display`**, since those sizes
were judged on their own faces. The reset was applied **mechanically wherever the family is set**, so
it is complete by construction: 31 resets for 31 declarations, and a new component cannot drift out
of step. Browsers without `font-size-adjust` get the un-compensated size, which is what shipped
before, so it degrades to the status quo.

**Verified by measuring a fixed string rendered inside the real elements**, which captures the used
size that `getComputedStyle` does not report: body copy went from far off to **3.1% narrower than the
mockup**, and the residual is Source Sans 3 being a narrower face, which is a different axis from
x-height and not something `font-size-adjust` addresses. Mono and display unchanged.

### 🔴 And the probe found a defect in the APPROVED MOCKUP

Chasing an outlier in the measurement: `kits-F.html` declares `.blab { font-size: 11.5px }`,
specificity (0,1,0), and `.invert p { font-size: clamp(1.02rem,1.5vw,1.16rem) }`, specificity (0,1,1).
The "What you pay" label is a `<p class="blab">` inside `.invert`, so **it renders at 18.56px instead
of 11.5px, 61% larger than the other thirty instances of the same component**, in the frame that was
reviewed and approved.

🟢 **The build does NOT have the bug**, because it expresses the same styling as a class
(`.f-invert-p`) rather than an element selector. All 14 of its `.f-blab` render at 11.5px. **For once
the drift favours the build and the mockup is the thing to fix**, which inverts the assumption the
whole porting exercise runs on. It is the third instance of this specificity class in one day, after
the 37-of-51 mono labels; logged as observation 534.

⚠ **Keith approved that frame with the big label on screen**, so whether it becomes 11.5px or stays
deliberately large is his call, not a silent fix.

---
## 🔴 Keith spotted two things on `/kits` by eye, and the diagnosis found a third that was on every F page (2026-08-31)

He compared Frame O against the running `/kits` and asked two questions: why does the paragraph
under the H1 wrap differently, and why is the line under the CTAs missing its tick and set at a
different length. Both were real. **The measurement that answered them found a third defect neither
question was about.**

Everything below is measured on the rendered page with `getComputedStyle`, not read off the source.

### 1. The line under the CTAs was built as the wrong component

The frame has a dedicated `.trust`: a **46ch mono line, `display:flex` with a 10px gap, hanging an
accent-free tick glyph**. The build reached for `.f-fine`, which is generic fine print: **66ch, block,
no tick**. Measured against the frame: 479px wide over two lines against 317px over three, tracking
0.04em against 0.06em, and no glyph at all.

**This is the fourth instance of the same missing-tick defect** after the three found on
`/how-it-works` earlier the same day. Now ported as `.f-trust` and matching the frame exactly: 317px,
three lines, mono, flex, gap 10px, tick present.

### 2. The hero grid was re-derived rather than ported

Frame, and **all three mockups that declare it agree**: `1.35fr 1fr`, gap 44px at ≥980px, 30px below,
`align-items:start`. The build had **`7fr 5fr`, gap 40px, base gap 26px, `align-items:center`**. Four
values in one rule, and `7fr 5fr` is 1.4, a different column. **Same error shape as the card grid the
handoff records** (`8fr 4fr` against `1.75fr 1fr`): a decimal ratio converted to an integer fraction
and landing somewhere else. Now ported; both sides measure `664.078px 491.922px`.

### 3. 🔴 THE ONE NOBODY WAS LOOKING FOR: 37 of 51 mono labels were rendering in the body sans

`.f-page p, .f-page li, .f-page blockquote { font-family: var(--font-sans) }` is specificity
**(0,1,1)**. `.f-blab, .f-fine { font-family: var(--font-mono) }` is **(0,1,0)**. The body rule wins on
every one of those that is a `<p>`.

| page | losing the mono face | keeping it |
|---|---|---|
| `/kits` | `f-blab` x14, `f-prow-m` x3, `f-fine` x2 | `f-spec-k` x9 (spans) |
| `/how-it-works` | `f-blab` x11 | `f-blab` x1, `f-trust-l` x4 (spans) |
| `/kits/testosterone` | `f-blab` x6, `f-fine` x1 | none |

**Spans were fine, `<p>`s were not, which is exactly why it never looked systematic.** It survived a
typecheck, a production build, several screenshot passes and a human review of the rendered page: a
label in the wrong face at 11.5px reads as a design choice unless the correct one is beside it. Four
single-class rules were beatable this way: `.f-blab`, `.f-fine`, `.f-prow-m`, `.f-spec-k`,
`.f-trust-l`. All now re-asserted at (0,2,0). Re-measured: **51 of 51 correct.**

⚠ **The comment above the offending rule predicted this exact failure and called it silent.** It
shipped the prediction and no detector. Logged as observation 530.

🔵 **The better fix is deliberately NOT taken here.** Setting the container's default face by
**inheritance** (`font-family` on `.f-page` itself) would make the whole bug class impossible, because
inheritance loses to any matching class rule. That is a cascade change across every F primitive and
wants its own rendered check across all three pages, not a slot inside a defect fix.

### What is NOT a defect: the standfirst measure

Both sides declare `max-width: 56ch`. The frame resolves it to **724.7px** and the build to
**689.6px**, because `ch` is the width of the font's own zero and the frame is drawn in Geist while
the app renders in Inter. **Every `ch`-based measure in the app is therefore about 5% narrower than
the frame drew**, which is what makes a paragraph wrap a line earlier at narrow widths. This is a
consequence of the ruled typeface change and it will move again when the licensed humanist sans
lands, so chasing pixel parity now would bake in a stand-in's metrics. Left alone deliberately.

### 🔴 The reconciler was blind to every media query, and this is how we found out

Built hours earlier, it reported nothing about the hero grid. The ratio lives in
`@media (min-width:980px)`, and the reconciler keys rules by selector plus condition: the mockups
write `(min-width:980px)` and the app writes `(min-width: 980px)`, so **every responsive rule on both
sides filed as "unpaired" and was never compared**, while the tool reported 21 conflicts and exited 2,
which looks exactly like a working tool. Fixed. The unpaired bucket fell 75 to 67 and it immediately
found a conflict it had never been able to see (`.f-invert` padding at ≥800px, 48/44 against 52/48).

**The lesson is the sharper half of the one from building it.** Its earlier bugs produced false
positives, which are loud and were fixed in minutes. This one produced false negatives, and a
checker's false negatives are worse than no checker, because the exit code becomes evidence. **Watch
the size of the "could not compare" bucket, and distrust the tool most when it agrees with you.**
Logged as observation 531.

---

## ✅ The mockup-vs-primitives reconciler is built, and it has a ruling waiting (2026-08-31)

`andro-prime/12_operations/automation/reconcile-f-css.js`. Item 3 on the handoff list.

```bash
node andro-prime/12_operations/automation/reconcile-f-css.js            # full report
node andro-prime/12_operations/automation/reconcile-f-css.js --quiet    # summary only
node andro-prime/12_operations/automation/reconcile-f-css.js --selector .f-btn
node andro-prime/12_operations/automation/reconcile-f-css.js --json
```

Exit **0** agree, **2** drift, **1** could not run, which is never a pass. Same shape as
`.claude/skills/wrap/reconcile-observations.js`. All three paths exercised.

**It reports, it does not rewrite.** With 14 copies and no ruling yet on app-vs-marketing density, a
script that fixed the drift would be picking a winner on Keith's behalf.

**Validated against a known answer before being trusted**: it reproduces the handoff's hand-measured
figures exactly, `.btn` padding at `14px 24px` x8, `13px 22px` x2, `12px 20px` x2, `11px 18px` x1,
and `.eyebrow` margin-bottom 18px x4 against 20px x4.

### What it found: 22 conflicts, 31 mockup-vs-mockup (now 18 and 33, see below)

~~🔴 **`.f-step .f-step-foot` disagrees with three mockups on FOUR properties at once**: padding-top
16 against 13, gap 10 against 12, font-size 11 against 10.5, tracking 0.1em against 0.12em.~~
✅ **FIXED LATER THE SAME DAY**, all four ported, and the reconciler now reports **0 conflicts** on
that selector. It was the step card, the component whose index went missing on two pages the same day.

⚠ **The counts above are the FIRST run and are already stale**: after the media-query normalisation
fix and the day’s ports the tool reports **18 conflicts, 33 mockup-vs-mockup, 67 unpaired**. Re-run it
rather than quoting these. Also `.f-sec`
padding (38 against 44), `.f-herogrid` gap (26 against 30), `.f-prow` on three properties, and four
`.f-price` values against `test-selector-F`.

🟢 **The density hypothesis now has evidence, and it is Keith's to rule on.** The tighter values
cluster in exactly one place, `account-F`, `membership-F`, `results-F` and `results-states-F`, the
authenticated app: `.f-core` padding 24/22 against 26/22, `.f-sub` 15px/1.66 against 16px/1.68,
`.f-btn` 11px 18px against 14px 24px, `.f-btn` gap 8 against 9. **If deliberate it becomes a
documented variant like `.f-btn-sm`; if not they converge.** Nothing else can be reconciled until
that call is made.

⚠ **One correction to the handoff.** It recorded "`.sub` measure at 70 / 66 / 64 / 62ch". Those are
two components: `.f-fine` splits 70 / 66 / 64 / 62ch, and `.f-sub` splits 66 / 64 / 60ch. The
reconciler separates them because it keys on the selector rather than on a reading.

### What it cannot see, and what covers that

It compares **declarations**. Four of the six defects found on `/how-it-works` the same day were
**absences**: a class the markup never emitted, a glyph never rendered. A declaration diff sees none
of them. The complementary check is a **selector-count probe against the BUILT page** (does anything
actually use `.f-ticks li > span[aria-hidden]`?), which belongs in the screenshot harness, not here.
Two different questions: do the copies of the spec agree with each other, and does the built page
emit the markup the spec styles. Logged as observation 524.

**76 unpaired selectors** are listed separately and are informational, not drift: either a missing
entry in the script's `ALIASES` table or a component the app has not ported. Mockup presentation
chrome (`.f-flabel`, `.f-note`, the mockup's own JS hook) is filtered out. `.f-wash` and `.f-grain`
are deliberately NOT filtered: whether the app should carry the page texture is a real question.

---

## ✅ `/how-it-works` diffed against Frame S, and the drift was six things (2026-08-31)

The task the previous handoff put first. It was right to: the page carried the same class of error
as the first `/kits` pass, plus two the `/kits` lesson had not named.

**Method, as the handoff prescribed it.** Frame and rebuild rendered through the same harness and
viewed together, at 1440 and 390. Shots in the session scratchpad, not committed. Two findings were
settled by a DOM probe rather than by eye, which matters: both were **absences**, and an absence has
no pixels to notice.

### What the diff found

1. 🔴 **The step cards had no number at all.** The frame draws a small mono index (`01`) at rest and
   raises the large ghost numeral only on hover. The build put the padded `01` into the ghost
   numeral, which is `opacity: 0` at rest, and omitted the index span entirely. **`.f-step .f-no`
   existed in the stylesheet with zero elements using it.**
2. 🔴 **The accent tick glyph was missing from every list on the page, 19 of 19 items.** The rule
   `.f-ticks li > span[aria-hidden]` carries a comment reading "the check is a real glyph in the
   markup so it is the accent's only appearance inside the card". The markup emitted no glyph, so
   the receipts and the kit marker lists rendered as text with a 10px gap and nothing in it. **This
   is the same omission as the first `/kits` pass**, which dropped the same glyph.
3. 🔴 **The hero had no call to action.** The frame carries two, "Choose your test" solid and "Take
   the quiz" ghost. Neither was built. A marketing hero with no CTA.
4. 🔴 **Every stacked headline lost its second tone.** The frame greys the last line of each
   (`Know.`, `Done in a week.`, `An actual lab.`, `Not the end.`) against `--ink-3`. The build
   rendered all of them solid: zero `.f-grey` elements on the page.
5. 🔴 **Kit 3 had no flagship signal.** The frame flags it "Most complete" and tints the row with the
   accent. The build drew three cards of equal weight with three ghost CTAs, so nothing marks the
   £179 kit.
6. 🔴 **The trust row's gloss line inherited `text-transform: uppercase` and `0.1em` tracking** from
   `.f-trustrow > div`, against its own comment ("a mono label over a sans gloss"). It rendered as a
   second mono line, at 13.5px against the label's 11px, which inverts the hierarchy the pair exists
   to draw.

### What was fixed

All six, plus one the fix surfaced. Kit 3's marker list was a hand-composed array that folded five
markers into one comma line; once the tick was restored that read as a single item, so it now comes
from `panelCardLabels('hormone-recovery')` like the other two and renders nine ticks for the nine
markers the body copy claims.

🔴 **Two of these were on `/kits` as well, and one is now fixed there too.** `/kits` carried the same
missing step index (fixed, same change). It already had the tick glyph, which is how the reference
was found. **`/kits/testosterone`, the first page rebuilt, was faithful on both** and was the cheapest
correct reference in the repo. Nobody had grepped for it. Logged as observation 523.

Typecheck 0 errors. Verified by rendered screenshot at 1440 and 390, and by a DOM probe: 23 of 23
tick items now carry the glyph, no horizontal overflow at 390.

### 🔴 What is NOT fixed, because it is Keith's call and not drift

The build and the frame disagree structurally in four places, and in each the build followed the
**live page** while the frame drew something else. That is a defensible reading of "the mockups are a
specification" and it is not mine to settle:

- **The hero is one column.** The frame is two: copy on the left, a "What your kit contains" tray on
  the right at `1.35fr 1fr`. The build moved that tray into the lab section and left the right half
  of the hero empty.
- **The three kits are cards, not banded rows.** The frame draws them as `.bands` inside one tray.
- **"After your results" is a card grid, not banded rows**, so the mono trigger labels
  (`Low D or B12`, `< 12 nmol/L`) and the sunk treatment on the GP row are gone.
- **Dr Ewa sits on an inverted dark panel with a quote card.** The frame draws a plain tray with two
  chips. The quote itself is live copy, carried correctly.

⚠ **The frame is also incomplete against its own label.** Frame S says "nine sections" and lists a
dashboard section; the frame draws seven and no dashboard. The build carries the live dashboard, a
FAQ and a closing CTA that the frame neither draws nor lists. All three are live copy. Logged as
observation 527.

---

## ✅ The demo account exists as an interactive prototype (2026-08-29)

**File: `design/prototypes/demo-account-interactive.html`.** Open it in a browser; it needs no
server, no build and no data. Also published as an artifact for sharing:
<https://claude.ai/code/artifact/662f9912-8954-476e-9fa1-20e2ee5cbbe7>. **The two are the same
content and will drift if only one is changed**, which is recorded in the file's own header.

**Why it exists.** `07_sales/funnel/site-funnel-model.md` lists the demo account as half of the free
layer and records its state as **"Does not exist"**. Keith asked, across 2026-08-28/29, what the app
is actually marketed as with no demo built, and then what a demo would look like. This is the answer
drawn rather than described.

**What it covers.** Three states (**day 3** waiting for the lab, **day 14** first result and not a
member, **day 90** member with the retest landed) across four tabs (**results, plan, record,
account**), plus the marker detail for **all nine Kit 3 markers**, the month-one £47 ask, the daily
check-in loop, and the two-point record.

**What is load-bearing rather than decorative, so nobody "fixes" it later:**

- **The free androgen index carries no band and no verdict.** Hollow dashed marker, on purpose,
  per CA-034 K1. It is not an unfinished row.
- **The month-one ask gates the plan and the trend and never the numbers**, because a person has a
  right of access to his own health data under UK GDPR.
- **The marker and the symptom are drawn side by side and never joined.** Connecting them is a
  per-customer interpretation and is post-CQC whoever writes it.
- **Testosterone is drawn barely moving between the two tests**, because it does not move on
  anything we sell. That tension (the brand's lead marker is the one least able to demonstrate the
  app) is `01_strategy/2026-08-24-vertical-agnostic-monitoring-thesis.md` §10.3 and is shown rather
  than hidden.
- **A "show what everyone else shows" toggle** strips our band and the action cutoff, leaving the
  laboratory range alone. In the two-point view the trend line deliberately **survives** that
  toggle, because longitudinal tracking is not the differentiator: the 2026-07-20 teardown already
  ruled that Thriva owns it and Forth is credible.

**What is real:** every band is transcribed from `frontend/lib/results/classifier.ts` (`resolveState`)
and matches `04_products/results-engine/thresholds.md`; laboratory intervals are Vitall's own male
ranges confirmed 2026-08-06; waiting-state copy is lifted from `design/mockups/journey/results-states-F.html`
and the plan/ask/member screens from `design/mockups/membership-first-cycle.html`.

🔴 **What is NOT done, and it gates any reuse.** The result, the account and every interaction are
mocked. **The copy has had no `/compliance-preflight` and no clinical sign-off**; Keith waived it for
the mockup on 2026-08-28. Nothing here may be lifted onto a live surface without a pre-flight and
Ewa's sight. Two of the live GP states already render copy she has not approved, which is open
regardless of this file.

**This does not change the funnel model's state row.** The demo account still does not exist as a
product: there is no route, no auth, no sample-data fixture and no compliance read on sample-data
labelling. What exists is a prototype of what it would be.

---

## 🟢🟢 THE JOURNEY SPINE IS COMPLETE (2026-08-29)

`design/mockups/journey/lp-sample-F.html` closes it: Frame **AC** (the LP shell and a variance table
across the five landing pages) and Frame **AD** (`/how-to-sample`). Screenshot-verified at 1440 and a
true 390, both themes.

**Ten files, frames A through AD, 40 frames plus the 5 marker-card variants.** The two blog frames
came OFF the board rather than being drawn: Keith ruled on 2026-08-27 that the blog keeps
`blog-skin.css`. 🔄 **REVERSED 2026-08-29: `blog-F.html` was rebuilt and APPROVED, so the blog is
back on the board and adopts F.** Counting them as
outstanding was overstating what was left.

🔴 **THE GATE KEITH SET ON 2026-08-26 IS NOW SATISFIED.** His sequence was: *the mockup must
first carry the FULL JOURNEY, every screen the user sees mapped inside it, and only then does the app
get rebuilt against it.* It does. Legal, ops, admin and auth-edge inherit the system rather than
being drawn, per the 2026-08-27 scope decision. **Nothing here starts the build on its own**: that is
Keith's call and it is the next one.

### The last stage found the same error for the third time

🔴 **"One template" was wrong again, and this was the largest instance.** No `[product]` route
under `/lp`: five hand-written files at **246, 266, 412, 505 and 723 lines**, five different section
lists, two different section-comment styles. What IS shared is a real `app/lp/layout.tsx`, a stripped
nav and one compliance line.

**Four structural guesses in this inventory, four wrong, in both directions**: the kit pages, the
supplement product pages and the landing pages all claimed a template that does not exist; the auth
routes claimed five frames where one component serves four. There is no correction factor. Opening
the file is the only method that worked.

🔴 **`/lp/hormone-recovery` is the Kit 3 page again**: eleven sections, Kit 3's ten in the same
order plus a closing CTA, and its COMPARE section carries Kit 3's heading verbatim. **That is the
third comparison table of the same three products.** 723 lines duplicating an 882-line page.

⚠ **Nothing in the codebase links to any `/lp/` route.** Correct by design for ad-reached pages,
and `01_strategy/STATE.md` records that nothing has been promoted, so **2,152 lines across five pages
may never have been used.** Worth knowing before anyone budgets a rebuild of them.

### `/how-to-sample` is the only genuinely new page in the set, and even it was transcribed

The sanctioned replacement for the deprecated `/activate`: no login, no per-order code, one generic
page behind a QR printed identically on every insert. **Its five steps already existed** as the
`INSTRUCTIONS` array in `app/activate/page.tsx`, the part that survives the deprecation. ⚠ **The
video does not exist and is drawn as an absent slot**, not a placeholder with a play button: a mockup
showing a video frame asserts there is a video, and the next reader scopes the build assuming one.

### What is left, and none of it is drawing

- **Copy defects**: ✅ the panel understated by FAI and Albumin is **FIXED 2026-08-29** across all
  six surfaces it was on, and single-sourced to `frontend/lib/kits/panel.ts`. Still live: the "three
  questions, under a minute" selector description on `/kits`, in two places; and the superseded FAI
  framing on `/kits/testosterone`, `/kits/hormone-recovery` and `/lp/hormone-recovery`, found while
  fixing the first.
- **Behaviour questions**: the signup age field with no `required`; the blank signed-out page on
  `/supplement-waitlist-status`.
- **Naming questions**: `/faq` is not an FAQ; `/auth/consent` is not the health consent.
- **One design choice not carried back**: the meta row pinned to the card bottom in `kits-F`, which
  belongs on the selector strip too if it is right.
- **One brand-guidelines clarification proposed**: separating ambient motion from reader-caused
  response in 8.3.
- **Six duplicated facts** now confirmed across the set: three comparison tables, A1 (CA-026) on two
  pages, the process card in four hand-written copies, the shared FAQ questions, the marketing
  opt-in sentence twice, and Dr Ewa six times. 🔴 **The counter-example is on the LP layout**: the
  compliance footer line lives in one file and serves five routes, and it is the one thing in the
  whole set that cannot drift.

---

## 🟢 THE ACT STAGE IS DRAWN, and the strategy has already moved under it (2026-08-29)

`design/mockups/journey/act-F.html`. Frames **Z** (`/supplements`), **Z2** (the two product pages as
one skeleton), **Z3** (the shared waitlist form's five states), **AA** (`/supplement-waitlist`) and
**AB** (`/supplement-waitlist-status`). Screenshot-verified at 1440 and a true 390, both themes.

### 🔴 THE LIFECYCLE CHECK EARNED ITS KEEP AGAIN, AND THIS TIME ONLY THE DOCS HALF WORKED

Every route is alive, carries no retirement comment and renders fine. The code says nothing is wrong.
`docs/2026-08-23-supplement-shop-front-spec.md` opens with **"SUPERSEDED IN DIRECTION, 2026-08-24"**:
supplements moved to a **secondary shop at member price**, with the app as the product and the kit as
the gateway. **Adopted 2026-08-25.** `01_strategy/STATE.md` adds that member pricing is for
supplements and **"stays dark until supplements are listed in the shop"**, with the shop at
`/supplements`, organised by panel, identical for every visitor.

So these four routes are **pre-decision**: waitlist pages for a range with no launch date, built when
supplements were going to lead the funnel.

**Drawn anyway, and the reasoning is worth keeping.** A customer reaches all four today and the copy
is still true: nothing has launched, the waitlist is real, no payment is taken. The redraw is scored
against what is live. ⚠ **This is the stage most likely to be thrown away**, and the replacement
is not drawable: a shop organised by panel does not exist, is not specced, and the document that
would have specced it is the superseded one. **Guessing at it would be inventing a design for an
undecided product**, which is the same failure as inventing copy.

### The product pages are a third category, between the two errors this inventory has made

**No `[product]` route**: two hand-written files, so "one template, 2 routes" was wrong the same way
it was wrong about the kits. But unlike the kit pages they **do** share a skeleton, nine sections in
the same order. And unlike a template, **250 of their 263 lines differ**, and the formulation data is
not the same shape in both (`{name, dose, why}` against `{name, num, dose, claim, why}`), so no
shared component could render them without changing one. **They are the same page written twice.**
Both files being exactly 263 lines is a coincidence.

Drawn as a skeleton rather than as two full pages on purpose: drawing both in full asserts the
rebuild should keep them separate, drawing one and calling it the template asserts the opposite.

### Two behaviour questions, both Keith's

1. 🔴 **A signed-out visitor to `/supplement-waitlist-status` gets a blank page.**
   `if (!user) return null`: no redirect, no prompt, no empty state. `/order/confirmed` redirects
   into a sign-in round trip in exactly this situation, so the app has a pattern and this route does
   not use it.
2. **Is this stage worth rebuilding before the shop decision lands?** It is the one part of the spine
   where the answer might be no.

⚠ **Four EFSA claims sit on `/supplements` attached to products that have not shipped.** Quoted
character for character. They are the highest-risk copy in the stage precisely because the range is
unlaunched: there is no product to check the wording against, so the only thing keeping it right is
that nobody edits it. **Dr Ewa now appears five times across the journey**, adding both product
pages to `/about`, `/how-it-works` and the Kit 3 founders block.

---

## 🟢 THE AUTH FRAMES ARE DRAWN, and the inventory was wrong twice (2026-08-29)

`design/mockups/journey/auth-F.html`. Frames **X** (the card, login mode), **X2** (the four modes as
a row), **X3** (the message and error banners) and **Y** (`/auth/consent`). Lifecycle check first:
all five routes alive, no retirement comment, no docs entry, no flag read. Screenshot-verified at
1440 and a true 390, both themes.

### 🔴 FIVE ROUTES, FOUR FRAMES, AND IT IS THE KIT-PAGE ERROR IN REVERSE

Four of the five auth routes are the **same component in four modes**: `AuthCard.tsx`, 177 lines,
`mode = login | signup | reset | link`, wrapped by four **25-line** routes that pass in a title, a
standfirst and a server action. They differ in five things and no more.

On the kit pages the inventory said "one template, three kits" and there was **no template**: three
hand-written pages of 530, 882 and 463 lines. Here it said **five frames** and there is **one
component**. Both readings were built from route names rather than from files, and **they were wrong
in opposite directions**. That is the part worth keeping: there is no calibration to apply, no rule
of thumb about whether a stage is usually over- or under-counted. The only fix is opening the file.

### 🔴 `/auth/consent` CARRIES NO HEALTH-DATA CONSENT

The inventory line read: *"Consent is the one with compliance weight (health-data processing, CA-018)
and its wording is approved copy that the redesign must not disturb."* **Both halves are wrong.** The
route asks an **age** for 18+ eligibility and offers a **marketing opt-in**. No Article 9(2)(a)
wording, no CA-018 sentence, nothing version-locked. The health-data consent is on
`/checkout/details`, gating payment, as the Buy stage found.

**The catch happened because the line had been marked UNVERIFIED rather than corrected to a new
guess.** When the Buy stage moved CA-018, the honest option was to write "whether `/auth/consent`
carries consent copy of its own is unverified and must be read before that frame is drawn". It was
read. **A note that admits it does not know is worth more than a note that is confidently wrong**,
because the second one gets quoted.

⚠ **The route name is the second mismatch in this set**, after `/faq`. Both names describe what a
reader would assume rather than what the page holds, and both were taken at face value by an
inventory built from route names.

### Two questions handed back, neither of them design

1. 🔴 **18+ is collected three times and enforced twice.** `/checkout/details` takes a date of
   birth with a `max` attribute AND an `isAtLeast18()` re-check. `/auth/consent` takes an `age` with
   `min={18}` and **required**. `/auth/signup` takes an `age` with `min={18}` and **no `required`
   attribute at all**. The same eligibility fact is mandatory in two places and optional in the
   third. Drawn exactly as it ships.
2. **Should `/auth/consent` be renamed**, now that it is confirmed to be an age gate plus a marketing
   opt-in rather than the health consent? Cheap now, awkward after the tokens are written.

⚠ **The marketing opt-in sentence exists twice**, word for word, on `/auth/signup` and
`/auth/consent`. Fifth member of the duplicated-fact pattern. **OAuth is Google only** and that is
deliberate: the source records Microsoft as withheld until the Azure app registration handles
personal accounts, so the mockup draws one button rather than inventing the second.

---

## 🟢 THE BUY STAGE IS DRAWN, and it moved CA-018 (2026-08-29)

`design/mockups/journey/buy-F.html`. Frames **V** (`/checkout/details`), **V2** (its six error
strings plus submitting), **W** (`/order/confirmed`) and **W2** (its three renderable states).
Lifecycle check first: both alive, no retirement comment, no docs entry. ⚠ Both are
`robots: index:false`, the only two frames in the set deliberately invisible to search.
Screenshot-verified at 1440 and a true 390, both themes.

### 🔴 THE CA-018 CONSENT IS CAPTURED AT CHECKOUT, NOT ONLY AT /auth/consent

`design/journey-inventory.md` recorded the health-data consent against `/auth/consent` and called
that route the one with compliance weight. The Article 9(2)(a) consent is taken **on the checkout
form, at the point of purchase**, and the source comment says why: "so it is freely given as part of
deciding to buy". It is **required to proceed to payment** and version-locked to
`HEALTH_PROCESSING_CONSENT_VERSION` = `2026-06-23-v1` (`lib/auth/consentVersions.ts:18`), with the
comment adding *"any wording change needs a new version string + a fresh CA record."*

**That puts the sentence outside what a redesign may touch**: not reworded, not shortened to fit a
card, not split for rhythm. It is reproduced character for character in Frame V. The inventory is
corrected, and the Account-stage line now says the `/auth/consent` copy is **unverified** rather than
assumed, so it gets read before that frame is drawn instead of inherited from a stale note.

### The thin-route trap caught this stage too

`/checkout/details` is **80 lines** and looks like the smallest page in the journey. Everything that
matters is in `CheckoutDetailsForm`, another **177 lines**: three fields, **six distinct error
strings**, a submitting state, and the consent gate. That is the same shape as `/test-selector`,
whose route was thin and whose quiz carried five steps nobody had written down. 🔴 **The rule:
a route's line count measures its wrapper, not its surface.** Buy goes from 2 frames to 4.

### Two smaller things worth keeping

- **The order reference is drawn in two states because the fallback is the common one.** Resolving a
  reference requires being signed in, so a first-time buyer gets the "it is on your email" version.
  Until 2026-08-04 the page rendered nothing from `session_id` at all, so a customer who closed the
  email had no way to find it.
- **A redirect is not a frame and an inventory that counts screens will miss it.** A signed-out
  arrival with a `session_id` goes to `/auth/post-checkout` and renders nothing. Its loop guard
  (`post_checkout=1`) exists because a failed sign-in used to bounce a customer between two routes
  forever. Written down here because there is nothing to draw.

⚠ **The step card now exists in four hand-written copies and three different step counts**: four
on `/how-it-works` and the kit pages, four on the selector, three on the receipt. Same component,
drifting in content rather than shape. Fourth member of the duplicated-fact pattern this journey set
keeps finding.

---

## 🟢 THE LEARN STAGE IS DRAWN, and enumerating it found a live copy defect (2026-08-29)

`design/mockups/journey/learn-F.html`. Frames **S** (`/how-it-works`, 9 sections), **T** (`/about`,
6) and **U** (`/faq`, 9). Lifecycle check first: all three alive, no retirement comment, no docs
entry, **no feature-flag read anywhere**. Screenshot-verified at 1440 and a true 390, both themes.

⚠ **All three are footer-only, with one exception.** Nothing in `app/` or `components/` links to
`/about` or `/faq` except `Footer.tsx`; `/how-it-works` has two body links, from the homepage and
`/kits`. Worth knowing before the rebuild budgets this stage: these are pages a reader reaches on
purpose, not in flow.

### ✅ FIXED 2026-08-29 — THE PANEL WAS UNDERSTATED, AND ON SIX SURFACES RATHER THAN TWO

_The three paragraphs that follow are the finding **as it was written on 2026-08-29 before the fix**,
kept verbatim as the record. Every present-tense claim in them is now false on the live pages. The
✅ block below is the current state._

`/how-it-works` lists Kit 1 as **three** markers under the heading "Markers tested" (Total T, SHBG,
Free Testosterone (Calc)) where `/kits`, the Kit 1 page, both comparison tables and the hero panel
all say **five**. Kit 3's block on the same page names seven markers in a list while its own body
text says "Nine markers". `/faq`'s "every marker we test" table lists **seven** rows and its closing
sentence commits to the number: "We test the seven that actually answer the question."

**FAI and Albumin are missing from both pages.** The same two, in both places, which is the tell:
these pages predate those markers joining the panel and were never swept.

🔴 **On `/faq` the contradiction is internal, and one half of it is approved copy.** The C2
(CA-026) block on that same route says the price buys "the markers that matter for men, **including
free testosterone via FAI**". So an approved sentence names a marker the page's own unapproved table
omits. **That makes it the one to fix first.** It is a copy fix and it is Keith's, not the mockup's:
both pages are drawn exactly as they ship, because a redraw that quietly corrected them would hide
the defect instead of surfacing it.

🔴 **ESCALATED 2026-08-29, and the sentence is worse than "names a marker the table omits".** The FAI
sweep found that *"free testosterone via FAI"* makes FAI the delivery mechanism for free testosterone,
which is precisely the stand-in framing `thresholds.md` item 8 refuses in men, and it also misdescribes
the product: Free Testosterone is calculated from Total T, SHBG and Albumin, while FAI is a separate
report-only marker. **It was left unedited** because it is CA-026-approved copy (invariant 2 of
`/decision-sweep`: approved copy is never silently edited). It is live in three places that must move
together: `frontend/app/(marketing)/faq/page.tsx:31` (FAQPage schema) and `:467` (rendered), and the
source it was written from, `02_brand/2026-07-22-conflict-free-wording-pack.md:62` (§C2), plus the
mockup `design/mockups/journey/learn-F.html:915`. Correcting only the page leaves the writer intact.

**Drafted replacement, claim-reducing and adding nothing:** replace "including free testosterone via
FAI" with **"including calculated free testosterone"**. Everything else in C2 is unchanged.
**Owners: Keith (business, it is his approved pack) and Ewa (clinical, the framing is hers to
confirm).** Precedent for amending in place rather than pulling it down: ruling B of 2026-07-29,
*"Leave it up while you make the changes"*, given on the same FAI contradiction in the article.

✅ **FIXED 2026-08-29, and the finding above understated its own blast radius.** Grepping the fact
rather than inheriting the two pages named here found **six** surfaces carrying it, not two:

| Surface | What it said | What it says now |
|---|---|---|
| `/how-it-works` Kit 1 card | Total T, SHBG, Free T (three) | the canonical five |
| `/how-it-works` Kit 3 card | "Total Testosterone, SHBG, Free T" plus four, under body copy reading "Nine markers" | the five compressed on one row, plus four, so the list and the sentence agree |
| `/faq` marker table | seven rows, closing on "the seven" | nine rows, closing on a count computed from the table |
| `/faq` "Also tested with testosterone" | SHBG and Free T (two of four) | SHBG, FAI, Albumin, Free T |
| `components/marketing/TestSelectorQuiz.tsx` | "Kit 1 tests Total T, SHBG, and Free Testosterone" | all five, from the panel |
| `app/(app)/results-dashboard` pre-results card | **"the two markers"** | "the five markers", from the panel |

🔴 **The dashboard one was the worst and was nowhere in this file**, because it is an
authenticated route and the finding came out of a marketing-page traversal. The lesson is the general
one and it is logged as skill observation 490: **a written finding records where someone was looking,
not where the defect lives.** Re-derive the site list by grepping the fact before scoping a copy fix.

**The remedy is the one item 5 of the handoff argues for, applied to the first duplicated fact.**
`frontend/lib/kits/panel.ts` is now the single source: which markers each kit measures, plus the
`name` / `gloss` / `short` / `measures` / `why` copy for each, with helpers for the card list, the
compact `Total T · SHBG · ...` line, the prose sentence and the "Kit 1 & Kit 3" column. All
six surfaces render from it, and `/` and `/kits` (which were already correct) were collapsed onto it
too, so being correct today no longer depends on nobody editing them. **`/kits/testosterone` was
deliberately left hand-written**: its marker block carries the superseded FAI framing described below,
and collapsing it onto the module in the same change would have quietly rewritten a commerce claim
that is Keith's call.
`scripts/test-quiz-routing.ts` now asserts the Kit 1 marker sentence, mirroring the Kit 2 guard that
already existed. Verified: `tsc` 0, `next build` 0, quiz regressions 22/22, `compliance-preflight` on
the extracted customer-facing copy **0 HARD / 0 REVIEW**, no em dashes, and a real screenshot of
every changed block at 1440 in light theme, plus a **true 390** (puppeteer, not `--window-size`) for
the two Learn pages, which are the ones whose lists got longer. ⚠ **Working tree only, not pushed, not
deployed.**

### 🔴 TWO THINGS THE FIX SURFACED AND DID NOT CLOSE

**1. Owed to Keith: three pages still carry the FAI framing the 2026-07-30 ruling corrected.**
Writing the new FAI copy needed a description, and the cheap move was to lift the one already shipping
on `/kits/testosterone:388`: *"A more sensitive indicator of testosterone availability than Total T
alone, especially when SHBG is elevated."* That is the framing
`04_products/kits/kit-1-testosterone-health-check.md:72` records as **corrected on 2026-08-12**, under
Ewa's ruling that FAI is report-only and not banded in men because it tracks calculated free
testosterone poorly. **Ruling C of
`03_compliance/correspondence/2026-07-30-keith-ewa-fai-rulings-a-to-d.md` authorised the SPEC reword
and the marketing pages were never swept**, so the live page is the stale half. The same framing is on
`/kits/hormone-recovery:338` and `/lp/hormone-recovery:126`. The new copy was written to the ruling
instead, which means `/faq` and the results engine now agree and those three pages disagree with both.
**This is a `/decision-sweep` of an approved decision, not a new clinical question**, and on the
CA-001/CA-003 precedent a claim reduction needs no fresh sign-off. Deliberately left for Keith rather
than swept silently, because it changes three commerce pages including a paid-ad LP. Logged as skill
observation 491.

**2. Owed to Ewa, lightly: the new rows put clinically-ruled wording on a marketing surface.**
The FAI and Albumin copy is a compression of the live results-engine strings (`fai-reported`,
`FAI_EVIDENCE`, `normal-albumin`) that she approved on 2026-08-07, and it makes no claim those do not.
But her approval of the FAI wording was *"wording is fine for now"*, recorded in `thresholds.md` as
**provisional rather than closed**, and it was given for a post-purchase report, not a public page.
Worth one line in the next packet to confirm it carries across. Not a blocker: the substance is hers,
the direction is claim reduction, and the alternative was leaving the panel understated.

### Three duplicated facts, confirmed rather than predicted

The kit frames flagged two comparison tables and a shared FAQ set as *likely* to drift. This stage
turns that into a pattern with four members: **A1 (CA-026) is rendered verbatim on both `/about` and
`/how-it-works`**, hand-written twice; **Dr Lindo is presented three times** across the journey
(`/about`, `/how-it-works`, the Kit 3 founders block), three separate descriptions of one person and
one role; the **four-step process card** now exists in four hand-written copies; and the marker sets
above have actually diverged. **A signed claim held in two places is the worst of them**, because
correcting an approved sentence has to reach every copy or the site is quoting two versions of one
signed statement.

⚠ **On `/how-it-works` the receipts list sits directly under A1 and is NOT part of it.** Five
bullets of unapproved supporting copy immediately beneath approved copy, which is exactly the
adjacency that makes a later reader treat the whole block as signed.

### Band tables publish clinical thresholds outside the engine, and vitamin D checks out

`/faq` carries three band tables. Checked this session for vitamin D: `classifier.ts:303-304` returns
`critically-low-vitamin-d` below 25 and `low-vitamin-d` below 50, which is exactly where the page
puts "deficient" and "insufficient". **The 75 and 125 splits above them have no engine equivalent**:
everything over 50 is one state in code and two bands on the page. Fine as editorial framing, and it
is the part that can drift silently. The engine's `high-vitamin-d` state (> 250) is deliberately
absent from the page and must stay absent, since its copy is CA-044 and Ewa has not approved it.

### 🔴 `/faq` IS NOT AN FAQ

Not one question-and-answer pair. It is the longest and most claim-dense page in the stage, served at
`/faq` and labelled "FAQ" in the footer, while its own schema object is called `factsSchema`. A
reader following that footer link expecting questions gets an essay, and the real FAQs are on the
three kit pages. **Whether it keeps the name, moves to something like `/the-facts`, or gains an
actual FAQ, is Keith's call.** Drawing it correctly did not require the decision; drawing it as an
FAQ would have committed the wrong one.

---

## 🟢 THE CHOOSE STAGE IS CLOSED: `/kits` and the three kit pages are drawn (2026-08-28)

`design/mockups/journey/kits-F.html`. Frames **O** (`/kits`, six sections), **P**
(`/kits/testosterone`, eleven), **Q** (`/kits/energy-recovery`, eight), **R**
(`/kits/hormone-recovery`, ten) and **P2**, which was not on the list. Screenshot-verified at 1440
and a true 390 in both themes; the live pages were shot first and sat beside the redraw.

**Lifecycle check ran first and the route is alive.** No retirement comment, no docs entry, and the
densest inbound linking on the site: footer, homepage, `/how-it-works`, `/about`, `/supplements`,
`/waitlist`, `/order/confirmed`, two landing pages, the selector's three recommendations,
`lib/content/kitCTA.ts` and `sitemap.ts`. The check has now run four times and caught two dead
routes; this is the second time it has cleared one.

### 🔴 `BUNDLES_ENABLED` IS A SECOND VERSION OF ALL THREE KIT PAGES, AND NOBODY HAD IT

Every kit page reads `isBundlesEnabled()` once and branches on it **twice**: the hero and the close.
Flag on, the hero leads with a bundle price and the close becomes a `BundleChoice`. It is not a
swapped button. **The related-reading block and the competing-kit cross-sell are both removed**, by
direction (Keith, 2026-07-24: the page ends on the buying decision, nothing pulls focus off it). So
the three kit pages carry **six page endings, not three**. `deployment/env/vars.md` records the flag
OFF, so the flag-off state is drawn as the page and the flag-on state is Frame P2, drawn once because
the shape is identical on all three. ⚠️ vars.md is a record, not a reading of production, and
there is an open Sprint ticket for exactly that drift on a different flag.

🔴 **The rule this earns, and it is the fifth: a route's states are not only its JSX
branches.** The `/test-selector` correction came from reading the component's steps, and that same
method would still have missed this one, because the branch is not shaped like a branch: it is a
`const` read from an environment variable at the top of the file, and the two ternaries that consume
it sit 300 lines apart. **Grep the route for flag reads before calling its states enumerated.**

### Three decisions this frame surfaced and did NOT make

1. 🔴 **Status colour is live on all three kit pages today, on a marketing host.** The
   sample-report panels render their bars with `bg-statusWarning` and `bg-statusOptimal`: nine bars
   on Kit 3, five on Kit 1, four on Kit 2. `app-theme.css` sanctions status colour in the
   authenticated dashboard and nowhere else. The redraw does **not** carry it across: bars are
   `--flag` with a dark leading edge and the status word carries the state in type. That is a
   deliberate difference from the live page, because the alternative is laundering a rule break into
   the new design system. If the answer is that marketing may use status colour, that is a
   brand-guidelines change, not a frame change.
2. ✅ **SETTLED 2026-08-29 (Keith): the open two-column grid, on all three kit pages.** The
   divergence was smaller than it looked. Kit 1 was the ONLY page using the collapsible
   `FaqAccordion`; Kit 2 and Kit 3 already rendered open grids in their own hand-written markup. So
   this is the majority pattern winning and one page joining it. The accordion is deleted from the
   mockup rather than left unused. ⚠ **Four of the six questions are the same on all three pages
   with only the price swapped** (does it hurt, how long, does the price cover everything, is my
   data private), maintained as three hand-written copies: the FAQ version of the two comparison
   tables, and the rebuild should read those four from one source.
3. **There are two comparison tables of the same three products**, on `/kits` (nine marker rows with
   ticks) and on Kit 3 (five spec rows in words). They agree today, they are maintained separately,
   and they share four facts. The first correction to either is what would make the divergence
   visible.

### Two defects the screenshots caught, both fixed in the file

- **The step numeral was crossed by the body copy** on three of four cards at 1440, because a
  four-up card is about 290px and a 34ch measure leaves no clear corner. **Keith had already given
  this exact note once**, on the test-selector step cards. The fix is structural rather than a
  nudge: the digit sits on the card's bottom edge and the card reserves padding for it, so it holds
  at every width instead of at the one that was checked.
- 🔴 **The approved money block was unreadable in dark.** `.invert` sets
  `color:var(--paper)` for white-on-black; the dark override restyled the panel and the two child
  colours but never the inherited one, so the CA-026 heading rendered near-black on dark grey. It is
  the most load-bearing copy on the page and it was invisible in one of the two themes. Caught by
  looking at the render, not at the source.

### The step cards now run the selector's methodology pattern (Keith, 2026-08-29)

Keith: adopt the same principles here as on the selector's methodology strip. That strip is not a
first draft, it is the result of four separate corrections, so the adoption took the reasoning rather
than the look: **small index at rest and the outlined numeral only on the on state** (one number, two
sizes, and it retires the dead-space problem entirely rather than solving it), **an outline instead of
a fill** so what crosses the body copy is a 1px line rather than a solid field, **opacity capped per
theme at the measured 4.5:1 point** (light .75, dark .30, touch resting .34 and .22), **hover on a
pointer and scroll position on touch** because half this audience is on a phone, **a hairline meta
row**, and **no inverted fourth card**. All three process strips in the file carry it.

⚠ **The meta values were written from these pages, not copied from the selector.** Its third card
reads "Transit / Tracked 24"; the kit pages promise a prepaid return envelope and claim nothing about
tracking on the return leg, so this row reads "Postage / Prepaid". A meta row is the easiest place in
a card to state something the page does not promise: it is short, it looks like a fact, and nobody
reads it as copy.

🔴 **THE ADOPTION FOUND A DEFECT IN THE APPROVED SOURCE, AND IT IS FIXED THERE TOO.** The
numeral sets a negative letter-spacing, which removes the trailing advance after the glyph, so
anchoring the element by its right edge anchors a box narrower than the ink inside it. About 6px of
overhang at 7.8rem: invisible on 1, 2 and 3, and it **cut the right stem clean off the 4** under
`overflow:hidden`. That is fault one from the strip's own history ("situated so you can actually see
the number") surviving on one glyph in four, in a state you have to hover to see, which is why it
cleared review. Verified by forcing the on state in a scratch copy of each file and looking at it.
**`test-selector-F.html` has the one-line fix and nothing else**: it is an approved file, the clip is
a defect rather than a design change, and the other change made here (pinning the meta row to the
card bottom so the row reads across rather than down) is a design choice and was deliberately NOT
carried back without Keith.

**Not verified: the touch resting numeral.** Headless Chrome reports hover capability, so the
`(hover:none)` branch does not render in a screenshot. The layout at 390 is verified; that one state
is reasoned, not seen.

### 🔴 A QUESTION THAT DOES NOT EXIST WAS DRAWN INTO THE KIT 2 FAQ, and it is removed

The first draft of Frame Q showed four FAQ cards, described in its own note as "four representative
questions rather than the full live list". Kit 2 has **six**, and one of the four drawn was not among
them: *"Will this tell me why I'm tired?"* was written to fill the grid rather than transcribed from
`energy-recovery/page.tsx`. All three frames now carry their full live sets, six each, and Kit 3's
FAQ section was added at the same time because the first draft had drawn nine of its ten sections.

**Why this is worse than an omission, and worth a rule.** A mockup is the artefact the rebuild reads,
so copy inside it is taken as a record of what the page already says. Invented copy in that position
is a proposal for **new customer-facing copy wearing the clothes of existing copy**, and there is no
step downstream that would catch it as new: it does not appear in a copy diff, it has no CA number
because nobody thinks to ask for one, and the compliance route is never triggered because nobody
believes anything was written. On these pages that matters more than usual, since the surrounding
sentences are CA-026 verbatim blocks and a CA-038 self-flagged line. **Reproducing copy into a design
artefact is transcription, not writing: transcribe it completely, or draw the container with the
omission marked, and never write a plausible substitute to make a layout read.**

### Made less static, within the budget rather than around it (Keith, 2026-08-29)

Keith asked whether the page could be less static. Two existing rules answer most of it and they pull
against each other: **the motion budget is one pulsing element plus one load reveal per screen**
(brand-guidelines 8.3), and **motion decorates aliveness, change over time IS aliveness** (the rule
the waiting screen earned). So the answer was not more motion. Three additions, all of them things a
reader CAUSES, plus one reveal that carries information:

1. **The kit cards answer back**, same on-state as the step cards, so the page has one interaction
   idiom rather than two. On a page whose entire job is choosing between three things, three
   unresponsive slabs give the reader no signal about which one he is reading.
2. **The comparison table tracks the row under the pointer.** Nine marker rows by three columns, and
   the question is always "does THIS kit do THIS marker", which means crossing a long row with the
   eye. Contrast sensitivity falls with age faster than colour discrimination does. This is the
   clearest case on the page of an interaction doing a legibility job rather than a decorative one.
3. **The sample-report bars grow when the panel first arrives**, staggered. This is the page's one
   load reveal and it is spent on the one element whose whole meaning is a position on a track.
   Under `prefers-reduced-motion` the bars are simply at their widths, because the information was
   never in the movement.

**Nothing loops. The ambient pulse budget is left unspent on every frame in the file.**

🔵 **PROPOSED, one line to brand-guidelines 8.3, and it needs Keith.** The rule caps motion
per screen but does not distinguish **ambient** motion from **reader-caused** response. The two are
not the same spend: an ambient loop runs whether anyone is there or not and competes for attention
that was going somewhere else, while a hover or scroll response is an affordance that is still doing
its job when motion is switched off. Reading 8.3 as covering both would ban row highlighting on a
table, which is a legibility device this audience specifically benefits from. The clarification would
be that **the budget governs ambient motion, and reader-caused state changes are unlimited but must
survive `prefers-reduced-motion` as a non-motion change** (a colour, a border, a shadow).

🔴 **The highest-value anti-static device on Frame O is NOT drawn, because it needs a fact we
do not have.** A real deadline ("order in the next 2h 40m and it ships today") changes on its own, is
true, needs no animation, and is exactly the shape the waiting-screen rule says works. The live pages
say "dispatched the same working day" and **state no cutoff anywhere**, so drawing a countdown would
mean inventing the operational promise behind it, which a rebuild would then read as existing. If
there is a real dispatch cutoff, this is the best thing that could be added to `/kits` and it costs
no motion budget at all.

### Copy drift found on the live page, carried as found and flagged

`/kits` describes the selector as "answer 3 questions" and, lower down, "takes less than a minute",
in two separate places. The quiz is five steps: three questions, a four-question price study with an
age band, then the reveal and an email capture. Both lines were true when written. Rewriting live
marketing copy is not a mockup's job, so both are drawn unchanged with a note; **the point of the
note is that a faithful redraw is exactly how a stale sentence gets frozen into a new design
system.**

---

## 🟢 APPROVED: every frame drawn so far on the journey mockup (Keith, 2026-08-28)

**Keith's words: "everything up until this point on this mock-up journey I'm happy with and is
approved."** That signs off the six files below as the design record the rebuild gets scored against,
and it closes the question of whether the drawn frames are right. It is a **design** approval given by
the business signer, on artefacts that are screenshot-verified at 1440 and a true 390 in both themes.
It is not a compliance sign-off and it does not start the build.

| Approved | File | Frames |
|---|---|---|
| Homepage, direction F | `design/mockups/directions/F-field.html` | the chosen language, hero film final |
| Results, present | `design/mockups/journey/results-F.html` | results with the GP referral in panel |
| Results, the other states | `design/mockups/journey/results-states-F.html` | `pre-results`, `no-results`, `sample-failed`, handoff |
| Membership | `design/mockups/journey/membership-F.html` | H, H2, I, I2, J |
| Account and subscriptions | `design/mockups/journey/account-F.html` | K, K2, L, L2, M |
| Test selector | `design/mockups/journey/test-selector-F.html` | N, N2, N3, N4 |

### ✅ EXTENDED 2026-08-29: `kits-F` and `learn-F` are approved on the same terms

Keith, on being shown the Learn frames: "ok approved lets move on". That added
`design/mockups/journey/kits-F.html` (frames O, P, P2, Q, R) and
`design/mockups/journey/learn-F.html` (frames S, T, U). **Extended again the same day on the Buy
frames**, same words, adding `design/mockups/journey/buy-F.html` (frames V, V2, W, W2), **again
on the auth frames**, adding `design/mockups/journey/auth-F.html` (frames X, X2, X3, Y), and **again
on the Act frames**, adding `design/mockups/journey/act-F.html` (frames Z, Z2, Z3, AA, AB). The list
below now stands at **eleven files and 38 frames**. 🔴 **The Act approval is a design approval on
pre-decision pages**: the supplement strategy moved on 2026-08-24 and that stage may be redrawn.

**The four boundaries in this entry are unchanged and are not restated here on purpose.** In
particular: it still does not release the build, it still does not touch CA-045, and it still
approves layouts rather than the copy inside them. That last one matters more on this pair than on
the first six, because **three live copy defects were surfaced while drawing them and none is fixed
by this approval**: the panel understated by FAI and Albumin on both Learn pages, the `/faq` table
contradicting the CA-026 block on its own page, and the "three questions, under a minute" selector
description on `/kits`. (The first two were **fixed 2026-08-29**, along with four more surfaces
carrying the same defect that this list did not know about; the selector description is still live.) Approving the frames that display those sentences is not approving the
sentences, and each is still owed as a copy fix.

**`blog-F.html` was NOT on that list and that approval did not revive it** (it was APPROVED
separately on 2026-08-29, after a rebuild). Keith put it down on 2026-08-27
when he ruled the blog keeps `blog-skin.css`, and a later blanket approval does not overturn an
earlier specific decision. It stays the record of a frame F lost. If it comes back in, that is a new
decision, not an inference from this one.

### What this approval does NOT do, and each of the four has a way of being assumed

1. 🔴 **It does not release the build.** Keith's own sequence (2026-08-26) is that the mockup carries
   the FULL journey before anything is rebuilt, and roughly half the spine is still undrawn:
   `/kits` plus three kit pages, Learn, Buy, the five auth frames, Act, the LP template and
   `/how-to-sample`. `design/journey-inventory.md` is the list. **Nothing is to be built yet**, and
   the membership rebuild that started all of this stays where it is.
2. 🔴 **It is not a CA, and it leaves CA-045 exactly where it was.** The imagery gate arms when a
   direction reaches a **live page**; a mockup is not published, so CA-045 stays OPEN on Approvals &
   Sign-offs (`869eqz4bd`) with its one judgement question still owed: does an illegible letter on a
   kitchen table read as a per-customer result? Business sign-off on a design is not clinical
   sign-off on the imagery inside it, and the two are easy to fuse in a later summary. That fusing is
   exactly what created CA-045 in the first place.
3. 🔴 **It approves layouts, not the copy sitting in them.** Copy that arrived approved keeps being
   governed by its own sign-off and nothing here re-opens it: the quiz scoring map and the split Q1
   wording (CA-033, CA-025), the handoff summary (CA-023), `/auth/consent` (CA-018) when it is drawn.
   Approving a frame that carries a sentence does not approve the sentence, and cannot approve one
   Ewa has never seen.
4. ⚠️ **CA-044 held, and it has to keep holding.** Checked before recording this: `results-F.html:140`
   names `high-testosterone` and `high-vitamin-d` as deliberately not drawn, and the Van Westendorp
   step carries no price of ours (`test-selector-F.html` frame N3), with the reveal held to N4. The
   property being approved is that the frames launder nothing into looking finished, not just that
   they look right.

**Why this is not on the approvals board.** Every decision in this redesign so far (D, then F, then
app-wide, then the blog keeping its skin) was recorded here rather than as a CA number, because a
mockup is an internal artefact and the CA register is for external-facing copy. The Keith-only board
is not the route either: its entry test fails at question 1, since these frames carry biomarker copy.
The one gate this work does carry a number for is CA-045, and it is open, on the main board, and
untouched by today.

---

## 🟢 THE RANGE BARS CARRY COLOUR AGAIN, and the grey version failed for a structural reason (2026-08-27)

**Keith on the all-grey first draft:** *"the gray does not actually have any impact at all, and as
that is the most, it makes it difficult to read."* Right, and **the cause was structural rather than
tonal**: two ranges drawn as two overlapping grey fills compete for the same pixels and neither wins.
No amount of adjusting the greys would have fixed it, which is why the fix is two changes and not
one.

1. ✅ **Zones now carry OUR verdict as low-chroma tints across the whole track, and the laboratory
   range is drawn UNDERNEATH as a bracket.** A fill and a bracket do not compete, so both facts
   survive on the same bar.
2. ✅ **The hues are the ones ALREADY SANCTIONED**, from `styles/tokens/colours.css` and permitted by
   `app-theme.css` inside the authenticated dashboard: optimal `#059669`, warning `#d97706`, critical
   `#b91c1c`. **They were not re-picked.** A second set of status colours is how a design system
   starts disagreeing with itself, and this one has three languages already.

**How it stays quiet: chroma is spent by AREA.** Large zones get 10 to 17 percent alpha so they read
as weather rather than as traffic lights; full-strength hue is spent only on the marker ring and the
badge border. Dark mode uses the lighter end of the same hues, because `#059669` and `#b91c1c` do not
clear contrast against a `#1A1D21` core.

**Colour is never the only carrier.** The badge states the verdict in words, the action cutoff stays a
hard rule, and the marker ring keeps a dark outer edge, so position and meaning both survive for
anyone who cannot separate the hues.

✅ **SHARPENED THE SAME DAY, FOR THE ICP RATHER THAN FOR TASTE.** Keith: the audience is **35 to 65
and over**, so *"we want to be making those colours crystal clear. However, not brutal."* Tints
roughly doubled, to 18 to 32 percent from 10 to 17.

⚠️ **BUT CHROMA WAS NOT THE ONLY LEVER AND PROBABLY NOT THE MAIN ONE.** Contrast SENSITIVITY declines
with age faster than colour discrimination does, and the lens yellows, which costs low-alpha tints
more than it costs edges. So three other things changed in the same pass:

- **Every zone carries a hairline on its leading edge**, so a boundary is read before a hue is.
- **The marker ring went 16px to 20px** with a paper-coloured halo, so it separates from whatever it
  sits on.
- 🔴 **The microtype came up, and this is the part that was genuinely failing.** The scale, legend,
  provenance note and badge were **10.5px letterspaced uppercase mono in `--ink-3`**, which the token
  set itself annotates as **4.99:1, the stated FLOOR**. They are now 11.5 to 12px in `--ink-2` at
  8.25:1 with tracking reduced. **Letterspaced uppercase mono at 10px is the hardest thing on this
  card to read at 55, and no amount of colour fixes it.**

**The general rule this earns: when a legibility complaint names colour, check the type in the same
pass.** A reader reports the symptom they can name, and on a data-dense card the microtype is
usually the larger fault and the one nobody points at.

🔴 **A REAL DATA ERROR WAS CAUGHT DOING THIS, and it was in the first draft of this frame.** The
ferritin card had the laboratory ceiling at **400**. `thresholds.md` line 64 says **442**, and Ewa
re-ratified the 300 action threshold *with the 442 ceiling in front of her* on 2026-08-07. Fixed. It
was found only because re-reading the thresholds table was needed to colour the zones truthfully:
**drawing a value forces you to look it up, which is an argument for mockups carrying real numbers
rather than placeholders.**

## 🟢 THE RESULTS DASHBOARD IS DRAWN IN F, and this time it was enumerated first (2026-08-27)

`design/mockups/journey/results-F.html`, the results-present state with a GP referral in the panel.
Verified at 1440 in both themes and at 390. **Concept only, sample data, not a real result, copy not
compliance-checked.**

✅ **THE BLOG'S LESSON WAS APPLIED.** Before drawing, the live page was enumerated:
`results-dashboard/page.tsx` plus the **fifteen components in `components/results-engine/`**. All
twenty parts are listed in the file's own comment block with a verdict each. **Nineteen placed, one
dropped**, and the drop is named: `DevFixtureBar`, which is dev-only.

✅ **PRIOR ART WAS READ BEFORE PRODUCING, and it changed the output.** `membership-first-cycle.html`
screen 1 carries a **TWO-range track** where the live page has one: the laboratory's reference range
AND our action cutoff, with the disagreement between them visible. Five things came from that mockup
that are **not on the live page**: the second range, the three-row legend, the hard rule at the
clinical action cutoff, the provenance footnote (BSSM 2023) and the *signed by Dr Ewa Lindo*
attribution line. Keith's own note on that mockup is that the disagreement IS the product and that
hiding the lab range would be the "moving the goalposts" charge committed invisibly.

**Trays are right here and were wrong on the blog, which is the useful half of having both.** F's
tray holds DATA. A marker card is data, so the reading sits in the concentric core and its
interpretation sits in the tray around it. The blog put prose in a tray and it read as a widget. Same
grammar, opposite verdict, because the content is a different kind of thing.

**Motion is exactly what brand-guidelines 8.3 sanctions and nothing more:** one pulsing live dot
(opacity only) and one one-shot load reveal, both respecting `prefers-reduced-motion`.

🔴 **DELIBERATELY ABSENT: the `high-testosterone` and `high-vitamin-d` cards.** Their copy is CA-044
and Ewa has not approved the wording. **A redesign must not launder unapproved copy into looking
finished**, so those two states stay undrawn until she rules.

✅ **ALL FOUR REMAINING FRAMES OF THIS ROUTE ARE NOW DRAWN**, in
`design/mockups/journey/results-states-F.html`: `pre-results`, `no-results`, `sample-failed` and
`/results-dashboard/handoff`. Enumerated from the code first, same as the results frame.

**`pre-results` carries the four order statuses as ONE frame plus a row of variants, not four
frames.** Only the heading, subtext and tracker position change between `order-placed`, `kit-sent`,
`sample-received` and `analysing`, and drawing four near-identical screens would have hidden that
rather than shown it. The tracker steps come from `TRACKER_STEPS` at `page.tsx:24` and the copy from
`STATUS_COPY` at `:33`.

🔵 **THE HANDOFF DELIBERATELY LEAVES F, and the reason is the useful part.** It is a **print artefact
for a clinician**, not a screen for a customer, so it has no tray, no wash, no grain, no ambient
shadow and **no dark mode**. A laser printer renders none of those and every one of them costs
legibility on paper. What it keeps from F is the type and the hairline rules. **A design system that
cannot say "not here" is a style guide pretending to be a system**, and this is the second sanctioned
exception after the blog, both of them argued rather than assumed.

## ✅ SUPERSEDED 2026-08-29: THE BLOG ADOPTS F. `blog-F.html` APPROVED (was: the blog keeps its own language, Keith 2026-08-27)

**Keith, on the side-by-side:** *"I think the old or the live blog style wins. There's a lot of detail
missing from the F blog you created, which at the moment I don't know if you can capture. So I think
the best thing to do is keep the article and the blog format the same for the moment, until we can."*

🔴 **SUPERSEDED IN DIRECTION 2026-08-29: KEITH APPROVED `blog-F.html`.** The blog adopts Direction F, so `.blog-skin` is on a path to retirement rather than being the settled answer. Nothing is deleted yet and the live blog still renders from it; the rebuild is a design approval, not a build release. See `09_website-app/design/mockups/journey/blog-F.html` and the blog entry in `09_website-app/STATE.md`.

The 2026-08-27 decision, kept as the record of what was ruled and why:

✅ **DECIDED 2026-08-27, SUPERSEDED 2026-08-29: `blog-skin.css` STAYS and is not deleted.** The blog keeps its documented licence to
break the brand rules: cream surface, hard offset block-shadow, Merriweather body, dotted-grid
texture, outline display type, the auto-numbered references box. **This is a deliberate exception
inside an app-wide system, not an oversight**, and it is scoped to `.blog-skin` so it cannot leak.
Revisit when there is time to work out the detail.

🔴 **THE CRITIQUE IS THE USEFUL PART, and it generalises to the other 44 frames.** The F draft was a
SIMPLIFICATION presented as a translation. It looked finished because a redraw always looks finished
on its own terms: nothing on the page announces what is missing from it. Detail the draft silently
dropped or flattened, only some of which was caught before showing it: the reviewer credential block
(caught, restored), and beyond that the references box, the clinical-insight component, the outline
display type, the dotted-grid texture and the table-of-contents rail. **The rule for every remaining
frame: enumerate the live page's components BEFORE redrawing it, and screenshot the two side by
side.** A redraw is scored against what it replaced, never against itself.

🔵 **WANTED: dark mode on the blog. Assessed, and the recommendation is to SEQUENCE it, not skip it.**

**What it would take today:** 81 hardcoded colour references across seven files
(`ArticleLayout.tsx` 27, `BlogListings.tsx` 29, `blog/page.tsx` 7, `blog-skin.css` 7, `BlogToc.tsx` 5,
`ClinicalInsight.tsx` 4, `References.tsx` 2) would have to become tokens that flip.

🔴 **The blocker is not the article, it is the frame around it.** The blog sits inside the
`(marketing)` route group and therefore shares `<Nav>` and `<Footer>`, both fixed light with no dark
mode anywhere on the site. A dark article between a white header and a white footer is a worse result
than no dark mode, and building a blog-only toggle would create **a fourth divergence weeks before
F's token set arrives carrying dark mode for every surface at once**, which is the exact failure this
redesign exists to end.

✅ **The no-regret half can start any time: TOKENISE the blog's 81 hardcoded colours.** That work is
required by the F migration regardless of what the blog ends up looking like, it is not thrown away
by either outcome, and once it is done the flip is close to free whenever the site-wide toggle lands.
**Nothing has been started; this is a recommendation awaiting Keith.**

## ✅ Four F pages are built and the four rulings are closed (handoff written 2026-08-31; SUPERSEDED, the live pick-up is at the top of this file)

**Read this section and nothing else to start.** Everything below it is the reasoning.

### State, and how to regenerate it

🔴 **NOTHING IS DEPLOYED.** A push to `main` is a deploy (`CLAUDE.md`, Coolify). **This work is on
`redesign/direction-f`, which is NOT main**, so pushing this branch deploys nothing. `main` still has
its own unpushed commits from earlier sessions. **Do not trust the numbers in any handoff, including
this one. Regenerate them:**

```bash
git log --oneline main..redesign/direction-f   # what the branch is carrying
git log --oneline origin/main..main            # what a push to main would deploy
git status --short -- andro-prime | grep -v '^??'
```

**Run it locally:** `cd andro-prime/09_website-app/frontend && npx next dev --port 3006`.

🔴 **Two dev-server traps, both of which look like a CSS bug you just introduced:**

1. **Do NOT use `npm run dev`.** Its script is `next dev --turbo`, and Turbopack fails here with
   `can't infer type of chunk from URL app-pages-internals`: SSR keeps serving correct HTML while the
   client runtime dies and blanks the page. Webpack dev is stable.
2. **`next dev` and `next build` share `.next`, and they break each other in BOTH directions.** A
   build replaces the dev server's compiled assets, so the next page load 500s and then comes back
   **completely unstyled**. And with the dev server running, `next build` fails non-deterministically
   with `Failed to collect page data`, **naming a different route each time**. **Stop the dev server
   before building, and restart it after.**

### What is DONE

- ✅ **Four F pages**: `/kits` (Frame O), `/how-it-works` (Frame S), `/kits/testosterone` (Frame P),
  and now **`/kits/energy-recovery` (Frame Q)** and **`/kits/hormone-recovery` (Frame R)**.
- ✅ **All four rulings are closed** (Keith, 2026-08-31): density was **drift**, so the three app
  frames were converged onto the marketing values; headline x-height **left as is**; table cell marks
  stay the **11px circles**; the inverted panel's big label is **deliberate** and is now a named
  `.f-blab-lg` at (0,2,0) instead of a specificity accident.
- ✅ **The typeface ruling is implemented** (`--font-sans` is Source Sans 3, a humanist sans) and
  `f-primitives.css` carries both optical corrections.
- ✅ **The reconciler exists**: `12_operations/automation/reconcile-f-css.js`. Now **18 conflicts, 31
  mockup-vs-mockup** (was 33: the density ruling closed two).

### 🔴 THE METHOD, and the fourth way it failed

**The mockups are a specification, not a wireframe.** Port the frame's declarations; self-authored
CSS needs a stated reason. Then render frame and rebuild through the same harness and view them
together. That is necessary and not sufficient. Four failure modes are now on record:

- **Grep every call site before repairing one.** The correct version is often already in the repo.
- **A declaration diff cannot see an ABSENCE.** Probe the **built page** with `getComputedStyle` and
  selector counts, not the stylesheet.
- **An optical audit measures only what it was told to measure.** It passed `/kits` at under 1.5%
  and missed four accent and interaction defects. **The eye is still the gate.**
- 🆕 **RUN THE FRAME LABEL AS A CHECKSUM.** Each frame's label states its section count.
  **Frame Q says eight and drew seven; Frame R says ten and drew nine.** That one grep found the
  symptom checklist missing from Q, the `Built for` body missing entirely from R, and — once absence
  was the thing being looked for — a sample-report footer in Q replaced by **commentary about the
  mockup** that would have shipped as customer copy. The file **already records this defect against
  itself** for Kit 3's FAQ. The verifier was in the artefact and nobody ran it.

**And the copy rule, now evidenced rather than assumed: layout comes from the frame, COPY comes from
the live page.** Frames Q and R both propose close headlines the live pages do not carry. Kit 1 only
looked like a precedent for taking the frame's copy because Frame P's close matched live exactly.

### What to pick up, in order

1. 🔴 **Look at the two new pages running, and rule the one open design call.** Frame R draws
   **no biomarker grid and no process steps** for Kit 3, folding nine markers into three rows of
   names. Both were KEPT, because following the frame would leave the £179 flagship the thinnest of
   the three kit pages, and because that frame is provably one section short elsewhere. **Deleting
   them is five minutes; restoring them later is not.** Keith's call.
2. **`RelatedArticles` needs an F version.** It is now the visible seam on both new pages: V2.0 hard
   black borders and uppercase sans sitting under a finished F page. It is the first shared component
   that needs converting and it is on every kit page.
3. **Get `chrome-F` approved or rejected** from the running site. It blocks nothing technically but
   everything sits inside it.
4. **The next pages.** `/lp/*` and `/faq` are the next cheapest against existing primitives.
5. **Two questions the frames raise and nobody has answered**: whether the two comparison tables
   collapse into one (Kit 3's is now DERIVED from `lib/pricing.ts` + `lib/kits/panel.ts`, so they are
   consistent but still two), and whether status colour is allowed on a marketing sample-report panel.
6. **The step strip is three copies and should be one**, but the three differ by one clause
   ("Simple finger-prick at the kitchen table" vs "A simple finger-prick sample you can do at the
   kitchen table"). Merging picks a winner, so it is a copy ruling first and a refactor second.
7. **The licensed faces, when there is budget.** Effra (Dalton Maag) is **priced and self-hostable**,
   £185 for the 2-axis variable including all 18 statics, and ships a Heavy. **Austin (Commercial
   Type) publishes no price** and its self-hosting position is unconfirmed. Substance in
   `02_brand/STATE.md`.
8. **The touch on-state** (`.act` driven from scroll on `.step` and `.tray.pick`) is ported on
   neither, so the two are at least consistent. **The logo vector**: `Logo.tsx` still carries the
   Refined Monogram, so the site stays in its deliberate mixed state.

### Tools

- `12_operations/automation/reconcile-f-css.js` — the mockup-vs-primitives diff. **Watch the size of
  its "unpaired" bucket: that is the count of what it declined to compare.** 🔴 Known gap: its
  `RULED` table is consulted **only in the conflict branch**, so a ruling about a mockup-vs-mockup
  disagreement has nowhere to live and will report as drift forever.
- The render-and-probe harness (screenshot at 1440/390 plus `getComputedStyle` counts on the built
  DOM) lives in this session's scratchpad and is **not committed**. It is what proved 0 mono labels
  in the body sans and Kit 3's single unbanded row. If it is wanted again it belongs in
  `12_operations/automation`.

---

## The previous handoff (2026-08-31, earlier), kept for its detail

### ▶️ two F pages match their frames, and what is left is four rulings

**Read this section and nothing else to start.** Everything below it is the reasoning.

### State, and how to regenerate it

🔴 **NOTHING IS DEPLOYED.** A push to `main` is a deploy (`CLAUDE.md`, Coolify). **This work is on
`redesign/direction-f`, which is NOT main**, so pushing this branch deploys nothing. `main` still has
its own unpushed commits from earlier sessions. **Do not trust the numbers in any handoff, including
this one. Regenerate them:**

```bash
git log --oneline main..redesign/direction-f   # what the branch is carrying
git log --oneline origin/main..main            # what a push to main would deploy
git status --short -- andro-prime | grep -v '^??'
```

**Run it locally:** `cd andro-prime/09_website-app/frontend && npx next dev --port 3006`.

🔴 **Two dev-server traps, both of which cost time on 2026-08-31 and both of which look like a CSS
bug you just introduced:**

1. **Do NOT use `npm run dev`.** Its script is `next dev --turbo`, and Turbopack fails here with
   `can't infer type of chunk from URL app-pages-internals`: SSR keeps serving correct HTML while the
   client runtime dies and blanks the page. Webpack dev is stable.
2. **`next dev` and `next build` share `.next`, and they break each other in BOTH directions.** A
   build replaces the dev server's compiled assets, so the next page load 500s and then comes back
   **completely unstyled** with every stylesheet 404ing. And with the dev server running, `next build`
   fails non-deterministically with `Failed to collect page data`, **naming a different route each
   time** (`/api/membership/checkin`, then `/icon.png`), neither of them touched. **Stop the dev
   server before building, and restart it after.** A `Failed to collect page data` naming a route you
   did not touch means the dev server is up, not that your change broke that route.

### What is DONE, and verified against the frames rather than by eye alone

- ✅ **`/how-it-works` and `/kits` now match their frames.** Every text component on `/kits` is within
  **1.5%** of Frame O optically, measured, with one deliberate exception at 3.8%.
- ✅ **The typeface ruling is implemented.** `--font-sans` is **Source Sans 3**, the humanist sans from
  option C of the comparison Keith judged. It had been **Inter, a neo-grotesque**, which was option A
  in the same comparison and the one that lost. **It was three binding sites, not the two the ruling
  records**: `tailwind.config.ts` binds the family variable directly and bypasses the token layer.
- ✅ **`f-primitives.css` carries two optical corrections**: `font-size-adjust: 0.53` on `.f-page`
  (x-height, matching Geist, which the mockups are drawn in) and `cap-height 0.71` on the eight
  display rules. Every declared `font-size` still matches its frame, and both self-correct when the
  licensed faces land.
- ✅ **The reconciler exists**: `12_operations/automation/reconcile-f-css.js`, documented in
  `12_operations/CONTEXT.md`.

### 🔴 FOUR THINGS ARE KEITH'S CALL, and three of them block other work

1. **App-vs-marketing density.** Every tighter value in the mockups clusters in `account-F`,
   `membership-F`, `results-F` and `results-states-F`, the authenticated app: `.f-core` padding 24/22
   against 26/22, `.f-sub` 15px/1.66 against 16px/1.68, `.f-btn` 11px 18px against 14px 24px.
   **If deliberate it becomes a documented variant like `.f-btn-sm`; if not they converge.** Nothing
   else in the mockup set can be reconciled until this is ruled, so **this one comes first**.
   Substance: the reconciler entry in this file, and run the tool.
2. **Headline x-height.** Headings sit at +1.5% on cap-height and **-12% on x-height**, because a
   serif carries a lower x-height than the sans it replaced. Intrinsic to serif-over-humanist, not a
   defect. If it still reads small, switching the display rules to the x-height form is one token
   **and it will move every headline's line breaks**.
3. **Table cell marks.** Frame O uses **18px rounded squares** (filled with a tick for yes, outlined
   for no); the build uses **11px filled and hollow circles**. Real component difference, not drift.
4. **The four structural disagreements on `/how-it-works`**, where the build followed the LIVE page
   and the frame drew something else: the one-column hero, the kit cards, the after-results grid, and
   Dr Ewa's inverted panel. Substance in this file's `/how-it-works` entry.

### 🔴 A defect in the APPROVED MOCKUP, which nobody has ruled on

`kits-F.html` declares `.blab { font-size: 11.5px }` at specificity (0,1,0) and
`.invert p { font-size: clamp(1.02rem,1.5vw,1.16rem) }` at (0,1,1). The "What you pay" label is a
`<p class="blab">` inside `.invert`, so **it renders at 18.56px, 61% larger than the other thirty
instances of the same component**, in the frame Keith reviewed and approved. **The build does NOT have
the bug** (it uses a class, `.f-invert-p`, not an element selector). So the mockup is the thing to fix,
which inverts the assumption the porting exercise runs on. **Keith approved that frame with the big
label on screen**, so it is his call, not a silent fix.

### What to pick up, in order

1. 🔴 **Get the density ruling** (item 1 above). It blocks the reconciler's whole conflict list.
2. **The next pages.** `/kits/energy-recovery` and `/kits/hormone-recovery` (Frames Q and R) are
   cheapest: same shape as `/kits/testosterone`, primitives already exist. **Use the method below.**
3. **Get `chrome-F` approved or rejected** from the running site. It is the shared shell; it blocks
   nothing technically but everything sits inside it.
4. **The licensed faces, when there is budget.** Effra (Dalton Maag) is **priced and self-hostable**:
   £185 for the 2-axis variable **including all 18 statics**, and it ships a Heavy, which closes the
   open wordmark detail without a third licence. **Austin (Commercial Type) publishes no price at all**
   and is quote-only; 🔴 **their self-hosting position is unconfirmed and gates the price question
   rather than following it.** Adobe Fonts carries Effra but forbids self-hosting, so it covers desktop
   and design work and cannot serve the site. Substance in `02_brand/STATE.md`.
5. **The touch on-state.** The mockups drive `.act` from scroll so a phone gets the same signal a
   pointer does, on both `.step` and `.tray.pick`. **Neither is ported**, so the two are at least
   consistent. Owed on both.
6. **The logo vector.** `Logo.tsx` still carries the Refined Monogram, so the site stays in its
   deliberate mixed state: new mark in the browser tab, old mark in the page header.

### 🔴 THE METHOD, and the three ways it failed on 2026-08-31

**The mockups are a specification, not a wireframe.** Read the frame's stylesheet for each component
and **port its declarations**. Self-authored CSS is the exception and needs a stated reason. Then
render frame and rebuild **through the same harness and view them together**.

That method is necessary and it is not sufficient. All three of these were found the hard way:

- **Grep every call site before repairing one.** A step-card index was missing on `/kits` and
  `/how-it-works` while `/kits/testosterone` had it right the whole time. The correct version was in
  the repo, and the diff between siblings is cheaper to read than the diff against the frame.
- **A declaration diff cannot see an ABSENCE.** Four of the six defects on `/how-it-works` were things
  that were not there: a class the markup never emitted, a glyph never rendered on 19 of 19 items.
  Probe the **built page** with `getComputedStyle` and selector counts, not the stylesheet.
- **The optical audit passed `/kits` at under 1.5% and missed four accent and interaction defects**
  that Keith then found in one side-by-side look, including a Kit 3 card still carrying a design the
  frame had superseded. A harness measures what it was told to measure. **The eye is still the gate.**

### Tools this session added or fixed

- `12_operations/automation/reconcile-f-css.js` — the mockup-vs-primitives diff. **Its media-query
  normalisation was broken on the first build** and it was silently blind to every responsive rule
  while reporting conflicts and exiting 2, which looks exactly like a working tool. Fixed. **Watch the
  size of its "unpaired" bucket: that is the count of what it declined to compare.**
- The optical-audit harness lives in this session's scratchpad only and is **not committed**. It
  measures the USED font size (which `getComputedStyle` does not report once `font-size-adjust` is in
  play) by comparing a probe span's DOM width against a canvas measurement. If it is wanted again it
  belongs in `12_operations/automation`. **Rebuild note: `canvas.measureText` does not trigger font
  loading**, so an unloaded face silently measures the fallback and every face returns identical
  numbers. Load explicitly, assert `document.fonts.check`, and fail if all values match.

---

## The previous handoff (2026-08-30, evening), kept for its detail


**Read this section and nothing else to start.** Everything below it is the reasoning.

### State, and how to regenerate it

🔴 **NOTHING IS DEPLOYED.** A push to `main` is a deploy (`CLAUDE.md`, Coolify). `main` has unpushed
commits; `redesign/direction-f` is pushed to origin but never merged. **Do not trust the numbers in
any handoff, including this one. Regenerate them:**

```bash
git log --oneline main..redesign/direction-f   # what the branch is carrying
git log --oneline origin/main..main            # what a push would deploy
git status --short -- andro-prime | grep -v '^??'
```

**Run it locally:** `cd andro-prime/09_website-app/frontend && npx next dev --port 3006`.
🔴 **Do NOT use `npm run dev`.** Its script is `next dev --turbo`, and Turbopack failed repeatedly
here with `can't infer type of chunk from URL app-pages-internals`: SSR kept serving correct HTML
while the client runtime died and blanked the page. It looks exactly like a CSS bug in whatever you
just edited. Webpack dev is stable. Marketing routes need no backend.

### What got built

A **thin vertical slice** in Direction F, chosen deliberately over converting everything, so the serif
ruling could be judged on real pages before 44 more are built against all-sans frames.

1. ✅ **Shared chrome**: nav (a floating rounded shell, not a full-width bar), footer, mobile drawer,
   cookie banner. `Nav.tsx`, `Footer.tsx`, `CookieConsent.tsx`, `CookieSettingsLink.tsx`,
   `(marketing)/layout.tsx`. All behaviour preserved: host-aware links, POST-form logout, three
   variants, membership flag. 🔴 **`chrome-F.html` is STILL NOT APPROVED.** It was built so Keith can
   judge it running, which is how every other F ruling has actually been made. Reverting is one commit.
2. ✅ **`/kits`** rebuilt from Frame O, and **`/how-it-works`** from Frame S.
3. ✅ **The type system carries the 2026-08-30 serif ruling** through a NEW `--font-display` token on
   **Newsreader, a stand-in**, not the licensed face. `--font-serif` was deliberately NOT repointed:
   it means "Merriweather body copy" in 517 places across 83 files, and `globals.css` sets
   `body { font-family: var(--font-serif) }`, so repointing it would silently reset body copy on every
   page not yet rebuilt. Six heading rules moved, and their **tracking, weight and leading were
   re-judged, not carried across** (-0.045em / 700 / 1.05 are grotesque settings that make a serif
   look broken; now -0.02em / 500 / 1.1).

### 🔴 THE MOST IMPORTANT THING HERE: how the first pass got the cards wrong

**The mockups are a specification, not a wireframe.** Each `*-F.html` carries a complete working
stylesheet. The first pass at `/kits` ported the **markup** and then **re-derived the CSS** from that
skeleton plus judgement, without opening the frame's own style block. Nothing errored, the result was
internally consistent and looked fine, and a screenshot pass approved it. **Keith spotted it in one
glance: "the cards are very different."**

Every value had drifted (`8fr 4fr` against the frame's `1.75fr 1fr`; spec radius 14 against 16px;
price a fixed 30px/600 against `clamp(1.7rem,3vw,2.2rem)`/700 **with tabular-nums**, which is what
keeps 99 / 119 / 179 aligned down the page). Two things were dropped outright: the **hairline column
divider** that makes the aside read as part of the card, and the **accent tick glyph**, which was the
accent's only appearance inside the card. One was missed: **Kit 2's CTA is ghost while Kits 1 and 3
are solid**, so the middle option does not compete.

**The method, for every remaining page:** read the frame's stylesheet for each component being built
and port its declarations. Self-authored CSS is the exception and needs a stated reason. Then verify
by rendering **the frame and the rebuild through the same harness and viewing them together**:

```bash
node andro-prime/12_operations/automation/shot.js \
  "andro-prime/09_website-app/design/mockups/journey/kits-F.html?still=1&t=light" \
  --selector ".tray.pick" --nth 1 --width 1440 --out <dir>
node andro-prime/12_operations/automation/shot.js "http://localhost:3006/kits" \
  --selector ".f-tray:not(.f-tray-dark)" --nth 1 --width 1440 --theme light --out <dir>
```

Comparing a rebuild against a remembered impression of the frame validates the memory, not the build.

### ✅ `/how-it-works` HAS NOW HAD THAT COMPARISON RUN (2026-08-31)

It did carry the same class of error, and two more the `/kits` lesson had not named. Six defects,
all fixed; two of them were on `/kits` as well. **Four structural disagreements were left for Keith.**
The full finding is the entry at the top of this file. **The generalisable lesson is new: before
repairing a ported component, grep every call site of its class.** `/kits/testosterone` had both of
the shared defects right the whole time, and comparing siblings would have localised the drift
faster than comparing any one of them to the frame.

### The design-system question Keith raised, and the measured answer

He asked whether the guidelines need updating. **They do not.** The finding is structural and sits
elsewhere. Measured across all 13 journey mockups:

- ✅ **The token layer is clean: 24 tokens, ZERO value conflicts.** The `:root` blocks differ only by
  accretion (later files added `--ok` / `--warn` / `--crit`). Nobody has redefined a colour or radius.
- ✅ **`f-primitives.css` matches the mockup majority exactly** on `.f-btn`, `.f-sub`, `.f-eyebrow`.
  The port done during the `/kits/testosterone` rebuild was faithful.
- 🔴 **The component layer lives in FOURTEEN independent copies** (13 mockup `<style>` blocks plus
  `f-primitives.css`) with nothing reconciling them, and **the mockups have already drifted from each
  other**: `.btn` padding in four sizes (`14px 24px` x8, `13px 22px` x2, `12px 20px` x2, `11px 18px`
  x1), `.sub` measure at 70 / 66 / 64 / 62ch, `.eyebrow` margin-bottom split 18px x4 against 20px x4.
- The `results-*` frames run consistently tighter, which reads like **deliberate density for the
  authenticated app**, but that is recorded nowhere, so a rebuild cannot tell a considered variant
  from a typo.

**What that implies, in order of value:** a **reconciler** that diffs each mockup's CSS against
`f-primitives.css` and reports conflicting declarations (same shape as
`.claude/skills/wrap/reconcile-observations.js`: exit 0 agree, 2 drift, 1 could not run); the method
rule above; and **Keith's ruling on whether the app scale is deliberately denser than marketing.** If
yes it becomes a documented variant like `.f-btn-sm`; if no they converge. Note the mockups name Geist
212 times and the typeface has since changed, so they need a pass regardless: that is the moment to
consolidate rather than doing it as separate work.

### Three defects found by building, all fixed

1. **`.f-sec` killed the page gutter.** It used the `padding` shorthand, which resets `.f-wrap`'s
   horizontal padding to 0 wherever the two classes are combined, and being defined later at equal
   specificity it won silently. **Pre-existing**: already live on `/kits/testosterone` in five places,
   so content ran to the viewport edge at 390. Now vertical longhand.
2. **The `.sr-only` labels overflowed the page, not the table.** The comparison table scrolled
   correctly the whole time; the screen-reader spans are `position: absolute`, and **an overflow
   container only clips absolutely-positioned descendants if it is itself positioned**. `.f-tablewrap`
   was static, so they escaped 480px out and set the page width. Fixed with `position: relative`.
   **Any `overflow: auto/hidden` container that may hold `.sr-only` needs this.**
3. **`.f-no` name collision**: the step cards already used it for a mono label. The table's version is
   now `.f-in` / `.f-out`.

### What to pick up, in order

1. ~~Diff `/how-it-works` against `learn-F.html` Frame S.~~ ✅ **Done 2026-08-31**, six defects fixed,
   two of them also on `/kits`. 🔴 **What is left of it is a decision, not a build**: the four
   structural disagreements between the build and the frame, listed in the entry at the top.
2. **Get `chrome-F` approved or rejected** from the running site. It is the shared shell; it blocks
   nothing technically but everything sits inside it.
3. ~~The mockup-vs-primitives reconciler.~~ ✅ **Built 2026-08-31**, `reconcile-f-css.js`. 🔴 **What
   is left of item 3 is Keith's ruling on app-vs-marketing density**, which the reconciler now has
   the evidence for, and which blocks reconciling anything else.
4. **The next pages.** `/kits/energy-recovery` and `/kits/hormone-recovery` (Frames Q and R) are
   cheapest: same shape as `/kits/testosterone`, primitives already exist.
5. ~~The sans is the wrong category, not a stand-in.~~ ✅ **FIXED 2026-08-31.** Keith's chosen option
   was labelled "C · Serif headline over humanist sans" and `--font-sans` was **Inter, a
   neo-grotesque**, which was option A in the same comparison. Now **Source Sans 3**, variable with
   italic, verified on the running pages with no Inter left anywhere. 🔴 **It was THREE binding
   sites**: `tailwind.config.ts` binds the family variable directly and bypasses the token layer, so
   the "two-file change" the record promises would have left every Tailwind `font-sans` class behind.
   **The headline faces.** Newsreader is a stand-in. Austin (Commercial Type) over a humanist sans
   such as Effra (Dalton Maag); licensing, self-hosting rights and price all unverified and gate any
   spend. Substance in `02_brand/STATE.md`. Neither is on Google Fonts, so `layout.tsx` moves to
   `next/font/local`. **`tailwind.config.ts` is a third binding site** that bypasses the token layer
   entirely and will surprise whoever applies the real face.
6. **The logo vector.** `Logo.tsx` still carries the Refined Monogram, so the site stays in its
   deliberate mixed state: new mark in the browser tab, old mark in the page header.

---

## The previous handoff (2026-08-30, morning), kept for its detail

**Read this first if you are resuming the app-wide redesign.** Everything below it in this file is
the reasoning; this section is the state and the next move.

### The next move (handoff rewritten 2026-08-30, branch state refreshed 01:30)

**Read this block and nothing else to start.**

🔴 **NOTHING IS DEPLOYED, AND THE BRANCH IS CARRYING FIVE COMMITS THAT DO NOT BELONG TO IT.**
`main` has three commits unpushed (`089f93f`, `2bea2ea`, `4a43864`) and **a push to `main` is a
deploy** (`CLAUDE.md`, Coolify), so nothing in any of this has shipped. `redesign/direction-f` is
**six** commits ahead of `main`, and **exactly one of them is redesign work**.

| Commit | What it is | Belongs on |
|---|---|---|
| `ea662ce` | `/kits/testosterone` rebuilt in Direction F | ✅ the branch |
| `9d70789` | demo-account interactive prototype | `main` |
| `538a289` | brand-lead ruling A2 sweep (01, 02, 03, 07) | `main` |
| `128255f` | the STATE close-out that wrote this handoff (02, 04, 09) | `main` |
| `13248f7` | monitoring-thesis falsifier correction (01) | `main` |
| `0d4efca` | three residual carriers of the brand-lead ruling (07) | `main` |

The five landed there because parallel Claude sessions shared one working tree and one checked-out
branch, so each of them committed onto whatever happened to be checked out. **They were left alone
deliberately**: the other sessions were still writing, and rewriting shared history under a live
session is worse than the mess it fixes. Sort this before pushing anything.

⚠️ **This block's own count has already been wrong once, and it will go wrong the same way again.**
The version saved at 00:54 named two stray commits. Three more landed in the sixteen minutes after
it was written, **one of them being the commit that contains this handoff** — so it was an undercount
at the moment it was saved, by construction. **Do not trust the table on sight, regenerate it**, which
is two commands:

```bash
git log --oneline main..redesign/direction-f   # what the branch is carrying
git log --oneline origin/main..main            # what a push would deploy
```

**What got done, in order**

1. ✅ **The FAI report-only sweep** (`089f93f`). Eight defects on live pages, not the three the old
   handoff named. Detail in the entry below.
2. ✅ **The 2026-08-27 brand release was PROPAGATED** (`2bea2ea`). It already existed and had never
   been carried into the guidelines, the tokens or the build. **Three layers were enforcing the
   superseded rules**, the last being `* { border-radius: 0 !important }` in `globals.css`, which beat
   even arbitrary values. Verified a visual no-op across 10 routes at two viewports.
3. ✅ **The accent split ruled and applied** (`4a43864`, Keith 2026-08-29): the accent is
   marketing-only and may never colour a results or sample-report panel.
4. ✅ **`/kits/testosterone` rebuilt in Direction F** (`ea662ce`), the first page. Frame P.
   Primitives extracted to `frontend/styles/components/f-primitives.css` (417 lines), which is the
   reusable layer the other 45 pages inherit.
5. ✅ **The cross-workspace close-out** (`538a289`, then `128255f`, `13248f7`, `0d4efca`). The FAI
   sweep, the F rebuild and the open rulings were written back into `02_brand`, `04_products` and
   this file, and the brand-lead ruling was propagated through `01_strategy` and `07_sales`. Docs
   only, no code, and all four are stranded on the branch per the table above.

**What the next chat should pick up, in order of cost to leave**

1. ✅ **THE TYPEFACE IS RULED (Keith, 2026-08-30, commit `c4d477c`), AND IT WENT AGAINST F.** A
   **serif headline over a humanist sans**, the sans carrying body copy, UI and all data. Direction F
   was drawn all-sans, so **this changes F**. Judged from live renders of the rebuilt
   `/kits/testosterone` at 1440 and a true 390, sample-report panel included, not from description.
   🔴 **The FACES are not chosen.** The comparison ran on free stand-ins; the licensed candidates are
   **Austin** (Commercial Type) for headlines over a humanist sans such as **Effra** (Dalton Maag), and
   **licensing, self-hosting rights and price are all unverified and gate any spend.** Also settled:
   **Inter was never a brand choice**, it is the default the site was stood up on, and **Geist was
   never one either** (it is the first substitute on `high-end-visual-design`'s own list, and that
   skill's quality detector then flagged Geist with the identical overused-font finding it raised
   against Inter). Two defaults, neither chosen. **Applying a ruling stays a two-file change**,
   `typography.css` plus `app/layout.tsx`, because every F rule resolves `--font-sans` rather than
   naming a family. Detail in `02_brand/STATE.md`.
2. 🔴 **THE LOGO CHANGED, AND THE MARK NOW HAS TO BE DRAWN.** The radius question that sat here is
   **closed** (Keith, 2026-08-30): rather than rule on rounding the AP square, he approved a new mark,
   the **Interlocked AP**, which has **no container**, so there is nothing to round.
   `chrome-F.html`'s 9px / 7px lockup radius is moot; it rounds a container the new mark does not
   have, and that markup gets replaced when the mark does. Record:
   `02_brand/2026-08-29-direction-f-supersedes-v2-non-negotiables.md` §5, now CLOSED.
   **What replaces it is larger than what it closed.** The approved mark is a **raster PNG with no
   vector masters** (`02_brand/assets/logos/interlocked-ap/`), so nothing can be re-cut yet, and until
   it is **the square Refined Monogram stays live everywhere and must not be rounded.** Stale the
   moment the masters land: `components/shared/Logo.tsx`, both OG routes, the packaging sleeve
   renders and the social profiles. ✅ **THE ICON SET IS ALREADY DONE (2026-08-30):** `app/favicon.ico`,
   `app/icon.png`, `app/apple-icon.png`, `public/icon-192.png` and `public/icon-512.png` all carry the
   Interlocked AP, built by `02_brand/assets/logos/interlocked-ap/build-icons.js`. It could go first
   because a fixed-size raster output does not need a vector source. ⚠️ **This puts the site in a
   deliberate mixed state: new mark in the browser tab, old mark in the page header.** Not deployed
   (branch unpushed), and it resolves when `Logo.tsx` moves. **The existing regeneration build does not transfer**: it
   works by outlining Inter Black glyphs and the new mark is a custom interlock in no typeface, so the
   vector has to be drawn by hand first. ✅ **Neither half now waits on the typeface.** The mark never
   did, because it is not set in a typeface. **The wordmark was ruled on 2026-08-30 too: it stays a
   heavy grotesque, uppercase**, put to Keith as a three-way render against this approved mark at
   52px, 22px nav and 14px minimum, each lockup also shown above a real serif headline. **The lockup
   spec is confirmed, not changed**, and the two-register tension against the new serif headline is
   recorded as deliberate so nobody files it as a defect later. The only open detail is **which**
   grotesque, and the cheapest answer is the body sans at its heaviest weight rather than a third
   family.
3. **`chrome-F.html` is still unapproved, and it is now the visible seam.** The rebuilt page sits
   inside a V2.0 nav, cookie banner, related-reading card set and footer. Either approve the chrome
   frames and rebuild the layout next, or accept the seam while more pages convert. **Keith's call.**
4. **The next pages.** `/kits/energy-recovery` and `/kits/hormone-recovery` are the cheapest, because
   they are Frames Q and R against primitives that already exist. `RelatedArticles` is the first
   shared component that needs an F version.
5. **Still open from the FAI sweep:** the `/faq` CA-026 sentence (*"free testosterone via FAI"*, live
   in copy and schema, drafted replacement and owners in `03_compliance/STATE.md`), and the stale
   `content/blog/free-androgen-index.mdx` mirror.

**The method lesson from this session.** Three separate things this session had already been decided
and were still being treated as open, or were recorded as open and had already been done: the brand
release (ruled 08-27, never propagated), the accent (the frames' own annotations said
*"sample report drawn without status colour"*), and the routing card's accent (the frame's annotation
described a tint its CSS never rendered, because `.route` at 0,1,0 lost to `.symp div` at 0,1,1).
**Search for the decision in the vocabulary of what it releases, not in the name of the thing that
provoked the question**: a ruling cannot contain the name of something approved after it. And an
annotated design file is two documents that drift in both directions: diff the prose against
`getComputedStyle`, never trust either alone.

---

### The previous next-move block (2026-08-29), kept for its detail

**Read this section and nothing else to start. Everything below it is how it got here.**

🔴 **NOTHING IN THIS SESSION IS DEPLOYED. All code is in the working tree only.** Two code
changes and five design files. `tsc` 0, `next build` 0, quiz regressions 22/22, every changed surface
screenshot-verified at 1440 and a true 390.

**What is drawn, and what is approved**

| File | Frames | Approval |
|---|---|---|
| the eight page files through `act-F` | A to AB | ✅ approved 2026-08-28 / 08-29 |
| `lp-sample-F.html` | AC, AD | 🔴 **not approved** |
| `chrome-F.html` | AE to AK | 🔴 **not approved** |
| `blog-F.html` | AL to AQ | ✅ **approved 2026-08-29** |

**The spine covers every page, all the shared chrome, and the blog. Two surfaces are still undrawn:**
`app/opengraph-image.tsx` (107 lines) and `app/api/og/blog/[slug]/route.tsx` (331 lines), the OG share
cards. They are a different medium (1200x630 images that render in WhatsApp and Slack, not screens at
F's tokens) and **there is an open question whether they belong in the journey set at all or in
`02_brand` beside the packaging renders.** That question is the first thing to put to Keith.

**Two code changes, both working tree only**

1. **The marker-count defect is fixed** and was on **six** surfaces, not the two the old handoff named.
   All six now render from `frontend/lib/kits/panel.ts`, the new single source;
   `scripts/test-quiz-routing.ts` guards the Kit 1 sentence the way it already guarded Kit 2.
2. **The 404 is built** (`frontend/app/not-found.tsx`). There was no `not-found.tsx` anywhere before,
   so every bad URL served Next's default. It renders its own nav and footer because an unmatched URL
   never runs the marketing layout; verified in a browser that thrown `notFound()` does not double them.

### ✅ THE REBUILD IS UNBLOCKED: tokens landed 2026-08-29, and there were THREE blocking layers, not one

**Direction F was uncompilable in this codebase, silently, and had been since it was approved.** Not
because anything was wrong with the frames: because the rules F replaces were enforced in three places
and nobody had swept any of them.

**The ruling already existed.** Keith demoted the visual guidelines to advisory on **2026-08-27**
(`02_brand/STATE.md`), naming `rounded-none`, `no box-shadow`, white-only and "no accent colour"
individually. That ruling was never propagated. Two days later F was approved on the strength of it,
while:

| Layer | What it did | Now |
|---|---|---|
| `styles/tokens/radius.css`, `shadows.css` | `--radius: 0px`, `--shadow: none` | F's scale: `--radius-container: 28px`, `--radius-inset: 22px`, `--radius-pill: 999px`, `--shadow-ambient` |
| `tailwind.config.ts` | **top-level** (not `extend`) overrides zeroing *every* radius and shadow utility | three named radius steps plus zero; one `shadow-ambient`; F's ink ramp, four surfaces and hairlines added as colours |
| `styles/base/globals.css` | `*, *::before, *::after { border-radius: 0 !important }` and `* { box-shadow: none !important }` | **`!important` dropped, rules kept** |

**The third layer was the real one and it was the last one found.** `!important` on the universal
selector beats everything an author can write, so `rounded-[28px]` would have failed too, not just
`rounded-3xl` — the "just write arbitrary values" fallback was never actually available. Dropping
`!important` is sufficient and safe: `*` has zero specificity, so it still beats UA defaults (native
form controls stay square, which is what holds the current pages steady) and loses to any class, so F's
utilities work. The rules are kept, not deleted; deleting them would let browser form-control radii in.

**Verified as a visual no-op, which was the whole claim.** Full-page screenshots of 10 routes at 1440
and a true 390, animations frozen, hashed and diffed before against after: **18 of 20 byte-identical,
and the other two differ by a maximum channel delta of 1** — one grey level of font antialiasing, no
layout shift anywhere. One of those two (`/kits/hormone-recovery` at 1440) was independently proven
flaky: three different hashes across three runs of identical code. Positive proof that F now compiles:
`rounded-container` emits `var(--radius-container)`, `shadow-ambient` emits `var(--shadow-ambient)`,
and `rounded-none` / `shadow-none` still emit `0px` / none. `tsc` 0, `next build` 0.

🔴 **Two things Keith's 2026-08-27 ruling did NOT cover, and both are open:**

1. ✅ **RULED AND APPLIED 2026-08-29: the accent is marketing-only.** Keith took option A. `--flag` may
   never colour a results or sample-report panel; those keep the dashboard status tokens. It was **one
   file**, because the four frames that actually render results (`results-F`, `results-states-F`,
   `account-F`, `membership-F`) already did this and say why: *"a second set of status colours is how a
   design system starts disagreeing with itself."* `kits-F.html` gained `--ok` / `--warn` / `--crit`
   lifted from the dashboard, and its bar fills now carry **the band each row's own badge declares**
   instead of one flat accent for every marker — which also fixes a "preview = real" failure the
   collision was hiding, since the live dashboard colours each bar by band. 11 flagged rows amber, 5
   in-range green, FAI no bar; **all 18 rows verified to agree with their own chip, and all three sample
   panels screenshot-verified.** The frames had annotated the intent all along (*"sample report drawn
   without status colour"*), so the accent there was a placeholder, not a claim. Record: §4 of `02_brand/2026-08-29-direction-f-supersedes-v2-non-negotiables.md`.
2. **The logo mark's radius.** `chrome-F.html` rounds it 9px / 7px. The 08-27 release listed page
   surfaces and never mentioned the mark, which is also on the packaging sleeves rendered this week, the
   icon set and the OG cards. Held; §5 of the ruling doc.

**Next is one route end to end**, not forty-six: build `/kits/testosterone` against the F frames to
prove the token set is complete before committing to the rest. It is already screenshot-baselined.

**What the next chat should pick up, in order of cost to leave**

1. ✅ **DONE 2026-08-29: the FAI sweep. It was EIGHT defects on live pages, not three, and the worst
   were not wording at all.** The three named here were real and are fixed. Grepping the
   ruling rather than the phrase found four more, because a grep for one phrasing
   ("more sensitive indicator") returns exactly the three sites that phrasing appears on:
   - 🔴 **`/kits/testosterone:219` and `/lp/hormone-recovery:242` rendered the FAI sample card with a
     `Borderline` verdict badge and, on the first, an amber bar** — the report-only ruling inverted on
     a public page, on a value sitting just above the lab floor of 35.0. This is the same defect K1
     (Keith, CA-034, 2026-08-12) fixed on `/lp/testosterone`; **two of the four Kit 1/3 sample cards
     were swept then and two were not.** A badge asserts the contradicted claim more loudly than a
     sentence does while containing none of the sentence's words, which is why the prose grep missed it.
   - 🔴 **`/faq` says the price buys "free testosterone via FAI"**, in both the rendered copy and the
     FAQPage schema. That is the free-T stand-in framing the ruling refuses, and it is also wrong
     about our own panel: Free Testosterone is calculated from Total T, SHBG and Albumin, and FAI is a
     separate report-only marker. **NOT FIXED: this is CA-026-approved copy and is on the escalation
     list below.**
   - **`04_products/kits/kit-3-hormone-recovery-check.md:75`** carried the identical
     *"Clinical picture beyond Total T"* cell that ruling C corrected in the Kit 1 spec on 2026-07-30
     and that was swept into kit-1 on 2026-08-12 and never into kit-3.

   - 🔴 **`/lp/testosterone` still rendered an amber `bg-statusWarning` bar at 20% under the FAI card,
     and it is the page every record cites as the FIXED one.** The 2026-08-12 fix removed the word
     "Borderline", restyled the badge grey and dashed, and left a nine-line comment ending *"styled grey
     and dashed so it cannot be mistaken for the Normal/Borderline verdicts its siblings carry"* — three
     lines above the bar that was still saying Borderline in colour, on a paid-ad LP. **Nothing textual
     could see it**: tsc passes, the copy scan passes because a bar has no words, and three STATE files
     cite this page as the corrected exemplar. Found by screenshotting it. The same one-of-two split was
     in `kits-F.html`, where one sample card used a verdict chip and 20% fill and the other, in the same
     file, already used the neutral chip and `bar none`.

   **All six unapproved surfaces now read from one source, `FAI_REPORT_ONLY` and `PANEL_MARKERS.fai`
   in `frontend/lib/kits/panel.ts`**, and the two already-correct surfaces were pointed at it too, so
   the four sample cards and three marker descriptions cannot drift apart again. `tsc` 0,
   `next build` 0, quiz regressions 22/22, rulings gate clean, compliance scan 0 HARD / 0 REVIEW on
   the changed copy, and **all four sample cards screenshot-verified at 1440 and a true 390**. The
   journey mockup `kits-F.html` was corrected with the pages, because a rebuild reading that frame would
   have put the retracted framing straight back.

   **Two carriers outside the pages, both found by widening the search past the prose:**
   - ✅ **`06_marketing/seo-ai-search/article-briefs/pillar-C-hub-free-androgen-index-shbg.md` is now
     SUPERSEDED-bannered.** It is the brief that produced the article the ruling was made about, it was
     never corrected (`last_updated: 2026-07-14`, `status: brief-ready`, no banner), and its whole frame
     is FAI-as-usable-testosterone right down to the title tag `Free Androgen Index: Your Usable
     Testosterone`. **`/article`'s first hard invariant is "if brief and skill disagree, the brief
     wins"**, so it would have reinstated the retracted framing on any redraft.
   - 🔴 **`frontend/content/blog/free-androgen-index.mdx` is a stale mirror and is NOT fixed.** The
     served copy is correct (checked against `blog_articles`: body and FAQ both carry the corrected
     framing, title *"what your number means, and the figure UK labs use instead"*). The repo MDX still
     has the **pre-correction title** and a **pre-correction FAQ block** calling FAI "a quick index of
     the free fraction", quoting a male band of "roughly 30 to 150", and saying it is "most informative
     when your total testosterone is borderline (8 to 12 nmol/L)". Not live, so no customer sees it, but
     it is a loaded gun for any re-seed or atomisation. Left alone deliberately: syncing an
     Ewa-reviewed article file belongs to `/publish-article`, not to this sweep. **Note the greps for
     those strings return zero** because the YAML folds them across lines; match on whitespace-normalised
     text.
   ⚠ **Working tree only, not deployed.**
2. **One confirmation line owed to Ewa**, on the new FAI/Albumin rows: her FAI approval is recorded as
   *"wording is fine for now"*, provisional, and was given for a post-purchase report rather than a
   public page.
3. **The two OG share cards**, and the scope question above.
4. 🔴 **Two blog consequences are now decisions, not caveats**, because `blog-F` is approved: the
   **dot pattern** has no F equivalent and the **hard offset block-shadow** is a statement of flatness
   F contradicts by design, so both leave the blog when F arrives. `blog-skin.css` is superseded in
   direction, still live, deleted only with the rebuild.
5. **Two handbacks from the chrome audit, both Keith's:** whether the absence of any nav or footer on
   `/auth/*` is deliberate (no `app/auth/layout.tsx` exists, and no frame states it), and a cleanup of
   five zero-reference components (`TrustBar`, `BiomarkerPanel`, `KitCard`, `SubscribeButton`,
   `AppPlaceholder`) plus an empty `components/lp/`.
6. **Two absences worth a decision, neither of them an undrawn surface:** there is **no `loading.tsx`
   anywhere**, so no route has a loading state and every navigation to a dynamic route holds the
   previous screen until the server answers; and **`/how-to-sample` is drawn (Frame AD) but has never
   been built**, which is the 404 situation in reverse.
7. **Where the rebuild starts.** Unchanged and still right: **design tokens first, not page by page.**
   The duplicated-fact backlog is the argument for that ordering, and this session added the strongest
   evidence for it, since the marker list had drifted on four of six hand-written surfaces.

**The method lesson from this session, which is worth more than any single frame.** The spine was
called complete twice and was wrong twice. **A frame list built from routes cannot see shared chrome,
because chrome is rendered by a layout and has no route**, and `results-F.html` shows it in miniature:
it enumerated twenty items of page chrome thoroughly and still missed the nav, one level above the
file it was reading. So: **enumerate the LAYOUTS, not only the pages**, take that list from the
framework's own composition mechanism, and run it backwards too, confirming every drawn component
actually exists. And **a completeness claim written from intent rather than from a re-run of the check
is not evidence**: one of the three wrong claims was written in the same pass that drew the frames,
and cost one grep to disprove.

---

**The finding, as written before it was closed:**

🔴 **CORRECTED 2026-08-29: THE SPINE WAS NOT COMPLETE. ELEVEN SURFACES WERE MISSING, AND ONE
LIVE PAGE DID NOT EXIST AT ALL.** Keith spotted the footer, then asked for a complete check. The
sweep stopped enumerating routes and enumerated every rendering file, every layout and all 75
components instead. **All 46 routes are covered; every gap is in the non-route layer**, because the
frame list was derived from the route tree and **shared chrome is rendered by a layout, so it has no
route and could never enter that list**. Full detail, tables and the rule it adds:
`design/journey-inventory.md`, the correction block above section 4.

- **Shared chrome, not drawn (5):** the **site footer** (111 lines, 25 routes); the **cookie-consent
  banner** (every route, the first thing every new visitor sees, and its equal-weight Accept/Reject
  is an ICO requirement recorded only in a code comment); **`Nav variant="app"`** (6 app routes);
  the **nav mobile drawer** (every route under 768px, no frame in any variant); **`SkipToContent`**.
- **Failure surfaces, not drawn (3):** `app/error.tsx`, `app/(app)/error.tsx`, `global-error.tsx`.
- ✅ **NO 404 PAGE EXISTED. BUILT 2026-08-29.** `find app -name "not-found*"` returns nothing, so every
  mistyped URL, dead inbound link and expired share currently serves **Next.js's default 404**: no
  logo, no nav, no footer, no route back in. **This is not a missing frame, it is a missing page,
  live now.** It is the one item here that is a build task before it is a design task.
- **Off-site brand surfaces, not drawn (2):** `app/opengraph-image.tsx` (the default share card, how
  every non-article link renders in WhatsApp, Slack, LinkedIn and X) and `api/og/blog/[slug]`.
- 🔴 **One frame drawn that does not exist:** `results-F.html` section 08 renders a footer with
  four links found nowhere in the codebase, on a layout that renders no footer. Keep as a proposal or
  cut, Keith's call.
- **One fact no frame states:** the `/auth/*` routes have **no nav and no footer** (there is no
  `app/auth/layout.tsx`), so a rebuild reading `auth-F.html` would probably add chrome that is
  currently absent. Worth one line confirming that is deliberate.
- **Dead code found by the same pass:** five zero-reference components (`TrustBar`,
  `BiomarkerPanel`, `KitCard`, `SubscribeButton`, `AppPlaceholder`) plus an empty `components/lp/`.

**Confirmed genuinely covered**, so the sweep is not all bad news: all 46 routes, the printed GP
handoff (Frame G, `print:` variants not an `@media print` block), the Google OAuth button with its
Microsoft-withheld note, `PasswordBanner`, and the ~20 blog components that are correctly off-board.

Everything below this paragraph was written before that correction.

🟢🟢 **THE SPINE IS DRAWN. THERE IS NO NEXT FRAME, AND THE NEXT MOVE IS A DECISION.**

Ten files under `design/mockups/journey/`, frames A through AD, **40 frames plus the 5 marker-card
variants**. Every screen a customer walks through is now drawn in Direction F's language:

| File | Covers |
|---|---|
| `../directions/F-field.html` | the homepage, chosen, hero film final |
| `results-F.html`, `results-states-F.html` | the results route, all four states plus the handoff |
| `membership-F.html`, `account-F.html` | the Stay stage: membership, account, subscriptions |
| `test-selector-F.html`, `kits-F.html` | Choose: the five-step quiz, `/kits`, three kit pages, the bundles-on state |
| `learn-F.html` | `/how-it-works`, `/about`, `/faq` |
| `buy-F.html` | `/checkout/details` with its six errors, `/order/confirmed` with its three states |
| `auth-F.html` | the AuthCard in four modes, its banners, `/auth/consent` |
| `act-F.html` | `/supplements`, the two product pages, the waitlist and its status route |
| `lp-sample-F.html` | the LP shell and its five hand-written pages, plus `/how-to-sample` |

`blog-F.html` was rebuilt and APPROVED 2026-08-29, so the blog adopts F (superseding `blog-skin.css`,
Keith 2026-08-27). The blog index and article are OFF the board, not outstanding.

⚠ **THE GATE KEITH SET ON 2026-08-26 IS SATISFIED FOR EVERY ON-SITE SURFACE, WITH THE TWO OG SHARE CARDS OUTSTANDING** (and it took two goes: on 2026-08-29 every page was drawn but eleven shared and failure surfaces were not, and there was no 404 page in the codebase at all. The 404 is built, `chrome-F.html` covers the rest, and the mockup now carries the pages AND the things on every page). His sequence was: *the mockup must first
carry the FULL JOURNEY, every screen the user sees mapped inside it, and only then does the app get
rebuilt against it.* It does. **Everything drawn up to and including `act-F.html` is APPROVED**
(Keith, 2026-08-28 and 2026-08-29); `lp-sample-F.html` was drawn after his last approval and is the
only file still unapproved. **The rebuild is unblocked on Keith's call and nothing starts it
automatically.**

### What the next chat should pick up, in order of cost to leave

Each of these came out of drawing the frames and none is a design task. All are Keith's.

1. ✅ **DONE 2026-08-29: the understated panel.** It was on **six** surfaces, not the two named
   here, and the worst was the pre-results dashboard calling a five-marker kit "the two markers". All
   six now render from `frontend/lib/kits/panel.ts`. ⚠ **Working tree only, not deployed.**
   🔴 **It left two things open, and the first is yours:** `/kits/testosterone`,
   `/kits/hormone-recovery` and `/lp/hormone-recovery` still carry the FAI framing the 2026-07-30
   ruling corrected in the spec and never swept into the pages, so those three now disagree with
   `/faq` and with the results engine. A `/decision-sweep` of an approved decision, claim reduction,
   no fresh sign-off needed; left for you because it touches a paid-ad LP. The second is one
   confirmation line owed to Ewa. Substance in the Learn entry in this file.
2. **Two route names describe what a reader would assume rather than what the page holds.** `/faq`
   is not an FAQ (no question-and-answer pair on it; its own schema object is `factsSchema`), and
   `/auth/consent` is not the health consent (age gate plus marketing opt-in; the CA-018 health-data
   consent is on `/checkout/details`, version-locked to `2026-06-23-v1`). **Rename or leave** is
   Keith's call. Substance in the Learn and auth entries in this file.
3. **Two behaviour questions.** The `/auth/signup` age field has `min={18}` and **no `required`
   attribute**, while the same eligibility fact is required on `/auth/consent` and enforced twice at
   checkout. And a signed-out visitor to `/supplement-waitlist-status` gets a **blank page**
   (`if (!user) return null`), where `/order/confirmed` redirects into a sign-in round trip.
4. **Is the Act stage worth rebuilding at all yet?** Its four routes are pre-decision: the supplement
   shop-front spec is SUPERSEDED IN DIRECTION (2026-08-24, adopted 2026-08-25, supplements demoted to
   a member-priced secondary shop). Substance in the Act entry in this file and in
   `01_strategy/STATE.md`.
5. **Where the rebuild starts.** The 2026-08-27 decision already answers it in principle: **design
   tokens first, not page by page.** 🔴 **Six duplicated facts found across the ten files are the
   argument for that ordering** and are the concrete backlog once tokens exist: three comparison
   tables of the same three kits (`/kits`, `/kits/hormone-recovery`, `/lp/hormone-recovery`); the
   A1 CA-026 standing claim rendered verbatim on both `/about` and `/how-it-works`; the four-step
   process card in four hand-written copies with three different step counts; the four shared FAQ
   questions across three kit pages; the marketing opt-in sentence on both `/auth/signup` and
   `/auth/consent`; and Dr Ewa presented six times. **The counter-example is `app/lp/layout.tsx`**:
   its compliance footer line lives in one file and serves five routes, and it is the only fact in
   the set that cannot drift.
6. **Two smaller open items from this session.** The meta row pinned to the card bottom in `kits-F`
   was NOT carried back to `test-selector-F` and belongs there if it is right. And a one-line
   clarification to **brand-guidelines 8.3** is proposed: separate **ambient** motion (the capped
   budget) from **reader-caused** response (an affordance that survives `prefers-reduced-motion`),
   because read strictly the current wording bans row highlighting on a table.

**Run the lifecycle check first, every time** (first ten lines of the entry file, grep `docs/` for
the route name, grep for inbound links). Four runs, two dead routes caught. **And grep the route for
feature-flag reads**, which is the fifth rule and the one this session earned: `isBundlesEnabled()`
was a whole second version of three pages and it does not look like a branch. Then enumerate before
drawing, and screenshot the live page beside the redraw.

**Verify with `node andro-prime/12_operations/automation/shot.js <path>?still=1 --theme both --full
--stamp`**, at 1440 and 390. Do not use `chrome --headless --window-size` for narrow widths: Windows
clamps the window to ~518px and crops the PNG, which produces a convincing picture of a broken mobile
layout that is not broken.

### Decided and closed, do not relitigate

| Decision | Answer | Where |
|---|---|---|
| Membership-only or app-wide | **App-wide** | Keith, 2026-08-27 |
| Which language survives | **Direction F's**: Geist, 28px squircle with a 22px concentric core, large low-opacity ambient shadow, luminance wash plus grain, full light and dark tokens | Keith, 2026-08-27 |
| Scope of the first pass | **Journey spine only**, roughly 45 frames; legal, ops, admin and auth-edge inherit | Keith, 2026-08-27 |
| Medium | **HTML canvas, not Figma** | Keith, 2026-08-27 |
| The blog | **ADOPTS F.** `blog-F.html` rebuilt against the detail the first draft missed, then **APPROVED**. `blog-skin.css` is superseded in direction, not yet deleted | Keith, 2026-08-27, reversed 2026-08-29 |
| F hero film pace | **Half speed, signed off** | Keith, 2026-08-27 |
| The frames drawn to 2026-08-28 | **APPROVED as the design record.** Design only: build still gated, CA-045 untouched, copy sign-offs unaffected, `blog-F` still not adopted | Keith, 2026-08-28 |

### Drawn so far (every one of these is APPROVED: six files Keith 2026-08-28, `kits-F` and `learn-F` 2026-08-29; the exception is `blog-F`, which is the record of a frame F lost and was never adopted)

- `design/mockups/directions/F-field.html` ... the homepage. **Chosen, hero film final.**
- `design/mockups/journey/blog-F.html` ... **REBUILT 2026-08-29 on Keith's ask**, six frames (AL to AQ):
  the article, **the twelve MDX components as a specimen sheet**, the two emphasis ladders side by side,
  the tail (ToC, FAQ, related, newsletter), the index and the author page. The first draft lost on
  2026-08-27 for **missing detail**, and the detail turned out to be nameable: the live blog is a
  twelve-piece editorial component system with a four-step left-rule ladder (4px grey, 4px, 6px, 8px)
  and the draft drew one rung of it. ✅ **APPROVED 2026-08-29.** The blog adopts F.
- `design/mockups/journey/chrome-F.html` ... **the shared chrome the other ten files assumed.** Frames
  AE (the site footer, 25 routes), AF (the nav in three variants), AG (the mobile drawer plus the
  scrolled state), AH (the cookie banner), AI (the 404, a record because it was built first), AJ (the
  three error boundaries, including `global-error` drawn unstyled on purpose) and AK (the skip link).
  Drawn 2026-08-29 after Keith spotted the missing footer. **Not yet approved.**
- `design/mockups/journey/results-F.html` ... results-present, GP referral in panel.
- `design/mockups/journey/results-states-F.html` ... `pre-results`, `no-results`, `sample-failed`, handoff.
- `design/mockups/journey/membership-F.html` ... **the frame the redesign started from.** Frames H
  (member), H2 (the four retest entitlement states as a row), I (the paywall), I2 (the three paywall
  headings as a row) and J (the offer shut, both variants). Drawn 2026-08-28.
- `design/mockups/journey/account-F.html` ... Frames K (`/account`, including both flag-dark
  sections), K2 (the nine order statuses plus the empty history), L (`/subscriptions`), L2 (the six
  status badges) and M (the retired route as a note). Drawn 2026-08-28. **The Stay stage is closed.**
- `design/mockups/journey/test-selector-F.html` ... Frames N (the page), N2 (the three questions),
  N3 (the price study), N4 (the reveal and the email capture). Drawn 2026-08-28.
- `design/mockups/journey/lp-sample-F.html` ... Frames AC (the LP shell and the variance table
  across five hand-written landing pages) and AD (`/how-to-sample`, the only genuinely new page
  in the set). Drawn 2026-08-29. Not yet approved. **This file closes the spine.**
- `design/mockups/journey/act-F.html` ... Frames Z (`/supplements`), Z2 (the two product pages
  as one skeleton), Z3 (the waitlist form's five states), AA (`/supplement-waitlist`) and AB
  (`/supplement-waitlist-status`, including the blank signed-out state). Drawn 2026-08-29.
  **APPROVED 2026-08-29.** 🔴 **Pre-decision: the supplement strategy moved on 2026-08-24.**
- `design/mockups/journey/auth-F.html` ... Frames X (the AuthCard in login mode), X2 (its four
  modes as a row), X3 (the message and error banners) and Y (`/auth/consent`, which is an age
  gate plus a marketing opt-in). Drawn 2026-08-29. **APPROVED 2026-08-29.**
- `design/mockups/journey/buy-F.html` ... Frames V (`/checkout/details`), V2 (its six error
  strings and the submitting state), W (`/order/confirmed`) and W2 (its three renderable
  states). Drawn 2026-08-29. **The Buy stage is closed. APPROVED 2026-08-29.**
- `design/mockups/journey/learn-F.html` ... Frames S (`/how-it-works`), T (`/about`) and U
  (`/faq`, which is not an FAQ). Drawn 2026-08-29. **The Learn stage is closed. APPROVED 2026-08-29.**
- `design/mockups/journey/kits-F.html` ... Frames O (`/kits`), P (`/kits/testosterone`), P2 (the
  bundles-on hero and close, shared by all three kit pages), Q (`/kits/energy-recovery`) and R
  (`/kits/hormone-recovery`). Drawn 2026-08-28. **The Choose stage is closed. APPROVED 2026-08-29.**

**The results route is complete, and `/membership` is now drawn.**
`design/journey-inventory.md` is the frame list for the rest.

### 🔴 THE NEXT FRAME WAS WRONG: `/activate` IS A DEPRECATED ROUTE (found 2026-08-28)

The handoff chose `/activate` because it ships **three full error screens** the live app already
serves: `not-found`, `wrong-account`, `already-activated`, explicit branches at
`app/activate/page.tsx:124`, `:145`, `:163`, plus the form and the success state. Five frames.

**They are five frames of a flow Keith scrapped on 2026-06-12.**
`docs/2026-06-12-activate-qr-deprecation.md` retires the login-gated per-order kit-activation flow,
and the first line of `app/activate/page.tsx` says *"Do not extend."* The replacement is a single
generic no-login "how to take your sample" page behind a QR printed identically on every kit insert.

**Four of the five frames do not survive the replacement.** The sign-in form and all three error
states exist ONLY because a per-order kit code is matched against a logged-in account; with no login
and no order ID there is no not-found, no wrong-account and no already-activated. What survives is
the instruction content, as one generic page.

Verified 2026-08-28: `/how-to-sample` does not exist anywhere in the codebase, and **nothing in
`app/`, `components/` or `lib/` links to `/activate`** — it is served but unreachable, and the doc
records that no per-order QR was ever printed, so it never had a way in.

🔴 **The rule this adds, and it belongs beside the other four: read the route's DECISION
HISTORY before drawing it, not just its code.** The inventory verified the three error branches
existed, which was true, and that verification is what made the frame look safe. A route can be
live, correct and fully enumerated while already being scheduled for deletion; the tell is never in
the JSX, it is in a decision doc and a header comment. `design/journey-inventory.md` is corrected:
Activate is **1 frame, not 5**, and the total is **≈41, not ≈45**.

✅ **KEITH ANSWERED, 2026-08-28: membership in F.** Drawn as
`design/mockups/journey/membership-F.html`, five frames, verified by screenshot at 1440 in both
themes and at a true 390. It carries all 24 enumerated parts of the live route and restores two
things from `membership-first-cycle.html` that the build never had: **Ask the clinician in its
POPULATED form** (the live page only ever renders the empty state, so the block has never been seen
holding anything, and the "answered by a registered clinician, published to all members" by-line is
the part that keeps it on the right side of the line) and **the MEMBER chip** in the status strip.

**Three things inside it are judgement calls, stated in the file's header so they can be overruled:**

1. 🔵 **The route joins the DASHBOARD'S SHELL** rather than keeping its own narrow centred
   column. Drawn as two different shells, a member crossing from `/results-dashboard` to
   `/membership` crosses a border, which is the complaint that started the app-wide decision.
2. ⛔ **SUPERSEDED THE SAME DAY, see the colour ruling below: status colour IS spent on this route.**
   The original reasoning, kept because half of it still holds: a
   green adherence bar reads as a health verdict on a chart whose own legend says it is not one, and
   the one number's interpretation lives on the results card with its provenance beside it. Restating
   that verdict in colour alone would be the same claim with none of the evidence attached.
3. 🔵 **Three things from the prior mockup were deliberately NOT drawn**, each for a stated
   reason: the supplement member-price row (no delivery path, and the paywall list already lost kit
   discounting on 2026-08-26 for the same reason), next year's two-panel upgrade (belongs to the
   retest purchase flow, and its GBP 60 top-up is unverified), and the two-range card plus the marker
   list (already drawn in `results-F.html`; drawing them twice is how two frames start disagreeing).

🔴 **REWORKED SAME DAY, after Keith saw it: the bars, the trend rail and the energy chip were
flat, "particularly when you view it with a light background".** He is right, and the honest reading
is that **refusing status colour was doing duty as a substitute for designing, rather than as a
constraint to design within.** Flat ink on white is not restraint, it is an unfinished drawing. Fixed
structurally, in ink only, with no colour added:

- **The trend rail was two dots on a hairline.** It drew the two ENDPOINTS and left out the only part
  that changes: where he is between them. It is now a track that runs first-result to retest, solid
  for the time already logged, ticked for the wait, with a tick at today on the boundary. It advances
  by itself every day the page is opened, which is the aliveness rule rather than a decoration of it.
- **The adherence chart was twenty two identical slabs on bare paper.** It was the one element on the
  page with no material under it, and every bar carried the same weight, so a row with a real story
  in it was drawn as though none of it mattered. It now sits in a sunk well, and **weight encodes the
  streak**: streak days full ink, earlier days lighter, a missed day a hollow outlined slot.
- **The energy chip was a bare numeral.** Five segments with three filled are seen rather than
  decoded.
- **The pulse moved off the status strip and onto the chart**, because the newest thing on this page
  is today's log, not the header. Still one pulsing element per screen, per brand-guidelines 8.3.

✅ **THEN KEITH CALLED IT AGAIN, SAME DAY, AND THIS TIME EXPLICITLY: "we need color added to the
line graph and bars and the buttons."** Done. **The no-colour argument was half right and half an
excuse.** The half that was right: a hue that says "good" beside a health brand has to be tied to
something true. The half that was an excuse: treating "no colour" as the safe default, when refusing
a device is not the same as handling the risk it carries.

**Each colour is now attached to a fact the page already states in words**, which is the test that
matters rather than the presence of a hue:

| Element | Colour | What it is tied to |
|---|---|---|
| Trend rail fill, and the ring on the reading | `--warn` | The MARKER's band. Vitamin D at 31 is low on the engine's own bands, which the card says in words two lines above. When he retests into range the fill is green. |
| A `LOW` pill beside the reading | `--warn` tint, ink text | The same badge treatment as the results card, and the band is a WORD first. |
| Adherence bars | `--ok`, streak at full strength | Logged or not logged. The legend now reads "Green is a day you logged, nothing more" in the same breath as the colour. |
| Check-in chips, energy segments | `--ok` tint plus a full-strength border | Done or not done, an affordance state. |

🟢 **The hues were NOT re-picked**: they are the ones already in `styles/tokens/colours.css`, already
permitted by `app-theme.css` inside the authenticated app, copied unchanged from `results-F.html`,
with the lighter dark-mode ends for the same reason that file gives. Chroma is spent by area, and
colour is never the only carrier: the band is also a word, the streak is also a rule and a count, a
missed day is also a hollow outline. ⚠️ **The primary CTA stays black.** Inverting the brand's
primary action to a status hue is a system-wide call, not a frame-level one, and it is not made here.

🔴 **And one caught only by screenshotting it: the pulse was first put on today's BAR, so a
still frame showed that bar faded, which on a chart where weight carries meaning reads as a partial
day.** A data mark cannot be the thing that breathes. The bar is solid and a cap above it carries the
motion. [[observation-473]]

⚠️ **The mockup's own numbers contradicted each other in the first draft** and are now one set: a 22
day window, 20 logged, 2 missed, the last 9 unbroken, Day 22 from a 14 August result, so the retest
on 22 October is 48 days out and a join today dates the first retest 3 December.

✅ **AND THOSE ARE DONE TOO (2026-08-28), which closes the Stay stage.** `account-F.html` carries
`/account` and `/subscriptions`. Three findings worth carrying forward:

1. 🔴 **`/founding-member-status` is RETIRED** (2026-07-22): the whole file is
   `redirect('/account')`, the join API 410s and `founding_member_list` holds no rows. **That is the
   second route in two sessions that the inventory scheduled for drawing while a header comment had
   already retired it**, after `/activate`. Both were caught by the same ten-line read. The lifecycle
   check is now the first thing that happens on any route, not a thing that happens if someone
   remembers. The stage is 5 frames, not 6, and the total is ≈40.
2. 🔴 **Opening `/subscriptions` IS the cancel-intent signal.** The page calls
   `markViewedCancelPage`, which flags the Customer.io profile, feeds segment 20 and enrols the
   customer into **seq-05 churn-prevention**. So it is a retention surface whether it looks like one
   or not, and the drawing has to carry that: the empty and cancelled states must not read as an exit
   sign, and **"Manage billing" leaves for Stripe**, which is the one place in the signed-in app
   where the design system stops. ⚠️ **Proposed on the frame and NOT on the live page: a "what stops
   if you cancel" block**, because it is the one thing on that screen that could change the decision,
   and the churn sequence is currently left to make that argument by email a day later.
3. ⚠️ **Two live bugs found while enumerating, both drawn as they are rather than quietly fixed.**
   A cancelled or refunded order still shows "Awaiting results" in its action column. And the six
   subscription statuses all render as the same black or white slab, so "Payment due", which the
   customer can fix in a minute, looks identical to "Cancelled", which they chose.

⚠️ **The data and privacy wording on `/account` is NOT signed off.** `DataPrivacySection` is dark
behind `ACCOUNT_DATA_CONTROLS_ENABLED` pending a compliance read of the data-use statement and Keith
confirming the erasure ops-alert address and the 30-day SLA. It is drawn, because a flag-dark surface
nobody has looked at is exactly where a redesign loses things, and the frame label says so.

✅ **AND `/test-selector` IS DRAWN (2026-08-28), which closes the last "estimated, not read" item on
the inventory.** `test-selector-F.html`, frames N to N4. **The estimate was low, and this is the
first correction that moves the frame count UP rather than down.**

1. 🔴 **THE QUIZ IS FIVE STEPS, NOT THREE, AND THE TWO NOBODY HAD WRITTEN DOWN ARE THE TWO
   THAT CARRY MONEY AND CONSENT.** Step 4 is a four-question **Van Westendorp price study** plus an
   age band, shown with the recommendation and deliberately **without its price**. Step 5 is the
   price reveal plus an **email capture** with four states and an **unticked consent box**. Q1 also
   has four options, not three.
2. 🔴 **THERE IS NO KIT PAGE TEMPLATE.** The inventory said "one template, three kits". There
   is no `[kit]` dynamic route: three hand-written pages of 530, 882 and 463 lines sharing only leaf
   components, and the longest is nearly twice the shortest. **That is 3 frames rather than 1, and it
   is real work nobody had scheduled.** The Choose stage goes 6 to 10 and the total goes 40 to ≈44.
3. ⚠️ **Sizing a component from its route name is what hid both.** A route called `/test-selector`
   looks like a quiz; nothing in the name can show a price study or an email capture. The same method
   produced "one template" from a URL shape that has no template behind it.

⚠️ **Three things in the quiz are APPROVED and a redesign must not disturb them:** the scoring map
(2026-05-18, updated 2026-05-26 and 2026-08-12), the Q1 wording, which was **split rather than
reworded** for CA-033 because a fatigue reader was being routed to a testosterone-only kit, and the
fact that **the display letter is not the stored value**. 🔴 **And no price of ours may
appear on step 4** (`07_sales/funnel/site-funnel-model.md` §4): the Van Westendorp read is only clean
un-anchored, and putting the price on a recommendation card is exactly what a designer would do by
reflex.

✅ **COLOUR AND THE STEP NUMERAL, second pass, same day.** Keith: *"we need some color in the bars
and also all the sample posts done ... the boxes need to get highlighted and maybe in the background a
number. So the original number disappears and in the background it says one or two. A stylish one.
And then when they move it to two, it pops out."* Four changes, all in `--flag`, so the page still
spends exactly one accent: the **progress bar** fills amber with a dark leading edge; the **four
Order / Sample / Post / Done cards** get the big background numeral back, which is an idiom the live
page already owns and which ties those four to the quiz; the **option boxes** highlight on hover and
on choice; and the **step numeral** replaces the "Question 1 of 3" counter as the visual carrier and
pops on change. The counter survives as a visually hidden label, because a decorative glyph cannot be
the only thing telling a screen reader where it is.

✅ **THE ORDER / SAMPLE / POST / DONE ROW, third pass.** Keith: *"when you scroll across or when you
land on one of the boxes, [it] is highlighted or brought out ... the numbers in the background need to
be situated so you can actually see the number ... when you hover over it, the number in the
background appears and the number in the left-hand corner of that panel disappears ... we need to
introduce some activity."* Two faults and one gap, all fixed:

- **The numeral was bled off the corner**, so what showed was a sliver rather than a digit. It now
  sits fully inside the card, right side, vertically centred, at a size that fits rather than one
  that has to be cropped.
- **Nothing happened when you were on a card.** On hover the corner "01" fades out, the big numeral
  fades in behind the text, the border goes amber and the card lifts 3px. One number, two sizes, so
  nothing is lost in either state and the swap stays decorative rather than load-bearing.
- 🔴 **HOVER DOES NOT EXIST ON A PHONE**, and his other half sentence is the answer: under
  `(hover:none)` the card nearest the middle of the viewport takes the same treatment as you scroll,
  so the row is alive on touch without anyone tapping. Same class, two triggers. Verified by driving
  it: active card index moves 0, 1, 2, 3 down the scroll, and the resting numeral sits at .14 there
  rather than 0 so a no-hover card is never left empty.

✅ **FOURTH PASS: THE NUMERAL IS AN OUTLINE NOW, because the fill was a real legibility fault.**
Keith: *"there's definitely a clash going on between the grey and the pastel colour. We need a
solution."* He is right, and it measures: body copy reads **8.24:1** on paper and **6.41:1** where it
crossed the filled numeral, a 22% drop across the whole overlap. Every obvious lever made it worse.
Fading the number back is what he had already rejected. Shrinking it forfeits the effect. Moving it
has nowhere to go, since the card is a heading, a paragraph and a footer row. Reserving a gutter
would leave the paragraph about 150px wide on a four-across grid.

🟢 **So change what the glyph is MADE OF.** An outline carries a fraction of the ink of a fill, so
what passes under a letter is a 2.5px line rather than a solid field: contrast off the stroke is back
to **8.24:1**, and because the coverage is so low the stroke can run far stronger than the fill could,
which means **the number is more visible than before while clashing less**.

🔴 **AND DARK MODE NEEDED A COMPLETELY DIFFERENT NUMBER, which is the part worth remembering.** In
light the body copy is dark and the stroke is light, so they separate on their own. In dark **both are
light**: `--ink-2` is `#B9BDC4` and the stroke is `#E0A458`, so a letter sitting on a stroke measured
**1.66:1**, which is unreadable. The token flip does not save you here, because the decoration keeps
its hue in both themes while the text inverts. Every opacity is now set at the measured point where
text crossing a stroke stays at or above 4.5:1: **light .75 (4.66:1), dark .30 (4.83:1)**, with the
no-hover resting states and the quiz numeral capped the same way (**quiz dark .45, 5.97:1**).
[[observation-476]]

✅ **GAUGE, fifth pass.** Keith: the outline was too thick. Stroke down from 2.5px to **1px** on the
step cards and 3px to **1.5px** on the quiz numeral. ⚠️ **A first attempt also dropped the font
weight from 900 to 400**, on the reasoning that an outlined heavy letterform traces two lines far
apart and reads as a bubble. That was correct about the cause and wrong as an answer: he asked for a
thinner OUTLINE, not a different numeral. *"I just needed you to make the outline of the numbers
thinner."* The weight is back at 900. **The lesson is narrow: when a note names one property, change
that property.** A better-reasoned change to a second property is still a change nobody asked for,
and it costs a round trip to undo.

🟢 **One card in the file is INTERACTIVE, and that is deliberate.** What was asked for is a
transition, and a transition cannot be judged from a still or from a description. The demo card runs
the three approved questions so the numeral and the bar can be watched moving; it routes nowhere,
because the scoring map is approved logic and is never reimplemented in a mockup. Verified by driving
it: numeral 1 to 2 to 3 to 4, bar 33.3 to 66.7 to 100, option counts 4, 2, 3.

🔵 **COLOUR ON MARKETING IS A DIFFERENT ANSWER ON PURPOSE, and it may need Keith's call.**
His 2026-08-28 ruling holds where colour is sanctioned, which `app-theme.css` limits to the
authenticated dashboard, never a marketing page. So this frame carries no status colour. What it does
carry is the **one accent the approved homepage already spends**, `--flag` #E0A458, on the two "this
is the one" moments: the reader's recommended kit and Kit 3's default-route chip. **If he wants more
colour than that on marketing, it is a brand-guidelines change rather than a frame change**, and it
should be made there so the homepage and the blog move with it.

🔵 **NEXT, and not yet Keith's call.** Left on the spine: **`/kits` and the three kit
pages** (the rest of Choose, and now the biggest single block of work on the board), **Learn** (3),
**Buy** (2) and the **five auth frames**, where `/auth/consent` carries approved health-data
processing copy under CA-018. Plus the two carried items: **blog dark mode** (81 hardcoded colours,
and the no-regret half is tokenising them) and **`/how-to-sample`**, the sanctioned replacement for
the deprecated `/activate`.

### The rules this work earned, in order of how much they cost to learn

1. 🔴 **Enumerate the live page's components BEFORE redrawing, and screenshot the two side by side.**
   A redraw is scored against what it replaced, never against itself. The blog draft silently dropped
   six things and looked finished doing it. [[observation-467]]
2. 🔴 **When a legibility complaint names colour, check the TYPE in the same pass.** Keith reported
   the range bars as flat. Chroma was part of it; 10.5px letterspaced uppercase mono sitting on the
   4.99:1 contrast floor was the larger fault and nobody pointed at it.
3. 🔴 **Motion decorates aliveness; change over time IS aliveness.** The pulse on the waiting screen
   is the bonus. Timestamps, an expected-by date and step-keyed cards are the mechanism, and they are
   what survives `prefers-reduced-motion`, which matters because that group skews toward the ICP.
4. 🔴 **Read the prior art before producing.** `membership-first-cycle.html` screen 1 carried a
   two-range track, a legend, a provenance footnote and the Ewa attribution, none of which are on the
   live page. Drawing from the live page alone would have lost all four.
5. 🔴 **A route's states are not only its JSX branches: grep it for flag and environment reads.**
   `isBundlesEnabled()` is a `const` at the top of each kit page, consumed by two ternaries 300 lines
   apart, and it is a whole second version of three pages. Reading for conditional rendering finds
   none of it.
6. 🔴 **A route's line count measures its wrapper, not its surface.** `/checkout/details` is 80
   lines around a 177-line form holding six error strings and the consent gate; `/test-selector` was
   thin around a 514-line quiz. Follow one level of imports before estimating anything.
7. 🔴 **Open the file. Structure inferred from a route name is wrong in BOTH directions.** This
   inventory guessed four times and was wrong four times: `/kits`, `/supplements` and `/lp` all
   claimed a template that does not exist (three hand-written pages, two hand-written pages, five
   hand-written pages), while the five auth routes turned out to be one component in four modes.
   There is no correction factor to apply, because the errors do not share a sign.
8. 🔴 **Read the route's DECISION HISTORY, not just its code, and that means `docs/`.** The Act
   stage's four routes are alive, correct and pre-decision: the strategy that governs them moved on
   2026-08-24 and nothing in the code says so. The same check caught `/activate` and
   `/founding-member-status` as dead routes. **Four runs, three finds.**

### Standing constraints that bite on every remaining frame

- **Status colour is sanctioned in the authenticated dashboard ONLY** (`app-theme.css`), on range-bar
  fills and status dots, never on text, backgrounds or borders, and never on a marketing page.
- **Motion budget is one pulsing element (opacity only) plus one load reveal**, per brand-guidelines
  8.3. Spend it once per screen or not at all.
- 🔴 **Never draw the `high-testosterone` or `high-vitamin-d` cards.** Their copy is CA-044 and Ewa
  has not approved the wording. **A redesign must not launder unapproved copy into looking finished.**
- **CA-045 arms the moment any of this reaches a live page.** Nothing is owed while it is a mockup.

### Open, and not started

1. **Blog dark mode.** Assessed, sequenced, not built. 81 hardcoded colours across seven files; the
   blocker is that the blog shares `<Nav>` and `<Footer>` with the light-only marketing shell.
   **The no-regret half is tokenising those 81 colours**, which the F migration needs anyway.
2. ✅ **CLOSED 2026-08-28.** The quiz states were read: five steps, not three.
3. ✅ **CLOSED 2026-08-28.** `/subscriptions` and `/account` are enumerated and drawn;
   `/founding-member-status` turned out to be retired.
4. ✅ **CLOSED 2026-08-28.** `membership-first-cycle.html` is redrawn as `membership-F.html`.
5. 🔵 **NEW: `/kits` and the three kit pages**, which is the rest of Choose and the biggest block left.
6. 🔵 **NEW: `/how-to-sample`**, the sanctioned replacement for the deprecated `/activate`. Unbuilt,
   and it needs a video that does not exist, so it is product design as much as redraw.
7. 🔵 **NEW, and it may need Keith: colour on MARKING pages.** `app-theme.css` permits status colour
   in the authenticated dashboard only, so the marketing frames carry only `--flag` amber, the one
   accent the approved homepage spends. More than that is a brand-guidelines change, not a frame
   change.

## 🟢 DECIDED: the redesign is APP-WIDE, driven from the mockups (Keith, 2026-08-27)

**Keith, 2026-08-27:** *"My decision is that we are going to do an app-wide redesign from the
mock-ups."* **This answers the fork that has gated the membership work since 2026-08-26.** It is not
a membership-only redesign. Every surface a customer sees is in scope, and the mockup carries the
complete journey before any of it is built, which is the sequence he set and has not changed.

**What prompted it: he noticed the live site speaks in more than one voice.** His words, that there
are differences between *"the marketing, the apps and results, and there's a third one where I can't
remember what it is right now."* **The third one is the BLOG.** There are three deliberately
different design languages in the codebase today, each with its own file saying so in its header:

| Language | File | What it is |
|---|---|---|
| **Brand** | `styles/themes/brand-theme.css` | Marketing and canonical site. ~~Black and white only, **no radius, no shadows**~~ **superseded 2026-08-29**: the token layer carries Direction F (radius scale, `--amb`, ink ramp, four surfaces). Inter headings over Merriweather serif body still stands. |
| **App** | `styles/themes/app-theme.css` | Dashboard and results. **Status colours permitted here and nowhere else**, plus a motion carve-out (one pulsing live dot, one load reveal) under brand-guidelines 8.3. |
| **Blog** | `styles/base/blog-skin.css` | Editorial / lab-manual. Cream surface and a hard offset block-shadow, **deliberately breaking two brand non-negotiables**, namespaced so it cannot leak. |

**A fourth exists on paper only:** the membership mockup language (1px hairlines, a single 400px
framed device, JetBrains Mono numerals, full light and dark tokens), which is what the 2026-08-26
diagnosis found the build had failed to adopt. And direction F is arguably a fifth (Geist, 28px
squircle with a concentric inner core, large ambient shadow, light and dark tokens).

⚠️ **So the honest count is three shipped languages and two proposed ones, and an app-wide redesign
means choosing one and rewriting the rest against it.** Each of the three was a reasonable local
decision with a documented rationale; none was wrong on its own. **That is precisely why nobody
caught the divergence: every file justified itself, and no artefact was responsible for the whole.**

**Route inventory taken 2026-08-27: 46 `page.tsx` routes**, of which the customer journey spine is
roughly twenty and the rest are legal, auth, ops and admin surfaces that can inherit rather than be
drawn.

✅ **THREE FOLLOW-ON DECISIONS, all Keith, same day.** (1) **Direction F's language becomes the
app-wide system**: Geist, 28px squircle with a 22px concentric inner core, very large low-opacity
ambient shadow, luminance wash plus film grain, full light and dark tokens. Marketing is therefore
settled and the app follows it, rather than the two being reconciled. (2) **The first mockup pass is
the JOURNEY SPINE only**; legal, ops, admin and auth-edge surfaces inherit the system rather than
being drawn. (3) **The medium is an HTML canvas, not Figma** — all frames on one pan-and-zoom page,
so contrast, overflow and dark mode are testable rather than drawn, and the tokens become the actual
CSS variables with no translation step.

✅ **STEP 1 IS DONE: `design/journey-inventory.md`**, the frame-by-frame inventory the mockup gets
built from. **≈45 frames** across nine journey stages. Two findings worth carrying:

- **The 29 result states in `lib/results/biomarker-copy.ts` are CARD VARIANTS, not screens.** The
  mockup needs the marker card in five band postures (low, normal, optimal, high, critical GP-block);
  the rest is copy inside the same shape. Reading that number as 29 screens would have inflated the
  job by an order of magnitude.
- **Light and dark is a token flip, not a redraw**, so it does not double the count. It does mean
  every frame must be CHECKED in both, which is the argument for the HTML canvas over a drawing.

✅ **THE BLOG QUESTION IS ANSWERED: `blog-F.html` REBUILT AND APPROVED 2026-08-29.** The blog adopts Direction F. Kept below as the record of how it was put to him:
`design/mockups/journey/blog-F.html`, article and index frames, verified at 1440 in both themes and
at 390. Keith's words: *"I'm a visual person... I have to see it first before I can make a
decision."* Which is the right instinct here, because what is at stake is READING and reading cannot
be judged from a description.

**The one judgement call inside the draft, stated so it can be overruled: prose sits on the ground,
trays hold everything that is not prose** (the stat panel, the FAQ, the index cards). F's grammar is
a tray holding DATA; 2000 words in a tray reads as a widget and costs measure on a phone. That is the
honest translation of F rather than the literal one.

🔴 **The draft first dropped a real asset and it was caught by screenshotting the LIVE page beside
it: the blog carries a "REVIEWED BY DR EWA LINDO, GMC-REGISTERED GP" credential block.** It is the
E-E-A-T signal and the visible half of the sign-off every article goes through. Restored before the
draft was shown. **The general rule for the whole redesign: screenshot the live page next to the
redraw, because a restyle drops load-bearing elements silently and a redraw always looks complete on
its own terms.**

**What the comparison actually shows**, live against F: an ALL-CAPS condensed headline becomes
sentence case; Merriweather serif body becomes Geist at 19px over roughly 68 characters; the cream
dot-grid ground becomes the luminance wash; the hard offset block-shadow becomes hairlines and
ambient shadow; and the blog gains a dark mode it has never had.

🔵 **STILL OPEN:** the other three inventory items (test-selector quiz states unread; no enumerated
states for `/subscriptions`, `/account`, `/founding-member-status`).

## ⚠️ THE IMAGERY GATE WAS FILED UNDER THE WRONG RULE, and it is CA-045 now (2026-08-27)

🔴 **"CA-039 pre-flight" was wrong in ten places across this file and the six direction mockups.**
**CA-039 is the public media bucket rule** ("what may never enter it"), approved by Keith on
2026-08-17, ClickUp [`869ek4a8y`](https://app.clickup.com/t/869ek4a8y). It governs the Supabase
Storage `content` bucket that Metricool fetches from unauthenticated, and its own text puts this
asset outside it: *"rendered marketing media only... site chrome stays in `frontend/public/`"*. A
homepage hero film is site chrome. **The bucket rule has nothing to say about it and never did.**

**How the label got there, because the original was right.** `design/homepage-direction-brief.md`
says three separate things in three sentences: nothing may imply a clinical service, treatment or
result; CA-039 governs the bucket; and anything promoted to a live page needs a pre-flight. Later
sessions compressed that into "CA-039 pre-flight", welding a storage rule onto an imagery gate.
**The general shape: a compressed citation keeps the authority of the thing it cites and loses the
scope**, and it then reads as more precise than the sentence it came from.

✅ **The gate itself is real and is now CA-045**, open on Approvals & Sign-offs
(`901219880207`). It fails the Keith-only entry test at question 2, a homepage hero is
customer-facing copy, so it does not go on the Keith-only board.

**Scope:** F's hero film and poster (`assets/f/`) plus the five generated photographs F inherits from
D (`assets/d/img-1..5`). **Nothing is owed while it is a mockup**; the gate arms when a direction is
built into the site.

**Four of the five judgement questions are already evidenced** on a full-resolution frame: no people,
no hands, no clinic, no blood, no sample; nothing user-derived, it is model-generated; no copy
rendered into the image, the sheet carries no letterhead, logo, heading, numbers or readable words at
2x. ⚠️ **The fifth is the whole risk and is a judgement, not a check: does an illegible letter on a
kitchen table read as a lab result?** That is claim-adjacent, so the entry test's "unsure means route
up" points it at Ewa rather than Keith alone.

**The scanner will not answer it.** `compliance-preflight/scan.js` reads copy and this asset has no
words. Record it N/A with the reason and substitute the judgement pass, exactly as CA-039's own
record did on the same problem.

## ✅ RESOLVED: commit `8c8066f` reached origin (2026-08-27)

**It is on `origin/main`, verified with `git branch -r --contains 8c8066f`, and local and origin are
level at 0 ahead / 0 behind.** The push happened after the entry below was written and nobody came
back to update it, so the blocker read as live for several hours after it had gone. **The lesson is
the general one about negative claims**: "not pushed", "not built", "nobody has asked" all decay
faster than any other kind of recorded fact, and re-testing one costs a single command. Re-run the
check before quoting a blocker, and prefer naming the command that would clear it over asserting the
absence.

**Original entry, kept for the record:** the homepage-directions work was committed but not on origin,
because `git push origin main` was denied by the permission classifier at wrap and the denial was not
worked around.

```
git log --oneline origin/main..HEAD     # expect: 8c8066f
git push origin main
```

**When it lands: no served change is possible.** Zero paths in the commit are under `frontend/`, so a
Coolify build will run and serve nothing new. Report it as "a deploy ran and contained no live-served
change", never as "nothing deployed", and do not hunt for a canary that cannot move.

**Contents:** 19 files, +4526/-1014. Six homepage directions plus `picker.html` and
`assets/{d,e,f}/`, the reconciled brief, and the four STATE entries below.

**Also left dirty in the tree, deliberately, from another session:** the `02_brand` packaging sleeve
renders, `.thresholds.md.bak`, `.site-funnel-model.md.bak`, `.tmp.driveupload/` and
`.claude/skills/web-design-guidelines/`. None of it is this session's and none of it was staged.

**One known em dash survives in this file**, inside the 2026-08-26 membership block. Verified
inherited, not introduced: the identical fragment is on the removed side of the diff, and it only
moved because the `_Last updated:` line was prefixed. It belongs to that entry's author.

## F's hero film replaced with Keith's own take, same treatment reapplied (2026-08-27)

🔵 **Keith found an error in the shipped clip and generated a replacement himself**, Higgsfield asset
`ed970bc9-ba07-4897-ab7e-b37da64614b9`, and asked for the same treatment plus the music stripped.
Then, seeing it in the page, he asked for it slowed. **Final: `assets/f/table.mp4` is 709 KB,
15.46s, half speed, silent**, and `assets/f/poster.jpg` is **98 KB** from the loop's own first
frame. Verified in the page at 1440 in both themes.

**The treatment is the same command, only the numbers move.** Source is 8.04s, 1280x720, 24fps, and
it arrived **with an AAC track**, which `-an` removes. Full chain as shipped:

```
# 1. slow to half speed, interpolating rather than duplicating frames
ffmpeg -y -i rawD.mp4 -filter_complex "[0:v]setpts=2.0*PTS,minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1[v]" -map "[v]" -an -c:v libx264 -pix_fmt yuv420p -crf 20 -preset medium slow-mci.mp4

# 2. crossfade the tail back over the head, strip audio, encode for the web.
#    The two trim points are DURATION and DURATION MINUS 0.5s. Recompute both
#    for any new source; they are the only numbers that move.
ffmpeg -y -i slow-mci.mp4 -filter_complex "[0:v]setsar=1,split[a][b];[a]trim=0:15.458333,setpts=PTS-STARTPTS[base];[b]trim=15.458333:15.958333,setpts=PTS-STARTPTS,format=yuva420p,fade=t=out:st=0:d=0.5:alpha=1[tail];[base][tail]overlay[v]" -map "[v]" -an -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 31 -preset slow -movflags +faststart table.mp4

# 3. poster from the loop's OWN first frame, so there is no jump on takeover
ffmpeg -y -i table.mp4 -frames:v 1 -q:v 3 poster.jpg
```

✅ **THE CROSSFADE IS EASIER ON THIS CLIP, AND THE REASON IS WORTH KEEPING.** Nothing hard-edged moves
in it: mug, sheet and glasses sit still and only the light travels, so the dissolve has a lighting
change to hide and no object to double. That is exactly what the previous clip could not do, and why
that one needed the bookend (same still as `start_image` and `end_image`). **This one needs no
bookend**: half a second of dissolve brings the last frame to within **3.68** of the first, against
the rubric already in use, under about 4 is invisible. The general rule that falls out: **a crossfade
loop is cheap when only light moves and expensive when objects move**, so check what moves before
reaching for the upstream fix.

🟢 **IT WAS TOO FAST, AND HE CALLED IT, WHICH IS TWICE NOW ON THIS HERO.** As generated it ran about
four times faster than the clip it replaced: light **4.7 to 6.0**, vapour **4.5 to 15.9**, against
the previous clip's light **0.3 to 1.4**, vapour **0.3 to 3.7**. The *relation* passed the old test,
light stayed subordinate to vapour, which is why it was flagged rather than changed unasked. **It is
now at half speed**, the same fix an earlier cut took: `setpts=2.0*PTS` then
`minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`, then the same crossfade.
**The pattern to carry forward: this hero has now been called too fast twice, so slow a generated
clip toward the approved pace BEFORE showing it, rather than measuring the ratio and flagging.**

✅ **SIGNED OFF ON THE PACE. Keith, 2026-08-27, on the half-speed loop: *"the hero pace is great"*.**
Half speed is the settled answer for this clip; the third-speed option that was on the table is not
needed and is closed. **The F hero film is DONE** and the only thing still standing between it and a
live page is the pre-flight on the imagery, which is **CA-045**, opened 2026-08-27.

⚠️ **ONE OF THE SPEED NUMBERS LIES, and it will lie again.** After halving, the vapour behaves as
expected (4.5 to 15.9 becomes **1.6 to 9.6**) but the bare-table figure barely moves (4.7 to 6.0
becomes **3.7 to 5.5**), which reads as "the slowdown did nothing". It did. That region's number is
mostly per-frame film grain, and **grain is regenerated every frame, so it does not slow when the
footage does**. Sample a region containing the object whose motion you care about, never a flat one,
or the metric reports the noise floor instead of the motion.

🔵 **THE ASSET URLS NOW CARRY A `?v=` NUMBER, and it is load bearing.** Replacing a file in place at
the same path left Keith's browser playing the OLD bytes through a reload, while the served file and
the disk file hashed identically. The headless screenshot used to verify could never reproduce it: it
launches a clean profile with an empty cache every run, so it refetches by construction and reported a
pass. `poster.jpg?v=N` and `table.mp4?v=N` in `F-field.html` fix it at the source. **Bump N in the same
edit that replaces either file**, and the same applies to any other mockup asset swapped in place.

✅ **Interpolation was checked before it was accepted**, since mci artefacts show on chaotic motion:
frame by frame on the tea surface the rim stays crisp with no smearing, and a frame-to-frame
alignment search found zero pixels of introduced jitter in either the source or the interpolated
output.

**Compliance is unchanged and still gated.** The sheet is soft grey squiggles: no letterhead, no logo,
no heading, no numbers, no readable words, verified at 2x zoom on a full-resolution frame. No people,
no hands, no clinic, no visible blood. 🔴 **The CA-045 pre-flight still gates it.**

## F's hero recut: the tube became an illegible letter, and the loop is now bookended (2026-08-27)

🔵 **Keith raised the compliance risk himself before I did**, on the generated sample tube in the F
hero: *"It might be sailing a little bit close to the wind."* His proposal: replace it with a letter
or report, dim the wording, keep the mug oriented as it is, rest the glasses on the letter, and have
a breeze gently flutter the page.

**The compliance line, stated so it is not re-litigated later.** An **unbranded, unreadable** sheet on
a kitchen table makes no claim. It is post nobody has dealt with, which is the emotional truth of the
brand. What would cross the line is a legible letterhead, anything reading as a named lab or the NHS,
or any readable figures or ranges: those imply a clinical service and a per-customer result, which
brief section 2 forbids outright. **So the sheet carries soft grey lines of type with no letterhead,
no logo, no heading, no numbers and no readable words**, and at page scale under the scrim it is
illegible anyway. 🔴 **The CA-045 pre-flight still gates it.**

**Two generations to place it.** The first put the letter in the left half, where the headline sits,
and left the glasses beside it rather than on it. The second pinned the composition explicitly:
entire left half empty, every object in the right third, glasses lying open across the sheet.

🔴 **THE LOOP PROBLEM GOT HARDER, AND THE FIX IS WORTH KEEPING.** A fluttering page has an arrow of
time, so ping-pong was already out (see the entry below). **A crossfade alone also failed**: the sheet
is in a different position at every moment, so dissolving the tail over the head showed **two
overlapping sheets** and washed the type off the page for the length of the blend. Searching every
candidate end frame did not rescue it, because no frame matched the first one. Worse, a whole-frame
search gave a **confidently wrong** answer, because it was dominated by slow light drift rather than
by the paper; scoring only the paper region gave a different and better result.

✅ **The fix was upstream, not in ffmpeg.** `seedance1_5` accepts both a `start_image` and an
`end_image`, and **passing the same still as both makes the clip return to its own opening state**.
The paper region then matched frame zero at **2.7**, against 11.4 for the best crossfade point without
it, and half a second of dissolve hid the remainder. **Order to use in future: bookend first, prompt
the motion as a round trip, crossfade only for what is left.**

**One more correction on the way:** the first bookended take lifted the sheet clean off the table
with the glasses holding nothing. Re-prompted with the motion dialled right down ("the sheet never
leaves the table", corner rises about a centimetre) and it behaved.

**This clip is NOT slowed**, unlike its predecessor. Measured per second, the light side of the frame
changes 0.4 to 1.4 while the paper and steam change 3.8 to 13.5, so the light is already subordinate
to the motion it should be subordinate to. Slowing it would have made the flutter sluggish to solve a
problem that no longer exists.

**F hero assets as of this entry** (superseded 2026-08-27, see the entry above): `assets/f/table.mp4` (254 KB, 7.42s, bookended loop) and
`assets/f/poster.jpg` (67 KB, from the loop's own first frame). Submission note: the video call was
intercepted once by a preset recommendation and needed `declined_preset_id` echoed back, exactly as
the higgsfield-generation runbook documents.

## 🟢 F IS THE ONE, and the loop had to be rebuilt to get there (2026-08-27)

**Keith, 2026-08-27, on F with the video in:** *"I think the video works really well... if we could do
something about that, I think this is the one that we will go with."* **The "that" was a real defect
he caught and I had shipped**, so it is worth recording precisely.

🔴 **THE DEFECT: a ping-pong loop reverses irreversible motion.** Both E and F were looped by
ping-pong, forward then reversed, which gives a mathematically perfect seam for free. That is correct
for E, where the only motion is light raking across a surface and running it backwards looks
identical. **It is wrong for F, where steam rises from a mug: reversed, the steam visibly sucks back
into the cup.** Nothing flagged it because the seam metric was perfect; the seam was never the
problem.

✅ **THE FIX: a crossfade loop.** The clip was regenerated at 8s (`seedance1_5`, same start frame) and
now plays **forward only**, with the last 1.5s dissolved back over the first 1.5s in ffmpeg
(`trim` + `fade=alpha` + `overlay`). Every frame runs in the correct direction, the seam is hidden by
the dissolve, and the cost is 1.5s of clip plus a faint ghost during the dissolve that the scrim and
the headline make invisible. Loop is 6.54s, **330 KB**. The poster is now taken from the loop's own
first frame rather than the source's, so there is no jump when the video takes over.

**THE RULE, for any future looping footage:** ping-pong is valid only when nothing in frame has a
direction. Light, shadow, reflection and shimmer are fine. **Steam, smoke, liquid, pouring, draining,
falling, walking and anything with an arrow of time are not.** Crossfade instead, and budget the
crossfade length out of the clip. E's loop is still a ping-pong and is still correct, which is the
cleanest illustration of the distinction.

**Verification note worth keeping:** a first-frame-versus-last-frame difference score cannot catch
this. Ping-pong scores a perfect 0 and is still wrong. The check that works is looking at the motion
itself, which here meant a contact sheet of the mug across the loop point.

✅ **THEN THE SPEED, same day.** Keith on the fixed loop: *"the video is perfect, except I think it's
a little fast. It looks like the sun or the shadow is moving at twice the speed of everything else."*
Correct, and it is a **relative** reading: the shadow was outpacing the steam. **Now runs at half
speed**, slowed with `setpts=2.0*PTS` and re-interpolated with `minterpolate` (mci/aobmc) so the
drift stays smooth instead of stepping on duplicated frames, which is what a naive slowdown of 24fps
footage gives you. Slowing everything rather than isolating the light was the right call: steam at
half speed reads calmer, which the page wants anyway. Interpolation was checked frame by frame on the
steam for smearing before it was accepted, since chaotic motion is where mci artefacts show.
**The clip got smaller doing it**, 330 KB to **269 KB**, because slower motion compresses better.
Loop is now 7.5s.

**F hero assets as of this entry** (superseded twice since, see the entries above): `assets/f/table.mp4` (269 KB, 7.5s, half speed, crossfade loop) and
`assets/f/poster.jpg` (77 KB, taken from the loop's own first frame).

## KEITH PICKED D, and E and F test its hero ground (2026-08-27)

🟢 **The direction is decided: D, Machined.** Keith, 2026-08-27, on the mockups: *"D wins for me. It's
fairly close to what I imagined, and I'm surprised."* **A, B and C are now reference, not
candidates.** They stay on disk because the picker is worth keeping intact, but no further work goes
into them.

🔵 **What he asked for next, and it is a narrow ask:** two more variations, E and F, **on the bones of
D**, because he thinks more can be done with the hero background. His words: it is very subtle, he
likes what is in D, and he wondered about video *"or something else, or just make the background in
the hero section a little more creative."*

**So E and F change exactly one thing.** Everything below the header is D unaltered: same trays and
inset cores, same asymmetrical bento, same Geist, same tokens, same copy, same cited numbers. The
only variable is the hero ground, which is the only thing there is to judge between them.

| | The hero ground | Cost |
|---|---|---|
| **D. Machined** | Luminance wash plus a repeating rule at two scales | Nothing |
| **E. Machined / Cast** | Four seconds of filmed light moving across a pale machined surface | **690 KB video** |
| **F. Machined / Field** | A film of the kitchen table on the morning the post arrived, with the data field over it | **254 KB video** |

**E takes the direction's metaphor literally.** If the page is built as machined objects, the ground
behind the type is the material those objects are cut from. Generated with Higgsfield
(`kling_omni_image` for the start frame, `seedance1_5` for four seconds of motion), then
**ping-ponged in ffmpeg** (`reverse` + `concat`) so it loops with no visible seam. **One asset serves
both themes**: the footage is very nearly monochrome, so dark mode applies `filter: invert(1)` and
gets a dark machined surface with light raking across it. Encoded at crf 31, 1280x720, silent,
faststart, **690 KB**. A flat scrim sits over it because the headline does not clear 4.5:1 against
the bare footage. Assets in `design/mockups/directions/assets/e/`.

**F is now two layers, after Keith asked on 2026-08-27 to put a real video in its hero** and see
"what a video around what we're doing would look like". Underneath: an ordinary kitchen table at the
moment the kit is on it, mug, tube, envelope, reading glasses, light moving across pale wood.
**No people, no hands, no clinic, no visible blood**, so nothing implies a clinical service. Over it:
the canvas field from the same six markers the readout uses, all transcribed from
`04_products/results-engine/thresholds.md`, dropped to 34% opacity because over a photograph the same
lines that read as data over a flat ground read as scratches. The picture says where you are; the
field says what we do there.

**The colour treatment is contrast work, not decoration, and it took two generations to get there.**
The first frame came back warm and mid-toned, mean luminance 130 of 255, which on a near-white page
with near-black type would have had to be lifted so hard it looked washed out. Regenerated high key,
then graded to monochrome, lifted, and given a **directional** scrim: heaviest at the left where the
headline sits, lightest at the right where the objects are. Dark theme **darkens** the same file
rather than inverting it, because inverting a real scene turns a pale table black and the objects
white, which reads as a photographic negative rather than a night kitchen. E can invert because
E is a material, not a scene.

**Cost: 269 KB, well under half of E**, because almost nothing in F's frame moves and h264 rewards
that. Assets in `design/mockups/directions/assets/f/`.

**So the E vs F trade is no longer free vs paid.** Both now carry video. E is 690 KB of abstract
material; F is 307 KB of the actual product moment plus the data. **F is the cheaper and the more
literal of the two**, which was not true before Keith asked for this.

**Both keep every rule D established**, with one deliberate exception: F is now photographic, which is what Keith asked to see. E stays material and light rather than a person. No
scroll listener, static under `prefers-reduced-motion` (F draws one frame; E needed JS to pause,
since CSS has no lever for video), and neither depends on JS to render: E degrades to its poster
frame, F falls back to D's plain CSS rule. **Impeccable: E 21, F 24**, both inheriting D's accepted
set. E is lower because removing the wash and the repeating rule from its stylesheet, once the film
replaced them, removed dead CSS the detector was right to flag.

🔵 **The picker now carries six**, keys 1 to 6. Same verbatim harness.

✅ **ANSWERED: F.** See the entry above. And separately, still open: whether the marketing site and the app
share one design system.

## A, B and C rebuilt as v2, and all four now sit behind a picker (2026-08-27)

🔵 **Keith typed `/prototype` and ruled: rebuild A, B and C, D stands as built.** `/prototype` is
`disable-model-invocation: true`, which blocks Claude from calling it through the Skill tool but not
from executing it once a human invokes it. That distinction is worth writing down, because the
previous entry recorded the block without recording that user invocation lifts it.

🔵 **The picker is at `design/mockups/directions/picker.html`.** Markup, CSS and key wiring are
verbatim from the skill's `PICKER.md`, which the brief required and which forbids a hand-rolled
substitute. **One adaptation, and it was forced:** each direction is a complete standalone page with
its own stylesheet, so variants mount as **iframes** rather than as inlined markup. Four full
stylesheets in one document would collide on class names and the comparison would be worthless.
Switching still re-mounts, so entrance animations re-run exactly as the picker contract requires.
Keys 1 to 4 and the arrow keys switch, `R` replays, `?v=N` persists the choice, and `?t=light` /
`?t=dark` on the harness is passed through to whichever direction is mounted so all four can be
compared in one theme.

**The divergence rule that shaped v2: each direction spends a DIFFERENT one of the brief's four
levers.** The brief diagnosed v1 as flat because it used almost none of photography, scale, texture
or motion. Making all four pull the same lever would have wasted the picker, so:

| | Lever | Palette | Display face | Layout family | Header |
|---|---|---|---|---|---|
| **A. Specimen** | Photography at scale | Warm bone | Newsreader | Full-bleed plate bands | A photograph under a slow drift |
| **B. Instrument** | Density and data | Cold near-black | Space Grotesk | Data hero plus snap rail | A readout that draws itself and counts up |
| **C. Broadsheet** | Texture and print | Screened newsprint | Instrument Serif | Multi-column, drop cap, halftone plates | Masthead rules drawing across |
| **D. Machined** | Light and depth | White and silver | Geist | Asymmetrical bento | A luminance wash and a drifting rule |

**Assumption stated to Keith and not challenged:** his "non-photographic motion" call settled **D's**
header, and section 6's three levers (motion, depth, imagery) are things to diverge across rather
than repeat. If that is wrong, A is the direction that changes.

**Impeccable across all four: A 3, B 1, C 3, D 24.** v1 was 138. Every remaining finding is a
recorded decision:

- **A and C keep `all-caps-body`** on their label furniture. Both are print-derived directions and
  caps-as-label is the typographic system rather than decoration. The gratuitous ones were removed:
  the kit spec line is not a label and no longer reads as one.
- **B and C carry `overused-font`** on Space Grotesk and Instrument Serif, the same finding class v1
  carried on Inter and D carries on Geist. Section 8 of the brief hands this class to Keith.
- **D's 24 are unchanged and documented** in the entry below: twelve `nested-cards` because the
  double-bezel IS that direction, seven structural `clipped-overflow-container`, and four accepted
  singles.
- **The eyebrow chips, kickers and numbered step labels came out of all three**, as they did from D.
  The detector is right that they are generated-page scaffolding, and they were the single thing
  making four different directions look like the same template.

**Three real defects the verification caught, one per direction:**

1. 🔴 **A's conflict-free receipt was 1.0:1 in dark theme.** The block hardcoded light-on-dark
   literals so that it would invert from the page; in dark theme the page is already dark, so it
   became near-white text on a near-white ground. **Inverse colours have to be tokens that flip with
   the theme.** Fixed with an `--inv-bg` / `--inv-fg` pair, and verified by eye in dark.
2. **B skipped a heading level**, h2 straight to h4, because the timeline steps were h4 to sit under
   a number that has now been deleted.
3. **A's hero photograph was too dark to read as a photograph** at 390, which defeats the entire
   axis of that direction. Brightness and crop corrected.

**All three carry the `.js` gate D needed**, so no page renders as a blank column if the
IntersectionObserver never fires, and `?still=1` gives a settled render for screenshots. **Verified
at a true 390 and at 1440, both themes, full-page, with no horizontal overflow on any of the four.**

**Every number is still cited** to `04_products/results-engine/thresholds.md` with the arithmetic in
a comment beside it. B shows six markers rather than four, so it additionally cites hs-CRP and SHBG,
the latter deliberately banded on the range the lab returns rather than a fixed number, per ruling 7.

✅ **ANSWERED SAME DAY: Keith picked D.** See the entry above. The original note read:
🔴 **THE CHOICE IS KEITH'S AND NOTHING ELSE MOVES UNTIL IT IS MADE.** The skill stops here by
design. To promote one: `/prototype keep <name>`. To diverge again around one:
`/prototype riff <name>`.

**Still open, and both still need Keith:** (1) which direction; (2) whether the marketing site and
the app share one design system.

## Direction D built, imagery generated, and the Figma question answered (2026-08-27)

🔵 **`design/mockups/directions/D-machined.html` exists and is verified.** The fourth direction from
`homepage-direction-brief.md` section 9, built with `high-end-visual-design`. Variance engine roll:
**Soft Structuralism** (that skill's own consumer and health archetype) crossed with the
**Asymmetrical Bento**. It is in the index alongside A, B and C.

**It answers "flat and barren" with light and depth rather than more structure.** Every card is a
28px tray holding a concentric 22px inset core, every marker track is a recessed well, and the page
sits under one very large low-opacity ambient shadow with fixed film grain over it. Nothing glows
and nothing is coloured.

**Keith's call on the header (2026-08-27): non-photographic motion.** So the hero carries no
photograph. Three moving layers instead: a luminance wash breathing over fifteen seconds, a drifting
measurement rule at two scales behind the type, and a staggered mask reveal on the headline. All
transform and opacity, no scroll listener, all collapsing to static under `prefers-reduced-motion`.
Photography enters lower down, in the bento cells.

**Four aesthetic departures, and they are the whole direction:** radius (none to a 28px squircle),
shadow (none to diffused ambient), typeface (**Inter to Geist**, because `high-end-visual-design`
bans Inter outright and keeping it would have made D a version of B), and ground (flat white to a
luminance wash plus grain). One accent, amber, used only as the borderline chip fill with near-black
text on it. **Every compliance rail is untouched.**

**Five photographs generated and committed** to `design/mockups/directions/assets/d/`, via Higgsfield
`kling_omni_image` to the `02_brand/CONTEXT.md` photography spec: ordinary British men 38 to 55,
kitchen, home evening, hands with a sample tube, an office at 4pm, a municipal changing room. All
checked by eye, one regenerated because the pose read as mocking the subject rather than showing him.
🔴 **They are claim-adjacent and have NOT been pre-flighted.** That is CA-045. Mockup only until it clears.

**Three real defects the verification caught, none of which a text report would have found:**

1. **The whole page below the hero rendered blank.** Every section was gated behind an
   IntersectionObserver, so with no observer there was no content, only a white column. Now every
   entry animation sits behind a `.js` class the page adds to itself, and `?still=1` renders the
   settled state. **Content must not depend on JS to be visible.**
2. **Real horizontal overflow.** The hero luminance wash is 150vw wide and centred, pushing the
   document to 507px at a 390 viewport, with `overflow-x:hidden` on `body` masking it. The hero now
   clips its own decorative layers and body no longer hides the next one.
3. **The headline mask boxes clipped their own glyphs**, because `overflow:hidden` on a 1.06
   line-height leaves no room for ascenders or descenders.

**Impeccable: 38 findings down to 24, and the 24 are deliberate.** Twelve `nested-cards` (the
double-bezel IS the direction), seven `clipped-overflow-container` (the hero wash, the rule mask, the
rounded image corners, four inlaid tracks), two `overused-font` on Geist and Geist Mono (**the same
finding class v1 carried on Inter, and section 8 of the brief hands it to Keith**), one
`repeating-stripes-gradient` (the measurement rule, which is the header answer), one
`aphoristic-cadence` (Keith's settled copy, which the brief forbids rewriting), one `all-caps-body`
(the readout verdict labels, which are instrument vocabulary). Sixteen were genuinely fixed, and the
fix list is worth reading: **the kickers, the eyebrow chip and the 01/02/03 step labels are gone**,
because the detector is right that they are generated-page scaffolding and they were the one thing
making D look like every other wellness page. The functional text floor was lifted from the brief's
11px to **12px**, since section 3 calls this a presbyopia demographic.

**Every number is still cited.** Four markers, each carrying its arithmetic in a comment beside it,
all from `04_products/results-engine/thresholds.md`: testosterone 14.2 and vitamin D 58 agree with
the lab; **Active B12 45 and ferritin 62 are the two splits**, where the assay says normal and our
GP-approved bands say borderline.

🔵 **FIGMA QUESTION ANSWERED (Keith, 2026-08-27): a new file, not the social one.** Created at
**<https://www.figma.com/design/3la8nvgxYC9fey8QLDuFaA>** ("Andro Prime homepage directions"). It
holds a `D tokens` variable collection, the phone frame at 390, the desktop frame at 1440 with the
asymmetric bento row, and a **sources and departures panel** carrying the same citations as the HTML.
Two constraints found: the plugin API **cannot rename a document** (so a first file with an em dash
in its name, `IAYgjVx5mplKefQydRACbD`, is stray and Keith should delete it), and the plan **caps a
variable collection at one mode**, so dark values ride in each variable's description instead of a
Dark mode. The existing Figma file `O4K7R8RlCKRM7EQ7WxFtCn` is social assets only and was left alone.

✅ **DISCHARGED 2026-08-27, see the entry above: Keith typed `/prototype` and A, B and C were rebuilt as v2.** The original note read:
🔴 **STILL OWED, AND ONLY KEITH CAN DO IT: A, B and C have no v2.** `/prototype` is
`disable-model-invocation: true`, so Claude cannot invoke it and hand-rolling a substitute is
disallowed. The imagery, the tokens and the verification method are now on disk waiting for it. The
line to type:

```
/prototype four homepage directions per andro-prime/09_website-app/design/homepage-direction-brief.md
```

**Open, and both still need Keith:** (1) which direction; (2) whether the marketing site and the app
share one design system.

## Three homepage design directions drawn and phone-verified (2026-08-27)

🔵 **`design/mockups/directions/` holds A-specimen, B-instrument, C-broadsheet plus an index.**
Same copy, same compliance rails, same sourced data; only the visual language differs. Built with
the `design-taste-frontend` skill (design read, dials, pre-flight) and checked with the Impeccable
detector. **Keith's call, nothing agreed.**

**The unlock: the packaging already broke the guidelines, and it broke them well.** The kit renders
(`02_brand/assets/packaging/renders/`) are warm bone stock, serif product names and hairline rules.
`brand-guidelines`/`visual-identity.md:97` still say white background, Inter Black uppercase
headlines and "structural black borders". `.blog-skin` is already a documented cream departure. So
the site is the only surface still following v2.0 literally, and these directions bring it into line
with where the brand already went rather than inventing anything. **Keith believed rounded-none and
no-shadow were not brand rules; they are, in writing.** Changing them is his decision (brand
sign-off is Keith, not Ewa: clinical and claims only).

**The detector found a real accessibility defect, not a style quibble: 138 anti-patterns, 69 of them
functional text below 11px and 37 below 4.5:1 contrast.** For a phone-first site aimed at men 38 to
55 that is a legibility failure. Fixed across all three; **138 down to 4**. The remaining 4 are one
finding repeated: `overused-font: inter`. **Deliberately not fixed**, because Inter is the
documented brand face and the logo glyphs are Inter Black outlined to paths.

**Verified at a true 390px viewport with Playwright**, not desktop-with-a-breakpoint. Two bugs were
caught only by looking: a `padding` shorthand on `.sec`/`.hero` silently wiped `.wrap`'s horizontal
padding, and headless Chrome enforces a minimum window width, so early 390px captures were laid out
at ~500px and cropped, which read as an overflow bug that did not exist.

**Serving locally:** `python -m http.server 8090` from the repo root, then
`/andro-prime/09_website-app/design/mockups/directions/`. The pages take `?t=light` / `?t=dark` to
force either theme, and `?dbg=1` on A reports anything wider than the viewport.

**SUPERSEDED SAME DAY by Keith's review of the three.** His read: they "still look pretty flat and
barren". Diagnosis accepted and it is not typography. All three were type and rules on a flat ground
with three small product photographs and one animation invisible in a screenshot; the brand rules
forbid shadows, gradients and accent colour, so the only levers left were photography, scale,
texture and motion, and v1 used almost none of them.

**Three rulings followed, all Keith, all 2026-08-27:**

1. **The visual brand guidelines are now ADVISORY.** Break them where breaking them produces a
   better modern result. Compliance rails are untouched. Full entry in `02_brand/STATE.md`.
2. **Do not use the packaging renders.** They are the actual product packaging and the boxes are
   white. Generate site imagery instead, to the photography spec in `02_brand/CONTEXT.md`.
3. **The header needs motion, depth or imagery**, not words on a flat background.

**v1 archived at `design/mockups/directions/v1-2026-08-27/`.** Reference, not a starting point.

🔵 **The brief for the next pass is `design/homepage-direction-brief.md`**, written to survive the
session boundary. It carries the permission boundaries, the phone-first two-surface model, the
imagery split (Higgsfield for photography, `imagegen-frontend-web` for section references), the
image-first build order, the four directions including D from `high-end-visual-design`, the hard
constraints that each caused a real v1 defect, and the verification method.

🔴 **`/prototype` CANNOT be invoked by Claude.** It is locked to explicit user invocation and
hand-rolling a substitute is disallowed. **Keith must type it.** Everything else in the brief Claude
can drive.

**Open, and both need Keith:** (1) which direction; (2) whether the marketing site and the app share
one design system. **Both answered 2026-08-27, see the entry above:** the directions are built as HTML with the Figma
file as a parallel artefact, and a new Figma file was created rather than writing into the social one.


## Vitall dispatch sends a synthetic patient identifier (2026-08-21)

**VERIFIED LIVE 2026-08-21** on build `YkyBJR98Hg-R6OZScV582`, commit `a80fb29`.

**Deploy verification, for the record.** The change is server-only, so a client-chunk fingerprint would have been structurally blind to it; the canary used was the **per-run build id** from the RSC payload (rung 1, layer-agnostic), captured pre-push as `ZQpD7MSIamNmGhMxpVzfa` with the same command used to poll, and asserted stable and non-empty before being trusted. Post-push it read `YkyBJR98Hg-R6OZScV582`. Corroborated by a second independent signal: Sentry's newest release is `a80fb29bfd78e4ebd1708fc96f7d9dd02064e60a`. Site returns 200.

**What changed:**

- New `frontend/lib/vitall/identity.ts` exporting `vitallPatientEmail(userId)` → `${userId}-andro-prime@vitall.co.uk`, with the full rationale and policy trail in the file header.
- `frontend/app/api/vitall/dispatch/route.ts` sends that instead of `user.email`, and **no longer sends `phone`** (also dropped from the `users` select). `user.email` is still read, but only to key the Customer.io `kit_dispatched` event on our own canonical identifier.
- `frontend/scripts/e2e/place-vitall-test-orders.ts` mirrors the production path.
- `docs/vitall-integration-spec.md` updated: sample payload, field notes for `email` and `phone`, and the "email already associated with a different partner account" 400 annotated as mitigated.
- **New test: `frontend/scripts/test-vitall-patient-payload.ts`, 21 assertions, added to the `npm test` chain.** The patient block is now built by `buildVitallPatient()` in `lib/vitall/identity.ts` rather than inline in the route, so the rule is a named unit. **Its signature takes no email and no phone parameter**, so neither can be passed by accident. The tests assert the synthetic shape, that no real mailbox or phone appears anywhere in the serialised payload, that `phone` is absent as a key (not merely undefined), that the lab's fields pass through untouched, and the dedupe invariant (stable per user, distinct between users, independent of order and of profile-name changes).
- **The test was verified to actually fail.** Sabotaging `vitallPatientEmail()` to return a real gmail address produced 7 failures including "the payload does not contain the real email address"; restoring it returned 21/21. A regression test that has never been seen red is not evidence.

**Why:** Vitall-side automations were emailing our customers directly (order confirmation, "received at lab", "results available", all observed arriving from Raizel). Ben Starling disabled those on 2026-08-21 but **cannot** disable auto account creation on `andro-prime.vitall.co.uk` or existing logins on it. A disabled automation is a config flag; an unreachable mailbox is not. Vitall use email only as the account's unique key and ignore anything `@vitall.co.uk` on a partner account: it is their own in-clinic pattern.

**Safe because nothing keys on it:** results match on `partner_order_id` (`app/api/webhooks/vitall/route.ts`), kit-to-order linkage is Vitall pre-printing against the order with no customer-side kit registration, the bundle's second kit reuses the same `user_id`, and the trend view in `lib/results/getDashboardData.ts` already spans all of a user's orders. `lib/vitall/client.ts` exposes only `createOrder` and `getAvailableTests`, so no code path looks a customer up at Vitall by email.

**Derived from `users.id`, never the order id** — Vitall dedupe patients on this address, so a per-user value keeps a repeat customer consolidated on one Vitall patient record.

**Timing:** done before real customers exist. One live order (Keith's own) plus test orders, so **no backfill and no migration**.

**Verified on both sides.** `npm test` and both typecheck projects are green, and the payload assertions cover everything we control. **Vitall's acceptance is no longer taken on trust:** a throwaway probe against the SANDBOX (`vitallsync.com`) called `/order/create` with `probe-...-andro-prime@vitall.co.uk` and it was **ACCEPTED**, order `322945081`, with the address echoed back verbatim and `"phone": null` in the returned patient record. So Vitall's validator does not reject its own domain and does not require a phone number. The probe touched no database: it built the payload by hand and was deleted after the run, so nothing was seeded into `users` or `kit_orders`.

**Two facts worth keeping from that probe:** the **sandbox accepts the same `VITALL_CLIENT_ID` / `VITALL_CLIENT_SECRET` as production**, so testing needs only `VITALL_SANDBOX=true` and no separate credentials; and `VITALL_SANDBOX=false` in `.env.local`, so **running the e2e order script as-is places REAL orders against production Vitall** and also writes to the production database. Force the flag in the script, not in `.env.local`.

**Open, pending Ben:** whether the email string appears on the pre-printed kit or the Lab Request Form. Cosmetic only, routing does not depend on it, but if it prints we want the field suppressed or a friendlier format agreed. Also open: whether the already-created Vitall accounts can be deleted rather than left dormant.

---

## THREE ARTICLE CHANGES: one LIVE, two STAGED, and the difference is the revalidate trigger (2026-08-18)

**`cholesterol-test` changed LIVE.** Ewa's 2026-08-18 chest-pain ruling added a 999 escalation for
sudden or severe chest pain. Written through `upsert_blog_article()` so the revision trail carries an
editor (`claude/ewa-ruling-2026-08-18-chest-pain-999`). Body 15,996 to 16,431 chars.

**Two surfaces, because the FAQ is a second one and it is easy to miss.** The body gained the 999 block
inside the existing `SystemAlert`; the **frontmatter `faq`** entry "When should I see a GP about my
cholesterol?" gained the same escalation prepended to her signed text. That FAQ array is machine-read
into FAQ schema, so a body-only fix would have applied the ruling where a human reads and not where an
AI Overview does.

⚠️ **`sync-mirror.ts` is BODY-ONLY by design, so it could not carry the FAQ change.** It preserves each
mirror file's hand-written frontmatter verbatim, which is the right behaviour and also means a
frontmatter change is invisible to it. `export-blog-from-db.ts` does carry frontmatter but rewrites
**all 19 files unconditionally** with no diff check, so it is the wrong tool for a one-field change.
The mirror's FAQ was therefore brought into agreement with the DB by hand and **verified by parsing it
back with `gray-matter` and comparing to the DB string**, rather than by eye. **This is a real gap in
the "put it in the DB and re-export the mirror" rule**, which is stated in three places as though it
were complete: `content/blog/*.mdx` is also the **import source**, so a stale mirror FAQ is what a
future `import-blog-to-db` run would push back. Logged as task-observer observation 314.

**Three articles changed STAGED, not live**, all via `stage-reopt.ts`, all at `content_pipeline`
`reoptimising` / `blocked_on = keith`, all live bodies unchanged:

| Article | Proposed revision | Why |
| --- | --- | --- |
| `why-am-i-always-tired` | `b591ae0c-735e-4fcd-ada2-83836854ce91` | the fatigue block, Q2-cleared |
| `inflammatory-markers-blood-test` | `9bfa70a7-f7ea-4027-a765-5d1b1b4c2e5f` | the inflammatory block, cancer paragraph as written |
| `low-vitamin-d-symptoms` | `069199cf-1fc6-4c5d-ac66-721647c61b00` | CA-042 Q1: PHE "recommends" corrected to "consider", in the body paragraph AND the FAQ |

⚠️ **The vitamin D one carries the frontmatter mirror trap too**, since its FAQ changed: when it is
promoted, `sync-mirror.ts` will not carry the FAQ edit to `content/blog/low-vitamin-d-symptoms.mdx`.

🔴 **The mechanism distinction is the load-bearing part.** `blog_articles` carries an `AFTER UPDATE`
trigger firing the revalidate webhook, so on an **already-published** article a write to `body` is a
publish, in seconds. The approval packets' standing line, *"copy goes into the database and the mirror
is re-exported; each article still goes through its own publish gate afterwards"*, is true for a draft
row and **false for a live one**: there is no gate left after the write. `stage_blog_revision` writing
`proposed_revision_id` is the only mechanism that makes "in the database, not published" true for a
live article. Logged as task-observer observation 315.

---

## Kit 2 and Kit 3 sample-report panels re-derived from the results engine (2026-08-17)

**Both kit pages had their first-ever compliance pre-flight and the sample panels failed it.** They were
grading markers against a vocabulary the product does not use, with several verdicts the engine would
never return. `app/(marketing)/kits/energy-recovery/page.tsx` and `.../hormone-recovery/page.tsx`.

- **Adopted the product's own badge vocabulary** (Keith, 2026-08-17). Every row now carries the label
  `components/results-engine/StatusBadge.tsx` would render for that value, plus its `filled` flag, plus
  the bar zone from `resolveBarZones`. The pages previously read Normal / Borderline / Low, which
  appears nowhere in the engine. **"Normal" mattered most**: `StatusBadge`'s own comment records Keith
  retiring "Optimal" for merely-in-range in August because the badge must not contradict the article,
  and the kit pages were using the exact word the brand's wedge exists to challenge.
- **Two rows contradicted rulings made five days earlier**, applied in one place and never swept: FAI
  was graded `Normal` with a green bar though K1 (CA-034) had settled it as report-only and fixed only
  the Kit 1 LP; and hs-CRP 2.1 and 1.2 both read `Normal` though E1 held `classifier.ts:310` at `> 1`
  and that reached the carousel deck but neither kit page.
- **FAI now renders with no bar at all**, matching `resolveBarZones` returning `[]` and its reason: a
  coloured bar IS a verdict. The row renderer gained a `barColor &&` guard for it.
- 🔴 **A contrast defect was caught only by screenshotting.** The filled badges first rendered as solid
  black boxes with black text: the `data-label` component class sets its own colour and beats a plain
  `text-white` utility. `tsc` passed, the copy scan passed, the JSX read correctly, and the panel was
  unreadable. Fixed with `!text-white` / `!text-black`, verified at 2x on both pages.
- ⚠️ **Free Testosterone has exactly two states**, `ft-normal` and `ft-low`, split on the LAB's
  `referenceLow`, which arrives per sample and exists nowhere in this repo. 0.31 is labelled `In range`
  as the likely reading and is documented inline as illustrative; it is also the correct Vermeulen
  result for the panel's own total T, SHBG and albumin, so it cannot move alone.
- ⚠️ **The panels are hand-typed strings with nothing enforcing them.** `StatusBadge` is an exhaustive
  `Record<ResultState, BadgeConfig>` precisely because eight states once hid behind a default and
  badged an all-clear Kit 2 with four black alarms. These panels have no such constraint, which is how
  they drifted. Each row now carries a comment naming its state and threshold; that is a convention,
  not a check.

**Not deployed at time of writing.** The live pages still carry the old labels.

## The doctor gained I12, I7 stopped alarming on its own correction, and 3.1's objective is written (2026-08-16)

### 🔴 I12: a rendition we call `scheduled` must actually be ARMED at the platform

**New invariant, and it caught a live miss on its first run: 29 of the 30 carousel posts carry
`draft: true, autoPublish: false` and will not publish.** Full account and the owner's action in
[`06_marketing/content-machine/STATE.md`](../06_marketing/content-machine/STATE.md); what belongs
here is the detector.

**It reads `draft` and `autoPublish` off the SAME per-post fetch I3 already makes**, so a new
invariant covering thirty posts added **zero** network calls. `PostState`'s `found` variant now
carries the flags; `readArmFlags` returns `null` unless both parse as genuine booleans, and `null`
routes to UNCHECKED rather than to a pass, so a change in Metricool's response shape cannot turn the
check green.

**A 72-hour horizon is the whole design.** The standing rule is that the pipeline creates drafts and
a human flips them, so failing at creation time would make I12 permanently red and therefore
ignored. Beyond 72h an unarmed post is a NOTE naming the rule; inside 72h it is a VIOLATION. **72
rather than 24 so three nightly runs get to say so** before a slot is missed, and one skipped run
cannot swallow the only warning. Nine tests, including the miss itself as a regression.

🔴 **The general defect worth carrying forward: `content_renditions.status` records OUR action, not
the platform's state.** It was written by the job that created the posts and read as a promise that
Metricool would send them. Every local check agreed with itself because they all read that one
column. Existence (I3) is a much weaker claim than armedness, and only the second is what "scheduled"
is taken to mean.

### I7 was failing on the document that FOUND the discrepancy

**`maskRetired` now treats a double-quoted span as a quotation, not a claim.** I7 had gone red on the
sentence recording the 19-vs-18 published-article correction, because it matched the count inside the
quotation marks. Both docs that wrote the correction down were alarmed on; a doc that had stayed
silent would have passed. **A detector that reads prose has to distinguish use from mention**, or the
cheapest way to keep the board green is to not write the correction down. Straight and curly double
quotes only: single quotes would swallow every apostrophe. Three tests, including the live sentence.

**Doctor is 10 of 12 PASS.** The two FAILs are I10 (Substack's pre-existing coverage red, now joined
by `x/text-post`, which has nothing queued in the next 7 days) and I12.

### Plan step 3.1's unwritten clause: the recovery objective

**The restore MECHANICS were documented on 2026-08-14 and the OBJECTIVE never was**, which is the
half of step 3.1 nobody had closed. Now in `CONTEXT.md`, read from Supabase's own documentation
rather than from an earlier doc in this repo: **RPO 24 hours** (backups are daily), **retention 7
days** on Pro, **PITR is a separate add-on at roughly $100/mo** and is not enabled.

🔴 **Supabase's daily backup does NOT include Storage objects.** Plan step 3.4 moved the published
media out of git and into the `content` bucket, so **that media is now covered by neither git nor the
database backup**. The manifest plus the renderer make it reproducible, which is a rebuild rather
than a restore, and nobody has timed it.

**Recommendation on PITR: not at 3 orders, yes before the first serious order week.** Order volume is
the trigger, not the calendar.

> ✅ **DEFERRED TO OCTOBER by Keith, 2026-08-18, and it is consistent with the recommendation rather
> than against it.** Measured the same day rather than assumed: **3 orders total, most recent
> 2026-08-04, none in the last 7 days, one in the last 30.** The volume that would justify $100/mo
> has not arrived, so this is the recommendation being followed.
>
> **What is accepted until it is ruled:** RPO stays 24 hours, so a restore can lose up to a day of
> orders, quiz results and biomarker values. At roughly one order a month that is close to nothing;
> at ten orders a week it is a day of revenue and a day of customers' health data.
>
> 🔴 **October is a BACKSTOP, not the gate, and the gate can fire first.** The trigger is volume, and
> two things built to move volume are running between now and then: the 30-day carousel run
> publishing daily to 2026-09-15, and live GEO outreach. **If they work, the trigger fires before the
> review date.** So the early exit is written down as a number rather than left as a judgement call
> made too late: **10 paid orders in any rolling 7 days, or 25 cumulative, whichever comes first.**
> Either means buy it then.
>
> **This is not a deferral of media protection.** Supabase's backup excludes Storage objects, so the
> 110 published carousel files are covered by neither git nor the database backup, and PITR would not
> change that — it is a database feature. Separate problem, still open, reproducible from the
> manifest plus the renderer but never timed.
>
> **It has a surface rather than only this note:** ClickUp [`869ek4drv`](https://app.clickup.com/t/869ek4drv),
> due 2026-10-01, on the Keith-Only Sign-offs list. A deferral recorded only in a STATE paragraph is
> the same shape as the bucket rule that sat unsigned for three days because no board carried it.

## Kit 1 scope fix shipped to four marketing pages (2026-08-15)

Decision and full verification record: [`04_products/2026-08-15-kit1-scope-marketing-pages-decision.md`](../04_products/2026-08-15-kit1-scope-marketing-pages-decision.md).
Keith's go, 2026-08-15. **CA-025 / `04_products/CONTEXT.md` §5 was live in the results engine and
contradicted by the marketing pages**, open since 2026-08-02.

- **Changed:** `app/(marketing)/kits/testosterone/page.tsx` (lead narrowed to the hormonal
  presentation, two out-of-scope symptom cards replaced, **new routing card to Kit 2**),
  `app/lp/testosterone/page.tsx` (same, and it is the **paid-ad** surface),
  `app/(marketing)/kits/page.tsx` (Kit 1 "Right for" + a mirror sentence), `app/(marketing)/page.tsx`
  (Kit 1 card copy only). 48 insertions, 9 deletions.
- **The remedy is CA-033's, applied one layer up:** split and route, delete nothing. Deleting the
  fatigue words would have relocated the problem, leaving the fatigue reader on Kit 1 with worse copy.
- ✅ **Verified in a real browser render, not asserted from the diff.** `tsc --noEmit` exit 0;
  `compliance-preflight` **0 HARD** across all four (2 REVIEW, both pre-existing homepage items,
  confirmed against the diff); all four pages 200 with the new strings present and `exhausted by 3pm`,
  `brain fog`, `low energy, low drive` and `essential for men experiencing fatigue` all gone, 0
  failures; screenshots read as images at 1400px and at a true 390px mobile viewport with
  `scrollWidth === innerWidth === 390`, so the new card adds no horizontal overflow.
  `test-quiz-routing.ts` 21/21, `test-kit-cta.ts` clean.
- 🔵 **Deliberately NOT changed: the homepage "Symptom Diagnostic" block.** It reads out of scope in
  isolation but sits under a testosterone-thresholds H2, carries no CTA and is followed by the
  three-kit grid. A code comment now says so, so a later reviewer does not "fix" it into incoherence.
- 🔜 **Flagged, not decided:** `/kits/testosterone` offers **Kit 3 (£179)** as the sideways option
  where **Kit 2 (£119)** is the complement under the 2026-07-08 complement rule. Offering only the
  dearer kit to a reader we have just sent elsewhere reads as an upsell. Kit-ladder question.
- ⚠️ **Owed: a regression guard.** CA-033 shipped 21 assertions so no fatigue combination can return
  Kit 1 again. **Prose has no equivalent, and four weeks of drift on an approved rule is what that
  absence looks like.** A string-level check is proposed in the decision doc.

## The local dev server on port 3000 returns 500 on every page (2026-08-15)

🔴 Found while verifying the Kit 1 change, and **unrelated to it**: `http://localhost:3000` returns
**500 on every route tested**, including `/about`, `/faq`, `/how-it-works` and `/blog`, none of which
the change touched. A clean `next dev` on another port serves all four at **200**, so the codebase is
fine and that particular running process is not. Recorded because somebody is looking at a broken
local site and may read it as a real fault.

## AEO groundwork: llms.txt caught up, and three pages gained structured data (2026-08-15)

✅ **DEPLOYED AND VERIFIED LIVE 2026-08-15** (commit `c03ead0`). Three independent canaries, each confirmed absent from the previous build before the push and present after, flipping together at t+140s: `"@type":"Blog"` on `/blog` (0 to 1), article links in `/llms.txt` (1 to 18), and `hello@andro-prime.com` in the homepage Organization graph (0 to 1). All four changed URLs return 200. **Live `/blog` serves 18 `BlogPosting` entries and no `cortisol-belly`**, so the draft gate behaves in production as the code predicted and the schema inherits it rather than adding a second one.

- **`public/llms.txt` now lists all 18 published articles, up from 2.** It had not been regenerated
  since 2026-07-24, so everything published after that was invisible to any model reading it.
  Grouped into five clusters with the GP-review and UK-specificity line at the top of the section.
  **Descriptions are condensed from each article's own approved `frontmatter.excerpt`**, not written
  fresh, so no unreviewed copy shipped. `compliance-preflight` 0 HARD / 1 REVIEW (the unchanged
  Clinical Boundaries paragraph, TRT inside a denial of availability), adjudicated CLEAR.
- ⚠️ **`llms.txt` has no generator and nothing keeps it in sync.** A repo-wide search for any script
  that writes it returns nothing: it is hand-maintained, which is why it drifted to 2 of 18. Every
  future publish silently re-opens the same gap.
- **`/test-selector` and `/blog` have page-specific structured data for the first time**, closing two
  items from the 2026-08-02 on-page AI-visibility review. `/test-selector`: `BreadcrumbList` +
  `WebPage`. `/blog`: `BreadcrumbList` + `Blog` with a `BlogPosting` per article, **derived from the
  article list rather than hand-listed**, so it cannot drift from what the page renders.
- **Deliberately `WebPage`/`Blog`, never `MedicalWebPage`.** The medical types assert a clinical
  service and sit outside the Phase 0 boundary. The 2026-08-02 review predicted this recommendation
  would recur and it did; the refusal stands.
- **The Organization graph in `app/layout.tsx` gained `legalName`, `logo`, `sameAs` and
  `contactPoint`**, so it reaches every page. Values sourced, not invented: `Andro Prime Ltd` and
  `hello@andro-prime.com` from `03_compliance/terms-and-conditions.md`, and the three **company**
  channels from `06_marketing/content/social-channel-setup.md`. **Keith's personal X and LinkedIn are
  excluded from the Organization entity by choice** — flag if you want them in.
- ✅ **Verified in the rendered DOM, not in source.** `tsc --noEmit` exit 0, then both pages fetched
  from a dev server and their JSON-LD parsed. **This caught a real defect before it shipped:**
  `BlogListItem.date` is a display string ("12 Oct 2026") and `datePublished` must be ISO 8601, so
  the blog schema is built from the raw article rows via `isoDate`. A source review would have passed
  it.
- 🔵 **Not a defect, recorded so it is not re-flagged:** `/blog` renders 19 `BlogPosting` entries in
  dev against 18 published rows. The extra is `cortisol-belly` (`status: draft`); production filters
  to published-only via the anon key and RLS, and `/blog/cortisol-belly` 404s live. The new schema
  inherits that gate rather than adding a second one.

## 🔴 THE HETZNER SERVER INVENTORY IN THE DOCS MATCHES NOTHING REACHABLE (2026-08-14)

**Found while starting plan step 3.5's cold archive, which is specified to live on `nc-server-01`.**
Measured by connecting, not by reading a document:

| Address | What answered | Disk |
| --- | --- | --- |
| `37.27.250.169` | **nc-server-03** | 122 GB free of 150 GB |
| `37.27.85.240` | **nc-dev-02** | 87 GB free of 150 GB |
| `188.245.220.164` | 🔴 **host key CHANGED**, not connected | unknown |
| `49.13.166.153` | connection timed out | unknown |

**There is no reachable `nc-server-01`, and the names do not resolve in DNS.** The 2026-08-13
proposal describes `nc-server-01` as a CPX31 x86 box with **320 GB** of local disk and
`nc-server-02` as CAX31 Arm64. **Neither reachable box has a 320 GB disk** and neither carries
either name. The 320 GB figure is load-bearing: it is the whole argument for putting the second
copy of unrecoverable shot media there.

**No server address exists anywhere in the repo or in either `.env`** — the only textual reference
is a comment in `drive-folders.ts`. So the inventory has never been checkable from here.

⚠️ **The host key on `188.245.220.164` has changed** (it is the address with three `known_hosts`
entries). Benign if that box was rebuilt or reimaged, and not benign otherwise. **Deliberately not
overridden**: this needs a knowing decision, not a script passing `StrictHostKeyChecking=no`.

✅ **RESOLVED the same night, by Keith's Hetzner console screenshot.** The console labels and the OS
hostnames simply disagree: **`nc-server-01` IS `37.27.250.169`**, which reports its own hostname as
`nc-server-03`, and `nc-server-02` is `37.27.85.240`, reporting `nc-dev-02`. The other two addresses
are not part of this project, so **the changed host key is not on either Andro Prime box** and is
moot here. **Both are 160 GB**, so the documented "320 GB" was the total across the pair. The cold
archive is built and proved against `37.27.250.169`.

**The durable lesson, since it will mislead the next person too: `hostname` is NOT how you confirm
which of these machines you are on.** Identify by IP.

**This is the same failure shape as the Supabase-tier correction made hours earlier** — an
infrastructure fact written into a document once, cited onward by later documents, and never
re-read from the machines it describes.

⚠️ **Unrelated but found in passing: `~/.ssh/root password.txt` holds a root password in plain
text** on this machine. Not opened. Worth moving into a password manager, particularly ahead of CQC.

## `npm test` RUNS AGAIN, D5 is answered, and the heartbeat's alarm path was broken (2026-08-14)

### `npm test` exits 0 for the first time since the errors appeared

**All twelve app test files run.** The suite is `typecheck:scripts && <12 files>`, and that
typecheck had been exiting 1 on three errors in content tooling, so **none of the twelve ever
ran** — including the results-classifier regressions, quiz routing, checkout, the bundle suites
and the Customer.io consent gate. One error was cleared on 2026-08-14 by regenerating
`lib/supabase/types.ts`; **the last two are now fixed** and `test-classifier-regressions.ts` alone
is back to 34 assertions over the clinical routing.

**This did NOT require the package move.** Plan step 2.1 bundles the fix with relocating 29
scripts to `packages/content-engine/` and updating ~25 path references, four of which are
absolute paths inside Windows scheduled tasks. The move is deferred while the carousel run is
starting; the two-line fix that delivers the actual value is done.

🔴 **Both "type errors" were live defects in the alarm path, not typing noise.** `doctor-heartbeat`
is the job that reports the nightly doctor's DEATH, and both faults sat in the escalation it
exists to deliver:

- `findOpenTask` read `t.status?.status`, the RAW ClickUp shape, on a `CuTask` that has no
  `status` property. It evaluated to `undefined` on every task, so no task ever counted as
  settled and the function returned **the first marker-named task whether or not it was closed**.
  The next time the doctor went quiet, the alarm would have been a comment on a long-resolved
  task.
- `createTask` was called with three positional arguments where it takes one object, so `listId`
  would have arrived as the whole args object and the task creation would have failed outright.

**Both were latent** — the heartbeat has run daily and never had to alarm, so neither path had
executed. **A test was green over the first one**, because its fixture supplied `{ status: {
status: 'complete' } }` cast to `CuTask`: the fixture reproduced the defect instead of catching
it, and the `as CuTask` cast is what let the compiler stop asking. Fixture corrected to the real
field with no cast.

### D5 ANSWERED: yes, a docs-only commit triggers a full build and deploy

**There is no watch path. Every push to `main` builds and deploys**, whatever it touched.
Measured rather than read off a console: three consecutive **markdown-only** commits on 2026-08-13
(`95f534d`, `f7f7aaa`, `77b7db0` — two `.md` files each, no code) each produced its own **Sentry
release**, and a release is created by the Next build uploading source maps, so a build ran for
each one.

**What it costs:** a full container build and swap for a commit that changes no served byte. **The
risk worth naming is not the waste**: it is that a docs commit deploys whatever state the build is
in. If a dependency or a config drift has broken the build since the last code change, a
documentation edit is what discovers it, in production.

**Not yet decided:** whether to configure a watch path. Coolify has no API token in this repo, so
setting one is a console action for Keith. This entry is the answer to the question, not the
change.

## Schema: `variant` on renditions, four metric columns, and the baseline re-dumped (2026-08-14)

**Three migrations applied, all for Phase 1 of the content-machine plan.** Detail and reasoning in
`06_marketing/content-machine/STATE.md`; what belongs here is the database layer.

| File | What |
| --- | --- |
| `20260814_content_renditions_variant.sql` | `variant` column; unique key becomes `(asset_id, platform, format, variant)` **`NULLS NOT DISTINCT`** |
| `20260814_content_metrics_carousel_and_video.sql` | `saves`, `reach`, `video_views`, `watch_seconds` |
| `20260814_content_channels_instagram_carousel.sql` | one registry row, `in_plan = false` pending Keith's ruling |

**`NULLS NOT DISTINCT` is the load-bearing clause and Postgres 17 is what allows it.** The default
treats nulls as distinct, so a plain four-column key would have silently weakened the old
one-row-per-`(asset, platform, format)` guarantee for the 44 renditions that carry no variant.
**Both directions were proved against the live database** inside a transaction that was then rolled
back: a duplicate null-variant insert is still refused, a second row differing only by variant is
allowed.

**`database/schema/baseline-2026-08-14.sql` was RE-DUMPED after the migrations ran** and its header
now names them, because the baseline and the migrations carry the same date and the ordering could
not otherwise be inferred from the filenames. Object counts re-verified against the live catalogue
and unchanged (29 tables, 6 views, 8 functions, 19 triggers, 11 enums, 24 policies, 29 RLS-enabled,
95 indexes), which is the expected result for column additions and a one-for-one constraint swap.
**The two schema migrations are already in the baseline; the channel-row one is not**, because a
`--schema-only` dump carries no data.

**`lib/supabase/types.ts` regenerated** and carries `variant`, `saves`, `reach`, `video_views` and
`watch_seconds`. App typecheck 0 errors. **`npm run typecheck:scripts` still fails on the same two
PRE-EXISTING `doctor-heartbeat.ts` errors** and nothing new; that is Phase 2.1's work.

## New `panel` pillar for Kit 3, and a two-minute 500 on a published article (2026-08-13)

**`lib/content/kitCTA.ts` gained a `panel` pillar** → `/kits/hormone-recovery`, Kit 3, label "See the Hormone & Recovery Check" (Keith, 2026-08-13). It existed for `how-to-read-blood-test-results`, whose CTA had nowhere correct to point: every other pillar resolves to Kit 1, Kit 2 or the waitlist, and routing whole-panel intent at a four-marker kit is the "nearly match" the map's own comment warns against. Kit 3 is what CA-031's approved mapping names for that topic and what close B on the same article already says. **Both carousel-relevant CTAs now carry UTM tagging**, which the hard-coded `ctaHref` form silently skipped.

⚠️ **Incident, self-inflicted, resolved: `/blog/how-to-read-blood-test-results` returned 500 for about two minutes.** The article body (in `blog_articles`) was switched to `pillar="panel"` **before** the code that defines that pillar had deployed, so `resolveKitCTA` threw at render. Reverted the body within the minute, confirmed 200, then re-checked **all 18 published articles at 200** before continuing. _(Count corrected 2026-08-14, from 19: `blog_articles` holds 19 rows but one, `cortisol-belly`, has been a draft since it was created on 2026-08-07 and has never been published — `published_at` is null and `updated_at` equals `created_at`. The original figure counted rows rather than published rows. This was invariant I7's only live violation.)_ **The DB write is instant and the deploy is not, so the two cannot be one step.** Correct order, used for the redo: deploy the code, verify it, then switch the content. Recorded as OBS-219.

**The obvious deploy canary was useless here and that is the reusable part.** A client-chunk fingerprint on the article page sat unchanged through **ten polls over five minutes**, because `kitCTA.ts` is server-side and never reaches a client bundle: the probe could not have moved regardless of deploy state, and ten flat readings are indistinguishable from a failed deploy. What settled it was **the new capability as its own probe** — the resolved CTA emitting `/kits/hormone-recovery?utm_source=blog&utm_medium=article&utm_campaign=how-to-read-blood-test-results`, a string only the new build can produce.

**`npm test` does not currently pass, and it did not before this session either.** Three pre-existing typecheck errors in `scripts/content-engine/doctor-heartbeat.ts` (2) and `metricool-schedule.ts` (1), identical at `cc51f1b`. The suite aborts at typecheck, so **every test after it silently does not run** — which is how a real failure in `test-kit-cta.ts` went unnoticed until it was run standalone. Worth fixing, because a suite that stops at the first gate is not a suite.

---

## Two published articles gained kit CTAs, and the repo mirror was found behind live (2026-08-12)

**Live content change, made directly to `blog_articles`** because there is no repo-to-DB push path for article bodies: `content-sync.ts` only mirrors DB state INTO the repo and issues no writes. The DB is authoritative for what a reader sees; `06_marketing/seo-ai-search/article-drafts/*.mdx` is a mirror.

**What changed**, both rows written with an audit revision (`blog_article_revisions.editor = k2-close-c-kit-cta-2026-08-12`), guarded so a non-matching string would have been a no-op rather than a partial write:

- **`free-androgen-index`**: its existing closing kit ask wrapped in `<InlineKitCTA ctaHref="/kits/testosterone">`. Destination unchanged, it was already correct.
- **`how-to-read-blood-test-results`**: closing **test-selector** ask replaced with a Kit 3 CTA (`/kits/hormone-recovery`, nine markers, no price). The selector link was **moved up** into the "Which test should you take?" section, because that CTA was the article's only `/test-selector/` link and deleting it outright would have removed the route.

Driven by **K2 on CA-034**: close C of the carousel run lands on these articles, and the run now tests one offer at three distances. **10 of 10 carousel articles now carry the component**, verified by query, and **both pages were checked as rendered images** at the CTA, not as stripped HTML.

✅ **Mirror re-synced and clean. An earlier version of this entry overstated the problem and is corrected here.**

**The git mirror is `frontend/content/blog/*.mdx`, and it has a keeper: `scripts/content-engine/sync-mirror.ts`.** DB is the source of truth, the script is body-only (frontmatter kept verbatim), it writes only on a genuine difference, and it runs after the orchestrator tick. Before tonight **all published articles were in sync**. *(Count corrected 2026-08-15: this line read "all 19 published articles"; the database has **18** rows at `status = 'published'` and the mirror holds 18 `.mdx` files. The 19th is `cortisol-belly`, which is a **draft** and shows on `/blog` in dev only, because `SHOW_DRAFTS` in `lib/blog.ts` is `NODE_ENV !== 'production'`.)* The two DB writes above put exactly those two files out of sync; `npx tsx scripts/content-engine/sync-mirror.ts` restored them and a re-run reports **"mirror already in sync"**.

**What was actually stale is a different directory.** `06_marketing/seo-ai-search/article-drafts/free-androgen-index.mdx` still carried the pre-K1 FAI wording. That is the **drafting workspace**, not the mirror: nothing syncs it, it is not slug-aligned (pillar-named files, a dated `-reopt-2026-07-30` variant, two `myth-of-normal-range` copies, no `why-am-i-always-tired`), and it is not expected to track live. **So the packet's live-versus-mirror caveat was already discharged by tooling I had not found**, and the "eight undiffed articles" risk recorded earlier did not exist.

⚠️ **The residual is smaller and real: `article-drafts/` is a trap for anyone drafting derivatives.** It reads like a per-article source, it is where a search for `<slug>.mdx` lands first, and its copies can be arbitrarily far behind live. That is exactly how the pre-K1 FAI wording was picked up here. **Derivative work should source `frontend/content/blog/<slug>.mdx`**, which the carousel pre-flight correctly did (`--source frontend/content/blog/<slug>.mdx`).

**Two schema facts worth keeping**, both contradicting the CA-034 packet: `blog_articles` has **no `has_kit_cta` column** (the real test is whether `body` contains `InlineKitCTA`), and **`current_revision_id` is stale on both rows**, pointing at revisions whose body matches neither the live body nor the newest revision. The 2026-08-10 voice pass also inserted revisions without repointing it, so this is existing practice rather than damage introduced here, but the pointer cannot currently be trusted to identify the live body.

**And one process fact, learned the slow way.** There was no need to hand-write the mirror update: `sync-mirror.ts` does it, correctly and body-only. It was not found because the search went looking for a repo-to-DB **push** path (which genuinely does not exist, and `content-sync.ts` says so loudly) and stopped there, rather than for a DB-to-repo **export**. **Both directions exist as scripts and they are not the same question.** `import-blog-to-db.ts` and `export-blog-from-db.ts` are the other two.

---

## Two live copy defects the carousel pre-flight found in the app, both fixed and verified (2026-08-12)

Neither was in the carousel. Both were in the product the carousel points at, and both were found only because the per-post pass followed the destination rather than stopping at the slide.

- **The test-selector routed fatigue readers to a testosterone-only kit.** Q1 option (a) read *"I am knackered, my drive has gone, or I just do not feel like myself anymore"*, which is two presentations in one option, so a brain fog, B12 or tiredness reader picked it, answered desk-based on Q2, and `getResult` returned **Kit 1**. That is what **CA-025** forbids. Fixed by splitting the option, not rewriting the map: (a) narrowed to the hormonal presentation, new stored value `d` for the fatigue picture routing to **Kit 2**, every existing branch untouched. **Approved as CA-033** (Keith, conditional on this fix; Ewa not required because the remedy removes the out-of-scope outcome rather than accepting it). `scripts/test-quiz-routing.ts` added, 21 assertions, wired into `npm test`; the map had **zero** coverage before. **Verified live** on build `vgLPXfPWVcFM2ESumkN3o`, on the plain URL as well as a cache-busted one.
- **The Kit 1 landing page graded the one marker the engine refuses to grade.** It rendered FAI as `36.9` with a **`Borderline`** badge, beside Total T `Borderline` and SHBG `Normal`, on a value just above the lab floor of 35.0, so it read as a near-miss finding. `classifier.ts:295` maps FAI to `fai-reported`, whose copy is *"Reported for reference, not interpreted"*, returning no CTA and excluded from vetoing an all-clear. Badge → **`Not interpreted`** (grey, dashed), subtitle "Bioavailable testosterone ratio" → "Ratio of total T to SHBG". **Keith ruled FAI stays on the panel** (the lab returns it, the customer receives it, we do not interpret it), so **nothing was deleted**. **Verified live**: new strings present, old subtitle absent, on the served page.

⚠️ **`/test-selector` carries `cache-control: s-maxage=31536000`, a one-year edge cache.** It behaved on both deploys, but on a page whose copy changes for compliance reasons that header is a standing risk. Not actioned.

⚠️ **Deploy verification lesson, recorded because it cost three attempts.** A build-ID canary reported a false positive: the baseline had gone stale behind an intervening push, so it flipped for the *previous* commit's build. Only the copy assertion beside it caught that. **Watch the changed string, not a build fingerprint** — and an earlier attempt watched a content-hashed chunk filename, which cannot change when a commit touches no frontend source, so it could only ever have reported failure. (`OBS-212`.)

---

## `/go` link-in-bio grid for the carousel run: LIVE (2026-08-11)

Attribution surface for the 30-day Instagram carousel run (design + metrics in `06_marketing/STATE.md`; copy approved as CA-031). **Deployed and verified on the real deploy**, commit `c69dff5`.

**Verified live, not inferred from the push:** `/go` serves 200; the served HTML carries `<meta name="robots" content="noindex, nofollow">`; `/go/start` 307s to `/test-selector` tagged `utm_term=unmatched`; `/go/d05` 307s to **`/kits/energy-recovery`** tagged `close-B`, which is `why-am-i-always-tired` routing to Kit 2 rather than Kit 1, so the CA-025 scoping rule holds in production and not only in the doc; `/go/d06` 307s to `/blog/brain-fog` tagged `close-C`. Rendered at a true 390px mobile viewport with `document.scrollWidth === window.innerWidth === 390`.

**BOTH DONE (Keith, 2026-08-12):** `CAROUSEL_RUN_START` is set in Coolify to **`2026-08-17T12:00:00Z`**, buildtime and runtime both ticked, and the `keith.antony.ai` Instagram bio is pointed at `/go` and tested by Keith.

🔵 **RESOLVED 2026-08-15: Ewa HAS signed off the 30 posts. The sentence below is stale and is kept as the record of the risk as it stood on 2026-08-12.** The posts were approved as **CA-034** (7 of 7 ruled) and the captions as **CA-035**, both in the register and both `approved` on the board. Do not read the line below as a live blocker.

🔴 **THE RUN START MOVED IN, from 2026-09-01 to 2026-08-17 (Keith, 2026-08-12).** That is **five days** from the decision, not twenty. It compressed everything still owed before day 1, and the binding one was not code: **Ewa had not signed off the 30 posts.** CA-031 and CA-032 approved the close templates and the headline rows; neither covers the posts. Nothing may ship without that signature, and it now has a five-day window.

⚠️ **Two consequences, neither obvious from the page.**

1. **The run start is now a posting constraint, not just a config value.** `visiblePosts()` reveals day 1 at the anchor instant and each later day exactly 24h on, so **nothing may be posted before 2026-08-17 12:00 UTC** (13:00 BST), and each daily post should go out at or after that time of day. Post earlier and the tile a reader taps through for does not exist yet.
   ✅ **HONOURED IN THE SCHEDULE, 2026-08-13.** All 30 Metricool posts are set to **13:00 Europe/London**, exactly the anchor instant on day 1 and +24h thereafter. This constraint was load-bearing in practice, not just on paper: Keith asked for the run to start "after 12 a.m." on the 17th, which would have put **every** post 12 hours ahead of its own tile for the whole run. It was reconciled onto the anchor rather than by moving `CAROUSEL_RUN_START`. **If the anchor ever moves, `06_marketing/content/instagram/carousel-prototype/schedule.js` moves with it** — its `--check` asserts day 1 is 2026-08-17 13:00 London and fails the build of the schedule otherwise, so the two cannot drift apart silently.
2. **The live page cannot confirm the variable arrived**, so do not read it as verification. `/go` currently serves *"Nothing posted yet. In the meantime, three questions will point you at the right test."* with a `/go/start` CTA, and that is the identical output for BOTH `RUN_START_ISO` unset AND set to a future date, because `visiblePosts()` returns `[]` on either. The two states are indistinguishable from outside. It resolves either after a deploy plus a check past 2026-08-17, or by reading the running container's environment. The empty state is a designed fallback with a working CTA, not a dead end, which softens the per-post pre-flight's C1 finding without clearing it.

- **`app/go/page.tsx`** renders one tile per posted day, newest first, mirroring how the Instagram grid reads. **`app/go/[slug]/route.ts`** records the click server-side then 307s to that post's destination with UTMs stamped (`utm_content` = post, `utm_term` = close). **`lib/bio-grid.ts`** holds the ten topics, the three closes and the rotation.
- **The bio link is set ONCE and never rotated, and that is the whole point.** Rotating it daily was the first design and it is wrong: Instagram keeps surfacing a post for days, so a day-3 post collects clicks on day 8 when a rotated link points at a different close. Late clicks would attribute to the wrong close, and the later the click the more wrong. Each post instead owns a permanent `/go/<slug>`.
- **Two new server-side events**, `bio_grid_view` and `bio_tile_click`. Server-side deliberately: the traffic arrives in Instagram's in-app browser, the worst place to depend on client JS, and a tile click is a redirect that must be recorded before the user leaves. The pair separates "the post was interesting" from "the offer was interesting".
- **Titles are read from `blog_articles` via `getAllArticles()`, never from the repo MDX**, and that decision was load-bearing rather than tidy. The MDX mirror still carries the pre-correction Free Androgen Index headline that the 2026-07-30 ruling overturned, so hardcoding titles would have put a retracted framing on a live page. Reading through means a re-titled article corrects itself.
- **`noindex` via page metadata, and deliberately NOT added to `robots.ts` disallow.** A disallowed page cannot be crawled, so the crawler never reads the noindex and the page can still be indexed from an inbound link. The two are mutually exclusive; this picks the one that works. It is absent from `app/sitemap.ts` already, which is an explicit allowlist.
- **An unknown slug redirects to the quiz rather than 404ing**, and records the miss. A bio-link tap that dead-ends is a lost visitor; the quiz is the ratified cold-traffic destination anyway, so the failure degrades to the default instead of to nothing, and a broken tile shows in the data rather than as silence.
- **Verified: `tsc --noEmit` clean, `compliance-preflight` 0 HARD / 0 REVIEW, and rendered at a true 390px mobile viewport** with `document.scrollWidth === window.innerWidth === 390`, so there is no horizontal overflow hiding behind `body{overflow-x:hidden}`. The rotation was read off the render: closes cycle A/B/C up the page with no topic repeating.
- **Screenshot method note, because it produced a false defect.** `chrome --headless --window-size=W,H --screenshot` does **not** set the layout viewport: it lays out wider and crops to W, so a narrow capture shows clipped text that is not clipped in a real browser. The first `/go` capture looked broken; an existing known-good page clipped identically at the same width, which is what identified the tool rather than the page. Use `Emulation.setDeviceMetricsOverride` over CDP (Node 24 has a global `WebSocket`, so no npm dependency is needed).
- **~~OWED before the run~~ DONE 2026-08-12:** `CAROUSEL_RUN_START` is set in Coolify to `2026-08-17T12:00:00Z` and the Instagram bio points at `/go`. Unset still renders the empty state by design rather than exposing the unposted schedule, which is why the served page cannot distinguish "set to a future date" from "never set". See the run-start block near the top of this file for the posting constraint that date creates.
- **Flagged, Keith's call:** the site-wide cookie banner covers the top two tiles on first visit. Everywhere else that is cosmetic; here the top tile is the newest post, which is the single thing most visitors arrive looking for.

## The `/waitlist` page was still a pre-launch page, months after launch (2026-08-07)

Found by Keith opening the destination of a new article's call-to-action. **`/waitlist` told every
visitor the brand was "launching soon" and listed Kit 1, Kit 2 and Kit 3 under a "What's coming"
heading, at the exact prices they are buyable for today.** Verified against reality before touching
anything: `/kits` serves all three at £99 / £119 / £179, HTTP 200, with live buy paths.

**Four live articles funnel readers into that page** and inherited the claim:
`cholesterol-test`, `liver-function-blood-test`, `signs-of-stress-in-men` and `thyroid-test`, plus the
`cortisol-belly` draft now with Ewa. They route via the `metabolic` / `liver` / `stress` / `thyroid`
pillars in `lib/content/kitCTA.ts`, which hold at email capture **by design** because no live product
matches those intents. **The routing was correct and is unchanged; the page's premise was what had
gone stale.**

**Fixed in `app/(marketing)/waitlist/page.tsx` and `components/marketing/WaitlistForm.tsx`:** the hero
now leads with "The panel you want isn't on the list yet" and states that three checks are available
now; the panel is relabelled **"Available now"** with each kit linked to its own page and a line
saying these three ship today; the form success message points at `/kits` instead of promising to
email when the brand launches; the page metadata, the "Early Access" badge and the "Early access"
trust item are all corrected.

- **No future product is named.** Kit 3 Plus and Kit 5 Thyroid are next in the locked sequence but
  their May timings have passed, and **Kit 6 Cortisol is parked** pending Vitall on dried-blood-spot
  viability. Naming any of them would have recreated the same failure one product later. The page now
  promises a category, not a roadmap.
- **Consent copy changed, flagged deliberately.** The opt-in label moved from "Email me launch updates
  and early-access offers" to "Email me when new panels launch, and occasional offers." Same
  processing purpose, no scope change, but it is the record of what subscribers agree to and is worth
  a solicitor's eye at the next review.
- **Verified on a real render, not a typecheck.** Screenshotted the served page on the dev server.
  **The screenshot caught two stale claims a grep had missed** (the "EARLY ACCESS" trust badge and the
  consent line), which were then fixed and re-shot. Final rendered sweep: zero hits on every stale
  phrase, zero em dashes, all three kit links present.

**The wider lesson, and it is not fixed by this change.** The article's own call-to-action wording was
correctly scoped to the one unlaunched thing and passed `compliance-preflight` cleanly. The pass
checks the copy under review; nothing checks the page that copy links to. **A shared destination is
the highest-leverage place for a stale claim to hide, because nothing that links to it changes when it
goes stale.** Recorded in the task-observer log as an extension needed to the availability check.

## Results engine: four defects closed, two new bands built (2026-08-07)

Triggered by Vitall confirming their per-assay reference ranges on 2026-08-06, which made several
long-standing gaps visible for the first time. Commits `56f3a5e`, `1ce4850`, `56b8ff9`. Full
reconciliation: [`05_partners/labs/vitall/2026-08-06-analytes-reconciliation.md`](../05_partners/labs/vitall/2026-08-06-analytes-reconciliation.md).

**1. Free Androgen Index was asserting normality for every value.** Ewa's ruling is report-only, and that
was implemented by leaving FAI out of the classifier, so it fell to a `default` branch that badged the card
"Optimal", headed its footer "Keep it up", and told the customer "within the normal range / no action is
needed" for any number, including below the lab's floor of 35.0, while the bar rendered it red. Those
strings also print on the **CSV export and the GP handoff sheet**. Now a dedicated `fai-reported` state:
no badge verdict, no traffic-light bar, no CTA. Wording approved by Ewa 2026-08-07 ("fine for now").

**2. An all-clear result badged every marker "Action Needed".** The badge was a switch with a default, and
eight of twenty-eight states had no case; five of them mean the result is fine. A clean Kit 2, the most
common result we will ship, showed four black alarms on four in-range markers. Now an exhaustive
`Record<ResultState, BadgeConfig>`, so a new state cannot be added without deciding its badge, verified by
adding a throwaway state and confirming the build fails. Runtime fallback now fails quiet, not loud.

**3. Two new GP-routed upper bands** (Ewa, 2026-08-07): testosterone `> 29`, vitamin D `> 250`. See
`04_products/STATE.md` for her ruling.

**4. The bands were not a classifier-only change, and this is the one that would have hurt.**
`isTestosteroneAllClear()` and the vitamin D leg of `results_all_clear` had no upper bound either, and both
feed **Customer.io**. A man at 35 nmol/L would have been GP-referred on his dashboard while simultaneously
being enrolled in **seq-03c, the reassurance sequence for normal results**. Both closed here.

Also: SHBG fallback moved off a generic 17-55 onto Vitall's 20.6-76.7; Active B12's `>37.5` reference range
now renders on the card (it was the only marker showing none, because the display keyed on the upper bound
alone); testosterone card copy corrected to the real range; the unit guard now folds micro-sign variants;
an unmapped marker warns instead of being silently dropped; all fixture ranges aligned to the real assay,
including B12's invented upper bound, which is what hid defect 2 from QA.

**Regression coverage went from 26 assertions to 34**, pinning both new cut-points, the GP routing and the
Customer.io signal. `npm test` still cannot run end to end: it dies at its first step, `typecheck:scripts`,
on three PRE-EXISTING errors in content-engine scripts (`doctor-heartbeat.ts` x2, `metricool-schedule.ts`)
that have nothing to do with the results engine. **The results suites had to be invoked directly.** Worth
fixing on its own: the guard protecting the results engine sits behind an unrelated broken typecheck.

**Found in passing and fixed:** the results card still told a normal-testosterone customer the Daily Stack
provides "30mg of elemental zinc". Ewa cut it to **25 mg** on 2026-08-02 and `daily-stack.md` records that
as applied to "all three site surfaces the same day". The results engine was not one of the three. The LP
was already correct.

## DEPLOYED 2026-08-04: `order_ref`, `is_test`, one base-URL helper

The three items left open by the £9900 pass, plus the base-URL duplication.
**Shipped in commit `b85b810` and VERIFIED LIVE 2026-08-04**: `GET /order/confirmed`
returns the new order-reference block ("Your order reference", "confirmation email we have
just sent"), neither of which existed anywhere in the codebase before this change.
Migrations were applied to prod Supabase ahead of the deploy, which is the required order:
the code selects `order_seq` on the kit-order insert, so shipping it against a table
without the column would have broken order creation.

**The live Customer.io template was swapped after the deploy and is done** (below), so the
chain is complete end to end: a kit purchase now emits `order_ref`, the confirmation email
renders it, and the customer can find it again on `/order/confirmed`, on `/account`, or by
quoting it to support. Nothing on this item is outstanding except seeing one real purchase
through.

**Verification note worth keeping: the Sentry releases endpoint is not a deploy signal.**
It still showed the previous commit nine minutes after the new build was demonstrably
serving, because a release row is created by the sourcemap-upload step, not by the deploy.
Use a two-sided page canary against the live URL; treat the release list as evidence about
sourcemaps only.

### `order_ref`: customer-facing order reference, BUILT

Built to `docs/2026-08-04-customer-facing-order-reference-spec.md` (option B, our own
sequence, not Vitall's number).

| Piece | Where |
| --- | --- |
| `kit_orders.order_seq` (identity, live base 10000) | migration `20260804_kit_orders_order_seq.sql` |
| `AP-{order_seq}` rendering + `parseOrderRef` for support lookup | `frontend/lib/orders/orderRef.ts` |
| `order_ref` on the `purchase` event | `app/api/webhooks/stripe/route.ts` (kit branch) |
| `Order ref: {{ event.order_ref \| default: event.order_id }}` | `email-templates/html/transactional-t01-order-confirmed.html:46` (spec) **and CIO template 38** (live) |
| Reference shown on `/order/confirmed` | `app/(marketing)/order/confirmed/page.tsx` + `lib/orders/getOrderRefForCheckoutSession.ts` |
| Reference shown per order on `/account` | `lib/account/getAccountData.ts` + `app/(app)/account/page.tsx` |
| Support lookup by reference / email / Vitall id | `lib/admin/findOrders.ts` + `app/admin/dashboard/page.tsx` |

`order_id` (the UUID) is still emitted: it is the join key for downstream events and
Vitall's `partnerOrderId`. It is just no longer the thing a human is asked to read out.

**Support lookup, the other half of the reference.** `AP-10042` is only worth anything if
whoever the customer quotes it to can find the order, and there was no order-search surface
anywhere. `/admin/dashboard` now has one. It classifies the query by shape rather than
making support choose a field: digits with an optional `AP` prefix are a reference (`AP-10042`,
`ap 10042`, `10042` all parse), an `@` means email, anything else is treated as a Vitall order
id for when the conversation is with Ben rather than the customer. It runs on the service-role
client, because support is looking up somebody else's order by definition and RLS would return
nothing. Test orders are badged in the results so a process test is never mistaken for a sale.

**Found while building it: `/auth/post-checkout` dropped `session_id` on the way back.**
It redirected to `failureUrl`, which carries no query. A first-time buyer always goes
through that route, so the confirmation page could never have resolved a reference for the
one customer who most needs it. It now preserves `session_id` and stamps `post_checkout=1`,
and the page treats that stamp as "sign-in already attempted" so the pair cannot loop.

**Live-DB state after backfill** (verified by query, not inference):

| `order_seq` | `vitall_order_id` | `is_test` |
| --- | --- | --- |
| 1 | 322942444 | true |
| 2 | 322942529 | true |
| 3 | 322947256 | true |

Live orders start at **AP-10000**, above the test rows, so no real customer is handed a
reference that reads like an internal test. Verified on the sequence itself
(`last_value 10000, is_called false`), not assumed from the migration.

**The migration did not work as first written, and the fix is worth keeping in mind for any
future identity backfill.** `add column ... generated by default as identity` hands the
existing rows `1..N` immediately, in arbitrary order, so the backfill that then assigns the
same range collides against `kit_orders_order_seq_key`: Postgres checks a unique index row by
row, not at end of statement, and the first attempt failed on `duplicate key value ... Key
(order_seq)=(1) already exists`. It now runs in two passes, parking the values in the negative
range to free `1..N` first. The file was edited rather than superseded because the failed
attempt rolled back, so no version of it had ever run.

Second sharp edge, not in the spec: `restart with 10000` moves the sequence's CURRENT value
but leaves its `start_value` at 1, so a later bare `restart` would have dropped straight back
into the test range. The floor is moved by its own migration,
`20260804_kit_orders_order_seq_start_floor.sql`, which runs next in filename order.
Verified in prod: `start_value` is 10000.

### DONE 2026-08-04, after the deploy: the live Customer.io template

The live T-01 content lives in CIO (campaign 11 → action 82 → template 38) and is what
customers actually receive; the repo HTML is only the spec. Template 38 now reads:

```liquid
Order ref: {{ event.order_ref | default: event.order_id }}
```

**The sequence was deliberate: code deployed first (`b85b810`), template swapped second.**
Swapping first would have left `event.order_ref` undefined on any order placed in between.

**And it is a `default:` fallback rather than a bare swap**, in both CIO and the repo HTML,
so the one bad outcome is unreachable: if `order_ref` is ever missing or empty the line
renders the UUID, which is exactly the behaviour that shipped for months, instead of "Order
ref:" followed by nothing on a receipt. `order_seq` is an identity column so it should never
be empty; the fallback costs nothing and removes the need to be right about that.

Verified after the write, not assumed: body length is the original 5576 plus exactly the 27
characters added, and the tag counts (14 paragraphs, 3 tables, 5 `<td>`, 4 Liquid outputs, 9
Liquid tags), the merge-field order, and the subject all match the pre-edit template.

**Still worth one real purchase** to see an `AP-1000x` land in an inbox end to end. Nothing
is blocked on it, and the fallback means a bad outcome degrades to the old UUID rather than
to a blank.

### `is_test`: internal orders no longer count as sales, BUILT

`kit_orders.is_test` (migration `20260804_kit_orders_is_test.sql`), set true on the three
process-test rows. Every KPI view that counts kit orders now filters it out:
`v_gate_tracker.total_kits_sold`, `v_weekly_kit_sales`, `v_kit_pipeline`, and
`v_result_to_supplement_conversion` (joined through `lab_results.order_id`).
`v_gate_tracker.total_kits_sold` **went 2 → 0**, which is the true Gate 0A count.

Nothing in the app writes `is_test`; it is set by hand. Any NEW view over `kit_orders` has
to carry the filter; the reminder is in the header of `database/views/pipeline_overview.sql`.

### Base-URL helper: nine copies, now one, BUILT

`process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andro-prime.com'` was pasted into nine
modules with three different spellings of the fallback (`??`, `||`, and one
`http://localhost:3000`). Now `frontend/lib/site-url.ts` exports `SITE_URL` (trailing slash
stripped) and `siteUrl(path)`.

Three callers deliberately did **not** collapse, and each now carries a comment saying why:

- `app/auth/callback/route.ts` and `lib/auth/actions.ts` resolve the origin from the
  request first (x-forwarded-host / Origin) so preview deployments work; they only use
  `SITE_URL` as the fallback.
- `app/layout.tsx`'s `BASE_URL` stays the hard-coded production origin because schema.org
  `@id` values are stable global identifiers and must not change on a preview host.
  `metadataBase` on the same file is the one that follows `SITE_URL`.

Out of scope and left alone: `scripts/content-engine/*` (different precedence,
`CONTENT_ENGINE_BASE_URL` first, and its own env loader) and the deprecated
`lib/activate/sendActivationLink.ts`.

### The `/order/confirmed` hydration error: the previous diagnosis was wrong

Pulled the actual events from Sentry rather than reasoning from the code. `JAVASCRIPT-NEXTJS-7`
is **39 occurrences spread across the whole site**, not a `/order/confirmed` problem:

| Transaction | Count |
| --- | --- |
| `/blog/preview/:slug` | 14 |
| `/blog` | 11 |
| `/blog/:slug` | 6 |
| `/kits/*` | 6 |
| `/checkout/details` | 1 |
| `/order/confirmed` | **1** |

**So the auth-branch theory is falsified.** `/blog` and `/kits/testosterone` have no auth
branch and no client state, and they fail identically to the pages that have both. Every
event is Chrome (148 then 150) on Windows with no user attached, and 14 of them are on
`/blog/preview/*`, a Keith-only route. That is the documented browser-extension case:
something writes attributes onto the document element before React hydrates.

**Done:** `suppressHydrationWarning` on `<html>` and `<body>` in `app/layout.tsx`. React
only suppresses one level deep, so this silences the extension's attributes without hiding
a genuine mismatch inside any page. The previously-proposed "small redesign of
/order/confirmed" is **not** the fix and was not done.

**CONFIRMED by Keith 2026-08-04.** He loaded `/blog` in an incognito window with extensions
off. The page rendered normally **and Sentry recorded no new `JAVASCRIPT-NEXTJS-7` event**;
its last occurrence is still `2026-08-04T19:05:11Z`, which predates both the mitigation
deploy and the incognito load. The extension diagnosis stands and the auth-branch theory is
dead. No engineering work follows.

The Sentry check was the part that mattered: React recovers from a hydration mismatch, so
the page looks identical whether or not one fired, and a screenshot alone could not have
settled it.

**One caveat for the next reader, because it changes what this issue's silence means.**
`suppressHydrationWarning` on `<html>`/`<body>` means attribute-level mismatches injected
before hydration no longer report at all, so Sentry going quiet on this issue is now the
expected state regardless of cause and is no longer evidence of anything. React suppresses
only one level deep, so a genuine mismatch INSIDE a page would still surface, as a new
issue rather than as this one.

**Optional tidy-up, BLOCKED ON TOKEN SCOPE, needs Keith:** resolving `JAVASCRIPT-NEXTJS-7`
so it drops out of the unresolved count. Attempted 2026-08-04 and refused:
`PUT /api/0/organizations/andro-prime/issues/120214399/` with `{"status":"resolved"}`
returns `403 You do not have permission to perform this action`, and reading the issue back
confirms it is still `unresolved`. **The `SENTRY_AUTH_TOKEN` in `frontend/.env.local` is
read-only.** It carries issue-READ scope; resolving, ignoring, assigning and commenting all
need `event:write` / `issue:write`. Either click resolve in the dashboard, or issue a
write-scoped token if this should be automatable.

Gates: `tsc` clean, `npm run build` exit 0, `npm test` exit 0 (0 failed across all suites).

---

## FIXED 2026-08-04: every kit order confirmation told the customer they had been charged £9900

Found by Keith reading his own confirmation email from the Kit 1 process test. `Amount: £9900`
for a £99 kit. Kit 2 would have read £11900, Kit 3 £17900.

**Cause.** Stripe holds money in integer pence. The t01 template renders the value literally:

```html
email-templates/html/transactional-t01-order-confirmed.html:47
  Amount: &pound;{{ event.amount }}
```

`app/api/webhooks/stripe/route.ts` has a `formatGbp()` helper for exactly this, and its own
comment says *"Templates render `£{{ amount }}`"*. **The kit-purchase emit was the only one of
four that failed to call it:**

| Line | Event | Before |
| --- | --- | --- |
| ~322 | kit purchase | `amount: session.amount_total` ← **raw pence** |
| ~377 | supplement purchase | `formatGbp(...)` ✅ |
| ~414 | invoice paid | `formatGbp(...)` ✅ |
| ~447 | invoice due | `formatGbp(...)` ✅ |

**Fixed at the emit, deliberately not at the template.** The template is shared with the three
sibling emails that already pass a formatted value; changing it would have broken those. The
emit now calls `formatGbp()` and carries a comment saying why it is required.

Gates: `tsc` clean, `npm run build` clean.

**Reach:** every kit order confirmation sent to date. In practice that is the three internal test
orders, since no external customer has bought yet, so no real customer saw it. It would have hit
the first one who did.

### Raised in the same pass, specced not built. ALL THREE NOW BUILT 2026-08-04, see the entry at the top of this file

- **`order_ref`, a customer-facing order reference.** The same email shows
  `Order ref: 1b429c90-8a80-4c7e-85fb-5873660489fd`, a raw UUID, which is unusable down a phone.
  Full spec with options considered: `docs/2026-08-04-customer-facing-order-reference-spec.md`.
  Recommendation is our own `AP-10042`-style sequence, **not** Vitall's order number: theirs is
  not yet written when the confirmation email fires (the dispatch is a separate fire-and-forget
  call made after the emit), and the lab is expected to change to TDL in ~18 months.
- **`/order/confirmed` shows the customer no reference at all.** Verified: the page reads
  `session_id` from the query string and renders nothing from it. Close the email and there is no
  way to find your order.
- **Still no `is_test` flag in the schema.** Three internal test orders now sit in `kit_orders`
  (`322942444` cancelled, `322942529`, `322947256`) with nothing distinguishing them from sales.

---

## P0 FIXED 2026-08-04: a prefetched GET logout was signing customers out seconds after checkout

**Found by Keith running a real Kit 1 purchase through live checkout.** He was thrown to `/auth/login?error=Invalid login credentials`, then the dashboard white-screened on the password banner. Both symptoms, one root cause.

**Root cause.** `app/auth/logout/route.ts` was a **GET** handler that called `signOut()` unconditionally, linked from `Nav.tsx` and `AppPlaceholder.tsx` as an ordinary `<Link>`. Next.js prefetches links that enter the viewport, and the app nav is `fixed`, so the Log Out link was permanently visible and permanently prefetched. **The browser signed the user out with no click at all.**

Evidence, not inference:

- **Supabase auth log:** login `15:43:15` (magic link, post-checkout) → `logout` `15:43:41`, 26 seconds later, user-initiated: no. Then `POST /token grant_type=password` → `400 invalid_credentials` at `15:46:42`.
- **Sentry `JAVASCRIPT-NEXTJS-V`** breadcrumbs show `?_rsc=` prefetch GETs to the sibling nav links (`/subscriptions`, `/account`) plus a third `[Filtered]` one. The app nav has exactly three links; the third is Log Out.
- **No `PUT /user` anywhere in the auth log**, so the password the customer "set" was never written. `auth.users.updated_at` confirms it.

**Second symptom, same cause.** With the session dead, the banner's X (dismiss) also white-screened. Both dashboard actions call `revalidatePath('/results-dashboard')`, which re-renders `app/(app)/layout.tsx`, which calls `requireAuthenticatedUser()`, which calls `redirect()`. `redirect()` throws, and **the app had zero `error.tsx` files**, so it fell through to `global-error.tsx`: an unstyled page with no branding and no way back. React surfaced it as *"An unexpected response was received from the server."*

**Fixed (7 files):**

| File | Change |
| --- | --- |
| `app/auth/logout/route.ts` | `GET` → **`POST`**, redirect 303. No GET export remains. Carries a do-not-reintroduce note |
| `components/shared/Nav.tsx` | Log Out is a POST form + button (desktop + mobile); other CTAs stay links |
| `components/app/AppPlaceholder.tsx` | Same; dropped the now-unused `Link` import |
| `app/(app)/error.tsx` | **NEW.** Branded boundary for the signed-in app; leads with "Sign in again"; surfaces the Sentry digest as a support reference |
| `app/error.tsx` | **NEW.** Root boundary for the marketing site |
| `lib/dashboard/actions.ts` | Both actions check the session **before** `revalidatePath`, returning "Your session has expired" instead of throwing |
| `components/app/PasswordBanner.tsx` | Dismiss awaits properly (the new return type broke `startTransition`'s void contract) |

Gates: `tsc` clean, `npm run build` clean, `npm test` green, compliance scan **0 HARD / 0 REVIEW** on both new customer-facing pages. Verified no `href="/auth/logout"` remains and the route exports only `POST`.

**The general rule, worth not relearning:** a GET must never destroy state. Prefetch is only the first thing to trip it; link scanners, antivirus and browser preload all issue speculative GETs.

### Still open from the same session

- ~~**`/order/confirmed` hydration mismatch.** The page branches on `isLoggedIn` (lines 96, 99) while the post-checkout flow changes that state underneath it.~~ **SUPERSEDED 2026-08-04.** This diagnosis was wrong, and it was wrong because it reasoned from the code instead of reading the events. Only 1 of 39 occurrences is on `/order/confirmed`; the rest are spread over `/blog`, `/blog/preview/*` and `/kits/*`, which have no auth branch at all. See the entry at the top of this file for the tag breakdown and the actual fix.
- **Sentry read access is now available to tooling.** `SENTRY_AUTH_TOKEN` in `.env.local` was upload-only (`project:releases`); Keith replaced it with one carrying issue-read scope, so production exceptions can be pulled directly. Note it is org-scoped: use `/api/0/organizations/{org}/issues/{id}/events/latest/`, not the project-less path, which 404s.

---

## RESOLVED (2026-08-02, later the same day): the four strings below are fixed in the working tree, and one of the four was never a finding

Ewa signed the wording packet and Keith ruled the two business-status items, both by
email the same evening. **Shipped in commit `965b775` and VERIFIED LIVE 2026-08-02**,
two-sided across three pages: every old string absent AND every new string present on
`/`, `/how-it-works` and `/supplements/daily-stack`, with the deliberately-kept
"designed your report" heading confirmed still serving.

| String | Ruling | Now reads |
| --- | --- | --- |
| `EFSA Regulated` (Footer, every page) | Keith, 2026-08-02 | `EFSA-Approved Claims` |
| `GP-designed report` (homepage `HowTo` JSON-LD :45) | Keith: prohibited | "recommendation logic approved by a GMC-registered GP" |
| `GP-designed report` (homepage body :324) | Keith: prohibited | as above |
| `A real doctor designed your report.` (how-it-works) | **NOT a finding — left alone** | unchanged |

**The fourth row is the important one, and it closes a contradiction this file
created.** The entry below flagged that heading as non-compliant. The Ewa packet,
amended the same day, recorded the opposite: the 2026-07-07 ruling in
`clinical-governance-copy-corrections.md:141` approves "designed" as system-authorship
framing, and by then **two** independent site reviews had already re-flagged it in
error. This file made it three. **Keith's ruling settles it: "designed" as
system-authorship is fine; `GP-designed report` — the compound naming the GP as the
report's designer — is not.** Do not re-flag the heading.

**Also fixed in the same pass, from the Ewa packet (CA-030):** the "treated men" claim
about her (she does not treat, she sees — a live factual misstatement about a named
GP), her TRT/Harley Street credential line on two pages, the `GMC Registered Practice`
badge on `lp/daily-stack` plus the two `GP-Led Formulation` siblings, the
`Personalised to your data` labels on three surfaces, the attributed-quote wording on
three surfaces, and zinc 30mg → 25mg with the claim paraphrase deleted. Compliance
pre-flight run as a delta against the pre-edit baseline: **0 findings introduced, 1
HARD + 5 REVIEW removed.** Full rulings in
`03_compliance/content-approval/ewa-packet-2026-07-26-lp-clinical-wording-and-countersignature-backlog.md`.

### SUPERSEDED, kept for the audit trail: "FOUR non-compliant strings are LIVE on the site, found by review, not yet fixed" (2026-08-02, morning)

An on-page and AI-visibility review (`06_marketing/seo-ai-search/2026-08-02-on-page-ai-visibility-review.md`) flagged them and each was then confirmed in **live source**, not just in build output:

| String | Location | Reach |
| --- | --- | --- |
| `EFSA Regulated` | `frontend/components/shared/Footer.tsx:47` | **every page** |
| `GP-designed report` (inside the `HowTo` JSON-LD) | `frontend/app/(marketing)/page.tsx:45` | homepage, machine-readable |
| `GP-designed report` (body copy) | `frontend/app/(marketing)/page.tsx:324` | homepage |
| `A real doctor designed your report.` | `frontend/app/(marketing)/how-it-works/page.tsx:426` | how-it-works |

**EFSA does not regulate businesses**, so the badge asserts a regulatory status that does not exist, and it is in the footer, so it is on every page. **`GP-designed report` is prohibited framing** and one instance sits inside structured data, which is the worst place for it: machine-readable, and read by exactly the systems that quote a site back as fact. The compliant wording is already elsewhere on both pages: "Recommendation logic approved by a GMC-registered GP".

**Not fixed in this session, deliberately.** These are external-facing copy, so Guardrail #1 applies: route through `03_compliance/CONTEXT.md` before the replacement wording ships. The removals themselves are not judgement calls, but the replacements are.

**A detection lesson worth more than the four fixes.** The `how-it-works` instance is split across a `<br />`, so its text nodes concatenate without a space and an exact-string grep for the sentence does not find it. **Any prohibited-phrase sweep that greps for whole sentences will miss anything broken across markup**, which is most headings on this site.

## Eight published article bodies edited: dead editorial markers removed (2026-08-01)

`blog_articles.body` and the MDX mirror both edited for `14-signs-of-vitamin-d-deficiency`, `b12-blood-test`, `fbc-blood-test`, `ferritin-blood-test`, `how-to-increase-testosterone-naturally`, `liver-function-blood-test`, `low-vitamin-d-symptoms`, `thyroid-test`. Commit `67b9aa1`. Found by `content-doctor` invariant 6; the full audit trail is in `06_marketing/content-machine/STATE.md`, which owns this.

**No rendered output changed, and that was verified rather than assumed.** The markers were JSX comments, which are stripped at render. Proven by fetching `myth-of-normal-range`, whose benign `{/* CTA BLOCK */}` is **still** in the database and returns **zero** hits in the served HTML. So the standard two-sided served-page canary does not apply here: the removed string never appeared in the HTML to begin with, and "old string absent" would have been true before the edit as well. **No `/api/revalidate` call was needed or made.** Verification was done at the layer where the change actually is: `blog_articles` now returns 0 of 18 bodies matching any obligation marker.

**Worth keeping, because it will recur:** a change to `blog_articles.body` is not automatically a change to the page. Comments, frontmatter and anything the renderer drops are invisible downstream. **Before reaching for the served-HTML canary, establish whether the edited text can reach the HTML at all** — otherwise the check passes for the wrong reason and reports a deploy it never observed.

---

## Two live article CTAs corrected: they claimed we had not launched (2026-07-31)

Keith spotted the stress-article CTA. Both fixed in `blog_articles.body` (the served column), revision recorded, `current_revision_id` repointed, revalidated by slug, and verified two-sided against the served HTML: old strings absent, new strings present on both pages. Commit `e029278`.

- **`signs-of-stress-in-men`** said "No kit to sell you today" and "first to know when our men's-health checks launch". Three kits are purchasable (Stripe live, checkout E2E `869d99m5a` passed, all three kit pages serving with prices), so that was false on a page two clicks from a buyable kit. **Live since 2026-06-30 and it survived eight revisions**, most recently 2026-07-24, untouched. The waitlist ROUTING is unchanged and correct: there is no cortisol kit, and `kitCTA.ts` deliberately holds `stress` at email capture. Only the prose changed; it now scopes the gap to cortisol and points to the test selector.
- **`inflammatory-markers-blood-test`** said Joint & Recovery Collagen was "Launching shortly". Supplements were deferred 2026-05-23 to a non-cash waitlist, Gate 0A is not met, and no Stripe price IDs exist. Now says it is not on sale and no date is set. The EFSA Vitamin C wording is untouched.
- **Pre-flight was run as a delta, not on absolute counts**: both files scanned against their pre-edit baseline, zero findings introduced, zero removed, identical sets. The 2 HARD and 9 REVIEW the scanner reports on `inflammatory-markers-blood-test` are all pre-existing in Ewa-approved copy at untouched lines. **Not fixed here, and worth a separate look since two are HARD.**
- **Audit note:** the other three waitlist CTAs (`cholesterol-test`, `liver-function-blood-test`, `thyroid-test`) were checked and are correctly scoped to genuinely unlaunched panels. No change needed.

## DONE: Pillar E ungated in `kitCTA.ts` (2026-07-31)

`lib/content/kitCTA.ts` carried `E: { ..., gated: true }` with the comment "Pillar E content must not exist until Ewa signs the andropause claims pack", and `resolveKitCTA()` threw for it by design. Ewa signed that pack on **2026-07-26** (CA-028) and `/blog/andropause-male-menopause` went **live 2026-07-30**, so the comment was false and the throw guarded nothing. Raised by the CA-028 decision sweep, fixed as its own task.

- **It was dormant, not broken.** The andropause article does not use `InlineKitCTA`; it hand-writes its links to `/test-selector/`, `/kits/testosterone/` and `/kits/hormone-recovery/`. So nothing called `resolveKitCTA('E')` and the page served 200 throughout.
- **What changed:** `gated: true` dropped from `E` (target unchanged at `/kits/testosterone`, `KIT_1`, which is inside CA-028 §5's Kit 1 / Kit 3 permission); the `(GATED)` marker removed from the `PillarId` union; the block comment and the file-header compliance invariant rewritten to record the ungating and its date.
- **The gating mechanism was deliberately KEPT.** `gated?: true` on `KitCTATarget` and the throw in `resolveKitCTA()` both stay, so the next pillar that needs a gate still gets a build failure rather than a silent no-op. Only Pillar E's use of it was removed.
- **Test rewritten, not deleted.** `scripts/test-kit-cta.ts` previously asserted "Pillar E is gated and refuses to resolve". It now asserts two things: that Pillar E resolves and routes to `KIT_1` / `/kits/testosterone` (so the CA-028 routing permission is enforced in CI, not just documented), and that the gating mechanism itself still throws when a pillar is marked gated, restoring state in a `finally`.
- **Verified 2026-07-31:** `npx tsx scripts/test-kit-cta.ts` green, 10 pillars, 10 checks. `npx tsc --noEmit` clean. Full `npm test` exit 0.
- **Still open, and it is a judgement call rather than a defect:** the andropause article does not use `InlineKitCTA` while ten other articles do. Adopting it would route its CTA through the central map, which is the whole point of the map, but it changes CTAs on a live page and the article currently links to three destinations rather than one. Not done here.

## Sign-off gate: first live run corrected the design, and it worked (2026-07-30, commits `39f86a8`, `6c2b50c`)

The gate below shipped reading the **checkbox**. Its first real use showed that was the wrong signal, and the fix is now live.

- **What she actually did:** on the FAI re-opt Ewa answered all five rulings by typing her answer onto the end of each checklist item ("leave it as is", "Keep it", "that's fine") and ticked one of five. Reading the tick alone would have **blocked a fully-answered set**, the mirror image of the bug the gate exists to fix.
- **Her behaviour is better than the design was.** A tick records that she agreed; the text records what she said, and only the second is usable in an audit. So `rulingStates(task, originals)` now counts an item as answered if ticked **or** carrying appended text, extracts that text as the ruling, and compares against the rulings as submitted (read from the reviewed frontmatter, so it diffs against structured data). Item names come back HTML-escaped and are decoded first, or every quoted ruling looks edited. Without originals it falls back to the tick, which is the conservative direction.
- **`recordRulingAnswers` writes her answers into `content_review_log.notes` on approval.** Proven on the live run: the FAI reopt row now reads "Rulings answered at approval (5/5)" with her wording against each question.
- **Re-opt track was missing the gate entirely** on the first pass. `reopt-concierge` read frontmatter from the **live** row, so a re-opt that changes the title named the task after the old one and `ewa_rulings` (which exists only on the proposed revision) was invisible. Now reads the proposed revision, creates the checklist, and shares one `parkedOnRulings` helper and one `rulingsFrom` parser with the new-article track so they cannot fork.
- **End-to-end result:** 5/5 answered, task completed, the 07:00 tick promoted revision `73bf7d77` over live copy, and her answers are in the compliance record. 23 assertions on `scripts/test-rulings-gate.ts`, 32 in the suite, all green.

## Sign-off gate hardened: a named ruling can no longer be answered by silence (2026-07-30, commit `1245ea9`)

The content-engine review gate was binary (ClickUp status `complete` = approved). The andropause hub was approved that way on 2026-07-29 with two CA-028 rulings asked twice, in comments, and never answered. Nothing in the pipeline noticed, because a boolean gate cannot carry a non-boolean answer.

- **Named rulings are now real ClickUp checklist items** under `RULINGS_CHECKLIST` ("Rulings required before approval"), sourced from the draft's new **`ewa_rulings`** frontmatter array. Real checklist items are machine-readable; checkboxes typed into a description are not.
- **`isApproved()` now requires `complete` AND zero unresolved rulings.** That one predicate closes the hole; the rest feeds it.
- **`syncApprovals` has a third state.** Complete-with-unticked-rulings is neither pending nor approved: parked on Ewa, outstanding items written to `content_pipeline.notes`, logged as a `blocked` run, and commented on the task **once** (the prior note is the idempotency marker, so the daily tick can't spam her).
- **`signoff-concierge`** creates the checklist, puts the ruling warning **above** the completion instruction (burying it below is how the original request got closed past), records the rulings in `content_review_log.notes` at submission so the trail shows what was asked even when no answer arrives, and treats a checklist failure as non-fatal but loud.
- **Regression-tested:** `scripts/test-rulings-gate.ts`, 13 assertions, wired into `npm test`. Full suite green, `tsc` clean. The live ClickUp half was exercised end-to-end on throwaway tasks (create, add checklist, mark complete, gate refuses, tick items, gate approves, delete).
- **No retro-break:** tasks created before this carry no checklists, so `unresolvedRulings` returns empty and they behave exactly as before. Confirmed by `orchestrator --dry`: the andropause hub still approves.
- **Skills updated in step:** `/article` documents `ewa_rulings` and requires it for any amber line needing a decision rather than an approval; `/article-to-review` documents the gate, and its invariant 3 was corrected (it claimed re-running `draft-writer` "re-gates" a submitted article; the stage selectors make it a silent no-op).

## WTP quiz block + homepage hero flip: SHIPPED 2026-07-25 (commit `03d4bd5`)

The Van Westendorp willingness-to-pay block is live inside the test-selector quiz, and the homepage hero primary CTA now routes to the quiz (ratified by Keith 2026-07-25; resolves site-funnel-model §5). Built and verified via an Opus 4.8 implement/verify agent loop (adversarial code verify: SHIP, zero blockers; runtime browser verify: all pass; screenshots reviewed by eye).

- **Quiz is now 5 steps** (`components/marketing/TestSelectorQuiz.tsx`): Q1-Q3 → step 4 = recommendation shown **un-priced** + optional WTP card (4 VW £ inputs, age band 18-24/25-34/35-44/45-54/55+, equal-prominence submit/skip) → step 5 = price reveal + CTAs + the unchanged email capture. The VW questions price the **bundle concept matching the recommended kit** (test now + retest later, one order, described without any price) — the only un-anchored read available since bundle prices are dark behind `BUNDLES_ENABLED`. Resolves site-funnel-model §4's open bundle-alignment decision: the WTP block tests bundle price points explicitly; the quiz keeps routing to single kits until the flag flips.
- **Event:** anonymous `quiz_wtp` via the public `/api/events` sink (added to the `EventName` union + `ALLOWED` set). No email, no identity, no cookies (PECR-clean attribution). Submit rows carry `wtp_too_cheap/bargain/expensive/too_expensive` (jsonb numbers), `age_band`, `bundle_concept`, `symptom_flags`, `monotonic`; **skip fires `skipped:true` with no answers** (completion-rate denominator). Retake noise accepted at n≈50 (no anonymousId by design; sanity-check row count vs `quiz_complete` at read time). GA4 mirror receives the params but they are invisible without custom dimensions — **deliberate; Supabase `events` is the analysis source.** Pure logic + read-time SQL: `lib/quiz/wtp.ts`; suite `scripts/test-quiz-wtp.ts` (33 assertions) wired into `npm test`.
- **Hero** (`app/(marketing)/page.tsx`): primary "Find your test in 60 seconds" → `/test-selector`, secondary "Explore Test Kits" → `/kits`, tertiary text link "Or see how it works first" → `/how-it-works`. Intended trade: catalogue CTR drops, routed-AOV + WTP volume rise; glance at week-2 `quiz_complete` volume.
- **Compliance pre-flight run 2026-07-25** (agent, scanner + judgement pass): no HARD fails; previously-approved result-card strings confirmed byte-identical (moved, not edited). Two flags resolved by Keith same day: buttons reworded "See/Skip, just show **the** price" (killed a personalised-pricing misread), and the efficacy-adjacent opener reworded to "Many men choose to retest later to see how their numbers have moved" (drops the claim-adjacency; no Ewa gate needed). Scanner's one HARD hit was a false positive ("treated" in a code comment).
- **DPIA note (from the pre-flight):** the `quiz_wtp` payload carries age band + symptom flags but **no identifier of any kind** (no email, no anonymousId, nothing stored beyond the anonymous events row), so the "anonymous" characterisation holds; recorded here for the DPIA owner rather than editing `03_compliance/dpia/phase0-dpia.md` unilaterally.
- **Owed next:** the **n≈50 WTP read** (read-time SQL in site-funnel-model §4) → feeds the £169/£199/£259 bundle reprice decision (ltv-cac model v2, load-bearing). The block is a **temporary research instrument: retire or rework it once the read is taken.** ClickUp `869e74w93` closes with this ship.

## Two-kit bundle mechanism: LIVE 2026-07-26 (`BUNDLES_ENABLED=true` + `ACCOUNT_ADDRESS_ENABLED=true`)

Built per `2026-07-24-bundle-mechanism-build.md` (this workspace's `docs/`) and the approved bundle plan. **Committed to main + pushed 2026-07-24** (dark behind the flag). ⚠️ The push triggers a Coolify redeploy of the dark code; nothing changes visibly in prod because everything is flag-gated (flag off → byte-identical to before). Nothing applied to any DB. Four verifier rounds passed (A, B+D, C, final integration). Key decisions: **bank-not-refund** on a Confirmation all-clear (auto-refund loses the Stripe fee; a manual, no-questions-asked refund-on-request path exists via `scripts/ops/cancel-bundle.ts` + a manual £70 Stripe refund), soft address-check window (4 days, auto-dispatch to whatever address is current), interval-shaped Confirmation trigger (`CONFIRMATION_INTERVAL_DAYS`, default 0, single reviewable constant for Ewa), and (kit-page design, same session) **bundle-forward pages that close on the offer** with **Kit 3's £259 SKU reframed as a "retest add-on"** rather than a second "bundle" (Kit 3 is already sold on its page as a bundle of two kits).

- **Migration** `database/migrations/20260725_bundle_dispatches.sql` (+ supabase mirror): new `bundle_dispatches` table (owed second kit), state machine `scheduled → trigger_met → awaiting_window → dispatched` (terminals `not_needed`/`cancelled`). **APPLIED to the live DB 2026-07-26** (Supabase `androprime` / `phqrjtnflovicgkngieu`; RLS + select-own policy verified).
- **`lib/bundles/`** (`config.ts`, `checkout.ts`, `confirmation.ts`, `sweep.ts`, `dispatch.ts`): three SKUs: Confirmation £169 (Kit 1 base, Kit 1 retest, result-triggered, `shouldTriggerConfirmation` at t<12 nmol/L, aligned to GP-referral low-T 2026-07-25; customer-facing name **Recheck Bundle**), Prove-It £199 (Kit 2 base, Kit 2 retest, timed day-~90, flagship), Full-picture £259 (Kit 3 base, **Kit 2** retest, timed day-~90). `BANK_RECHECK_MONTHS=6`, `ADDRESS_CHECK_WINDOW_DAYS=4`.
- **`app/api/jobs/bundle-sweep/route.ts`**: daily QStash-verified sweep advancing the state machine (matures due rows → sends CIO `bundle_address_check` event → after the 4-day window, dispatches the second kit via the existing `/api/vitall/dispatch`, reused verbatim). **QStash Schedule REGISTERED 2026-07-26** (scheduleId `scd_5YpFh9tnXmSe2uZewrHZ6iNT3rTW`, cron `0 6 * * *`, POST to the prod route, not paused); fires daily but no-ops while `BUNDLES_ENABLED` is off.
- **Checkout + webhook:** `app/api/checkout/kit/route.ts` accepts a `bundle` param and resolves one of three new Stripe price envs (`STRIPE_PRICE_BUNDLE_CONFIRMATION` / `_PROVEIT` / `_FULLPICTURE`); **the 3 Stripe products/prices + the 3 Coolify env vars were created 2026-07-25 (Keith)** — the checkout pipe is now wired. `BUNDLES_ENABLED` itself is **currently `false` in prod** (Keith set it true mid-session to test, then back to false once the render fix landed; it stays false until the gates below clear). `app/api/webhooks/stripe/route.ts` inserts the `bundle_dispatches` row on a bundle purchase (kit_type metadata stays the base kit, so the existing first-kit insert + dispatch flow is untouched).
- **Result hook:** `processVitallResult` (`lib/results/processResult.ts`) now calls `resolveConfirmationOutcome` for an open Confirmation row: low (<12) schedules the recheck; not-low (≥12, i.e. borderline 12–<15 or all-clear ≥15) banks it to the +6mo recheck. No refund logic in code; refund-on-request is `scripts/ops/cancel-bundle.ts` (flips the row to `cancelled`) then a manual Stripe refund, by design.
- **Frontend (kit-page CRO rebuild, same session):** all three kit detail pages were reverted to their pristine git originals and rebuilt **fully flag-gated**: flag OFF renders each page byte-identical to production (verified: original JSX preserved verbatim in the `else` branches); flag ON renders a **bundle-forward** design where the hero leads with the offer and the page **closes on the single-vs-bundle chooser** (no trailing related-reading blog cards or competing-kit cross-sell, which a CRO pass flagged as focus-stealers). Testosterone + Energy lead the hero with the bundle as primary; **Hormone keeps Kit 3 (£179) as primary and presents the day-90 retest as a prominent add-on** (its chooser sits on a white panel inside the black finale so the black bundle card reads). `BundleChoice` gained optional label-override props so the Kit 3 card reads "Kit 3 plus a Retest / Track your change" not "bundle". `bundle` threads through the `/checkout/details` redirect hop (mirrors how `discount` already survives it). All verified by headless-Chrome screenshots. **Bundle copy is PENDING compliance pre-flight + Ewa sign-off**; marked in code, not yet run.
- **CRO evaluation run (page-cro skill) on all three pages**: heuristic (no live conversion data yet). Top remaining lever flagged: **no social proof anywhere** (no testimonials / review counts / test numbers); needs real tester data from Keith before a social-proof block can be built. Also paused this session: integrating the kit **sleeve-cover designs** (`02_brand/assets/packaging/concept-sleeve-fronts-all-kits.html`, HTML concepts, on-brand) as product imagery on the chooser cards (one sleeve on single, two on the bundle); Keith said hold. Both are open follow-ups.
- **Tests:** 3 new suites wired into `npm test` (`test-bundle-sweep.ts` 20 assertions, `test-bundle-confirmation.ts` 27, `test-bundle-checkout.ts` 37); all green; `tsc --noEmit` clean.

**Render fix (2026-07-25, commit `0c1070f`):** the three kit pages were statically pre-rendered, so `isBundlesEnabled()` was baked at build time (the Dockerfile only feeds `NEXT_PUBLIC_*` into the build, so `BUNDLES_ENABLED` was never present and the flag froze OFF; toggling the deployed env var did nothing to the kit-page UI, though the dynamic checkout/webhook/sweep handlers always honoured it). Added `export const dynamic = 'force-dynamic'` to all three (Option A) so they render per-request and the runtime flag wins with no rebuild. Verified by an Opus runtime agent across both flag states on one build (flag OFF = byte-identical to prod, zero bundle surfaces; flag ON = chooser on all three, 169/199/259), screenshots reviewed. **Deployed with `BUNDLES_ENABLED=false`, so no visible change.** Trade-off: these three pages are now SSR per-request (lost static caching) — reclaim via the Dockerfile build-arg route (Option B) once bundles are permanently live post-launch if caching matters.

**WENT LIVE 2026-07-26 (Keith):** both `BUNDLES_ENABLED=true` and `ACCOUNT_ADDRESS_ENABLED=true` set in Coolify + app redeployed (env changes needed the restart to apply — the first redeploy shipped the code/legal but the flags only took on the explicit restart). **Verified live by smoke test:** the bundle-forward chooser renders on all three kit pages at the correct prices (`/kits/testosterone` £169 Recheck, `/kits/energy-recovery` £199 Prove-It, `/kits/hormone-recovery` £259 Full-Picture); live `/terms` + `/privacy` carry the bundle sections. Non-blocking residuals: prices remain WTP hypotheses (gate #10, reprice via env after the quiz read); `/account` address-surface visual QA under an authed session still worth a manual eyeball. All gates below are closed.

**Before the flag flipped (`BUNDLES_ENABLED=true`), these were owed (all now DONE):**

1. ~~Solicitor **D2 gate**~~ → **RATIFIED in-house 2026-07-25** (Keith decision: no external solicitor review). Bundle Terms section ("Test Bundles (Two-Kit Purchases)") **APPROVED by Keith + Ewa** and folded into `03_compliance/terms-and-conditions.md` (banner now `[APPROVED 2026-07-25]`); Privacy clauses in `privacy-policy.md` (v1.3.2: bundle purpose row + automated-scheduling disclosure + retention row). Keith's product decisions all approved (12-month banked-retest refund backstop; retest portion refundable up to dispatch; customer-facing name "Recheck Bundle"). **Only residual = the mechanical live-sync at flag-flip:** copy the approved Test-Bundles section into live `canonical-site/terms/index.html` and the Privacy clauses into the live `/privacy`, coupled to `BUNDLES_ENABLED` so /terms never advertises an unpurchasable bundle. **→ DONE 2026-07-26: synced at the flag-flip** — the customer-facing Test Bundles section added to live `canonical-site/terms/index.html` (after Diagnostic Kits) and the three bundle clauses (purpose row + automated-scheduling disclosure + retention row) added to live `canonical-site/privacy/index.html`; source-doc banners flipped to SYNCED. Ships with the `BUNDLES_ENABLED=true` redeploy. General-T&C review residuals (subscription-variation notice, ADR naming, solicitor's optional mixed goods+service confirmation) tracked in `03_compliance/2026-07-25-terms-privacy-legal-review.md`.
2. ~~**F3/F4 ClickUp build gates** (subtasks of B1 prereqs `869e74vwz`).~~ **DONE 2026-07-26** — both subtasks `complete` in ClickUp: F3 `869e8w56x` (Bundle Terms + Privacy clauses drafted in-house, solicitor waived, Keith ratified), F4 `869e8w573` (Keith + Ewa + compliance Phase-0 boundary ruling: Confirmation bundle vs "confirmatory testosterone testing").
3. ~~**Ewa sign-off**: threshold + Phase-0 boundary + intervals.~~ **DONE.** Threshold + boundary **RESOLVED 2026-07-25** (`shouldTriggerConfirmation` aligned to t<12; wellness "Recheck" framing). Intervals **SIGNED OFF 2026-07-26** (Keith relay): `CONFIRMATION_INTERVAL_DAYS = 0` (immediate recheck at trigger) + `SECOND_DISPATCH_DELAY_DAYS = 90` (Prove-It/Full-picture day-90) both approved as coded.
4. ~~**Compliance pre-flight** on the `BundleChoice` copy.~~ **DONE 2026-07-26**: pre-flight run (0 HARD; price-split arithmetic accurate on all three: £99+£70=£169 / £119+£80=£199 / £179+£80=£259; Prove-It/Full-picture retest mechanic uses the approved "see how your numbers have changed" wording). The one flagged line (Recheck mechanic, "your second test ships only if your first result comes back low…") is **CLEARED**: **Ewa approved it as a wellness recheck, not "confirmatory testosterone testing"** (Keith relay 2026-07-26); the "Recheck Bundle" customer-facing name is the mechanism of that ruling. `BundleChoice` PENDING markers updated to match.
5. ~~**Create 3 Stripe bundle prices** + populate the three env vars in Coolify.~~ **DONE 2026-07-25 (Keith).**
6. ~~**Register the QStash Schedule** for `/api/jobs/bundle-sweep` (cron `0 6 * * *`).~~ **DONE 2026-07-26** — scheduleId `scd_5YpFh9tnXmSe2uZewrHZ6iNT3rTW`, POST `https://andro-prime.com/api/jobs/bundle-sweep`, daily 06:00 UTC, 3 retries, not paused. Fires now but no-ops (`{skipped:true}`) until `BUNDLES_ENABLED` flips.
7. ~~**Build the CIO `bundle_address_check` campaign.**~~ **BUILT DRAFT 2026-07-26** — campaign `24` ("T-11 — Bundle Address Check"), type transactional, trigger event `bundle_address_check`, single email action `108` (draft), template `55` (from Keith/identity 1, subject "Please confirm your delivery address", preheader set, CTA → `/account`, `4 days` synced to `ADDRESS_CHECK_WINDOW_DAYS`). Pre-flight 0 HARD (pure logistics copy, no health claim, no em dash); Liquid lint 0 errors (local + live); no `{% if %}` branches. Copy **APPROVED by Ewa + Keith 2026-07-26 (CA-027**, `03_compliance/content-approval/approval-record-bundle-address-check-2026-07-26.md`). **Not activated** (draft) — activation gated only on `BUNDLES_ENABLED` + `ACCOUNT_ADDRESS_ENABLED` live.
8. **Address-update surface** the address-check email links to — **BUILT 2026-07-26, dark behind `ACCOUNT_ADDRESS_ENABLED`** (default OFF; new flag in `lib/flags.ts`). Self-serve "Delivery address" section on `/account` (`components/account/AddressSection.tsx`) + `PUT /api/account/address` (auth-required, 404 when flag off, writes only the caller's own `users` row) + `lib/account/getAddress.ts` loader. Edits the exact `users` address columns the second-kit dispatch snapshots (`lib/bundles/dispatch.ts`), so a mid-window update ships to the new address with no extra code. Country forced GB (UK-only). tsc clean; compliance scan 0/0/0 (pure logistics copy, no health claim, no em dash). **Set `ACCOUNT_ADDRESS_ENABLED=true` in Coolify alongside `BUNDLES_ENABLED` so the email never links to a dark surface.** **Visual QA still owed** (flag-on + authed local session).
9. ~~**Apply the migration** (`20260725_bundle_dispatches.sql`) to a live/staging DB.~~ **DONE 2026-07-26** — applied to the live Supabase project `androprime` (`phqrjtnflovicgkngieu`; single project, no separate staging). Verified: `bundle_dispatches` table (12 cols), RLS enabled, select-own policy, both indexes + `set_updated_at` trigger present. Empty + unused until `BUNDLES_ENABLED` flips (no row is written while the flag is off).
10. Working prices (£169/£199/£259) remain hypotheses pending the Van Westendorp WTP read; easy reprice (one env var per SKU), not a blocker to flag-flip but flagged so it isn't forgotten.

## Middleware auth-gate + Context7 tooling (2026-07-24): code done, deploy owed

- **`/supplement-waitlist-status` now gated in `middleware.ts`** (added to `protectedRoutes` + `matcher`). Defence-in-depth + a consistent login redirect; the page already self-guards via `getCurrentUser()` → `return null`, so this is a UX/consistency fix, not a data-leak. CONTEXT route-table row updated to match. ⚠️ **Committed this session; a push = Coolify redeploy, so it goes live on the next deploy**; smoke-test `/supplement-waitlist-status` (logged-out → login redirect) after.
- **Context7 MCP** added to the local gitignored `.mcp.json` (keyless `@upstash/context7-mcp` v3.2.4); usage pointer added to CONTEXT.md "How to Work Here" (third-party library docs: Next/React/Supabase/Stripe/QStash; graphify stays for our own code). Needs an MCP reconnect to load.

## DEPLOYED 2026-07-24: CA-026 copy + full design pass + blog DB update (all live, verified)

The three passes below (CA-026 money-pages rewrite, full-site strategy-alignment fixes, design-guidelines fixes) shipped together as one deploy 2026-07-24, plus the blog DB content update.

- **Commit `e09f8c6`** (104 files: CA-026 copy + design overhaul + `llms.txt` regen + blog mirror + docs), pushed to main → Coolify. **First build FAILED: OOM-killed at the in-Docker `next build` type-check step** (compiled fine in 51s, then process killed, exit 255, no `Type error:` printed; a clean local `next build` of the same commit passed all 75 routes, confirming code was clean). No outage: Coolify discarded the failed build and kept the prior version serving. **Retry via empty commit `d58bfbd` succeeded** (transient server-load OOM; Docker layer cache made the retry ~2.5 min). If this recurs: add `typescript.ignoreBuildErrors` + `eslint.ignoreDuringBuilds` to `next.config.ts` (we gate types locally with `tsc --noEmit`, so the in-Docker typecheck is redundant and is the memory-heavy step that dies).
- **Live smoke test green (2026-07-24):** homepage B1 hero, /kits C1 block (no bundle prices), /terms SLA "2 to 5 working days" (24-48h gone), how-it-works discount line gone, regenerated /llms.txt (FM + partner-code prices + TRT pre-announce gone, A1 folded in), ferritin blog article (Vitall name gone, UKAS retained).
- **Blog DB import done:** `import-blog-to-db.ts` ran (17/17 upserted, all published). **Landmine avoided:** `free-androgen-index` mirror was `status: draft` while the live DB had it `published` (published earlier via the ClickUp orchestrator sequence, which never updated the MDX mirror); mirror reconciled to `published` before import so the raw import didn't unpublish a live article. DB verified post-import: `(Vitall)` and the per-customer-review phrasing removed from bodies.
- **F7 (UKAS cert) downgraded, NOT a blocker:** substantiation is on file (signed services agreement §3.6 + 2026-04-22 quote); only the per-lab certificate artefact is outstanding, which the Vitall negotiation log already classifies non-blocking. ClickUp `869e8w57e`. Wording guardrail holds: "analysed by a UKAS ISO 15189-accredited lab" only, never "UKAS-accredited report" / "Vitall is accredited".
- **Still owed** (unchanged by the deploy): everything in the two "Owed / flagged" + "Design rulings owed" lists below. (F3/F4 bundle gates, ClickUp `869e8w56x`/`869e8w573` under B1 prereqs `869e74vwz`, both now **complete 2026-07-26**.)

## Full-site design-guidelines audit + fix pass: DEPLOYED + verified live 2026-07-24 (commit `e09f8c6` / retrigger `d58bfbd`)

Four-agent audit of every surface against `02_brand/brand-guidelines.md` v2.0 hard rules (+ visual-identity.md logo authority), then four implementation agents. Verification green: `tsc`, `npm test`, `npm run build` (75 pages), banned-pattern scan clean (remaining `hover:bg-black` hits are all §5.3-sanctioned button fills, not card inversions). Fixed: **full-card hover inversions** removed everywhere (homepage/kit/how-it-works/waitlist step cards, quiz options, RelatedArticles, BlogListings, ArticleLayout, LP energy); **all marketing motion** stripped (pulsing dots, fade-up entrances, hover-translates, animated accordions/progress bars, dead `animate-[fadeIn]` landmines); `statusPulse` keyframes now opacity-only + reduced-motion-guarded; **colour fence enforced** (sample-panel bars tokenised to `bg-statusWarning`/`bg-statusOptimal` incl. the §3.3 token-note item; red/orange/green raw classes eliminated; coloured status TEXT removed on subscriptions + `text-amber-600` homepage value; latent `.status-*` text/bg/border utilities deleted; red error text → black on consent/account/waitlist forms); **offset block-shadows outside `.blog-skin`** removed (SupplementWaitlistForm, JoinForm); gradient stripe overlays deleted (hormone-recovery CTA `#333`, live /terms disclaimer panel); rounded-full dot + 3 `rx/ry` icon rects squared; serif app headings → Inter black; button spec sweep (primary border-4/text-sm, `transition-all`→`transition-colors` ~60 sites, app utility-button pattern ×9); mono-label tracking normalised to `tracking-[0.15em]` (~60 labels); off-roster grays mapped to the §3.2 set; Nav logo hover-scale + link transitions removed; auth/activate brought to spec; **tailwind hardened** (theme-level borderRadius all 0px, boxShadow all none; banned utilities can no longer compile).

**Design rulings owed (Keith):** ~~(a) sample-report COLOUR on the homepage hero + LPs~~ **RESOLVED 2026-07-26 (Keith): §3.3 carve-out extended to cover the sample-report panel wherever it appears (kit pages, LPs, homepage hero); colour kept, fence unchanged (commits `1657235`/`da14812`)**; (b) looping hero background video vs "marketing fully static" (mitigations exist: reduced-motion/mobile/data-saver skip, grayscale); sanction in guidelines or drop to poster; (c) blueprint grid-line gradient textures (hormone-recovery:104/398, supplement-waitlist:44, blog dot pattern); bless or remove; ~~(d) one-primary-CTA-per-page rule vs long pages with repeated CTAs~~ **RESOLVED 2026-07-26 (Keith): §5.5 clarified to "one primary action per page; a single CTA may repeat down a long LP; only competing primary CTAs banned"**; (e) QualifierGate YES/NO hover inversion (buttons, but card-sized); (f) minors: `.glass-panel` rename (30 consumers), footer "EFSA Regulated" badge, double back-to-top on TOC'd articles, 1px badge chips, 8px accent borders outside supplement context, sans-black emphasis paragraphs.

**LP design-conformance audit (2026-07-26, 2 Opus agents, full per-rule pass, kit + supplement split):** all 5 LPs = **0 HARD breaks, but NOT full conformance** (~9 MINOR deviations, several systemic). PASSING: buttons (rounded-none, border-4/2, transition-colors, no transforms), no rounded SVG linecaps, colour fenced to sample-panel range bars only (badges B&W), no competing primary CTAs, no gradient/shadow/glass/hover-inversion. MINOR (owed, **Keith deferred the fix decision** at wrap): (1) `text-gray-400` meta on the black step-4 cards → should be `gray-300` (testo 333 / energy 278 / hormone 387, §3.2a); (2) hormone founders' black card `gray-200`/`gray-400`/`gray-600` → `gray-300`/`gray-700` (564/575/580, §3.2a); (3) final CTA `text-xl` vs §5.2 `text-sm` (3 kit LPs); (4) final-CTA arrow `strokeWidth="4"` vs §8.8 2-3 (3 kit LPs); (5) card padding below §6.5 `p-10` desktop min (`p-8`/`p-6`/`p-5`, systemic across all 5); (6) primary CTA padding `px-10 py-5` vs §5.2 `px-8 py-4`; (7) hormone `gray-400` de-emphasis on light surfaces (415 £218 strikethrough, 620-621 table) outside the contrast-device purpose; (8) hormone ghost numbers use a `WebkitTextStroke` outline vs §8.4 solid `gray-100`/`gray-800` fill; (9) daily-stack missing `border-t-4` divider before the FAQ (§7.3). Proposed fix split: **bucket A** (safe class swaps: 1,2,4,7,9) + **bucket B** (visual/aesthetic call: 3,5,6,8). **ALL 9 FIXED 2026-07-26 (Keith: "fix all issues")** across all 5 LPs: (1) black step-4 meta → `gray-300`; (2) hormone founders' card → `gray-300`/`gray-700`; (3) final CTAs → `text-sm`; (4) final-CTA arrows → `strokeWidth="2"`; (5) every content card → `md:p-10` (mobile kept ≥ `p-6` min); (6) primary CTAs → `px-8 py-4` (final CTAs also normalised off `px-12 py-6`); (7) hormone light-surface de-emphasis (£218 strike + comparison table No cells) → `gray-500`; (8) BOTH hormone ghost-number instances (383 process step + 335 biomarker card, the second not line-cited in the audit) → solid `gray-100`/`gray-800` fill, `WebkitTextStroke` removed; (9) daily-stack FAQ section given `border-t-4 border-black`. Verified: `next build` exit 0 (all 5 LPs prerendered, tsc + lint clean), real headless-Chrome full-page screenshots reviewed by eye (desktop 1440 + mobile 390) — layouts intact, no overflow, dividers present. **Now full design conformance on the audited rules.**

## Full-site strategy-alignment review + fix pass: DEPLOYED + verified live 2026-07-24 (commit `e09f8c6`)

Seven-agent review of every customer-facing surface (money pages, marketing long-tail, 5 LPs, logged-in app + results engine, shared chrome/schema, blog MDX mirror, email templates) against the conflict-free positioning (CA-026), pricing v2 (£99/£119/£179 anchors; bundles NOT yet shippable), and the compliance rails. CA-026 verbatim conformity CONFIRMED on all 8 money pages; single-kit pricing correct everywhere; **zero bundle prices leaked anywhere**. Safe fixes implemented (43 files); verification green: `tsc --noEmit`, `npm test` (classifier suite extended to 26 assertions incl. a dead-route guard), `npm run build`, banned-string scan of every added line clean. Highlights of the fix pass: how-it-works retest-discount promise deleted; sitewide footer de-Vitalled; `/gp-referral` 404 CTA repointed to the live GP handoff; false Kit 3 cortisol claim corrected; founding-member-status page retired (redirect `/account`); `public/llms.txt` regenerated on CA-026 wording (partner-code prices, FM section, TRT pre-announcement removed); live /terms 24-48h SLA corrected to "2 to 5 working days"; blog mirror de-Vitalled ×8 + per-customer-review rephrase ×9 (**mirror only, DB import NOT run**; diff `status:` vs DB first, then import + revalidate); D+ conformity lines added to kit LPs; em-dash sweep (incl. punctuation-only edits to Ewa-signed `biomarker-copy.ts`: claims word-identical, needs her nod).

**Owed / flagged (full list in the session report):** (a) CA-026 F7 UKAS certificate filing: pre-push blocker; (b) Ewa sitting bundle: per-customer-review lines deliberately left on how-it-works :426-430 + homepage "GP-designed report", the rephrased kit-page privacy answers + blog rephrases (nod), the 6 vs 12 nmol/L GP-threshold contradiction on how-it-works, biomarker-copy punctuation nod, T-range inconsistency (8–35 vs 10–35 vs 8–29); (c) Keith decisions: ~~LP positioning rebuild~~ **DONE 2026-07-26 as "step 2"** (commits `2e1e306` + `f8e4ebb`, both VERIFIED LIVE via two-sided canaries + element screenshots at 640/1280px): the flagged "GP-adversarial heroes" dissolved on inspection (hero lines are approved customer language: "Your GP said normal…", "Five minutes. No GP needed."); the real tells were the mockup labels, now de-protocolled and **matched to real classifier routing** ("Further investigation advised" → routing-neutral "Your next step, based on your numbers" after a first swap wrongly promised a GP conversation on a 14.2-borderline mockup; GP referral fires only on total T <12); CA-026 A1 receipt added verbatim to lp/collagen + lp/daily-stack (previously carried none); lp/hormone-recovery "The Fix" eyebrow → "The Next Step". **Ewa packet (her wording, untouched):** her attributed "clinical protocols … effective" quote ×4 (3 kit LPs + kits/hormone-recovery:630); ~~TRT-Trained badges, "we test first then we fix it", "founding-customer discount" promise ×7 surfaces~~ **SWEPT 2026-07-26, VERIFIED LIVE** (two-sided homepage canary: "act on it" present, "Then fix it" absent; commit `101db60`, 15 files: founder quote → "Then you know exactly where you stand", homepage H2 → "Then act on it" + "Intervention Protocols" label → "Data-Led Supplements", TRT badges → UKAS/GMC on 7 surfaces, founding-customer discount removed app-wide with JSON-LD kept in sync; greps 0, tsc clean). **Kit-page follow-up SWEPT + VERIFIED LIVE 2026-07-26** (commit `ec5f30b`, canary on /kits/hormone-recovery): "The Fix"/"THE FIX" headings → "The Next Step", "FIX" watermark → "DATA", "Next Step Protocol"/"ANALYSIS PROTOCOL ACTIVE" labels de-protocolled, stale hero PENDING comments synced; audit also confirmed NO bundle-price leak (hero bundle CTAs correctly `bundlesEnabled`-gated) and no "Confirmation" naming leak. **Left for Ewa** (packet assembled 2026-07-26 → `03_compliance/content-approval/ewa-packet-2026-07-26-lp-clinical-wording-and-countersignature-backlog.md`; ClickUp `869e9fk23`, list "Content Review — Ewa"; now also folds in the quote ×4 + how-it-works:449 second attributed blockquote + the CA-003→027 countersignature backlog)**:** her attributed "clinical protocols … effective" quote on kits/hormone-recovery:630 (her wording) + the how-it-works:430 "treated men" prose; stale /waitlist page, category-absolute "Other providers give you numbers" lines, £218 strikethrough framing, "EFSA Regulated" footer badge, dead canonical-site/lp static trees (**ashwagandha leak sweep 2026-07-26: 0 facing leaks — whole frontend clean incl. git-ignored files; canonical-site now holds only privacy/terms HTML, the flagged tree is already gone**; the Medichecks-name concern in these trees was NOT part of the ashwagandha sweep and is still open); (d) solicitor: terms/privacy FM + Vitall-naming sections, bundle terms (D2 gate); (e) email sequences (seq-03d cadence + "even if your GP says you're fine" subject, seq-01/06 GP framing, seq-04 discount framing); CIO-side, need Ewa/Keith pass before/at activation; T-04 SUPERSEDED-bannered, verify CIO doesn't reference it; (f) strategy-doc nit: LTV model v2 says £39.95/mo subscription vs catalogue/site £34.95 Daily Stack.

## CA-026 money-pages rewrite: DEPLOYED + verified live 2026-07-24 (commit `e09f8c6`)

The conflict-free positioning rewrite (CA-026 approved wording, verbatim) is implemented across 8 files in `app/(marketing)/`: homepage hero + meta descriptions (B1; title kept for SEO), /kits C1 money block, FAQ C2 + FAQPage schema, D+ conformity lines on testosterone / energy-recovery / hormone-recovery kit pages, A1 standing claim on About, A1 + live-receipts section on how-it-works. Verification green: `tsc --noEmit`, `npm test` (148 assertions), `npm run build`; zero em dashes / competitor names / banned absolutes in changed files. Also reconciled in-scope stale copy: how-it-works low-T routing still described the retired FM/TRT pathway (now the live CA-014 GP-referral framing), FAQ "Founding Member territory" band label removed, 2 pre-existing competitor mentions de-branded, 2 pre-existing schema em dashes fixed. **⚠️ UNCOMMITTED by design: pushing = Coolify redeploy = the new positioning goes live. Keith's go.** After push: eyeball homepage/kits/faq/how-it-works live, then re-run PSI once (copy-only changes; hero perf work untouched).

**Pre-existing compliance flags found during the build (NOT touched, for the Ewa sitting):** (a) "GP-designed report" on the homepage (HowTo schema step 4 + visible step 4): the proposed-but-unconfirmed standard chip per 02_brand STATE; (b) how-it-works "A real doctor reviewed your result" + "Dr Ewa signs off every result interpretation": per-customer-review implications the compliance CONTEXT bars (system-level rule). Both predate this rewrite.

## Mobile performance pass (2026-07-19): homepage hero

Mobile PageSpeed was imperfect; three commits cut mobile page weight from ~2.35 MB to ~0.7 MB and lifted mobile PSI from **85 to a settled ~88** (median of warm re-runs 87/88/88; a one-off 85 immediately after the round-3 redeploy was cold-start noise: first PSI hit after a Coolify redeploy inflates FCP + render-blocking via a slow TTFB, ignore it). All work DEPLOYED + verified live 2026-07-19. Desktop lab is already 100. **Decision (Keith, 2026-07-19): stop here**: 88 mobile / 100 desktop is a good result for a marketing site with a video hero, and the remaining points are infrastructure-bound, not code-bound (see below).

Stable warm metrics: TBT 40–90ms 🟢, CLS 0.013 🟢, Speed Index 2.1–2.9s 🟢; the two amber metrics holding the score are **FCP 2.1s** and **LCP 3.6s** (Moto G Power / Slow-4G, Lighthouse 13.4). Key finding: both are gated by the **render-blocking CSS + TTFB critical chain** (≈1,770ms render-blocking, consistent across warm runs), NOT by payload: LCP moved only 3.9→3.6 despite a much smaller poster, proving the hero image bytes were never the bottleneck. The next real lever is therefore **a CDN/edge (e.g. Cloudflare) in front of Coolify to cut TTFB**, which would lift FCP and LCP together; inlining critical CSS is fiddly in the App Router for small payoff. Neither pursued; parked as the only remaining path to 90+.

- **Round 1 (commit `675557b`, DEPLOYED + verified live):** `HeroBackground.tsx` skips the decorative hero video entirely on <1024px / data-saver / reduced-motion (keeps the static poster); `preload="none"` added. `hero.mp4` re-encoded 1.66 MB → 667 KB (540p, 24fps, desaturated to match the CSS grayscale) plus new `hero.webm` (VP9) 491 KB served first. GA `gtag.js` + FirstPromoter `fpr.js` moved from `afterInteractive` to `lazyOnload` (the inline consent-denied bootstrap stays early, so Consent Mode / GDPR behaviour is unchanged).
- **Round 2 (commit `35829de`, DEPLOYED + verified live):** hero poster 113 KB JPG → 51 KB WebP via `<picture>` (JPG fallback), preload retargeted to WebP. **Sentry Session Replay removed** from the client SDK (`instrumentation-client.ts`: dropped `replaysOnErrorSampleRate`; error + perf monitoring kept); `bundleSizeOptimizations` added in `next.config.ts`. Long `Cache-Control` (1y) headers for `/videos` + static images (repeat-visit win; stable paths, so **rename a media file to bust its cache**).
- **Round 3 (commit `bd6468f`, DEPLOYED + verified live):** mobile-only 800px poster `hero-poster-800.webp` (~28 KB) served via media-scoped `<picture>` + media-scoped preloads (desktop keeps the 1280px WebP); only Inter (H1 font) is now preloaded, Merriweather + JetBrains Mono set `preload: false`. Verified live: `/videos/hero-poster-800.webp` 200, both media-scoped image preloads present in `<head>`, font preloads down from 4 woff2 to 1 (Inter). Net effect on score was ~neutral (+1); it confirmed the LCP is chain-bound not byte-bound (see finding above), which is the useful result.
- **Not pursued (parked):** dropping the faint mobile bg image for a CSS tint was the presumed "decisive LCP fix" but round 3 showed the poster bytes are not the bottleneck, so it would help little; stripping client-side Sentry from marketing routes is a minor JS trim. The one lever with real headroom is the CDN/TTFB path above. All parked per the stop decision.
- **⚠️ Commit hygiene note:** commit `bd6468f` unexpectedly also swept in 11 unrelated already-dirty WIP docs (`06_marketing/content-machine/*`, `01_strategy/STATE.md`, a new substack asset) despite explicit path staging; no git pre-commit hook exists, most likely the VSCode Source Control integration auto-staged them. Not rewritten (already pushed). Worth confirming those content files were ready to ship.

---

## OPEN DECISION: retest CTA has no mechanism (2026-07-17)

Keith flagged that the "Book a retest in 3 months" button on healthy results just links to `/kits` with no reminder/scheduling behind it, and "3 months" contradicts the 6–12 month cadence promised across the marketing site. Written up in `docs/2026-07-17-retest-cta-mechanism-decision.md` (status PROPOSED). Recommends: Phase 1 honest relabel + timing fix (one-liner in `classifier.ts`), Phase 2 real `retest_due_at` reminder via Customer.io for all kit buyers (not just subscribers). **Owed:** Ewa signs the per-result cadence; Keith picks the relabel and whether Phase 2 is pre-launch. **Tracked in ClickUp** (Sprint: Pre-launch): parent `869e66e8p` + 6 subtasks. Cadence sheet: `04_products/results-engine/2026-07-17-retest-cadence-table.md`. **Resolution 2026-07-17:** all-clear cadence of **6–12 months is agreed** (already the live marketing figure), so the button "3 months" + card copy "3–6 months" are just drift to align down to it; no clinical sign-off owed, Phase 1 dev task `869e66eau` unblocked. **Symptom overlay DECIDED** (build now, self-policing scope): in range but still symptomatic → step 1 check an untested panel we supply (Kit 1↔Kit 2; Kit 3→GP), else GP. Only a **light copy tick** from Ewa remains (red-flag GP-first line + the two symptom→panel wordings, on the normal results-copy pass); task `869e66e9c` downgraded from blocker.
- **Phase 1 timing fix DEPLOYED 2026-07-17 (commit `f5e6912`, pushed to main).** `classifier.ts` retest CTA label `Book a retest in 3 months` → `Retest in 6–12 months`; `biomarker-copy.ts` three retest lines (optimal-T, ft-normal, default-normal) aligned `3–6`/`3 to 6` → `6–12`/`6 to 12 months`. Compliance pre-flight clean (0 HARD). `npm test` green. Dev task `869e66eau` done. (Optional: content-approval log entry, not self-approved.)
- **Phase 2 reminder: LIVE 2026-07-18.** Code deployed (commit `8beec61`, `next build` green), `RETEST_REMINDER_ENABLED` flipped ON in Coolify, and CIO campaign **23 activated (state `running`, email action 106 `sending_state: automatic`)**. Note: Keith activated the campaign but the email action was still `draft` (a running date-campaign with a draft message silently sends nothing); flipped to `automatic` to complete activation. Zero immediate sends: every stamped `retest_due_at` is +6 months forward, so the first real reminder is ~6 months out. Code mechanism: `buildCioTraits` (`lib/results/processResult.ts`) stamps a `retest_due_at` CIO attribute (result date + `RETEST_REMINDER_MONTHS` = 6, start of the agreed 6–12mo window) on a whole-result all-clear, behind new flag `isRetestReminderEnabled()` (`RETEST_REMINDER_ENABLED`, default OFF, `lib/flags.ts`). Unit test `scripts/test-retest-reminder.ts` (9 assertions, wired into `npm test`); `npm test` + `tsc --noEmit` green.
  - **CIO campaign built DRAFT 2026-07-18 (env 219186):** `seq-07: Retest Reminder (all-clear)`, **campaign id 23**, type `date`, `date_triggered_attribute = retest_due_at`, frequency `once`, 9:00 customer TZ / Europe-London fallback. Email action **106** (template **54**), `sending_state: draft`, from Keith (identity 1), subject "Time for a fresh reading", preheader set. Copy = `frontend/email-templates/sequences/retest-reminder-all-clear.md` + rendered HTML `email-templates/html/retest-reminder-all-clear-email-1-*.html`. CIO liquid lint 0 errors (only `{% unsubscribe_url %}`). NOT activated.
  - **Still to do before live:** ~~(a) Ewa signs the email copy~~ **DONE: CA-022.** ~~(b1) deploy the Phase 2 code~~ **DONE: commit `8beec61`.** **(b2) flip `RETEST_REMINDER_ENABLED=true` in Coolify → Settings → Environment Variables (runtime var; needs container restart); KEITH's action, not doable from the repo.** ~~(c) verify date interpretation + backfill + test-send~~ **DONE 2026-07-18:** CIO stored a seeded Unix-seconds `retest_due_at` (format accepted); backfill is a non-issue (activate with `backfill:false`, and every stamped date is +6mo forward so no past population exists); test email sent to keith@andro-prime.com via `verify/email`. ~~(d) suppression filter~~ **DEFERRED to supplement launch**: `subscription_started` never fires in Phase 0, so the subscriber population is empty and there is nothing to suppress; add it (as a `global_exit_condition` on the subscriber segment) alongside the discount when supplements ship. ~~(e) human activation go/no-go~~ **DONE 2026-07-18: Keith activated; the email action was still `draft` (a running date-campaign with a draft message silently sends nothing) so it was flipped to `automatic` to complete activation. Campaign LIVE.** (f) subscriber discount deferred to supplement range. NB: seeding the test profile fired one bounce via seq-03c and left an un-deletable profile (agents can't delete); Keith deleted `retest-verify@andro-prime.com` in the UI 2026-07-18.
  - **All committed:** code + test + email copy/HTML + CA-022 record in `8beec61`; the `package.json` test wiring, `test-account-export.ts`, CA-022 register row, and this STATE.md committed 2026-07-18. Dev task `869e66eb0`.

---

## Bucket A/B account + results features: LIVE 2026-07-19 (all three flags ON in Coolify, deployed by Keith); copy signed off (CA-023/024/025); built dark 2026-07-17 (0bd4e9a)

Implemented from `docs/2026-07-17-bucket-ab-implementation-plan.md` (research-driven, from `docs/2026-07-17-research-to-feature-gap-analysis.md`). Everything is behind a default-OFF env flag; with flags unset the app is byte-identical to before. `npm test` green (account-export suite = 28 assertions added), `npm run build` green.

- **F4 account data controls: `ACCOUNT_DATA_CONTROLS_ENABLED` (OFF).** Adds a "Data & privacy" section to `/account`: a data-use statement ("we do not sell your data", EU residency, Art 9 consent, Vitall = independent controller), a **results CSV export** (`GET /api/account/export`, read-only, reuses `getDashboardData`→`resultsToCsv`), and an **erasure REQUEST** (`POST /api/account/erasure-request` → `emitOpsAlert` only; records a request, deletes nothing). Ship gate: **copy APPROVED 2026-07-19 (CA-024); `ACCOUNT_DATA_CONTROLS_ENABLED` flipped LIVE 2026-07-19; ops-alert address confirmed 2026-07-19 (Keith): erasure requests route to the monitored `keith@andro-prime.com`, 30-day SLA from receipt.** Retention/deletion policy DRAFTED (`03_compliance/deletion-policy/retention-and-deletion-policy.md`), pending sign-off; automated deletion still not built (request-only feature is fine live).
- **F5 kit-scope note: `KIT_SCOPE_NOTE_ENABLED` (OFF).** "What this test did not tell you" paragraph on a normal-T Kit 1 result (in `KitTabs`), enforcing the Kit 1 testosterone-only scope rule and defusing the Kit 2 cross-sell as an upsell. Ship gate: **copy APPROVED 2026-07-19 (CA-025), pre-flight 0 HARD; `KIT_SCOPE_NOTE_ENABLED` flipped LIVE 2026-07-19.**
- **F3 / U1 GP handoff: `GP_HANDOFF_ENABLED` (OFF).** Printable one-page GP summary at `/results-dashboard/handoff` (identity, UKAS-accredited-lab line per Vitall §3.6, per-kit marker table with reference ranges, "questions to ask your GP", not-a-diagnosis disclaimer using "Ewa-approved recommendation logic" framing). Zero new dependency: print-CSS HTML + browser "Save as PDF" (`PrintButton`). Dashboard shows a "Prepare GP summary" link only when a result routes to a GP referral. Ship gate: **copy APPROVED 2026-07-19 (CA-023) by Ewa via Keith; `GP_HANDOFF_ENABLED` flipped LIVE 2026-07-19.**
- **Renderer decision:** no PDF lib in the repo; Vitall's `results_pdf` sits unused in `lab_results.raw_payload`. Chose zero-dependency CSV + print-CSS. A server-generated PDF (jspdf/puppeteer) is a later, deliberate dependency decision.
- **Not verified:** live authenticated render-drive of the three surfaces (both dashboard/handoff pages `getCurrentUser()`-gate before the dev-fixture path, so it needs a logged-in test user + seeded result). Do this with the DevFixtureBar before flipping any flag.
- **Status: LIVE 2026-07-19.** Committed `0bd4e9a`; copy sign-offs CA-023/024/025 recorded; all three flags set to `true` in Coolify and deployed by Keith. Authenticated smoke-test of the three surfaces is Keith's eyeball (agent has no logged-in prod session). Remaining: sign off the DRAFT retention/deletion policy (Keith + solicitor + Ewa; does not block the live request-only feature). The F4 ops-alert-address item is confirmed (2026-07-19, `keith@andro-prime.com` monitored).

### ⚠️ OWED to compliance: automated deletion is blocked on a missing policy

`03_compliance/deletion-policy/` is **empty**: there is no retention schedule. The erasure-*request* mechanism above is deliberately request-only. **Automated hard-delete must not be built until a retention/deletion policy exists**; it would have to encode legal retention rules (UK tax 6-year record-keeping, the Vitall independent-controller copy we cannot compel to delete, Stripe + Customer.io records keyed on email). Owner: Keith/solicitor + Ewa, against `03_compliance/gdpr-readiness-checklist.md` §6 (SAR/erasure, currently unchecked). The `kit_orders.data_purged` status already notes a Vitall-side purge does not cascade to our copy; that cascade is the unbuilt process.

---

## Content-engine on-ramp + local MCP tooling (2026-07-14)

- **New script `frontend/scripts/content-engine/seed-pipeline.ts`** bridges hand-authored `/article` drafts into the DB pipeline. Hand-authored articles skip the keyword-queue, so they never get a `content_pipeline` row, so Draft-Writer / Signoff-Concierge never see them and no ClickUp review task is created. `seed-pipeline.ts --slug <slug>` seeds a `brief_ready` row (idempotent; reuses Draft-Writer + Signoff-Concierge rather than duplicating them). Proven end-to-end: `free-androgen-index` seeded, drafted into `blog_articles`, and **ClickUp review task `869e4uwk5` created** with the pipeline at `in_review`. Do NOT use `/publish-article` for DB-pipeline articles: its build+push forces the Coolify redeploy the DB workflow exists to avoid.
- **Local MCP servers wired in the gitignored `.mcp.json`** (headless-capable, unlike the claude.ai OAuth connectors): `supabase` (`@supabase/mcp-server-supabase`, read-only, project-ref `phqrjtnflovicgkngieu`), `clickup` (`@taazkareem/clickup-mcp-server@0.14.4`, `CLICKUP_API_KEY` + team `90121729875`; the free/LIMITED tier covers the task/comment tools we use), plus the earlier `dataforseo` creds fix. Secrets are inlined because `${VAR}` substitution does not reach the MCP process. Stripe deliberately NOT wired (the package has no tool-scoping, so a live key would expose writes; use a read-only restricted key or the hosted connector). Customer.io stays on its hosted connector (no clean local stdio package).
- **Publish-strand bug found + fixed (2026-07-15).** `publishDue` in `orchestrator.ts` now re-reads the ClickUp task's CURRENT due date each tick, instead of trusting the `target_date` frozen into `content_pipeline` at approval. Root cause: `cholesterol-test` was Ewa-approved 2026-06-24 with a real due date of 2026-07-02, but the DB publish slot was stuck at a placeholder `2027-01-01`, so it sat approved-but-unpublished for ~3 weeks (every tick marked it "scheduled"). `syncApprovals` captures the due date once and never reconciled it. Fix keeps ClickUp authoritative for the slot until the article is live (falls back to the stored value if the ClickUp read fails).
- **Two articles published this session (2026-07-15):** `how-to-read-blood-test-results` (Ewa-approved, was waiting on the daily tick) and `cholesterol-test` (the stranded one above), both flipped live via the orchestrator, no Coolify redeploy. Content board now: **15 published**, plus `free-androgen-index` correctly `in_review` on Ewa (her task still "to do").

---

## Integrations: live status

### Stripe: LIVE for kits
- Kit checkouts return `cs_live` on production; live keys + `STRIPE_PRICE_KIT_1/2/3` populated in Coolify. Supplement price IDs (`_DAILY_STACK` / `_COLLAGEN` / `_COMPLETE_STACK`) **intentionally unset** until Phase 0b; the subscription route returns a clean 400, not a 500, and supplement pages are coming-soon + waitlist.
- **Live prices:** Kit 1 £99 `price_1Ta1IoLU0SDiIplTCBeHUi4g` · Kit 2 £119 `price_1TcaopLU0SDiIplThAK94iVM` · Kit 3 £179 `price_1Ta1KxLU0SDiIplTZXYzeJ4X`. Kit 2's original `...4WwdIKIS` was mispriced £117 (£2 undercharge), now archived; resolved + verified 2026-05-30 (prices are immutable, so a corrected one was created).
- **Live webhook endpoint created 2026-06-25** at `/api/webhooks/stripe`: 4 events (`checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`). It did **not** exist before: the first real live purchase charged the card but fired no webhook (no order, no dispatch) until this was created + `STRIPE_WEBHOOK_SECRET` re-set. Idempotency via `processed_stripe_events`. Subscription/invoice events are inert until Phase 0b.
- **Coupons (live):** `SUBSCRIBER10` (`oyOOwEuq`) + `LAUNCHDAY10` (`oayVKPWk`), auto-applied via `?discount=<CODE>` → env `STRIPE_COUPON_*` (commit `f3f963d`). Verified end-to-end (Kit 2 + SUBSCRIBER10 → £107.10; Kit 1 + LAUNCHDAY10 → £89.10). `SUBSCRIBER20` intentionally does not exist in live. No promotion codes (coupon auto-apply only).
- Admin cash position: `lib/admin/getCashPosition.ts` → `stripe.balance.retrieve()` (GBP only), Keith-only `/admin/dashboard`, graceful-degrades to 0 + inline error on failure.

### Customer.io: transactional LIVE + verified
- Verified on a **real** purchase (2026-06-25/26) after fixing the email-identifier **collision**: every CIO call now keys on email (`lib/customerio/identity.ts`, commit `61e4a39`). Workspace 219186, EU datacenter.
- Live + verified: T-01/02/03/09; seq-03a + seq-03b; **seq-03c/03d results-signal fix** (shipped 2026-06-26, `e8ea86e`): seg-22 redefined to the `results_all_clear` attribute, seq-03d repointed to the `borderline_nurture_consented` event; live retest passed (kit3 all-clear → seg-22, kit2 low-VitD → seg-21, consent → event delivered after fixing Email 1's `event.kit_name` silent-drop, `3a87392`). Spec: `docs/seq-03-results-signal-fix-spec-2026-06-26.md` (ClickUp 869dw3ge8).
- CA-019 (collection copy) + CA-020 (testosterone-value reword) approved. `unsubscribe_url` uses the `{% %}` Liquid tag.

### Vitall: lab E2E proven
- Live purchase → order → dispatch proven 2026-06-25 (order `322942444`). Webhook lands at `/api/webhooks/vitall` → QStash → `/api/jobs/process-result`. The lab does **not** retry failed webhooks; QStash must be live before the pipeline activates.

### GA4: live
- `G-D5M4J5M3F6` + consent banner, in production since 2026-06-18 (server-side mirror + client gtag; `lib/analytics/`). Phase 1 (server-side Measurement Protocol mirror) verified via GA4 Realtime 2026-06-16; Phase 2 (Consent Mode v2 default-denied + `CookieConsent.tsx` brutalist banner, Accept/Reject equal weight per ICO) live 2026-06-18. Analytics is the only togglable category; ad/personalization stay permanently denied (no ad pixels).

### Low-T routing + nurture: DEPLOYED 2026-06-07, nurture campaign DRAFT

- Low-T (T<12) → **GP referral, no upsell** is live (`classifier.ts`, `resolveCta`); the founding-member list was **taken down** in the live app (join route → 410, `/founding-member` → 307 `/kits`, FM removed from nav/homepage/sitemap). Dormant infra deliberately left (`JoinForm`, `founding_member_list` table 0 rows). Static canonical-site FM sweep also done (`e280a89`); legal T&C/privacy FM sections deliberately left (describe a dormant mechanism, need Ewa review; not a promotion).
- **Consent mechanism built + live:** `POST /api/lowt-nurture/consent` (un-pre-ticked opt-in on the low-T card, below the GP CTA) records consent then sends `low_testosterone` + `lowt_nurture_consent` traits to CIO + fires `lowt_nurture_consented`. Version const in `lib/results/lowtNurtureConsent.ts` (`2026-06-04-v1`), version-locked to CA-014. Migration `lowt_nurture_consent` applied to prod.
- **`buildCioTraits` gating (compliance):** no longer emits `low_testosterone`/`testosterone_value`/`borderline_testosterone` at result-processing: the consent route is the sole gate (closed a pre-consent special-category exposure to a US processor). Energy traits (`low_vitamin_d`/`low_b12`/`elevated_crp`/`crp_level`/`low_ferritin`) are **gated in code on the CA-018 health-processing consent as of 2026-07-07** (fail-closed helper `lib/results/healthProcessingConsent.ts`; raw `crp_level` kept but gated: seq-03a's hs-CRP >10 branch compares the numeric), **deploy pending**. ⚠️ Deploy sequencing: must ship **with or after** the CA-018 checkout-consent deploy, otherwise no customer has consent stamped and seq-03a personalization silently degrades. Conservative default per the open DPIA §4 decision; reversible if Keith + Ewa document a lawful basis instead. **CIO recon 2026-07-07 (live workspace 219186):** seq-03a enters via segment 21 (attribute-change→true on `low_vitamin_d`/`low_b12`/`elevated_crp`) so non-consented users simply never enter (intended degradation, no misfire); `crp_level`/`low_ferritin` appear in no trigger/segment (Liquid-only); seq-03c uses only ungated `results_all_clear` (segment 22); all other running campaigns have empty filters. Profile cleanup NOT needed: all 6 existing CIO profiles are bare (no health attributes stamped). CIO transfer safeguard resolved (CIO DPA = EU SCCs + UK Addendum + DPF cert; no bespoke IDTA).
- **CIO campaign 5** ("seq-03b Low-T Nurture, consented") repurposed to trigger `lowt_nurture_consented`, 3 education-only emails (day 0/+3/+14), **state DRAFT by design**: go-live is a human go/no-go; no TRT/treatment promises. Lawful basis = Keith interim-approved Art 6(1)(a)+9(2)(a) (`03_compliance/2026-06-04-lowt-nurture-lawful-basis.md`); solicitor confirmation task `869d99kzh` open post-launch.

### Kit cross-sell repair: 2026-07-08

An audit found all three kit-to-kit cross-sells non-functional. Repaired + a governing rule set (Keith, 2026-07-08): **post-result cross-sell = the complement, never the superset** (`04_products/results-engine/2026-07-08-post-result-cross-sell-complement-rule.md`).

- **Kit 1 → Kit 2: LIVE, unconditional.** Normal-T Kit 1 returns `secondaryCta: CTAS.kit2CrossSell` (→ `/kits/energy-recovery`). The prior `energy_symptoms` gate was dropped (signal never captured; Kit 2 is the honest default). Includes borderline T (12–<15). Pre-existing compliant Kit 2 helper copy.
- **Kit 2 → Kit 1 broken link: FIXED.** `kit1CrossSell.href` was `/kits/testosterone-health` (404, no such route); corrected to `/kits/testosterone`. Fires for Kit 2 multi-deficiency or Vit-D/B12 + age ≥40. Regression added.
- **Kit 3 cross-sell: removed.** The briefly-added `kit-3-cross-sell` CtaType is deleted; Kit 3 re-sells markers a buyer already has, so it has no post-result cross-sell role. It stays a front-of-funnel default (the test-selector) + direct-traffic product. (Closes the old "engine gap" line by retiring the concept, not building it.)
- **Dead code removed:** the retired `foundingMember` CTA (type `founding-member-list`, unreferenced) deleted from the registry + CtaType union.
- Tests: classifier suite 22 assertions, + consent-gate 37 + maintenance-offer 42; tsc + build clean.

### All-clear maintenance offer: BUILT DARK 2026-07-07, flag OFF, pending Ewa sign-off

- New `maintenance-offer` CtaType + `resolveCtas()` all-clear branch (below every GP-block/GP-referral and low-T/borderline check), gated on `MAINTENANCE_OFFER_ENABLED === 'true'` (server-side, read per call, default OFF = provably inert; flag-OFF output byte-identical, test-asserted). Copy rendered verbatim from `07_sales/funnel/all-clear-maintenance-offer-copy.md` (one card, per-kit claims block via `maintenanceClaimsForKit()`); anchor-card pattern renders the offer once per all-clear result. Button → `/supplement-waitlist` (Phase 0a; no checkout built).
- Events `supplement_offer_shown` / `supplement_offer_clicked` wired through the first-party `/api/events` + GA4 pattern with `segment: 'all_clear'`; fire only when the flag is on.
- Tests: `scripts/test-maintenance-offer.ts` (41 assertions) in `npm test`; suite + tsc + build clean.
- **Ship path:** Ewa signs `07_sales/funnel/all-clear-offer-signoff-pack.md` → flip the env flag + deploy. A "no" ships nothing.

### Lab-cancel ops alert: DEPLOYED 2026-06-30/07-01, alert campaign DRAFT

- Vitall `order-cancelled` → status flip + `emitOpsAlert()` live (commit `9ca878e`, E2E-verified: route returned `202 {orderCancelled:true}`, DB flipped, ops profile got `internal_ops:true`). **CIO campaign 22** ("OPS: Lab Order Cancelled", transactional, trigger `lab_order_cancelled`, template 53) is **DRAFT**; event fires but no email sends until Keith activates it (email delivery not yet tested). Never auto-refunds.

### Ewa author / Person schema: credentials verified

- `lib/authors.ts` Person schema live with verified credentials (GMC **4758565**, licensed GP; `sameAs` = `https://www.gmc-uk.org/doctors/4758565`; "Harley Street TRT-trained" substantiated, cert filed at `03_compliance/credentials/ewa-trt-training-2025.md`). Approved vs avoid phrasings are in that credential file. **Open (low priority):** professional photo (still `/og/default.png` placeholder), LinkedIn `sameAs` (add once her profile is populated), cert PDF storage decision.

### Tracker v1 ("My Story"): designed, NOT built

- Full design spec exists as mockups in `docs/mockups/` (`tracker-v1-scenarios.html` is the primary reference: 8 scenarios, 4 marker-card states, proportional-time sparkline rules, declining-marker + threshold-crossing rules, hs-CRP lower-is-better). Queued for M3–M4 post-launch. **All tracker display logic is frontend-only**: the DB already holds everything; the gap is the display layer (no `Sparkline.tsx`/`TrendBadge.tsx`/`timeline_events` table). Open with Ewa before code: trend-classifier algorithm, retest-date calc, supplement-event API schema.

### Central CTA routing (`kitCTA`): BUILT 2026-07-09, articles not yet migrated

- `lib/content/kitCTA.ts` is the single pillar → CTA-target map, mirroring `06_marketing/seo-ai-search/content-atomisation-model.md` §4. `components/marketing/InlineKitCTA.tsx` takes a `pillar` prop and resolves through it. Guarded by `scripts/test-kit-cta.ts` (wired into `npm test`): asserts every pillar hits a live route, no CTA points at `/lp/*` or the FM list, kit slugs match `lib/pricing.ts`, the three no-live-product pillars hold at email capture, and **Pillar E throws** (Ewa-gated andropause).
- **Built because it did not exist.** Three docs instructed routing through a central `kitCTA` config that had never been written; nine articles hard-coded `ctaHref` instead. Surfaced by the 2026-07-09 content-machine dry run.
- **Migration COMPLETE 2026-07-09.** All **15 articles** (not nine: six existed only in the DB) now name a pillar. Deployed, imported, revalidated, and verified live: all 14 published articles return 200 with byte-identical href, UTM string, and button label; the draft verified via `/blog/preview`. Redirecting a pillar is now one line in `lib/content/kitCTA.ts`.

**Safe order for any future content+code change** (learned the hard way, see below): deploy the component → confirm it is live by rendering a **non-public draft** through `/blog/preview/<slug>?token=$PREVIEW_SECRET` → `import-blog-to-db.ts` → `/api/revalidate` → smoke test. Note the asset-fingerprint trick does **not** detect a server-component deploy (client chunks are unchanged); the draft-preview canary does.

### Two landmines found while migrating (both fixed 2026-07-09)

- **The MDX mirror was stale on `status`.** `b12-blood-test`, `fbc-blood-test` and `ferritin-blood-test` carried `status: draft` in `content/blog/` while the DB had them **published**. `import-blog-to-db.ts` takes status from frontmatter, so running it **silently unpublished three live articles**. This actually happened during the migration and was caught and reverted within minutes. Mirror corrected. **Before ever running the import, diff the mirror's `status:` against the DB, not just the body.**
- **Content and code must ship together, code first.** The DB body and the deployed component are one unit. Importing `pillar=` bodies while the old `ctaHref`-only component was still live **500'd every blog article**. Restored by rolling the DB back within minutes. The component is now backwards-compatible (accepts both), so the safe order is: **deploy the component, confirm it is live, then import the content.** Never the reverse.

---

## Content-engine Action: Content Library mirror step added (2026-07-13)

- `content-library-sync.ts` added to `scripts/content-engine/` (reuses `clickup.ts`; hierarchy + task helpers appended there). The daily `content-engine.yml` run now has a "Content Library mirror" step after the blog-mirror sync (`continue-on-error: true`, so it can never fail the engine). One-way git → ClickUp: upserts one task per `06_marketing/content-machine/assets/*.md` into list `901219526361`; fingerprint-diffed, idempotent (verified 2026-07-13: 0/0/3 unchanged on re-run). Owner docs: `06_marketing/content-machine/` (STATE + build spec).
  **[CORRECTED 2026-08-01 by Phase 1: the mirror's SOURCE moved, its direction did not.** The status it pushes now comes from `content_assets`, because the asset files no longer carry one. Still one task per asset, still one-way, still read-only in ClickUp. Anything in this entry that reads "git wins" is now "the database wins".]**

---

## Phase 0b activation checklist (supplements, deferred)

1. Create live Stripe products + prices for Daily Stack / Collagen / Complete Men's Stack.
2. Add `STRIPE_PRICE_DAILY_STACK` / `_COLLAGEN` / `_COMPLETE_STACK` to Coolify; redeploy.
3. Configure the Billing customer portal in **live** mode (per-mode setting); required for `/api/checkout/portal`; currently unconfigured because there are no 0a subscriptions.
4. Decide dunning: **Stripe-native** Smart Retries vs **CIO T-07** emails; mutually exclusive, running both = double emails. Recommendation: Stripe-native at launch, CIO T-07 as a later reversible brand upgrade.
5. seq-04 Day-75 retest needs `SUBSCRIBER10` (already live); optionally set a fixed `redeem_by` window when the sequence goes live. seq-05 pause option needs the Stripe subscription pause confirmed live in the portal.

---

## LP lab-claim standardised (2026-07-25, deployed)

- The three kit landing pages (`app/lp/{testosterone,energy-recovery,hormone-recovery}`) used a mix of "UKAS accredited lab" (short) and "UKAS ISO 15189 accredited lab". Standardised all instances (visible hero line + SEO metadata) to **"UKAS ISO 15189 accredited lab"** (CA-026 standard; substantiated by Vitall services agreement §3.6). Committed `de074da`, deployed via Coolify, and verified live on production (old short-form absent on all three).

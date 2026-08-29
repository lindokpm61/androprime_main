# Homepage direction brief

**Written 2026-08-27 to survive a session boundary.** The next session starts with none of the
conversation that produced this, so everything needed to run the work is here rather than in a
prompt. Invoke with:

```
/prototype four homepage directions per andro-prime/09_website-app/design/homepage-direction-brief.md
```

> **`/prototype` cannot be invoked by Claude.** It is locked to explicit user invocation, and
> substituting a hand-rolled comparison harness is explicitly disallowed. **Keith must type it, and did, on 2026-08-27.**
> Worth recording what the flag does and does not do: it blocks Claude calling the skill through the
> Skill tool, not execution. Once a human types the command, the skill loads and runs normally.
> Everything else in this brief (Higgsfield, Figma, the fourth direction, Playwright verification,
> the Impeccable gate) Claude can drive unaided.

---

## 1. Why this exists

Keith's read on the first three directions: *"they still look pretty flat and barren."* He is right,
and the diagnosis is not typography. The pages were type and rules on a flat ground, with three
small product photographs and one animation invisible in a screenshot. The brand rules forbid
shadows, gradients and accent colour, so the only remaining levers for richness are **photography,
scale, texture and motion**, and v1 used almost none of them.

**That constraint is now lifted. See section 2.**

## 2. Permission: what may move, and what may not

**Keith's ruling, 2026-08-27.** The brand guidelines were written early, have been followed
religiously, and the business has moved past them. **Take inference from them; break them where
breaking them produces a better modern result.** This is a standing decision, not a one-off.

Two lists, and they must never be conflated:

**MAY move (aesthetic, Keith signs off, and he has):**

> ✅ **Propagated into the guidelines, the tokens and the build on 2026-08-29** — until then this list
> was the only place the permission existed, while `brand-guidelines.md` and `tailwind.config.ts` still
> enforced the opposite. Record: `02_brand/2026-08-29-direction-f-supersedes-v2-non-negotiables.md`. Note that "no accent colour" being on this list
> releases *having* an accent, not the choice of F's specific hex, which is the borderline status
> colour; that is still open.

- `rounded-none` everywhere / no border-radius
- No box-shadow
- White background only, black type only, no accent colour
- Inter Black uppercase `tracking-tighter` headlines
- No gradients, glows, blur or decorative effects
- "Structural black borders instead of whitespace"

**MAY NOT move (compliance, not brand preference; lives in `03_compliance/CONTEXT.md`):**

- No "diagnose", "diagnosis", "treat", "treatment", "cure"
- EFSA-approved wording only, verbatim, for any ingredient claim
- Ashwagandha is a silent ingredient. Never named, anywhere, ever
- Phase 0 / post-CQC boundary. TRT is not available and may not be implied
- The conflict-free receipt, stated as written
- No per-customer clinical interpretation, no "GP-built" or "personalised report" framing
- No membership sold or priced on any acquisition surface (`site-funnel-model.md` v2)
- Zero em dashes in any output, including code comments

Brand sign-off is **Keith**. Ewa is clinical and claims only.

## 3. Audience and device

**Phone first, and not as a breakpoint.** Two surfaces with two different jobs:

- **Phone** is discovery: at work, on a break, scrolling. Its job is to land the argument and
  capture him. Nobody buys a GBP 179 blood panel standing in a break room, so the phone's real
  conversion event is the quiz and seq-06, not the kit CTA.
- **Laptop** is consideration: later, at home, going deeper. This is where purchase happens.

Design at 390px first and scale up. Verify at 390 before 1440, never the reverse.

Audience is men 38 to 55. **This is a presbyopia demographic**, which is why section 7's type floor
is a hard gate and not a nicety.

## 4. Content

**The copy is settled. Do not rewrite it.** It is in the archived v1 files at
`design/mockups/directions/v1-2026-08-27/`, which are the reference for wording, section order and
argument. The spine:

1. Hero. "Your bloods came back normal. That's not an answer."
2. The results panel. Two markers where the lab and our bands disagree
3. Free layer. "We give the thinking away": articles plus a demo account
4. The argument. "In range is a statistical band, not a health band"
5. The record. "A number is a fact. A record is an answer"
6. Kits. "You don't know which question you're asking yet". The nine-marker panel leads
7. Conflict-free. "We do not sell you the answer"
8. Close

Anchoring decisions behind it: `07_sales/funnel/site-funnel-model.md` v2 and
`08_customer-journey/journey-spine.md`.

## 5. Imagery

**Do not use the packaging renders.** Corrected by Keith 2026-08-27: `02_brand/assets/packaging/
renders/*` are the actual product packaging, not mood imagery, and the boxes are white. They stay
available as an option and are otherwise out of the build. v1 leaned on them and it did not solve
the flatness.

**Generate what the pages need.** The brand photography spec already exists in
`02_brand/CONTEXT.md` and is the brief:

> Real men aged 38 to 55, kitchens, offices, gyms. No studios, no fitness models, no stock.
> Forbidden: anything that looks like Numan, Hims, Medichecks, or a Harley Street clinic brochure.

**Split the two image tools rather than pointing both at the same job:**

- **Higgsfield MCP** for photography: the men, the rooms, the hands, the ordinary moments.
- **`imagegen-frontend-web`** (taste-skill) for section-level composition references. It generates
  one reference image per section, which is a different artefact from a photograph.

**Consider inverting the build order.** `image-to-code` (taste-skill) says generate the design
imagery first, analyse it, then build to match. v1 was built first and wished for images afterwards,
which is most of why it reads thin. Image-first is probably the single biggest lever here.

**Compliance on generated imagery:** people in a health context are claim-adjacent. Nothing may
imply a clinical service, a treatment, or a result. `CA-039` governs what may enter the public media
bucket. A mockup is not published, but anything promoted to a live page needs a pre-flight.

## 6. The header specifically

**Keith, 2026-08-27: the header needs more than words on a background.** It needs motion, depth, or
imagery behind the type. In v1 all three heroes were type on a flat ground, and that single choice
is the largest contributor to "flat and barren". Whatever else changes, the header must not be
static type on a plain field.

## 7. Hard constraints, each of which caused a real defect in v1

- **Every number, band edge and marker position must cite `04_products/results-engine/thresholds.md`
  in a comment beside it.** v1's first pass invented an optimal threshold and put a marker at the
  wrong percentage, turning a layout guess into an unevidenced health claim. If a value cannot be
  cited, render visibly fake data instead of plausible data.
- **11px floor on all functional text.** v1 shipped 69 instances below it, inherited from the
  existing house mockups without anyone deciding.
- **4.5:1 contrast minimum.** v1 shipped 37 failures.
- **Zero em dashes**, code comments included.
- **Hero must fit the viewport**: subtext 20 words maximum, CTA visible without scrolling.
- **Beware CSS padding shorthand on a class that also carries `.wrap`.** A later `padding:Ypx 0`
  silently wipes the horizontal padding and the page goes edge to edge.

## 8. Verification, and one trap

- **Playwright, not headless Chrome, for anything below ~500px.**
  `npx playwright screenshot --viewport-size="390,844" --full-page <url> <out.png>`.
  **Trap:** `chrome --headless --window-size=390,N` *captures* 390px but *lays out* at ~500px
  because the browser enforces a minimum window width. The result looks exactly like catastrophic
  overflow and is not. Two rounds were lost to this, and one "fix" would have permanently shrunk a
  headline.
- Check **390 and 1440**, and **both themes** (the pages take `?t=light` / `?t=dark`).
- **Gate:** `npx impeccable detect <files>`. v1 went 138 findings to 4 this way. The 4 that remain
  are one finding repeated, `overused-font: inter`, deliberately not fixed because Inter is the
  documented brand face and the logo glyphs are Inter Black outlined to paths. **Under section 2
  that is now Keith's to reopen if he wants.**
- Serve locally: `python -m http.server 8090` from the repo root.

## 9. The directions

**SUPERSEDED 2026-08-27.** The v1 files stay archived at `design/mockups/directions/v1-2026-08-27/`
and remain the reference for the settled copy. A, B and C were then rebuilt as v2 against this
brief, each spending a different one of the four levers named in section 1, and D gained two
variations. The table records what was actually built.

| | v1 idea | Status |
|---|---|---|
| **A. Specimen** | Bone, serif, hairline. The packaging unfolded | **Built v2.** Lever: photography at scale. Newsreader, full-bleed plate bands, photographic header |
| **B. Instrument** | Smoke, sans, dense. The readout is the hero | **Built v2.** Lever: density and data. Space Grotesk, data hero, a readout that draws itself |
| **C. Broadsheet** | Paper, editorial, airy. Masthead and drop cap | **Built v2.** Lever: texture and print. Instrument Serif, halftone screen, masthead rules drawing |
| **D. Machined** | Built with `high-end-visual-design`. Soft Structuralism x Asymmetrical Bento | **Built, and Keith picked it.** Lever: light and depth. Geist, asymmetrical bento |
| **E. Machined / Cast** | Variation on D, hero ground only | **Built.** A filmed machined surface. Ping-pong loop, 690 KB |
| **F. Machined / Field** | Variation on D, hero ground only | 🟢 **BUILT AND CHOSEN.** A filmed kitchen table with an illegible letter, plus the data field over it. Bookended loop, 254 KB |

**On direction D and the skill that makes it.** `high-end-visual-design`'s "Absolute Zero" directive
bans almost exactly what the brand mandated: it bans Inter, bans 1px hairline borders, and requires
`rounded-[2rem]` squircles, soft diffused shadows and glass or mesh gradients. Under the old rules D
was a deliberate rule-break. **Under section 2 it is simply an option**, and it is the direction
most likely to answer "flat and barren" directly.

**Unused in v1 and worth using:** `minimalist-ui` and `industrial-brutalist-ui` as named aesthetic
presets, and `redesign-existing-projects`, which is audit-first on an existing codebase and matches
this situation exactly.

## 10. Output target

**HTML is not the only option, and may not be the best one.** The Figma MCP can build the directions
as real Figma frames, which gives Keith something he can move, share, or hand to a designer without
anyone redrawing it. A local URL gives him something he can only look at.

**RESOLVED 2026-08-27 (Keith): a new file.** Created at
<https://www.figma.com/design/3la8nvgxYC9fey8QLDuFaA> ("Andro Prime homepage directions"), holding a
`D tokens` collection, the D phone frame at 390, the D desktop frame at 1440, and a sources panel
carrying the same citations as the HTML. The pre-existing Andro Prime Figma file
`O4K7R8RlCKRM7EQ7WxFtCn` is social assets only (the YouTube banner) and was left alone. Two limits
found in passing: the plugin API cannot rename a document, and this plan caps a variable collection
at one mode, so dark values ride in each variable's description. The MCP does require its `figma-use`
guidance loaded before any write, and that holds.

## 11. What "good" looks like

Not "the current site with a nicer typeface". A man on his phone at work should feel he has landed
on something built by people who take the measurement seriously, before he has read a word. Then the
argument should hold up when he comes back to it on a laptop that evening.

The competitors are well funded and design led, and the nearest substitute for "explain my blood
test" is a free AI assistant. The failure mode on the other side is looking like every other
wellness brand, which forfeits the one thing that makes Andro Prime look like it is not selling
something. Restraint is still right. Barren is not restraint.

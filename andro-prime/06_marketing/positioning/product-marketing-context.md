# Product Marketing Context — Andro Prime

*Last updated: 2026-05-11 — FM £75 cash deposit shelved 2026-05-08 (now a non-cash email opt-in / "founding-member list"); Kit 1 panel synced to Vitall canonical (Total T, SHBG, Albumin, Free T (calculated), FAI). Subsequent sweep 2026-05-09: lab partner references updated Thriva → Vitall throughout; legacy £29 entry-price references updated to v2.2 (£99).*

> This is the master context document for all marketing skills. Read this before any other skill context file.
> After reading this, read `../../04_products/icp-kit-supplement-alignment-april2026.md` before writing any kit page, supplement page, results dashboard, or email sequence. That file defines the current selling logic, ingredient claims, dashboard flow, cross-sell triggers, and compliance rules. It supersedes conflicting information in the V7 product docs.

> ⚠️ **POSITIONING SHARPENED 2026-06-24 — read before using the Product Overview, Competitive Landscape, and Differentiation sections below.** The thesis moved from "men's wellness blood testing" to **test-led personalisation: the blood test is the gate that earns the right to recommend anything** — not merely selling a test (the Medichecks model), not selling supplements on a suggestion (the AG1 / Vitabiotics model). Every recommendation is prescribed by the customer's own blood data, with a re-test loop to prove it worked. Full rationale, external market validation, competitor map, and the acquisition flywheel: `../master-plan/2026-06-24-test-led-positioning-validation-flywheel.md`.
>
> - **Internal shorthand: "Don't guess. Test."** Do **NOT** ship this as customer copy — customer-facing wording is still TBD via compliance + Ewa. Internal use only.
> - **Competitive frame shifted.** The reference set is no longer Medichecks alone (that is the "sells a test, not a solution" foil). The funded category we sit inside is **Function Health / Bioniq / InsideTracker**; Andro Prime's unclaimed lane is male-focused, mid-price, UK, genuinely blood-led — between Vitl (too shallow) and Bioniq / Function (too rich / broad). **The Competitive Landscape section below was rewritten to match on 2026-07-09.** Note the item that section now carries and nothing else in this doc did: **Vitall, our own lab partner, sells direct and is therefore a competitor** — so "accredited lab" is table stakes, never a differentiator.
> - **Gate targets restated 2026-07-09** — see the Goals section at the foot of this doc; the old supplement-metric bars are retired.

---

## Product Overview

**One-liner:** Andro Prime tests your blood first, then tells you exactly what to do — no guessing, no GP gatekeeping.

**What it does:** Andro Prime sells at-home diagnostic blood test kits for UK men aged 35–55, followed by data-led supplement subscriptions. Every recommendation is driven by actual biomarker results. The wellness tier (kits + supplements) funds operations and builds a patient pipeline for a future clinical TRT service once CQC registration is complete.

**Product category:** Men's health diagnostics / at-home blood testing (how customers search: "testosterone test at home UK", "men's energy blood test", "men's health MOT")

**Product type:** Custom-built web platform (Next.js / Vercel / Supabase EU region) — kit one-off purchase — subscription upsell — clinical pipeline. Orders are dispatched via Vitall API; results are returned by Vitall webhook. No Shopify. Email via Customer.io (API/event-driven). Affiliate via FirstPromoter (Stripe-native).

**Business model:**
- Kit sales: one-off (£99–£179, premium positioning per financial model). PT-coded sales receive 10% customer discount.
- Supplement subscriptions: recurring MRR (£29.95–£54.95/mo)
- Founding-member list: non-cash email opt-in (£75 cash deposit shelved 2026-05-08; FM continues as a list signal for TRT launch invitations)
- Clinical TRT (post-CQC): £185/mo subscription

---

## Target Audience

**Target customers:** UK men aged 35–55. Not fitness models. Professionals, dads, business owners. Men who are high-functioning but quietly not themselves anymore.

**Decision-makers:** The man himself. Occasionally prompted by a partner. No B2B.

**Primary use case:** Find out why you feel off — tired, slow to recover, lower drive — when your GP says everything is "normal."

**Jobs to be done:**
- "Tell me what my blood is actually showing so I can stop guessing"
- "Give me a supplement I know I actually need, not one I'm guessing at"
- "Get me into TRT faster and cheaper than going through a private clinic cold"

**Use cases:**
- ICP 1 (Symptomatic Achiever): GP dismissed low T symptoms; Kit 1 purchase, then the GP-referral journey on a low-T result (optional consent-gated education nurture). No founding-member CTA.
- ICP 2 (Proactive Optimiser): Training hard, not recovering — Kit 2 — supplement subscription
- ICP 3 (Curious Maintainer): Wants a health baseline — Kit 3 — supplement + retest
- ICP 4 (High-Performance Seeker): Biohacker — future peptide tier, post-CQC

---

## Personas (ICPs)

| Persona | Age | Core Complaint | What They're Hiring Us For | Trust Trigger |
|---|---|---|---|---|
| ICP 1 — Symptomatic Achiever | 38–54 | GP said "normal" but feels terrible | Validation + a path forward | Keith's story, NHS gap content, Ewa's credentials |
| ICP 2 — Proactive Optimiser | 35–50 | Training right, not recovering | Specific biomarker answer + proven supplement | Data, PT endorsement, supplement science |
| ICP 3 — Curious Maintainer | 40–65 | No specific complaint, wants baseline | Prevention + peace of mind | UKAS lab accreditation, comprehensive panel |
| ICP 4 — High-Performance Seeker | 35–55 | Already optimised, wants the edge | Peptide therapy, premium panels | Science-led, clinical credibility |

---

## Problems & Pain Points

**Core problem:** UK men over 35 are experiencing real declines in testosterone, energy, and recovery — but the NHS threshold for "low" testosterone is set to identify pathology, not optimise performance. Men are told they're "fine" when they clearly aren't.

**Why alternatives fall short:**
- NHS GPs: Refuse tests unless symptomatic at a clinical level. "Normal" means not ill — not optimised
- Medichecks / Thriva (consumer competitors): Lab portal only — no interpretation, no recommendation, no clinical pathway
- Balance My Hormones / Optimale (clinical TRT): No data-first entry, expensive, clinical barrier to start
- Generic supplements (Holland & Barrett, Amazon): No blood data — guesswork, wasted money
- Private clinics: Expensive, inaccessible, impersonal, no digital flow

**What it costs them:**
- Years of being told they're fine while feeling terrible
- Wasted money on supplements that may not address their actual deficiency
- Delayed access to TRT for men who need it
- Lost productivity, relationships, performance

**Emotional tension:** "I used to be different. I'm doing everything right. Why am I still knackered?" The GP has failed them. They've searched Reddit. They want someone to actually look at their numbers.

---

## Competitive Landscape

*Rewritten 2026-07-09 against the 2026-06-24 test-led reframe. Full map + backing data: `../master-plan/2026-06-24-test-led-positioning-validation-flywheel.md` §3 and `../seo-ai-search/competitor-organic-teardown-2026-06-21-dfs.md`.*

**The category is real and funded.** Test-led personalisation is not a thesis we invented; someone is already proving customers pay for it. Function Health raised a $298M Series B at a $2.5B valuation (Nov 2025) on 50M+ lab tests since 2023. Bioniq (UK/EU, blood → bespoke supplement granules, quarterly re-test) has raised ~$31M. InsideTracker sells blood → supplement + food + exercise plans at ~$489 for its top tier. That is validation, not a warning: the model works, and none of them is us.

**The structural gap: three camps that never connect.** This is the whole opportunity, and it is the thing to hold in your head when writing anything.

| Camp | Owns the search | Examples | What they miss |
| --- | --- | --- | --- |
| Supplement brands + retailers | "best supplements for men" | Vitabiotics (Wellman), Holland & Barrett, Numan | Never prove the product works. Pure product-collection SEO. |
| Editorial + publishers | "do supplements work" | NHS, Harvard, BBC, Healthline | Raise the doubt, offer no resolution. |
| Diagnostics brands | "vitamin deficiency test" | Randox, Medichecks, Boots | Frame it as deficiency, not "is my supplement actually working". |

Nobody joins the doubt to the resolution. We do: the blood test is the gate that earns the right to recommend anything.

**Test + supplement hybrids (the real comparators).** Even these don't own the proof angle.

- **Function Health** (US) — the category's flagship. Broad-panel, gender-neutral, US-only. Not UK, not male-focused.
- **Bioniq** (UK/EU) — closest geographic threat. Blood → bespoke granules with a quarterly re-test loop, so the loop *is* the product. Positioned luxury/ultra-premium and broad, not male-specific.
- **InsideTracker** (US) — blood → supplement + food + exercise plan. Gender-neutral, premium, US.
- **Vitl** (UK) — ranks on "personalised vitamins", which is a convenience claim, not a blood-led one. Too shallow to be the same product.

**Our lane, stated precisely:** male-focused, mid-price, UK, genuinely blood-led. Between Vitl (too shallow) and Bioniq/Function (too rich, too broad). No one occupies it.

**Diagnostics-only (entry-level foils, not the contest).**

- **Medichecks** — lab portal only. No interpretation, no supplement path, no clinical pipeline. A test, not a solution.
- **Vitall** — ⚠️ **our own lab partner is also a competitor.** They sell direct. The contract does not fence this. The un-copyable gap is brand plus the closed test → supplement → re-test loop, not the lab work, which anyone can buy. Treat any "we use an accredited lab" claim as table stakes, never as differentiation.
- **Thriva** — B2C arm shut down. Monitor for a re-entry signal.
- **York Test** — food intolerance, not men's hormones.

**Clinical / TRT (the tier we cannot serve yet).**

- **Balance My Hormones**, **Optimale** — TRT-first, skip the data-first phase, expensive entry. They are where our low-T customers go if we don't hold them with the GP referral and the education nurture.
- **Voy** — weight-loss adjacent, not hormone-first.

**Indirect.** Private GPs (£200+ for a consultation before any testing). Amazon supplement bundles (no data, pure guesswork). The NHS (free, effectively inaccessible for this cohort, and the source of the "your bloods are normal" wound the whole brand answers).

**How we win.** Every other player either sells you a pill without proof, or sells you a number without a recommendation. We close the loop: blood data gates the recommendation, and the re-test proves it moved. You cannot fake a biomarker the way you can fake an endorsement.

**The objection built into the wedge.** "Test, don't guess" invites a direct counter, and it is already live in the wild: *"deficiency tests are a massive scam / upsell."* Which is to say, **is the test itself just another thing you're selling me?** This must be designed into the positioning, not bolted on afterwards. The four-part answer: the test is cheap enough to not be the profit centre, the recommendation logic is GP-designed and Ewa-signed, you keep your own data, and the re-test is what proves it worked. If a piece of copy cannot survive that objection, it is not ready.

---

## Differentiation

**Key differentiators:**
1. Blood data precedes every recommendation — no guessing
2. Branded results dashboard (not the lab's generic portal)
3. Conditional logic: results trigger specific supplement or clinical CTA based on actual biomarkers
4. Founder-visible brand: Keith went through this exact problem; Dr Ewa Lindo is the clinical credibility anchor
5. Premium positioning at £99–£179 — above MediChecks (lab-portal product) and well below private clinic consultation (£200+ before any testing)
6. Clear pipeline from wellness — clinical (the founding member programme)

**How we do it differently:** We're a diagnostic company that happens to sell supplements, not a supplement company that sprinkles some health content around. The test is the product. Everything else flows from the result.

**Why customers choose us over alternatives:**
- Cheaper than a private clinic (£200+ consultation alone vs £99–£179 with full report)
- More clinical than a generic supplement brand
- More personalised than MediChecks (we interpret and recommend, not just hand over a number)
- More trustworthy than Amazon (UKAS accredited lab, GMC-registered GP)
- Keith's voice makes it feel like a recommendation from someone who's been through it

---

## Objections

| Objection | Response |
|---|---|
| **"Isn't the test just another thing you're selling me?"** (the objection built into the "test, don't guess" wedge; live in the wild as "deficiency tests are a massive scam / upsell") | Fair question, and the answer has to be structural, not a slogan. The test is priced to not be the profit centre. The recommendation logic is GP-designed and signed off by our medical lead, so it isn't a sales funnel dressed as advice. You keep your own data. And the re-test is what proves whether it worked, which is the opposite of what an upsell wants you to check. **If a piece of copy cannot survive this objection, it is not ready to ship.** |
| "I can get a cheaper test on Amazon" | Amazon sells a device. We give you a UKAS-accredited lab result, plain-English interpretation, and a specific recommendation based on your numbers. Not the same thing. |
| "My GP can test me for free" | Good luck with that. GPs test for deficiency, not optimisation. "Normal" just means you're not clinically ill. It doesn't mean you're good. |
| "MediChecks is cheaper" | They are. They hand you a PDF of numbers. We hand you a GP-designed report with a specific recommendation. Different products at different price points. |
| "£119 is a lot" | A private clinic consultation is £200+ before any testing. This is the test, the lab, and a GP-designed report in one, for £119 (or £107 with a PT's code). |
| "I don't trust supplements" | Neither do we, unless there's a reason to take them. That's why we test first. |
| "TRT isn't available yet" | Correct. Right now we do testing and clear next steps only. If your result flags something that needs a doctor, we tell you that straight, with a GP referral. We'll let you know when the clinical service launches. |
| "Is this safe / legit?" | UKAS ISO 15189 accredited lab. GMC-registered GP (Dr Ewa Lindo, Harley Street-trained). All supplement claims are EFSA-approved. |

**Anti-persona:** Men who want a quick-fix supplement without knowing their numbers. Men who want TRT now without clinical oversight. Men under 35 without symptoms. Men looking for a diagnosis (we don't diagnose — we inform).

---

## Switching Dynamics

**Push (frustration with current situation):**
- GP dismissed symptoms without testing
- Tried supplements but no idea if they're working
- Years of feeling "off" with no actionable answer
- Private clinic feels expensive and clinical-cold

**Pull (what attracts them to Andro Prime):**
- Keith's story: credible peer who went through it
- £99 to actually know — accessible relative to a £200+ private consultation
- Branded dashboard: results feel personal, not bureaucratic
- Clear "what to do next" based on their specific numbers

**Habit (what keeps them stuck):**
- "I'll wait and see if it gets better"
- "The GP said normal so maybe it is"
- "I don't want to self-medicate"
- "TRT feels like cheating"

**Anxiety (what worries them about committing):**
- What if the result shows something serious?
- Is TRT safe long-term?
- Am I going to be locked into a subscription?
- Is this a dodgy online pharmacy?

---

## Customer Language

**How they describe the problem:**
- "Not myself anymore"
- "GP said I'm fine but I'm not"
- "Sore for 3 days after a workout that used to take 1"
- "Knackered all the time"
- "My motivation has just gone"
- "I used to be able to push through this"
- "Doing everything right and nothing's changing"
- "Testosterone borderline — doctor said don't worry about it"

**How they describe a good solution:**
- "Actually tells you what's wrong"
- "A real doctor looks at it"
- "Not just a number — explains what it means"
- "Actually recommends something specific"
- "Didn't have to beg my GP"

**Words/phrases to USE:**
- Knackered, tired, drained, flat
- Sore, slow recovery, not bouncing back
- Real doctor / actual doctor
- Find out exactly / know for sure
- Your blood / your numbers / your result
- "GP said normal. That's not the same as good."
- 5 minutes. No GP needed.
- This is what your blood is telling you

**Words/phrases to AVOID:**
- Diagnose / diagnosis
- Treat / treatment / cure
- Testosterone therapy / TRT (on wellness pages)
- Clinical / medical advice
- Suboptimal, biomarker optimisation (wellness fluff)
- "Comprehensive solution" (corporate)
- Deficiency (implies medical condition — use "low" or "below optimal")

**Glossary:**

| Term | Meaning for copy purposes |
|---|---|
| Kit 1 | Testosterone Health Check (£99 RRP / £89.10 with PT code) — Total T, SHBG, Albumin, Free T (calculated), FAI |
| Kit 2 | Energy & Recovery Check (£119 RRP / £107.10 with PT code) — Vit D, Active B12, hs-CRP, Ferritin |
| Kit 3 | Hormone & Recovery Check (£179 RRP / £161.10 with PT code) — all 9 markers combined |
| Daily Stack | Zinc, Vitamin D3, Active B12 supplement (£34.95/mo) — V7.2 formulation |
| Founding member | Non-cash email opt-in (the founding-member list) — waiting for TRT launch |
| Results dashboard | Branded portal showing biomarker results + recommendation |
| UKAS | UK lab accreditation — the quality trust signal to use |
| EFSA claim | Legally approved supplement health claim — must be used exactly |

---

## Brand Voice

**Tone:** Direct, warm, no-nonsense. Like a trusted mate who's been through the same thing and has done his homework.

**Style:** Short sentences. Plain English. Keith talks like a person, not a brand. First person where Keith is writing. Punchy. Specific. Never vague.

**Personality:** Honest, confident, anti-corporate, data-led, personal

**Voice test:** Would Keith say this to a friend in a pub? If not, rewrite it.

**The founders are product features:**
- **Keith Antony** — Founder. Went through this exact problem. His voice is the brand.
- **Dr Ewa Lindo** — GP, Harley Street TRT-trained, GMC-registered. Clinical credibility. Signs off all results report copy.

---

## Proof Points

**Lab credentials:** UKAS ISO 15189 Accredited Lab (Vitall)

**Clinical credentials:** Dr Ewa Lindo — GP, GMC-registered, Harley Street TRT-trained

**Regulatory:** All supplement claims EFSA-approved. No diagnosis, no treatment claims.

**Value themes:**

| Theme | Proof |
|---|---|
| Data first | Every recommendation follows a blood result — not a guess |
| Clinical credibility | GMC-registered GP, UKAS lab — not an Amazon supplement brand |
| Affordable access | £99 to know vs £200+ private consultation |
| Founder-led trust | Keith's personal story, visible and verifiable |
| Plain English | Results in language you can act on, not a lab reference table |

---

## Goals (Phase 0 — Active)

**Primary business goal:** Make the wellness tier (kits + supplements) self-sustaining before CQC registration. Prove PMF. Build founding member pipeline.

**Key conversion actions by priority:**
1. Kit purchase (Kit 1, 2, or 3)
2. Supplement subscription post-result
3. Low-T result: GP referral (no upsell), with optional consent-gated education nurture. No founding-member CTA.
4. Email waitlist sign-up (pre-launch)

**Gate targets** (restated by Keith 2026-07-09 — canonical: `../../01_strategy/CONTEXT.md` → "Gates Reference". The old bars below were retired because supplements were deferred out of Phase 0a on 2026-05-23, so pre-order / conversion metrics measured a product that had not shipped):
- **Gate 0A — spend authorisation (capped downside, not earned demand):** place the MOQ supplement order only when all hold — stock private-label formulation only (no bespoke V7.2, no tooling spend), total first-run exposure capped ~£5,950, MOQ small enough that a total write-off is survivable, clean 4-active spec held (Zinc, D3, Methyl-B12, KSM-66 — ashwagandha silent in all copy). Supplement-waitlist opt-in rate is a directional read only, never a threshold.
- **Gate 0B — unit economics (strategic, post-launch; read at the Tier-2 week 6–12 point):** stage 1 (pre-supplement) CPA < kit gross contribution (£38 Kit 1 / £53 Kit 2 / £77 Kit 3, direct); stage 2 (post-supplement, once attach is observed — not before ~week 8) CPA < blended LTV (~£165, 6-month subscriber). Scale paid beyond the £250–500 Search test only when this holds.
- **Gate 0C — cash (strategic, Month 12):** cumulative cash position vs the £30k "Phase 0 self-funded" threshold (unchanged). Confirms Phase 0 is self-funded → begin CQC prep.
- **TRT day-1 readiness target (any point):** 40+ founding-member list opt-ins — internal commercial-readiness signal (CQC has no patient-volume requirement).

**Current metrics baseline:** Pre-launch. No live data yet. Targets in root `CLAUDE.md`.

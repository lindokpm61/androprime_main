# Product Marketing Context — Andro Prime

*Last updated: April 2026*

> This is the master context document for all marketing skills. Read this before any other skill context file.
> After reading this, read `../../04_products/icp-kit-supplement-alignment-april2026.md` before writing any kit page, supplement page, results dashboard, or email sequence. That file defines the current selling logic, ingredient claims, dashboard flow, cross-sell triggers, and compliance rules. It supersedes conflicting information in the V7 product docs.

---

## Product Overview

**One-liner:** Andro Prime tests your blood first, then tells you exactly what to do — no guessing, no GP gatekeeping.

**What it does:** Andro Prime sells at-home diagnostic blood test kits for UK men aged 35–55, followed by data-led supplement subscriptions. Every recommendation is driven by actual biomarker results. The wellness tier (kits + supplements) funds operations and builds a patient pipeline for a future clinical TRT service once CQC registration is complete.

**Product category:** Men's health diagnostics / at-home blood testing (how customers search: "testosterone test at home UK", "men's energy blood test", "men's health MOT")

**Product type:** Custom-built web platform (Next.js / Vercel / Supabase EU region) — kit one-off purchase — subscription upsell — clinical pipeline. Orders are dispatched via Thriva API; results are returned by Thriva webhook. No Shopify. Email via Customer.io (API/event-driven). Affiliate via FirstPromoter (Stripe-native).

**Business model:**
- Kit sales: one-off (£29–£69)
- Supplement subscriptions: recurring MRR (£29.95–£54.95/mo)
- Founding member deposits: £75 refundable (applied to future TRT)
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
- ICP 1 (Symptomatic Achiever): GP dismissed low T symptoms — Kit 1 — founding member deposit
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
- Medichecks / Thriva (consumer): Lab portal only — no interpretation, no recommendation, no clinical pathway
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

**Direct competitors:**
- **Medichecks** — lab portal only, no interpretation, no supplement path, no clinical pipeline. Positioned as a test, not a solution.
- **Thriva** (now Thriva Solutions, our lab partner) — B2C consumer arm was shut down; we white-label their lab infrastructure
- **York Test** — food intolerance focus, not men's hormones

**Secondary competitors (same problem, different approach):**
- **Balance My Hormones** — TRT clinic, skips the data-first phase, expensive entry point
- **Optimale** — TRT-focused, no wellness tier, no kit entry
- **Voy** — weight loss adjacent, not hormone-first

**Indirect competitors:**
- Private GPs charging £200+ for a consultation before any testing
- Amazon supplement bundles (no data, pure guesswork)
- NHS — free but effectively inaccessible for this cohort

**How we win:** We're the only brand that leads with blood data, produces a branded results report with plain-English interpretation, and creates a conditional supplement or clinical recommendation based on actual numbers. Data first, always.

---

## Differentiation

**Key differentiators:**
1. Blood data precedes every recommendation — no guessing
2. Branded results dashboard (not the lab's generic portal)
3. Conditional logic: results trigger specific supplement or clinical CTA based on actual biomarkers
4. Founder-visible brand: Keith went through this exact problem; Dr Ewa Lindo is the clinical credibility anchor
5. Affordable entry (£29) vs private clinic (£200+ consultation before any testing)
6. Clear pipeline from wellness — clinical (the founding member programme)

**How we do it differently:** We're a diagnostic company that happens to sell supplements, not a supplement company that sprinkles some health content around. The test is the product. Everything else flows from the result.

**Why customers choose us over alternatives:**
- Cheaper than a private clinic
- More clinical than a generic supplement brand
- More personalised than Medichecks (we interpret and recommend)
- More trustworthy than Amazon (UKAS accredited lab, GMC prescriber)
- Keith's voice makes it feel like a recommendation from someone who's been through it

---

## Objections

| Objection | Response |
|---|---|
| "I can get a cheaper test on Amazon" | Amazon sells a device. We give you a UKAS-accredited lab result, plain-English interpretation, and a specific recommendation based on your numbers. Not the same thing. |
| "My GP can test me for free" | Good luck with that. GPs test for deficiency, not optimisation. "Normal" just means you're not clinically ill. It doesn't mean you're good. |
| "I don't trust supplements" | Neither do we, unless there's a reason to take them. That's why we test first. |
| "TRT isn't available yet" | Correct. The founding member deposit secures your place and your £75 is fully refundable. You're not committing to anything. |
| "Is this safe / legit?" | UKAS ISO 15189 accredited lab. GMC-registered prescriber (Dr Ewa Lindo, Harley Street-trained). All supplement claims are EFSA-approved. |

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
- £29 to actually know — very low commitment
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
| Kit 1 | Testosterone Health Check (£29) — Total T, SHBG, Free T |
| Kit 2 | Energy & Recovery Check (£44) — Vit D, Mg, hs-CRP, Ferritin |
| Kit 3 | Hormone & Recovery Check (£69) — all 7 markers combined |
| Daily Stack | Zinc, Magnesium, Vitamin D, B12 supplement sachet (£34.95/mo) |
| Founding member | Deposit holder (£75 refundable) waiting for TRT launch |
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

**Lab credentials:** UKAS ISO 15189 Accredited Lab (Thriva Solutions)

**Clinical credentials:** Dr Ewa Lindo — GP, GMC-registered, Harley Street TRT-trained

**Regulatory:** All supplement claims EFSA-approved. No diagnosis, no treatment claims.

**Value themes:**

| Theme | Proof |
|---|---|
| Data first | Every recommendation follows a blood result — not a guess |
| Clinical credibility | GMC prescriber, UKAS lab — not an Amazon supplement brand |
| Affordable access | £29 to know vs £200+ private consultation |
| Founder-led trust | Keith's personal story, visible and verifiable |
| Plain English | Results in language you can act on, not a lab reference table |

---

## Goals (Phase 0 — Active)

**Primary business goal:** Make the wellness tier (kits + supplements) self-sustaining before CQC registration. Prove PMF. Build founding member pipeline.

**Key conversion actions by priority:**
1. Kit purchase (Kit 1, 2, or 3)
2. Supplement subscription post-result
3. Founding member deposit (£75, triggered by T < 12 nmol/L result)
4. Email waitlist sign-up (pre-launch)

**Gate targets:**
- Gate 0A (Week 6): 25+ supplement pre-orders — place MOQ inventory order
- Gate 0B (Week 10): ≥10% Kit 2/3 buyers converting to supplements — scale paid
- Gate 0C (Month 4): 200+ kits, 40+ subs, MRR > £1,500 — begin CQC prep
- CQC trigger (any point): 40+ founding member deposits — file CQC application

**Current metrics baseline:** Pre-launch. No live data yet. Targets in root `CLAUDE.md`.

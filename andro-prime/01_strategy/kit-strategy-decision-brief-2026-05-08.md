# Kit Strategy Decision Brief — 2026-05-08

*Synthesised from four-agent research pass. Confidence: Medium-High overall (M on competitive pricing because WebFetch was permission-denied for Agent A; H on Reddit demand signal; M on LTV math due to internal pricing inconsistency flagged by Agent C between `non-regulated-tier-v72-financials.md` and `phase0-marketing-plan.md` v2.2). Recommended decision review by Keith with founder-call flags noted in Section 7. UK & NI scope. UK English throughout.*

---

## 1. Executive summary

**Recommendation: adopt Option 4.** Pair Kit 1 with the Daily Stack subscription regardless of T result, decouple founding-member status from low-T outcome, and treat founding-member as a cross-cutting elective layer rather than a low-T-gated CTA. This is the only option that monetises the ~55–70% of Kit 1 buyers who land in "normal range" and currently exit the funnel with zero recurring revenue. It is the only option with a defensible answer to the £99-vs-£29.99 comparison-shopping problem (MyHealthChecked at Boots), and the only option that places Andro Prime in genuine UK whitespace (no UK at-home men's-health brand currently runs the test → first-party result-mapped supplement subscription pattern; Bioniq PRO and humanpeople come closest but don't own the test SKU and don't target ICP 1).

**Top five findings:**

1. **Kit 1 at £99 cannot win on price, panel breadth, or treatment pathway against the existing UK market.** Numan / Manual / Voy / Optimale all sell finger-prick T tests at **£33.95** with GP consultation included and direct TRT prescribing on the back end. **MyHealthChecked at Boots is £29.99.** Kit 1 is 2.5–3.4x the cheapest comparable home T test. Defending £99 on a one-off basis is structurally weak — the only credible defence is a recurring-revenue wrapper around it.
2. **The wasted normal-T cohort is the single biggest economic argument.** UK male median total T is 17 nmol/L (Forth, n=20,000+, 2025). With selection bias, ~30–45% of Kit 1 buyers will land below the <12 nmol/L private threshold; **~55–70% will land in "normal" range and currently have nowhere commercial to go.** That cohort is a £99 transaction with zero LTV beyond — Option 4 turns ~15% of them into £35/mo subscribers.
3. **The Reddit signal validates "GP-interpreted, plain English" as the differentiator UK consumers literally ask for** — but it also validates that they comparison-shop on price and bundle. The "all these companies are much of a muchness" perception is exactly the trap Kit 1 falls into without a continuous-engagement layer.
4. **Phase 0 cash-LTV per Kit 1 buyer (mid-case): Option 4 ≈ £42.86 vs Option 1 ≈ £32.08, Option 2 ≈ £25.77, Option 3 = £0.** Option 4 is the only option that materially moves the needle on Kit 1's economics. Tenure is the single largest swing variable: at the Gate 0C target of <8%/mo churn (~12-month half-life), Option 4 LTV rises to ~£77.32. (Source: Agent C, internal model.)
5. **The deposit-pipeline arithmetic falls short of 40 across all options at minimum-case volumes** (Option 4 produces ~21–33). Originally framed as a "CQC-trigger volume problem"; per Keith's 2026-05-08 clarification, **CQC has no patient-volume requirement** — the 40 is an internal TRT day-1 commercial-readiness target, not a regulatory gate. The arithmetic still informs TRT launch planning, but the framing is reframed in [`trt-launch-readiness-2026-05-08.md`](trt-launch-readiness-2026-05-08.md). Under a richer warm-pipeline definition (active subscribers + opted-in elective FM + engaged low-T results), the 40 number is comfortably reachable.

**Strongest counter-argument to the recommendation:** Option 4 weakens the founding-member CTA's clinical-signal narrative (FM becomes elective, not low-T-gated) and adds Phase 0 operational complexity at exactly the moment Keith's bandwidth is the binding constraint. If post-CQC clinical is *not* the long-term mission — i.e. if supplement subscription is the actual business and TRT is optional — then Option 1 (demote and double down on Kit 2) is cleaner. This is a values-based founder call, not a data call. Section 7 flags it explicitly.

---

## 2. The problem we're solving

Andro Prime sells three at-home blood test kits in Phase 0:

- **Kit 1 — Testosterone Health Check (£99).** The intended funnel: low T (<12 nmol/L) → founding-member list opt-in (non-cash) → deferred TRT post-CQC. Normal T → currently a dead end (no recurring offer, no LTV beyond the £99 transaction).
- **Kit 2 — Energy & Recovery Check (£119).** Result-driven Daily Stack subscription. Phase 0 cashflow lead.
- **Kit 3 — Hormone & Recovery Check (£179).** Premium combo, includes T marker; secondary FM pipeline.

The current v2.2 marketing plan ([`phase0-marketing-plan.md`](../06_marketing/master-plan/phase0-marketing-plan.md)) is explicit that Phase 0 commercial priority is Kit 2 — supplement MRR is the cashflow engine. Kit 1 is structurally exposed:

- **Cheapest direct competitors are 2.5–3.4x cheaper** than Kit 1. (Numan finger-prick £33.95; Manual/Voy £33.95; Optimale £33.95; MyHealthChecked at Boots £29.99; Medichecks base T from £39.)
- **The competitor playbook bundles GP consultation and direct TRT prescription** at £33.95 — Andro Prime cannot prescribe pre-CQC.
- **The current Kit 1 funnel has a structural dead-end** for the ~55–70% of buyers who land in normal range. They paid £99 for a test, were told their T is fine, and the system has no further offer for them.
- **The £75 founding-member deposit is refundable cash float, not Phase 0 revenue.** It only converts post-CQC. (Per `master-implementation-blueprint.md` §7.4 and `03_compliance/CONTEXT.md` Special Cases.)

The strategic question is therefore: what should Kit 1's role be in Phase 0? Four options:

- **Option 1** — Demote Kit 1 (available but not actively marketed)
- **Option 2** — Reposition Kit 1 (add 1–2 recovery markers; "sports hormone check" framing)
- **Option 3** — Drop Kit 1 from Phase 0 entirely
- **Option 4** — Pair Kit 1 with Daily Stack regardless of result; decouple founding-member from low-T outcome

This question matters now because v2.2 enters launch in a matter of weeks and the seq-03b/seq-03c email sequences need to be locked. Drift on this decision delays launch.

---

## 3. The competitive picture

### The UK at-home men's-health market is consolidating around a £33.95 finger-prick → TRT subscription playbook

**Numan dominates by a wide margin.** $113M raised, $90M FY24 revenue, 650k+ patients treated, 33,000+ Trustpilot reviews at 4.6, $60M raised again in July 2025 (Series B extension). Their funnel: **£33.95 finger-prick → £74.50 venous → TRT subscription** with GP consultation included in the test price. Manual rebranded to Voy (2025) and runs the same playbook — initial T test £33.95, TRT from £99/mo, 100k+ Voy members. **Manual has now acquired Optimale** (per Reddit screenshot quoted by user Andy1723: *"We have been acquired by MANUAL"* on optimale.co.uk — [source](https://reddit.com/r/Testosterone/comments/1nuhj30/uk_recommendations/)). Optimale's TRT subscription at £59.99/mo was the cheapest in UK private TRT pre-acquisition.

**MyHealthChecked at Boots is the new bottom-of-market threat that none of the strategy docs currently flag.** £29.99 for a complete T panel (Free Testosterone, Total Testosterone, SHBG, FAI). Sold through Boots high-street and Boots.com, backed by Boots' brand trust and refund infrastructure. Every UK male over 30 has bought something from Boots. This is **70% cheaper than Kit 1 with mass-market distribution.** (Source: Agent A, Confidence H. This is competitive intel not currently in any Andro Prime strategy doc — flagged for incorporation.)

**Medichecks remains the established mid-market incumbent** (2.5M+ tests delivered, 250+ test menu, base testosterone test from ~£39, Male Hormone Panel ~£89, Advanced Well Man £159 with 44 biomarkers). **LetsGetChecked Male Hormone Advanced is £149** with 5 hormone markers. **Forth** owns the sports/recovery tilt (1,610 Trustpilot reviews, sports panels £40–£99, "Build Your Own" 40+ markers).

### The UK consumer perception is "much of a muchness"

Verbatim from r/AskUK ([source](https://reddit.com/r/AskUK/comments/1qasx7o/experiences_with_private_blood_testing_clinics_in/)) — TruffleHunter3000:

> "When I want a new blood test now I just compare a bunch of them for what's included in a test and how much is it vs the competition. And go with the cheapest or the most convenient... All these companies are much of a muchness. They are getting more expensive though (they say it's inflation of course, but I think it's price gouging on top). so I generally hunt around for the lowest price on a test I want every single time and only get a test done if I can find a deal / valid discount code."

And from SecretSquirrelSpot, an 8-year Medichecks customer ([source](https://reddit.com/r/AskUK/comments/1lge0de/has_anyone_in_the_uk_done_a_private_annual_health/)):

> "I always wait for their sales though as 15 or 20 % off is quite a good chunk."

**This is direct evidence that UK consumers comparison-shop on price, chase discount codes, and treat the category as commodity unless they can see a recognisable differentiator.** Andro Prime's compliance discipline (no >10% discount language per v2.2 §3 ASA "exaggerated savings claim" rule) actively works against this audience unless the value delta is structurally visible at the moment of comparison — which a one-off £99 test does not provide on its own.

### The UK consumer also tells you the differentiator they want

Verbatim from r/AskUK, SecretSquirrelSpot (16 upvotes):

> "Mine showed that I was deficient in vitamin d, b12, folate. My triglycerides were high, I had raised CRP (inflammation) and my oestradiol was too low indicating menopausal issues @ age 36. So for me 100% worth it. **They don't just say 'normal' when stuff is out of range, they give you a doctor's summary and explain things in layman's terms.**"

And the inverse complaint from r/AskUK, Flat_Development6659:

> "Doctors notes on the tests seem automated (or they don't take your notes into account)."

Medichecks' Trustpilot signal corroborates this — recurring complaints surfaced by Agent A from uk.trustpilot.com/review/www.medichecks.com:

> "Test results came back very fast but lack of real help with getting my head round whether I needed medical intervention or not."

> "My remaining niggles are that I don't find the doctors comments very helpful."

**The "GP-interpreted, plain English" wrapper Andro Prime sells is the recognised UK differentiator.** It is genuinely defensible. But it is only worth the £99 price gap if the buyer encounters it *before* clicking through to MyHealthChecked at Boots — i.e. the differentiation must be visible at search-and-compare, not just in the post-purchase experience.

### Result-mapped supplement subscription is genuine UK whitespace

This is the strategically most important piece of competitive intel.

**No mainstream UK at-home men's-health brand currently sells a first-party result-mapped supplement subscription bridged from a testosterone test.** Medichecks doesn't. Forth doesn't (test subscription only). Thriva sells supplements but recommendations are not tightly tied to results (per SelfDecode review). Numan and Voy sell supplements but they're same-cart cross-sells after the consultation funnel, not result-gated upsells. Bioniq PRO comes closest but the customer brings the blood test (Bioniq doesn't sell the test); humanpeople is closest by architecture but isn't men's-health-positioned.

**US precedents validate the architecture:**

- **InsideTracker** ($149/yr membership + tests $99–$340, 80% of customers improve at least one biomarker; recommendation-only, no first-party supplements).
- **Function Health** ($365/yr membership, 200,000 members by May 2025, $100M revenue run-rate Feb 2025, $298M raised at $2.5B valuation; recommendation-only).
- **Hone Health** ($129–149/mo, 35-state US footprint, 4.5 Trustpilot 600+ reviews; **first-party supplement subscription, then TRT if needed — Option 4 architecture exactly**).

**Hone Health is the US precedent for Option 4 specifically.** Their pitch: take a finger-prick T test, get a video consult, try supplements first, escalate to TRT if needed. Hone has 5+ years and 600+ reviews proving the pattern monetises. **No UK clone exists.** The men's-health ICP is unoccupied in the UK at-home test → result-mapped supplement subscription.

### The Thriva counter-example

Thriva (UK, $17.1M raised, ~3,000 Trustpilot reviews) is the natural UK precedent for what Andro Prime might become — but Thriva did not build the supplement leg or the clinical leg. They survive but have not broken out, have been through redundancies, and the lack of supplement bridge or clinical bridge **caps their LTV.** Every quarter the subscriber pays for a test, sees results, Thriva captures no further wallet share. **This is direct evidence that diagnostics-only is a low-LTV business** and a structural argument against Option 1 / Option 3 if Andro Prime's long-term thesis is broader than a Thriva-clone.

---

## 4. The demand picture

### The demand engine is "GP fobs me off, going private"

The Reddit pass surfaced this pattern at far higher intensity than the existing strategy docs assume. Hundreds of upvotes on threads where UK adults describe years of GP dismissal before paying privately. Verbatim:

vario_, 37 upvotes, r/AskUK ([source](https://reddit.com/r/AskUK/comments/1lge0de/has_anyone_in_the_uk_done_a_private_annual_health/)):

> "I spend so much time going to the GP with various symptoms and not getting anywhere because they'll just do a blood test and leave it at that. I need a full MOT 😅"

[deleted], 15 upvotes, r/AskUK:

> "So many little issues and symptoms accumulating yet GPs just do a blood test, find nothing, recommend paracetamol and say to come back if it gets worse - which it always does. I swear GPs have never actually fixed any issue I've come to them with, just the same inconclusive tests and a big ol' shrug."

AlGunner, 11 upvotes ([source](https://reddit.com/r/AskUK/comments/1qasx7o/experiences_with_private_blood_testing_clinics_in/)):

> "After years of my GP's ignoring my medical issues I had one, then took it into the doctors who said they hoped I hadnt paid a lot for them as they could have done it for free. I had to remind them I had been asking for investigation but they hadnt done any so I got them myself."

This is the demand engine — and Andro Prime's Keith-led founder content already mirrors it. The strategic implication: **demand for the "I need a full MOT" buyer is real and louder than assumed**, but Kit 3's "MOT" framing has already been retired (per `icp-kit-supplement-alignment-april2026.md`), and Kit 1 doesn't speak to this buyer directly.

### "Tired all the time but blood tests are normal" is a self-organising UK consumer category

Per Agent B, every mainstream UK private-blood-test brand has a "tired all the time" landing page (Bluecrest, Medichecks, Forth, Lola Health, Optimal You, Repose, Phoenix Hospital Group, theIGP, OneMedicine). The framing self-organises: the consumer arrives saying "I'm exhausted, my GP says I'm fine, I want a private test." **Andro Prime does not need to teach the category** — it needs to differentiate within it. This is the Kit 2 territory. Education burden is **low**.

### UK Vit D / "NHS says fine, I feel rubbish" is endemic and culturally specific

Direct thread title from r/VitaminD: ***"NHS says I'm fine, but I feel rubbish. 18.4 ng/mL"*** ([source](https://reddit.com/r/VitaminD/comments/1ktn7f1/nhs_says_im_fine_but_i_feel_rubbish_184_ngml/)). This is a verbatim of Andro Prime's Kit 2 seq-03a positioning — it is *literally already happening as a Reddit conversation*.

Electronic-Yam-4054:

> "Honestly it's a money saving scheme!! Nhs don't want to fork out vitamin d supplements so they made the range wide. **50nmol is deficient in every other country besides the UK 🙄 really frustrates me.**"

Forth's 2024–25 dataset: **49.5% of tested adults below the optimal 75–100 nmol/L Vit D range** (men averaging 77 nmol/L — borderline). NHS Biobank: 22% of UK men 19–64 had 25(OH)D <25 nmol/L (NDNS 2012–14). **The NHS-in-range-≠-optimal wedge is not something Andro Prime needs to build — it's a meme UK consumers are actively pushing on each other.**

### "Sports hormone check" is a recognised UK consumer category — and it's exactly Option 2

oROSSo84 on r/AskUK, 29 upvotes:

> "As I approached 40 I thought I'd get a 'sports hormone check' from medichecks."

Same person, follow-up:

> "I had signs of low testosterone so chose a general well being test that tested for testosterone levels too. Seemed to tick all the boxes of what I wanted to know."

**Direct evidence supporting Option 2.** The pattern of "I wanted a T test but bought the broader panel because it ticked more boxes" is a real UK consumer behaviour. Whether this is *enough* to choose Option 2 over Option 4 depends on the founder call (Section 7) — but the category demand is real.

### The wasted normal-T cohort sizing

Per Agent B, the central economic argument:

| Threshold | Kit 1 cohort below | Cohort *above* (current funnel dead-end) |
|---|---|---|
| <8 nmol/L (NHS-strict) | ~5–10% | ~90–95% |
| <12 nmol/L (private-clinic) | ~20–30% | ~70–80% |
| <15 nmol/L (functional) | ~35–45% | ~55–65% |

**Selection-adjusted estimate for Kit 1 buyers below <12 nmol/L: 30–45%. Therefore ~55–70% land normal-T and currently exit the funnel commercially dead.** Confidence: M (estimate, not measured).

### Skeptic cohort positioning constraint

A loud minority of NHS clinicians and commissioning workers frames the entire private-test category as "preying on the worried well." Frosty_Leg4438, 24 upvotes:

> "Personally I wouldn't do it as their business model is (obviously) in keeping you engaged in their services. This seems ripe for exploitation."

And e_lemonsqueezer (clinician), 4 upvotes:

> "These private 'health checks' prey on the worried well. They really are just there to make money. They'll do a battery of unnecessary tests, and may flag something as 'abnormal' when it doesn't actually have any clinical relevance."

**Implication for Option 4:** the supplement-subscription bridge MUST not feel like upsell-at-all-costs. Tone is load-bearing. The GP-interpreted wrapper, plus visible care discipline (no battery of unnecessary markers, no exaggerated claims), neutralises this critique. The EFSA-anchored copy already in seq-03b (Email 3) lines 113–127 is the right register.

### The UK private TRT market is saturated and competes against Kit 1's deferred-TRT promise

Verbatim:

ddt_uwp on r/Testosterone ([source](https://reddit.com/r/Testosterone/comments/1swddyi/looking_for_trt_companies_uk/)):

> "With Optimale/Normal/Voy. £109pcm for Testosterone Cyp. Blood tests extra (£110 every 6 months)."

Whole-Ad2994: *"I'm with a service that costs me £140p/m. Test c and blood tests are included."*

Brave-One-8879: *"My clinic I pay £129 a month for everything"* (Origin TRT).

**The structural offer "pay £99 now, get supplement subscription, maybe TRT in 12+ months" competes against "pay £109/month and inject this Friday."** That is structurally weak. It strengthens the case for Option 4: Andro Prime cannot win on "we'll do TRT eventually" — the supplement subscription has to deliver actual value today to compete commercially with same-week TRT clinics.

---

## 5. The economic picture

### LTV per option (Phase 0 cash only, per acquired Kit 1 buyer, mid-case)

Per Agent C ([`2026-05-08-funnel-math-option4.md`](research/2026-05-08-funnel-math-option4.md)) using v2.2 blended affiliate mix and 4-month average Daily Stack tenure (planning case between 3-month industry benchmark and the Gate 0C target of <8%/mo churn):

| Option | Cash-LTV (mid) | Cash-LTV (low) | Cash-LTV (high) | Deferred (FM, refundable) |
|---|---|---|---|---|
| **Option 1 — Demote** | **£32.08** | £30.49 | £35.28 | £6–£9 |
| **Option 2 — Reposition** | **£25.77** | £23.08 | £31.16 | £4.50–£6.75 |
| **Option 3 — Drop** | **£0** (no Kit 1 funnel) | — | — | £0 |
| **Option 4 — Pair + decouple** | **£42.86** | £38.57 | £51.44 | ~£3.75 (elective; pool widens to all buyers) |

**Tenure sensitivity (Option 4 mid):** at 3-month tenure £37.50; at 6-month £51.44; **at 12-month (Gate 0C target) £77.32.** Tenure assumption alone moves Option 4 LTV by ~2x.

**Confidence flags (Agent C):**
- Option 1 LTV: M-H (uses today's actual numbers).
- Option 2 LTV: **L** — assumed +£12 COGS for added markers, not validated against Vitall quote; conversion uplift is a guess.
- Option 4 LTV: M — conversion uplift assumes Kit 1 supplement copy converts at Kit 2 rates.

**The Kit 1 economics underneath all options are weak.** Blended Kit 1 net contribution is **£25.70** per acquired buyer (£38.02 direct, £13.37 affiliate, 50/50 mix per v2.2 §1) — that's the floor. Everything above £25.70 is recurring-revenue uplift. Only Option 4 generates a meaningful uplift in-period.

### Founding-member pipeline volumes (Phase 0, 6 months)

| Option | Kit 1 deposits | Kit 3 deposits | Total | Hits 40 list-opt-ins (TRT day-1 readiness target)? |
|---|---|---|---|---|
| Option 1 | 6 | 7–11 | **13–17** | No |
| Option 2 | 5 | 7–11 | **12–16** | No |
| Option 3 | 0 | 7–11 | **7–11** | No (far below) |
| Option 4 | 6 + ~4 elective | 7–11 + ~4 elective | **~21–33** | No, but closest |
| Baseline (current model) | 6–9 | 7–11 | **13–20** | No |

**Finding from Agent C, contextualised:** under no option does the deposit-pipeline arithmetic reach 40 by Month 6 from Kit 1 + Kit 3 alone at v2.2 minimum-case volumes. Under the original framing this looked like a structural progression problem. Per Keith's 2026-05-08 clarification, **the 40 is an internal TRT day-1 commercial-readiness target, not a regulatory CQC gate** — CQC has no patient-volume requirement for granting the application. The arithmetic still informs TRT launch planning under a richer warm-pipeline definition (active subscribers + opted-in elective FM + engaged low-T results), where the 40 number is comfortably reachable. Reframed in [`trt-launch-readiness-2026-05-08.md`](trt-launch-readiness-2026-05-08.md).

**Pipeline-quality consequence under Option 4:** elective FM opt-ins (no clinical reason to be there) convert to TRT at ~30–50% post-CQC vs ~70–85% for low-T-triggered. **One Option 4 incremental deposit is worth ~0.4 of a low-T-triggered deposit.** Argues for keeping the low-T trigger as the primary path even under Option 4 — the elective layer is additive, not replacement.

### EFSA-claim audit summary for Option 4

Per Agent C's tier-by-tier compliance audit, the Daily Stack carries three EFSA-approved claims and one silent ingredient:

- **Zinc** — "Contributes to the maintenance of normal testosterone levels"
- **Vitamin D3** — "Contributes to normal muscle function"
- **Active B12 (Methylcobalamin)** — "Contributes to normal energy-yielding metabolism" / "normal psychological function"
- **Ashwagandha KSM-66** — silent ingredient, no claim; **never mentionable in any copy, anywhere, ever** (per root `CLAUDE.md` Guardrail 3)

**Per-tier compliance verdict:**

| Result tier | Risk | Status |
|---|---|---|
| Optimal (T > 20 nmol/L) | L | Wellness/maintenance framing, EFSA-anchored. Already drafted. |
| Normal (T 15–20) | L | Already drafted in `icp-kit-supplement-alignment` §4.2 and compliant. |
| **Borderline (T 12–15)** | **M** | **The genuinely tight tier.** Zinc's claim is "maintenance of *normal*," not "elevation of borderline." Copy must not imply the supplement will *raise* a low-but-not-clinical level. Every word matters; Ewa must sign off. |
| Low (T < 12) | L–M | Already drafted in seq-03b Email 3, Ewa-reviewed. The honest "these won't replace TRT" disclaimer is mandatory and present. |

**ASA enforcement context (Agent C, M):** ASA enforcement on testosterone-related supplement claims has been active and tightening — five rulings August 2025, nine more December 2025. Option 4 increases the bridge surface area (more bridges = more copy = more audit exposure) but the EFSA-anchor model is already the right defensive posture.

### Operational complexity (Option 4)

Agent C's score: **2.4 / 5 (low–moderate).**

| Dimension | Score | Notes |
|---|---|---|
| Single SKU vs differentiated formulations | 1 | Daily Stack already covers all four tiers via personalised hero-ingredient copy. **No new formulation needed.** |
| Results-engine logic changes | 2 | Single conditional flip per tier in `results-engine/conversion-rules.md`. The thresholds doc is currently a placeholder needing population anyway. |
| Manufacturing / fulfilment | 2 | Within Daily Stack 500-unit MOQ comfortably even at uplifted Kit 1 conversion. |
| Copy & email-sequence work | 3 | 6–10 emails of new/modified copy + one new elective FM landing page + Ewa review. Material but bounded. |
| **CQC-trigger redefinition** | **4** | Founder + Ewa call. Recommend: redefine as "40+ deposits where ≥30 are low-T-triggered" to preserve clinical-signal pipeline-quality argument. |

---

## 6. Per-option scorecard

| Option | Phase 0 Cash-LTV (mid) | FM Pipeline Volume | Op Complexity | EFSA Risk | Margin Defensibility vs Numan/Medichecks/MyHealthChecked | Stars |
|---|---|---|---|---|---|---|
| **Option 1 — Demote** | £32.08 | 13–17 | 1/5 | L | L — Kit 1 still nominally £99 vs MyHealthChecked £29.99, no recurring wrapper | ★★★ |
| **Option 2 — Reposition (recovery markers)** | £25.77 | 12–16 | 4/5 | M | M — broader panel partially escapes direct comparison if priced cleanly, but COGS rise erodes margin and risks Kit 2 cannibalisation | ★★ |
| **Option 3 — Drop entirely** | £0 (no Kit 1) | 7–11 | 1/5 | L | n/a — no Kit 1 to compare; loses ICP 1 narrative entirely | ★ |
| **Option 4 — Pair + decouple FM** | **£42.86** | **21–33** | 2.4/5 | M | **M-H** — Kit 1 + Daily Stack as a system is a different value proposition to a one-off £29.99 Medichecks/MyHealthChecked test | ★★★★ |

**Option 1 — Demote.** Cleanest operationally. Loses ~3–5 deposits over Phase 0 vs current model. Saves no real cost. Wastes the seq-03b sequence already built. Does not solve the Medichecks/MyHealthChecked comparison — it just hides the kit. The ~75 minimum-case Kit 1 buyers happen organically anyway. **Viable but unambitious. Best for a founder who has decided post-CQC clinical is a lower priority than supplement subscription as the long-term mission.**

**Option 2 — Reposition (add recovery markers).** Solves the Medichecks comparison most directly and is supported by the "sports hormone check" Reddit signal. Costs the most operationally — Vitall quote needed for a new panel, new dashboard logic, possibly a price increase to £109–119 to absorb COGS, bringing Kit 1 into Kit 2's price territory. Internal cannibalisation risk is real (existing `icp-kit-supplement-alignment-april2026.md` is explicit about *not* blurring this). The benefit is contested. **High cost, contested benefit. Option 4 captures most of the same upside at lower ops cost.**

**Option 3 — Drop entirely.** Maximum simplification. Burns the launch story ("we test, we treat"). Hard to unwind post-CQC. Loses the ICP 1 narrative anchored in seq-03b, Keith's brand story, and the entire NHS-gap content angle — which is the strongest demand engine in the Reddit pass. **Worst option on the data. Hard to recommend unless founder is genuinely re-platforming away from the testosterone narrative.**

**Option 4 — Pair + decouple FM.** Highest in-period LTV (£42.86 mid). Captures the wasted normal-T cohort. UK whitespace (no precedent). Hone Health validates the architecture in the US. Compliance risk is real but bounded — borderline tier and FM-CTA redraft are the two genuine asks. CQC-trigger redefinition is a real strategic decision but tractable. **Best on unit economics; depends on founder appetite for moderate Phase 0 operational lift in exchange for a structurally better Kit 1 economic.**

---

## 7. Recommendation

**Adopt Option 4.** Pair Kit 1 with Daily Stack regardless of result, decouple founding-member from low-T outcome, treat FM as a cross-cutting elective opt-in.

**Reasons:**

- Only option that monetises the ~55–70% wasted normal-T cohort (the central economic argument).
- Highest mid-case Phase 0 cash-LTV (£42.86 vs £32.08 / £25.77 / £0).
- Structural answer to the £99-vs-£29.99 comparison-shopping problem (MyHealthChecked at Boots): Kit 1 stops being "a £99 testosterone test" and becomes "the entry point to a result-driven supplement subscription, with elective founding-member access."
- Genuine UK whitespace (no UK at-home men's-health brand owns the test → first-party result-mapped supplement subscription pattern) — Hone Health validates the architecture in the US, and Andro Prime can be the first UK clone.
- Carries the same recurring-revenue architecture Numan and Voy have already validated at scale (the wellness-mode equivalent — supplements not prescription).
- Operational complexity is moderate (2.4/5), copy is already partly drafted (seq-03b, seq-03c, icp-kit-supplement-alignment §4.2), and Daily Stack as a single SKU already covers all four result tiers via personalised hero-ingredient copy — no new formulation needed.

**Strongest counter-arguments:**

- **Option 4 weakens the founding-member CTA's clinical-signal narrative.** FM becomes elective; the urgency story ("your blood is telling you something → reserve a TRT slot") is diluted. This is a real cost. Pipeline quality (TRT-conversion-likelihood per deposit) drops for the elective layer.
- **Phase 0 operational lift is real** at exactly the moment Keith's bandwidth is the binding constraint (per the outstanding-tasks list). 6–10 emails of new/modified copy + one new elective FM landing page + Ewa review + CQC-trigger-redefinition decision. Deliverable, but it is non-zero.
- **Phase 0 deposit volumes still fall short of the 40 internal commercial-readiness target** (~21–33 deposits vs 40 at minimum-case volumes). Per Keith's 2026-05-08 clarification, this is a TRT day-1 launch readiness question, not a regulatory gate — and the warm-pipeline definition can be widened beyond deposits (active Daily Stack subscribers, opted-in elective FM, engaged low-T results) to comfortably reach the target. Reframed in [`trt-launch-readiness-2026-05-08.md`](trt-launch-readiness-2026-05-08.md).

**Founder calls that data cannot resolve (require explicit Keith + Ewa decisions):**

1. **Is post-CQC clinical genuinely the long-term mission?** If yes, Kit 1's deferred-revenue value is the largest single LTV component and Options 1/3 destroy the most value. If clinical is now optional or distant, supplement subscription is the actual business. **Strategic identity question.**
2. **Does brand cohesion across wellness → clinical pivot matter more than Phase 0 cashflow?** Option 4 weakens FM's clinical signal but improves cashflow. The two are in tension.
3. **Risk tolerance for Phase 0 operational complexity** at current bandwidth. If bandwidth is binding, Option 4's 2.4/5 complexity may not be deliverable inside the v2.2 launch window.
4. **TRT day-1 launch readiness target.** Per Keith's 2026-05-08 clarification, the 40 was an internal commercial-readiness estimate, not a CQC requirement. Keith + Ewa to decide the actual day-1 TRT pipeline number from a clinical-operations perspective (5–10 = barely viable; 50+ = comfortable; somewhere in between is probably right). And to formalise the metric definition (recommended: warm customers across signals — active subscribers + opted-in FM + engaged low-T results — not deposit-count alone). See [`trt-launch-readiness-2026-05-08.md`](trt-launch-readiness-2026-05-08.md).
5. ~~Whether to retain the £75 deposit at all under Option 4.~~ **RESOLVED 2026-05-08 — £75 cash deposit shelved.** Founding Member continues as a non-cash email opt-in (the "founding-member list"). Intent-signalling moves to form-submission friction + Daily Stack subscription as the real-revenue alternative.

---

## 8. Implementation implications if Option 4 is chosen

Concrete changes Keith needs to make. All copy below respects compliance constraints (no diagnose/treat/cure, no TRT-now claims, no ashwagandha mentions, no >10% discount language).

### 8.1 Pricing-doc reconciliation (data-hygiene blocker)

**Agent C flagged an unresolved pricing inconsistency** between `04_products/catalogue/non-regulated-tier-v72-financials.md` (£89/£99/£149 retail) and `phase0-marketing-plan.md` v2.2 / `phase0-financial-model-v1.md` (£99/£119/£179). This affects every kit margin calculation. **Keith must reconcile before launch** — pick one pricing schema and update the other doc. Recommend retaining v2.2 pricing (£99/£119/£179) since the marketing plan, ICP-kit alignment, and seq-03b copy are all built around it.

### 8.2 Results-engine logic changes

- `04_products/results-engine/thresholds.md` is currently a placeholder — needs Ewa-led population anyway. Lock the Optimal / Normal / Borderline / Low thresholds for T as part of Option 4 work.
- `results-engine/conversion-rules.md` — flip FM CTA from "primary on T<12" to "secondary/elective on every Kit 1 result." Daily Stack CTA becomes primary on every tier.
- `results-engine/results-to-product-mapping.md` (currently placeholder) — populate the canonical table per `icp-kit-supplement-alignment-april2026.md` §8.

### 8.3 Supplement-bridge copy at each result tier (EFSA-compliant)

| Tier | Compliant lead copy (working draft, Ewa to sign off) |
|---|---|
| **Optimal (T > 20)** | "Your testosterone is in the optimal range. Zinc contributes to the maintenance of normal testosterone levels. The Daily Stack provides 30mg alongside Vitamin D3 and Active B12 — common deficiencies in UK men. Many men in your range take it as a maintenance step." |
| **Normal (T 15–20)** | "Your testosterone is in range. Zinc contributes to the maintenance of normal testosterone levels — that's the EFSA-approved claim, and it's the single most well-evidenced mineral for keeping levels where they are. The Daily Stack contains 30mg." (Already drafted.) |
| **Borderline (T 12–15)** | "Your testosterone is at the lower end of the typical range. Zinc contributes to the maintenance of normal testosterone levels. The Daily Stack also includes Vitamin D and Active B12 — both directly tied to energy and recovery. We'd recommend a retest in 3 months to find out how your levels have changed." (Avoid: "find out if it worked"; "raise your testosterone"; "move you out of borderline.") |
| **Low (T < 12)** | "While you wait — support the basics." Zinc + D3 + Active B12 framing; explicit disclaimer "These won't replace TRT — and we'll be straight with you about that." (Already drafted in seq-03b Email 3.) |

### 8.4 CQC-trigger redefinition

Per Keith's 2026-05-08 clarification, the 40-number is an internal TRT day-1 commercial-readiness target, not a regulatory CQC gate. **Recommended (founder + Ewa to ratify): redefine the metric as "40+ warm customers across signals" — active Daily Stack subscribers, opted-in elective FM, low-T-result-with-engagement — rather than deposit-count alone.** This widens the pipeline definition appropriately for the actual goal (TRT day-1 launch readiness). Update `master-implementation-blueprint.md` §1.3 and `03_compliance/CONTEXT.md` Gates table to reflect the corrected framing and avoid the misleading "CQC trigger" language. Full reframing in [`trt-launch-readiness-2026-05-08.md`](trt-launch-readiness-2026-05-08.md).

### 8.5 Founding-member as elective opt-in mechanic

- New elective FM landing page at `/founding-member` (separate from the result-tier-gated CTA).
- New pre-deposit nurture sequence (3–4 emails) for elective opt-ins from Kit 1 normal/optimal cohort and Kit 2 buyers — reframed as "be early for our future clinical service" not "your blood says low T → reserve a TRT slot."
- Elective opt-in rate planning case: 5% of normal-T Kit 1 buyers (Agent C estimate; range 3–8%).
- Ewa must sign off the redrafted CTA narrative — the framing must NOT be adapted from the current seq-03b clinical-trigger language. Different audience, different register.

### 8.6 Partner ICP recalibration — two Tier-A segments under equal-pacing Option 4

Per Keith's 2026-05-08 clarification, under Option 4 Kit 1 and Kit 2 share the same architecture (test → result → Daily Stack subscription) and are promoted at equal pace in Phase 0. The earlier "Kit 2 leads, Kit 1 is FM funnel" framing is superseded — there is no structural reason to demote either kit, and the addressable market is widened by promoting both.

**Two parallel Tier-A partner segments**, both promoted equally:

- **Tier A1 — recovery/performance/strength PTs and creators** (UK lifters, strength-focused PTs, training-optimisation creators) → primary path is Kit 2 referrals; "your programme isn't the problem, your levels are" recruiting register; the "sports hormone check" Reddit signal validates demand for this audience.
- **Tier A2 — testosterone-curious / men's health 35–55 PTs and creators** → primary path is Kit 1 referrals; "GP told me I was fine for 18 months" recruiting register; the NHS-fobs-me-off Reddit pattern validates demand for this audience.

Partners self-select into the segment that matches their audience. The £15 + supplement-conversion-£10 bonus stack from the v2.2 partner programme applies equally to both kit referrals — partners earn the same regardless of which kit they refer.

**Implication for the existing partner ICP research:** the 2026-05-07 partner ICP files (`06_marketing/affiliates/partner-icp-*.md`) were built TRT-tilted and need recalibration to two parallel Tier-A segments rather than the originally-proposed "recovery first / testosterone second" sub-segmentation. Modest extra work; not a redo.

### 8.7 MyHealthChecked competitive response

Add to the Kit 1 product page above the fold: GP-interpreted plain-English wrapper as the visible differentiator at the moment of comparison. This is the recognised UK consumer USP per the Reddit pass and is the only thing that justifies the £99 price gap to a buyer who has just tabbed to Boots.com and seen £29.99. **Compliance constraint:** do not reference competitors by name; do not use "best" / "only" / superlatives; lead with what we do, not what they don't.

### 8.8 Operational sequencing

1. Pricing-doc reconciliation (8.1) — blocker for everything else.
2. Ewa thresholds + results-engine population (8.2).
3. Tier-by-tier supplement-bridge copy + Ewa sign-off (8.3).
4. CQC-trigger redefinition decision + doc update (8.4).
5. Elective FM landing page + nurture sequence (8.5).
6. Above-the-fold differentiator copy on Kit 1 product page (8.7).

Estimated wall-clock: 2–3 weeks if Keith's bandwidth is uncontended; 4–6 weeks realistically.

---

## 9. Open questions and research gaps

| Gap | Surfaced by | Cost to resolve |
|---|---|---|
| Direct competitor pricing pages — WebFetch was blocked for Agent A; all pricing data is from search snippets and aggregator pages | Agent A | Zero — re-run Agent A with WebFetch permission, ~30 min. Confidence M → H. |
| Reddit verbatim signal on Kit-1 comparison shopping at scale (closed substantially by main-thread Reddit pass; some niches like r/SteroidsUK and r/UKFitness returned 0 results — semantic mismatch suspected) | Agents A, B; partly closed by Reddit pass | Prolific 100-respondent UK male 35–55 survey ~£300–500. Single best follow-up if going to Option 4. |
| Daily Stack subscriber average tenure (planning vs actual) — single largest swing variable in all LTV math | Agent C | £0 — Keith decision on planning assumption; validates with M3 actuals once supplements live |
| Kit 1 → Daily Stack conversion rate at v2.2 pricing — current 8% estimate is relative inference, not measured | Agent C | £0 — measurement begins at launch |
| FM-CTA conversion rate from non-low-T cohort (Option 4 elective layer) | Agent C | Requires soft-launch test at M2–M3 |
| Vitall quote for an expanded Kit 1 panel (Option 2 sizing) | Agent C | £0 — email Vitall |
| `04_products/results-engine/thresholds.md` placeholder — Ewa thresholds are a blueprint §7.2 BLOCKER | Agent C | £0 — Ewa sign-off |
| `04_products/catalogue/non-regulated-tier-v72-financials.md` vs v2.2 marketing plan pricing inconsistency (£89/£99/£149 vs £99/£119/£179) | Agent C | £0 — Keith reconciliation. **Data-hygiene issue, blocker for Section 8.1.** |
| MyHealthChecked LSE filings, scale, Boots distribution depth | Agent A | ~1 hour Companies House + LSE filings |
| Function Health / InsideTracker actual conversion-to-membership rates | Agents A, C | Paywalled (Sacra Pro ~$200) |
| ASA case-law on testosterone supplement bridges specifically | Agent C | External regulatory counsel pre-launch sign-off ~£500–£1,500 |

**Recommended single follow-up to lock the decision at High confidence:** Prolific UK male 35–55 survey on willingness-to-pay for supplement-subscription-post-result regardless of result. Cost £300–500. Resolves the Option 4 elective opt-in rate (currently a 3–8% estimate) and validates the comparison-shopping kill-shot framing.

---

## 10. Cross-references

**Research findings docs (this synthesis is built on these):**
- [Agent A — Competitive Landscape & Pricing](research/2026-05-08-competitive-landscape.md)
- [Agent B — UK Demand Signal & Comparable-Business Outcomes](research/2026-05-08-demand-comparable.md)
- [Agent C — Funnel Math, LTV & Option 4 Viability](research/2026-05-08-funnel-math-option4.md)
- [Reddit Verbatim Signal — UK Demand & Comparison-Shopping](research/2026-05-08-reddit-verbatim-signal.md)

**Supporting docs referenced:**
- [Andro Prime root routing](../CLAUDE.md)
- [Compliance CONTEXT.md](../03_compliance/CONTEXT.md)
- [Phase 0 Marketing Plan v2.2](../06_marketing/master-plan/phase0-marketing-plan.md)
- [ICP–Kit–Supplement Alignment (April 2026)](../04_products/icp-kit-supplement-alignment-april2026.md)
- [Master Implementation Blueprint](../10_launch-ops/master-implementation-blueprint.md)
- [Phase 0 Financial Model v1](../01_strategy/phase0-financial-model-v1.md)
- [Daily Stack product spec](../04_products/supplements/daily-stack.md)
- [Kit 1 — Testosterone Health Check](../04_products/kits/kit-1-testosterone-health-check.md)
- [Kit 3 — Hormone & Recovery Check](../04_products/kits/kit-3-hormone-recovery-check.md)
- [Commission structure](../06_marketing/affiliates/commission-structure.md)
- [Copy & Content Context](../02_brand/copy-content-context.md)

**Sibling deliverable:**

- [TRT Launch Readiness — Phase 0 Commercial Planning](trt-launch-readiness-2026-05-08.md) (replaces and reframes the original "CQC-trigger volume problem" stub)

---

*End of brief. Synthesis Agent, 2026-05-08. UK English. For decision review by Keith with founder-call flags noted in Section 7. Do not implement Section 8 changes without first reconciling the pricing-doc inconsistency flagged in Section 8.1.*

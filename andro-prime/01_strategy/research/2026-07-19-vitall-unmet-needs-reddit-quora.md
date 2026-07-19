# Unmet needs analysis: at-home men's health testing (Reddit + Quora VOC)

**Prepared:** 2026-07-19
**Input:** the male-relevant kit map (`vitall-male-keyword-to-kit-map.csv`) + a 6-cluster voice-of-customer mine of Reddit and Quora.
**Purpose:** identify unmet needs, pain points and feature requests behind the kit range, and translate them into prioritised product/app ideas, trends and recommendations.

> Directional VOC signal, not quantified market data. Quotes are verbatim from public forum posts. Anything that becomes customer-facing still needs compliance pre-flight + Ewa sign-off.

> **How this relates to existing repo VOC work (added 2026-07-19).** Built from a *competitor (Vitall) kit-teardown* lens; it **corroborates and extends** the two earlier passes rather than replacing them.
> - `2026-07-17-reddit-quora-unmet-needs.md` (this folder) stays the primary **Andro-Prime-product** VOC: Kit 1/2/3 specifics, the Voy £29 collision, the longitudinal-tracker decision, and the ferritin contract/API flags. Those product-specific findings are **not** re-done here.
> - `../../06_marketing/seo-ai-search/voc-reddit-quora-2026-07-14.md` stays the **SEO persona / JTBD** VOC.
> - What this doc adds on top: a search-volume-**sized** keyword→kit map across all 57 male-relevant kits (`../../06_marketing/seo-ai-search/vitall-keyword-to-kit-map-sized-2026-07-19.csv`), an interactive report (`2026-07-19-vitall-unmet-needs-report.html`), and domain depth the earlier passes did not cover (STI/MSM, cancer/early-detection, GLP-1 monitoring). Overlapping themes (tracking gap, normal≠healthy, finger-prick failure, ferritin, anti-upsell hostility) are second-analyst **confirmation**, not new claims.

---

## 1. Executive summary

Six domains were mined independently (male hormones, GLP-1/cardiometabolic, STI, cancer/early-detection, fatigue/nutrition, and the cross-cutting testing *experience*). They converged on the **same handful of pains**. The category's problem is no longer access to tests - it is that **a test result is a dead end**: a number, in a PDF, with no context, no trend, no meaning, and no next step, delivered to a man who was already dismissed by his GP.

The single biggest opportunity is not more markers or more kits. It is owning the **layer around the result**: interpretation, longitudinal tracking, and a concrete next step - reviewed by a human, respectful of privacy, and honest to the point of declining to sell tests that don't work. Every competitor nails one slice (Thriva = UI, Medichecks = doctor notes, Function = breadth); **none owns interpretation + tracking + trust together**, and a multi-year graveyard of failed indie apps proves both the demand and the difficulty.

**Top 5 moves, in order:**
1. A **"results brain"**: provider-agnostic longitudinal dashboard + plain-English, clinician-checked interpretation with optimal-range flags and explicit next steps.
2. A **symptom-to-panel selector** that kills choice paralysis ("tired all the time? start here").
3. **Connected GLP-1 monitoring** (baseline + 90-day, tied to the user's meds/dose, with reminders).
4. An **STI "window + coverage" wedge**: a window-period calculator, default multi-site MSM kits, and a Mgen/Ureaplasma escalation panel.
5. A **cancer intent-router**: family-history-to-screening-plan + a GP-ready results letter, with a hard firewall between symptom-present and inherited-risk intent.

---

## 2. The ten cross-cutting themes (ranked by strength across clusters)

### 1. GP/NHS gatekeeping and distrust - the demand engine (appears in ALL 6 clusters)
The strongest, most emotional driver into private testing. Men feel dismissed, told they're "normal," refused tests, or sent to a psychiatrist instead of a hormone panel. The product's core positioning writes itself: *the route around the gatekeeper.*
- *"Please don't let your doctor tell you that you're 'normal' or 'healthy'"* - 370 ng/dL at 30, dismissed by multiple GPs ([r/Testosterone](https://reddit.com/r/Testosterone/comments/octg36/)).
- *"I asked my PCP for a PSA test... He refused, telling me 'It's not medically indicated'... I fired him... The PSA came back high, and that's how I discovered the cancer."* ([r/ProstateCancer](https://reddit.com/r/ProstateCancer/comments/1r1xxr6/pissed_at_family_dr_should_i_be/)).
- *"My doctor acts like i need to be half dead before she'll order anything beyond basics."* ([r/Supplements](https://reddit.com/r/Supplements/comments/1uai3c8/finally_got_bloodwork_to_see_if_my_supplement/)).

### 2. "Normal but I feel terrible" - reference range vs optimal range (hormones, fatigue, cardio)
A "normal" number that doesn't match real symptoms, with nobody to explain the gap.
- *"I haaaate the word 'Normal' in anything medicine... normal says exactly nothing about the health status."* ([r/Biohackers](https://reddit.com/r/Biohackers/comments/1utg99y/your_blood_test_says_normal_that_doesnt_always/)).
- *"Results are Now Within Range, But Still Feeling Terrible... just a shrug and an 'everything looks fine.'"* ([r/trt](https://reddit.com/r/trt/comments/145ca09/)).

### 3. The interpretation gap - "numbers, and left me to Google" (ALL clusters)
Men post lab screenshots to strangers because no one will read them. DIY ChatGPT interpretation is now the default fallback - and it's misfiring.
- *"I would like to find one that provides a user-friendly report that explains issues and recommendations in a way I can understand as a novice."* ([r/Supplements](https://reddit.com/r/Supplements/comments/1us0j2j/finally_got_a_full_blood_panel_done_and_turns_out/)).
- *"I tried that with [an LLM]... it misinterpreted a few of them leading me up the wrong path."* ([r/Biohackers](https://reddit.com/r/Biohackers/comments/1r3s8qd/getting_blood_work_interpreted_blood_testing/)). Men want AI *fact-checked by a clinician*.

### 4. The "results brain" - longitudinal, provider-agnostic tracking (loudest single feature request)
Results arrive as static PDFs; no trends, no cross-lab history, no single source of truth. A 214-comment thread asking for this has been open since 2023.
- *"my blood test results are sent to me as text in a PDF and I have to manually find historic records to make comparisons myself... there's got to be a service for this."* ([r/QuantifiedSelf](https://reddit.com/r/QuantifiedSelf/comments/13oaz96/question_is_there_an_website_or_app_that_lets_you/)).
- *"5 years of lab results all trapped in PDF files scattered across different folders."* Labs only graph their own data; switch provider and history is orphaned.

### 5. Actionability - "what do I do now?" (universal; acute for cancer/genetic risk)
- *"Got my bloods back & don't know what to do next... I just don't really know what to do with these results."* ([r/Testosterone](https://reddit.com/r/Testosterone/comments/td4nnb/)).
- On polygenic risk: *"For most polygenic risk scores, the actionability has not yet been demonstrated... there isn't anything your doctor can or should do with them."* Skepticism and appetite coexist.

### 6. Panel-choice paralysis + price opacity
- *"I compared prices for 25 common biomarkers across 10 lab providers. The same test can cost 10-40x more depending on where you buy it."* ([r/Biohackers](https://reddit.com/r/Biohackers/comments/1udus3i/i_compared_prices_for_25_common_biomarkers_across/)).
- *"24M. Spent $350/month on supplements. Bloodwork showed half were actively hurting me."* ([r/Biohackers](https://reddit.com/r/Biohackers/comments/1sdzbcl/24m_spent_350month_on_supplements_bloodwork/)).

### 7. Finger-prick failure - the onboarding pain (universal objection)
Nearly every experienced user's #1 tip is "get a venous/nurse draw instead" - a damning verdict on the core sampling UX.
- *"despite following all the instructions to the letter... I only managed to extract three drops from two fingers. I estimate I need ten times that many."* ([r/AskUK](https://reddit.com/r/AskUK/comments/1ttwrba/home_blood_test_kits_how_do_you_get_the_blood_out/)). Haemolysis/rejection rates (~10-25% capillary vs <2% venous) make results distrusted when they conflict with GP numbers.

### 8. Anxiety-aware delivery - a negative doesn't reassure; alarmist UI panics (STI, cardio)
- *"i have terrible health anxiety... first insti test the circle was dark blue and then... light blue which kinda scared me."* ([r/STD](https://reddit.com/r/STD/comments/1cec2kp/hiv_at_home_tests_accuracy/)). The product's job isn't finished at "negative."
- *"their UI looked like there was a real problem but it wasn't that serious"* - UI-induced anxiety is a design failure.

### 9. The retest-to-prove loop - before/after is the emotional payoff (recurring-revenue signal)
- *"did you actually retest to confirm it moved."* ([r/Supplements](https://reddit.com/r/Supplements/comments/1us0j2j/finally_got_a_full_blood_panel_done_and_turns_out/)).
- Prediabetes reversal posts ("5.9 to 5.3 A1c") and Mounjaro "no longer pre-diabetic!" results are the highest-scoring posts in their subs. The retest *is* the product's motivational spine.

### 10. Trust, honesty and privacy - anti-upsell allergy is real (ALL clusters)
Users actively revolt against interpretation that's a thin upsell, and against data resale.
- *"your post is a basic app pitch... I am just fed up with people trying to peddle their shit."* ([r/Biohackers](https://reddit.com/r/Biohackers/comments/1utg99y/your_blood_test_says_normal_that_doesnt_always/)).
- *"their privacy policy says they... sell your health info to companies that make health products."* ([r/Biohackers](https://reddit.com/r/Biohackers/comments/1mr4hix/which_blood_testing_services_do_you_use_and_why/)). Privacy-first + "we won't sell you a test that doesn't work" is an untapped wedge.

---

## 3. Domain-specific wedges (the sharpest, most product-shaped findings)

**Male hormones.** Emotional wedge: *"your doctor told you you're normal - here's what's actually going on."* Concrete wants: a **complete male panel** (Total + Free T, SHBG, sensitive E2, prolactin, LH/FSH, DHEA) with **assay transparency** (LC/MS vs immunoassay - men know immunoassay overestimates) and correct-timing guidance (before 10am). A TRT-tracker dev thread drew **256 comments** of men begging for a dashboard with symptom diary + PDF/Apple Health import - live proof of demand a *testing* brand can own better than a standalone app. *Compliance: self-med/UGL and threshold-gaming behaviours are real audience signals but must never be encouraged in copy.*

**GLP-1 / cardiometabolic.** The literal gap, stated verbatim: Thriva *"has nothing to do with my Mounjaro prescription and provides no guidance."* Want: a **connected baseline + 90-day panel** tied to the user's meds/dose with retest reminders. Acute rising niche: **"is it fat or muscle?"** - users are "just guessing" on GLP-1 lean-mass loss. Anti-gatekeeping demand for **fasting insulin / HOMA-IR / ApoB / Lp(a)** that GPs refuse (the "skinny but metabolically unhealthy" surprise). Caveat: bundling test+prescription is *contested* - vocal users distrust "programme" lock-ins (SheMed/Oviva backlash); position monitoring as optional, transparent, un-bundled peace-of-mind for the nervous first 90 days.

**STI / sexual health.** Three concrete wedges: (1) a **window-period calculator** (the single most-repeated question - "is day 21 too early?"); (2) **default multi-site MSM kits** (throat + rectal swabs - men and even clinicians forget these) with gag-reflex self-swab guidance; (3) a **Mgen/Ureaplasma escalation panel** for the "tested negative but still symptomatic" dead-end. Plus anxiety-aware results (a negative that actually reassures) and a **positive pathway** (treatment routing + anonymous partner notification).

**Cancer / early detection.** The kit map's symptom-vs-inherited-risk firewall was independently confirmed by the VOC - and users constantly conflate the two. Wants: a **family-history-to-screening-plan** engine ("dad had it, what now?" has no pathway today), a **GP-ready results letter** (ammunition past the gatekeeper), **under-50 access** (the felt NHS gap), and **PSA context** (velocity/trend, not a lone number). *Note: the range has no standalone PSA product despite huge PSA demand - a clear gap.*

**Fatigue / nutrition.** Hero acquisition hook, highly on-brand for men: the **"men don't get iron deficient" myth** - ferritin is the breakout marker (*"Ferritin came back at 14. I never even thought to check iron because I'm a guy"* - 292 upvotes). Plus a **full thyroid panel** vs TSH-only grievance, a **symptom-to-panel selector** for vague fatigue, and the **retest-to-prove-supplements-worked** loop. Trust plays: publicly decline IgG "intolerance" tests (discredited) and be honest about microbiome-test limits.

---

## 4. Consolidated pain points

1. Dismissed by GPs who treat the reference-range number, not symptoms (and don't age-adjust).
2. "Normal" is meaningless to the sufferer; no optimal-range context.
3. Results are a dead end - numbers with no interpretation and no next step.
4. No longitudinal home for data; PDFs, no trends, no cross-lab/NHS merge.
5. Panels omit the markers that matter (Free T/SHBG/E2, FT3/antibodies, ferritin, fasting insulin, Mgen/Ureaplasma).
6. Finger-prick sampling fails often; failed/haemolysed samples erode trust.
7. AI interpretation (DIY and vendor) is untrusted - misreads, ignores history.
8. Anxiety by design - a negative doesn't reassure; alarmist UI panics.
9. Choice paralysis + price opacity (10-40x dispersion); wasted money on the wrong test.
10. Privacy fear and anti-upsell allergy block sign-ups.
11. No pathway after a result - positive STI, high PSA, family-history risk all left DIY.

---

## 5. Feature requests / unmet needs (distilled)

- Plain-English, whole-report interpretation with **optimal-range flags**, not green ticks.
- **Human/clinician-reviewed** interpretation tier - cheaper than a coach, more engaged than a dismissive GP ("the in-between").
- **Longitudinal dashboard**; upload/import any lab or NHS result; Apple Health/wearable sync; clean export.
- **Symptom-to-panel selector** ("which test do I actually need?").
- Every result ships with **concrete next steps** + a **GP-ready letter**.
- **Retest cadence with reminders** at biologically-correct intervals (ferritin ~3-4mo, GLP-1 90-day, PSA annual).
- **Complete/right-markers panels**: male hormone (Free T/SHBG/E2/prolactin/LH/FSH/DHEA, LC/MS); full thyroid (FT3/FT4/antibodies); advanced metabolic (fasting insulin/HOMA-IR/ApoB/Lp(a)); STI escalation (Mgen/Ureaplasma); multi-site MSM.
- **Venous/nurse-draw option** surfaced up front + better finger-prick coaching + no-quibble free redraw.
- **Anxiety-aware, non-alarmist delivery**; a negative that explains *why* it's conclusive.
- **Privacy-first** (no resale, export as a right) and **honesty** (assay transparency; refuse discredited tests).
- **STI window calculator**; **positive-result pathway** (treatment + partner notification).
- **Family-history-to-screening-calendar**; intent routing (symptom vs inherited-risk).

---

## 6. Prioritised product / app ideas

Ranked by strength of signal x fit with the existing kit range. Each names the unmet need and the kits it attaches to.

### Tier 1 - build first (loudest, cross-cutting, defensible)

**A. "Results Brain" - interpretation + longitudinal tracking layer.**
Provider-agnostic dashboard: drop in any PDF (or Vitall result), auto-parse markers, plot every marker over time, flag in-range-but-suboptimal, and attach a plain-English, **clinician-checked** note with 2-3 concrete next steps per out-of-range marker. Import NHS results + Apple Health; privacy-first; full export.
- *Solves themes 2, 3, 4, 5, 10.* This is the differentiation lane - not more markers.
- *Execution rule (from the data): lead with genuine free value; monetise the test, not the reading. Users smell upsell wrappers instantly.*

**B. Symptom-to-panel selector ("Tired all the time? Start here").**
A short symptom quiz that maps a vague complaint to the right panel and recommends **one** kit - killing choice paralysis and "wasted money on the wrong test." Men's-iron-myth as the hero acquisition hook.
- *Solves theme 6; converts the biggest traffic term (fatigue) from the keyword map.*
- Attaches to: Anaemia, Iron Status, Vitamins & Minerals, Thyroid, Male Ultimate Hormones, Male Total Health.

### Tier 2 - high-value, well-scoped

**C. Connected GLP-1 monitoring (baseline + 90-day).**
A purpose-built panel (HbA1c, lipids, LFTs, U&Es/eGFR, fasting insulin, ferritin/B12/vit D, thyroid) sold as *the* Mounjaro/Wegovy panel, tied to the user's start date/dose, with automatic retest reminders and results explained against the journey. Optional un-bundled clinician wrap-around for nervous beginners.
- Attaches to: GLP-1 Essential Wellness, GLP-1 Advanced Nurse Health Check. *Fastest-growing UK demand.*

**D. STI window + coverage wedge.**
(i) "Am I in the window yet?" calculator (exposure date + act -> per-infection conclusive-test date + reminder + one-tap kit) - a free-tool/AEO lead-gen play on the #1 STI question; (ii) default **multi-site MSM kit**; (iii) **Mgen/Ureaplasma escalation panel**; (iv) anxiety-aware results + positive pathway.
- Attaches to: the whole STI range + Gay Male tiers; opens a Mgen/Ureaplasma SKU the range lacks.

**E. Cancer intent-router + family-history screening plan.**
Front-door triage that separates symptom-present (-> "get seen now" + FIT/PSA, GP-ready letter) from inherited-risk (-> personalised screening calendar + when genetics is warranted). Add a standalone **PSA** product (range gap) with velocity/trend context.
- Attaches to: QFIT, Prostate/Bowel/Melanoma/Multi PRS; fills the PSA gap. *Reuses the CSV firewall.*

### Tier 3 - strong, audience-specific

**F. Male-hormone dashboard + symptom diary** (complete panel with LC/MS assay transparency + a TRT-monitoring cadence for the self-directed cohort). Attaches to: Testosterone, Free T & SHBG, Testosterone & Estrogen, Male Ultimate Hormones. *Compliance-sensitive.*

**G. Trust & transparency positioning layer** - UKAS/accreditation badge, "your GP can accept this," named reviewing doctor, no-resale pledge, one-off-or-subscription with user-chosen repeat markers, and a public "tests we won't sell you because they don't work" (IgG intolerance) stance.

---

## 7. Trends

- **GP gatekeeping fatigue + the "worried well" backlash** are colliding: private testing is normalising, but a vocal sceptic camp (often clinicians) calls it a scam - so **credibility/honesty is now the battleground**, not breadth.
- **GLP-1 is reorganising the whole category.** Millions self-prescribing online with zero monitoring is a safety gap and a commercial hub - it legitimately pulls in every other panel.
- **"Optimal not normal"** has gone mainstream (Huberman/Attia-influenced); reference ranges are actively distrusted.
- **The data-liberation movement** (QuantifiedSelf, "PDF hell," Function/Superpower) shows the value is migrating from the test to the *longitudinal record + interpretation*.
- **AI interpretation is both the expectation and the trust risk** - users want it, but only clinician-checked and history-aware.
- **Behaviour-tracker apps** (Shotsy, Needled, Glapp) own logging but **none owns the blood-biomarker layer** - white space a testing brand can fill via an import/API.

---

## 8. Recommendations (roadmap)

**Now (0-3 months) - own the result, cheaply.**
- Ship plain-English, optimal-range result explanations + a simple trend view on existing kits (Tier 1A, MVP).
- Launch the symptom-to-panel selector (1B) and the men's-iron-myth acquisition campaign.
- Add the STI window-period calculator as a free tool (1D-i) - low build, high AEO/lead-gen.
- Surface a venous/nurse-draw option and a no-quibble redraw guarantee; improve finger-prick coaching.

**Next (3-9 months) - fill the panel gaps the VOC named.**
- Connected GLP-1 baseline+90-day monitoring (C).
- Mgen/Ureaplasma escalation panel + default multi-site MSM kit (D).
- Standalone PSA + family-history screening-plan tool with intent routing (E).
- Clinician-reviewed interpretation tier ("the in-between").

**Later (9-18 months) - the moat.**
- Full provider-agnostic "results brain" with NHS import + Apple Health/wearable sync + export (A, full build).
- Male-hormone/TRT dashboard with assay transparency (F).
- Bake the trust/privacy/honesty layer (G) into brand positioning throughout.

**Positioning through-line:** *"Your doctor said you're fine. We'll show you what's actually going on, explain it in plain English, track it over time, and tell you exactly what to do next."*

---

## 9. Compliance & trust guardrails (do not skip)

- **Anti-upsell honesty is a feature, not a risk** - the data shows users punish thin upsell wrappers. Free value first.
- **Decline discredited tests** publicly (IgG food "intolerance"); be transparent on microbiome-test limits and finger-prick vs venous accuracy.
- **Never mis-sell a genetic risk score to a symptomatic user** (blood in stool -> FIT/GP, not PRS) - clinically wrong and a trust-killer. The CSV firewall enforces this.
- **Do not encourage self-med/UGL or threshold-gaming** hormone behaviours in any copy, even though they're real audience signals.
- **GLP-1 monitoring:** frame as optional peace-of-mind, un-bundled and transparently priced; avoid "programme" lock-in language.
- **Privacy:** no data resale; export as a right. Standard Andro Prime pre-flight + Ewa sign-off before anything ships.

---

## 10. Method, sources & limitations

**Method:** six parallel VOC mines via the Reddit connector (discover -> schema -> execute) with top comments, plus Quora/web via search. ~90 threads read to comment level across r/Testosterone, r/trt, r/gynecomastia, r/MounjaroUK, r/Mounjaro, r/Semaglutide, r/prediabetes, r/Cholesterol, r/nafld, r/STD, r/askgaybros, r/ProstateCancer, r/coloncancer, r/Melanoma, r/AskDocs, r/23andme, r/Supplements, r/Biohackers, r/Hypothyroidism, r/B12_Deficiency, r/Anemia, r/Microbiome, r/QuantifiedSelf, r/AskUK.

**Limitations:**
- **Directional, not quantified** - VOC signal, not sized market data.
- **Quora bodies were 403-blocked**; its *question titles* surfaced via search are used as demand signal, not fetched answers.
- **Selection bias** - forum posters skew toward the already-symptomatic and the already-suspicious of their GP.
- **US/UK mixing** in some subs; UK-specific gatekeeping quotes are clearly flagged.

**Suggested next step:** pair this with real search volumes (DataForSEO, UK) against the keyword map to size each opportunity, and run a quick competitor teardown (Medichecks/Thriva/Numan/Function) on exactly the interpretation + tracking + trust trifecta this report identifies as the open lane.

---

# Corrections addendum — 2026-07-20 (adversarial review + teardown + sizing done)

*Both suggested next steps above were done, plus a Fable adversarial review. Three of this report's own conclusions did not survive. This section overrides them; the rest stands.*

1. **The "open lane" thesis is REFUTED — do not use it.** §1 and §6 claim "none owns interpretation + tracking + trust together." The teardown (`../competitive-landscape/2026-07-20-uk-testing-competitor-teardown.md`) shows **Thriva owns that exact triad** (GP review + optimal-range trend dashboard + wearables + subscription), Forth largely does too, and Medichecks has the best accreditation story. The "graveyard of failed apps" I cited was *indie free tools*, not the funded commercial field. **The "Results Brain" is table-stakes on contested ground, not a moat** — especially for a Vitall reseller. Demote it.

2. **The real defensible position (both the review and the teardown converge here):** a **male-positioned testosterone brand that is deliberately NOT a treatment funnel** — *"the men's testosterone test with no reason to sell you testosterone."* Numan/Voy/Manual/Hims UK all monetise the low-T and ED click into TRT (£59.99–£99/mo) and ED meds; Andro Prime's locked constraint (low-T → GP, no product) becomes the moat those funnels structurally cannot copy. The generalists (Thriva/Forth/Medichecks) don't make the claim because they aren't men's brands. This is the headline, not the "results brain". (Honesty limits: don't assert rivals sell data; "named GMC GP" is thin — lead on "conflict-free / nothing to upsell".)

3. **"Sized" was overstated; the hormone cluster is softer than it looked.** DataForSEO (both endpoints) returns **no volume** for the flagship heads (`low testosterone`, `testosterone test`, `ED blood test`, `man boobs`, `gynaecomastia`). The "male-hormones ~136k" total rode on `manopause`/`hyperthyroidism`/`moobs`. Verified new sizes: `PSA test` 33,100 vs `prostate cancer risk` 320 (~100x — the market wants PSA, but PSA is clinically contested → Ewa gate, per the Fable review C2); `erectile dysfunction` 90,500 (treatment intent, an acquisition trap AP can't monetise); `brain fog` 14,800 (now a head row). SERP checks: `manopause` intent is clean male low-T (keep as AEO), `moobs` is surgery/gym/cancer-charity (drop). Detail: `../../06_marketing/seo-ai-search/2026-07-20-keyword-backfill.md`.

4. **Best NEW revenue idea from the review** (answers the "these are free tools" critique): a **prepaid baseline + 90-day retest as one two-kit SKU** — turns the retest-to-prove loop into an AOV-lifting purchase that pre-commits the buyer through the days 15–45 churn window. Full set (gift SKU, B2B/employer, ethnic/occupational panels, seasonal Vit D, paid "Decode My Bloods"): `2026-07-20-fable-adversarial-review.md`.

**Still owed (only Keith/first-party can close):** prevalence + WTP from first-party quiz/survey — does the mainstream £99 buyer want a dashboard, or "tell me I'm fine"? Every conclusion here still rides on Reddit power-users.

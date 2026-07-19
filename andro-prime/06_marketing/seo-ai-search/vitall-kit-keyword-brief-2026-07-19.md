# Vitall male test kits: condition/symptom research + keyword-to-kit map

**Prepared:** 2026-07-19
**Scope:** Male-relevant kits only (see filtering note). Deliverable is this brief plus `vitall-male-keyword-to-kit-map.csv` (274 keyword rows).
**Purpose:** So any inbound keyword (what a man actually types when worried, symptomatic, or shopping) can be routed to the right Vitall kit(s), with the biomarker reason attached.

> This is keyword-mapping and market research, not medical advice and not customer-facing copy. Anything that becomes public still needs the compliance pre-flight and Ewa sign-off. Compliance-sensitive rows are flagged in the CSV `routing_note` column.

---

## 1. What was done

The scraped CSV actually held every Vitall kit (male, female, GenderGP, general). I filtered to the **57 male-relevant kits**: everything explicitly male, plus sex-neutral general/organ/metabolic/STI/cancer/nutrition/hormone kits. Excluded: female-only kits (menopause, female fertility, AMH, breast/ovarian, female STI, Female Total Health, Natel's, Female Ultimate Hormones), the GenderGP-branded range, and the female-framed hormone profiles (Estrogen-only, Advanced/Premium Hormone Profile).

I then ran deep research across five biomarker clusters to capture the real conditions, symptoms and search vocabulary behind each panel: **cardiometabolic**, **male hormones/endocrine/stress**, **sexual health/STI**, **cancer risk**, and **blood/nutrition/inflammation/bone/misc**. The output is a symptom/condition -> kit map built around how people search, not clinical labels alone.

---

## 2. The CSV: structure and how to use it

Columns:

| Column | What it holds |
|---|---|
| `keyword` | The search phrase a man would type |
| `keyword_type` | condition / symptom / biomarker / situation / slang / misspelling / navigational |
| `cluster` | Which of the 7 domains it sits in |
| `primary_kit` | The single best-match kit (usually the most focused/cheapest that answers the query) |
| `also_relevant_kits` | Broader panels and upsells that also cover it (semicolon-separated) |
| `biomarker_rationale` | Why it maps - the actual marker(s) involved |
| `routing_note` | Special rules: intent firewalls, compliance flags, adjacency, timing microcopy |

**How to use it:** it is a routing table. Point a keyword search or a symptom-quiz at `keyword`, return the `primary_kit` (plus `also_relevant_kits` as upsell/alternatives), and use `biomarker_rationale` for the "why this test" copy. `routing_note` carries the rules you must not break.

---

## 3. The five most important cross-cutting rules

These matter more than any single row.

**1. The cancer intent firewall (symptom vs inherited risk).** The genetic PRS tests (Prostate/Bowel/Melanoma/Multi) are **inherited lifetime-risk scores with no symptoms present - not diagnosis, and prostate PRS is not PSA.** A man searching a current symptom must go somewhere else:
- "blood in poo", "change in bowel habit" -> **QFIT** (the only symptom-side test), never a PRS.
- "changing mole" -> GP/dermatology signpost, then funnel the no-lesion/high-risk reader to Melanoma PRS.
- Symptom keywords must be walled off from PRS pages, and PRS pages should carry an "if you have symptoms this is not the right test" signpost. This is both an accuracy and a compliance point.

**2. Fatigue is the biggest shared entry point, and it spans clusters.** "Tired all the time", "no energy", "why am I so tired" legitimately map to testosterone AND thyroid AND cortisol AND vitamin D AND iron/B12/anaemia. Don't force one kit. Build a fatigue symptom page that recommends a broad panel (Male Ultimate Hormones or Male Total Health), then let biomarker sub-pages disambiguate. The CSV routes these to a broad primary with wide `also_relevant_kits`.

**3. Most cardiometabolic disease is silent, so the money terms are anxiety/reason-to-test, not symptoms.** High cholesterol, atherosclerosis, prediabetes, fatty liver and CKD are asymptomatic until advanced. The dominant high-intent query pattern is "am I...", "do I have...", "check my...", "is my X ok", "signs of...", "...test at home UK". Treat these as templated modifiers across every silent condition.

**4. "Result-interpretation" queries are huge and under-served.** "HbA1c 44 meaning", "eGFR 60", "ALT 55", "cholesterol 6.2", "raised ferritin causes", "[marker] normal range UK". Strong ranking + conversion opportunity that most competitors ignore. Flagged in the CSV where relevant.

**5. Ambiguous STI symptoms must route to combined panels.** "Burning when I pee" and "discharge" are the highest-volume STI symptoms and are ambiguous - always route to a **dual Chlamydia + Gonorrhoea** test, with "tested negative but still symptoms" escalating to the complete panel (Trichomoniasis/Mgen/Ureaplasma). And: **painful sore = herpes; painless sore = syphilis** is the single most useful ulcer disambiguation.

---

## 4. Cluster highlights and commercial hooks

**Cardiometabolic (67 rows).** GLP-1 monitoring (Mounjaro > Wegovy > Ozempic, plus "skinny jab"/"fat jab" slang) is the fastest-growing, highest-intent set and the natural **hub product** - it legitimately pulls in every other panel (lipids, HbA1c, liver, kidney, electrolytes), which is exactly why the two GLP-1 kits exist. Second wedge: **"beyond cholesterol"** - the Artery Health (Lp-PLA2) + hs-CRP play targets "family history heart disease normal cholesterol" and "hidden heart risk", capturing worried men whose standard lipids look fine.

**Male hormones (82 rows - the largest cluster).** Hub terms with the highest intent: "low testosterone/low T", "erectile dysfunction blood test", "man boobs/gyno", "male menopause/andropause", "thyroid test". Route the four overlapping symptoms (fatigue, low libido, weight gain, low mood) into the broad male hormone panel, then disambiguate. FSH/LH are "why" markers - surface them on explainer pages, not as symptom entry points. **PED/TRT-adjacent intent** ("pre-TRT bloods", "gyno after steroids") is high-intent and under-served: capture it but keep copy compliant (monitoring/baseline framing, no PED facilitation). Timing microcopy ("test before 10am") is a real search modifier for testosterone and cortisol.

**Sexual health / STI (34 rows).** Buyers search by **panel tier** as much as by infection: basic (C/G/HIV/syphilis) -> "extra safe" (adds hep B/C) -> multi-site MSM (adds oral/rectal swabs) -> complete (adds Mgen/Ureaplasma/Trich). Blood-borne tier (HIV/syphilis/hep) is driven far more by **situation terms than symptoms** - invest in exposure-anxiety pages ("unprotected sex worried", "condom broke", "new partner", "cheated worried", "before new relationship", "MSM screen", "chemsex", "PrEP"). Misspellings (clymidia, gonorreah, siphilis, herpies) carry real low-competition volume.

**Cancer risk (19 rows).** Two firewalled funnels: **inherited-risk** (asymptomatic, family-history) -> the four PRS tests, with Male Multi as the one-test upsell; and **symptom-present** -> QFIT only. UK nuances captured: Black men ~1 in 4 prostate risk from age 45; NHS FIT screens 50-74 so private QFIT fills the under-50 gap; fair skin/sunbeds for melanoma; Lynch syndrome signpost for bowel.

**Blood / nutrition / bone (57 rows).** "Tired all the time" is the umbrella; highest commercial heads are "iron deficiency test", "vitamin D test", "B12 test", "allergy test", "gut health test", "roaccutane blood test", "rheumatoid arthritis test". **Map ferritin by direction** - low = iron deficiency, high = haemochromatosis/inflammation - it is not one node. Men lack the "post-menopausal" trigger for bone loss, so capture bone risk via "male osteoporosis", "men over 50 bones", "low testosterone bone", "steroid bone loss".

---

## 5. Compliance flags (do not skip)

Rows carrying a compliance note in the CSV, gather these before any public copy:
- **Food allergy vs "intolerance":** the Total Allergy Profile is IgE (allergy/sensitisation). Keep "food intolerance" as a captured search term but never claim an IgE test diagnoses intolerance.
- **Alcohol/drug safeguarding cluster:** PEth "proof of abstinence", safeguarding/legal drug testing - preflight before any customer-facing framing.
- **PED/TRT-adjacent hormone terms:** frame strictly as baseline/monitoring, no PED facilitation.
- **Cancer PRS wording:** always "inherited risk score, not a diagnosis"; prostate PRS is explicitly not PSA; symptom signpost on every PRS page.
- House style: no em dashes in customer-facing copy (this internal doc uses hyphens/colons only).

---

## 6. Notable gaps and asymmetries in the current male range

Useful for range/roadmap decisions, not just SEO:
- **No standalone PSA test** in the male range - only the genetic prostate PRS. Men searching "PSA test" or urinary symptoms currently have no direct product; the PRS does not serve that intent.
- **Two near-duplicate free-testosterone kits** (`Free Testosterone & SHBG` and `Testosterone & SHBG`, same markers, different partner brand/URL) - the map treats them as one; worth deciding which is canonical.
- **No direct fasting-insulin / HOMA-IR** in the male metabolic kits, so "insulin resistance" and "normal HbA1c but symptomatic" queries are only partially served by HbA1c - a genuine content-honesty limit and a possible range gap.
- **ED and vascular disease** are strongly linked (ED as an early atherosclerosis sign) - the map bridges ED queries to both hormone and cardiometabolic kits; the site should too.

---

## 7. Suggested next step (optional)

This map is built from clinical knowledge plus UK search-vocabulary grounding - it does **not** yet carry live search volumes. The DataForSEO tools are available in this workspace (`kw_data_google_ads_search_volume` / `dataforseo_labs_google_keyword_ideas`, location UK, English). I can attach real monthly volume and keyword difficulty to every head term so you can prioritise which kits and pages to build first. Say the word and I'll run the head terms through.

# Next keyword selection (2026-08-06)

*Which keywords the next articles should target, and why. All volumes and KD re-pulled live from
DataForSEO (UK, en) on **2026-08-06** per the data-provenance rule; every recommended term also
carries a **fresh SERP verdict**, because KD alone has repeatedly mis-sold targets in this repo.
Governed by [`coverage-rules.md`](./coverage-rules.md) (promotion gate §4b) and
[`content-calendar.md`](./content-calendar.md) (tier mix). Nothing here is promoted yet: the
candidate → accepted flip is Keith's call.*

---

## 1. Where the engine actually is

- **18 articles live, zero drafts** (verified against `blog_articles`, 2026-08-06). Unchanged since
  the andropause hub on **2026-07-30**, so the locked 2/week Mon+Thu cadence has been dark for a week.
- **The `keyword_queue` is stale and cannot answer "what's next".** All three `accepted` rows
  (`fbc-blood-test`, `ferritin-blood-test`, `b12-blood-test`) still read `coverage_status=briefed`
  although those articles went live **2026-06-22**. Of the 11 remaining `candidate` rows, most are
  off-strategy (`hiv test kit`, `superdrug blood test`, `full body mot health check`) and all were
  imported 2026-06-21. The queue is a 7-week-old snapshot, not a live worklist. Fixing the write-back
  is a separate job (see §6).
- So this pass went back to `keywords.csv` (1,054 rows, 939 with no `coverage_status`) and re-validated
  the live candidates directly.

### Tier mix: the wellness floor is breached

`content-calendar.md` targets ~40% wellness / ~40% clinical-curious / ~20% TRT and names a hard rule:
**protect the ~40% wellness floor**. Actual, across the 18 live articles:

| Tier | Live | Share | Target |
|---|---:|---:|---:|
| Wellness (A vit D, B fatigue/stress, K brain fog) | 5 | **28%** | ~40% |
| Clinical-curious (D, G, H, I, J, C testing angle) | 11 | **61%** | ~40% |
| TRT-specific (E andropause, C natural-T) | 2 | 11% | ~20% |

Exactly the drift the calendar predicted: the clinical-curious gaps rank easiest, so the queue drained
that way. The next batch has to be wellness-weighted, and that constraint drove the pick below.

---

## 2. Recommended next four (two weeks at the locked cadence)

### 1. `how to lower cortisol` — 18,100/mo, KD 18 · **wellness tier** · Pillar B (stress)

The single biggest unclaimed winnable cluster in the portfolio, and it fixes the wellness floor.

- **Cluster (DFS suggest, 2026-08-06):** `how to lower cortisol` 18,100/KD18 · `how to lower cortisol
  levels` 9,900/KD18 · `foods that lower cortisol` 1,300/KD19 · `foods to lower cortisol` 1,300/KD25 ·
  `natural ways to lower cortisol` 320/KD22 · `cortisol test` 5,400/**KD6**. Realistic non-supplement
  addressable **~35k/mo**.
- **SERP verdict: OPEN.** No AI Overview, **no NHS page on page one**. Boots, BBC Food, Cleveland Clinic,
  Henry Ford, GoodRx, Healthline, Benenden, plus a small UK blog (`thelagom.co.uk`) ranking at #7. If a
  one-man UK blog holds page one, a men's-health domain with 18 live articles can.
- **Why it fits:** `signs-of-stress-in-men` is live and has **no clinical spoke**. The feeling-first rule
  says the feeling hub is the entry and the clinical term is the rank target. Cortisol is that rank
  target, and it is missing. 19 CSV rows already sit under `cortisol` / `future-kit-cortisol`, unclaimed.
- **Compliance: the sharpest constraint in the portfolio. Read before briefing.**
  The cluster's cheapest sub-cluster is `supplements to lower cortisol` and friends: **8,100/mo at KD
  6-25** across a dozen phrasings, plus `does ashwagandha lower cortisol` 320/KD25. **We cannot write
  any of it.** Ashwagandha KSM-66 is the silent ingredient (Guardrail 3, never named anywhere, including
  in a "supplements that don't work" list), and its strongest evidence base is precisely cortisol
  (`04_products/supplements/formulation-evidence-review-2026-07-02.md`: cortisol -27.9%). GoodRx ranks
  page one with the exact angle we are barred from. **The brief must exclude the supplement axis by
  design** and win on behaviour, sleep, alcohol, training load, and food. That is a narrower article
  than competitors write, and it is non-negotiable.
- **Commercial connection: none we are allowed to name. Read this before ranking it first.**
  - **No kit measures cortisol.** Kit 1 (T + SHBG/albumin), Kit 2 (Vit D, Active B12, hs-CRP,
    ferritin), Kit 3 (the two combined, 9 markers), Kit 3 Plus (DRAFT, metabolic add-ons). **Kit 6
    Cortisol is parked**, gated on Vitall confirming dried-blood-spot viability, because the clinically
    preferred method is a 4-sample saliva test that does not fit the postal finger-prick model.
  - **No supplement we can talk about.** The Daily Stack has four actives: zinc, D3, Active B12, and
    ashwagandha. Ashwagandha is the only cortisol-relevant one, it is the silent ingredient, and its
    strongest evidence base is cortisol specifically. It can never be named. The other three have no
    cortisol claim.
  - **Kit 1 is not available as the bridge.** The Kit 1 scoping rule bars framing it as an explanation
    for general fatigue or stress symptoms, which is exactly this article's cohort.
  - **So the only honest CTA is Kit 2**, framed as "cortisol is not on any panel we sell; here is what
    we can actually see" (Vit D, B12, hs-CRP, ferritin cover the same felt symptoms). That framing is
    on-message for conflict-free positioning, but it is a weak commercial hook by construction.
  - **Consequence:** treat this as a **traffic, authority and GEO asset**, not a conversion asset. It is
    the biggest winnable cluster we have and it earns almost nothing directly. If the next slot has to
    pay for itself, `how to increase ferritin levels` is the one with a live product behind it
    (ferritin is a Kit 2 marker), and cortisol should follow it rather than lead.

### 2. `alt blood test` + the liver-enzyme cluster — ~20k/mo, KD 4-20 · clinical-curious · Pillar H

- `alt blood test` 8,100/**KD20** · `ggt blood test` 6,600/**KD4** · `alp blood test` 4,400/**KD10** ·
  `bilirubin blood test` 1,000/KD7.
- **Pre-sanctioned.** The live H hub's §5a coverage map explicitly parks rows 379-382 (incl. `alt liver
  function test`) as *"covered in passing; future spoke"*. No promotion-gate conflict, and the hub is
  already there to pass authority and take the up-link.
- **SERP verdict: MIXED, workable.** MedlinePlus, labtestsonline, Mayo, LiverUK, NHS SPS (a clinician
  page, not a patient page), plus commercial clinics (London Clinic, Ubie). No AI Overview.
- **Shape:** one spoke covering ALT/GGT/ALP/bilirubin together reads better than four thin marker pages
  and matches how the results actually arrive. `ggt blood test` was already flagged ACCEPTED in the
  queue notes on 2026-06-21 and never briefed.

### 3. `how to increase ferritin levels` — 4,400/mo, **KD 0** · clinical-curious · Pillar D

- Plus `high ferritin causes` 1,300/**KD0**.
- **SERP verdict: WEDGE.** The only NHS results are two PDFs (a GP guide and a patient leaflet), not
  ranking web pages. The rest is competitor testing brands: Bluecrest, Forth, imaware, mitohealth,
  Nature's Best, GoodRx. That is the cleanest gap on this list.
- **Distinct intent, so no cannibalisation:** the live `ferritin-blood-test` owns *test* intent; this is
  *what do I do about it* intent. Passes §4b check 1 on intent, not just slug.
- **Compliance:** iron is EFSA-claim territory and self-supplementing iron is genuinely risky when
  ferritin is high rather than low. Resolves to "discuss with your GP", never to a dose.

### 4. Fourth slot: hold, or extend the cortisol cluster

The obvious wellness picks all fail the SERP gate (§3), so rather than force a fourth target, the
better use of the slot is a **second cortisol asset** (`cortisol test` 5,400/KD6 as a testing-intent
companion) or the **Pillar E spoke** work that CA-028 already unblocked, noting that E's spoke demand
is much thinner than the hub implied (§3).

---

## 3. Rejected, with the reason (so they do not resurface)

Each of these looks good on volume or KD and dies on the SERP. This is why the SERP verdict is recorded
alongside the numbers.

| Candidate | DFS 2026-08-06 | Why not |
|---|---|---|
| `hba1c test` | 18,100 / KD22 | SERP is **diabetes**: Diabetes UK, NHS trust, MedlinePlus, NCBI, Boots Online Doctor. YMYL condition SERP, and the I hub deliberately says *"the hub does NOT target the diabetes SERP"*. Keep HbA1c as a section, not a target. |
| `high cortisol symptoms` | 12,100 / KD23 | SERP is **Cushing's syndrome** (NHS, NIDDK, Mayo, cancer centre). A rare-disease SERP, off-positioning. Target `how to lower cortisol` instead, which returns a lifestyle SERP. |
| `how much vitamin d3 should i take daily` | 8,100 / KD26 | NHS at #2, NHS Inform, NIH ODS, Harvard, Mayo. Institutional lock. Hook only. |
| `best time to take vitamin d` | 3,600 / KD24 | Same lock: NHS, Cleveland, BHF, Healthline, Boots. CSV has it `planned`; it should not be. |
| `vegan omega 3` | 3,600 / KD0 | The KD0 is real and misleading: the SERP is **pure e-commerce** (Vegetology, Biocare, Nature's Best product pages, Amazon). Not an article SERP, and our omega-3 is not launched. The Tier-1 note calling this "wide open" should be corrected. |
| `always exhausted` | 2,400 / KD36 | NHS, Bupa, BHF. Also same intent as the live `why-am-i-always-tired` hub: fold, do not brief. |
| `visceral fat` / `belly fat men` / `why cant i lose belly fat` | 18,100/KD55 · 590/KD61 · 210/KD64 | The calendar names the belly-fat feeling hub as the "highest-leverage gap". **Fresh data says the head terms are unwinnable.** If that hub gets built it is a positioning and newsletter asset, not an SEO target. |
| `psa test` / `prostate blood test` | 33,100/KD55 · 3,600/KD55 | Locked, and no prostate kit (Kit parked). |
| `fatty liver symptoms` | 18,100 / KD41 | Condition SERP, higher KD, and disease framing we should not lead with. |
| `night sweats in men` | **no volume returned**, KD44 | The calendar lists this at 8,100. That figure is stale. Do not brief on it. |
| `manopause` | 49,500 / KD10 | Already flagged CONTESTED: the SERP is owned by one established brand. Unchanged. |

---

## 4. Compliance flags to carry into the briefs

1. **Cortisol article: the ashwagandha exclusion is structural, not a wording check.** See §2.1. Route
   through `/compliance-preflight` with this called out explicitly, because the omission is invisible to
   a scanner looking for banned terms: the risk is a writer *adding* the term to be helpful.
2. **No kit exists for cortisol.** CTA to Kit 2 / email capture, never an implied cortisol test.
3. **Ferritin: no dosing advice.** Resolves to GP, per the standing referral rule.
4. **Liver spoke inherits H-hub §19 decisions wholesale** (lean-spoke rule, marketing CONTEXT.md §8).
5. Every one of these still needs Ewa sign-off before publish. Unchanged.

---

## 5. Recommended sequence

| Slot | Target | Tier | Vol / KD | Gate |
|---|---|---|---|---|
| Next Mon | `how to lower cortisol` | wellness | 18,100 / 18 | ashwagandha exclusion in brief |
| Next Thu | `alt blood test` (+ ggt/alp/bilirubin) | clinical | ~20k / 4-20 | lean spoke off live H hub |
| Following Mon | `how to increase ferritin levels` | clinical | 4,400 / 0 | no dosing advice |
| Following Thu | `cortisol test` **or** a Pillar E spoke | wellness / TRT | 5,400 / 6 | Keith's pick |

This lands the wellness tier at roughly 32-36%, still short of the 40% floor but moving the right way
for the first time since June.

---

## 6. Next actions

1. **Keith picks** from §5. Nothing is promoted until then: the candidate → accepted flip is the human
   gate (`coverage-rules.md` §4b).
2. On his pick, run the **guarded promoter**, which re-runs checks 1-4 programmatically:
   ```bash
   # from 09_website-app/frontend
   npx tsx scripts/content-engine/promote-keyword.ts --query "how to lower cortisol" --dry
   ```
   The cortisol and liver-enzyme terms are not yet rows in `keyword_queue`, so they need importing or
   inserting first.
3. **Fix the queue write-back (separate job).** `reconcile-coverage.ts` writes live status back into
   `keywords.csv` but the three published articles above still read `briefed` in `keyword_queue`. Until
   that closes, the queue cannot be trusted to answer "what is already done", which is the one question
   the promotion gate depends on.
4. **Correct two stale figures** when next editing `content-calendar.md`: `night sweats in men` (no
   volume, not 8,100) and the `vegan omega 3` "wide open" note (e-commerce SERP, not an article target).

---

*Volumes must be re-checked at brief-lock, per the standing governance rule. DFS spend on this pass: ~$0.14.*

# Next keyword selection (2026-08-06, rechecked 2026-08-07)

*Which keywords the next articles should target, and why. All volumes and KD re-pulled live from
DataForSEO (UK, en) on **2026-08-06** per the data-provenance rule; every recommended term also
carries a **fresh SERP verdict**, because KD alone has repeatedly mis-sold targets in this repo.
Governed by [`coverage-rules.md`](./coverage-rules.md) (promotion gate §4b) and
[`content-calendar.md`](./content-calendar.md) (tier mix). Nothing here is promoted yet: the
candidate → accepted flip is Keith's call.*

> **Recheck, 2026-08-07 (§7).** Every finalist below was re-pulled and re-SERPed a day later, and the
> cholesterol cluster was tested from scratch on Keith's recollection that it was a live candidate.
> **Three changes:** cholesterol is rejected on the SERP and recorded in §3; a new wellness pick,
> `cortisol belly` (8,100/mo, KD 4), enters at slot 2; and the ferritin **"KD 0" figures below are
> wrong** and have been corrected to `n/a` in place. Read §7 before acting on §5.

**Reading the numbers:** `n/a` means DataForSEO returned **no value** for that metric, which is not the
same as zero and must never be rendered as zero. A candidate with `KD n/a` cannot be ranked on
difficulty at all; its case rests on the SERP verdict alone.

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
  - ~~**So the only honest CTA is Kit 2**, framed as "cortisol is not on any panel we sell; here is what
    we can actually see" (Vit D, B12, hs-CRP, ferritin cover the same felt symptoms).~~
    **WRONG, corrected 2026-08-07. The CTA is email capture (`/waitlist`), not Kit 2.**
    `09_website-app/frontend/lib/content/kitCTA.ts` is the source of truth for CTA routing and it
    routes the `stress` pillar to `/waitlist` with `kit: null`. Its own comment warns against exactly
    the move written above: *"Do not 'nearly match' these to Kit 2: sending liver-function intent to
    an energy kit is the mis-route this map exists to prevent."* Kit 2 is Vitamin D, Active B12,
    hs-CRP and ferritin; none of them is cortisol. The live `signs-of-stress-in-men` spoke already set
    the precedent as kit-less, newsletter-only. **This error was written into both cortisol entries
    and into `06_marketing/STATE.md`, and reached the brief stage before the routing map was read.**
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

### 3. `how to increase ferritin levels` — 4,400/mo, **KD n/a** · clinical-curious · Pillar D

- Plus `high ferritin causes` 1,300/**KD n/a**.
- **CORRECTED 2026-08-07: these were written here as "KD 0" and that was wrong.** DataForSEO returns
  **no `keyword_difficulty` value at all** for either term, verified against two endpoints
  (`keyword_overview` and `bulk_keyword_difficulty`) on 2026-08-07. Absent is not zero, and rendering it
  as zero made this the easiest-looking target on the page. **The pick still stands, but on the SERP
  verdict below, which is independent evidence, not on a difficulty score that does not exist.**
  For scale: `low ferritin symptoms` in the same cluster comes back **KD 55**, so the cluster is not
  uniformly soft.
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

**Superseded by the recheck.** §7.2 fills this slot with `cortisol belly` (8,100/mo, **KD 4**), which
is a stronger wellness asset than either option above and is the only winnable route into the belly-fat
territory the calendar wanted. `cortisol test` drops to fifth.

### 5. `cortisol belly` — 8,100/mo, **KD 4** · wellness tier · Pillar B (stress) · NEW 2026-08-07

The best single find of the recheck, and the reason the fourth slot no longer needs to be a hold.

- **Volume, live 2026-08-07:** 8,100/mo, **KD 4**. Twelve-month range 5,400 to 12,100, no decay.
  Companion `cortisol face` 3,600/mo (low competition, but skews aesthetic and female; not our angle).
  Google's own related searches include **`cortisol belly men`** as a listed variant, which is an
  explicitly unserved slice of a term nobody is serving in a men's-health voice.
- **SERP verdict: OPEN, the weakest field on this list.** **No NHS page on page one.** Boots #1,
  Baylor Scott & White #2, a 1994 PubMed abstract #3, WebMD #4, a YouTube Short #5, **a Birmingham City
  University psychology blog #6**, Midi Health #7, Verywell #8, and **a supplement contract
  manufacturer's blog at #9**. A university blog and a contract manufacturer holding page one is a
  field a real men's-health domain can enter.
- **The AI Overview is a reason to take it, not to avoid it.** There is an AIO, and it cites Boots,
  WebMD, Ubie, Everyday Health, Midi Health, Allara and a YouTube Short. **No NHS, no institutional
  lock in the citation set** — it is drawing on exactly the class of publisher we are. That makes this
  a live GEO citation target, which most of our other candidates are not.
- **Why it fits the portfolio, three ways at once.** It is **wellness tier**, which is the binding
  constraint (§1). It **extends the cortisol brief already being written for §2.1**, so one research
  pass serves two articles. And it is **the winnable entry to belly fat**: `content-calendar.md` calls
  the belly-fat feeling hub the "highest-leverage gap", and §3 below kills its head terms at KD 55-64.
  This term reaches the same reader at KD 4.
- **Compliance: the same ashwagandha exclusion as §2.1, and here it is visible on the SERP.** The #9
  result recommends ashwagandha by name, and four of the eight related searches are supplement queries
  (`supplements to reduce cortisol and belly fat`, `cortisol belly supplements`). **We cannot write any
  of it**, for the reason in §4.1. The article wins on sleep, alcohol, training load, food and stress
  behaviour, and on being straight that the term is not a diagnosis.
- **One framing rule the SERP hands us, and it is on-brand.** Google's own AIO leads with *"not a
  formal medical diagnosis"* and routes true cortisol excess to Cushing's syndrome. Our article must do
  the same, and that is the `myth-of-normal-range` posture the brand already owns: name the thing
  honestly, then say what is actually measurable.
- **CTA: email capture (`/waitlist`), kit-less. Corrected 2026-08-07.** No kit measures cortisol (Kit 6
  parked), and `lib/content/kitCTA.ts` routes the `stress` pillar to `/waitlist` with `kit: null` by
  design. **Not Kit 2** — see the struck-through correction in §2.1.
- **Gate check:** no collision. `signs-of-stress-in-men` is live and mentions cortisol in passing but
  claims **no** cortisol keyword; `brain-fog` and `why-am-i-always-tired` claim none either.

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
| **The cholesterol cluster** (added 2026-08-07) | see §7.1 | **Head terms locked, and the hub is already live.** `how to lower cholesterol` 27,100/**KD 48** returns an AI Overview plus NHS #1, BHF #2, Mayo #3, HEART UK #4, Stroke Association #5, Nuffield #6, Harvard #7, MedlinePlus #8. **Eight institutional results out of eight.** Every sibling is worse: `how to reduce cholesterol` KD 56, `foods to lower cholesterol` KD 59, `how to lower cholesterol naturally` KD 58, `what causes high cholesterol` KD 57, `high cholesterol symptoms` KD 46, `ldl cholesterol` KD 55, `hdl cholesterol` KD 55. Full reasoning in §7.1. |
| `brain fog causes` (added 2026-08-07) | 1,900 / KD 18 | **Already ours.** It is the `primary_query` of the live `brain-fog` hub. Fails promotion-gate check 1 outright. Listed here because the numbers look attractive and it will otherwise resurface. |
| `statins side effects` (added 2026-08-07) | 33,100 / **KD 9** | The most tempting number in this whole pass, and it is a prescription-medicine query. We sell nothing here, cannot counsel on a POM, and advising men on statin tolerance is clinical territory we are not registered for until CQC. **Compliance is the blocker, not the SERP.** Do not brief. |
| `insulin resistance` / `prediabetes symptoms` (added 2026-08-07) | 22,200/KD 58 · 8,100/KD 56 | This is the "future blood-sugar spoke" the live I hub points at. Both locked, and both sit on the diabetes SERP the I hub deliberately avoids. **The blood-sugar spoke is not buildable at these terms**; the hub's forward reference should not be read as a green light. |
| `low ferritin symptoms` (added 2026-08-07) | no volume returned / KD 55 | Sits next to the §2.3 pick and reads like a natural companion. It is not. Do not fold it in as a target. |

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

**Superseded by §7.3 on 2026-08-07.** Kept for the record; the live sequence is the one in §7.3.

| Slot | Target | Tier | Vol / KD | Gate |
|---|---|---|---|---|
| Next Mon | `how to lower cortisol` | wellness | 18,100 / 18 | ashwagandha exclusion in brief |
| Next Thu | `alt blood test` (+ ggt/alp/bilirubin) | clinical | ~20k / 4-20 | lean spoke off live H hub |
| Following Mon | `how to increase ferritin levels` | clinical | 4,400 / ~~0~~ n/a | no dosing advice |
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
5. **Added 2026-08-07 — a third `content-calendar.md` edit, and this one is not just a correction.** The
   calendar names the belly-fat feeling hub the "highest-leverage gap" and §3 killed its head terms at
   KD 55-64. `cortisol belly` (§2.5) reaches the same reader at **KD 4**. When Keith promotes it, the
   calendar's belly-fat entry should be rewritten to route through the cortisol framing rather than
   deleted, because the audience judgement in it was right and only the target was wrong.

---

## 7. Recheck (2026-08-07)

*Triggered by Keith recalling cholesterol as a live candidate. It is not, and the check was worth running
anyway: it turned up one correction, one new pick and four fresh rejections. Everything below is a live
DataForSEO pull on 2026-08-07 with SERPs fetched the same day.*

### 7.1 Cholesterol: the hub is already live, and what is left is locked

**Where the recollection came from.** `cholesterol-test` is **article 15 of the 18 that are live**
(Pillar I hub, primary query `cholesterol test`, 28,030/mo addressable). Its coverage map parks six rows
as *"covered in passing; future Pillar I spokes own them"* and names an **ApoB spoke** and a
**blood-sugar spoke** as the default follow-ons. That is almost certainly the memory: cholesterol was
sanctioned as a *future spoke area* by the hub, not selected as a next target by this doc.

**Tested from scratch, and it does not hold.** `how to lower cholesterol` is the biggest term in the
cluster at **27,100/mo**, and its SERP is the exact inverse of the cortisol one that made §2.1 the lead
pick:

| | `how to lower cortisol` (§2.1) | `how to lower cholesterol` |
|---|---|---|
| Volume | 18,100 | 27,100 |
| KD | **18** | **48** |
| AI Overview | **none** | **yes**, citing NHS, BHF, Stroke Association, Mayo |
| NHS on page one | **no** | **#1** |
| Weakest page-one result | a one-man UK blog at #7 | Nuffield Health at #6 |

Page one is NHS, BHF, Mayo, HEART UK, Stroke Association, Nuffield, Harvard, MedlinePlus. Eight out of
eight institutional. Every sibling term is harder still (§3). **This is the same institutional lock that killed
`how much vitamin d3 should i take daily` and `best time to take vitamin d`, and it should be treated the
same way: hook material inside other articles, never a target.**

**What genuinely remains, and why it is still not next.** Three terms survive: `home cholesterol test`
2,900/**KD 7**, `apob test` 880/**KD 9**, `how to lower triglycerides` 1,000/**KD 18**. The ApoB SERP is
genuinely open (Superdrug, Cleveland Clinic, Harvard, labtestsonline, One Day Tests, Bluecrest,
Medichecks; **no NHS**) and its AI Overview cites private testing brands, which makes it a real GEO
target. But: total addressable is **under 5k/mo**, and **ApoB is already the live hub's hero H2** — its
own brief says *"default: hub covers, ApoB spoke owns later"*. Splitting it out now risks cannibalising
the hub's single differentiator for a few hundred visits a month. **Verdict: real, small, and not urgent.
Park it as a Pillar I spoke behind the four picks below.**

### 7.2 The one new pick: `cortisol belly`

8,100/mo at **KD 4**, wellness tier, open SERP, no NHS on page one, and an AI Overview citing only
commercial publishers. Full case in **§2.5 above**. It enters at slot 2 and displaces the "hold" that was
sitting in the fourth slot. It is also the only winnable route into the belly-fat territory
`content-calendar.md` calls the highest-leverage gap, whose head terms this doc already killed at KD 55-64.

### 7.3 Live recommended sequence (supersedes §5)

| Slot | Target | Tier | Vol / KD | Gate |
|---|---|---|---|---|
| 1 | `how to lower cortisol` | wellness | 18,100 / 18 | ashwagandha exclusion, structural |
| 2 | `cortisol belly` | wellness | 8,100 / **4** | same exclusion; must say "not a diagnosis" |
| 3 | `alt blood test` (+ ggt/alp/bilirubin) | clinical | ~20k / 4-20 | lean spoke off the live H hub |
| 4 | `how to increase ferritin levels` | clinical | 4,400 / **n/a** | no dosing advice; GP referral |
| 5 | `cortisol test` | wellness | 5,400 / 6 | testing-intent companion to 1 and 2 |
| — | `apob test` + `home cholesterol test` | clinical | ~3.8k / 7-9 | **park**: cannibalises the live I hub's hero |

**Tier effect.** Slots 1-5 are three wellness and two clinical. Against the 18 live articles that moves
wellness from **28% to 35%** (8 of 23), the first real move toward the 40% floor since June. Running
slots 1 and 2 back to back is the fastest way to close it, and they share one research pass.

**Sequencing note, unchanged from §2.1:** if the next slot has to pay for itself, **ferritin is the only
pick on this list with a live product behind it** (a Kit 2 marker). Both cortisol articles are traffic,
authority and GEO assets that earn nothing directly, because no kit measures cortisol and the one
relevant supplement actives can never be named.

### 7.4 Two corrections this pass forced

1. **"KD 0" was never real for the ferritin terms** — DataForSEO returns no value. Corrected in §2.3 and
   §5. **The rule that follows: a missing metric is `n/a`, never `0`.** For a difficulty score the
   coercion always errs toward "do it", which is how a term with no difficulty signal became "the
   cleanest gap on this list".
2. **`brain fog causes` reached a shortlist while being the `primary_query` of a live article.** It was
   caught by grepping the published MDX frontmatter, not by the gate. Every live article carries a
   machine-readable `keyword_coverage` block stating exactly what it claims; the duplicate check should
   read that, not the `keyword_queue` table that §1 already established is seven weeks stale.

---

*Volumes must be re-checked at brief-lock, per the standing governance rule. DFS spend: ~$0.14 on the
2026-08-06 pass, ~$0.11 on the 2026-08-07 recheck.*

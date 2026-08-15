# Fan-out spoke plan: 35 spoke articles under 17 existing hubs

**Date:** 2026-08-15
**Owner:** Keith Antony
**Status:** PLAN. Nothing here is promoted, briefed or written. The 4b promotion gate
(`coverage-rules.md` §4b) is unchanged and is still the article boundary.
**Source:** the 149 `role=fanout` rows in [`keywords.csv`](./keywords.csv), from
`dataforseo.mjs fanout`. Method and verdicts: [`tools/README.md`](./tools/README.md).
**Why spokes and not hub sections:** [`2026-08-15-informational-citation-diagnosis.md`](./2026-08-15-informational-citation-diagnosis.md).

---

## The decision this implements

Fan-out children become **their own pages**, each linking up to the hub it decomposes.
That is the shape of the one proven case: `londongpclinic.co.uk` is cited in the
`crp blood test` AI Overview while unranked in its top 99, and the page that earns it is a
**separate page** titled *CRP and ESR Tests*, ranking #10 for `crp vs esr`. A section
inside a general CRP page would not have done it. The repo's pillar architecture is already
hub-and-spoke, so this is the existing model applied to measured demand rather than a new one.

## How 149 children became 35 articles

A mechanical dedupe of the 149 leaves 122 distinct clusters, and **122 is not 122 articles.**
Three filters turn the raw set into a publishable plan:

| filter | count | disposition |
|---|---|---|
| **Spoke article** | **35** (15,050/mo) | ≥50/mo combined after intent-clustering, WINNABLE, informational |
| **FAQ coverage** | 69 | <50/mo long-tail phrasings of a question a sibling already asks. These go INSIDE a spoke or its hub as FAQ entries, never as their own page |
| **Product page** | 12 | price / kit / at-home / tablets intent. Routes to `/kits/*` or `/supplements/*`, which is 4b check 2 |

🔴 **The 69 are the important number.** Shipping each as its own page is how an 18-article
site becomes a 140-thin-page site, on a domain that currently ranks 17 keywords in total.
Intent-clustering merges phrasings: `what is a bad liver function test result`,
`what does it mean if my liver function test is high` and `liver function blood test abnormal`
are one page asking one question three ways.

## Linking rules, mandatory for every spoke

The linking is the point. A spoke that does not pass equity up is just a thin page.

1. **Frontmatter `hub: <hub-slug>`** on every spoke. Related-reading is now hub-aware:
   `app/(marketing)/blog/[slug]/page.tsx` orders candidates hub → siblings → category → rest,
   where it previously used category alone and linked articles together for no reason beyond
   a shared label. A hub automatically gains inbound links from all its spokes, and lists them back.
2. **One in-body contextual link up to the hub**, in the first third of the article, in prose.
   Frontmatter drives the module; body links are what actually carry weight.
3. **The hub gains one link down** to each spoke, at the section the spoke was carved out of.
4. **Stay in the pillar's vocabulary** (`coverage-rules.md` §6). A spoke under Pillar A speaks
   deficiency language even when it touches testosterone; that split is what stops the spokes
   cannibalising each other.

## Before writing any of these

- **Run the guarded promoter, do not hand-promote:**
  `npx tsx scripts/content-engine/promote-keyword.ts --query "<query>" --dry`. It runs 4b
  checks 1 to 4 programmatically and refuses the flip if any trips.
- **Compliance is not inherited.** A spoke can cross the Phase 0 line its hub sat behind.
  The testosterone and supplement spokes below are claim-dense and need Ewa before drafting,
  not after. `how-to-increase-testosterone-to-1000` asserts a target number and is flagged.
- **Ewa signs off every article.** 35 spokes is a production programme, not a sprint.
- **3 children were dropped as duplicates of articles that already exist** (`ferritin blood test uk`,
  `b12 blood test uk`, `what should my free androgen index be`). They are marked ⛔ below. This is
  the 2026-06-22 failure caught before it cost anything, and it is why the collision check runs
  against published slugs rather than against the queue alone.

---

## The plan

### Hub: [`how-to-increase-testosterone-naturally`](../../09_website-app/frontend/content/blog/how-to-increase-testosterone-naturally.mdx)

| spoke (proposed slug) | primary query | vol/mo | KD | also covers |
|---|---|---|---|---|
| `supplements-to-increase-testosterone` | supplements to increase testosterone | 1900 | 14 | - |
| `how-to-increase-testosterone-levels-quickly` | how to increase testosterone levels quickly | 1600 | 13 | - |
| `which-foods-boost-testosterone` | which foods boost testosterone | 300 | 3 | what to eat to increase testosterone (70); what drink boosts testosterone (20) |
| `how-to-increase-testosterone-to-1000` | how to increase testosterone to 1000 | 210 | 32 | - |
| `how-to-increase-testosterone-levels-quickly-by-food` | how to increase testosterone levels quickly by food | 170 | 15 | - |
| `what-supplements-increase-testosterone-the-most` | what supplements increase testosterone the most | 170 | 23 | - |

- **FAQ coverage inside the hub or its spokes (3):** supplements to increase testosterone naturally / how do i raise my testosterone fast / what are signs of low testosterone in males

### Hub: [`liver-function-blood-test`](../../09_website-app/frontend/content/blog/liver-function-blood-test.mdx)

| spoke (proposed slug) | primary query | vol/mo | KD | also covers |
|---|---|---|---|---|
| `liver-function-tests-normal-values` | liver function tests normal values | 1310 | 22 | liver function tests normal values uk (590); what is a normal blood test for liver function (0) |
| `liver-function-blood-test-abnormal` | liver function blood test abnormal | 400 | 21 | what is a red flag liver function (10) |
| `how-to-check-fatty-liver-in-blood-test` | how to check fatty liver in blood test | 390 | ? | - |
| `liver-function-blood-test-results-explained` | liver function blood test results explained | 50 | 18 | - |

- **FAQ coverage inside the hub or its spokes (3):** what is a bad liver function test result / what does it mean if my liver function test is high / fatty liver blood test normal range
- 🔶 **Route to a product page, NOT the blog (1):** liver function blood test price (20/mo)

### Hub: [`brain-fog`](../../09_website-app/frontend/content/blog/brain-fog.mdx)

| spoke (proposed slug) | primary query | vol/mo | KD | also covers |
|---|---|---|---|---|
| `how-do-you-get-rid-of-brain-fog` | how do you get rid of brain fog | 1600 | 20 | - |

- **FAQ coverage inside the hub or its spokes (3):** what is the most common cause of brain fog / when should i worry about brain fog / brain fog causes and treatment

### Hub: [`low-vitamin-d-symptoms`](../../09_website-app/frontend/content/blog/low-vitamin-d-symptoms.mdx)

| spoke (proposed slug) | primary query | vol/mo | KD | also covers |
|---|---|---|---|---|
| `severe-vitamin-d-deficiency-symptoms` | severe vitamin d deficiency symptoms | 1000 | 39 | - |
| `vitamin-d-deficiency-ruined-my-life` | vitamin d deficiency ruined my life | 390 | 12 | - |
| `low-vitamin-d-symptoms-male` | low vitamin d symptoms male | 70 | 34 | - |
| `what-happens-when-your-vitamin-d-is-low` | what happens when your vitamin d is low | 70 | ? | - |

- **FAQ coverage inside the hub or its spokes (3):** how to quickly raise vitamin d levels / what are the common causes of vitamin d deficiency / what are 5 signs of vitamin d deficiency to not ignore

### Hub: [`normal-testosterone-levels-by-age`](../../09_website-app/frontend/content/blog/normal-testosterone-levels-by-age.mdx)

| spoke (proposed slug) | primary query | vol/mo | KD | also covers |
|---|---|---|---|---|
| `normal-testosterone-levels-in-males-ng-ml` | normal testosterone levels in males ng ml | 480 | ? | - |
| `testosterone-levels-by-age-chart-uk` | testosterone levels by age chart uk | 320 | 0 | - |
| `testosterone-levels-by-age-chart-nmol-l` | testosterone levels by age chart nmol l | 170 | 0 | - |
| `normal-testosterone-levels-in-males-nmol-l-by-age` | normal testosterone levels in males nmol l by age | 90 | ? | - |

- **FAQ coverage inside the hub or its spokes (6):** normal testosterone levels in men by age / normal testosterone levels in males ng dl / is 300 testosterone low for a man / how to tell if a man has good testosterone levels / what were the average testosterone levels for adult men in 1940 / what is the average testosterone level for a 70 year old

### Hub: [`signs-of-stress-in-men`](../../09_website-app/frontend/content/blog/signs-of-stress-in-men.mdx)

| spoke (proposed slug) | primary query | vol/mo | KD | also covers |
|---|---|---|---|---|
| `symptoms-of-stress-leaving-the-body` | symptoms of stress leaving the body | 1000 | 54 | - |
| `what-are-5-warning-signs-of-stress` | what are 5 warning signs of stress | 50 | 59 | - |

- **FAQ coverage inside the hub or its spokes (3):** how long does chronic stress typically last / how can i recover from stress / symptoms of stress and anxiety in men

### Hub: [`free-androgen-index`](../../09_website-app/frontend/content/blog/free-androgen-index.mdx)

| spoke (proposed slug) | primary query | vol/mo | KD | also covers |
|---|---|---|---|---|
| `free-androgen-index-calculator` | free androgen index calculator | 720 | 0 | - |
| `free-androgen-index-normal-range` | free androgen index normal range | 140 | 0 | - |
| `free-androgen-index-low` | free androgen index low | 140 | 0 | - |
| `free-androgen-index-men` | free androgen index men | 50 | 0 | - |

- **FAQ coverage inside the hub or its spokes (1):** what is a good free testosterone level by age
- 🔶 **Route to a product page, NOT the blog (1):** free androgen index test price (10/mo)
- ⛔ **DUPLICATE of an article that already exists, do NOT create (1):** what should my free androgen index be (0/mo) = /blog/free-androgen-index

### Hub: [`why-am-i-always-tired`](../../09_website-app/frontend/content/blog/why-am-i-always-tired.mdx)

| spoke (proposed slug) | primary query | vol/mo | KD | also covers |
|---|---|---|---|---|
| `feeling-tired-all-the-time-and-sleeping-a-lot` | feeling tired all the time and sleeping a lot | 720 | 52 | - |
| `why-am-i-always-tired-male` | why am i always tired male | 70 | 18 | - |

- **FAQ coverage inside the hub or its spokes (4):** what are three warning signs of fatigue / what are the red flags of fatigue / why am i always so tired even though i sleep a lot / why am i always tired no matter how much i sleep

### Hub: [`inflammatory-markers-blood-test`](../../09_website-app/frontend/content/blog/inflammatory-markers-blood-test.mdx)

| spoke (proposed slug) | primary query | vol/mo | KD | also covers |
|---|---|---|---|---|
| `what-does-it-mean-when-your-inflammatory-markers-are-elevated` | what does it mean when your inflammatory markers are elevated | 480 | 2 | - |
| `do-inflammation-blood-tests-show-cancer` | do inflammation blood tests show cancer | 70 | 8 | - |

- **FAQ coverage inside the hub or its spokes (6):** what are the inflammation markers in a blood test / what are 5 signs your body has inflammation / what does it mean if my inflammation markers are high in a blood test / inflammatory markers blood test arthritis / inflammatory markers blood test endometriosis / what does it mean when your blood test shows inflammation

### Hub: [`thyroid-test`](../../09_website-app/frontend/content/blog/thyroid-test.mdx)

| spoke (proposed slug) | primary query | vol/mo | KD | also covers |
|---|---|---|---|---|
| `what-are-the-5-thyroid-tests` | what are the 5 thyroid tests | 260 | 26 | - |

- **FAQ coverage inside the hub or its spokes (7):** what are the 20 signs of a thyroid problem / what if a thyroid test is positive / what are early warning signs of thyroid problems / can i ask my gp for a thyroid test / thyroid test results chart / what can affect thyroid test results / thyroid test gp
- 🔶 **Route to a product page, NOT the blog (2):** thyroid test price (0/mo) / best thyroid test at home uk (0/mo)

### Hub: [`how-to-read-blood-test-results`](../../09_website-app/frontend/content/blog/how-to-read-blood-test-results.mdx)

| spoke (proposed slug) | primary query | vol/mo | KD | also covers |
|---|---|---|---|---|
| `enter-blood-test-results-online-free` | enter blood test results online free | 170 | 26 | - |
| `full-blood-test-results-explained` | full blood test results explained | 70 | 8 | - |

- **FAQ coverage inside the hub or its spokes (3):** what is the normal range for blood test results / what are the most important numbers on a blood test / how to read a full blood count test result

### Hub: [`fbc-blood-test`](../../09_website-app/frontend/content/blog/fbc-blood-test.mdx)

| spoke (proposed slug) | primary query | vol/mo | KD | also covers |
|---|---|---|---|---|
| `fbc-blood-test-results` | fbc blood test results | 140 | 6 | fbc blood test results explained (70) |
| `fbc-blood-test-abnormal` | fbc blood test abnormal | 70 | 0 | - |

- **FAQ coverage inside the hub or its spokes (5):** fbc blood test hb / what diseases can be detected by fbc / what cancers can a full blood count detect / fbc blood test need fasting / what will a fbc blood test show
- 🔶 **Route to a product page, NOT the blog (1):** fbc blood test price (30/mo)

### Hub: [`b12-blood-test`](../../09_website-app/frontend/content/blog/b12-blood-test.mdx)

| spoke (proposed slug) | primary query | vol/mo | KD | also covers |
|---|---|---|---|---|
| `vitamin-b12-blood-test-high` | vitamin b12 blood test high | 210 | 0 | - |

- **FAQ coverage inside the hub or its spokes (1):** what do you crave when your b12 is low
- 🔶 **Route to a product page, NOT the blog (4):** b12 test kit tesco (170/mo) / b12 blood test at home (30/mo) / why would a doctor order a b12 test (0/mo) / b12 blood test cost (0/mo)
- ⛔ **DUPLICATE of an article that already exists, do NOT create (1):** b12 blood test uk (0/mo) = /blog/b12-blood-test

### Hub: [`14-signs-of-vitamin-d-deficiency`](../../09_website-app/frontend/content/blog/14-signs-of-vitamin-d-deficiency.mdx)

- **FAQ coverage inside the hub or its spokes (6):** 14 signs of vitamin d deficiency on skin / how long does it take to correct vitamin d deficiency / what drains vitamin d from your body / what drink is high in vitamin d / 14 signs of vitamin d deficiency treatment / 14 signs of vitamin d deficiency in adults
- 🔶 **Route to a product page, NOT the blog (1):** vitamin d tablets (14800/mo)

### Hub: [`crp-blood-test`](../../09_website-app/frontend/content/blog/crp-blood-test.mdx)

- **FAQ coverage inside the hub or its spokes (9):** crp blood test tube color / crp blood test infection / crp blood test 12 / what happens if your crp is high / is a crp of 40 high / crp blood test 30 / what infections can cause high crp / what is crp blood test normal range / crp blood test cancer
- 🔶 **Route to a product page, NOT the blog (1):** crp blood test price (110/mo)

### Hub: [`ferritin-blood-test`](../../09_website-app/frontend/content/blog/ferritin-blood-test.mdx)

- **FAQ coverage inside the hub or its spokes (2):** what disease causes low ferritin / is ferritin a tumor marker
- 🔶 **Route to a product page, NOT the blog (1):** ferritin blood test price (20/mo)
- ⛔ **DUPLICATE of an article that already exists, do NOT create (1):** ferritin blood test uk (110/mo) = /blog/ferritin-blood-test
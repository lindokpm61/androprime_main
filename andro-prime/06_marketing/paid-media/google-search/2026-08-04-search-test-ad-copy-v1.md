# Google Search validation test — campaign structure + ad copy (v1)

**Created:** 2026-08-04 | **Owner:** Keith | **Status:** ⛔ DRAFT. Not launched. Pre-flight run (below); the four flagged strings need Keith/Ewa sight before this goes live.
**Plan authority:** `../../master-plan/2026-06-26-tier2-sales-creation-plan.md` Play 4 (£250 locked).
**Copy authority:** `../../../02_brand/2026-07-22-conflict-free-wording-pack.md` (CA-026, approved set §P + A1 + B1 + C1 + C2 + D1 + D2 + D+ + E2).
**Gate:** Gate 0B stage 1, `../../../01_strategy/CONTEXT.md` → Gates Reference.

> ⛔ This supersedes nothing. `../paid-measurement-context.md` remains SUPERSEDED (it specifies a £2,000/mo Google budget and a campaign-per-kit structure that the 2026-06-26 constraint reset retired). Its **ad-copy rules and negative-keyword list** are the only parts carried forward here.

---

## 1. How many ads: **two.**

One campaign, two ad groups, **one responsive search ad in each. Two ads total.**

### Why two and not more

The budget is £250 (locked), and at UK CPCs that buys roughly **45 to 55 clicks in total.** Live Google Ads data pulled 2026-08-04 for the United Kingdom:

| Keyword | Monthly volume | CPC | Top-of-page bid range |
|---|---|---|---|
| `at home blood test` / `blood test at home` | 1,600 | £5.56 | £1.65 to £6.46 |
| `home blood test kit` | 1,000 | £4.27 | £1.11 to £3.61 |
| `at home blood test uk` | 390 | £4.79 | £1.42 to £4.58 |
| `mens health blood test` | 210 | **£11.74** | £2.46 to £16.88 |
| `wellman blood test` | 110 | £5.18 | £1.92 to £9.83 |
| `ferritin blood test` | 8,100 | £3.03 | £0.67 to £2.41 |
| `vitamin d test` | 2,400 | £1.71 | £0.84 to £2.50 |

**Every keyword containing "testosterone" or "hormone" returned no data at all** (`testosterone test`, `testosterone test uk`, `home testosterone test`, `testosterone test kit`, `testosterone blood test`, `low testosterone test`, `check testosterone levels`, `male hormone test`, `hormone blood test`). That is Google suppressing a sensitive health category, not a gap in the tool. Two consequences: you cannot forecast the testosterone group before launch, and you should expect ad-review friction on it (see §6).

The arithmetic that sets the number:

- £250 ÷ ~£4.75 blended = **~53 clicks**
- Split across 2 ad groups = **~26 clicks each**
- Split across 4 ad groups = ~13 clicks each, which is indistinguishable from noise

A second RSA inside the same ad group would halve an already-tiny impression pool and neither would ever reach a readable result. You do not need one: **an RSA is already the test.** Google permutes your 15 headlines and 4 descriptions across thousands of combinations and reports asset-level performance, so you get creative learning without splitting spend. Google's own guidance is one RSA per ad group.

**If you release the full £500:** add a third ad group with its own single RSA. Three ads. Still never a second RSA in the same group.

### Say the quiet part now, before you spend

This test will almost certainly **not clear Gate 0B**, and that is not failure. At a £5.56 CPC, Kit 3 (£77 contribution) needs a 7.2% click-to-sale rate to break even and Kit 1 (£38) needs 14.7%. Real rates on cold search traffic run 1% to 3%. The 2026-07-21 model already says cold paid never pays back. **Play 4's job is to prove strangers buy, seed a retargeting pixel, and give a clean read on the live funnel.** Judge it on that, not on profit.

---

## 2. Campaign structure

**One campaign:** `AP | Search | Validation Test | UK`

| Setting | Value | Why |
|---|---|---|
| Network | Search only. **Search Partners OFF, Display Network OFF** | Display would eat the £250 in junk impressions |
| Location | United Kingdom, **"Presence: people in your target locations"** | The default includes people merely *interested in* the UK |
| Language | English |  |
| Bidding | **Manual CPC** (or Maximise Clicks with a hard bid cap) | Never Maximise Conversions. You have zero conversion history; it will spend the whole budget learning nothing |
| Bid cap | £3.00 | Bids the middle of the low-top-of-page range on the generic cluster, and caps your blind exposure on the testosterone group |
| Daily budget | £8/day for ~30 days | Slower is better here. You want the test to survive long enough to read |
| Ad rotation | **Optimise: prefer best-performing ads** |  |
| Ad schedule | All week |  |
| Match types | **Phrase + Exact only. No broad.** | Broad match at this budget is a donation |

### Ad group 1 — Testosterone

- **Destination:** `/lp/testosterone` (Kit 1, £99)
- **Keywords (phrase + exact):** `testosterone test`, `testosterone test uk`, `at home testosterone test`, `testosterone test kit`, `testosterone blood test`, `check testosterone levels`, `home testosterone test uk`
- **Why:** highest intent and the only group where the conflict-free position is the sharpest thing on the page. CPC unknown, so the £3 cap does the work.

### Ad group 2 — Men's at-home blood test

- **Destination:** `/lp/hormone-recovery` (Kit 3, £179)
- **Keywords (phrase + exact):** `mens health blood test`, `men's blood test`, `male health blood test`, `at home blood test uk`, `home blood test kit`, `private blood test uk`
- **Why Kit 3 and not Kit 1 here:** these are the £4.79 to £11.74 clicks. Expensive traffic has to land on the highest-contribution SKU (£77) or it cannot clear any bar at all. Pointing a £5.56 click at a £99 kit with £38 of contribution is arithmetically hopeless.
- **Known tension (flagged in Play 4):** these are commodity, NHS-shadowed, price-compressed terms and the £45 to £49 category anchor is brutal against £179. The landing page has to reframe from "a blood test" to the outcome. Watch this group's CPA hardest; it is the likeliest one to kill early.

---

## 3. Ad 1 — Ad group: Testosterone → `/lp/testosterone`

**Display paths:** `/Testosterone` · `/At-Home-Kit`

### Headlines (15, 30-char limit)

| # | Headline | Chars | Pin |
|---|---|---|---|
| 1 | At-Home Testosterone Test | 25 | **Position 1** |
| 2 | Testosterone Check, £99 | 23 | |
| 3 | Check Your Testosterone | 23 | |
| 4 | Results In 2 To 5 Days | 22 | |
| 5 | Five Minutes At Home | 20 | |
| 6 | UKAS ISO 15189 Lab | 18 | |
| 7 | One Price. Nothing Hidden. | 26 | |
| 8 | No GP Appointment Needed | 24 | |
| 9 | Total And Free Testosterone | 27 | |
| 10 | A Low Result Goes To A GP | 25 | ⚠️ see §5 |
| 11 | Nothing To Upsell You | 21 | ⚠️ see §5 |
| 12 | Free UK Delivery | 16 | ⚠️ verify |
| 13 | Plain-English Results | 21 | |
| 14 | Finger-Prick Kit, Posted | 24 | |
| 15 | Know Where You Stand | 20 | |

Pin only headline 1. Pinning more starves the permutation engine, which is the only test you are actually running.

### Descriptions (4, 90-char limit)

| # | Description | Chars |
|---|---|---|
| 1 | Five minutes at home. Your sample is analysed by a UKAS ISO 15189-accredited UK lab. | 84 |
| 2 | One price, nothing hidden. A result that needs a doctor goes to a GP and earns us nothing. | 90 |
| 3 | Testosterone, SHBG and free androgen index. Plain-English results in 2 to 5 working days. | 89 |
| 4 | No appointment, no waiting room. Order today, post your sample, see your numbers online. | 88 |

---

## 4. Ad 2 — Ad group: Men's at-home blood test → `/lp/hormone-recovery`

**Display paths:** `/Mens-Blood-Test` · `/9-Markers`

### Headlines (15, 30-char limit)

| # | Headline | Chars | Pin |
|---|---|---|---|
| 1 | Men's At-Home Blood Test | 24 | **Position 1** |
| 2 | 9 Markers, One Finger-Prick | 27 | |
| 3 | Men's Blood Test, £179 | 22 | |
| 4 | Results In 2 To 5 Days | 22 | |
| 5 | Hormones, Energy, Recovery | 26 | |
| 6 | UKAS ISO 15189 Lab | 18 | |
| 7 | One Price. Nothing Hidden. | 26 | |
| 8 | No GP Appointment Needed | 24 | |
| 9 | Five Minutes At Home | 20 | |
| 10 | Nothing To Upsell You | 21 | ⚠️ see §5 |
| 11 | A Low Result Goes To A GP | 25 | ⚠️ see §5 |
| 12 | Plain-English Results | 21 | |
| 13 | Testosterone Included | 21 | |
| 14 | Not Sure? Take The Quiz | 23 | |
| 15 | Know Your Numbers | 17 | |

### Descriptions (4, 90-char limit)

| # | Description | Chars |
|---|---|---|
| 1 | Nine markers in one at-home finger-prick test. Hormones, energy, recovery, inflammation. | 88 |
| 2 | One price, nothing hidden. A result that needs a doctor goes to a GP and earns us nothing. | 90 |
| 3 | Analysed by a UKAS ISO 15189-accredited UK lab. Results in 2 to 5 working days. | 79 |
| 4 | Not sure which test you need? The two-minute selector points you to the right one. | 82 |

**Do not use "Health MOT" anywhere in this ad group.** Kit 3 spec, §1: it overpromises panel breadth against a 15+ marker competitor at half the price and produces post-purchase disappointment.

---

## 5. Shared assets

### Callouts (25-char limit) — apply at campaign level

`UKAS ISO 15189 Lab` (18) · `Results In 2 To 5 Days` (22) · `No GP Appointment Needed` (24) · `One Price, Nothing Hidden` (25) · `Five Minutes At Home` (20) · `Your Data Is Never Sold` (23)

### Sitelinks (25-char title, 35-char descriptions)

| Title | URL | Line 1 | Line 2 |
|---|---|---|---|
| How It Works | `/how-it-works` | Order, prick, post, results. | No appointment. No clinic visit. |
| Compare The Kits | `/kits` | Three panels. One price each. | See exactly what each one tests. |
| Take The Test Selector | `/test-selector` | Not sure which panel you need? | Two minutes to the right test. |
| What A Low Result Means | `/how-it-works` | It goes to a GP, not a basket. | That result earns us nothing. |

### Structured snippet

Header **Types**: `Testosterone` · `Energy & Recovery` · `Hormone & Recovery`

### Negative keywords (apply before the first impression)

Carried from `../paid-measurement-context.md` and extended:

```
free, nhs, symptoms of, what is, how to, reddit, forum, diagnosis, diagnose,
women, female, menopause, children, dog, cat, animal, job, jobs, salary,
phlebotomy, course, training, near me, boots, superdrug
```

**Added, and these are the ones that matter most:**

```
trt, testosterone replacement, testosterone therapy, buy testosterone,
testosterone booster, testosterone gel, testosterone injection, steroids,
anabolic, clinic
```

You cannot sell TRT in Phase 0. Every click from a TRT-intent search is money spent on a visitor you are contractually obliged to dead-end. At ~53 total clicks you cannot afford one of them.

**Competitor brand terms are OUT of this test.** Bidding on a rival's name is comparative advertising and sits under **CA-030**, which is still awaiting Ewa. Add them only after that pack is signed.

---

## 6. Pre-flight findings — four items need sight before launch

Deterministic scanner run against this file: see §7. The judgement pass surfaces four items. None is a hard fail; all four are decisions, not defects.

| # | Item | Where | Issue | Who rules |
|---|---|---|---|---|
| F1 | `Nothing To Upsell You` | Ad 1 H11, Ad 2 H10 | Derived from **B2** in the CA-026 pack, which was **not in Keith's approved set** (approved: §P + A1 + B1 + C1 + C2 + D1 + D2 + D+ + E2). B2 was kept as an unused alternate. Using it in paid copy activates unapproved wording. | Keith + Ewa: approve the compression, or cut both headlines |
| F2 | `A Low Result Goes To A GP` | Ad 1 H10, Ad 2 H11 | A 25-character compression of the approved D+ Kit 1 line ("If your results indicate low testosterone, your next step is a conversation with a GP. That result earns us nothing."). It is not a definitive statement about the reader, so it clears the red-flag table. But CA-026 approved *strings*, not paraphrases, and this one drops "earns us nothing", which is the substantiating half. | Ewa: confirm the compression still carries the principle |
| F3 | `Free UK Delivery` | Ad 1 H12, callouts | Carried over from the superseded paid doc. **Not verified against the current Stripe/checkout configuration.** An unverifiable delivery claim in an ad is an ASA problem and a Google policy problem. | Keith: confirm against live checkout, or cut |
| F4 | Google restricted-category risk | Ad group 1 entire | Google returns no keyword data for any testosterone or hormone term, which indicates a sensitive health category. Ads may be disapproved, or served with limits. Separately, Google's healthcare policy can require advertiser certification in some health verticals. | Keith: submit ad group 1 first and read the disapproval, before building out |

**Also required before launch, and not optional:** run `/compliance-preflight` on the two landing pages themselves. Google reviews the destination, not just the ad, and `/lp/daily-stack` was carrying non-compliant strings as recently as 2026-08-02 (`09_website-app/STATE.md`). `/lp/testosterone` and `/lp/hormone-recovery` have not been re-checked since that sweep.

**Verified clean, across every headline, description, callout and sitelink in §3 to §5:** zero hits on the `03_compliance/CONTEXT.md` red-flag table (medical-act verbs, unsubstantiated-proof language, false-availability claims); no definitive low-testosterone statement about the reader; no silent-ingredient mention; no per-customer clinical-review implication; no absolute never-sell claim; no competitor named; no claim about what rivals do with customers' data; no em dashes; the substantiated "UKAS ISO 15189-accredited" form used throughout; speed leads and money honesty follows, per the 2026-07-21 mainstream research and CA-026 rail 2.

### Scanner note — read this before re-escalating

`scan.js` reports findings on this file. **Every one of them sits inside the §5 negative-keyword block, and not one is in shippable copy.** The two blocks that trip it are the medical-act exclusions and the therapy-intent exclusions: in both cases the flagged words are terms being **excluded from the campaign**, so the list is the compliance control, not a claim.

The scanner is a literal string matcher with no concept of a prohibition list, so a document that correctly names what it forbids flags itself forever. **Do not "fix" this by deleting the negative keywords.** That would strip the actual control and let therapy-intent clicks through, which is the opposite of the intended outcome. Same class of artifact as the stale `{/* TODO Ewa */}` markers logged in `../../STATE.md` on 2026-07-31, where a self-asserting marker triggered a false escalation to a clinician who had already answered.

**The check that matters:** run the scanner against §3, §4 and §5's ad assets in isolation (headlines, descriptions, callouts, sitelinks, structured snippet) and it returns clean. That is the copy that reaches a customer.

---

## 7. Reading the result

Read at week 4 and again at week 6 against **Gate 0B stage 1** (`01_strategy/CONTEXT.md`):

- **Ad group 1 (Kit 1):** CPA must be under **£38** direct, or **£48** on the two-kit bundle.
- **Ad group 2 (Kit 3):** CPA must be under **£77** direct, or **£92** on the bundle.

At ~26 clicks per group, expect 0 to 1 sales each. **That is not enough to clear or fail a gate.** Soft signals (CTR, quiz starts, initiate-checkout, email captures) are explicit tie-breakers at low n, never substitutes. So the honest reads available from £250 are:

1. Do strangers buy at all, without a referrer.
2. What does a click actually cost on the testosterone group, where Google will not tell you in advance.
3. Does the funnel convert end to end on cold traffic.
4. A seeded retargeting pixel that compounds with the short-form viewer audience (Play 1).

Kill criteria, so the decision is made deliberately rather than drifted into: if either ad group spends £100 with **zero initiate-checkout events**, pause that group and move its remaining budget to the other. That is a same-week call, per the Gate 0B failure-response rule.

---

## 8. Before you press go

- [ ] F1 to F4 above ruled by Keith / Ewa
- [ ] `/compliance-preflight` run on `/lp/testosterone` and `/lp/hormone-recovery`
- [ ] GA4 + first-party events verified end to end (visitor → quiz → purchase). Play 4 is worthless if you cannot read it
- [ ] Google Ads conversion action created and linked, importing `purchase` from GA4
- [ ] UTMs on both final URLs: `utm_source=google&utm_medium=cpc&utm_campaign=kit1|kit3`
- [ ] Search Partners and Display confirmed OFF
- [ ] Negative keyword list applied at campaign level **before** the first impression
- [ ] Daily budget set to £8, not the default Google suggests

# Tier 2 GEO outreach: routes verified first, and three of the five do not survive it

**Date:** 2026-08-15
**Owner:** Keith Antony
**Status:** ✅ **APPROVED as CA-037 (Keith Lindo, 2026-08-15) and BOTH MESSAGES SENT.** ClickUp
[`869ejbmb9`](https://app.clickup.com/t/869ejbmb9); record
`03_compliance/content-approval/approval-record-geo-tier2-outreach-2026-08-15.md`.
offshift emailed to `hello@offshift.co.uk` (Gmail `1a006313472abdee`, no bounce);
bloodtests.head-to-head.uk submitted via its "Suggest a Provider" form, worker returned
`{"status":"ok","emailError":null}`. **welzo, allhealthstore and bloodtestcompare dropped, confirmed
in the same ruling.** The "drafted, not approved" wording below is superseded; the copy is unchanged
from what was sent.
**Workspace:** `06_marketing/seo-ai-search`
**Source list:** the Tier 2 table in [`geo-third-party-presence-outreach.md`](./geo-third-party-presence-outreach.md)

---

## Why route-first, and what it caught

Tier 1 lost two of five targets to route failures that were only discovered at send time: lolahealth
was a competitor with no list to join, and maleoptimal turned out to have **three** dead addresses
including the one behind its own contact form. So Tier 2 was verified before a word of copy was
written.

**Three of the five do not survive verification, and it is the same failure twice: a vendor recorded
as a hub.** The July list was built from what engines cited, and *being cited* does not distinguish
"runs a list you can join" from "sells the thing and gets cited for it". That distinction is the one
this pass adds.

| # | Site | Route verdict | Send? |
|---|------|---------------|-------|
| 6 | **welzo.com** | Route is real (`hello@welzo.com`, `/pages/contact` 200) but **there is no list to join.** Its "Best Home Blood Tests in the UK, Ranked by a Doctor" page ranks **13 welzo products** and names no competitor anywhere on the page. welzo sells its own tests and is itself listed as a provider on bloodtestcompare. **Direct competitor.** | ❌ **drop** |
| 7 | **offshift.co.uk** | ✅ `hello@offshift.co.uk`, in **rendered visible text** on `/contact`, no form. Real comparison content: `/blog/cheapest-private-blood-tests-uk` (a genuine multi-provider price comparison naming Medichecks, Thriva, Forth, LetsGetChecked) and `/blog/medichecks-vs-thriva-vs-forth-review`. **Cited 4x on commercial prompts across both engines** in today's baseline. | ✅ **SEND** |
| 8 | **allhealthstore.com** | Runs a real 7-provider round-up, but it is **welzo-owned**: its JSON-LD contact email is `hello@welzo.com`, it publishes `/blogs/news/welzo-reviews`, and its round-up ranks **Welzo #1, "Best Overall"**. Not independent of #6, and the list is a competitor's promotional asset. | ❌ **drop as a separate target** |
| 9 | **bloodtestcompare.co.uk** | Genuine independent hub (76 tests, 11 providers, 73 biomarkers, biomarker-level filtering) and **no contact route of any kind**: `/contact`, `/about`, `/providers`, `/add-provider` all 404, no form, no `mailto:`, no JSON-LD, and the only links in the document are `#compare` and `#providers`. Affiliate-funded ("we may earn affiliate commissions from providers listed on this site"), so the real way in is an affiliate programme, not editorial outreach. Data "last verified March 2026". | ⛔ **blocked, no route** |
| 10 | **standard.co.uk** (ES Best) | Target page found: `/shopping/esbest/health-fitness/best-home-blood-test-uk-b1171782.html`, and it is **stale**, titled "…2024", listing Medichecks, Thriva, Lloyds Pharmacy, Randox, Forth, Manual, Vitall. **There is no ES Best or shopping desk on their contact page** (News, Features, Audience, Sport, Homes & Property, Commercial only). Nearest routes, decoded from their Cloudflare email obfuscation: `features@standard.co.uk`, and `dan.locke@independent.media`, Chief Commercial Content Officer, ES Best being affiliate content. | ⚠️ **low priority PR** |

## The replacement, and it came from measurement rather than a guess

The July Tier 2 list predates any measurement. Today's baseline gives the **measured** set of domains
AI engines actually cite on our six buyer queries, so the replacement was picked from that instead.

- ✅ **`bloodtests.head-to-head.uk` is the best route found in this entire workstream, Tier 1
  included.** Its `/contact` form carries a Subject dropdown whose options include **"Suggest a
  Provider"** and **"Featured Provider Request"**, and the page copy asks directly: *"Have a
  suggestion, found incorrect pricing, or want to get featured on our site?"* That is an **invited**
  listing route, not a route we inferred. It compares Medichecks, Thriva, BetterYou, Randox, Bluecrest
  Wellness, Forth and Numan. The form posts to a Cloudflare Worker and carries **no honeypot and no
  captcha**, so unlike maleoptimal there is no anti-automation control to defeat. Cited once, on
  `best private blood test UK` (Perplexity).
- 🔵 **`truevitals.co.uk` is the most-cited uncontacted domain in the baseline (4x, across four
  prompts and two engines) and must NOT be pitched.** It is a vendor: *"Private Blood Tests UK | 74 to
  200+ Biomarkers | TrueVitals"*. Recorded here so the citation count does not pull it onto a future
  target list, which is exactly how welzo and lolahealth got onto this one.
- 🔵 `privatecarecompare.com` has a working `/contact` and `support@privatecarecompare.com`, but it is
  a general private-healthcare price comparison and blood tests are not clearly its category. Not
  assessed further.

## A correction to my own working, kept because the method was wrong

**offshift was nearly dropped on a false negative.** A `site:offshift.co.uk blood test` probe returned
**zero** results, and a positive control on the bare `site:offshift.co.uk` returned 463, so the zero
looked verified rather than blind. It was still wrong: `site:offshift.co.uk private blood test`
returns nine pages including the two comparison articles above. **The positive control proved the
domain was indexed, which is not the claim the zero was being used to support.** A control has to
exercise the same path as the measurement, phrase included, or it licenses exactly the confidence it
was supposed to check. The site was saved by reading `/reviews` directly rather than by the probe.

## The copy, as approved under CA-037 and as sent

Both inherit the two corrections carried by the CA-036 template: **no free-kit offer**, and the
differentiator leads on the **conflict-free** position per CA-026, not data ownership. Prices, markers
and turnaround are lifted from the live approved surfaces. No em dashes, straight apostrophes.

✅ **`compliance-preflight` on the extracted copy: 0 HARD / 0 REVIEW**, cleaner than CA-036 because
neither message uses the `TRT` token. **Approved as CA-037 (Keith Lindo, 2026-08-15) and sent
unchanged.** The text below is exactly what went out.

### 7. offshift.co.uk

**Route:** `hello@offshift.co.uk`
**Target page:** *Cheapest Private Blood Tests in the UK: Full Price Comparison*
(`/blog/cheapest-private-blood-tests-uk`)
**Angle:** their page is organised by price and by *who you are* ("If You Work Shifts or Irregular
Hours", "If You Exercise Regularly"), so this leads on price transparency and on the shift-worker
segment they already write for, rather than on markers.

**Subject:** Cheapest Private Blood Tests UK: one more provider for the price comparison

Hi,

I run Andro Prime, a UK at-home blood testing service built specifically for men. I read your Cheapest Private Blood Tests in the UK comparison and think we would fit the price table.

Three kits, and the price is the whole price: £99 for the Testosterone Health Check (Total Testosterone, SHBG, Albumin, calculated Free Testosterone, Free Androgen Index), £119 for the Energy and Recovery Check (Vitamin D, Active B12, hs-CRP, Ferritin), £179 for the combined 9-marker kit. That covers the kit, the lab work and the return postage. No charge to see your own results, and no subscription unless you choose one.

Two things that matter for the "how to get the absolute lowest price" section of your page. There is no add-on tier, so the headline price is not a starting price. And there is no upsell behind the result: we sell the test and nothing else. Any result that needs a doctor, low testosterone included, goes to your own GP and earns us nothing. Most men's health brands that test testosterone also sell what you take afterwards.

You have a section for people working shifts and irregular hours. That is close to who we built this for: the Energy and Recovery kit exists because tiredness, poor recovery and low mood get put down to lifestyle for years before anyone measures Vitamin D, B12, ferritin or inflammation.

Results come back in plain English within 2 to 5 working days of the lab receiving your sample, with recommendation logic approved by a GMC-registered GP.

Would you consider adding us? Everything is on the site, and I am not asking you to take my word for any of it. Each kit page lists every marker, the price and what the report tells you. Happy to answer anything the site does not cover.

Have a look and tell me what you think: https://andro-prime.com

Thanks,
Keith
Founder, Andro Prime
keith@andro-prime.com

### New. bloodtests.head-to-head.uk

**Route:** `/contact` form, Subject = **"Suggest a Provider"**
**Angle:** the form is a structured provider-suggestion channel, so this is short and factual rather
than a pitch. Their site is organised by category and biomarker count, so it gives them exactly the
fields their comparison uses.

**Name:** Keith Lindo
**Email:** keith@andro-prime.com
**Subject:** Suggest a Provider

Hi,

Suggesting Andro Prime for your provider comparison. We are a UK at-home blood testing service built specifically for men, so we fit your Hormones and Sports and Fitness categories rather than General Health.

Three kits:

- Testosterone Health Check, £99. 5 markers: Total Testosterone, SHBG, Albumin, calculated Free Testosterone, Free Androgen Index.
- Energy and Recovery Check, £119. 4 markers: Vitamin D, Active B12, hs-CRP, Ferritin.
- Hormone and Recovery Check, £179. 9 markers, the two above combined.

Details for the comparison table: finger-prick collection, samples analysed by a UKAS ISO 15189-accredited UK lab, results in 2 to 5 working days from the lab receiving the sample, delivered to your own dashboard in plain English with recommendation logic approved by a GMC-registered GP. One price covers the kit, the lab work and the return postage. No subscription required.

One thing worth noting for readers comparing us against the providers you already list: we sell the test and nothing else. Any result that needs a doctor, low testosterone included, goes to the person's own GP and earns us nothing.

Everything above is on the kit pages at https://andro-prime.com if you want to verify it. Happy to answer anything.

Thanks,
Keith Lindo
Founder, Andro Prime

---

## What is owed now

1. ~~`compliance-preflight` and a CA number~~ ✅ done: **CA-037, 0 HARD / 0 REVIEW, approved and sent
   2026-08-15.**
2. ~~Keith's call on the three drops~~ ✅ **welzo, allhealthstore and bloodtestcompare dropped**,
   confirmed in the same ruling.
3. ~~Update the Tier 2 table~~ ✅ done, including striking the stale "suggested replacement: welzo.com"
   line in the Tier 1 section, which repeated the very error this pass exists to catch.
4. 🔜 **Still open: the ES Best PR pitch.** Whether it is worth a slot at all, given the target page
   has not been updated since 2024 and no shopping desk exists on their contact page. Not decided.
5. 🔜 **Watch for replies.** offshift by email, head-to-head via its form (48-hour promise). Neither
   has a chase date yet; Tier 1's is 2026-08-29.
4. ⚠️ **A listing is still not a citation.** Re-run the `track` sweep after any listing goes live,
   which is the one event worth breaking the monthly cadence for.

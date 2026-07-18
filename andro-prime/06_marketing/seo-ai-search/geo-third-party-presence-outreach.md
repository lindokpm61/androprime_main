# GEO Third-Party Presence: Outreach Targets & Tracker

**Created:** 2026-07-13 | **Owner:** Keith Antony | **Workstream:** AI-SEO / GEO (third-party presence, Pillar 3 of the ai-seo playbook)

## Why this exists

LLMs cite where you appear, not just your own domain. Our GEO citation baseline is **0** (0/48 across 4 engines on 2026-06-21; re-checked 0/2 on 2026-07-13). A live DataForSEO pull on 2026-07-13 of what ChatGPT and Perplexity actually cite for our buyer queries ("best at-home blood test for men UK", "best private blood test UK", "best testosterone test UK", "cheapest private blood test UK", "best finger prick blood test UK", "best home blood test kit UK 2026") showed the citations go overwhelmingly to **comparison / review hubs and Reddit**, not to testing brands' own sites.

**Conclusion:** getting listed on the hubs below is the fastest route to being cited by AI for high-intent queries. Higher leverage right now than another on-domain article. This is outreach work, not content work.

Method + raw findings: `geo-serp-findings-2026-06-21.md` (baseline) + the 2026-07-13 DataForSEO `responses` pull (repo tool `tools/dataforseo.mjs`).

## Target list (ranked by how often AI cited them + fit for at-home men's testing)

Status key: `not started` / `contacted DATE` / `replied` / `listed` / `declined`

### Tier 1: do first

| # | Site | Why it matters | Target page to be on | Contact route | Status |
|---|------|----------------|----------------------|---------------|--------|
| 1 | **treatcompare.com** | Most-cited hub on ChatGPT, across nearly every query. Dedicated UK blood-test comparison. | "best home blood test kits UK" | Form at treatcompare.com/contact → "Provider updates" or "General enquiries". Vets providers vs CQC/GPhC registers before listing. | not started |
| 2 | **maleoptimal.co.uk** | Men-focused (exact ICP). Cited repeatedly. Runs review/compare pages of Medichecks etc. | "compare home blood testing services UK 2026" | maleoptimal.co.uk/contact (blocks automated fetch; contact directly) | not started |
| 3 | **helvy.co.uk** | Only hub cited by BOTH ChatGPT and Perplexity. | "best home blood test UK" | Email <hello@helvy.co.uk> | not started |
| 4 | **bloodtestguide.co.uk** | Cited several times; runs head-to-head compare pages. Publicly invites corrections + has a partner page (easiest in). | compare pages + "best" lists | "Partner with us" bloodtestguide.co.uk/partners/, or corrections route (flag we're a UK provider they've missed) | not started |
| 5 | **lolahealth.com** | Cited repeatedly by Perplexity; "best blood test kits UK 2026" guides. | "best blood test kits UK 2026" | Contact page in footer (Shopify store) | not started |

### Tier 2: after Tier 1

| # | Site | Why it matters | Contact route | Status |
|---|------|----------------|---------------|--------|
| 6 | **welzo.com** | Runs a "best home blood tests, ranked by a doctor" list (Perplexity). | Site contact / PR | not started |
| 7 | **offshift.co.uk** | Cited by both engines on the "cheapest" angle. | Site contact | not started |
| 8 | **allhealthstore.com** | "best at-home health tests UK 2026" round-up. | Site contact | not started |
| 9 | **bloodtestcompare.co.uk** | Dedicated compare site. | Site contact | not started |
| 10 | **standard.co.uk** (ES Best) | High authority "best home blood test UK" shopping guide. Harder: a press/PR pitch, not a listing. | ES Best editorial / PR desk | not started |

### Not outreach: presence

- **Reddit**: r/UKTRT and r/HENRYUKLifestyle both cited by ChatGPT. Genuine participation in threads, never pitch/link unprompted (see Reddit rules in `seo-content-context.md` + `02_brand` channel rules). Status: ongoing.

## The outreach email (template)

Fill every `[bracket]` before sending. Leave price and kit names blank until confirmed. No em dashes. Straight apostrophes.

**Subject:** UK men's at-home blood tests: worth adding to your [their list name]?

Hi [name],

I run Andro Prime, a UK at-home blood testing service built specifically for men. I came across your [page name] and think we'd earn a spot on it. Quick version:

- Men-focused, not a general test menu. We cover [testosterone, inflammation, energy markers, e.g. Kit 1 / Kit 2].
- Samples are processed by a UKAS-accredited UK lab (ISO 15189, the same standard NHS labs work to).
- Results come back in plain English within [2 to 5] working days: your numbers, what they mean, and what to do next. The guidance runs on recommendation logic signed off by a GMC-registered GP.
- What makes us different: the data is yours to keep, in your own dashboard, so you can retest later and compare your results instead of getting a one-off PDF.

Prices start at [£99] for [Testosterone Health Check].

Would you consider including us on [page]? Happy to make it easy:

- I can send you a free kit to try and review yourselves.
- I'll give you whatever product detail, pricing, or lab info you need.

You can see everything here: <https://andro-prime.com>

Thanks,
Keith
Founder, Andro Prime
keith@andro-prime.com

### Variant: bloodtestguide.co.uk (corrections angle, not a cold pitch)

Replace the opening line with:

> I noticed your [compare page] doesn't include Andro Prime, a UK at-home men's testing service. Wanted to flag us for inclusion.

Keep the rest of the body the same.

## Compliance

This is external-facing copy. The template applies the rails from `03_compliance/CONTEXT.md`: no diagnose/treat/cure, no clinical or TRT service implied as live, GP described as signing off the *system* (recommendation logic) not individual results, UKAS/ISO trust wording in the approved form, retest framing not a live-tracker claim, no em dashes. Sign-off stays with Keith (Ewa if any clinical claim creeps in).

**Pre-flight status (2026-07-13):** `compliance-preflight` run on the filled email. No HARD fail in the sent copy (the scanner's only HARD hit was a false positive on the negated phrase in this note). Price/kit (£99 / Testosterone Health Check) confirmed against `04_products`. Two flags actioned into a safe-to-send version: the "levels change over time" line softened to retest framing (avoids implying the M3–M4 tracker is live), and the affiliate/commission line removed (the affiliate programme is FROZEN, see `affiliates/CONTEXT.md`). Still needs a logged sign-off in `03_compliance/content-approval/` before it counts as approved.

**Optional add-back (only after the affiliate channel is unfrozen by a Keith decision + v2.3-compliant brief):** the bullet `- If you work on commission, we can set up an affiliate arrangement.` can go back under the "Happy to make it easy" list.

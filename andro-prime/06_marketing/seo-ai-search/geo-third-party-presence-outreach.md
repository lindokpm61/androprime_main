# GEO Third-Party Presence: Outreach Targets & Tracker

**Created:** 2026-07-13 | **Owner:** Keith Antony | **Workstream:** AI-SEO / GEO (third-party presence, Pillar 3 of the ai-seo playbook)

## Why this exists

LLMs cite where you appear, not just your own domain. Our GEO citation baseline is **0** (0/48 across 4 engines on 2026-06-21; re-checked 0/2 on 2026-07-13). A live DataForSEO pull on 2026-07-13 of what ChatGPT and Perplexity actually cite for our buyer queries ("best at-home blood test for men UK", "best private blood test UK", "best testosterone test UK", "cheapest private blood test UK", "best finger prick blood test UK", "best home blood test kit UK 2026") showed the citations go overwhelmingly to **comparison / review hubs and Reddit**, not to testing brands' own sites.

**Conclusion:** getting listed on the hubs below is the fastest route to being cited by AI for high-intent queries. Higher leverage right now than another on-domain article. This is outreach work, not content work.

Method + raw findings: `geo-serp-findings-2026-06-21.md` (baseline) + the 2026-07-13 DataForSEO `responses` pull (repo tool `tools/dataforseo.mjs`).

## Target list (ranked by how often AI cited them + fit for at-home men's testing)

Status key: `not started` / `contacted DATE` / `replied` / `listed` / `declined`

### Tier 1: do first

> ✅ **APPROVED 2026-08-15 as CA-036 (Keith Lindo).** ClickUp [`869ejaxwx`](https://app.clickup.com/t/869ejaxwx),
> record `03_compliance/content-approval/approval-record-geo-tier1-outreach-2026-08-15.md`.
> **The four emails are cleared to send**, filled from confirmed product data and each written
> against its target's real page: [`2026-08-15-tier1-outreach-filled.md`](./2026-08-15-tier1-outreach-filled.md)
> (`compliance-preflight` 0 HARD / 2 REVIEW, both TRT-inside-a-denial, cleared under the approval).
> **Tier 1 is now four sites, not five**, and the target pages below are verified titles replacing
> the guessed ones. **The free-kit offer was removed before signing** (Keith: the kits are
> essentially the same as competitors', and treatcompare states "No provider pays to be listed").
> 📨 **ALL FOUR SENT 2026-08-15.** This is the first outreach ever sent on this workstream, five
> weeks after the target list was written and while the citation baseline still reads 0.
>
> **Chase date: 2026-08-29.** One follow-up per silent target, then mark `declined` and move to
> Tier 2 rather than chasing a third time. Update each Status cell to `replied` / `listed` /
> `declined` as answers land, and record the reply date, because **the interval between send and
> listing is the number that sizes the whole channel** and we have never measured it.
>
> ⚠️ **A listing is not a citation.** Being added to a hub page is the input; the outcome is whether
> an AI engine then cites that page's mention of us. Re-run the DataForSEO `responses` probe on the
> buyer queries **after** any listing goes live, or we will have bought a link and called it a win.

| # | Site | Why it matters | Target page to be on | Contact route | Status |
|---|------|----------------|----------------------|---------------|--------|
| 1 | **treatcompare.com** | Most-cited hub on ChatGPT, across nearly every query. Dedicated UK blood-test comparison. | **Blood Tests & Diagnostics** (`/blood-tests`) — verified 2026-08-15 | **data@treatcompare.com** — verified 2026-08-15 from their Organization JSON-LD (`contactType: "customer service"`). ⚠️ **`/contact` has NO form and no links**: the four "routes" (Corrections, Data licensing, Provider updates, General enquiries) are plain text labels, so the page cannot be used to contact them. Email is the only route; subject prefixed `Provider update:` to self-route, since the inbox is general rather than editorial. Vets providers vs CQC/GPhC registers, so the copy states our non-regulated position explicitly. | 📨 **contacted 2026-08-15** |
| 2 | **maleoptimal.co.uk** | Men-focused (exact ICP). Cited repeatedly. Runs review/compare pages of Medichecks etc. | **Best Home Blood Test UK 2026: 6 Kits Compared (Medichecks Wins)** (`/blog/compare-home-blood-testing-services-uk-2026`) — site 403s to automated fetch, so resolved by search 2026-08-15 | **hello@maleoptimal.co.uk** — verified 2026-08-15, and it is the right one: their own JSON-LD marks it `contactType: "editorial"`. (`info@` and a proton address also appear on the page.) | 📨 **contacted 2026-08-15** |
| 3 | **helvy.co.uk** | Only hub cited by BOTH ChatGPT and Perplexity. | **Best blood tests UK** (`/guides/best-blood-tests-uk`) + `/compare` — verified 2026-08-15 | **team@helvy.co.uk** — verified 2026-08-15 on `/contact`. ⚠️ **The `hello@helvy.co.uk` recorded here since July does not exist**; mail to it would have bounced. | 📨 **contacted 2026-08-15** |
| 4 | **bloodtestguide.co.uk** | Cited several times; runs head-to-head compare pages. Publicly invites corrections + has a partner page (easiest in). | **Best UK private blood test providers 2026** (`/compare/best-uk-blood-test-providers/`) — verified 2026-08-15 | **aether@bloodtestguide.co.uk** — the partnerships inbox, verified 2026-08-15. Published behind Cloudflare email obfuscation, decoded from `data-cfemail` on `/partners/`. | 📨 **contacted 2026-08-15** |
| ~~5~~ | ~~**lolahealth.com**~~ | ❌ **DROPPED 2026-08-15.** The row below was wrong. | — | — | **dropped** |

❌ **lolahealth.com is not a comparison hub and never was.** Checked 2026-08-15: it publishes **no
"best of" or comparison page** and sells its own panels (Core Health 45 £125, Vital Check 56 £155,
Peak Insights 70 £200). It is a **direct competitor**, so there is no third-party list to join and no
pitch to make. The original row (*"Cited repeatedly by Perplexity; 'best blood test kits UK 2026'
guides"*) is kept here as the record of what was assumed. **Suggested replacement: welzo.com** from
Tier 2, which does run a doctor-ranked "best home blood tests" list and was independently cited in
the 2026-08-15 Perplexity probe, making it the only Tier 2 target confirmed on two separate pulls.

⚠️ **helvy is both a hub and a vendor.** It trades as Delta Lab Health Limited, sells its own tests,
and still ranks ten third-party providers (Function Health, Medichecks, Thriva, Numan, Randox,
Monitor My Health, Forth, LetsGetChecked, Bluecrest, London Medical Laboratory) while positioning
itself as "the curated UK option". A rival on that list is one it has already chosen to name, so
inclusion is plausible, but expect a slower reply than from a pure comparison hub.

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

> 🔄 **SUPERSEDED 2026-08-15 by CA-036. Do not send from this template.** The approved, sendable
> copy is [`2026-08-15-tier1-outreach-filled.md`](./2026-08-15-tier1-outreach-filled.md), where each
> email is written against its target's real page rather than a generic `[page name]`.
>
> **Two things below are now wrong, and the first is the reason this banner exists.** The bullet
> *"I can send you a free kit to try and review yourselves"* was **removed by Keith on 2026-08-15**:
> the kits are essentially the same as competitors', so a free one sells the commodity rather than
> the position, and treatcompare states *"No provider pays to be listed"*, which makes the offer read
> as an inducement to the highest-value target on the list. The replacement ask is a review of the
> site. Second, the differentiator bullet leads on data ownership; the current lead is the
> **conflict-free** position (one price; any result that needs a doctor goes to a GP and earns us
> nothing), per CA-026.
>
> Kept below as the record of what the July version said, and because the structure is still the
> right shape for a new target. **Anything reused from it inherits both corrections.**

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

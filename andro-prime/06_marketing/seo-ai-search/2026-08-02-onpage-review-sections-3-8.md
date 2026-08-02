# On-page review 2026-08-02: Sections 3 (remainder) to 8

Completes the truncated v2.1 review. Sections 1, 2 and the first half of Section 3 are in
the original report. Everything here was verified against both the live site and repo
source, so findings carry file and line references the fetch-only run could not produce.

Method note: the original run was fetch-only. This half had repo access as well, which is
why several findings below are narrower or wider than a pure external review would return.
Where the two disagree, the source is authoritative.

---

## Section 3 (continued) — Prohibited-string sweep

### EFSA / regulator-status badges

| Page | Quoted string | Location | Grade |
| --- | --- | --- | --- |
| **sitewide footer** (every non-`/lp` page) | `EFSA Regulated` | `components/shared/Footer.tsx:47` | **HARD** |
| `/lp/daily-stack` | `EFSA Compliant Dosage` | `app/lp/daily-stack/page.tsx:198` | **HARD** |
| `/supplements/daily-stack` | `EFSA-Approved Claims` (badge) | `app/(marketing)/supplements/daily-stack/page.tsx:99` | REVIEW |
| `/supplements/collagen` | `EFSA-Approved Vitamin C Claim` (badge) | `app/(marketing)/supplements/collagen/page.tsx:98` | REVIEW |
| `/about` | `EFSA-approved supplement claims.` | `app/(marketing)/about/page.tsx:127` | REVIEW |

EFSA does not regulate businesses, and post-Brexit the applicable list for GB is the
retained GB nutrition and health claims register. `EFSA Regulated` and `EFSA Compliant
Dosage` both assert a status. The three REVIEW items describe the *claim wording* rather
than the business, which is closer to defensible, but "EFSA-approved" is still the wrong
register name for a GB product and all five should be settled together.

The original report folded `EFSA Compliant Dosage` into its sitewide EFSA finding. It is a
separate string on a separate component, on a paid-ad page, and needs its own edit.

### CQC / accreditation attached to Andro Prime rather than the lab

**No CQC hits anywhere.** Not in copy, meta or JSON-LD, across every page fetched. Clean.

Accreditation is mostly handled correctly. Nearly every instance reads "UKAS ISO 15189
accredited lab" or "lab partner", which attributes it properly. Three exceptions:

| Page | Quoted string | Location | Grade |
| --- | --- | --- | --- |
| **sitewide footer** | `UKAS ISO 15189` as a bare badge, no attribution | `components/shared/Footer.tsx` | REVIEW |
| `/lp/daily-stack` | `UKAS ISO 15189 Lab` in a badge array headed by `GMC Registered Practice` | `app/lp/daily-stack/page.tsx:198` | REVIEW in isolation, **HARD** in context |
| global `Organization` JSON-LD | `"description": "...UKAS ISO 15189 accredited laboratory..."` | `app/layout.tsx:51` | REVIEW |

The JSON-LD one is prose inside a `description`, not an `accreditation` or `hasCredential`
property, so it is not a structured assertion that Andro Prime holds the accreditation.
Worth tightening, not urgent.

**Contractual constraint the review could not have known:** `app/(app)/results-dashboard/handoff/page.tsx:105`
carries the comment `Vitall agreement §3.6: state accreditation, no UKAS symbol`. How UKAS is
referenced is governed by the lab partner agreement, not only by ASA. Anyone editing these
strings must read that clause first. Route via `05_partners`.

### deposit / paid waitlist

**No hits.** No `deposit`, no `£75`, no pre-order or paid-waitlist language on any page.
The 2026-05-08 shelving is fully propagated to the site. Clean.

### TRT presented as available

**No hits.** The only `TRT` string on the entire site is `app/(marketing)/about/page.tsx:87`:
`GMC-registered GP with specialist training in men's hormonal health and TRT at Harley
Street.` That is a clinician credential, not an offer, and it is evidenced in
`03_compliance/credentials/ewa-trt-training-2025.md`.

Graded REVIEW, not HARD, and my recommendation is **leave it**. It states a qualification
Ewa holds. Removing it would cost real credibility for no compliance gain. Confirm with
Ewa that she is comfortable with it appearing while TRT is unavailable, and move on.

### fatigue / tired / exhausted / brain fog as Kit 1 framing

This is the widest-spread finding on the site. Kit 1 tests testosterone only.

| Page | Quoted string | Location | Grade |
| --- | --- | --- | --- |
| `/` (Kit 1 card) | `Essential for men experiencing fatigue, reduced muscle mass, or low drive.` | `app/(marketing)/page.tsx:358` | **HARD** |
| `/kits` (Kit 1 "Right for") | `Low energy, low drive, "not myself" symptoms` | `app/(marketing)/kits/page.tsx:226` | **HARD** |
| `/kits/testosterone` | `Exhausted by 3pm no matter how much sleep you get.` | `app/(marketing)/kits/testosterone/page.tsx:281` | **HARD** |
| `/kits/testosterone` | `Brain fog. Losing focus at work. Struggling to stay sharp.` | `app/(marketing)/kits/testosterone/page.tsx:282` | **HARD** |
| `/how-it-works` (Kit 1 card) | `For men who suspect testosterone might be behind the fatigue, the flat mood, and the loss of drive.` | `app/(marketing)/how-it-works/page.tsx:293` | REVIEW |
| `/lp/testosterone` | `Exhausted by 3pm` / `Brain fog.` | `app/lp/testosterone/page.tsx:258-259` | **HARD** |
| `/about` | `Exhausted by 3pm. Brain fog that wouldn't shift.` | `app/(marketing)/about/page.tsx:45` | REVIEW |
| `/test-selector` | `explicitly hormone-led (drive, motivation, specific fatigue)` | `app/(marketing)/test-selector/page.tsx:86` | REVIEW |

Two graded REVIEW for stated reasons rather than silently. `/how-it-works` says "suspect
testosterone **might** be behind" it, which frames a hypothesis to test rather than an
answer the kit delivers. `/about` is Keith's own founder story in the first person, which
is narrative, not a product claim. `/test-selector` already qualifies with "specific" and
"hormone-led"; tighten it, but it is not the same defect as the kit cards.

The four HARD kit-page instances are the ones that sell Kit 1 as the answer to fatigue.

---

## Section 4 — Structured data, Tier A

Verified live 2026-08-02. Current state by page:

| Page | Nodes present | Gap |
| --- | --- | --- |
| `/` | Organization, WebSite, HowTo (4 steps, 4 supplies) | No WebPage, no ItemList. HowTo carries a prohibited string and duplicates `/how-it-works` |
| `/test-selector` | Organization, WebSite only | Nothing page-specific at all |
| `/kits` | + BreadcrumbList, ItemList (3 kits) | No CollectionPage. ItemList description contains "diagnostic" |
| `/kits/*` (all three) | + Product, Offer, Brand, FAQPage, BreadcrumbList | No WebPage node. Single Offer only, does not describe the bundle CTA |
| `/how-it-works` | + FAQPage, HowTo | Duplicate HowTo with `/` |
| `/blog` | Organization, WebSite only | No CollectionPage, ItemList or BreadcrumbList |
| `/supplements` | + BreadcrumbList | No WebPage. Correctly carries **no** Product or Offer |
| `/supplements/daily-stack` | + BreadcrumbList | Same. Correctly no Offer |
| Articles | Article, WebPage, FAQPage, BreadcrumbList, `reviewedBy` | **Already correct.** Leave alone |

The article schema is the best on the site and its `reviewedBy` use is the defensible one:
a named clinician who actually signed that article off. Do not extend `reviewedBy` to kit or
product pages.

### 4.1 Homepage: remove the HowTo, add WebPage + ItemList

The homepage `HowTo` step 4 contains `a GP-designed report` and duplicates the `/how-it-works`
HowTo, so two URLs compete for the same procedural query. Delete it here, keep it there,
and fix the string in both.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://andro-prime.com/#webpage",
      "url": "https://andro-prime.com/",
      "name": "At-Home Blood Tests for Men (UK) | Andro Prime",
      "description": "At-home men's blood test kits. A five-minute finger-prick sample, analysed by a UKAS ISO 15189 accredited laboratory, with results in 2 to 5 working days.",
      "isPartOf": { "@id": "https://andro-prime.com/#website" },
      "about": { "@id": "https://andro-prime.com/#organization" },
      "inLanguage": "en-GB"
    },
    {
      "@type": "ItemList",
      "name": "Andro Prime at-home blood test kits",
      "numberOfItems": 3,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "item": { "@id": "https://andro-prime.com/kits/testosterone/#product" } },
        { "@type": "ListItem", "position": 2, "item": { "@id": "https://andro-prime.com/kits/energy-recovery/#product" } },
        { "@type": "ListItem", "position": 3, "item": { "@id": "https://andro-prime.com/kits/hormone-recovery/#product" } }
      ]
    }
  ]
}
```

Referencing the kit `@id`s rather than restating names keeps one description of each product.

### 4.2 `/test-selector`

Currently invisible to structured data, and it is the homepage hero's primary destination.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://andro-prime.com" },
        { "@type": "ListItem", "position": 2, "name": "Test Selector", "item": "https://andro-prime.com/test-selector" }
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://andro-prime.com/test-selector#webpage",
      "url": "https://andro-prime.com/test-selector",
      "name": "Which Men's Blood Test Should I Take? | Andro Prime",
      "description": "Three questions that point you to the right at-home blood test kit.",
      "isPartOf": { "@id": "https://andro-prime.com/#website" },
      "inLanguage": "en-GB"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Which men's blood test should I take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It depends which markers you want to see. Kit 1 measures testosterone only, including free testosterone and SHBG, so it suits a hormone-led picture such as low drive or motivation. Kit 2 measures Vitamin D, Active B12, hs-CRP and Ferritin, so it suits tiredness and slow recovery. Kit 3 measures all nine markers."
          }
        },
        {
          "@type": "Question",
          "name": "How long does the test selector take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Three questions. No payment is taken and nothing is ordered until you choose a kit."
          }
        }
      ]
    }
  ]
}
```

**Verification: Ewa** on both answer texts, because they state what each kit can and cannot
show. I removed the "about sixty seconds" timing claim the site makes elsewhere rather than
propagate an unverified number into structured data; **Keith** should decide whether it is
accurate before it goes anywhere.

### 4.3 `/kits`: add CollectionPage, fix the ItemList description

The `ItemList` description at `app/(marketing)/kits/page.tsx:20` currently reads
`Three diagnostic kits targeting testosterone, energy and recovery, or the full picture.`
Replace "diagnostic kits" with "test kits" in the same edit that fixes the visible label.

```json
{
  "@type": "CollectionPage",
  "@id": "https://andro-prime.com/kits#webpage",
  "url": "https://andro-prime.com/kits",
  "name": "Men's Health Blood Tests at Home (UK) | Andro Prime",
  "description": "Three at-home test kits: testosterone, energy and recovery, or all nine markers.",
  "isPartOf": { "@id": "https://andro-prime.com/#website" },
  "inLanguage": "en-GB"
}
```

### 4.4 `/blog`: the largest structural gap on the site

No `CollectionPage`, no `ItemList`, no `BreadcrumbList`. Worse than the schema gap: the hub
serves **7 crawlable article links** against **20 articles in the sitemap** (verified by
counting distinct `/blog/<slug>` hrefs in the served HTML). Pagination is a client-side
button and the URL never changes, so 13 articles have no internal link from their own hub.

Schema is the small half of this fix. The real fix is crawlable pagination (`/blog/page/2`)
or rendering all 20 cards. Add after that lands:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://andro-prime.com" },
        { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://andro-prime.com/blog" }
      ]
    },
    {
      "@type": "CollectionPage",
      "@id": "https://andro-prime.com/blog#webpage",
      "url": "https://andro-prime.com/blog",
      "name": "Men's Health & Blood Test Guides | Andro Prime",
      "description": "Plain-English guides to men's health blood markers: testosterone, vitamin D, B12, ferritin and inflammation.",
      "isPartOf": { "@id": "https://andro-prime.com/#website" },
      "inLanguage": "en-GB"
    }
  ]
}
```

Add an `ItemList` of article `@id`s only once every article is actually linked. Declaring 20
items while linking 7 states a structure the HTML does not support.

### 4.5 `/supplements` and `/supplements/daily-stack`

Add a `WebPage` node to each, matching the pattern above. **Add nothing else.** No `Product`,
no `Offer`, no `price`, no `availability`. Both pages are correct as they stand on this point
and the correct action is to leave that alone.

### 4.6 Kit pages

Add a `WebPage` node to each. The single-`Offer` versus bundle-CTA mismatch is a fact
discrepancy, not a schema design question, so it is in Section 6.

---

## Section 5 — Answer-first restructuring

**All three articles already open answer-first.** Verified from the served body text:

- `/blog/why-am-i-always-tired`: *"You're not lazy, and you're probably not ill. Most persistent tiredness in otherwise-healthy men traces to a short list of everyday..."*
- `/blog/andropause-male-menopause`: *"Andropause, often called the male menopause, is the popular name for the cluster of symptoms some men notice as testosterone slowly declines with age. The decline is real. But it isn't a single switch-off like the female..."*
- `/blog/how-to-increase-testosterone-naturally`: *"The levers that genuinely move testosterone are the unglamorous ones: losing excess body fat, lifting weights, sleeping properly, and easing off alcohol..."*

Each answers its title question inside the first 50 words, in plain language, without a
throat-clearing preamble. This is the standard the rest of the site should copy, not the
thing to fix.

**Recommendation: change nothing here.** These bodies are Ewa-approved. Rewriting a compliant,
well-structured opening would trigger a re-approval and consume clinical review time to buy
nothing. If Section 5 must produce an action, it is this: use these three openings as the
house pattern for the *next* brief, and apply answer-first to the pages that lack it (`/kits`,
`/kits/*` and `/` all open on a slogan H1 carrying no query term, per Section 2).

**One real defect found while reading them.** The table of contents renders twice in the
served HTML on all three articles, once visible and once as a duplicated block. It inflates
every article's body text and puts a nav list between the H1 and the answer. Worth a look
from `09_website-app`; it is a template bug, not editorial, so it needs no re-approval.

---

## Section 6 — Fact discrepancies, not page defects

These are contradictions, not copy problems. Do not draft copy for them. Each one means a
decision was made and never propagated.

### 6.1 `/waitlist` says the business has not launched. It has. Route to Keith.

The most serious factual contradiction on the site, and it is indexable: `/waitlist` is in
`sitemap.xml` and carries **no** `noindex`.

The page states *"Andro Prime is launching soon. Join the waitlist and get early access to
at-home blood tests"* and *"Be first to know your numbers"*, above a panel headed **"What's
coming"** listing all three kits at £99, £119 and £179 (`app/(marketing)/waitlist/page.tsx:32,48-53`).

All three kits are purchasable today. Stripe is live and checkout E2E has passed. So an
indexable page tells visitors they cannot buy what a page two clicks away sells, and prices
it as forthcoming.

This is the same class of error as the `signs-of-stress-in-men` CTA fixed on 2026-07-31,
which claimed "No kit to sell you today". That fix was applied to the article and never
swept. `/supplement-waitlist` is the legitimate waitlist (supplements genuinely are not on
sale); `/waitlist` appears to be a pre-launch page that outlived its purpose.

Decision needed from Keith, not a rewrite: retire the page and redirect to `/kits`, or
re-scope it to something still genuinely unlaunched.

### 6.2 Kit page CTAs sell bundles their schema does not describe. Keith.

| Page | Visible CTA | Schema `Offer` |
| --- | --- | --- |
| `/kits/testosterone` | Recheck Bundle £169 | £99 |
| `/kits/energy-recovery` | Prove-It bundle £199 | £119 |
| `/kits/hormone-recovery` | retest add-on £259 | £179 |

Confirmed live: `£169` and `Recheck Bundle` both serve on `/kits/testosterone`. Note this
means `BUNDLES_ENABLED` is **true** in production, while `09_website-app/STATE.md` still
records it as "currently `false` in prod". **Fix the STATE entry as well as the schema.**

Fix is `AggregateOffer` with `lowPrice`/`highPrice`, or a second `Offer`. Confirm the flag
state first, because the correct schema depends on what is actually purchasable.

### 6.3 Daily Stack doses on the site contradict the product spec. Ewa.

`/supplements/daily-stack` shows Zinc 30mg and Vitamin D3 4,000 IU. On 2026-07-02,
`04_products/supplements/daily-stack.md:8` and the formulation evidence review recorded a
decision to **drop zinc to 25mg** (30mg exceeds the EU supplemental upper limit of 25mg)
**and add ~1mg copper**. The site still shows the superseded figure, as do the manufacturer
outreach briefs in `05_partners`.

A month-old decision, never swept. This is a `/decision-sweep`, not an SEO fix, and it
reaches further than the website.

### 6.4 Conflicting delivery claims. Keith.

`/kits/testosterone` carries both `Free UK Delivery` and `Free Next-Day Delivery` in
different components on the same page. Pick one and confirm it is substantiated.

---

## Section 7 — What I could NOT assess

This review does not substitute for any of the following, and none of it was checked:

- Full-site crawl, orphan pages, internal link graph beyond the pages fetched
- HTTP status codes at scale, redirect chains, redirect loops
- `robots.txt` correctness beyond reading it, and `sitemap.xml` validity beyond counting URLs
- **Indexation status.** Whether any of these pages are actually in Google's index is unknown
- Core Web Vitals, page speed, LCP/CLS/INP field data
- Mobile rendering and mobile usability
- Server logs, crawl budget, bot access in practice
- Backlink profile, referring domains, anchor text, toxicity
- **Search Console data of any kind:** impressions, clicks, CTR, average position, query-level
  performance, coverage errors, manual actions, security issues
- Duplicate content at scale across the 18 blog articles not fetched
- `hreflang` (likely not applicable, UK-only) and canonicalisation correctness
- Whether structured data passes Google's Rich Results Test after the changes above
- Analytics: no traffic, conversion or revenue data informed any prioritisation here

Search Console is accessed in its own console for the `andro-prime.com` property and is not
wired as an MCP. The weekly glance is `12_operations/sops/search-console-monitoring.md`.
Whoever runs the follow-up should start there, and should re-pick the three articles in
Section 5 from real impression data.

---

## Section 8 — Priority actions

Every HARD compliance item outranks every SEO item regardless of effort. Items are grouped
by who signs them off, so this is four conversations, not seventeen tickets.

### 1. Ewa batch: clinical governance strings. HARD.

One re-approval covering every string asserting a clinician builds or reviews the customer's
report:

- `A real doctor designed your report.` heading, plus `who has treated men with exactly these symptoms` beneath it (`how-it-works:426,430`)
- `a GP-designed report` in body copy (`(marketing)/page.tsx:324`) **and** in `HowTo` JSON-LD (`(marketing)/page.tsx:45`)
- `Recommendation: Personalised to your data` on two kit pages (`energy-recovery:218`, `hormone-recovery:233`) and `Personalised to your number...` on `/how-it-works`
- Bare `GMC-Registered Doctor` badges beside sample result panels, ~9 instances across kit, `/lp/*` and `/order/confirmed` pages
- `GMC Registered Practice` on `/lp/daily-stack:198` — **the single most serious string found**, asserting a registered clinical practice while CQC registration is incomplete
- `GP-Led Formulation` badges (`daily-stack:99`, `collagen:98`)

**The compliant wording already exists in the codebase.** `/lp/testosterone:223` and
`/lp/hormone-recovery:264` use `Your next step, based on your numbers`; `/lp/energy-recovery:173`
uses `A specific supplement, based on your numbers`; `/how-it-works` already says
`recommendation logic approved by Dr Ewa Lindo, a GMC-registered GP`. Propagate what is
written rather than drafting new copy. That shrinks what Ewa has to read.

### 2. Ewa batch: EFSA claim integrity on `/supplements/daily-stack`. HARD.

`Zinc supports testosterone maintenance and immune function` (`daily-stack:48`) paraphrases
the authorised claim sitting directly above it and appends an uncited immune benefit. Same
pattern for D3 and B12. Delete the paraphrase sentences; the verbatim quotes already carry
the page.

### 3. Keith: retire or re-scope `/waitlist`. HARD, business fact.

See 6.1. An indexable page says you have not launched. Decide, then it is a five-minute edit.

### 4. Keith: sitewide component sweep. HARD.

Five component edits, not seventy page edits: `EFSA Regulated` footer badge, `EFSA Compliant
Dosage` on `/lp/daily-stack`, footer nav `Diagnostics` / `Diagnostic Quiz`, the bare `UKAS ISO
15189` badge (read the Vitall agreement §3.6 clause first), and the shared trust-strip badge
from item 1.

### 5. Ewa: Kit 1 scope correction. HARD.

Remove fatigue and brain-fog framing from the four HARD instances at `(marketing)/page.tsx:358`,
`kits/page.tsx:226`, `kits/testosterone/page.tsx:281-282`, and mirror to `/lp/testosterone:258-259`.
Route those symptoms to Kit 2 and Kit 3 with an explicit internal link, which also stops Kit 1
and Kit 2 competing for the same queries.

### 6. Keith: the "fix" cluster. HARD, small.

`nothing to fix` (`how-it-works:139`, where the same page already uses `nothing to address`),
`guessing won't fix it` (`energy-recovery:242`), `rest is not fixing it` (`collagen:124`).

### 7. `/decision-sweep`: zinc 30mg to 25mg plus copper. Ewa signs the outcome.

See 6.3. A month old, unswept, and it reaches the website, the product spec and five
manufacturer briefs. Not an SEO task.

### 8. `09_website-app`: make the blog hub crawlable. SEO, highest impact of the SEO items.

13 of 20 articles have no internal link from their own hub. Real paginated URLs or render
all cards. Everything else in SEO is downstream of the content being reachable.

### 9. `09_website-app`: structured data gaps. SEO.

Per Section 4: drop the duplicate homepage `HowTo`, add `WebPage` nodes across Tier A, add
`BreadcrumbList` + `WebPage` + `FAQPage` to `/test-selector`, `CollectionPage` to `/kits` and
`/blog`, and fix the bundle `Offer` once item 6.2 is settled. Do not add medical schema types.

### 10. `06_marketing`: title, meta and H1 pass. SEO.

`/blog` title carries no topical signal. Several meta descriptions truncate. Every commercial
page opens on a slogan H1 with no query term, which is a deliberate brand choice, so add a
keyword-bearing H2 beneath rather than replacing the H1s.

---

**Every copy change above runs `/compliance-preflight` before it ships, regardless of who
signs it off.** Run the pre-flight as a delta against the pre-edit baseline, not on absolute
counts: several of these pages carry pre-existing findings in Ewa-approved copy at untouched
lines, and an absolute-count run will report them as new.

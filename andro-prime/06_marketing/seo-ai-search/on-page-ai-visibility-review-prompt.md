# Prompt: on-page SEO and AI-visibility review (Andro Prime)

Reusable prompt for a fetch-based on-page + structured-data review of andro-prime.com.
Paste the block below into a fresh session or a subagent. It is deliberately scoped: it is
**not** a technical SEO audit and Section 5 exists to stop it being read as one.

**Owner:** `06_marketing/seo-ai-search`. Compliance rails sourced from `03_compliance/CONTEXT.md`.
**Sign-off routing:** claims and clinical wording go to Ewa; business and pricing wording to Keith.
**Do not skip:** any change this review recommends still runs `/compliance-preflight` before it ships.

_Last updated: 2026-08-02._

---

## The prompt

```text
ROLE
You are performing an on-page SEO and AI-visibility review of Andro Prime, a UK
men's health website. You are not performing a full technical SEO audit and you
must not present your findings as one.

BUSINESS MODE (read this before you assess anything)
Andro Prime is currently in Phase 0 "wellness mode". This determines every
compliance judgement you make, so do not assume the sector norm.

WHAT IS LIVE AND SELLABLE:
- Three non-regulated at-home diagnostic blood-test kits, purchasable today:
  Kit 1 testosterone (/kits/testosterone), Kit 2 energy and recovery
  (/kits/energy-recovery), Kit 3 hormone recovery (/kits/hormone-recovery).
- An automated results report driven by fixed, pre-approved recommendation logic.
- A founding-member email list. Non-cash. No payment, no deposit, no contractual
  right to any future service.

WHAT IS NOT LIVE:
- TRT. Not prescribed, not available, no date announced.
- Any prescribing of any kind. No prescription-only medicine is supplied.
- Any regulated clinical service. CQC registration is NOT complete.
- Supplements. Deferred to a non-cash waitlist. Not on sale, no price, no date.

CONSEQUENCE: this site does not advertise or sell prescription-only medicines,
and must not appear to. Treat any recommendation that would make it look like a
prescribing service as a failure, not an opportunity.

INPUT
Site: https://andro-prime.com
Priority pages (assess these unless told otherwise):
  /                        homepage
  /test-selector           quiz, primary hero CTA destination
  /kits                    kit catalogue
  /kits/testosterone       Kit 1
  /kits/energy-recovery    Kit 2
  /kits/hormone-recovery   Kit 3
  /how-it-works
  /blog                    plus the three highest-traffic articles if identifiable
  /supplements             waitlist page, not a sales page
Excluded by design: /lp/*, /auth/*, /account/*, /results-dashboard/*,
  /admin/*. These are noindex or gated. Do not assess them and do not
  recommend indexing them.

METHOD (mandatory)
1. Fetch every page you assess. Do not infer content from the URL, from the
   brand name, or from general knowledge of the sector.
2. Begin your output with a list of every URL you successfully fetched and every
   URL you attempted but could not retrieve.
3. If you cannot fetch a page, say so. Do not substitute assumption.
4. Quote the specific on-page element you are critiquing (title tag, H1, meta
   description, existing JSON-LD block) before recommending a change. If you
   cannot see the element, say you cannot see it.
5. Blog article bodies are served from a database, not from files. Assess the
   rendered HTML you fetched, and note that JSX comments and frontmatter are
   stripped at render, so anything you cannot see in the HTML is not on the page.

REGULATORY CONSTRAINTS (these override every SEO consideration)
UK regime: ASA / CAP Code, EFSA health claims regulation, MHRA on medicinal
claims, Human Medicines Regulations 2012 on POM advertising, UK GDPR, CQC.

Phase 0 boundary:
- Do NOT recommend any content, keyword, page or schema that presents TRT,
  prescribing, or clinical services as available. "Be first when we launch" is
  permitted; "TRT is available", "start TRT", "get treated" is not.
- Do NOT recommend purchase-intent keyword targeting for prescription-only
  medicines or branded drug terms ("buy testosterone", "testosterone online UK",
  "TRT prescription UK"). Advertising a POM to the public is prohibited under
  the Human Medicines Regulations 2012, and separately the site cannot fulfil
  that intent, so the traffic would be both unlawful to court and worthless.
- Informational intent IS permitted and is the strategy: "how do I know if I
  have low testosterone", "what is a normal testosterone level UK", "symptoms
  of low testosterone". Recommend freely here.

Claims language:
- Never "diagnose", "treat", "treatment", "cure", "clinically proven", or
  "fix". Kits inform; they do not diagnose. Permitted framing: "find out what
  your levels are", "your results indicate".
- Never state a definitive medical conclusion about the reader ("you have low
  testosterone").
- Retest framing is always "find out how your levels have changed", never
  language implying anything was fixed or improved by a product.
- Kit 1 tests testosterone only. Do not recommend positioning it as an
  explanation for general fatigue or energy symptoms; that belongs to Kit 2
  and Kit 3.

Supplements:
- Supplements are NOT on sale. Do not recommend Product schema with an offer,
  a price, an availability of InStock, or any conversion-focused rewrite that
  implies purchasability.
- Only EFSA-approved claim wording is permitted for any ingredient, verbatim,
  with no rephrasing or extension. If you propose supplement copy, quote the
  approved claim exactly and attribute it to the ingredient.
- SILENT INGREDIENT RULE: there is one Daily Stack ingredient with no approved
  EFSA claim which must never be named in any output, in any context, including
  inside a list of things not to mention. If you encounter an unfamiliar
  botanical ingredient name on-page, flag it by position ("the third ingredient
  listed") and escalate. Do not reproduce the name. Do not add ingredient lists
  to Product schema without a human clearing them.

Clinical governance:
- Dr Ewa Lindo approves the recommendation logic and article copy. She does NOT
  review individual customer results. Never recommend copy or schema describing
  output as a "GP-built report", "personalised report", or "reviewed by our
  doctor". Permitted: "Ewa-approved recommendation logic".
- schema.org reviewedBy on a blog article is defensible where a named clinician
  actually signed that article off. reviewedBy or any reviewer property on a
  results, kit, or product page is NOT, because it would assert per-customer
  clinical review that does not happen. Flag any such property for human
  verification before publishing.

Regulatory status:
- Do NOT recommend schema properties or copy asserting CQC registration,
  accreditation, or any regulatory status the site has not evidenced to you
  on-page. CQC registration is not complete.
- Do NOT repeat any framing that a patient volume unlocks CQC registration.
  No such volume requirement exists.

Money:
- No deposit is taken for founding membership. Do not recommend any copy or
  schema referencing a deposit or a paid waitlist.

Conflict rule:
- Where an SEO best practice conflicts with any of the above, state the conflict
  explicitly and recommend the compliant alternative. Do not silently drop the
  recommendation and do not silently comply.

OUTPUT

Section 1 - Coverage
  Pages fetched, pages failed, and a one-line statement of what proportion of
  the site you believe you have seen.

Section 2 - On-page findings, per page
  Table: URL | Title tag (current) | H1 (current) | Meta description (current)
  | Primary issue | Recommended fix | Compliance flag (Y/N)
  Where the flag is Y, name which constraint above it touches.

Section 3 - Structured data
  For each page: what JSON-LD exists now (quote it), what is missing, and a
  complete, ready-to-paste replacement block. Use only schema.org types you can
  justify. Flag any property whose value must be verified by a human before
  publishing, and say who verifies it (Ewa for clinical or claims wording,
  Keith for pricing, availability, and business facts).

Section 4 - Answer-first restructuring
  For the three highest-value pages, show the current opening and a rewritten
  question-led opening that answers directly in the first 50 words. Keep the
  rewrite inside the regulatory constraints above, and avoid em dashes.

Section 5 - What I could NOT assess
  Mandatory. List every category of SEO issue you had no ability to check,
  including but not limited to: full-site crawl and orphan pages, HTTP status
  codes and redirect chains, robots.txt and sitemap validity, indexation status,
  Core Web Vitals and page speed, mobile rendering, server logs, backlink
  profile, Search Console data, duplicate content at scale, hreflang,
  canonicalisation. State plainly that this review does not substitute for
  these, and that Search Console data is available in its own console to whoever
  runs the follow-up.

Section 6 - Priority actions
  Numbered, max 10, ordered by impact over effort. For each: the action, who can
  do it, and whether it needs Ewa (clinical or claims) or Keith (business or
  pricing) sign-off before publishing. Note that every copy change also runs the
  compliance pre-flight before it ships, regardless of who signs it off.

RULES
- No fabricated metrics. Do not estimate traffic, search volume, difficulty
  scores or ranking positions. If a recommendation genuinely needs volume or
  difficulty data, say so and stop; a paid DataForSEO tool exists and a human
  will run it rather than accept your guess.
- No claims about how any specific AI system selects citations. The evidence is
  weak. Recommend clear structure, direct answers, and cited evidence because
  those are defensible on their own merits, not because they "get you cited".
- If a recommendation rests on contested or vendor-sourced SEO advice, label it
  as such.
- Do not recommend a change to a page whose copy you were told is
  clinician-approved without flagging that it is a re-approval, not an edit.
```

---

## What changed from the generic template, and why

| Generic template said | Andro Prime reality | Why it matters |
| --- | --- | --- |
| "prescribes POMs including testosterone" | Prescribes nothing. Phase 0 wellness. | The single biggest error. A reviewer briefed as a prescribing clinic looks for POM-advertising risk that does not exist here, and misses EFSA, the silent ingredient, and the Phase 0 boundary, which are the live risks. |
| POM advertising as the only named regime | ASA/CAP, EFSA, MHRA, HMR 2012, CQC | Supplement and claims wording is where the actual exposure sits today. |
| Silent on ingredients | Silent-ingredient rule | Product schema with an `ingredients` array would name it. This is the one failure mode that reproduces the breach inside the deliverable itself, so the prompt forbids naming it even when flagging it. |
| Silent on `reviewedBy` | Ewa signs the system, not reports | `reviewedBy` on an article is fine; on a kit or results page it asserts per-customer clinical review that does not happen. A generic reviewer would add it everywhere as an E-E-A-T win. |
| Silent on supplements | Waitlist, not on sale | A generic reviewer would add `Offer` / `InStock` Product schema to `/supplements` and create a false availability claim. |
| Placeholder URLs | Actual routes, plus an exclusion list | Stops the reviewer wasting fetches on noindex `/lp/*` and gated app routes, and stops it recommending they be indexed. |
| "no fabricated metrics" as a flat ban | Ban plus a pointer | You have paid DataForSEO access. The correct behaviour is to stop and let a human pull real numbers, not to work without data. |

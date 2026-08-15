# Prompt: on-page SEO and AI-visibility review (Andro Prime)

Reusable prompt for a fetch-based on-page + structured-data review of andro-prime.com.
Paste the block below into a fresh session or a subagent. It is deliberately scoped: it is
**not** a technical SEO audit and the "what I could not assess" section exists to stop it
being read as one.

**Owner:** `06_marketing/seo-ai-search`. Compliance rails sourced from `03_compliance/CONTEXT.md`.
**Sign-off routing:** claims and clinical wording go to Ewa; business and pricing wording to Keith.
**Do not skip:** any change this review recommends still runs `/compliance-preflight` before it ships.

_Last updated: 2026-08-02. v2, revised after the first live run._

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
- Two-kit bundles may or may not be live at the time you run this. Report the
  CTAs and prices you actually observe rather than assuming either way.
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

TIER A - assess fully (SEO + structured data + compliance):
  /                        homepage
  /test-selector           quiz, primary hero CTA destination
  /kits                    kit catalogue
  /kits/testosterone       Kit 1
  /kits/energy-recovery    Kit 2
  /kits/hormone-recovery   Kit 3
  /how-it-works
  /blog                    plus three articles, selected per METHOD rule 6
  /supplements             waitlist page, NOT a sales page
  /supplements/daily-stack waitlist product page, NOT a sales page

TIER B - COMPLIANCE SWEEP ONLY, no SEO assessment:
  /lp/*                    paid-ad landing pages
  /about
  /order/confirmed         post-purchase page
  /faq
  Fetch these. Do NOT assess titles, meta descriptions, schema or keyword
  targeting, because they are noindex or off the organic path. DO run the
  prohibited-string sweep against them and report every hit.
  RATIONALE, and do not treat this as optional: noindex is not a compliance
  exemption. The /lp/* pages are paid-ad destinations, so they are the most
  exposed copy on the site, not the least. A previous run of this review
  excluded them entirely and missed live breaches that were duplicated there.

EXCLUDED entirely: /auth/*, /account/*, /results-dashboard/*, /admin/*.
  Gated or authenticated. Do not fetch, do not assess, do not recommend
  indexing them.

METHOD (mandatory)
1. Fetch every page you assess. Do not infer content from the URL, from the
   brand name, or from general knowledge of the sector.
2. Begin your output with a list of every URL you successfully fetched and every
   URL you attempted but could not retrieve.
3. If you cannot fetch a page, say so. Do not substitute assumption.
4. Quote the specific on-page element you are critiquing (title tag, H1, meta
   description, existing JSON-LD block) before recommending a change. If you
   cannot see the element, say you cannot see it.
5. Blog article bodies are served from a database, but they ARE present in the
   raw server response along with the head elements and JSON-LD. Verified
   2026-08-02 against /blog/why-am-i-always-tired: a ~124KB response carrying
   the full body text. Assess from the raw fetch. If a body genuinely does not
   appear in the response, say so and read the rendered DOM instead rather than
   scoping your findings to the head silently.
   H1 text that uses <br> concatenates without a space. Reproduce it faithfully
   and do not report the missing space as a defect.
6. You have no analytics and no Search Console, so you cannot identify the
   highest-traffic articles. Do not imply that you can. Select three articles on
   stated editorial criteria, name the criteria you used, and say plainly that a
   human should re-pick them from Search Console.
7. EXHAUSTIVE INSTANCE RULE. When you find a prohibited or non-compliant string
   on any page, search every other page you fetched for the same string and
   report every occurrence, including second occurrences on the same page. Do
   not stop at the first hit. A previous run reported one of two instances of
   the same prohibited phrase on a single page.
8. SITEWIDE COMPONENT RULE. Some elements come from shared header, footer and
   trust-strip components and therefore appear on every page. Report these once,
   under a "sitewide" heading, and state that they are sitewide rather than
   filing them against whichever page you happened to notice them on. A footer
   badge is one fix, not fourteen.

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
- Never "diagnose", "diagnostic", "treat", "treatment", "cure", "clinically
  proven", or "fix". Kits inform; they do not diagnose. Permitted framing:
  "find out what your levels are", "your results indicate".
- "Treated" is prohibited even when it describes a clinician's own history
  rather than an Andro Prime service, wherever it sits close to a description
  of what the customer receives. Flag it and let a human decide.
- Never state a definitive medical conclusion about the reader ("you have low
  testosterone"), and never presuppose a finding before testing ("find out
  which deficiency is slowing you down" presupposes a deficiency).
- Retest framing is always "find out how your levels have changed", never
  language implying anything was fixed or improved by a product.
- Kit 1 tests testosterone only. Do not recommend positioning it as an
  explanation for general fatigue, energy or brain fog; that belongs to Kit 2
  and Kit 3. Flag every existing instance of fatigue-led Kit 1 framing.

Supplements:
- Supplements are NOT on sale. Do not recommend Product schema with an offer,
  a price, an availability of InStock, or any conversion-focused rewrite that
  implies purchasability.
- Only EFSA-approved claim wording is permitted for any ingredient, verbatim,
  with no rephrasing or extension. A paraphrase sitting beside a correctly
  quoted claim is still a breach. So is appending a second benefit that carries
  no cited claim of its own.
- SILENT INGREDIENT RULE: there is one Daily Stack ingredient with no approved
  EFSA claim which must never be named in any output, in any context, including
  inside a list of things not to mention. If you encounter an unfamiliar
  botanical ingredient name on-page, flag it by position ("the third ingredient
  listed") and escalate. Do not reproduce the name. Do not add ingredient lists
  to Product schema without a human clearing them.

Clinical governance:
- Dr Ewa Lindo approves the recommendation logic and article copy. She does NOT
  review individual customer results. Never recommend copy or schema describing
  output as a "GP-built report", "GP-designed report", "personalised report",
  "personalised to your data", or "reviewed by our doctor". Permitted:
  "Ewa-approved recommendation logic".
- A bare trust badge reading "GMC-Registered Doctor" beside a sample result
  reads as per-customer clinical review. Flag it. The compliant form names what
  the clinician actually did: "recommendation logic approved by a GMC-registered
  GP".
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
- The laboratory's UKAS ISO 15189 accreditation belongs to the LAB, not to
  Andro Prime. Never attach it to the Andro Prime Organization node as award,
  accreditation, hasCredential or memberOf. Describing the lab as accredited in
  prose is fine; asserting it as an Andro Prime property is not.
- EFSA does not regulate businesses, and post-Brexit the applicable list for GB
  is the retained GB nutrition and health claims register. Flag any badge or
  copy asserting "EFSA regulated" or equivalent as a status claim.

Schema type ceiling:
- Standard health-sector SEO advice is to upgrade to MedicalBusiness,
  MedicalClinic, Physician or MedicalWebPage. DO NOT. Those types assert a
  clinical service that does not exist here and CQC registration is not
  complete. Stay on Organization, WebSite, WebPage, CollectionPage, Product,
  ItemList, BreadcrumbList, FAQPage, Article. If you think a medical type is
  warranted, state the conflict and recommend the compliant alternative
  instead of using it.

Money:
- No deposit is taken for founding membership. Do not recommend any copy or
  schema referencing a deposit or a paid waitlist.

Conflict rule:
- Where an SEO best practice conflicts with any of the above, state the conflict
  explicitly and recommend the compliant alternative. Do not silently drop the
  recommendation and do not silently comply.

OUTPUT

Section 1 - Coverage
  Pages fetched, pages failed, which tier each sat in, and a one-line statement
  of what proportion of the site you believe you have seen. Name the criteria
  you used to pick the three articles (METHOD rule 6).

Section 2 - On-page findings, Tier A only
  Table: URL | Title tag (current) | H1 (current) | Meta description (current)
  | Primary issue | Recommended fix | Compliance flag (Y/N)
  Where the flag is Y, name which constraint above it touches.
  Put sitewide component findings in their own row labelled "sitewide".

Section 3 - Prohibited-string sweep, ALL pages including Tier B
  Mechanical, not impressionistic. For each of the following, list every page
  and every occurrence, or write "no hits" if there are genuinely none:
    diagnose / diagnostic / diagnosis
    treat / treated / treatment
    cure / fix
    clinically proven
    personalised (in any report or recommendation context)
    GP-designed / GP-built / doctor designed / reviewed by our doctor
    EFSA regulated (or any regulator-status badge)
    CQC / accredited / accreditation attached to Andro Prime rather than the lab
    deposit / paid waitlist
    TRT presented as available
    fatigue / tired / exhausted / brain fog appearing as Kit 1 framing
  For each hit: page, the quoted string, and HARD (breaches a stated rule) or
  REVIEW (needs a human judgement). Do not soften a HARD to a REVIEW because
  the surrounding copy reads well.

Section 4 - Structured data, Tier A only
  For each page: what JSON-LD exists now (quote it), what is missing, and a
  complete, ready-to-paste replacement block. Respect the schema type ceiling
  above. Flag any property whose value must be verified by a human before
  publishing, and say who verifies it (Ewa for clinical or claims wording,
  Keith for pricing, availability, and business facts).
  Where the same schema block appears on more than one page, say so and treat
  it as one fix.

Section 5 - Answer-first restructuring
  For the three articles you selected, show the current opening and a rewritten
  question-led opening that answers directly in the first 50 words. Keep the
  rewrite inside the regulatory constraints above, and avoid em dashes.

Section 6 - Fact discrepancies, NOT page defects
  Separate from everything above. List anything where the page states a fact
  that contradicts another page, contradicts its own structured data, or looks
  internally inconsistent: price versus schema offer, CTA versus offer,
  conflicting delivery promises, dose or ingredient figures, availability.
  Do NOT propose copy for these. State the discrepancy and route it: Keith for
  commercial facts, Ewa for clinical or dosing facts. These usually mean a
  decision was made somewhere and never propagated, which is a different repair
  from an SEO fix.

Section 7 - What I could NOT assess
  Mandatory. List every category of SEO issue you had no ability to check,
  including but not limited to: full-site crawl and orphan pages, HTTP status
  codes and redirect chains, robots.txt and sitemap validity, indexation status,
  Core Web Vitals and page speed, mobile rendering, server logs, backlink
  profile, Search Console data, duplicate content at scale, hreflang,
  canonicalisation. State plainly that this review does not substitute for
  these, and that Search Console data is available in its own console to whoever
  runs the follow-up.

Section 8 - Priority actions
  Numbered, max 10, ordered by impact over effort, BUT every HARD item from
  Section 3 outranks every SEO item regardless of effort. For each: the action,
  who can do it, and whether it needs Ewa (clinical or claims) or Keith
  (business or pricing) sign-off before publishing. Note that every copy change
  also runs the compliance pre-flight before it ships, regardless of who signs
  it off. Group items that go to the same person into one batch rather than
  listing them separately.

RULES
- No fabricated metrics. Do not estimate traffic, search volume, difficulty
  scores or ranking positions. If a recommendation genuinely needs volume or
  difficulty data, say so and stop; a paid DataForSEO tool exists and a human
  will run it rather than accept your guess.
- No claims about how any specific AI system selects citations. The evidence is
  weak. Recommend clear structure, direct answers, and cited evidence because
  those are defensible on their own merits, not because they "get you cited".
- If a recommendation rests on contested or vendor-sourced SEO advice, label it
  as such. State your understanding, label it as needing verification against the
  vendor's live documentation, and do not build a priority action on it.
- **Settled 2026-08-15, so do not re-raise it as an open question:** Google fully
  deprecated FAQ rich results on 2026-05-07 and HowTo rich results earlier, and
  states that no special schema is required for AI Overviews or AI Mode. Treat
  `FAQPage` and `HowTo` as valid-but-inert for Google: worth keeping (other
  engines still parse them), never worth a priority action, and never a reason to
  recommend adding or removing markup. See
  [`2026-08-15-faq-rich-results-deprecation.md`](./2026-08-15-faq-rich-results-deprecation.md).
- Do not recommend a change to a page whose copy you were told is
  clinician-approved without flagging that it is a re-approval, not an edit.
- Report what you observed, not what you expected. If a CTA, price or feature
  contradicts what this brief told you to expect, that is a finding for Section
  6, not an error to reconcile silently.
```

---

## Changelog

### v2.1, 2026-08-02, correction

**METHOD 5 was factually wrong and is now fixed.** v2 asserted that blog article
bodies are not present in the raw HTML and must be read from the rendered DOM.
That came from the v1 run's report and was written into this file without being
checked. The v2 run contradicted it, and a direct fetch settles it: article bodies
ARE in the raw response. The rule now says so, with the date and the evidence.

The lesson is the reason this note exists rather than a silent edit: **a claim
about system behaviour taken from an agent's report becomes authoritative the
moment it is written into a reusable prompt, and every later run inherits it.**
Verify before persisting. A wrong instruction here is worse than no instruction,
because it tells the next reviewer to stop looking.

Credit where due: the v2 run flagged the contradiction explicitly instead of
quietly complying with a brief it could see was wrong. That behaviour is now
required by the last rule in the RULES block.

### v2, 2026-08-02, after the first live run

The v1 run was accurate on what it looked at. Every HARD finding it reported was
confirmed against source at file and line. The changes below close gaps in what it
was _told_ to look at, plus two behaviours worth locking in.

| Change | Why |
| --- | --- |
| **Tier A / Tier B split; `/lp/*`, `/about`, `/order/confirmed`, `/faq` added as compliance-sweep-only** | The v1 prompt excluded `/lp/*` as noindex. Correct for SEO, wrong for compliance: they are paid-ad destinations carrying duplicates of live breaches, and the run never saw them. This was a defect in the prompt, not in the reviewer. |
| **Exhaustive instance rule (METHOD 7)** | The run found "GP-designed report" in homepage JSON-LD and missed a second instance in the same page's body copy. |
| **Sitewide component rule (METHOD 8)** | The "EFSA Regulated" badge lives in the shared footer and appears on every page. It was filed as a homepage finding, which understates it and overstates the fix count. |
| **Section 3 prohibited-string sweep** | Replaces impressionistic reading with a checklist. "Treated" appeared on `/how-it-works` directly beneath the prohibited "designed your report" heading and was walked past. |
| **Section 6 fact discrepancies, split out** | The run correctly spotted a CTA price that disagreed with its schema offer, and dose figures that disagree with the product spec. Neither is an SEO fix; both mean a decision was never propagated. Mixing them into the SEO backlog buries them. |
| **RSC rendering baked into METHOD 5** | The run had to discover how article bodies render. No reason to rediscover it every time. **Corrected in v2.1, see below.** |
| **Article selection rule (METHOD 6)** | It handled this well: declined to imply a traffic ranking it could not see, and said so. Formalised so it is not luck next time. |
| **Schema type ceiling made explicit** | It derived the `MedicalBusiness` refusal itself. Too important to leave to inference. |
| **UKAS attribution rule** | Also derived correctly, unprompted: the accreditation belongs to the lab. Locked in. |
| **HARD items outrank SEO items in Section 8** | Prevents a live claims breach being ranked below a meta-description rewrite on effort grounds. |
| **Bundles described as "may or may not be live"** | Flag state changes. The brief should not assert something the reviewer can observe directly. |

### v1, 2026-08-02, initial adaptation

Adapted from a generic prescribing-telehealth review template. The template's core
premise (a UK site that prescribes POMs including testosterone) is false for Andro
Prime and was replaced with the Phase 0 business-mode block. Full rationale in the
table below.

| Generic template said | Andro Prime reality | Why it matters |
| --- | --- | --- |
| "prescribes POMs including testosterone" | Prescribes nothing. Phase 0 wellness. | The single biggest error. A reviewer briefed as a prescribing clinic looks for POM-advertising risk that does not exist here, and misses EFSA, the silent ingredient, and the Phase 0 boundary, which are the live risks. |
| POM advertising as the only named regime | ASA/CAP, EFSA, MHRA, HMR 2012, CQC | Supplement and claims wording is where the actual exposure sits today. |
| Silent on ingredients | Silent-ingredient rule | Product schema with an `ingredients` array would name it. This is the one failure mode that reproduces the breach inside the deliverable itself, so the prompt forbids naming it even when flagging it. |
| Silent on `reviewedBy` | Ewa signs the system, not reports | `reviewedBy` on an article is fine; on a kit or results page it asserts per-customer clinical review that does not happen. A generic reviewer would add it everywhere as an E-E-A-T win. |
| Silent on supplements | Waitlist, not on sale | A generic reviewer would add `Offer` / `InStock` Product schema to `/supplements` and create a false availability claim. |
| Placeholder URLs | Actual routes, plus an exclusion list | Stops the reviewer wasting fetches on gated app routes, and stops it recommending they be indexed. |
| "no fabricated metrics" as a flat ban | Ban plus a pointer | You have paid DataForSEO access. The correct behaviour is to stop and let a human pull real numbers, not to work without data. |

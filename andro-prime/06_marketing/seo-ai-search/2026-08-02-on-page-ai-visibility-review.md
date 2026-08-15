# On-page SEO and AI-visibility review, 2026-08-02

**Status:** findings received and triaged. **Nothing fixed yet.** Owner: Keith.
**Produced by:** the reusable prompt in `on-page-ai-visibility-review-prompt.md`, run in a separate session.
**Scope:** on-page and structured data only. Explicitly NOT a technical SEO audit.

**Coverage:** 14 of the 38 URLs in `sitemap.xml`, all HTTP 200. Essentially the whole commercial
surface plus three articles. The three articles were chosen on editorial judgement, **not** by
traffic: the reviewer had no analytics or Search Console and said so rather than implying a
ranking it could not see. Re-pick them from Search Console before acting on article priorities.

**Known limits of the source review, carried here so nobody over-reads it:**

- Article bodies are RSC-streamed and absent from the raw HTML. Only `why-am-i-always-tired` was
  read from the rendered DOM. The other two were assessed on head elements and JSON-LD only.
- The findings below stop at section 3.5 (kit-page schema), because that is where the received
  copy ended. **The remainder of the review has not been seen.**
- ~~Its claim that FAQPage and HowTo rich results are deprecated is dated to its own knowledge
  cutoff and flagged as needing verification. Do not spend effort on either until that is checked
  against current Google documentation.~~ ✅ **VERIFIED 2026-08-15: the reviewer was right.** Google
  fully deprecated FAQ rich results on 2026-05-07; HowTo went earlier. The markup stays (still valid
  schema.org, still parsed by PerplexityBot and Bingbot) but it is not a visibility lever, and any
  rule justified by rich-result eligibility now rests on nothing. Swept:
  [`2026-08-15-faq-rich-results-deprecation.md`](./2026-08-15-faq-rich-results-deprecation.md).

---

## Verified in this repo, 2026-08-02

Four flagged strings were confirmed present in **live source**, not merely in build output:

| Finding | Location | Reach |
| --- | --- | --- |
| `EFSA Regulated` badge | `frontend/components/shared/Footer.tsx:47` | **every page** |
| `GP-designed report` inside the `HowTo` JSON-LD | `frontend/app/(marketing)/page.tsx:45` | homepage, machine-readable |
| `GP-designed report` in body copy | `frontend/app/(marketing)/page.tsx:324` | homepage |
| `A real doctor designed your report.` | `frontend/app/(marketing)/how-it-works/page.tsx:426` | how-it-works |

**A detection lesson worth keeping:** the fourth is split across a `<br />`, so its text nodes
concatenate without a space and an exact-string search for the phrase does not find it. Any sweep
for prohibited phrasing that greps for whole sentences will miss anything broken across markup.

**Not verified by this repo pass:** the Daily Stack dosing figures (zinc 30mg, vitamin D3
4,000 IU) and the zinc claim paraphrase. Those come from the reviewer reading the live page and
are recorded as its observation, not as a confirmed fact.

---

## The finding that matters most, and it is not a copy bug

**Kit 1 is being sold as the answer to fatigue on four separate pages**: the homepage kit card,
`/test-selector` option A ("I am knackered..."), the `/kits` card ("Right for: Low energy..."),
and most strongly the entire symptom block on `/kits/testosterone` ("Exhausted by 3pm", "Brain
fog"). Kit 1 measures testosterone only. Fatigue is what Kit 2 measures.

Two consequences, and the second is easy to miss. It is a scope claim the product cannot support,
**and** it puts Kit 1 and Kit 2 in competition for the same query set, so it costs money as well
as being wrong. **Rewriting the wording without fixing the selector routing logic just relocates
it**, which is why this is a product decision rather than a copy pass.

---

## Triage by owner

**Removals of statements that are false or prohibited** (deletions, not rewrites, so the lowest
risk class): the `EFSA Regulated` badge (EFSA does not regulate businesses, and post-Brexit the
applicable GB list is the retained nutrition and health claims register), and the three
`GP-designed` / `real doctor designed your report` instances. The compliant wording already
exists elsewhere on the same pages: "Recommendation logic approved by a GMC-registered GP".

**Ewa:** Daily Stack zinc and D3 doses; the zinc claim paraphrase sitting outside the verbatim
EFSA text; the `GP-Led Formulation` badge; and whether she is content for "Harley Street-trained
in TRT" to appear while TRT is not available.

**Keith:** the Kit 1 scope decision; bundle prices absent from schema (CTAs quote £169 / £199 /
£259 while the JSON-LD carries base price only); and one kit page claiming both "Free UK Delivery"
and "Free Next-Day Delivery".

**Safe technical work, no copy implications:** `/test-selector` has no page-specific structured
data at all despite being the hero CTA destination; `/blog` has none either; the Organization
graph is missing `logo`, `sameAs`, `legalName` and `contactPoint`.

**One piece of standard SEO advice to keep refusing.** The review recommends staying on
`Organization` rather than moving to `MedicalBusiness` / `MedicalClinic` / `Physician`, because
those types assert a clinical service. That is correct and it is the Phase 0 boundary. It is also
what most health-sector SEO guidance will tell you to do, so expect to have to refuse it again.

**Two things looked for and not found, which is the good news:** no mention of CQC, accreditation
status, patient volume, deposits, paid waitlists, TRT availability or prescribing anywhere on the
14 pages fetched. The only TRT string on the site is inside Ewa's credential line. The site sits
inside the Phase 0 boundary on every big-ticket item.

**On the accreditation, one point worth carrying into any schema work:** the UKAS ISO 15189
accreditation belongs to the laboratory partner, not to Andro Prime. Asserting it as an
`Organization` property of Andro Prime would misstate whose accreditation it is.

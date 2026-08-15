# Decision: Google FAQ rich results are gone, so the rationale under our FAQ rules changes

**Date:** 2026-08-15
**Owner:** Keith Antony
**Status:** Decided (external fact, verified; no internal judgement was required)
**Workspace:** `06_marketing/seo-ai-search`

---

## Old fact → new fact

**Old:** FAQ blocks marked up as `FAQPage` earn a Google rich result, and that
eligibility requires question uniqueness across a domain. `HowTo` markup earns a
rich result too. Both were treated as AI-visibility levers.

**New:** Google **fully deprecated FAQ rich results on 2026-05-07**. `HowTo` rich
results were deprecated earlier. The August 2023 change had already narrowed FAQ
rich results to well-known authoritative government and health sites; the May 2026
change ended them.

Three consequences, and only the second changes what we do:

1. **The markup stays.** `FAQPage` and `HowTo` remain valid schema.org, they cause
   no harm, and they are still crawled and parsed by PerplexityBot, Bingbot and the
   RAG crawlers. Nothing needs removing from the site.
2. **The uniqueness rationale is dead.** There is no rich-result eligibility left to
   protect, so any rule justified by that eligibility is now justified by nothing.
3. **Schema is not the AI-visibility lever.** Google's own guidance is that no
   special schema is required for AI Overviews or AI Mode. What does the work is the
   clarity of the answer, not the markup around it. Our
   [`blog-ai-seo-strategy.md`](./blog-ai-seo-strategy.md) already leads with
   answer-first structure, cited statistics and expert attribution, so the strategy
   was right; only the schema rationale beside it was stale.

## How this surfaced

The [2026-08-02 on-page AI-visibility review](./2026-08-02-on-page-ai-visibility-review.md)
flagged it and explicitly declined to rely on it: *"Its claim that FAQPage and HowTo
rich results are deprecated is dated to its own knowledge cutoff and flagged as
needing verification."* That verification was owed and never done. It was done on
2026-08-15 against current vendor documentation and the reviewer was right.

## What is NOT decided here

**Whether the FAQ deconfliction rule in [`coverage-rules.md`](./coverage-rules.md)
§5 survives.** The rule imposes a manual grep before every article's FAQ block is
locked. Its stated reason is gone, but a second reason may hold: two articles
answering the same question in the same words compete with each other for the same
query, and duplicate answers are a self-cannibalisation problem independent of any
SERP feature. §5 has been updated to state the real reason and to record that the
old one expired. **Keith owns whether to keep, thin, or drop the procedure.**

## Carrier note

`FAQPage` markup is emitted by 15 files under `09_website-app/frontend`. None was
changed and none should be: the markup is still valid and still read by the non-Google
engines. Listed in the sweep report for the record.

The homepage `HowTo` block carries a separate, older finding (a prohibited
`GP-designed report` string, and duplication with `/how-it-works`). That is a
compliance and de-duplication item, tracked in `09_website-app/STATE.md`, and is not
part of this decision.

---
doc: coverage-rules
status: v1 — locks the rule, manual audit until Phase 2
last_updated: 2026-05-27
owner: Keith Antony
applies_to: every article brief + article draft + LP brief that consumes keywords.csv
companion: keywords.csv, keyword-clusters.md, blog-ai-seo-strategy.md
---

# Keyword Coverage Rules

This document prevents keyword cannibalisation across the Andro Prime content plan. It governs how individual articles, LPs, and other content pieces claim rows in [`keywords.csv`](./keywords.csv).

The rule exists because the content plan ships ~35 articles across 7 pillars over 12 weeks. Without coordination, two articles can end up targeting the same primary query → Google can't decide which to rank, splits authority, both rank weaker. This is **keyword cannibalisation** and it's the most common SEO failure mode for content-heavy launches.

---

## 1. The rule, in one paragraph

**Every CSV row has at most one canonical article — its `primary_article_slug`. Other articles may mention the query in passing or include it in their FAQ block, but they cannot claim it as their primary target or as a major H2 section.** FAQ-level reuse is allowed only when the answer is genuinely different in scope (e.g. hub gives the full answer; spoke gives a brief tangential answer that links up to the hub).

---

## 2. CSV columns that enforce this

Two columns added to [`keywords.csv`](./keywords.csv) on 2026-05-27:

| Column | Type | Values | Purpose |
| --- | --- | --- | --- |
| `primary_article_slug` | string | article slug (e.g. `pillar-G-hub-inflammatory-markers-blood-test`) or blank | The one article that owns this row as its primary target. Blank = no article has claimed it yet. |
| `coverage_status` | enum | `unassigned` (blank) / `planned` / `briefed` / `drafted` / `published` / `deferred` / `excluded` | Lifecycle of the article that targets this row. |

### `coverage_status` value definitions

- **(blank) / unassigned** — no article has claimed this row, no article is planned
- **`planned`** — the pillar is active and a future article will target this row, but no brief exists yet
- **`briefed`** — an article brief exists and claims this row as primary; no draft yet
- **`drafted`** — an article draft exists and claims this row; not yet published
- **`published`** — the article is live on andro-prime.com
- **`deferred`** — validated row but not addressed by the active pillar's current article plan (could become a future spoke)
- **`excluded`** — row will never be addressed by Andro Prime content (e.g. recipe queries, mental-health queries blocked by compliance, queries off-positioning)

`status` (existing column) and `coverage_status` (new column) are orthogonal:

- `status` answers "is this keyword valid for our plan?" (`validated`, `dropped`, `geo-only`, `pending`)
- `coverage_status` answers "where does the article that targets this keyword sit in its lifecycle?"

A row can be `status=validated` + `coverage_status=deferred` (the keyword is real but no article is going after it right now).

---

## 3. What counts as "claiming" a row

When you write a brief or article, you are **claiming** a row only if any of the following are true:

- The row's query is the article's **anchor query** — drives H1, slug, title tag, meta description, opening AI-snippet block
- The row's query is the **primary intent of a major H2 section** (a section the article is genuinely built around, not a tangent)
- The article is the **canonical answer** to that query — the resource the entire pillar should link to for that question

What is **not** a claim (allowed without claiming the row):

- The query appears in the article's FAQ block with a short, scope-limited answer that links up to the canonical article
- The query is mentioned in passing in a single sentence or paragraph
- The query's underlying biomarker / concept is discussed but the specific query string is reframed (e.g. an article on "fatigue" mentioning hs-CRP without targeting the hs-CRP query universe)

---

## 4. How to use this when writing a new brief

Before locking the brief's Section 5a Keyword coverage map:

1. Open [`keywords.csv`](./keywords.csv).
2. Filter to the pillar you're writing for (`assigned_to = pillar-X`).
3. Identify the rows your article will claim as primary (usually one — the anchor query).
4. For each row you plan to claim:
   - Check `primary_article_slug` is blank or matches the article you're writing. If it has a different slug, **stop** — that row is already claimed. Either:
     - Pick a different anchor query
     - Reframe your article so it doesn't compete with the existing claimant
     - Talk to Keith about whether the existing claim should be reassigned (rare)
5. For each row your article will cover but not claim (e.g. FAQ-level mentions):
   - The row's `primary_article_slug` can be different — that's fine
   - Add the row to your brief's Section 5a table with the coverage type clearly marked (FAQ / passing mention)
6. When the brief is finalised, update the CSV:
   - Set `primary_article_slug` on every newly-claimed row to your article's slug
   - Set `coverage_status` to `briefed`

When the article moves through the lifecycle:

- Draft complete → update `coverage_status` to `drafted`
- Article published → update `coverage_status` to `published`

---

## 4b. The promotion gate (candidate → accepted)

Cannibalisation is cheapest to prevent **before** a keyword becomes work. The `csv-to-queue` importer drops CSV rows into `keyword_queue` as `status=candidate`; a human then promotes `candidate → accepted`, at which point Brief-Architect scaffolds a brief and the article pipeline begins. **That promotion is the gate.** Its one job is the call auto-dedup cannot make: *"is this a standalone article, or coverage under something that already exists?"*

The importer's own dedup only catches **exact slug / pipeline collisions**. It does **not** catch same-intent rows whose slug differs, and it does **not** know what a pillar hub has already routed elsewhere. Those two gaps are exactly what slipped through on 2026-06-22 (`ferritin test` was a same-intent duplicate of the already-drafted `ferritin-blood-test`; `vitamin d test` was commercial intent the A-hub had already routed to the Kit 2 page). Both reached `accepted`+scaffold before being caught and rolled back. This checklist closes both gaps.

**Run every check before flipping a candidate to `accepted`. Any "stop" → do not promote; set `coverage_status` per the disposition and leave a note.**

1. **Same-intent article/brief check (the duplicate gap).** Search every authoring surface for the candidate's intent — not just its exact slug:

   ```bash
   grep -ril "<root term>" \
     andro-prime/06_marketing/seo-ai-search/article-briefs/ \
     andro-prime/06_marketing/seo-ai-search/article-drafts/ \
     andro-prime/09_website-app/frontend/content/blog/
   ```

   If an existing brief/draft/article already targets the **same search intent** — including when the candidate query is a **substring or superset** of an existing primary query (`ferritin test` ⊂ `ferritin blood test`; `vitamin d test` ≈ `vitamin d blood test`) — the candidate is **coverage, not a standalone article**. **Stop.** Fold it into that article's Section 5a as a covered query; set the queue row `coverage_status=excluded` with a note naming the owner.

2. **Parent-hub coverage-decision check (the wrong-channel gap).** Open the pillar's **hub brief** and read its Section 5a coverage map for the candidate (or its cluster). Hubs deliberately disclaim queries to other channels — look for notes like *"LP-grade"*, *"better as a Kit N page"*, *"hook not rank target"*, *"link out to sibling pillar"*. If the hub already routed this intent **to a `/kits/*` or `/supplements/*` page, an LP, or a sibling pillar**, the candidate belongs to that channel, not a new blog article. **Stop.** Set `coverage_status=excluded` with a note naming the destination.

3. **Existing-claim check.** Confirm `primary_article_slug` is blank for the row (Section 4, step 4). A filled, different slug = already owned. **Stop.**

4. **Sibling-pillar language check.** If the candidate's natural framing would force the article into a sibling pillar's vocabulary (Section 6 table), reconsider the pillar assignment before promoting.

5. **All clear → promote.** Use the **guarded promoter**, which runs checks 1–4 above programmatically (same-intent, hub-route, existing-claim, pipeline-collision) and **refuses the flip if any trips** — `--dry` to preview, `--force` to override a trip you've judged a false positive:

   ```bash
   # from 09_website-app/frontend
   npx tsx scripts/content-engine/promote-keyword.ts --query "<query>" --dry
   npx tsx scripts/content-engine/promote-keyword.ts --query "<query>"
   ```

   The manual SQL below is the fallback if the queue row needs a state the script doesn't handle; if you use it, the disposition note is the only audit trail:

   ```sql
   update keyword_queue set status = 'accepted'
   where query = '<query>' and status = 'candidate';
   ```

**Disposition vocabulary for rejects** (so a rejected candidate never silently re-surfaces): a same-intent duplicate or wrong-channel route → `coverage_status=excluded` + note; a valid future article not being written now → leave `candidate` / `coverage_status=unassigned` (or `deferred`). The scaffold filter (`status=accepted AND coverage_status IN ('unassigned','planned')`) means an `excluded` row can never re-scaffold.

> This gate is the *upstream* twin of Section 8's pre-publish audit. Section 8 catches cannibalisation before an article goes live; **4b catches it before the article is ever written.** Cheaper to catch here.

---

## 5. FAQ-level deconfliction

The 8 FAQ entries per article are the highest-risk reuse pattern because Google's FAQPage richsnippet eligibility requires uniqueness across a domain.

**Rule:** before locking an article's FAQ block, search the existing article-drafts + briefs for matching questions:

```bash
grep -r "your candidate question" andro-prime/06_marketing/seo-ai-search/article-drafts/ andro-prime/06_marketing/seo-ai-search/article-briefs/ andro-prime/09_website-app/frontend/content/blog/
```

If a question is already used:

- Reframe the question to a different angle
- Or replace it with a different long-tail question from the same CSV row universe
- Or, if the question genuinely needs to appear in both articles, ensure the answers are scope-different (one gives the full answer, the other gives a tangential brief answer that links to the canonical article)

When Phase 2 audit script ships, FAQ duplication will be flagged automatically. Until then, manual grep.

---

## 6. Pillar overlap policy

Some pillars share underlying biomarkers or concepts but are deliberately split by audience language (per [blog-ai-seo-strategy.md:40](./blog-ai-seo-strategy.md#L40)). Same biology, different audiences, different SERPs.

**The rule:** when writing an article in Pillar X, stay in X's vocabulary. Do not reframe a section to speak in a sibling pillar's language. The split is what protects each pillar from cannibalising the others.

### Known sibling-pillar overlaps

Use this table when scoping a new brief in any of these pillars. Each row names a friction point — somewhere two pillars touch the same biology — and the audience-language split that keeps them out of each other's SERPs.

| Sibling pair | Shared biology / concept | Audience-language split |
| --- | --- | --- |
| Pillar A (Vit D) ↔ Pillar B (fatigue) | Low Vit D as a cause of tiredness | A speaks deficiency language ("vitamin d deficiency symptoms") — Vit D is the marker. B speaks symptom-experience language ("why am i always tired") — Vit D is one of several possible causes mentioned in passing. |
| Pillar A (Vit D) ↔ Pillar C (testosterone) | Vit D supports T production; hair loss spans both | A frames Vit D as the marker even when discussing T effects ("vitamin d and testosterone"). C frames T as the marker; if Vit D is mentioned, link out to A rather than deep-diving. |
| Pillar A (Vit D) ↔ programmatic-symptoms hair-loss cluster | Hair loss as Vit D deficiency symptom | A spokes are content articles at `/blog/` ("hair loss vitamin deficiency"). Programmatic pages live at `/symptoms/[symptom]/` and target the direct symptom query ("blood test for hair loss"). Different URL spaces, different SERPs. |
| Pillar B (fatigue) ↔ Pillar G (inflammation) | Slow recovery, persistent tiredness | B is "I'm tired, what to test?". G is "I'm not recovering, what's the signal?" The body-feel difference is real — B speaks fatigue, G speaks recovery. |
| Pillar D (markers explained) ↔ every other pillar | D explains markers every other pillar references | D answers "what is hs-CRP" with full biology and number ranges — D is the canonical reference. Other pillars mention the marker in context and link to D for the full marker explainer. |
| Pillar D (markers) ↔ Pillar G (inflammation) | hs-CRP, ferritin, CRP | D speaks medical-literate ("crp", "fbc", "esr"). G speaks consumer-symptom ("inflammation", "joint pain", "soreness"). |
| Pillar E (andropause) ↔ Pillar C (testosterone) | Low T symptoms, hypogonadism | C answers "what's my testosterone number?" — universal male marker question. E answers "is this andropause?" — clinical-syndrome question. E is compliance-gated so its claims are fewer overall. |
| Pillar F (patient-owned data, GEO) ↔ every other pillar | The retest loop, tracking over time | F's GEO queries are unique to F (zero Google demand by design). Every other pillar references the retest concept in its "what changes when you have the number" section — those references stay short and link up to F for the full treatment. F is the canonical answer for "should I track over time?". |

### Practical guidance

- **Briefing a new pillar's hub?** Scan this table for any row where your pillar appears. Read the sibling pillar's existing claims in [`keywords.csv`](./keywords.csv) before writing.
- **Tempted to expand a section into a sibling pillar's territory?** Stop. Link out to the sibling pillar's canonical article instead. That link itself is an internal-SEO benefit — Google rewards hub-and-spoke architectures where related content cross-references explicitly.
- **No entry in this table?** Likely safe — pillars not listed here don't have known overlaps. But still check `assigned_to` in the CSV and run the FAQ-deconfliction grep before claiming any row.

---

## 7. Current claims (snapshot 2026-05-27)

| Article | Slug | Claims | Coverage status |
| --- | --- | --- | --- |
| Pillar G hub | `pillar-G-hub-inflammatory-markers-blood-test` | CSV row 94 (primary) | drafted |

Pillar G long-tail rows (95–103, 105–106, 293–296) are `coverage_status=planned` — covered in passing by the hub, awaiting their respective spoke briefs (G.1–G.5). Row 104 (`inflammation diet`) is `coverage_status=deferred` — valid Pillar G query but not addressed by the current article plan.

Rows 297–298 (`foods that stop inflammation`, `anti inflammatory foods`) are `coverage_status=excluded` — recipe content, off-positioning for Andro Prime.

---

## 8. Manual audit checklist (run before any new article ships)

Until the Phase 2 audit script exists, run this manually before promoting any article from `drafted` to `published`:

- [ ] Article's `keyword_coverage.csv_rows_covered` array matches the brief's Section 5a table
- [ ] Every row claimed as primary has `primary_article_slug = this article's slug` in [`keywords.csv`](./keywords.csv)
- [ ] No row claimed by this article has a different `primary_article_slug` already filled
- [ ] FAQ questions grep clean against other article-drafts + briefs + live MDX (Section 5 above)
- [ ] Article doesn't speak in the other pillar's vocabulary (Section 6 above)
- [ ] Article's `published_in` field gets added to [`keywords.csv`](./keywords.csv) **once Phase 2 ships the `published_in` column** (deferred — pending first article publish)

---

## 9. Phase 2 — audit script (deferred, build when 3+ articles exist)

`scripts/audit-keyword-coverage.js` will:

- Walk all article frontmatters (`content/blog/**/*.mdx` + `article-drafts/**/*.mdx` + `article-briefs/**/*.md`)
- Build a map: CSV row → list of articles claiming it as primary
- Build a map: FAQ question → list of articles using it
- Cross-reference against [`keywords.csv`](./keywords.csv)
- Report:
  - **Primary overlaps** (must-fix — two articles claim the same row)
  - **FAQ duplicates** (review — same question across multiple articles)
  - **Unassigned rows in active pillars** (opportunity)
  - **Articles claiming excluded rows** (bug)
  - **`primary_article_slug` mismatches** (article frontmatter and CSV disagree)

Run locally before each article ships. Hook into CI in Phase 3 (`pre-merge` gate) when content volume justifies it.

---

## 10. Required reading order for any new content task

1. [`tone-of-voice.md`](../../02_brand/tone-of-voice.md) — voice rules
2. [`/03_compliance/CONTEXT.md`](../../03_compliance/CONTEXT.md) — compliance rules
3. **This document** — coverage rules
4. Project-specific brief (e.g. an article brief in [`article-briefs/`](./article-briefs/))
5. Relevant workspace CONTEXT.md

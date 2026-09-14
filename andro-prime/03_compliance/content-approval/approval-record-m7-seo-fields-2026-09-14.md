# Approval record: M7 SEO commission — `seoTitle` / `seoDescription`, 26 fields, 15 articles

**CA number assigned on approval.** No number is written here on purpose: the
register stamps numbers in order of actual approval, and a prose reservation has
been overtaken twice before. The board record is ClickUp task
[`869f1wwch`](https://app.clickup.com/t/869f1wwch) on **Approvals & Sign-offs**
(`901219880207`).

| | |
|---|---|
| **Approved by** | Keith, 2026-09-14, in session |
| **Board state** | `pending` — **this list's rule is that only a named human sets a task to approved**, so the flip is Keith's and is the one action outstanding |
| **Clinical reviewer** | **Not asked, and not required.** Nothing here routes to Dr Ewa Lindo |
| **Artefact** | `09_website-app/frontend/scripts/content-engine/seo-drafts/batch-{1,2,3}.json` |
| **Scope** | 26 fields across 15 published articles. Browser tab and search snippet only; nothing renders on the page |

---

## Why this did not go to the clinical reviewer

Keith's ruling, 2026-09-14, defect register M7: *"review a revision of this type
as it is an SEO description and tag, not a clinical observation."*

That ruling composes with Ewa's own tier ladder rather than overriding it. Her
Q14 ruling of 2026-08-18 says a claim **"carried verbatim, or reworded with no
proposition added"** is tier 1 and auto-passes with no clinician; a claim
**"compressed, or on a surface that cannot carry the qualifier"** is tier 2 and
comes to her itemised. A 260-character description cut to 160 is her tier 2
almost word for word, so the boundary between the two rulings is the whole
question — and it is mechanical.

`scripts/content-engine/seo-revision-guard.ts` reads every proposed field against
the article's own approved title, excerpt and body, and routes on Ewa's ladder:
a rewording is tier 1 and goes to Keith; a net-new figure, a net-new citation, a
net-new prevalence claim, or a dropped qualifier falls through to her carrying
its findings. **All 15 articles returned `route: 'seo'` with zero findings**,
reproduced outside the checker by an independent reviewer.

---

## What changed in the copy

Every string is a cut of already-approved copy, with **one exception in 26**:
`fbc-blood-test` renders *"Shows"* where the approved title said *"Tells You"*,
because the approved title is 49 characters bare against a 46 budget and dropping
" You" alone leaves a non-sentence. That verb is itself adjudicated — Ewa's
signed claim 39 (CA-042, 2026-08-18) reads *"Ferritin **shows** iron stores…"*
for this exact relationship.

**Three corpus-level decisions Keith settled by approving as drafted**, each
raised explicitly before approval rather than folded in:

1. **Six descriptions drop "Reviewed by GMC-registered GP Dr Ewa Lindo."** The
   credential survives on five other surfaces — the visible standfirst, the
   reviewer byline, `og:description`, `twitter:description`, and the JSON-LD
   `description` plus `reviewedBy`, all of which read `frontmatter.excerpt`
   directly and are unaffected by `seoDescription`. Verified in
   `app/(marketing)/blog/[slug]/page.tsx`, not taken from a note. Most of the
   credential was already past the 160 cut on the live snippet, so what it
   replaces is a clinician's name truncated mid-surname.
2. **Two predicate-free titles**: `Inflammatory Markers Blood Test` and
   `Normal Testosterone Levels by Age`. Not a claims question — a bare noun
   asserts nothing — but no kit is named "inflammatory markers blood test", so it
   is a product-label judgement and it was Keith's.
3. **`how-to-read-blood-test-results` drops "for Men"** from a page carrying a
   male-specific cut-point. The excerpt still carries the scope on a search
   result; a browser tab or an AI Overview shows the title alone.

---

## Evidence

| Instrument | Result |
|---|---|
| `scan.js`, payload only (notes excluded per step 2a) | Batches 2 and 3: **0 HARD, 0 REVIEW**. Batch 1: 0 HARD, 1 REVIEW |
| `scan.js`, approved baseline (the exact fields replaced) | **Identical finding sets.** Zero introduced, zero removed |
| `fragment-scan.js`, each article against its signed-off source | **0 HARD on all 15** |
| `check-seo-drafts.ts` | 15/15 clear length, claim guard, house style, published status, approved `content_review_log` row |
| `guardSeoRevision` | 15/15 `route: 'seo'`, 0 findings |
| Independent compliance review | **Three passes, one per batch, each adversarial** |

⚠ **The single REVIEW hit is disclosed rather than buried.** `brain-fog` carries
*"fixable inputs"*, which trips the retest/efficacy rule. It is **verbatim from
the approved excerpt and is already the live search snippet today**, so this
batch does not change its exposure by a character. A grep of `03_compliance/`
found no adjudication of the term in that sense; the article itself was approved.
If it is to be ruled on, it belongs in an article-level sweep of the live body,
not in an SEO batch.

**What the independent reviews found**, recorded because a review that found
nothing would be worth less: one real error — batch 1 originally included
`cortisol-belly`, an unpublished draft sitting with Ewa, which was removed — and
five defects in the checking tooling, all fixed and all mutation-verified.

---

## 🔴 Applied to the database, and NOT yet visible

The 26 fields are written to `blog_articles.frontmatter` on the live database and
verified there. **They do not render, and will not until Direction F deploys.**

`resolveArticleSeo()` exists only on `redesign/direction-f`, which is 158 commits
ahead of `main`; every other branch returns zero for it. Production serves a build
with no concept of these keys and ignores them harmlessly — the live pages render
exactly as before. All 15 were revalidated (`/api/revalidate`, 200 on each) and
the rendered `<head>` re-read afterwards: still the old values, which is the
expected result and is why it was checked rather than assumed.

**Nothing further is owed to make them appear.** They surface with the branch.

---

## Consequence handled at the same time

Two of the approved articles — `why-am-i-always-tired` and
`inflammatory-markers-blood-test` — were already holding a **content** re-opt
staged 2026-08-18 and blocked on Keith. Two things followed:

1. **The fields were applied as a `jsonb` merge, not a staged revision.**
   `stage_blog_revision` overwrites `blog_articles.proposed_revision_id`, and that
   column holds one pointer, so staging would have orphaned a month-old pending
   revision. The `scope='seo'` route is right for a revision needing review and
   wrong for one already approved.
2. **Those pending revisions predate the fields**, so promoting them would have
   copied a 2026-08-18 frontmatter over the live row and silently deleted the
   approved snippet. The keys were carried forward onto both revisions from the
   live row, and `npm run verify:proposed-seo` — new — fails if any pending
   revision would drop a guarded key. It caught both before the fix and passes on
   all three pending revisions after it.

---

## Still owed: 3 fields, 2 articles

Neither is blocked on copy, and both are on the ratchet in
`scripts/verify-article-seo.ts`.

- **`cortisol-belly`** (2 fields) — status `draft`, with the clinical reviewer,
  three unticked rulings. A snippet compresses approved copy; a draft has none.
- **`14-signs-of-vitamin-d-deficiency`** (1 field) — published, with no
  per-article ClickUp task and no approved `content_review_log` row. It **is**
  signed off, by the blanket email of 2026-05-27 recorded in commit `6d2da5b` and
  transcribed in `03_compliance/STATE.md`, which already calls it the weakest
  sign-off trail in the blog set with remediation owed since 2026-07-31. The block
  is retrievability, not the words.

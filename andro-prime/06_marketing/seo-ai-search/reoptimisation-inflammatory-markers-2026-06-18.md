# Re-optimisation proposal: "Inflammatory Markers Blood Test"

> **Status: PROPOSAL for Keith + Ewa review. NOT applied.** The article is published and Ewa-signed.
> Changes to a signed clinical article need: (1) Ewa sight on new/changed copy, (2) `compliance-preflight`,
> (3) re-run `audit-keyword-coverage.js`, then (4) update `keywords.csv` coverage_status. Created 2026-06-18.

## Why

DataForSEO (2026-06-18) found a low-difficulty sub-cluster this hub sits on but doesn't explicitly
capture. The good news: the article already covers most of the *substance* (it lists the markers, gives
hs-CRP bands, and is entirely about inflammation draining recovery/energy). This is mostly a phrasing /
surfacing job, plus one genuinely new angle (infection-marker ranges). KD = DataForSEO scale.

| Gap term | Vol/mo | DFS KD | Already substantively on-page? |
|---|---|---|---|
| inflammatory markers list | 480 | 0 | Yes — the 4-marker section IS a list, not phrased as one |
| what are inflammatory markers in blood tests | 320 | 8 | Yes — existing FAQ + intro |
| what should your inflammatory markers be | 140 | 11 | Yes — the hs-CRP bands section |
| high inflammatory markers and fatigue | 210 | 3 | Yes — the article's whole thesis |
| infection markers in blood normal range | 590 | 13 | **No — new angle (infection vs inflammation)** |
| infection markers in blood over 300 | 590 | 22 | **No — new angle, acute/GP territory** |

~2,350/mo, mostly KD ≤ 13.

## Housekeeping (do at the same time)

The live file still carries a leftover non-rendering `{/* TODO Ewa sign-off */}` comment (line ~179,
above the Ewa ClinicalInsight). Strip it during this pass — same cleanup done at the CRP and
myth-of-normal-range publishes.

All proposed copy is em-dash-free per the tone rule.

---

## Proposed change 1 — Title (optional; changes H1 + meta title; slug stays the same)

Current: `Inflammatory Markers Blood Test: What They Reveal`

- **Option A (recommended, light):** keep the title; capture "list" via a heading (change 2). Lowest risk.
- **Option B:** `Inflammatory Markers Blood Test: the full list and what they reveal` — captures
  "inflammatory markers list" directly in the title. Slug stays `inflammatory-markers-blood-test`.

## Proposed change 2 — Reframe the existing marker section as an at-a-glance list

The section "The four markers a UK men's blood test would measure" already is the list. Add a compact
at-a-glance table at the top of it (using figures already approved in the body), then keep the existing
prose. Captures "inflammatory markers list" + "what should your inflammatory markers be".

```mdx
At a glance, the inflammatory markers on a UK panel and what a healthy reading looks like:

| Marker | What it is | What you want to see |
|---|---|---|
| hs-CRP | High-sensitivity C-reactive protein, the headline marker | Under 1.0 mg/L (1.0 to 3.0 average; over 3.0 elevated) |
| Ferritin | Iron store protein that also rises with inflammation | Above 30 µg/L, and not abnormally high |
| ESR | Older, slower inflammation test still on NHS panels | Context only; hs-CRP is the more useful number |
| IL-6 / fibrinogen | Research-grade, rarely on consumer panels | Not needed for a standard UK panel |
```

(Every value here is taken verbatim from the article's existing, signed body.)

## Proposed change 3 — Two new FAQ entries (the genuinely new content)

Add to the `faq:` block. The infection-marker answer is the one new clinical angle and is written to
route high readings to a GP, consistent with the article's existing >10 mg/L rule.

```yaml
  - q: "Can high inflammatory markers cause fatigue?"
    a: "High markers do not directly 'cause' fatigue, but persistent low-grade inflammation and the tiredness active men describe often travel together. A raised hs-CRP across a deload week (not just after a hard session) is a signal that training load, sleep, body composition or alcohol may have outrun recovery. It is a prompt to look at those inputs and retest, not a diagnosis on its own."
  - q: "What is the difference between inflammatory markers and infection markers, and what does a very high reading mean?"
    a: "They overlap: CRP is used both to track low-grade inflammation and to flag infection. The difference is scale. Low-grade, recovery-relevant readings sit in single digits (hs-CRP under 3 mg/L is the target band). Markedly high readings, and certainly a CRP in the hundreds, point to significant infection or acute illness, not lifestyle drift. Any reading over 10 mg/L is a GP conversation; a very high reading needs prompt medical attention, not a wellness blog."
```

## Keyword → element mapping

| Element | Captures |
|---|---|
| Heading/title "list" framing (change 1B/2) | inflammatory markers list, what are inflammatory markers in blood tests |
| At-a-glance table (change 2) | what should your inflammatory markers be |
| FAQ "cause fatigue" | high inflammatory markers and fatigue |
| FAQ "infection vs inflammation / very high" | infection markers in blood normal range, infection markers in blood over 300 |

## Sign-off / risk notes for Ewa

- **Reused, already approved:** the 4-marker list, the hs-CRP bands (under 1 / 1–3 / over 3 / over 10),
  ferritin <30 µg/L — all verbatim from the signed body. The at-a-glance table just re-presents them.
- **New copy needing sight:** the two FAQs, especially the **infection-marker / "over 300"** answer.
  It is written qualitatively and routes high readings to a GP. If Ewa wants a specific numeric infection
  threshold (e.g. CRP >100 suggests bacterial infection), she should supply/approve the number and a
  source; this proposal deliberately does not assert one.
- Phase 0 boundary intact: no diagnosis/treatment framing; existing GP-referral SystemAlert unchanged.

## Implementation (only after Ewa sign-off)

1. Apply changes + strip the stale TODO comment in `content/blog/inflammatory-markers-blood-test.mdx`.
2. `compliance-preflight` on the file.
3. `node scripts/audit-keyword-coverage.js`.
4. Add the 6 gap terms to `keywords.csv` (pillar-G, assigned to the slug, DFS KD in notes, coverage_status
   planned → published once live). Note `inflammation symptoms` (row 97) is already covered — don't dup.
5. `next build`, commit, push, live smoke test.

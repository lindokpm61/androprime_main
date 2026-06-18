---
brief: pillar-H-hub
target_query: liver function blood test
slug: liver-function-blood-test
vol_uk: 18100
kd_dfs: 18
kd_semrush: null
intent: informational (commercial-adjacent)
icp: ICP 2 (active 35-50) + ICP 3 (preventative 40+)
kit_funnel: EMAIL CAPTURE now → Liver kit / Kit 3 Plus on launch (no live product carries LFTs)
sequence: new pillar H — queue after the live D marker spokes (per pillar-architecture-rerank-2026-06-18.md)
compliance_gate: Medium (liver disease + alcohol adjacency — never diagnose; strong GP-referral for abnormal)
status: queued
owner: Keith Antony
reviewer: Dr Ewa Lindo
last_updated: 2026-06-18
source: pillar-architecture-rerank-2026-06-18.md
---

# Pillar H hub — "Liver function blood test" (QUEUED — not brief-ready)

> Queued from the 2026-06-18 pillar re-rank. This captures the strategy + the validated DFS cluster so the
> hub can be promoted to brief-ready fast. It is **not** brief-ready: it still needs the SERP underserved-gap
> check, the full CSV cluster lock, and Ewa's compliance read (see "To reach brief-ready" below). When
> promoted, expand to the 21-section hub template ([`pillar-D-hub-crp-blood-test.md`](./pillar-D-hub-crp-blood-test.md)).

## Why this pillar
`liver function blood test` 18,100 vol / **DFS KD 18** — the highest-value underserved gap in the demand+gap
queue, decision already locked. Same SERP-gap pattern as the CRP/D pillar (US clinical sites + generic NHS
lab pages, no UK men-specialist, no named GMC review), at scale. The marker-explainer model that won D and G
transfers directly.

## Validated cluster (DataForSEO, UK/en, 2026-06-18)
| Query | Vol | DFS KD | Role |
|---|---:|---:|---|
| liver function blood test | 18,100 | **18** | **Primary** — H1, slug, AI-snippet block |
| liver blood test | 18,100 | 30 | head variant (same vol; covered in opening) |
| liver function blood test normal range / values | 1,600 | 17–19 | "What counts as normal" H2 |
| liver function blood test normal range uk | 720 | 12 | UK-ranges H3 |
| liver function blood test high | 1,000 | 46 | "What a raised result means" H2 |
| abnormal liver function blood test | 390 | 12–21 | spoke / FAQ |
| what does a liver function blood test show | 210 | 24 | FAQ |
| liver and kidney function blood test | 140 | 22 | passing mention |

Anchor markers to explain (LFT panel): ALT, AST, ALP, GGT, bilirubin, albumin.

## Product routing
No live kit carries LFTs → **CTA = email capture / waitlist now**, flip to the Liver kit / Kit 3 Plus when it
launches (central CTA map, atomisation-model §4). Content is evergreen; only the CTA target changes.

## Compliance gate — Medium
Liver markers sit next to alcohol, fatty liver, hepatitis and liver disease — all diagnosable. Hard rules:
never diagnose; "your results may show…" not "you have…"; an explicit, prominent GP-referral block for
abnormal/high results; no alcohol-related lifestyle shaming; EFSA-only if any supplement is mentioned (none
planned). Ewa sign-off mandatory before draft ships. Read `/03_compliance/CONTEXT.md` first.

## To reach brief-ready (gates)
1. **SERP underserved-gap check** — run a SERP scan on `liver function blood test`; confirm no strong UK
   men-focused specialist owns it (process rule from `project_seo_pillar_rebalance`). Expected underserved.
2. **Lock the CSV cluster** — add these rows to `keywords.csv` (anchor added as `planned` this session),
   set `primary_article_slug` + `coverage_status=briefed` at brief-finalisation.
3. **Ewa compliance read** on the abnormal-result framing + GP-referral lines.
4. **Keith approval** of anchor, scope, email-capture routing.
5. Expand to the full 21-section hub template.

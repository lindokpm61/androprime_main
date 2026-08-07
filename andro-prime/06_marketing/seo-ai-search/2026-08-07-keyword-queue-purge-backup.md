# `keyword_queue` purge backup (2026-08-07)

*Full contents of the `keyword_queue` table immediately before it was purged and re-seeded on
2026-08-07. Kept because the **rejection reasons are durable knowledge** — they record decisions
("fold this into that hub", "off-strategy brand term") that would otherwise have to be re-derived
the next time these terms surface. Every `query` below also exists as a row in
[`keywords.csv`](./keywords.csv), so the terms themselves were never at risk; these notes were.*

**Why it was purged:** all 30 rows dated from a single 2026-06-19/21 import. The three `accepted`
rows still read `coverage_status=briefed` for articles that went live 2026-06-22, so the table's
answer to the promotion gate's first question — "has this already been done?" — was wrong. See
[`2026-08-06-next-keyword-selection.md`](./2026-08-06-next-keyword-selection.md) §1 and §6.3.

**One inconsistency worth naming:** `ggt blood test` carried `status=candidate` while its own note
read *"ACCEPTED 2026-06-21"*. The note and the status field disagreed for seven weeks. A decision
written into free text next to a status column that contradicts it is not a record, it is a trap.

---

## Accepted (3) — all three were already live when this snapshot was taken

| Query | Vol | KD | Pillar | Coverage (wrong) | Notes |
|---|---:|---:|---|---|---|
| `fbc blood test` | 12,100 | 34 | pillar-D | `briefed` | D.1/D.3 spoke; pairs full blood count 8100 (row 65); ~20k cluster |
| `ferritin blood test` | 6,600 | 57 | pillar-D | `briefed` | D spoke marker (very high cluster ~110k incl iron-deficiency symptom hooks rows 74-80); symptom terms are hooks not rank targets; G hub covers ferritin in passing |
| `b12 blood test` | 2,400 | 31 | pillar-D | `briefed` | D spoke marker LP-grade; test/marker intent ONLY; deficiency-symptom angle belongs to Pillar A (`vitamin b12 deficiency symptoms` row 214) — do not poach |

## Candidates (13)

| Query | Vol | KD | Pillar | Coverage | Notes |
|---|---:|---:|---|---|---|
| `ggt blood test` | 6,600 | 10 | pillar-H | `unassigned` | **note said ACCEPTED 2026-06-21** (liver/GGT spoke, pillar H; also targets `serum gamma gt level`) while status stayed `candidate` |
| `hiv test kit` | 3,600 | 9 | — | `unassigned` | import only; off-strategy |
| `full body mot health check` | 3,600 | 4 | — | `unassigned` | import only; off-strategy |
| `ferritin test` | 2,900 | 5 | D | `excluded` | same intent as `ferritin-blood-test` (8,100-vol head term, already drafted); fold in as covered query |
| `blood test from home` | 2,900 | 2 | — | `unassigned` | import only |
| `cholesterol kit test` | 2,400 | 0 | I | `unassigned` | import only |
| `neut blood test` | 2,400 | 8 | — | `unassigned` | import only |
| `blood test neutrophils` | 2,400 | 0 | — | `unassigned` | import only |
| `hormones blood test` | 2,400 | 1 | — | `unassigned` | import only |
| `urea and electrolytes test` | 2,400 | 0 | future-kit-kidney | `unassigned` | import only; gated on a kidney kit that does not exist |
| `superdrug blood test` | 2,400 | 0 | — | `unassigned` | import only; competitor brand term |
| `vitamin d test` | 2,400 | 8 | A | `excluded` | commercial intent routed to the Kit 2 page (`/kits/energy-recovery`) per the A-hub coverage decision (rows 158-159); not a blog article |
| `cholesterol machine test at home` | 2,400 | 0 | I | `unassigned` | import only |

## Rejected (14) — the reasons are the reason this file exists

| Query | Vol | KD | Rejection reason (2026-06-21) |
|---|---:|---:|---|
| `blood work crp test` | 27,100 | 27 | **FOLD**: phrasing variant of the live `crp-blood-test` hub; capture on-page, no new page |
| `serum ferritin` | 22,200 | 19 | **FOLD**: same topic as the accepted `ferritin-blood-test` spoke; secondary keyword there |
| `full blood count check` | 18,100 | 9 | **FOLD**: same topic as the accepted `fbc-blood-test` spoke; secondary keyword there |
| `count of lymphocytes` | 12,100 | 9 | **FOLD**: FBC index → section within `fbc-blood-test`, not a standalone page |
| `mchc blood test` | 12,100 | 0 | **FOLD**: FBC index → section within `fbc-blood-test` |
| `blood analysis mch` | 9,900 | 0 | **FOLD**: FBC index → section within `fbc-blood-test` |
| `blood test mean corpuscular hemoglobin` | 9,900 | 11 | **FOLD**: FBC index → section within `fbc-blood-test` |
| `mcv test` | 8,100 | 0 | **FOLD**: FBC index → section within `fbc-blood-test` |
| `mean corpuscular haemoglobin` | 8,100 | 0 | **FOLD**: FBC index → section within `fbc-blood-test` |
| `corpuscular haemoglobin` | 8,100 | 2 | **FOLD**: FBC index → section within `fbc-blood-test` |
| `haematocrit pcv low` | 6,600 | 10 | **FOLD**: FBC index → section within `fbc-blood-test` |
| `serum gamma gt level` | 8,100 | 4 | **FOLD**: same GGT marker → secondary keyword on the `ggt-blood-test` spoke |
| `bupa health check` | 8,100 | 0 | **OFF-STRATEGY**: competitor brand term |
| `testos blood test` | 3,600 | 8 | **OFF-STRATEGY**: typo/colloquial; testosterone covered by Pillar C |

**The standing rule these encode:** individual FBC indices (MCH, MCHC, MCV, haematocrit, lymphocytes,
neutrophils) are **sections inside `fbc-blood-test`, never standalone pages**, however low their KD
looks. Eleven of the fourteen rejections are that one decision applied repeatedly. If an FBC index
term resurfaces on a future shortlist, this is the answer.

---

*Restoring: the terms and their volumes are in `keywords.csv`; this file holds the decisions. Nothing
here needs to be reinstated in the table — it was purged precisely because a stale worklist answering
"what is next" with June data is worse than an empty one.*

# Keyword backlog re-rank — DataForSEO vs Semrush (2026-06-18)

> **What this is:** a difficulty re-rank of the active keyword backlog using DataForSEO, after the
> testosterone-by-age discovery showed the locked Semrush KDs were over-stating difficulty. Pulled
> DFS KD for all 113 `validated`, non-published rows with a Semrush KD and vol ≥ 200 (one `overview`
> call, $0.10). **KD scales are not comparable** — this is Semrush-KD-says-hard vs DFS-KD-says-easy.
> Volumes also differ between providers (both Google-derived, different models); treat as directional.
> This is a prioritisation signal, not a mandate: compliance, ICP and funnel still decide what gets built.

## Headline

The over-statement is systematic and concentrated in the **D-pillar blood-marker spokes** — high
volume, already mapped, low compliance risk, and now showing single-to-low-double-digit DFS KD. Under
the corrected difficulty, **the D-pillar marker family is the highest-leverage content to build next**
(the CRP hub is already live; these are its natural spokes).

## Top winnable movers (Semrush-hard → DFS-easy, in-scope, low compliance)

| Query | Pillar | Vol (DFS) | Semrush KD | DFS KD | Note |
|---|---|---|---|---|---|
| ferritin | D | 27,100 | 57 | **12** | marker spoke |
| serum ferritin | D | 22,200 | 68 | **19** | clinical variant |
| fbc blood test | D | 18,100 | 34 | **9** | full blood count spoke |
| esr blood test | D | 12,100 | 72 | **34** | still moderate but huge drop |
| why am i so tired all the time | B | 12,100 | 45 | **20** | B.1 fatigue spoke |
| cholesterol test | D/metabolic | 9,900 | 48 | **26** | |
| ferritin blood test | D | 8,100 | 57 | **12** | |
| full blood count | D | 8,100 | 41 | **26** | |
| why do i feel tired all the time | B | 8,100 | 57 | **24** | |
| best vitamin d supplement | A (commercial) | 6,600 | 43 | **2** | route to supplement/LP, not hub |
| b12 blood test | D | 3,600 | 31 | **12** | |
| inflammation in the body | G | 2,400 | 40 | **25** | G.1 spoke |
| male menopause symptoms | E | 1,600 | 48 | **22** | gated on Ewa/compliance |
| prolactin test | C | 1,600 | 23 | **0** | Kit 1 expansion marker |
| shbg test | C | 260 | 48 | **7** | Kit 1 marker, low vol |

## Read

- **D-pillar marker spokes are the win.** ferritin (27k), serum ferritin (22k), fbc blood test (18k),
  ferritin blood test (8k), full blood count (8k), b12 blood test (3.6k) — all now KD ≤ 26, several
  ≤ 12, all low compliance risk, all already CSV-mapped to pillar-D. Build the marker-explainer spokes
  off the live CRP hub.
- **B-pillar (fatigue) is more winnable than it looked.** "why am i so tired all the time" (12k, KD20)
  and "why do i feel tired all the time" (8k, KD24) drop into buildable range. The B hub hasn't been
  written yet — this strengthens the case.
- **A-pillar head term** "vitamin d deficiency" (49.5k) eased 68→37: still real work, but no longer a
  wall for a future hub-strengthening pass.

## Do NOT re-prioritise on KD alone (decision unchanged despite easier KD)

- **Commercial / brand-misaligned traps:** `testosterone supplements uk` (S55→DFS2), `how to increase
  testosterone` (S65→DFS29), `best testosterone booster uk` — CSV already marks these do-not-target.
  Easier KD doesn't change the compliance/brand call.
- **Compliance-heavy:** `psa blood test` (8k, DFS48), `prostate blood test` (DFS49) — cancer-adjacent,
  heavy burden; future-kit-prostate gate stands.
- **E-pillar (andropause/TRT/male menopause):** several eased, but all gated on Ewa + ASA regardless.
- **Future-kit (metabolic/thyroid/cortisol):** cortisol test uk (S15→DFS0), cortisol blood test
  (S37→DFS7), apob (DFS12) look very winnable, but they belong to kits not yet launched — note for
  when those kits ship, don't build content ahead of product.

## Caveats

- DFS KD ≠ Semrush KD scale. Do not write DFS KD into the `keywords.csv` `kd` column (it is
  Semrush-scaled); if annotating, put DFS KD in `notes` (the convention the DFS-sourced rows already use).
- Volume divergence example: `vitamin d deficiency` CSV/Semrush 40,500 vs DFS 49,500. Directional only.
- 113-row sample = validated + Semrush-KD'd + vol ≥ 200 + not yet published. Dropped/zero-vol/GEO rows
  were intentionally excluded.

## Suggested next action

Brief the **D-pillar marker spokes** (ferritin, fbc/full blood count, b12 blood test) as the next
content wave off the live CRP hub — highest volume × lowest corrected KD × lowest compliance risk in
the backlog. (Liver hub from the existing demand-gap queue remains the other strong candidate.)

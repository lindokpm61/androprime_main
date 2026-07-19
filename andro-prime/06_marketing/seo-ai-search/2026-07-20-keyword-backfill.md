# Keyword-map backfill + SERP intent checks (2026-07-20)

*Closes Fable's A3 (the map was labelled "sized" but the flagship hubs were blank) and A7 (mapping traps). Data: DataForSEO Google Ads search volume + live SERP, United Kingdom, EN. The sized map `vitall-keyword-to-kit-map-sized-2026-07-19.csv` was patched in place (now 280 rows).*

## 1. Verified limitation: the male-hormone HEAD terms are unsized in DataForSEO UK

Both DataForSEO endpoints (labs `keyword_overview` and Google Ads `search_volume`) return **no volume** for the flagship hubs:
`low testosterone`, `testosterone test`, `testosterone blood test`, `low testosterone symptoms`, `male menopause`, `high oestrogen men`, `erectile dysfunction blood test`, `man boobs`, `gynaecomastia`, `private blood test`, `STI test`, `chlamydia test`, `HIV test at home`, `bowel cancer test at home`.

**Consequence:** the earlier "male-hormones ~136k monthly searches" cluster total was carried almost entirely by `manopause` (40,500), `hyperthyroidism` (40,500) and `moobs` (6,600) - two of which are informational and one wrong-intent (see §3). The true commercial heads (`low testosterone`, `testosterone test`) are **unmeasured**, so the cluster's commercial demand is softer and less certain than the headline implied. **Do not rank kits on this file's cluster totals for the hormone cluster.** To size the heads, use Google Keyword Planner directly (grouped data) or Search Console once the site has impressions.

## 2. Newly sized terms added / corrected (Google Ads, UK, 2026-07-20)

| Keyword | Vol/mo | Note |
|---|---|---|
| erectile dysfunction | **90,500** | Biggest in the set. TREATMENT intent; AP cannot treat ED (low-T to GP). Acquisition trap; use the "ED blood test" variant only (itself unsized). |
| PSA test | **33,100** | Huge. But PSA is clinically contested (over-diagnosis is why NHS doesn't screen). vs `prostate cancer risk` at 320: a ~100x gap - the market wants PSA, not genetic risk scores. Ewa gate before any PSA build. |
| brain fog | **14,800** (KD36) | Added as a head row (was missing; only `brain fog male` existed, blank). Confirms the Kit 2 reweight. |
| allergy test | 22,200 | Already mapped. |
| cholesterol test | 8,100 | - |
| vitamin D test | 2,400 | Cheap high-intent (KD8). |
| gut health test | 1,900 | Updated from blank. |
| biological age test | 1,900 (KD27) | NEW category: the "longevity" framing Function/Thriva use. No AP product; off-limits under Phase 0 anyway. |
| at home blood test | 1,600 | Category head, CPC £5.56. |
| low sex drive men | 1,600 | HIGH paid comp (CPC £4.64). |
| no sex drive male | 480 | - |
| prostate cancer risk | 320 | The genetic-risk term is tiny vs PSA. |
| mens health blood test | 210 | Tiny volume but **CPC £11.74** - the highest commercial-value click in the set. The category head is low-volume/high-value: demand is expressed through symptoms/conditions, not the category name (consistent with "the men's SERP is wide open"). |

## 3. SERP intent-trap checks (Fable A7)

- **`manopause` (40,500/KD10): mapping HOLDS.** Live UK SERP is entirely male andropause/low-T (NHS "male menopause", Medichecks andropause, Mayo, AI Overview all male). Minor female bleed only in related-searches. Keep it, but as **top-of-funnel education / AEO**, not transactional. Mapped to Testosterone Test - correct.
- **`moobs` (6,600/KD5): DE-PRIORITISE.** Live UK SERP is a mix of a **male breast-cancer charity ranking #1** (moobs.uk), cosmetic surgery (St Hugh's, Harley Medical, Air Aesthetics, Vaser Lipo), gym "lose man boobs" videos, and noise (a band, a Valorant player). It is NOT a hormone-testing intent and carries a brand-safety risk. The Testosterone & Estrogen mapping is weak; do not build a testing page for it.

## 4. Actions

- Kit 2 / Pillar K: proceed with the "brain fog" reweight (ClickUp `869e6hq0g`).
- Do not size the hormone kits on this file - size the heads via Keyword Planner / Search Console.
- PSA: treat 33,100 demand as real but gated - route to Ewa before any PSA product (see `01_strategy/competitive-landscape/2026-07-20-uk-testing-competitor-teardown.md` and the Fable review C2).
- Drop `moobs` from the build list; keep `manopause` as an AEO/education term.

# QA: Results Dashboard
## Code-level audit — April 2026

Audit method: code review of `app/(app)/results-dashboard/page.tsx`, `components/results-engine/`, and `lib/results/`.
Live testing blocked pending: Supabase project, real Vitall data, Ewa threshold sign-off.

---

## Page-Level Checks

| Check | Result | Notes |
|-------|--------|-------|
| Auth gate present | PASS (partial) | `getCurrentUser()` called; returns `null` if no user — renders blank page. Middleware (`middleware.ts`) likely handles redirect to `/auth/login`. Verify with live Supabase session. |
| `robots: noindex` set | PASS | `robots: { index: false, follow: false }` in metadata |
| Dev fixture bar hidden in production | PASS | `process.env.NODE_ENV !== 'production'` guard |
| Pending state ("no-results") handled | PASS | Shows "Your results are on their way" with 48h message |
| Medical disclaimer in footer | PASS | "Results are for information only and do not constitute medical advice" |
| UKAS accreditation referenced | PASS | In footer disclaimer |
| KitTabs component present | PASS | Renders kit result tabs when data present |

---

## Data Layer

| Check | Result | Notes |
|-------|--------|-------|
| `getDashboardData` called with user ID | PASS | |
| Dev scenario override via `?dev=` param | PASS | `dev` from searchParams passed through |
| Dev fixtures library exists | PASS | 10 scenarios in `lib/results/fixtures/` |
| Classifier exists | PASS | `lib/results/classifier.ts` |
| Normaliser exists | PASS | `lib/results/normaliser.ts` |
| Real Vitall API integration | NOT LIVE | Vitall dispatch route live (`app/api/vitall/dispatch/route.ts`); webhook + full pipeline blocked until lab contract signed |

---

## Results Engine Components

| Component | Exists | Notes |
|-----------|--------|-------|
| KitTabs | PASS | |
| MarkerCard | PASS | |
| StatusBadge | PASS | |
| TrafficLightBar | PASS | |
| ResultConvert | PASS | |
| ResultEducate | PASS | |
| ResultExplain | PASS | |
| ResultRecommend | PASS | |
| ResultValue | PASS | |
| QualifierGate | PASS | |
| DevFixtureBar | PASS | Dev-only |

---

## Compliance Checks (require review of component copy)

| Check | Result | Notes |
|-------|--------|-------|
| "Diagnose" / "diagnosis" not used in result copy | NEEDS CHECK | Cannot verify without reading all MarkerCard copy — audit before Ewa sign-off |
| "Your results indicate..." framing (not "You have...") | NEEDS CHECK | Verify in MarkerCard and ResultExplain components |
| Founding member CTA triggered only by T < 12 nmol/L from Kit 1 or Kit 3 | NEEDS CHECK | Verify in `lib/results/classifier.ts` — Kit 2-only results must not trigger this |
| Collagen CTA gated by hs-CRP elevation AND joint symptoms qualifier | NEEDS CHECK | Verify QualifierGate and ResultRecommend logic |
| Supplement CTAs use only EFSA-approved claim language | NEEDS CHECK | Verify ResultRecommend copy |
| No TRT availability claims | NEEDS CHECK | Founding member CTA copy must say "Be first when we launch" not "Join our TRT programme" |
| Ewa threshold sign-off on all biomarker bands | BLOCKED | Required before any real user data is shown |

---

## Dev Fixture Scenarios Available

These can be triggered with `?dev=<scenario>` in development:

| Scenario | Tests |
|----------|-------|
| `low-testosterone` | Kit 1 low T flow, founding member CTA |
| `low-vitamin-d` | Kit 2 Vit D low, supplement upsell |
| `low-b12` | Kit 2 B12 low, supplement upsell |
| `low-ferritin` | Kit 2 Ferritin low, dietary advice |
| `elevated-crp` | Kit 2 CRP elevated, QualifierGate for collagen |
| `high-crp` | Kit 2 CRP high, GP referral path |
| `multi-deficiency` | Multiple low markers, Complete Stack upsell |
| `normal-testosterone-energy` | Normal T, Daily Stack upsell |
| `normal-testosterone-no-energy` | Normal T, no supplement trigger |
| `optimal-testosterone` | All optimal, retest reminder |

---

## Items Requiring Live Test

- Auth redirect: confirm `/auth/login` fires for unauthenticated users (not blank page)
- Dev fixture bar: renders in development, hidden in production build
- KitTabs: switching between Kit 1, 2, 3 results
- MarkerCard: traffic light bars, status badges, expand/collapse behaviour
- ResultRecommend: supplement CTAs, founding member CTA, retest CTA shown correctly per scenario
- QualifierGate: collagen upsell gated correctly — hs-CRP + joint symptoms required
- Founding member trigger: Kit 2-only results must NOT show the £75 deposit CTA
- Mobile layout at 375px
- Loading states during data fetch

**Blocked by:** Supabase project creation, Vitall webhook integration, Ewa threshold sign-off document.

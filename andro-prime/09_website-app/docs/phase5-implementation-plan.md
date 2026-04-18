# Phase 5 Implementation Plan — Results Dashboard

**Version:** 1.2
**Owner:** Keith Anthony
**Status:** Active
**Date:** April 2026

---

## Context

Phase 4 delivered the full Supabase schema, RLS policies, auth routes, and middleware. The results dashboard placeholder at `app/(app)/results-dashboard/page.tsx` is protected and ready for implementation.

The Thriva API is not yet available. This plan uses a fixture-based approach: all 10 result state scenarios are built as local fixtures so the classifier, data query, and UI can be fully built and tested before a real result is ever received. The normaliser is the only file that knows the Thriva payload shape — when real API access arrives, only that file changes.

**Open questions resolved before this plan was written:**

1. Energy symptoms captured at checkout, tied to the kit order via `symptom_answers.order_id`
2. Barcode registration: user self-registers barcode post-dispatch; webhook handler looks up `order_id` via barcode, then `user_id` via order
3. Active B12 is in Kit 2 and Kit 3 — already in the rule table, already in the Daily Stack formulation
4. Magnesium removed from all panels — not viable for postal testing (confirmed by Thriva, biological instability in transit)
5. Kit 1 now includes Albumin and Free Androgen Index (from Thriva "Advanced testosterone" profile) — Albumin is used for accurate Free T calculation and doubles as a liver/kidney safety flag
6. Founding member status is a standalone route (`app/(app)/founding-member-status/`) — results dashboard shows the CTA, status page is the destination

---

## Architecture

The fixture approach is localised. The dependency chain is:

```
Thriva payload (fixture or real)
    → normaliser.ts        (only Thriva-aware file)
        → classifier.ts    (pure function, no I/O)
            → getDashboardData.ts  (server query + classify)
                → results-dashboard/page.tsx  (server component)
                    → ResultValue, ResultExplain, ResultEducate,
                      ResultRecommend, ResultConvert  (server components)
                    → QualifierGate  (client component → qualifier API route → router.refresh())
```

**Key decisions:**

- Normaliser is the only Thriva-aware file. Everything above it works with `NormalisedBiomarker[]`
- Classifier is a pure function — no async, no I/O, fully testable in isolation
- GP hard blocks enforced at classifier level, not in UI — cannot be bypassed by a component change
- `QualifierGate` posts answer then calls `router.refresh()` — no client state management needed; server re-classifies with the saved answer
- `getDashboardData` owns the no-results state — the page has no conditional logic of its own

---

## File Creation Order

22 files, in strict dependency sequence. Files 14, 15, and the `components/results-engine/` directory already exist as placeholders — read before replacing.

| Order | File | Depends On |
|---|---|---|
| 1 | `lib/results/types.ts` | Nothing |
| 2 | `lib/results/fixtures/fixture-types.ts` | `types.ts` |
| 3 | `lib/results/fixtures/[scenario].ts` × 10 | `fixture-types.ts` |
| 4 | `lib/results/fixtures/registry.ts` | All 10 fixture files |
| 5 | `lib/results/fixtures/index.ts` | `registry.ts`, `fixture-types.ts` |
| 6 | `lib/results/normaliser.ts` | `types.ts` |
| 7 | `lib/results/classifier.ts` | `types.ts` |
| 8 | `lib/results/seed.ts` | `normaliser.ts`, `fixtures/registry.ts`, `lib/supabase/admin.ts` |
| 9 | `lib/results/getDashboardData.ts` | `classifier.ts`, `types.ts`, `lib/supabase/server.ts` |
| 10 | `scripts/seed-result.ts` | `lib/results/seed.ts` |
| 11 | `app/api/dev/seed-result/route.ts` | `lib/results/seed.ts`, `fixtures/registry.ts` |
| 12 | `app/api/webhooks/thriva/route.ts` | `normaliser.ts`, `types.ts`, `lib/supabase/admin.ts` |
| 13 | `app/api/results/qualifier/route.ts` | `lib/auth/session.ts`, `lib/supabase/server.ts` |
| 14 | `styles/components/dashboard-panels.css` | Nothing |
| 15 | `styles/pages/results-dashboard.css` | Nothing |
| 16 | `components/results-engine/ResultValue.tsx` | `types.ts` |
| 17 | `components/results-engine/ResultExplain.tsx` | `types.ts` |
| 18 | `components/results-engine/ResultEducate.tsx` | `types.ts` |
| 19 | `components/results-engine/ResultRecommend.tsx` | `types.ts` |
| 20 | `components/results-engine/ResultConvert.tsx` | `types.ts` |
| 21 | `components/results-engine/QualifierGate.tsx` | `types.ts` |
| 22 | `components/results-engine/index.ts` | All 6 components |
| 23 | `app/(app)/results-dashboard/page.tsx` | `getDashboardData.ts`, all components |

---

## Step 1 — Types Foundation

**File:** `lib/results/types.ts`

Everything else imports from here.

```typescript
export const MARKER_NAMES = {
  TESTOSTERONE: 'Testosterone',
  SHBG: 'SHBG',
  FREE_TESTOSTERONE: 'Free Testosterone',
  ALBUMIN: 'Albumin',
  FREE_ANDROGEN_INDEX: 'Free Androgen Index',
  VITAMIN_D: 'Vitamin D',
  HS_CRP: 'hs-CRP',
  FERRITIN: 'Ferritin',
  ACTIVE_B12: 'Active B12',
} as const

export type MarkerName = typeof MARKER_NAMES[keyof typeof MARKER_NAMES]

export type ScenarioName =
  | 'low-testosterone'
  | 'normal-testosterone-energy'
  | 'normal-testosterone-no-energy'
  | 'optimal-testosterone'
  | 'low-vitamin-d'
  | 'elevated-crp'
  | 'high-crp'
  | 'low-ferritin'
  | 'low-b12'
  | 'multi-deficiency'

export interface ThrivaBiomarker {
  name: string
  value: number
  unit: string
  referenceRange: { low: number | null; high: number | null }
  status: 'optimal' | 'borderline' | 'low' | 'high' | 'critical'
}

export interface ThrivaWebhookPayload {
  orderId: string
  userId: string
  kitType: 'testosterone-health' | 'energy-recovery' | 'hormone-recovery'
  collectedAt: string
  biomarkers: ThrivaBiomarker[]
  signature?: string
}

export interface NormalisedBiomarker {
  markerName: string
  value: number
  unit: string
  referenceLow: number | null
  referenceHigh: number | null
}

export type ResultState =
  | 'low-testosterone'
  | 'normal-testosterone'
  | 'optimal-testosterone'
  | 'low-vitamin-d'
  | 'elevated-crp'
  | 'high-crp'
  | 'low-ferritin'
  | 'low-b12'
  | 'low-albumin'
  | 'normal'

export type CtaType =
  | 'founding-member-deposit'
  | 'daily-stack-zinc'
  | 'daily-stack-d3'
  | 'daily-stack-b12'
  | 'complete-mens-stack'
  | 'collagen'
  | 'lifestyle-guidance'
  | 'kit-2-cross-sell'
  | 'kit-1-cross-sell'
  | 'retest-reminder'
  | 'gp-referral'

export interface Cta {
  type: CtaType
  label: string
  href: string
}

export type RecommendationStrategy = 'single' | 'multi-deficiency'

export interface ClassifiedResult {
  markerName: string
  value: number
  unit: string
  referenceLow: number | null
  referenceHigh: number | null
  state: ResultState
  stateLabel: string
  explanation: string
  educationContext: string
  recommendationStrategy: RecommendationStrategy
  primaryCta: Cta | null
  secondaryCta: Cta | null
  requiresQualifier: boolean
  qualifierKey: string | null
}

export type DashboardData =
  | { state: 'no-results' }
  | {
      state: 'ready'
      resultId: string
      markers: ClassifiedResult[]
      hasQualifierPending: boolean
      userAge: number | null
    }
```

---

## Step 2 — Fixture Layer

**Directory:** `lib/results/fixtures/`

### `fixture-types.ts`

```typescript
import type { ThrivaWebhookPayload, ScenarioName } from '../types'

export interface SymptomAnswerFixture {
  questionKey: string
  answer: boolean | string | number
}

export interface ScenarioFixture {
  name: ScenarioName
  label: string
  testAge: number
  payload: ThrivaWebhookPayload
  symptomAnswers: SymptomAnswerFixture[]
}
```

### `registry.ts`

Imports all 11 scenario files and exports a `SCENARIOS` map keyed by `ScenarioName`. The seed script and dev route both import from here.

### Fixture files — one per scenario

Each is a default export of type `ScenarioFixture`. `orderId` and `userId` in the payload are placeholder strings (`'fixture-order-id'`, `'fixture-user-id'`) — the seed script replaces them with real UUIDs before inserting.

| File | Key values |
|---|---|
| `low-testosterone.ts` | Testosterone 9.5 nmol/L, testAge: 42 |
| `normal-testosterone-energy.ts` | Testosterone 16.0 nmol/L, symptomAnswers: `[{ questionKey: 'energy_symptoms', answer: true }]`, testAge: 42 |
| `normal-testosterone-no-energy.ts` | Testosterone 16.0 nmol/L, symptomAnswers: `[]`, testAge: 38 |
| `optimal-testosterone.ts` | Testosterone 24.0 nmol/L, testAge: 38 |
| `low-vitamin-d.ts` | Vitamin D 30 nmol/L, testAge: 42 |
| `elevated-crp.ts` | hs-CRP 4.5 mg/L, symptomAnswers: `[]`, testAge: 38 |
| `high-crp.ts` | hs-CRP 12.0 mg/L, testAge: 38 |
| `low-ferritin.ts` | Ferritin 22 ug/L, testAge: 38 |
| `low-b12.ts` | Active B12 30 pmol/L, testAge: 38 |
| `multi-deficiency.ts` | Vitamin D 30 nmol/L + Active B12 30 pmol/L + Testosterone 16.0 nmol/L, testAge: 42 |

---

## Step 3 — Normaliser

**File:** `lib/results/normaliser.ts`

```typescript
import type { ThrivaWebhookPayload, NormalisedBiomarker } from './types'

const EXPECTED_UNITS: Record<string, string> = {
  Testosterone: 'nmol/L',
  SHBG: 'nmol/L',
  'Free Testosterone': 'nmol/L',
  Albumin: 'g/L',
  'Free Androgen Index': '%',
  'Vitamin D': 'nmol/L',
  'hs-CRP': 'mg/L',
  Ferritin: 'ug/L',
  'Active B12': 'pmol/L',
}

export function normalise(payload: ThrivaWebhookPayload): NormalisedBiomarker[] {
  return payload.biomarkers.map((b) => {
    const expected = EXPECTED_UNITS[b.name]
    if (expected && b.unit !== expected) {
      throw new Error(
        `Unit mismatch for ${b.name}: expected ${expected}, got ${b.unit}`
      )
    }
    return {
      markerName: b.name,
      value: b.value,
      unit: b.unit,
      referenceLow: b.referenceRange.low,
      referenceHigh: b.referenceRange.high,
    }
  })
}
```

Field mapping plus unit assertion — no classification logic. This is the only Thriva-aware file in the codebase. The unit assertion is load-bearing: all classifier thresholds assume the units in `EXPECTED_UNITS` and will silently mis-classify (e.g. US ng/dL testosterone values) if Thriva ever ships a different unit. Throwing here fails the webhook loudly.

---

## Step 4 — Classifier

**File:** `lib/results/classifier.ts`

Pure function — no async, no I/O.

```typescript
export interface ClassifierInput {
  kitType: 'testosterone-health' | 'energy-recovery' | 'hormone-recovery'
  biomarkers: NormalisedBiomarker[]
  symptomAnswers: Array<{ questionKey: string; answer: unknown }>
  qualifierResponses: Array<{ questionKey: string; answer: unknown }>
  userAge: number | null
}

export function classify(input: ClassifierInput): ClassifiedResult[]
```

`kitType` is required — several cross-sell rules fire only for specific kits (Kit 1 normal-T → Kit 2 cross-sell must not trigger when a Kit 3 user has the same result, since Kit 3 already tested Kit 2 markers).

### Three internal passes

**Pass 1 — Resolve state by threshold:**

| Condition | State |
|---|---|
| Testosterone < 12 nmol/L | `low-testosterone` |
| Testosterone 12–20 nmol/L | `normal-testosterone` |
| Testosterone > 20 nmol/L | `optimal-testosterone` |
| Albumin < 35 g/L | `low-albumin` |
| Vitamin D < 50 nmol/L | `low-vitamin-d` |
| hs-CRP > 10 mg/L | `high-crp` |
| hs-CRP 1–10 mg/L | `elevated-crp` |
| Ferritin < 30 ug/L | `low-ferritin` |
| Active B12 < 37.5 pmol/L | `low-b12` |
| Otherwise | `normal` |

**Note on Albumin:** Albumin's primary role in this panel is as an input to the Free T calculation, not as a standalone diagnostic marker. However, very low albumin (< 35 g/L) can indicate liver or kidney issues and must trigger a GP referral. The classifier treats `low-albumin` as a GP hard block — same as `high-crp` and `low-ferritin`.

**Note on SHBG and Free Androgen Index:** These are calculation inputs and derived values respectively. They do not have independent threshold states in the classifier. SHBG and Albumin feed the Free T calculation; Free Androgen Index is displayed as additional context on the dashboard but does not drive CTA logic independently.

**Pass 2 — Deficiency count:**

Count markers in any non-normal, non-optimal-testosterone, non-GP-block state. If count >= 2, set `recommendationStrategy = 'multi-deficiency'` on every affected marker — but keep each marker's `state`, `stateLabel`, `explanation`, and `educationContext` marker-specific. `state` reflects what the marker shows; `recommendationStrategy` drives CTA resolution. This keeps each panel's copy accurate while still routing to the Complete Men's Stack CTA.

**Pass 3 — Resolve CTAs:**

A `resolveCtas` helper takes `(state, recommendationStrategy, biomarkers, input)` and returns `{ primaryCta, secondaryCta }`. When `recommendationStrategy === 'multi-deficiency'`, primary CTA is Complete Men's Stack; GP-block states still override (hard blocks beat multi-deficiency).

**GP hard blocks — must return before any supplement CTA logic:**

```typescript
if (state === 'high-crp' || state === 'low-ferritin' || state === 'low-albumin') {
  return {
    primaryCta: { type: 'gp-referral', label: 'Speak to your GP', href: '/gp-referral' },
    secondaryCta: null,
  }
}
```

**hs-CRP qualifier gate:**

```typescript
if (state === 'elevated-crp') {
  const jointAnswer = qualifierResponses.find(r => r.questionKey === 'crp_joint_symptoms')
  if (!jointAnswer) return { requiresQualifier: true, qualifierKey: 'crp_joint_symptoms', primaryCta: null, secondaryCta: null }
  return jointAnswer.answer === true
    ? { primaryCta: collagenCta, secondaryCta: null }
    : { primaryCta: lifestyleCta, secondaryCta: null }
}
```

**Low-testosterone CTA pairing:**

```typescript
// T < 12 → founding member primary, Daily Stack (zinc) secondary
// Per CLAUDE.md Daily Stack row: "secondary CTA for T < 12 (founding member) — honest framing only"
if (state === 'low-testosterone') {
  return {
    primaryCta: foundingMemberCta,
    secondaryCta: dailyStackZincCta,
  }
}
```

**Cross-sell logic (kit-gated):**

```typescript
// Kit 1 normal T + energy symptoms → Kit 2 cross-sell
// Only fires for Kit 1 — Kit 3 already tested Kit 2 markers
if (state === 'normal-testosterone' && kitType === 'testosterone-health') {
  const hasEnergySymptoms = symptomAnswers.some(
    a => a.questionKey === 'energy_symptoms' && a.answer === true
  )
  return {
    primaryCta: dailyStackZincCta,
    secondaryCta: hasEnergySymptoms ? kit2CrossSellCta : null,
  }
}

// Kit 3 normal T → Daily Stack only (no cross-sell, Kit 2 markers already on-panel)
if (state === 'normal-testosterone' && kitType === 'hormone-recovery') {
  return { primaryCta: dailyStackZincCta, secondaryCta: null }
}
```

Kit 2 + 2+ deficiencies → Kit 1 cross-sell and Kit 2 + single deficiency + age 40+ → Kit 1 cross-sell are both resolved in the multi-deficiency pass, gated on `kitType === 'energy-recovery'`.

### Copy constant

All `stateLabel`, `explanation`, and `educationContext` strings live in a `COPY` constant at the top of the file — never inline. All `stateLabel` strings follow the rule: "Your results indicate..." — never "You have...".

---

## Step 5 — Dashboard Data Query

**File:** `lib/results/getDashboardData.ts`

Server-only async function. Uses `createSupabaseServerClient` (anon client with session — RLS enforced).

```typescript
export async function getDashboardData(userId: string): Promise<DashboardData>
```

Fetch sequence:

1. Latest `lab_results` row for user (order by `received_at DESC`) — select `id`, `order_id`, `kit_type`
2. If none → return `{ state: 'no-results' }`
3. All `biomarker_values` for `result.id`
4. `symptom_answers` for user + `result.order_id` (derived from step 1)
5. `qualifier_responses` for user + `result.id`
6. `users.age` for user
7. Call `classify({ kitType: result.kit_type, biomarkers, symptomAnswers, qualifierResponses, userAge })`
8. Return `{ state: 'ready', resultId, markers, hasQualifierPending, userAge }`

`hasQualifierPending` is `markers.some(m => m.requiresQualifier)`.

---

## Step 6 — Seed Logic

**File:** `lib/results/seed.ts`

Uses `createSupabaseAdminClient` (service role — bypasses RLS). This module is imported by both the CLI script and the dev API route so the logic is not duplicated.

```typescript
export interface SeedResult {
  userId: string
  orderId: string
  resultId: string
  biomarkerIds: string[]
  symptomAnswerIds: string[]
}

export async function seedScenario(scenarioName: ScenarioName): Promise<SeedResult>
```

Seed sequence:

1. Look up scenario from `SCENARIOS` registry
2. Create/upsert test user via `supabase.auth.admin.createUser()` — email: `dev+{scenarioName}@androprime.test`, deterministic per scenario. Verify Supabase auth project config accepts the `.test` TLD; if not, fall back to a configured dev domain
3. Upsert `users` table row with `testAge` from the fixture
4. Insert `kit_orders` row (with `kit_type` derived from the fixture's payload) — get `orderId`
5. Replace fixture placeholder IDs with real `orderId`/`userId`
6. Insert `lab_results` row with `raw_payload` = full fixture JSON — get `resultId`
7. Call `normalise(payload)` and insert `biomarker_values` rows
8. Insert `symptom_answers` rows from `fixture.symptomAnswers`
9. Return `SeedResult`

**Package.json additions:**

- Add `"tsx": "^4.0.0"` to `devDependencies`
- Add `"db:seed": "tsx scripts/seed-result.ts"` to `scripts`

---

## Step 7 — Seed CLI Script

**File:** `scripts/seed-result.ts`

Thin wrapper around `seedScenario`. Usage: `npx tsx scripts/seed-result.ts low-testosterone`

Validates that the scenario name is a key in `SCENARIOS` before calling. Exits with code 0 on success, 1 on failure.

---

## Step 8 — Dev Trigger Route

**File:** `app/api/dev/seed-result/route.ts`

GET endpoint. Returns 403 in production. Accepts `?scenario=low-testosterone`. If the scenario is invalid, returns 400 with a list of valid keys. On success, returns the `SeedResult` as JSON.

Lets you switch between all 11 result state scenarios in the browser without touching the database manually during development.

---

## Step 9 — Thriva Webhook Handler

**File:** `app/api/webhooks/thriva/route.ts`

POST. Admin client (bypasses RLS for ingest).

Sequence:

1. Parse body as `ThrivaWebhookPayload`
2. Log `x-thriva-signature` header — signature verification stubbed with a TODO comment
3. Insert `lab_results` row
4. Call `normalise(payload)` and insert `biomarker_values` rows
5. Return 202 Accepted

Returns 202 not 200 — classification and rendering happen when the user views the dashboard, not at ingest time.

**Blocking for real-API cutover:** the stubbed signature check must be replaced with HMAC verification against Thriva's shared secret *before* the webhook URL is handed to Thriva. An unsigned endpoint lets anyone forge lab results for any `userId` in the payload — catastrophic. Track this as a Phase 5 exit criterion, not a follow-up TODO.

---

## Step 10 — Qualifier API Route

**File:** `app/api/results/qualifier/route.ts`

POST. Authenticated — uses `requireAuthenticatedApiUser`.

Body: `{ resultId: string, questionKey: string, answer: boolean | string | number }`

Upserts into `qualifier_responses` with `onConflict: 'result_id,question_key'` — the table has a `unique (result_id, question_key)` constraint, so a straight INSERT fails when the user changes their answer. Returns 201 on success (200 on update). The `QualifierGate` component calls this then triggers `router.refresh()` to re-run the server component.

---

## Step 11 — Results Engine Components

**Directory:** `components/results-engine/` (already exists — check for placeholder content before creating, update in place if present).

All server components except `QualifierGate`.

### `ResultValue.tsx`

Props: `{ value, unit, state, referenceLow, referenceHigh }`

Renders the numeric value with unit and a status indicator. State maps to colour via Tailwind tokens — not inline styles. Reference range renders as a small data-label below the value.

### `ResultExplain.tsx`

Props: `{ stateLabel, explanation }`

Renders `stateLabel` as `<h3>` and `explanation` as `<p>` with `font-serif`. Owns no copy — copy comes from `ClassifiedResult`.

### `ResultEducate.tsx`

Props: `{ educationContext, markerName }`

Renders in an inset panel (`bg-stone-50 border-l-4 border-black`). No product names, no sales language. Never receives a CTA prop — constraint is architectural.

### `ResultRecommend.tsx`

Props: `{ primaryCta, secondaryCta, state, recommendationStrategy }`

Renders the "next step" heading and plain-language description of what the CTA does. For `gp-referral` CTA type: "We recommend speaking to your GP before considering any supplementation." — no product mention. For `recommendationStrategy === 'multi-deficiency'`: copy frames the Complete Men's Stack as covering multiple low markers at once. For null CTAs: retest reminder copy.

### `ResultConvert.tsx`

Props: `{ primaryCta, secondaryCta }`

Renders the actual anchor buttons using the established button pattern from the Nav. GP referral CTA uses a bordered (not filled) button — visually distinct from the primary black button. Renders nothing when both CTAs are null.

### `QualifierGate.tsx`

`'use client'`

Props: `{ resultId, questionKey, question }`

Yes/No question card. On selection:
1. POST to `/api/results/qualifier`
2. On success: call `router.refresh()`
3. While pending: `opacity-50 pointer-events-none` on the form
4. On error: inline error text

No local state persists after refresh — server re-classifies with the saved answer.

---

## Step 12 — Dashboard Page

**File:** `app/(app)/results-dashboard/page.tsx`

Replaces the placeholder. Server component — no `'use client'`.

```typescript
export const metadata = {
  title: 'Your Results',
  robots: { index: false, follow: false },
}
```

Structure:
1. Call `getCurrentUser()` — user guaranteed by layout, but narrow the type
2. Call `getDashboardData(user.id)`
3. If `state === 'no-results'`: render styled holding state ("Your results are on their way")
4. If `state === 'ready'`: map `markers` to a panel per marker
   - Each panel: `ResultValue` → `ResultExplain` → `ResultEducate` → (QualifierGate if `requiresQualifier`) → `ResultRecommend` → `ResultConvert`

---

## Step 13 — Styles

Both files below already exist as placeholders. Read first, then replace their contents.

### `styles/components/dashboard-panels.css`

```css
.results-panel { @apply border-4 border-black bg-white mb-8; }
.results-panel__header { @apply border-b-4 border-black bg-black px-8 py-6 text-white; }
.results-panel__body { @apply px-8 py-8 grid gap-8; }
.results-panel__section { @apply border-t-2 border-black pt-6 first:border-t-0 first:pt-0; }
.status-indicator--optimal { color: var(--color-status-optimal); }
.status-indicator--warning { color: var(--color-status-warning); }
.status-indicator--low { color: var(--color-black); }
.status-indicator--gp-block { color: var(--color-black); }
```

### `styles/pages/results-dashboard.css`

```css
.results-dashboard { @apply bg-stone-100 px-6 py-12; }
.results-dashboard__inner { @apply mx-auto max-w-5xl; }
.results-holding { @apply border-4 border-black bg-white px-8 py-16 text-center; }
```

---

## Rule Enforcement Summary

| Rule | Enforced where |
|---|---|
| GP hard blocks — no supplement CTA for hs-CRP > 10, Ferritin < 30, or Albumin < 35 | Classifier — returns before supplement CTA logic, including over multi-deficiency |
| Collagen CTA only after joint symptom qualifier confirmed | Classifier — reads `qualifier_responses` before resolving CTA |
| Founding member CTA only on T < 12 (Kit 1 or Kit 3) | Classifier — `state === 'low-testosterone'` only; never triggered by Kit 2 markers |
| Kit 2 cross-sell never fires on Kit 3 results | Classifier — cross-sell gated on `kitType === 'testosterone-health'` |
| Unit mismatch fails loudly | `normalise()` — throws on any marker whose unit deviates from `EXPECTED_UNITS` |
| Qualifier answer changes persist correctly | Qualifier API — UPSERT on `(result_id, question_key)` |
| "Your results indicate..." — never "You have..." | `COPY` constant in classifier — auditable in one place |
| Results pages never indexed | `metadata.robots` in dashboard page |
| Dev seed route never available in production | `NODE_ENV` check in route handler |
| Thriva webhook cannot be forged before go-live | HMAC signature verification replaces the stub **before** handing the URL to Thriva |

---

## Deliverables

- All 10 scenarios seedable via CLI and dev route
- Classifier correctly routes every result state to the right CTA — verified against each scenario
- QualifierGate saves and re-classifies correctly for hs-CRP 1-10
- GP referral states never show a supplement CTA
- Dashboard page renders no-results holding state and the full 5-part panel layout
- Webhook handler accepts a Thriva-shaped payload and inserts correctly

Phase 5 is complete when every scenario can be seeded, viewed in the dashboard, and the correct CTA is rendered with no exceptions.

---

## Changelog

| Date | Change |
|---|---|
| April 2026 (v1.1) | Original plan |
| April 2026 (v1.2) | Magnesium removed from all panels (not viable for postal testing, confirmed by Thriva). Active B12 added to Kit 2 and Kit 3. Kit 1 expanded to include Albumin and Free Androgen Index (Thriva "Advanced testosterone" profile). Low-albumin added as GP hard block. Scenario count reduced from 11 to 10. File count reduced from 23 to 22. |

# Results & process pages — brand-conformance remediation spec

**Date:** 2026-06-12 · **Owner:** Keith Antony · **Status:** PLAN ONLY — no code changed yet
**Trigger:** Audit of the post-purchase journey (kit-return → awaiting-results → results-ready) against `02_brand/brand-guidelines.md` V2.0 + `visual-identity.md`.

---

## 1. Audit result in one line

The **process / awaiting-results pages are on-brand.** The drift is concentrated in the **results-ready dashboard view + MarkerCard**, which reintroduce the V1 "dark cockpit" aesthetic that V2.0 explicitly retired (§1, §11). Plus three systemic app-layer issues: a CSS-level decision to allow animation, off-palette warm grays, and dead/contradictory legacy CSS.

---

## 2. Surface-by-surface verdict

| Surface | File | Verdict |
| ------- | ---- | ------- |
| Order confirmed | `app/(marketing)/order/confirmed/page.tsx` | ✅ On-brand |
| Subscription confirmed | `app/(marketing)/subscription/confirmed/page.tsx` | ✅ On-brand |
| Dashboard State A (pre-results) | `app/(app)/results-dashboard/page.tsx` L264-310 | ✅ On-brand |
| Dashboard State A0 (sample failed) | same, L229-262 | ✅ On-brand |
| Account | `app/(app)/account/page.tsx` + `account.css` | ✅ structure on-brand; ⚠️ warm grays (issue #2) |
| Subscriptions | `app/(app)/subscriptions/page.tsx` | ✅ On-brand |
| StatusBadge / ResultConvert / ResultRecommend / TrafficLightBar / KitTabs header | `components/results-engine/*` | ✅ On-brand (B&W + sanctioned status colour only) |
| **Dashboard State B (results ready)** | `results-dashboard/page.tsx` L312-390 | ❌ **Off-brand chrome** |
| **MarkerCard** | `components/results-engine/MarkerCard.tsx` | ❌ **Off-brand hover/motion** |

---

## 3. The off-brand findings (what changes)

### 3a. Results-ready view — `results-dashboard/page.tsx`, State B

| # | Lines | Current | Brand rule | Fix |
| - | ----- | ------- | ---------- | --- |
| 1 | 318-331 | `animate-marquee` scrolling ticker: `/// SEC: AES-256`, `ANALYSIS COMPLETE`, `BIOMARKERS PROCESSED` | §10 "no decorative noise"; §11 cockpit retired | Replace with a **static** top strip: `Report generated` / `Analysis complete` / `N biomarkers processed`. No scroll. |
| 2 | 341 | `<span class="...animate-pulse" />` status dot | §8.3 "No pulse animation. Static only." | Direction A: static square. Direction B: keep this one pulsing dot (the single sanctioned cue). |
| 3 | 357-362 | `animate-spin-slow` decorative gauge SVG | §10 decorative noise | Replace with the static **AP mark** (uses `Logo.tsx`) or drop. |
| 4 | 384 | Footer `SYS.STAT: ONLINE` / `SEC: AES-256` | Cockpit tone, §1/§11 | Replace with a plain trust line: `UKAS ISO 15189 accredited lab`. |
| 5 | 368 | Right panel `bg-gray-100` full background | §12.1 "everything is light / white default" | `bg-white` (cards already self-delineate with `border-b-4`). |

### 3b. MarkerCard — `components/results-engine/MarkerCard.tsx`

| # | Lines | Current | Brand rule | Fix |
| - | ----- | ------- | ---------- | --- |
| 6 | 35 | `hover:bg-black hover:text-white transition-all duration-500` (full-card inversion) | §6.1 "Hover: subtle gray-50 fill only. No lift, no shadow." | `hover:bg-gray-50` + `transition-colors duration-200`. Drop the colour inversion. |
| 7 | 37-47 | Grid-pattern SVG fade-in on hover (`group-hover:opacity-10`) | §10 decorative noise | Remove the overlay block entirely. |
| 8 | 63 | `group-hover:scale-105` on the value number | §6.1 "no lift" | Remove. |
| 9 | 97, 109 | `group-hover:-translate-y-1` / `translate-y-1` block shifts | §6.1 "no lift" | Remove. |
| 10 | 98, 110, 128, 136, 163 | `group-hover:border-white` / `group-hover:bg-black` etc. — all exist only to support the inversion | n/a once inversion is gone | Remove the `group-hover:*` colour swaps; keep static black borders. |
| — | 138, 141, 104, 118 | `group-hover:text-white` / `group-hover:text-gray-300` body text | n/a once inversion is gone | Revert to static `text-gray-800` / black. |

> Net effect on MarkerCard: it keeps its strong resting layout (big number, traffic-light bar, two-column explain, recommend footer) — only the dramatic hover theatre is removed. The resting state is already on-brand.

---

## 4. Systemic issues (decide once, apply app-wide)

### Issue #1 — CSS deliberately re-permits the banned pulse (NEEDS KEITH DECISION)

`styles/themes/app-theme.css` L1-9 + L43-48 state *"Animation (statusPulse) is active in the app context"* and ship a pulsing `.live-dot`. This **contradicts** brand §8.3 ("No pulse animation… Static only"). It is a deliberate exception, not a bug — so the doc and the code currently disagree on the record.

**Two mockups produced to decide this** (open in a browser, side by side):
- `docs/mockups/results-ready-A-static.html` — fully static. Honours §8.3 literally.
- `docs/mockups/results-ready-B-motion.html` — one pulsing "live" dot + a single one-shot content rise-in on load; respects `prefers-reduced-motion`. Everything else still static.

**Resolution required:** pick A or B. Then **make the brand doc and the code agree:**
- If **A**: delete `.live-dot` animation + the "animation is active" claim from `app-theme.css`; remove `animate-pulse`/`animate-spin-slow`/`animate-marquee` usages.
- If **B**: add an explicit §8.3 carve-out to `brand-guidelines.md` ("the authenticated results dashboard MAY use a single restrained live cue + a one-shot load reveal; marketing surfaces remain static"), and keep only that sanctioned set in code (kill marquee + spinner + scale/translate regardless).

### Issue #2 — Off-palette warm grays in the app stylesheets

The app uses `stone-50/100/200` (warm) where the palette defines **cool** grays (`gray-50 #f9fafb`, `gray-100 #f3f4f6`, `gray-200 #e5e7eb`, §3.2). The authenticated app therefore reads subtly warmer than the marketing site.

Occurrences to swap `stone-*` → brand `gray-*`:
- `styles/pages/account.css` L1, L5, L8, L10 (`bg-stone-100`, `border-stone-200`)
- `styles/pages/results-dashboard.css` L1 (`bg-stone-100`)
- `styles/components/dashboard-panels.css` L70 (`.kit-tab:hover bg-stone-200`), L92 (`bg-stone-50`), L133 (`bg-stone-100`), L176 (`text-stone-400`)
- `MarkerCard.tsx` footer `bg-gray-50` is already correct — leave.

(`dev-fixture-bar bg-yellow-50` is dev-only, never shipped to users — leave.)

### Issue #3 — Dead / contradictory legacy CSS in `dashboard-panels.css`

These classes are **not used** by the live components and contradict brand if revived:
- L6-10 `.results-panel*` — "legacy panel", unused.
- L21-38 `.status-badge--optimal/warning` — **tinted** badge backgrounds (`#ecfdf5` green, `#fffbeb` amber). The live `StatusBadge.tsx` is pure B&W. The tinted versions break §3.2/§3.3.
- L142-186 `.marker-card*` — an entire **accordion** MarkerCard (summary/chevron/detail) the current always-expanded `MarkerCard.tsx` doesn't use.

**Fix:** delete the unused blocks (confirm zero references first via grep). Removes the risk of someone reviving off-brand tinted badges or the warm-gray accordion.

---

## 5. Minor nits (optional, low priority)

- `order/confirmed` + `subscription/confirmed` ghost numbers use `text-gray-200`; §8.4 specifies `gray-100 #F3F4F6`. Cosmetic.
- `results-dashboard.css` `.results-holding` / `__inner` classes are only used by the no-results state; fine, but consolidate if touching the file.

---

## 6. Proposed execution order (once direction picked)

1. **Keith picks A or B** from the two mockups → resolves Issue #1.
2. Reconcile `brand-guidelines.md` §8.3 + `app-theme.css` to match the choice.
3. Edit `results-dashboard/page.tsx` State B (findings 1-5).
4. Edit `MarkerCard.tsx` (findings 6-10).
5. Palette sweep `stone-*` → `gray-*` (Issue #2).
6. Delete dead CSS in `dashboard-panels.css` (Issue #3).
7. `next build` + smoke-test `/results-dashboard?dev=...` fixtures across states (per the agent-E2E rule — `tsc` alone is not enough).

No customer-facing copy changes here, so no Ewa sign-off gate is triggered; this is purely visual-system conformance.

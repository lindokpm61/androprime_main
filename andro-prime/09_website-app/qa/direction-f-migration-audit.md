# QA: Direction F pre-migration audit

**Status: IN PROGRESS — session 1, 2026-09-14.** Phases 0 to 4 done, 5 partly. The
remaining phases are listed at the bottom with what each needs.

Branch `redesign/direction-f` at `1a14ffc`, measured against production
`origin/main` at `7ecad99`. **163 commits / 452 files ahead of production.**

Plan: `~/.claude/plans/we-need-to-run-parsed-oasis.md`. Full evidence logs are in the
session scratchpad and are not committed (git holds the recipe, Drive holds the media).

---

## Go / no-go

**NO-GO, and nothing found in this audit is why.** The three blockers are the ones that
were already on the board before it started, and all three are signatures rather than
defects:

| # | Blocker | Owner | Where |
|---|---|---|---|
| 1 | **CA-045** homepage + `/kits` imagery: 10 items, 8 questions. Packet is an unsent Gmail DRAFT and is stale (written for 9 items; the hero data field now renders on 5 surfaces, not 1). | Keith to send, Ewa + Keith to sign | ClickUp `869eur84c` |
| 2 | **CA-046** `/demo`: a full results report, a membership price and ~2 dozen un-pre-flighted prototype strings on an ungated surface. | Ewa | ClickUp `869exuphq` |
| 3 | **Copy register reconciliation.** 48 open rows, Closed section still `_None yet._`. 16 rows marked "Yes" need sign-off; 21 placement-only rows need a look. | Keith, then pre-flight | `redesign-copy-register.md` |

Zero traffic does not soften CA-045: the gate governs SHIPPING, and a page is live
whether or not anyone visits it.

**The technical side is in good shape.** Every gate that can pass, passes. Three defects
that would have shipped were found and fixed, one of which would have failed CI on the
merge commit itself.

---

## What passed

| Gate | Result |
|---|---|
| `npm run typecheck` / `typecheck:scripts` | exit 0 |
| `npm test` — 13 design checkers + 24 unit suites | exit 0 |
| `npm run test:engine` — 13 content-engine suites | exit 0 after the CI fix below |
| `npm run build` | exit 0, twice |
| `verify-http-contract.ts` (new) | **31 assertions**, exit 0 |
| `audit-viewport-sweep.js` (new) | **144 of 150 cells**: zero overflow, zero sub-AA light-ground text |
| `audit-dark-contrast.js` | 0 failing nodes over 16 routes at 1440px |
| `audit-runtime-errors.js` (new) | 46 of 48 routes clean |
| `audit-link-integrity.js` (new) | 864 anchors, 84 internal targets, 108 fragments; 1 open finding |
| `compliance-preflight/scan.js` over 165 changed copy files | no NEW claim exposure |
| `route-conformance` | 36/36 measurable routes render Direction F |

Routes not measured are named with a reason everywhere: `/blog/preview/[slug]` (needs
`PREVIEW_SECRET`) and `/membership` (needs `MEMBERSHIP_ENABLED=true`). Both 404 by design.

---

## Defects found and fixed

### P1-1 The merge commit would have failed CI
`.github/workflows/content-engine-ci.yml` fires on push to `main` when
`frontend/scripts/content-engine/**` or `package.json` change — the branch changes both.
Its first suite, `test-content-doctor.ts`, failed on two lines the branch itself added to
`compliance-preflight/SKILL.md`: the verdict scanner *describing its own input*. Added to
the guard's `ALLOWED` map with reasons, which is the remedy the guard's own message
prescribes. Proved still live by removing an entry and watching it fail again.

### P1-2 "Back to site" on every auth page returned you to the auth page
`AuthCard.tsx` used a relative `/`. The auth tree is served on `app.andro-prime.com`, so
that resolved to the app origin, which 307s to `/results-dashboard`, which is protected,
which bounces an unauthenticated visitor back to `/auth/login`. Now `urlFor('/')` rendered
as a plain `<a>` — `hrefFor`'s own header already said a cross-host link must never be a
`next/link`.

### P1-3 The skip link pointed at nothing on all five auth pages
`SkipToContent` is in the root layout so it is on every page, targeting `#main-content`.
Every layout renders one except `app/auth/layout.tsx`, added 2026-09-08, which shipped a
bare `<div>`. WCAG 2.4.1 bypass-blocks failure with no `main` landmark at all. Invisible
to tsc, the build, the class checker and a screenshot. Now `<main id="main-content">`;
`.f-page` carries no element-qualified selector, so no pixels moved.

### P2 — checker defects, all fixed
- `verify-design-tokens.js` reported CSS line numbers **669 lines out** (comment newlines
  destroyed before counting). Verified surgical: only the two numbers changed.
- `audit-keyword-coverage.js` invented a cross-article overlap out of an `undefined` key.
- **`304 Not Modified` broke four separate checkers** — two written this session, two
  long-committed. Root-cause fix: `setCacheEnabled(false)` in every browser checker, which
  is what `shot.js` has always done. See observation 811.
- `compliance-preflight` did not recognise `don&rsquo;t` as a negation, only `don't` and
  `don’t` — so it graded the Footer's own medical disclaimer as HARD and would have gated
  publish on it. `APOS` was a character class and an entity is six characters; now an
  alternation, exported, with 6 positive and 2 adversarial cases added to
  `test-curly-negation.js`.

---

## Open, needing a decision

### The site logo does not go home on the app host
Same cause as P1-2 but in the shared chrome. On `/order/confirmed` and
`/subscription/confirmed` — the only two `(marketing)` pages served on the app host — the
logo resolves to the app origin and 307s to `/results-dashboard`. Worse than an extra hop:
every marketing `next/link` on those pages emits a cross-origin RSC prefetch that fails,
**39 failed requests per page load**. Next falls back to full navigation, so clicks work.

Not fixed here because the obvious repair (`hrefFor` with the current host) makes the
component dynamic, and `app/(marketing)/layout.tsx` is deliberately non-async to preserve
the static prerender across the whole marketing surface. De-optimising 20+ pages to repair
two is a trade someone should make on purpose.

Options: (a) accept it; (b) give those two pages their own chrome; (c) absolute
`urlFor('/')` plain `<a>` site-wide, losing client-side navigation on the logo only.

### Pre-existing claim exposure, live today
Unapproved ingredient claims, unchanged by this branch, so not merge blockers — but the
EFSA table says do not rephrase, extend or imply beyond the approved wording:
- `/faq` — "Vitamin D and Active B12 ... **both of which support recovery processes**"
- `/supplements/collagen` — "**UC-II for joint-specific support**" (UC-II has no approved
  claim at all)
- `/lp/collagen` — "the collagen that **supports** your joints, tendons, and skin"

Every other EFSA claim string on the branch matches the approved wording exactly.

### Two published articles do not contain their own primary query
`brain-fog` declares `brain fog causes`, which appears only in its own frontmatter.
`andropause-male-menopause` declares `andropause / male menopause`, a label no page could
contain. Pre-existing; `audit-keyword-coverage.js` is in no gate. The first needs a copy
decision, the second only a corrected declaration.

### `verify-scroll-reveal.js` stalls against a production build
Times out on `/blog`, which renders third-party Unsplash photos, because the script waits
for `networkidle0` — unreachable while a third-party image is outstanding. Both `main` and
the branch use Unsplash, so this is a `networkidle0` incompatibility rather than a branch
regression. It blocks the `test:design:live` chain at link 2. Fix is `networkidle2` or
blocking third-party requests as the new checkers do.

---

## New tooling

Six files, house style, no framework added. Wired into `package.json` as
`test:design:live`, `test:design:sweep`, `test:links:external` and `test:design:premerge`.

| File | Closes |
|---|---|
| `scripts/verify-http-contract.ts` | sitemap, robots, redirects and static surfaces over real HTTP. Computes expectations from `routeDecision()` rather than typing them. Self-tests bail at exit 2 if the Host header is dropped or an unknown path does not 404 — without those the app-host half passes vacuously. |
| `scripts/redirect-contract.js` | every deliberate redirect in one table; config half parsed from `next.config.ts`, host half computed from `lib/hosts.ts`. A config redirect with no row is a hard failure. |
| `scripts/audit-link-integrity.js` | harvests every anchor from the real DOM — a third of this site's hrefs are template literals a grep cannot resolve — and resolves them over HTTP. Fragments checked against each target's real id set. |
| `scripts/audit-runtime-errors.js` | per-route console errors, page errors, failed first-party requests, dialogs. Positive control plants a defect and exits 2 if it cannot see it. |
| `scripts/audit-viewport-sweep.js` | 50 routes x 390/768/1320: overflow plus light-ground contrast, the sweep `audit-dark-contrast.js` said was separate and nobody built. |
| `scripts/page-walk.js`, `scripts/contrast-probe.js` | shared scroll-to-rest, integrity diagnosis and the WCAG compositor. `audit-dark-contrast.js` re-pointed at the latter and its output verified byte-identical, removing 75 lines of duplicate probe. |

Each was proved by making it fail. Four bugs were found in the new checkers themselves and
are recorded as observations 808 to 812 — the most instructive being that cross-host checks
were silently connecting to **production** because Chrome had a resolver rule and Node did
not.

---

## Still to do

1. **Copy register reconciliation** — the 48 rows. The scanner cannot do this: it grades
   what is on the page and cannot know a line was shortened from an approved original or
   moved past the buying decision.
2. **Gated routes with a real session** — the seven `(app)` routes, both internal boards
   and `/blog/preview/[slug]` have never been measured; anonymously they redirect.
3. **The 10 fixture scenarios** on the results dashboard (`npm run db:seed`).
4. **Per-corpus checks** the route sweep collapses to one URL: all 18 blog slugs
   individually, both author pages, all 30 `/go/dNN`, `/api/og/blog/[slug]` per slug.
5. **Error boundaries** — `app/error.tsx`, `global-error.tsx`, `(app)/error.tsx`. No sweep
   built from a route list has ever reached one.
6. **Forms and checkout end to end** — 14 client fetch targets all resolve to real route
   handlers (verified statically); none has been submitted. Gate 3 (checkout E2E) is still
   open from April.
7. **Screenshots** at 1320 and 390 via `shot.js`, light theme only (dark mode is not
   implemented — `DESIGN.md` gap 1).
8. **The `MEMBERSHIP_ENABLED=true` pass** — expect `npm test` and `npm run build` to fail,
   which is the P9 guard firing on register row 42a, not a regression.
9. **External link check** — `npm run test:links:external`, ~120 citations, never run.

### Environment notes for the next session
- `.env.local` `MEMBERSHIP_ENABLED` was set to **false** for this pass and left that way.
  It is the shipping configuration, and STATE.md's own guidance is to set it false before
  building. Original backed up at `.env.local.premigration-bak` (gitignored).
- `STRIPE_PRICE_MEMBERSHIP` is unset in both `.env.example` and `.env.local` — in the
  latter it appears only inside a comment, so a grep count finds it and a parse does not.
  Nine feature flags plus that price id are now documented in `.env.example`; they were in
  no env file at all.
- Serve a **production build** (`npm run build` then `npm run start`), not `next dev`.
  Three separate repo notes explain why, and three of the new checkers assert absence,
  which is exactly what a stale dev payload falsifies silently.
- Do not run two browser checkers at once. Several navigation timeouts in this session were
  contention, not defects.

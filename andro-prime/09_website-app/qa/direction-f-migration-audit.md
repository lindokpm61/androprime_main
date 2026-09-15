# QA: Direction F pre-migration audit

**Status: IN PROGRESS — session 2, 2026-09-15.** Phases 0 to 4 done, 5 mostly. The
remaining phases are listed at the bottom with what each needs.

Branch `redesign/direction-f` at `1a14ffc`, measured against production
`origin/main` at `7ecad99`. **163 commits / 452 files ahead of production.**

Plan: `~/.claude/plans/we-need-to-run-parsed-oasis.md`. Full evidence logs are in the
session scratchpad and are not committed (git holds the recipe, Drive holds the media).

> **Session 2 in one line:** the environment half of Phase 5, and it found that the
> production build has never received two of the variables the app reads — so GA4 and the
> cookie banner have never run on the live site — plus one unauthenticated endpoint that
> dispatches physical kits. Neither is a Direction F regression; both are live today.
> Session 2's findings are in their own section, below the session 1 material.

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

**Session 2 adds no merge blocker and one launch blocker.** Everything it found is
pre-existing and live on `main` today, so none of it is a reason to hold this branch — but
`/api/vitall/dispatch` (S2-2) accepts an unauthenticated request to dispatch a physical kit,
and that should be closed before the first real customer rather than before the merge. The
two unbaked build variables (S2-1) are fixed in the branch and still need a Coolify change
to take effect.

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
| `test:links:external` (session 2, first ever run) | **2088 anchors, 74 external URLs, 0 broken** |
| `verify-env-contract.js` (session 2, new) | exit 0 after the two unbaked variables were fixed |

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

## Session 2, 2026-09-15 — the environment contract

Phase 5's environment half: reconcile `.env.example` against every `process.env.*` read,
cross-check against the build-argument versus runtime-variable split, and produce the
definitive Coolify variable list. That list already existed (`deployment/env/vars.md`,
swept 2026-07-26), so this was a re-sweep rather than a first draft — and the re-sweep is
what found the gap.

### 🔴 S2-1 Two variables the app reads have never reached a production build

`frontend/Dockerfile` names its build secrets one at a time, each read with
`$(cat /run/secrets/X 2>/dev/null || echo '')`. It mounted eight `NEXT_PUBLIC_*`
variables. The app reads eight. **They were not the same eight.**

| | Variable | State |
|---|---|---|
| 🔴 | `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | read by 3 components, **never mounted** |
| 🔴 | `NEXT_PUBLIC_APP_URL` | read by `lib/hosts.ts`, **never mounted** |
| ⚠ | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | mounted, **read by nothing** |
| ⚠ | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | mounted, **read by nothing** |

**What the first one costs.** `GoogleAnalytics` returns `null` when the measurement id is
empty, so **GA4 has never fired on the live site**. `CookieConsent` gates itself on the
same variable, so **the cookie banner has never rendered in production either** — which
means every Direction F change to it is unexercised there, including the ICO equal-weight
rule for Accept and Reject and the `--f-consent-h` hero-clearance fix found on 2026-08-31.
The whole chain degrades *consistently and by design* — no tag means no non-essential
cookies means no banner is required — so nothing looked wrong anywhere.

**Why nothing caught it.** `tsc` cannot: the reads are valid. The build cannot: an empty
string is a string. A screenshot cannot: a page without analytics looks exactly like a page
with analytics. `.env.local` and `.env.example` both carry the variable, so it works on the
developer's machine and reads as configured everywhere a human would look.

**Evidence, and the probe that was wrong first.** Grepping the production HTML for
`googletagmanager` returns 0 — but so does the same grep against a *local build where GA4
demonstrably works*, because `next/script` injects client-side and never appears in SSR
HTML. That probe cannot tell broken from healthy. The valid probe is the compiled client
chunk:

| | `app/layout-*.js` | `googletagmanager` | `ga-consent-bootstrap` | `G-XXXXXXXX` literal |
|---|---|---|---|---|
| production | `fc18fcc45e10aa15` | present | present | **absent** |
| local | `bbec9674cf9f7e02` | present | present | **present** |

Same component code both sides; the value is empty on one. That is the defect.

**The second one is harmless today and unsettable tomorrow.** `NEXT_PUBLIC_APP_URL` falls
back to the literal `https://app.andro-prime.com`, which is correct in production by
coincidence. The variable simply does nothing, so the two-host split cannot be pointed
anywhere else — at a preview environment, for instance.

**Fixed.** The mount list now matches the reads: `NEXT_PUBLIC_APP_URL` and
`NEXT_PUBLIC_GA4_MEASUREMENT_ID` added, the two dead mounts removed (checkout is a
server-side redirect and `@stripe/stripe-js` is not a dependency; Plausible was replaced by
GA4 and no script tag for it survives). `.env.example` gained the three
`STRIPE_PRICE_BUNDLE_*` ids and `STRIPE_COUPON_MEMBER`, all four reached only through a
computed `process.env[key]` and therefore invisible to a grep.

⚠ **The Dockerfile fix is necessary and NOT sufficient.** A mount with no value behind it
still yields an empty string. **`NEXT_PUBLIC_GA4_MEASUREMENT_ID` and `NEXT_PUBLIC_APP_URL`
must exist in Coolify before the next deploy**, or nothing changes. Values are in
`frontend/.env.local`.

⚠ **And it is a visible change.** The first deploy after this fix is the first time the
cookie-consent banner appears on the live site, on every page, for every first-time
visitor. Like the 26 SEO snippets already queued behind this branch, that should be a
decision rather than a discovery.

### 🔴 S2-1b The fix for S2-1 introduced a worse bug, and `??` is why

Caught on re-check after Keith confirmed the Coolify side. **Adding a mount is not
free**: before 2026-09-15 the Dockerfile did not mount `NEXT_PUBLIC_APP_URL` at all, so
the variable was genuinely `undefined` and `lib/hosts.ts`'s `?? 'https://app.andro-prime.com'`
worked exactly as written. After the mount, the `export` line always runs — and an
unsupplied secret becomes the **empty string**, which `??` passes straight through
because it only fires on `null`/`undefined`.

`APP_URL` would then be `''`. `hostnameOf('')` throws and returns `''`, so `APP_HOSTNAME`
is `''`, so `isAppHost()` is false for **every** request: `middleware.ts` stops recognising
the app host, and `urlFor()` throws on an empty base URL. A site-wide auth-routing failure
from a variable nobody set, with nothing in the build to report it — strictly worse than
the missing-analytics bug being fixed.

**Build secrets do work in Coolify, so this would not have fired in practice.** Proven with
the one variable that has no fallback literal anywhere in the code: `NEXT_PUBLIC_SENTRY_DSN`
is present in the production bundle and byte-identical to `.env.local`, which it could only
be if the mount reached the build. (Sentry *events* prove nothing here — the latest is
`environment: development`, `url: http://localhost:3000`, and with zero production traffic
an absence of production events is not evidence either way.)

Guard added regardless, because "correct as long as someone remembers the variable" is the
exact shape this session exists to remove. `lib/hosts.ts` and `app/auth/callback/route.ts`
now test truthiness; `lib/site-url.ts` already did. `sendActivationLink.ts` was corrected
rather than excepted, so the rule holds with no exemption table.

**Assertion F** in `verify-env-contract.js` now fails any
`process.env.NEXT_PUBLIC_* ?? …` in the scanned corpus. ⚠ Its first run reported
`lib/site-url.ts` — a **false positive on its own documentation**, since that module's
header explains the very `?? fallback` pattern it was written to replace. A checker that
flags the documentation of a rule as a violation of it gets switched off, so the assertion
strips comments before matching, blanking them in place to keep line numbers true. Proved
both ways: a real `??` reinstated in `lib/hosts.ts` fires the assertion by name, and the
restored tree passes.

⚠ **Separately, and not fixed:** the comment above that fallback in
`app/auth/callback/route.ts` says the app host is the correct choice, while the code prefers
`SITE_URL` and uses `APP_URL` only as its fallback. The two have disagreed since before this
session. Changing it changes where an auth callback lands, which is a different decision
from an empty-string guard, so it is flagged rather than touched.

### 🔴 S2-2 `/api/vitall/dispatch` dispatches physical kits with no authentication

Live on both production hosts today (`GET` returns 405, so `POST` is accepted). Pre-existing
and unchanged by this branch.

Given a `kit_orders.id`, the route reads the customer's full identity and address through
the **service-role** client (bypassing RLS), calls Vitall's `order/create` — a real
physical kit dispatch that costs money — flips the order row to `dispatched`, and emits a
`kit_dispatched` Customer.io event. There is **no signature check, no shared secret, no
session check, and no idempotency guard**: nothing compares the row's existing status, so
repeated calls repeat the dispatch.

It is an internal endpoint only by convention. Both legitimate callers —
`app/api/webhooks/stripe/route.ts:531` and `lib/bundles/dispatch.ts:107` — reach it by
`fetch()`ing the app's own public URL with a bare `Content-Type: application/json` and no
credential of any kind. The sibling job routes are not like this:
`/api/jobs/process-result` and `/api/jobs/bundle-sweep` both call `verifyQStashRequest`
and 401 without a valid signature.

The only barrier is knowing an order UUID, and a UUID is not a secret — order ids travel
through confirmation pages, emails, Customer.io payloads and logs. There is also **no rate
limiting anywhere in the repo** (`grep` for `rateLimit|ratelimit|Ratelimit` returns
nothing), and `middleware.ts`'s matcher excludes `api` outright, so no edge layer covers it.

**Not fixed here, deliberately, and this is the one place this session stopped and asked.**
Every available fix fails closed on the money path, and the payment-to-dispatch chain is
Gate 3 — open since April and never once proved end to end. A fail-closed fix shipped with
a missing Coolify variable turns "anyone can dispatch a kit" into "nobody's paid order
dispatches, silently", which is worse. Three options, in increasing order of both safety
and effort:

- **(a) Shared-secret header.** Both callers send `Authorization: Bearer <secret>`; the
  route 401s without it. Matches the existing `REVALIDATE_SECRET` pattern. Smallest diff.
  Requires the variable to be set in Coolify *before* the deploy that enforces it.
- **(b) QStash-sign it** like the two `/api/jobs/*` routes, reusing `verifyQStashRequest`.
  Consistent with the house pattern; a larger change to both call sites.
- **(c) Delete the endpoint.** Extract the handler into a library function and have both
  callers import it directly. The route exists only because two server modules call their
  own app over the public internet instead of calling a function. This removes the attack
  surface rather than guarding it, and it is the right end state.

Recommendation: **(c)**, with **(a)** as the fast mitigation if the launch date is close.
Either way, add the idempotency guard — the route should refuse an order that is already
`dispatched` regardless of who is calling.

### ✅ S2-3 The Sentry releases endpoint is not a deploy check, and cannot be

`SENTRY_AUTH_TOKEN`, `SENTRY_ORG` and `SENTRY_PROJECT` are read by `next.config.ts`, which
runs only at build time. **None of the three is a Docker build secret**, so the Coolify
build cannot upload source maps and has never created a Sentry release. Production
JavaScript stack traces are therefore minified — which is why the repo's own notes record
"breadcrumbs are the payoff, not the stack trace" as a fact of life rather than as a
fixable gap.

Every release row in the Sentry org was written by a developer's local `npm run build`. On
2026-09-15 all twelve most recent releases were `redesign/direction-f` commits that had
never been merged or deployed, while production sat 163 commits behind at `7ecad99` — so
the newest "release" named a commit that had never run anywhere but a laptop. Anything
using that endpoint as a deploy canary reads the wrong answer confidently. Phase 9's
canary ladder is unaffected (it already prefers the two-sided string check); the memory
note that claimed otherwise has been corrected in all three places it was stated.

Recorded in the new checker's `BUILD_TIME_NOT_MOUNTED` table with the consequence written
out, so the decision is visible rather than absent. Mounting a Sentry write token into the
build is Keith's call.

### ✅ S2-4 Two orphan endpoints, one of them a live unauthenticated write

Both confirmed to have no caller in the repo, both live in production.

- `/api/founding-member/join` — returns **410 Gone**, deliberately, pending a lawful basis
  for the founding-member list. Safe. No action.
- `/api/forms/contact` — **unauthenticated, unthrottled, service-role insert** into
  `lifecycle_events` with attacker-controlled `name`, `email` and `message`, and no length
  limit. The contact page is entirely `mailto:` and has been for some time, so this
  endpoint has no product value at all — it is pure attack surface. Recommend deleting it;
  if it is kept, it needs the same treatment as S2-2.

### The four "migration landmines" from the plan, re-tested

The plan listed four to fix in Phase 5 as unambiguous. Re-testing each against the code
changed two of the four answers:

| Landmine | Verdict |
|---|---|
| `lib/activate/sendActivationLink.ts:26` emails a `http://localhost:3000` link | **Not a defect — unreachable.** Zero callers. `/activate` was retired 2026-09-12 and now redirects to `/how-to-sample`; `lib/activate/*` is marked-not-deleted on purpose. The sibling `/api/activate` route is live but auth-gated and user-scoped, and only stamps an engagement metric on the caller's own row. |
| `lib/blog.ts:129` renders drafts on any non-production `NODE_ENV` | **Guarded by the platform.** The Dockerfile's runtime stage sets `ENV NODE_ENV=production` explicitly and `next build` sets it during the build, so the shipping container cannot take the drafts branch. Deliberate and documented for local review. No action. |
| `lib/supabase/env.ts:1-3` ships a real project ref and anon JWT as silent fallbacks | **Real, but armed with nobody walking on it.** A missing variable yields a working client pointed at *production*, which is correct in production and wrong everywhere else. There is exactly one deploy target today, so it cannot currently fire. Worth fixing when a second environment appears, and it must be fixed *before* one does. |
| 30 files hardcode `const BASE_URL = 'https://andro-prime.com'` | **Real, same shape, not fixed here.** `lib/site-url.ts` already exists as the single source and nine modules were migrated to it; the 29 page files and one route were not. In production the literal and the variable agree, so the only symptom is that a non-production deploy self-canonicalises to production. Touching every page's metadata during a migration audit adds risk without removing a live defect. Recommend a separate sweep, and before any preview environment exists. |

Both remaining landmines are the same finding in two places: **a fallback that is correct
in production is invisible until there is a second environment, and then it is wrong
everywhere at once.** Neither blocks this merge; both block the first preview deploy.

### ✅ S2-5 The external citation check has now run, and it is clean

`npm run test:links:external`, never executed before, closes "Still to do" item 9.

```text
harvested 2088 anchors from 65 of 67 routes
  90 distinct internal targets · 603 fragment links · 74 distinct external URLs
  13 mailto:/tel: (shape only, never fetched)
🟢 no broken links. 90 internal targets, 603 fragments, 74 external — all resolved.
```

Thirteen came back UNVERIFIED — 403 from SAGE, Mayo, JAMA, OUP, NEJM and AHA, and a `203`
from PubMed — which the script deliberately does not count as failures, because those hosts
block datacentre user agents as policy and the status says nothing about whether the
citation is good. No 404, no 410, no DNS failure anywhere.

Two notes for whoever reads this next. The corpus is **74 distinct external URLs, not the
~120 the plan estimated** — the plan counted citations, the script counts distinct targets,
and articles share sources. And the two unmeasured routes are the same two named
everywhere else: `/blog/preview/[slug]` (needs `PREVIEW_SECRET`) and `/membership` (needs
`MEMBERSHIP_ENABLED=true`), both 404 by design.

### New tooling, session 2

| File | Closes |
|---|---|
| `scripts/verify-env-contract.js` | Diffs the Dockerfile's build-secret list against the app's real `process.env` reads **in both directions**, asserts every read is documented in `.env.example`, asserts every build-time read in `next.config.ts` is either mounted or excused with a written reason, and fails if a computed `process.env[key]` site appears that its harvester does not know about. Wired into **`prebuild`** — so it fails inside the build that would otherwise ship the defect — and into `npm test`. |

Proved by making it fail, three ways: a mount removed (assertion A), an export removed with
the mount left in place (the second silent layer), and an excuse removed from
`BUILD_TIME_NOT_MOUNTED` (assertion E). ⚠ The first two attempts at that proof were
themselves invalid — one `sed` matched nothing and reported OK, and one deletion left a
dangling string continuation so `node` exited non-zero on a `SyntaxError` that read exactly
like the assertion firing. Observations 813 to 815.

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
9. ~~**External link check**~~ — **DONE in session 2, clean.** See below.

### Owed to Keith, from session 2 — both are configuration, not code

1. 🔴 **Set `NEXT_PUBLIC_GA4_MEASUREMENT_ID` and `NEXT_PUBLIC_APP_URL` in Coolify** before
   the next deploy. The Dockerfile now mounts them; a mount with no value behind it is
   still an empty string, so without this step S2-1 is not actually fixed. Values are in
   `frontend/.env.local`.
2. 🔴 **Decide S2-2** — the unauthenticated kit-dispatch endpoint. Three options are set
   out in the session 2 section with a recommendation; it is live today, so the decision
   is a launch gate rather than a merge gate.

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

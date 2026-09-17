# QA: Direction F pre-migration audit

**Status: IN PROGRESS — session 2, 2026-09-15.** Phases 0 to 4 done, 5 mostly. The
remaining phases are listed at the bottom with what each needs.

Branch `redesign/direction-f` at `1a14ffc`, measured against production
`origin/main` at `7ecad99`. **163 commits / 452 files ahead of production.**

Plan: `~/.claude/plans/we-need-to-run-parsed-oasis.md`. Full evidence logs are in the
session scratchpad and are not committed (git holds the recipe, Drive holds the media).

> **Session 2 in one line:** the environment half of Phase 5, the per-corpus checks, and a
> live purchase that closed Gate 3. Five findings, none of them a Direction F regression and
> all of them live on `main` before this session started:
>
> | | Finding | State |
> |---|---|---|
> | S2-1 | The production build never received two variables the app reads, so GA4 and the cookie banner have never run on the live site | fixed; Keith set the Coolify values |
> | S2-2 | An endpoint dispatched physical kits with no authentication | **endpoint removed** |
> | S2-7 | Two accessibility defects on **every published article**, invisible while the sweep measured one article of eighteen | fixed, verified 58 findings → 0 |
> | S2-8 | Gate 3 — payment to delivered email, on a **live** purchase | **closed** |
> | S2-9 | A refund moves the money and nothing else, proven by refunding that purchase | **decisions taken, handler shipped, events subscribed** — ⚠ inert until deploy, and refunding during that window destroys the event |
>
> Session 2's findings are in their own section, below the session 1 material.

---

## Go / no-go

> ▶ **SEQUENCING LIVES ELSEWHERE AS OF 2026-09-16.** This document is the **evidence**; what to
> do next, in what order, is
> `andro-prime/10_launch-ops/implementation-checklists/direction-f-go-live.md`, which merges
> what is open here with what is open on the defects register and carries its own tick boxes.
>
> **The gate is now TWO items, not three:** CA-046 (or a decision to flag `/demo` off), and the
> copy register's 26 owed signatures plus 5 rulings. CA-045 cleared and the pre-flight ran.

**NO-GO, and nothing found in this audit is why.** The blockers are the ones that were already
on the board before it started, and every one is a signature rather than a defect:

| # | Blocker | Owner | Where |
|---|---|---|---|
| 1 | ✅ **CA-045 — APPROVED 2026-09-15, BOTH SIGNERS.** ~~Homepage + `/kits` imagery: 10 items, 8 questions. Packet is an unsent Gmail DRAFT and is stale.~~ Ewa cleared all nine items at 20:07 UTC with no conditions (`1: A` … `7: A`) and Keith signed the same day. ⚠ **This row was written at 20:09, two minutes after the approval it describes as outstanding**, and stood uncorrected until 2026-09-16. ⚠ Two conditions survive the approval and are not closed by it: the hero field's opacity is **not** pinned, and hs-CRP and SHBG stay in the hero pattern uncovered by the build check | ✅ none | ClickUp `869eur84c` |
| 2 | **CA-046** `/demo`: a full results report, a membership price and ~2 dozen un-pre-flighted prototype strings on an ungated surface. | Ewa | ClickUp `869exuphq` |
| 3 | ✅ **Copy register reconciliation — RAN 2026-09-15.** Closed section written; every row dispositioned. ⚠ It was never 48 rows — **78** — the `## Closed` heading sat mid-table and 27 rows fell behind it. **The merge removes 15 HARD findings and adds none.** Still owed and not mine: 26 sign-off rows, 5 missing rulings. | Keith + Ewa to sign; the pass itself is done | `redesign-copy-register.md`, Closed section |

Zero traffic does not soften CA-045: the gate governs SHIPPING, and a page is live
whether or not anyone visits it.

**The technical side is in good shape.** Every gate that can pass, passes. Three defects
that would have shipped were found and fixed, one of which would have failed CI on the
merge commit itself.

**Session 2 adds no merge blocker, and its one launch blocker is now closed.** Everything it
found is pre-existing and live on `main` today, so none of it was a reason to hold this branch.
The unauthenticated kit-dispatch endpoint (S2-2) has been **removed**, after Gate 3 was proved
on a live purchase. The two unbaked build variables (S2-1) are fixed in the branch and Keith
has set them in Coolify. **Gate 3 itself is closed** (S2-8), on a live payment, so the
live-mode Stripe webhook is proved.

What remains on this path is a decision rather than a defect: the dispatch code still ships a
kit for an order at `pending`, `cancelled`, `refunded` or `on_hold`. With the public door gone
only our own code can reach it, so the gap is much smaller than it was.

🔴 **Session 2 then found one more, by testing it: a refund moves the money and nothing else.**
Keith refunded the live Gate 3 order, and eighteen minutes later Stripe said refunded while the
application still said `dispatched` — no webhook delivered, no row written, a kit in the post.
Missing at three independent layers, and the obvious fix is the wrong Stripe event. See S2-9.
Not a merge blocker; it is live on `main` today and has been all along. **Closed in code on
2026-09-15** once Keith took the three decisions it turned on — with one action still owed
outside the repo, because a handler is not a subscription.

---

## What passed

| Gate | Result |
|---|---|
| `npm run typecheck` / `typecheck:scripts` | exit 0 |
| `npm test` — 13 design checkers + 24 unit suites | exit 0 |
| `npm run test:engine` — 13 content-engine suites | exit 0 after the CI fix below |
| `npm run build` | exit 0, twice |
| `verify-http-contract.ts` (new) | **31 assertions**, exit 0 |
| `audit-viewport-sweep.js` (new) | 144 of 150 cells: zero overflow, zero sub-AA light-ground text — ⚠ **superseded**, this measured ONE article for `/blog/[slug]`; see S2-7 |
| `audit-dark-contrast.js` | 0 failing nodes over 16 routes at 1440px |
| `audit-runtime-errors.js` (new) | 46 of 48 routes clean |
| `audit-link-integrity.js` (new) | 864 anchors, 84 internal targets, 108 fragments; 1 open finding |
| `compliance-preflight/scan.js` over 165 changed copy files | no NEW claim exposure |
| `route-conformance` | 36/36 measurable routes render Direction F |
| `test:links:external` (session 2, first ever run) | **2088 anchors, 74 external URLs, 0 broken** |
| `verify-env-contract.js` (session 2, new) | exit 0 after the two unbaked variables were fixed |
| `audit-runtime-errors.js --expand-corpus` (session 2) | **65 of 67 routes, all 18 articles clean**; the 2 failures are the known logo item |
| `/api/og/blog/[slug]`, 18 slugs × 2 variants (session 2) | **36 of 36 generate** |
| `verify-bio-grid.ts` (session 2, new) | **50 assertions**, all 30 `/go` tiles resolve |

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

### ✅ S2-2 CLOSED — the endpoint that dispatched physical kits with no authentication has been removed

**Resolved 2026-09-15, in two steps and in the order Keith approved them.** The repeat-dispatch
guard went in first because it was safe on its own; the removal waited until Gate 3 was proved
on a live purchase, because restructuring the only path that turns money into a posted box
while nobody had watched it work was the larger risk.

**The route is gone.** Its body now lives in `lib/vitall/dispatchKit.ts`, and both callers —
`app/api/webhooks/stripe/route.ts` and `lib/bundles/dispatch.ts` — import the function instead
of `fetch`ing the app's own public URL. Verified against a running production build, with a
control so the probe could tell "removed" from "still there":

```text
GET  /api/vitall/dispatch -> 404   (was 405, i.e. the route existed and took POST)
POST /api/vitall/dispatch -> 404   text/html — Next's 404 page, NOT the route's
                                   {"error":"Order not found"} JSON
GET  /api/forms/contact   -> 405   control: a route that still exists still answers 405
```

The POST check needed that second layer: the old route ALSO answered 404 for an unknown order
id, so the status alone was ambiguous. The content type settles it — an HTML 404 page is Next
saying "no such route", not a handler saying "no such order".

**Why removal rather than a shared secret.** A lock can be missing. A secret absent from the
deployment environment turns "anyone can dispatch a kit" into "nobody's paid order dispatches,
silently", which is worse than the hole it closes. A function that does not exist on the
network cannot be called from the network and cannot be misconfigured into refusing its own
callers. It also removes a network hop from the money path: no DNS, no TLS, no proxy, no cold
start between a completed payment and the kit it owes.

**The contract that had to survive.** `lib/bundles/dispatch.ts` decides whether to retry
tomorrow by reading the response status and reports failures as `dispatch_status_${n}`. Those
numbers are part of the contract, not an artefact of a transport that no longer exists, so
`dispatchKit` returns every one of them unchanged — 400, 404, 422, 502, 500, 200. Collapsing
them to a boolean would have silently changed which failures retry.

Gates after the change: `npm test` exit 0 (including 48 repeat-dispatch assertions),
`typecheck` exit 0, `build` exit 0 with the route absent from the route table. Ten documents
that named the route as a current location were swept to point at the function.

🔴 **Still open on this path:** the `pending` / `cancelled` / `refunded` / `on_hold` gap below.
Removing the public door means only our own code can reach the dispatch now, which shrinks
that gap a great deal — but the code still ships a kit for an order nobody has paid for.

<details>
<summary>The original finding, kept for the record</summary>

### 🔴 S2-2 (as first written) `/api/vitall/dispatch` dispatches physical kits with no authentication

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

#### ✅ The idempotency half is DONE (Keith approved 2026-09-15)

*(Written while the authentication decision was still open. It was resolved later the same
day — the endpoint was removed; see the resolution above this block.)* The repeat-dispatch
half went first, because it is safe on its own: it only ever refuses work, so it cannot stop a
legitimate first dispatch.

**`status === 'dispatched'` would have been the wrong test**, and checking the real enum is
what showed it. `order_status` runs `pending → paid → dispatched → sample_registered →
processing → results_received`, plus `cancelled / refunded / sample_failed / on_hold /
data_purged`. An order at `results_received` was dispatched long ago and has been through the
lab; matching only the literal `dispatched` would wave it through and post a second box.

**And `vitall_order_id` alone is not sufficient either.** It is the stronger signal — it
exists only as the result of a real Vitall order — but **6 of the 7 `results_received` rows in
production carry no `vitall_order_id`**, having been seeded rather than dispatched through the
route. Either signal alone misses cases the other catches, so both are checked and either is
enough.

⚠ **It returns 200, not 409, and that is load-bearing.** `lib/bundles/dispatch.ts` marks a
bundle `dispatched` only on a 2xx and otherwise leaves the row in `awaiting_window` for the
next daily sweep. The case this guard exists for is precisely the ambiguous one — Vitall
succeeded, our write or our caller did not — and answering that retry with a non-2xx would
strand the bundle in `awaiting_window` **forever**, retrying daily and being refused every
time. The kit shipped, so the honest answer to "dispatch this" is "done", with
`alreadyDispatched: true` saying it was not done just now.

The rule lives in `lib/vitall/alreadyDispatched.ts` rather than in the route, for the reason
`buildVitallPatient` does: a route handler needs Supabase and a request, so a decision made
inside one cannot be tested, and this one guards a physical dispatch and a lab fee.
`scripts/test-vitall-already-dispatched.ts` drives it over the whole enum — **48 assertions**,
in `npm test`. Proved by making it fail twice: reintroducing the original bug fails on
`sample_registered`, `processing` and `results_received` by name, and dropping a status from
the classification lists fails the enum-coverage assertion, which is what stops a future
twelfth enum value defaulting to the branch that spends money.

🔴 **Still open, and deliberately not fixed here:** `pending`, `cancelled`, `refunded` and
`on_hold` are not "already done", they are **"should not dispatch at all"** — and the route
still dispatches them today. A `pending` order has not been paid for. That is a different
refusal needing a different answer to the caller, and widening a guard on the
payment-to-dispatch path is a separate decision from making it idempotent.

</details>

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
| `lib/activate/sendActivationLink.ts:26` emails a `http://localhost:3000` link | ✅ **FIXED 2026-09-17** (Gate A item A3), now `headerStore.get('origin') \|\| SITE_URL`. The verdict below was right that it is unreachable — zero callers; `/activate` was retired 2026-09-12 and redirects to `/how-to-sample`; `lib/activate/*` is marked-not-deleted on purpose — and it was corrected anyway rather than excepted, so the rule needs no table of exemptions. ⚠ **Being unreachable is why it survived three passes:** each one re-derived "no caller, no defect" and stopped, which is a correct answer to a question nobody was asking. The cost of the fix was one import. *(Original verdict: "Not a defect — unreachable." The sibling `/api/activate` route is live but auth-gated and user-scoped, and only stamps an engagement metric on the caller's own row.)* |
| `lib/blog.ts:129` renders drafts on any non-production `NODE_ENV` | **Guarded by the platform.** The Dockerfile's runtime stage sets `ENV NODE_ENV=production` explicitly and `next build` sets it during the build, so the shipping container cannot take the drafts branch. Deliberate and documented for local review. No action. |
| `lib/supabase/env.ts:1-3` ships a real project ref and anon JWT as silent fallbacks | ✅ **FIXED 2026-09-17** (Gate A item A3). All three fallbacks removed; the getters throw and name the variable, and `verify-env-contract.js` **assertion G** now fails if any hardcoded Supabase URL, JWT literal or `localhost:3000` origin returns to the corpus. `isSupabaseConfigured()` is untouched, so call sites that degrade gracefully still do. *(Original verdict: "Real, but armed with nobody walking on it… worth fixing when a second environment appears, and it must be fixed before one does." That reasoning held, and the deadline it set — before a second environment — is now met with room to spare.)* |
| 30 files hardcode `const BASE_URL = 'https://andro-prime.com'` | **Real, same shape, not fixed here.** `lib/site-url.ts` already exists as the single source and nine modules were migrated to it; the 29 page files and one route were not. In production the literal and the variable agree, so the only symptom is that a non-production deploy self-canonicalises to production. Touching every page's metadata during a migration audit adds risk without removing a live defect. Recommend a separate sweep, and before any preview environment exists. |

Both of those landmines were the same finding in two places: **a fallback that is correct
in production is invisible until there is a second environment, and then it is wrong
everywhere at once.** 🔄 **Amended 2026-09-17: the `env.ts` half is fixed, so ONE instance of
that finding is left** — the 30 files hardcoding `BASE_URL`. It still does not block the merge,
and it still blocks the first preview deploy.

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

### ✅ S2-6 The per-corpus checks, and the collapse that made them necessary

"Still to do" item 4 named the gap precisely: the route sweep collapses `/blog/[slug]` to a
single URL, so every check built from the route list measures **one article of eighteen**
and prints a summary that is never wrong, only shallow. Same shape as defect M7, where a
dynamic route hid seventeen articles behind one entry.

`audit-link-integrity.js` had already solved this for citations, privately. The resolver now
lives in **`scripts/article-corpus.js`** and both sweeps read it — the same consolidation
that took 75 lines of duplicated WCAG probe out of `audit-dark-contrast.js`.

| Corpus check | Result |
|---|---|
| **Runtime errors, all 18 articles** (`--expand-corpus`, 50 → 67 routes) | **65 of 67 measured, all 18 articles clean** |
| **OG images, 18 slugs × 2 variants** | **36 of 36 generate**, 200 with real payloads |
| **`/go/dNN`, all 30 tiles** | **50 assertions, 0 failed**; 14 distinct destinations all resolve |
| **Error boundaries, structural** | all 3 present, correct, and reporting to Sentry |

**The runtime sweep found nothing new, and that is the finding.** Seventeen extra article
renders produced zero additional errors. The only two failing routes are `/order/confirmed`
and `/subscription/confirmed` — session 1's already-open logo-on-the-app-host item,
reproduced exactly at **39 failed requests per page load**. Article content does not
introduce runtime errors; the one open defect is in the shared chrome, where session 1 put it.

⚠ **`audit-runtime-errors.js` refused the first attempt rather than measuring a subset.**
Passing 20 concrete paths to `--routes` returned `🔴 CANNOT RUN: --routes matched no known
route` and exit 2, because `discoverRoutes()` yields the `[slug]` pattern and not the slugs.
That refusal is the correct behaviour and is what exposed the real gap — the alternative,
silently matching nothing and reporting "0 of 0 routes clean", is the failure this repo has
already been bitten by twice.

#### The OG card variant is per-CATEGORY, and that is deliberate

Eleven `?variant=card` images came back byte-identical in size, which reads exactly like a
per-article system that is not per-article. It is not a defect — `CardHero` renders brand
plus category only, because the blog-list card already shows the title in HTML and the
hero's job there is to differentiate categories rather than repeat content.

Verified positively rather than assumed, because "they look the same" and "they are the
same" are different claims. Four same-size cards hash identically; the published corpus
splits **12 / 4 / 2** across Energy & Recovery, Testosterone and Inflammation & Recovery;
and the card sizes cluster **12 / 4 / 2** in exactly those groups. The `social` variant is
per-article and every one differs. Recorded so nobody "fixes" it later.

#### 🔴 A local run of this app reads and writes the PRODUCTION database

Not a new defect, but it constrains how the remaining phases can be run, and it is the
reason one of these checks is not an HTTP check.

`/go/[slug]` calls `trackEvent`, which uses the **service-role** client. There is no local
Supabase in this repo — `.env.local`'s project ref *is* the live project. Driving the 30
tiles over HTTP to "test" them writes 30 fake `bio_tile_click` rows into production
analytics and fires 30 GA4 events. So `verify-bio-grid.ts` imports `buildSchedule()` instead:
the schedule is pure, takes no arguments and reads no env, so it proves the same thing with
no side effect. Its `--base` flag resolves the DESTINATIONS, which are ordinary marketing
pages and safe to fetch, and never touches `/go` itself.

The same applies to "Still to do" item 3: `scripts/seed-result.ts` already carries a
`🔴 IT WRITES TO PRODUCTION` header and requires `--yes`, so the ten fixture scenarios are a
deliberate production write and Keith's call, not something a sweep should do on its own.

#### Error boundaries — the half that can be checked without breaking something

All three exist, are client components, and report to Sentry with `captureException` and the
`digest`. The structural rule that actually matters is satisfied: `global-error.tsx` renders
its **own `<html>` and `<body>`** (it replaces the root layout, so without them it fails at
runtime) plus a `main` landmark, while `app/error.tsx` and `app/(app)/error.tsx` correctly
render neither. Note the check needed reading, not grepping: `app/error.tsx` matches
`<html` — in a comment describing `global-error.tsx`.

Still owed: rendering all three for real, which needs a deliberate throw. No sweep built
from a route list can reach them.

### 🔴 S2-7 Two defects on every published article, both invisible until the sweep measured the corpus

This is what item 4 was for. Session 1's viewport sweep reported **144 of 150 cells: zero
overflow, zero sub-AA light-ground text**, and it was accurate about what it measured — one
article. Re-run across all 18 with `--expand-corpus`: **58 findings across 195 cells.**

Both defects are on live, published content. Neither is a Direction F regression in the sense
of "this branch broke it"; both have been shipping.

#### S2-7a `--ink-3` on `--sunk` is 4.10:1, and the repo already said so

57 of the 58 findings are one contrast failure in two places, at 10.5px:

| Selector | Where | Ratio |
|---|---|---|
| `.fb-refs-h` | the "References" heading, **every article** | 4.10:1 (needs 4.5) |
| `.fb-prose table th` | table headers, every article with a table | 4.10:1 (needs 4.5) |

`rgb(107,112,120)` is `--ink-3`; `rgb(231,233,236)` is `--sunk`. WCAG 1.4.3 AA, and 10.5px
is comfortably normal text, so 4.5 is the bar and there is no large-text exemption.

🔴 **The rule was already written down, with this exact number.**
`styles/components/f-primitives.css` on `.f-banner-k`:

> `--ink-2, not --ink-3: this key sits on `--sunk`, where --ink-3 measures 4.10:1. The same
> pairing that failed on twelve `.f-spec-k` instances.`

So this is the **third** time the same pairing has shipped: twelve `.f-spec-k` instances,
then `.f-banner-k`, now `.fb-refs-h` and `.fb-prose table th`. In the table rule the
forbidden pairing is set on two adjacent lines — `color: var(--ink-3)` directly above
`background: var(--sunk)`.

**Fixed** to `--ink-2`, which measures 6.8:1 on the same ground, with the reason recorded at
both sites.

⚠ **And the rule has been converted rather than restated.** A rule correctly worded,
prominently placed, and walked past three times does not need a fourth wording; it needs a
mechanism. `test:design:premerge` now runs **both** sweeps with `--expand-corpus`:

```json
"test:design:premerge": "npm run test:design:live && npm run test:design:sweep:corpus &&
   node scripts/audit-runtime-errors.js --expand-corpus && npm run test:links:external"
```

The check that catches this pairing already existed and already worked. What it lacked was
the corpus — it was measuring one article and reporting a number that was never wrong, only
shallow.

#### S2-7b The table scroll wrapper was written and never wired up

The 58th finding: at 390px, `/blog/b12-blood-test` scrolls the **whole document**
horizontally — content 399px against a 390px viewport, overflowing element `table`.

`.fb-tablewrap { overflow-x: auto; -webkit-overflow-scrolling: touch }` has been in
`f-blog.css` since the F blog was built, for exactly this case. **It is applied to nothing.**
A repo-wide search finds the class in the stylesheet and in no component, because
`remark-gfm` emits a bare `<table>` and `components/marketing/articleMdx.tsx` had no `table`
entry in its component map. The rule was written; the wiring was not.

One article tripped it, by 9px. Any table one column wider does the same, and the blast
radius is every article an author writes from here on. **Fixed** by mapping `table` in
`mdxComponents` to the wrapper — outside the table, since `overflow-x` on the table itself
does not create a scroll container for its own box.

#### Verified

Re-run after both fixes, against a fresh production build:

```text
67 routes x 3 widths = 201 cells; 195 measured
✓ positive control: both probes found a planted overflow and a planted 1.9:1 text node
🟢 no overflow and no sub-AA light-ground text across 195 cells.
```

58 findings to 0, exit 0. The positive control fired on the same run, so the clean result is
a measurement rather than a probe that stopped looking.

#### Why both were invisible

Neither is reachable by the gates that pass. `tsc` sees valid CSS and valid TSX. The build
succeeds. `verify-design-tokens.js` checks that tokens exist, not what they measure against a
ground. `route-conformance` counts classes. A screenshot of the one representative article
shows a References heading that looks fine, because 4.1:1 does not look broken — it looks
slightly grey. And `.fb-tablewrap` is a CSS class with no consumer, which
`verify-dead-components.js` does not cover because it checks components, not classes.

The only instrument that could see either is a contrast probe and an overflow probe run over
the real corpus at real widths. Both existed. Neither had been pointed at more than one
article until now.

### ✅ S2-8 GATE 3 IS CLOSED — a real purchase, traced end to end

Open since April, waiting on a real order. Keith bought a Kit 1 on 2026-09-15 and every link
in the chain is now evidenced rather than assumed. **Payment to delivered email: 5 seconds.**

| Time (UTC) | Step | Evidence |
|---|---|---|
| 01:01:53.527 | `kit_orders` row created | `status: paid`, `stripe_payment_intent` present |
| 01:01:53.823 | Purchase analytics written | `events.kit_purchase`, value 99, currency gbp, `kit_id: testosterone` |
| 01:01:56.708 | Vitall order created, status flipped | `vitall_order_id: 322953442`, `status: dispatched` |
| 01:01:56 | Customer.io event | `kit_dispatched`, carrying the order id and the Vitall id |
| 01:01:57 | Email **sent** | campaign 12, "T-02 — Kit Dispatched", `state: running`, transactional |
| 01:01:58 | Email **delivered** | delivery metrics `sent` + `delivered` |

Every assertion above is read from the production database or the Customer.io API, not
inferred. The `kit_dispatched` event's recent attribute values contain this exact
`order_id` and `vitall_order_id`, so the event that fired the email is provably this order's.

✅ **It was a LIVE payment** (Keith, 2026-09-15). That was the open question, and it is the
answer that matters: webhook endpoints are per mode and do not copy test → live, so this
proves the **live-mode** endpoint is registered and firing. Phase 9 step 4 is therefore
satisfied in advance of the deploy rather than after it, and the launch risk it existed to
cover — card charged, no webhook, no order row, nothing dispatched, nothing saying so — is
closed.

#### Does the proof transfer to the code about to ship?

Gate 3 was proved on **production `7ecad99`**, not on this branch, so the question is whether
the branch changes the path it proved. It changes six files on or near it. Checked one by one:

| File | Change | On the live kit chain? |
|---|---|---|
| `app/api/webhooks/stripe/route.ts` | date-format refactor, plus an ops alert on a **subscription** insert failure | **No** — subscriptions, not kits |
| `app/api/checkout/kit/route.ts` | early-retest decline block, wrapped in `if (user && isMembershipEnabled())` | ⚠ **UNVERIFIED — see the correction below** |
| `app/api/checkout/portal`, `checkout/subscription` | membership/portal work | **No** — not the kit path |
| `app/api/vitall/dispatch/route.ts` | this session's idempotency guard | Yes, and see below |
| `lib/vitall/alreadyDispatched.ts` | new, holds that guard | Yes, and see below |

So the only change on the proved path is the guard added in this session, and it only ever
refuses. Checked against the real order's actual states rather than fixtures:

```text
guard would have BLOCKED the live purchase? false   ← status 'paid', no vitall_order_id
guard blocks a REPEAT of that order now?    true    ← status 'dispatched', id 322953442
```

The live purchase would have completed unchanged with the guard in place, and a replay of it
is now refused. **The Gate 3 proof transfers.**

#### 🔴 CORRECTION: I read that flag from the wrong store, and it may well be ON

Earlier in this section I wrote that the kit-checkout change is inert because
"`MEMBERSHIP_ENABLED` is false in the shipping config". **That was asserted from
`frontend/.env.local` and from STATE.md's guidance — neither of which is the production
environment.** It is exactly the mistake S2-1 is about, inverted: there, a variable present
locally was absent in production; here, a variable false locally may be true in production.

ClickUp `869eqavre`, raised 2026-08-26 and **still open**, says the opposite of what I
assumed: *"`MEMBERSHIP_ENABLED` is **`true`** **in Coolify**, not off. Every doc, every commit
message and the whole dark-launch design on this feature assumed it was off."* It records a
£47/month paywall reachable on the live app host and `POST /api/checkout/subscription`
returning a real `cs_live_…` Stripe Checkout URL, and notes `ACCOUNT_ADDRESS_ENABLED` had
drifted too — *"a **set** that has drifted, not one variable"*.

**I could not verify the current value from here.** The flag is runtime-only (not a
`NEXT_PUBLIC_`, not a Docker build secret), so the build cannot reveal it, and on production
`/membership` returns **308** — it is still an app-host route at `7ecad99`, where the check
needs a signed-in session. The task's own discriminator says an unauthenticated request tells
you nothing. Controls run alongside: `/kits` → 200, `/no-such-page` → 404, so the probe works
and the 308 is a real routing answer rather than a broken request.

**What this does to the Gate 3 conclusion.** Gate 3 itself is unaffected: it ran against
production code, which has no early-retest block at all. What is *not* established is my claim
that the branch's kit-checkout route is inert after the merge. If the flag is on in Coolify,
that block **is** live on the kit sale path the moment this branch deploys, and nothing has
exercised it.

✅ **One thing the branch improves:** it removes `/membership` from `APP_ROUTE_PREFIXES`, so
after the merge the apex `/membership` becomes a public page that 404s when the flag is off and
200s when it is on — an *unauthenticated* discriminator, which is what the 2026-08-26 task
asked for and could not have. Worth using as the Phase 9 flag assertion.

**Owed before merge, and it is one look rather than a task:** confirm `MEMBERSHIP_ENABLED` in
Coolify, and audit the rest of the flag set against `deployment/env/vars.md` while there —
`869eqavre` step 2 says to assume more have drifted, since two of the three checked had.

#### ⚠ Correction to S2-6: the audit's own checkers DID write to production analytics

S2-6 records that `/go/[slug]` writes a `bio_tile_click` row through the service-role client,
and that `verify-bio-grid.ts` therefore imports the schedule rather than driving the route.
That reasoning stands and that mitigation worked — session 2 wrote **zero** tile clicks.

But the claim made while reaching it, that "nothing links to `/go/`", was **wrong**, and the
production data proves it: **session 1's link crawl wrote 7 `bio_tile_click` rows** on
2026-09-14 between 22:01 and 22:49.

The error was in the search, not the reasoning. The grep excluded `app/go/` on the assumption
it held only the route handler — but `app/go/page.tsx` is the GRID page, and line 132 renders
``href={`/go/${post.slug}`}``. So the exclusion filter removed the one file that answered the
question, and the template literal would have defeated a plain grep anyway. That is precisely
the case `audit-link-integrity.js`'s own header describes: *"roughly a third of this site's
internal links are template literals, so a grep over the source finds the SHAPE of a link and
never its VALUE."* The browser-based crawler found them; the grep that was supposed to predict
what it would find did not.

Session 2's sweeps also wrote **8 `bio_grid_view` rows**, because the grid page emits that
event server-side on every render and every route sweep loads it. Not preventable by choosing
a different checker — the event fires on a plain GET of a public page.

**Standing total from the audit: 19 + 8 = 27 `bio_grid_view` and 7 `bio_tile_click` rows in
production `events`, all attributable to QA, none to a real visitor.** They are recorded here
so that whoever first reads the launch analytics does not mistake them for early traffic. The
underlying cause is the one already named in S2-6: there is no local Supabase, so a local run
of this app reads and writes the production database.

### 🔴 S2-9 A refund moves the money and nothing else. Proven on the live Gate 3 order

Keith refunded the Gate 3 purchase on 2026-09-15 to see what happened. What happened is
nothing, and it is nothing at three independent layers.

**The stimulus, read from LIVE Stripe** (`livemode: true`), not inferred:

```text
payment intent  pi_3UFkk…  status succeeded, £99.00 GBP received, created 01:01:47
charge          ch_3UFkk…  refunded = true, amount_refunded = £99.00, disputed = false
refund          re_3UFkk…  status succeeded, £99.00, reason requested_by_customer
                           created 2026-09-15 01:20:06 UTC
```

**The effect, read from production:** none whatsoever.

| | State | Last written |
|---|---|---|
| `processed_stripe_events` | still 4 rows, newest `checkout.session.completed` | 01:01:53 |
| `kit_orders` row | `status: dispatched`, `vitall_order_id: 322953442` | 01:01:56.708 |

The order row has not been touched since three seconds after the purchase. Eighteen minutes
after the money went back, and counting, Stripe and the application disagree about whether this
order exists — and a physical kit is in the post either way.

#### Three layers, each independently missing

1. **Stripe never delivered anything.** The webhook records every event id it receives
   *before* doing any work, so an ignored event still leaves a row. No row appeared, which
   means the endpoint is not subscribed to the event at all. The repo's only record of the
   subscription list (`docs/phase7-implementation-plan.md`) names three events, none of them a
   refund.
2. **The handler would ignore it if it arrived.** `app/api/webhooks/stripe/route.ts` branches
   on four event types — `checkout.session.completed`, `invoice.payment_succeeded`,
   `invoice.payment_failed`, `customer.subscription.deleted`. No refund, no dispute.
3. **Nothing can write the result.** `kit_orders.status` has a `refunded` value and **no
   writer anywhere** in `app/`, `lib/` or `scripts/` — while `app/(app)/account/page.tsx`
   classifies it as an "ended" status and renders for it. UI for a state the system cannot
   reach. See observation 820.

#### ⚠ The obvious fix is the wrong event

The payment intent's status is still `succeeded`, **not** `canceled`. Stripe models this as a
refund against the CHARGE, not a cancellation of the intent — so subscribing to
`payment_intent.canceled` would catch nothing at all, while looking like the fix. The event is
**`charge.refunded`**, and `charge.dispute.created` belongs in the same change.

#### Why this direction was never built, while the other one was

The asymmetry is instructive rather than careless. The **lab's** cancellation path is complete:
`app/api/webhooks/vitall/route.ts` sets `cancelled`, alerts ops, and explicitly documents that
no automatic Stripe refund follows because refunding stays a deliberate human decision. That
path was built because the lab cancelling is a thing that happens during integration. The
**merchant's** refund path was never exercised, because nobody refunds a test order — and the
first real refund in the system's history was this one, deliberately, to find out.

#### 🔴 And the local environment holds a LIVE Stripe key

Found while reading the refund: `.env.local` carries `sk_live_…`. The repo's own convention
(`deployment/env/vars.md`) is *"sk_test_* locally; sk_live_* in production"*. So a checkout run
on a developer machine charges a real card.

This is the Stripe version of the finding already recorded in S2-6 — there is no local
environment, so local runs hit production. There it cost 27 fake analytics rows. Here it would
cost real money, and it is the reason this section could be evidenced at all.

**Decision 2026-09-15 (Keith): the live key stays. Accepted risk, not an oversight.** Solo
machine, sole developer, and the alternative needed test-mode prices for all seven products
before local checkout would work again. Recorded here and in `deployment/env/vars.md` next to
the convention it breaks, so the next reader sees a decision rather than a defect and does not
"fix" it back. ⚠ It stops being a solo-machine question the moment a second developer, a CI
runner or a cloud dev environment touches this repo — revisit it then, not before.

#### ✅ RESOLVED 2026-09-15 — all three decisions taken, code shipped, events subscribed in Stripe

Keith took the three decisions in session. What follows is what was built against them.

**(a) Subscribe to `charge.refunded` AND `charge.dispute.created`.** Both branches are now in
`app/api/webhooks/stripe/route.ts`. A dispute is the same money leaving by a different door and
the only one with a deadline, so it was worth the second branch.

**(b) Record, stop the money, alert — do not attempt to unwind.** On a FULL refund the handler
sets `kit_orders.status = 'refunded'`, cancels every `bundle_dispatches` row for that order
still at `scheduled` / `trigger_met` / `awaiting_window`, and fires an `order_refunded` ops
alert carrying the customer, kit, amounts, and whether the kit had already shipped. Results
already received stay visible: `getDashboardData` only applies its terminal-status filter on
the no-results-yet branch, so marking an order refunded never hides results the customer has.

**(c) The live Stripe key stays on the developer machine.** Keith's call, made knowing the
finding: solo machine, sole developer. Recorded as an accepted risk rather than silently
dropped — see `deployment/env/vars.md`, which now carries the exception next to the convention
it breaks, so the next reader does not "fix" it back.

**Three things found while building it that the original finding did not name:**

1. **A late lab callback erased the refund.** `charge.refunded` marks the order `refunded`, and
   the kit cannot be un-posted — so the sample is still processed and Vitall reports
   `results-available` hours later. The Vitall webhook wrote its status map straight onto the
   row, so that callback set `results_received` and destroyed the only record in our system
   that a refund happened. The same shape erases a `data_purged` GDPR erasure, which is worse:
   that one carries a legal obligation and nothing else proves it. Fixed by a terminal-status
   guard applied as a filter ON the UPDATE (`lib/orders/terminalStatus.ts`), not a read-then-
   write — the two senders are independent and the race window is exactly when both fire.
2. **`charge.refunded` fires on PARTIAL refunds too, with no field saying which.** The only
   signal is the arithmetic, and this is not hypothetical: the T&Cs sell a bundle whose retest
   portion is separately refundable ("you can ask us to refund the retest portion instead of
   banking it, at any time before it is dispatched"). Treating a partial as a full refund would
   mark a £179 order refunded over a £20 adjustment, hide it, and cancel the very retest still
   owed. Split in `lib/orders/refund.ts`; a partial changes no status and only alerts, because
   only a human knows which portion the money came off.
3. **A refunded bundle still posted its second kit.** The second kit is owed by a
   `bundle_dispatches` row, not a second charge, so the daily sweep carried on toward shipping
   it at our cost after the money went back. That is the one piece of future spend a refund can
   still reach, and it is now cancelled. Inert today (`BUNDLES_ENABLED` is off) and live the
   moment it is flipped.

**Proof:** `scripts/test-refund-classification.ts`, 100 assertions, wired into `npm test`.
Proved by making it fail three ways — `>=` narrowed to `===` (over-refund misreads as partial),
`scheduled` dropped from the cancellable list, `refunded` dropped from the terminal set. ⚠ The
third control initially raised ONE failure where it should have raised two: the "every status is
classified" assertion computed its pipeline list by filtering the enum with the constant under
test, so dropping a value just moved it to the other side and the arithmetic still balanced. A
test whose expected value is derived from the code under test cannot fail. Rewritten as two
literal lists; the same control now raises two. Observation 821.

✅ **SUBSCRIBED 2026-09-15.** Keith added `charge.refunded` and `charge.dispute.created` in
Developers → Webhooks; the endpoint now carries six events. The same screenshot settled the
open `invoice.payment_failed` question — it is ticked, and it is already handled on deployed
`main`, so the T-07 dunning path is live now. (What that does **not** establish is history:
the event was absent from the repo's record for months, so "working since Phase 7" is not a
claim anyone can make. It works from 2026-09-15.)

Stripe's own description of `charge.refunded`, read off that screen, is worth recording because
it independently confirms the design decision above: *"Occurs whenever a charge is refunded,
**including partial refunds**."* The full/partial split was not defensive programming.

#### 🔴 A NEW FINDING CREATED BY THE ORDER THESE TWO STEPS WERE DONE IN

Subscribing before deploying opened a window in which the events are **destroyed rather than
queued**, and nothing reports it. Production runs `main` (`4a43864`), which has no branch for
either event. The handler claims the event id in `processed_stripe_events` *before* it branches
on `event.type` — correct, and what makes Stripe retries safe — so an event arriving now is
recorded as processed, does nothing, and returns 200. Stripe reads that as successful delivery
and never retries. After the deploy, a resend of the same event hits the unique constraint and
exits `deduped: true`. **Permanently unprocessable, silently.**

The general rule this yields: **deploy the handler, then subscribe the event — never the
reverse** — and it applies to any consumer with an idempotency ledger that claims before it
dispatches, which is most of them. The dedupe write is deliberately the first thing the handler
does, so "no branch for this type" and "already handled this id" are indistinguishable to
everything downstream.

Keith accepted the window knowingly: refunds are merchant-initiated only, there is one real
order and it is already refunded, so the probability is near zero. Verified clean at the time
of writing — `processed_stripe_events` still 4 rows, all `checkout.session.completed`, newest
`01:01:53`. **The live constraint while it is open ("do not issue a refund until the branch
deploys"), and the deploy-time step that repairs the Gate 3 row, are both recorded at the top
of `STATE.md`** rather than here, because that is the file the next session actually opens.
### New tooling, session 2 (continued)

| File | Closes |
|---|---|
| `scripts/article-corpus.js` | The shared corpus resolver. `articleSlugs()` reads the site's own sitemap — the answer that cannot disagree with the pages — and `expandArticleRoutes()` swaps the `[slug]` placeholder for the real corpus, with a floor below which it refuses rather than reporting a sample as a corpus. Removes the private copy from `audit-link-integrity.js`. |
| `scripts/verify-bio-grid.ts` | All 30 carousel tiles resolve to their own destination. Needed because an unknown slug does **not** 404 — it 307s to `/test-selector` with `utm_content=unknown`, deliberately, so a broken tile is invisible from outside and can only be caught against the schedule. In `npm test`. |
| `--expand-corpus` on `audit-runtime-errors.js` and `audit-viewport-sweep.js` | Both sweeps can now measure the corpus instead of one representative of it. Off by default: for checks about the shared shell, eighteen renders of one template is eighteen page loads to re-prove the same nav. |

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

1. ✅ **Copy register reconciliation — DONE 2026-09-15. Phase 4 ran, for the first time.**
   Full write-up in `redesign-copy-register.md`'s Closed section. Headline: **the merge removes
   fifteen HARD findings and adds none** (18 on `main`, 3 on the branch, sixteen of main's
   eighteen being live verdict-vocabulary defects the branch fixes). `/membership` and `/demo`
   return 0 HARD / 0 REVIEW. Ashwagandha clean across seven synonym forms. Every EFSA claim
   exact. ⚠ It was never 48 rows — **78** — because the `## Closed` heading sat mid-table and
   27 rows had been appended behind it. Every row now carries a disposition and an owner. The
   independent second pass found nine further `/demo` findings a scanner cannot see, and six
   corrections owed to the register itself. **Row 6, the register's only self-declared blocker,
   turned out not to be clinical at all** — a mis-citation, corrected.

   ⚠ **What the plan's own scoping missed, and a question from Keith found:** Phase 4 is defined
   as "the branch diff", so the 18 articles and the 26 SEO snippets — both **database-served** —
   could never appear in it. Scanned separately: articles **13 HARD / 53 REVIEW**, exactly the
   figure the compliance skill recorded for that corpus on 2026-09-08, so zero drift; snippets
   **0 HARD / 1 REVIEW**, carried from an approved excerpt and already live. The MDX mirror was
   confirmed in step with the served bodies first. The fragment pass ran per-article with a named
   source: **0 HARD on all fifteen, zero figure-not-in-source findings.**

   **Still owed, and none of it is a pass — it is signatures:** 26 sign-off rows, 5 missing
   rulings, and the CA-045 scope note that matters most (the packet describes ONE surface; the
   `HeroField` layer now renders on **seven**).
2. **Gated routes with a real session** — the seven `(app)` routes, both internal boards
   and `/blog/preview/[slug]` have never been measured; anonymously they redirect.
3. **The 10 fixture scenarios** on the results dashboard (`npm run db:seed`).
4. ~~**Per-corpus checks**~~ — **DONE in session 2** for runtime errors (all 18 articles),
   OG images (18 × 2 variants) and all 30 `/go/dNN`; see S2-6. The viewport sweep gained the
   same `--expand-corpus` flag. Author pages are covered by the route list already.
5. **Error boundaries** — `app/error.tsx`, `global-error.tsx`, `(app)/error.tsx`. The
   **structural** half is done in session 2 (all three present and correct, `global-error`
   renders its own `<html>`/`<body>`). Still owed: rendering all three for real, which needs
   a deliberate throw — no sweep built from a route list can reach one.
6. **Forms** — 14 client fetch targets all resolve to real route handlers (verified
   statically); none has been submitted. ✅ **Checkout is done: Gate 3 CLOSED 2026-09-15**
   on a real purchase, traced payment to delivered email in 5 seconds. See S2-8. The one
   thing it does not answer is which Stripe MODE was used.
7. **Screenshots** at 1320 and 390 via `shot.js`, light theme only (dark mode is not
   implemented — `DESIGN.md` gap 1).
8. **The `MEMBERSHIP_ENABLED=true` pass** — expect `npm test` and `npm run build` to fail,
   which is the P9 guard firing on register row 42a, not a regression.
9. ~~**External link check**~~ — **DONE in session 2, clean.** See below.

### Owed to Keith, from session 2 — ✅ BOTH CLOSED, and this list was stale

1. ✅ ~~**Set `NEXT_PUBLIC_GA4_MEASUREMENT_ID` and `NEXT_PUBLIC_APP_URL` in Coolify.**~~
   **Keith set them, 2026-09-15.** ⚠ Re-check them against the deployed build in Gate C3 of
   the go-live plan anyway, and check **positively**: the absence of a failure confirms nothing
   for *these two*. 🔄 **Amended 2026-09-17:** this used to reason from `lib/supabase/env.ts`'s
   silent fallback, which A3 has since removed — a missing Supabase variable now throws. The
   instruction stands unchanged because **it never depended on Supabase**: an unset
   `NEXT_PUBLIC_GA4_MEASUREMENT_ID` renders no tag and, because `CookieConsent` gates on the same
   variable, no banner either — consistent, invisible and wrong — and `NEXT_PUBLIC_APP_URL`
   falls back to a literal that is correct in production by coincidence. Those are the two this
   item is actually about.
2. ✅ ~~**Decide S2-2** — the unauthenticated kit-dispatch endpoint.~~ **Decided and done,
   2026-09-15: the route is REMOVED**, its body extracted to `lib/vitall/dispatchKit.ts`,
   after Gate 3 was proved on a live purchase. What survives is a smaller decision, carried to
   Gate D: `dispatchKit` still ships a kit for an order at `pending`, `cancelled`, `refunded`
   or `on_hold`.

⚠ **Both of these read as outstanding for a day after they were done**, which is the same
failure as the CA-045 row at the top of this file. **A "still owed" list is only as good as the
discipline of striking things off it**, and nothing here strikes itself off. The go-live plan
carries the tick boxes for exactly this reason.

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

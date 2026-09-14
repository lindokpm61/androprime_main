# Route conformance: Direction F

**36 of 36 measurable routes RENDER Direction F chrome and layout (100%).** Measured 2026-09-14.
A further **7** could not be measured anonymously; they are listed below with the reason.

<!-- GENERATED FILE. Do not edit by hand: run `npm run route-conformance` with a dev
     server up. `verify-route-conformance.js` runs in `npm test` and fails if this
     file no longer describes the repo. -->

A route counts as Direction F when it renders at least one `f-`/`fb-` class OUTSIDE
the shared chrome. The chrome is excluded by landmark (`<header>`, `<footer>`, the
cookie banner) rather than by subtracting a remembered class count, because the nav
and footer are worn by every route including the ones still on the old design.

🔴 **THAT IS A TEST OF PRESENCE, AND THE HEADLINE USED TO OVERSTATE IT.** It read
"*36 of 36 measurable routes are Direction F*", which is what everybody
was reading, and it is a stronger claim than anything measured here. **This file asks
whether a route renders SOME Direction F. It never asks whether the retired V2.0
vocabulary is ABSENT, and it cannot see inside a component**, because its unit is a
rendered route.

On 2026-09-12 that gap was worth five live components. This file read 36 of 36 while
`BundleChoice` (41 V2.0 tokens, 0 F classes) was on all three kit detail pages,
`PasswordBanner` (32) opened the results dashboard, `NewsletterForm` (27) was the
blog's only email capture, and both error boundaries (18 and 21) had never been
touched — an error boundary has no route, so no sweep that works from a route list
has ever reached one. Defect register C1 to C4.

**The absence question is asked by `scripts/verify-retired-vocabulary.js`**, which
runs in `npm test`, reads className attributes in `app/` and `components/` rather
than rendered routes, and fails when the retired vocabulary appears outside a dated,
shrinking allowlist. **`scripts/verify-dead-components.js`** asks the third question
this file cannot: whether a component has a consumer at all. Read the three together;
a green line here means chrome and layout, not a finished route.

## Rebuilt (36)

| Route | F classes | Source |
|---|---|---|
| `/` | 82 | `app/(marketing)/page.tsx` |
| `/about` | 54 | `app/(marketing)/about/page.tsx` |
| `/auth/consent` | 18 | `app/auth/consent/page.tsx` |
| `/auth/link` | 19 | `app/auth/link/page.tsx` |
| `/auth/login` | 21 | `app/auth/login/page.tsx` |
| `/auth/reset` | 19 | `app/auth/reset/page.tsx` |
| `/auth/signup` | 22 | `app/auth/signup/page.tsx` |
| `/authors/[slug]` | 24 | `app/(marketing)/authors/[slug]/page.tsx` |
| `/blog` | 40 | `app/(marketing)/blog/page.tsx` |
| `/blog/[slug]` | 34 | `app/(marketing)/blog/[slug]/page.tsx` |
| `/checkout/details` | 30 | `app/(marketing)/checkout/details/page.tsx` |
| `/contact` | 47 | `app/(marketing)/contact/page.tsx` |
| `/faq` | 54 | `app/(marketing)/faq/page.tsx` |
| `/how-it-works` | 61 | `app/(marketing)/how-it-works/page.tsx` |
| `/how-to-sample` | 33 | `app/(marketing)/how-to-sample/page.tsx` |
| `/kits` | 78 | `app/(marketing)/kits/page.tsx` |
| `/kits/energy-recovery` | 76 | `app/(marketing)/kits/energy-recovery/page.tsx` |
| `/kits/hormone-recovery` | 91 | `app/(marketing)/kits/hormone-recovery/page.tsx` |
| `/kits/testosterone` | 80 | `app/(marketing)/kits/testosterone/page.tsx` |
| `/lp/collagen` | 50 | `app/lp/collagen/page.tsx` |
| `/lp/daily-stack` | 50 | `app/lp/daily-stack/page.tsx` |
| `/lp/energy-recovery` | 65 | `app/lp/energy-recovery/page.tsx` |
| `/lp/hormone-recovery` | 76 | `app/lp/hormone-recovery/page.tsx` |
| `/lp/testosterone` | 67 | `app/lp/testosterone/page.tsx` |
| `/membership` | 51 | `app/(marketing)/membership/page.tsx` |
| `/not-found` | 19 | `app/not-found.tsx` |
| `/order/confirmed` | 33 | `app/(marketing)/order/confirmed/page.tsx` |
| `/privacy` | 8 | `app/(marketing)/privacy/page.tsx` |
| `/subscription/confirmed` | 15 | `app/(marketing)/subscription/confirmed/page.tsx` |
| `/supplement-waitlist` | 43 | `app/(marketing)/supplement-waitlist/page.tsx` |
| `/supplements` | 42 | `app/(marketing)/supplements/page.tsx` |
| `/supplements/collagen` | 59 | `app/(marketing)/supplements/collagen/page.tsx` |
| `/supplements/daily-stack` | 54 | `app/(marketing)/supplements/daily-stack/page.tsx` |
| `/terms` | 8 | `app/(marketing)/terms/page.tsx` |
| `/test-selector` | 45 | `app/(marketing)/test-selector/page.tsx` |
| `/waitlist` | 46 | `app/(marketing)/waitlist/page.tsx` |

## Not rebuilt (0)

| Route | F classes | Source |
|---|---|---|


## Not measured (7)

Rendered and refused, so their conformance is genuinely unknown rather than zero.
A redirect means an anonymous visitor gets the login page, and counting the login
page's classes would score every gated route with whatever `/auth/login` wears.

| Route | Why | Static signal | Source |
|---|---|---|---|
| `/account` | redirects to `/auth/login` for an anonymous visitor | 26 F classes in source | `app/(app)/account/page.tsx` |
| `/account/membership` | redirects to `/auth/login` for an anonymous visitor | 14 F classes in source | `app/(app)/account/membership/page.tsx` |
| `/founding-member-status` | redirects to `/auth/login` for an anonymous visitor | **renders no markup** (a redirect or notFound: not a restyle) | `app/(app)/founding-member-status/page.tsx` |
| `/results-dashboard` | redirects to `/auth/login` for an anonymous visitor | 19 F classes in source | `app/(app)/results-dashboard/page.tsx` |
| `/results-dashboard/handoff` | redirects to `/auth/login` for an anonymous visitor | 14 F classes in source | `app/(app)/results-dashboard/handoff/page.tsx` |
| `/subscriptions` | redirects to `/auth/login` for an anonymous visitor | 15 F classes in source | `app/(app)/subscriptions/page.tsx` |
| `/supplement-waitlist-status` | redirects to `/auth/login` for an anonymous visitor | 8 F classes in source | `app/(app)/supplement-waitlist-status/page.tsx` |

## Excluded from the count (7)

🔴 **THESE ROWS USED TO BE THE ONLY UNCHECKED PROSE IN A GENERATED FILE, AND ONE
OF THEM HID A CUSTOMER-FACING PAGE FOR SIX BATCHES.** `/go` was excluded as
*"internal redirect, no UI"* — a correct description of `/go/[slug]`, not of
`/go`, which is the link-in-bio grid every Instagram visitor lands on. Every
pass read the exclusion as a category and skipped the row. Since 2026-09-14 each
exclusion names a fact in the route's own source, and **this report refuses to
generate if any of those facts has stopped being true** (defect R1).

**Checked** is mechanical and runs in `npm test`. **Reviewed** is the date a
human last asked whether the fact still *justifies* the exclusion, which no grep
can answer — a reason can be perfectly true and no longer sufficient. Age is
reported and never fatal; there is no principled expiry, and a check that cries
wolf gets switched off.

| Route | Why | Checked against source | Reviewed |
|---|---|---|---|
| `/founding-member` | retired, 307s to /kits | `/redirect\(\s*['"]\/kits['"]\s*\)/` in `app/(marketing)/founding-member/page.tsx` | 2026-09-12 (2 days ago) |
| `/activate` | retired 2026-09-12, 307s to /how-to-sample (deprecated by the QR decision of 2026-06-12) | `/redirect\(\s*['"]\/how-to-sample['"]\s*\)/` in `app/activate/page.tsx` | 2026-09-12 (2 days ago) |
| `/admin/dashboard` | admin-gated internal tool, no public UI (Direction F since 2026-09-12) | `/isAdmin\(/` in `app/(internal)/admin/dashboard/page.tsx` | 2026-09-12 (2 days ago) |
| `/ops/content` | admin-gated internal tool, no public UI (Direction F since 2026-09-12) | `/isAdmin\(/` in `app/(internal)/ops/content/page.tsx` | 2026-09-12 (2 days ago) |
| `/go` | renders a `bio_grid_view` analytics event on every load, so a sweep would pollute the campaign it measures (Direction F since 2026-09-12) | `/trackEvent\(\s*['"]bio_grid_view['"]/` in `app/go/page.tsx` | 2026-09-12 (2 days ago) |
| `/blog/preview/[slug]` | internal preview of an unpublished draft, behind a shared token (Direction F: it renders ArticleLayout) | `/token\s*!==\s*expected/` and `/notFound\(\)/` in `app/(marketing)/blog/preview/[slug]/page.tsx` | 2026-09-12 (2 days ago) |
| `/demo` | runs the authenticated app shell (`ap-*`), not the marketing layer, so Direction F is the wrong question | `/(?<![A-Za-z0-9_-])ap-[a-z][a-z0-9_-]*/` in `app/(demo)/demo/page.tsx` | 2026-09-12 (2 days ago) |

## F classes defined and rendered nowhere (259)

These exist in the stylesheets and appear on no route THIS RUN COULD REACH. Each
route is loaded once, anonymously, and never interacted with, so the list below is
split by whether any marketing source file still asks for the class. This replaces
the retired `reconcile-f-css.js` "unpaired selectors" figure, measured against
rendered routes rather than against the journey frames.

### Asked for by a source file, so not dead (233)

**Do not read this group as deletable.** Something renders them; this run did not
see them, and there are three separate reasons for that, so absence here is not
evidence of absence:

1. **Excluded by design.** A route's class set deliberately omits the shared
   chrome, counted by landmark, so `.f-nav`, `.f-footer` and the cookie banner's
   classes render on every route and appear in none of the counts.
2. **Behind an interaction.** Each route is loaded once and never clicked. The
   form controls on `/test-selector` are at step 4 of a five-step quiz.
3. **Behind a request state.** An error or success block needs a POST to have
   failed or succeeded.

⚠ The old wording put all of these under "waiting for a page, or dead", which was
wrong about most of the list: it is 233 of 259.

`.f-addrgrid`, `.f-addrwide`, `.f-adh`, `.f-adh-b`, `.f-adh-miss`, `.f-adh-now`, `.f-adh-st`, `.f-adhaxis`, `.f-appdot`, `.f-appfoot`, `.f-appfoot-in`, `.f-appfoot-note`, `.f-appmain`, `.f-appshell`, `.f-appside`, `.f-appside-foot`, `.f-appside-p`, `.f-appstrip`, `.f-appstrip-in`, `.f-appstrip-r`, `.f-appwrap`, `.f-banner`, `.f-banner-err`, `.f-banner-k`, `.f-banner-msg`, `.f-bar`, `.f-bline`, `.f-bline-v`, `.f-burger`, `.f-chip`, `.f-chips`, `.f-chk`, `.f-chkrow`, `.f-cookie`, `.f-cookieacts`, `.f-cookielink`, `.f-cookiewrap`, `.f-counts`, `.f-counts-k`, `.f-counts-n`, `.f-drawer`, `.f-dsplit`, `.f-dstate`, `.f-err`, `.f-foot`, `.f-footbar`, `.f-footer`, `.f-footlink`, `.f-handoff`, `.f-handoff-ctl`, `.f-handoff-fine`, `.f-handoff-head`, `.f-handoff-id`, `.f-handoff-in`, `.f-handoff-note`, `.f-handoff-q`, `.f-handoff-sec`, `.f-handoff-t`, `.f-histhead`, `.f-histkit`, `.f-histlab`, `.f-histref`, `.f-histrow`, `.f-histwait`, `.f-histwhen`, `.f-inclu`, `.f-int`, `.f-int-bad`, `.f-int-counts`, `.f-int-empty`, `.f-int-lead`, `.f-int-num`, `.f-int-ok`, `.f-int-table`, `.f-int-tablewrap`, `.f-int-tag`, `.f-int-warn`, `.f-int-when`, `.f-intfoot`, `.f-inthead`, `.f-intlist`, `.f-intpanel`, `.f-intpanel-body`, `.f-intpanel-sub`, `.f-intsearch`, `.f-intstrip`, `.f-intstrip-in`, `.f-intstrip-r`, `.f-intsub`, `.f-intwrap`, `.f-legal`, `.f-logo`, `.f-mkbadge`, `.f-mkbadge-on`, `.f-mkbar`, `.f-mkblock`, `.f-mkdet`, `.f-mkfoot`, `.f-mkfoot-b`, `.f-mkgate`, `.f-mklab-r`, `.f-mklabels`, `.f-mkname`, `.f-mkneedle`, `.f-mkread`, `.f-mkref`, `.f-mktrack`, `.f-mkval`, `.f-nav`, `.f-navcta`, `.f-navcta-wrap`, `.f-navlinks`, `.f-navlogin`, `.f-navright`, `.f-navshell`, `.f-navstat`, `.f-oref`, `.f-pfield`, `.f-pfield-k`, `.f-pfield-v`, `.f-pinput`, `.f-plot`, `.f-plot-area`, `.f-plot-axis`, `.f-plot-d`, `.f-plot-dates`, `.f-plot-dot`, `.f-plot-dot-next`, `.f-plot-dot-now`, `.f-plot-line`, `.f-plot-pending`, `.f-plot-pt`, `.f-plot-svg`, `.f-plot-v`, `.f-plot-v-next`, `.f-plot-v-now`, `.f-prog`, `.f-prog-done`, `.f-prog-lab`, `.f-prog-mark`, `.f-prog-now`, `.f-prog-s`, `.f-pwd`, `.f-pwd-acts`, `.f-pwd-fields`, `.f-pwd-in`, `.f-pwd-row`, `.f-pwd-save`, `.f-pwd-t`, `.f-pwd-x`, `.f-qlink`, `.f-qlink-n`, `.f-rdue`, `.f-read`, `.f-read-s`, `.f-rescap`, `.f-rhead`, `.f-rhead-top`, `.f-rsel`, `.f-rsum`, `.f-saverow`, `.f-scopenote`, `.f-scrolled`, `.f-sel`, `.f-srun`, `.f-stat`, `.f-stat-c`, `.f-stat-n`, `.f-stat-o`, `.f-stat-w`, `.f-subfoot`, `.f-subprice`, `.f-subtop`, `.f-tab`, `.f-tab-on`, `.f-tabs`, `.f-tap`, `.f-tap-k`, `.f-tap-on`, `.f-tap-pip-on`, `.f-tap-sc`, `.f-tap-v`, `.f-taps`, `.f-taps-err`, `.f-waitcard`, `.f-waitcard-b`, `.f-waitcard-sub`, `.f-waitgrid`, `.f-wtplab`, `.f-wtprow`, `.fb-alert`, `.fb-alert-act`, `.fb-alert-bd`, `.fb-alert-h`, `.fb-alert-k`, `.fb-arthead`, `.fb-byline`, `.fb-byline-av`, `.fb-byline-col`, `.fb-byline-dates`, `.fb-byline-n`, `.fb-byline-r`, `.fb-bylines`, `.fb-caveat`, `.fb-clin`, `.fb-clin-foot`, `.fb-clin-in`, `.fb-clin-k`, `.fb-clin-q`, `.fb-credit`, `.fb-crumb`, `.fb-cta`, `.fb-cta-body`, `.fb-cta-in`, `.fb-figure`, `.fb-mchips`, `.fb-metabar`, `.fb-note`, `.fb-now`, `.fb-num`, `.fb-num-feat`, `.fb-num-n`, `.fb-pshot-og`, `.fb-pub`, `.fb-pub-src`, `.fb-punch`, `.fb-refs`, `.fb-refs-h`, `.fb-stand`, `.fb-stat`, `.fb-stat-k`, `.fb-sys`, `.fb-sys-chip`

### In no source file at all (26)

Either a component waiting for a page that has not been rebuilt, or dead. This is
the group to read when looking for something to delete, and even here a class may
be waiting: 0 routes are still on the old design.

`.f-btn-on`, `.f-c-12`, `.f-core-dark`, `.f-in`, `.f-kitaside`, `.f-kitfoot`, `.f-kitgrid`, `.f-kitprice`, `.f-kittitle`, `.f-lab`, `.f-oneoff`, `.f-out`, `.f-rep`, `.f-row-top`, `.f-shot-band`, `.f-spec-open`, `.f-st`, `.f-st-hot`, `.f-sub2`, `.f-total`, `.f-tray-dark`, `.f-val`, `.fb-authav`, `.fb-stat-big`, `.fb-tablewrap`, `.fb-wrap`

---

_Generated by `frontend/scripts/route-conformance.js` on 2026-09-14. 43 routes
rendered at 1440px against a dev server, each on the host that serves it (`/auth`, `/results-dashboard`, `/account`, `/subscriptions`, `/founding-member-status`, `/supplement-waitlist-status`, `/order/confirmed`, `/subscription/confirmed` on the app host, everything else on the apex). Dark-launch flags on for this run, inferred from the routes that rendered: `MEMBERSHIP_ENABLED=true`._

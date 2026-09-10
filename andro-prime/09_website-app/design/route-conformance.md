# Route conformance: Direction F

**26 of 36 measurable routes are Direction F (72%).** Measured 2026-09-09.
A further **7** could not be measured anonymously; they are listed below with the reason.

<!-- GENERATED FILE. Do not edit by hand: run `npm run route-conformance` with a dev
     server up. `verify-route-conformance.js` runs in `npm test` and fails if this
     file no longer describes the repo. -->

A route counts as Direction F when it renders at least one `f-`/`fb-` class OUTSIDE
the shared chrome. The chrome is excluded by landmark (`<header>`, `<footer>`, the
cookie banner) rather than by subtracting a remembered class count, because the nav
and footer are worn by every route including the ones still on the old design.

## Rebuilt (26)

| Route | F classes | Source |
|---|---|---|
| `/` | 81 | `app/(marketing)/page.tsx` |
| `/about` | 53 | `app/(marketing)/about/page.tsx` |
| `/auth/consent` | 17 | `app/auth/consent/page.tsx` |
| `/auth/link` | 18 | `app/auth/link/page.tsx` |
| `/auth/login` | 20 | `app/auth/login/page.tsx` |
| `/auth/reset` | 18 | `app/auth/reset/page.tsx` |
| `/auth/signup` | 21 | `app/auth/signup/page.tsx` |
| `/authors/[slug]` | 23 | `app/(marketing)/authors/[slug]/page.tsx` |
| `/blog` | 36 | `app/(marketing)/blog/page.tsx` |
| `/blog/[slug]` | 30 | `app/(marketing)/blog/[slug]/page.tsx` |
| `/contact` | 46 | `app/(marketing)/contact/page.tsx` |
| `/faq` | 53 | `app/(marketing)/faq/page.tsx` |
| `/how-it-works` | 60 | `app/(marketing)/how-it-works/page.tsx` |
| `/kits` | 77 | `app/(marketing)/kits/page.tsx` |
| `/kits/energy-recovery` | 75 | `app/(marketing)/kits/energy-recovery/page.tsx` |
| `/kits/hormone-recovery` | 90 | `app/(marketing)/kits/hormone-recovery/page.tsx` |
| `/kits/testosterone` | 79 | `app/(marketing)/kits/testosterone/page.tsx` |
| `/membership` | 51 | `app/(marketing)/membership/page.tsx` |
| `/privacy` | 7 | `app/(marketing)/privacy/page.tsx` |
| `/supplement-waitlist` | 42 | `app/(marketing)/supplement-waitlist/page.tsx` |
| `/supplements` | 41 | `app/(marketing)/supplements/page.tsx` |
| `/supplements/collagen` | 58 | `app/(marketing)/supplements/collagen/page.tsx` |
| `/supplements/daily-stack` | 53 | `app/(marketing)/supplements/daily-stack/page.tsx` |
| `/terms` | 7 | `app/(marketing)/terms/page.tsx` |
| `/test-selector` | 44 | `app/(marketing)/test-selector/page.tsx` |
| `/waitlist` | 45 | `app/(marketing)/waitlist/page.tsx` |

## Not rebuilt (10)

| Route | F classes | Source |
|---|---|---|
| `/activate` | 0 | `app/activate/page.tsx` |
| `/checkout/details` | 0 | `app/(marketing)/checkout/details/page.tsx` |
| `/lp/collagen` | 0 | `app/lp/collagen/page.tsx` |
| `/lp/daily-stack` | 0 | `app/lp/daily-stack/page.tsx` |
| `/lp/energy-recovery` | 0 | `app/lp/energy-recovery/page.tsx` |
| `/lp/hormone-recovery` | 0 | `app/lp/hormone-recovery/page.tsx` |
| `/lp/testosterone` | 0 | `app/lp/testosterone/page.tsx` |
| `/not-found` | 0 | `app/not-found.tsx` |
| `/order/confirmed` | 0 | `app/(marketing)/order/confirmed/page.tsx` |
| `/subscription/confirmed` | 0 | `app/(marketing)/subscription/confirmed/page.tsx` |

## Not measured (7)

Rendered and refused, so their conformance is genuinely unknown rather than zero.
A redirect means an anonymous visitor gets the login page, and counting the login
page's classes would score every gated route with whatever `/auth/login` wears.

| Route | Why | Static signal | Source |
|---|---|---|---|
| `/account` | redirects to `/auth/login` for an anonymous visitor | **no F markers in source** | `app/(app)/account/page.tsx` |
| `/account/membership` | redirects to `/auth/login` for an anonymous visitor | **no F markers in source** | `app/(app)/account/membership/page.tsx` |
| `/founding-member-status` | redirects to `/auth/login` for an anonymous visitor | **no F markers in source** | `app/(app)/founding-member-status/page.tsx` |
| `/results-dashboard` | redirects to `/auth/login` for an anonymous visitor | **no F markers in source** | `app/(app)/results-dashboard/page.tsx` |
| `/results-dashboard/handoff` | redirects to `/auth/login` for an anonymous visitor | **no F markers in source** | `app/(app)/results-dashboard/handoff/page.tsx` |
| `/subscriptions` | redirects to `/auth/login` for an anonymous visitor | **no F markers in source** | `app/(app)/subscriptions/page.tsx` |
| `/supplement-waitlist-status` | redirects to `/auth/login` for an anonymous visitor | **no F markers in source** | `app/(app)/supplement-waitlist-status/page.tsx` |

## Excluded from the count (6)

| Route | Why |
|---|---|
| `/founding-member` | retired, 307s to /kits |
| `/admin/dashboard` | internal, no public UI |
| `/ops/content` | internal, no public UI |
| `/go` | internal redirect, no UI |
| `/blog/preview/[slug]` | internal preview of an unpublished draft |
| `/demo` | runs the authenticated app shell (`ap-*`), not the marketing layer, so Direction F is the wrong question |

## F classes defined and rendered nowhere (104)

These exist in the stylesheets and appear on no route THIS RUN COULD REACH. Each
route is loaded once, anonymously, and never interacted with, so the list below is
split by whether any marketing source file still asks for the class. This replaces
the retired `reconcile-f-css.js` "unpaired selectors" figure, measured against
rendered routes rather than against the journey frames.

### Asked for by a source file, so not dead (78)

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
wrong about most of the list: it is 78 of 104.

`.f-banner`, `.f-banner-err`, `.f-banner-k`, `.f-banner-msg`, `.f-bar`, `.f-burger`, `.f-chip`, `.f-chips`, `.f-cookie`, `.f-cookieacts`, `.f-cookielink`, `.f-cookiewrap`, `.f-drawer`, `.f-err`, `.f-foot`, `.f-footbar`, `.f-footer`, `.f-footlink`, `.f-legal`, `.f-logo`, `.f-nav`, `.f-navcta`, `.f-navcta-wrap`, `.f-navlinks`, `.f-navlogin`, `.f-navright`, `.f-navshell`, `.f-navstat`, `.f-pinput`, `.f-rescap`, `.f-scrolled`, `.f-sel`, `.f-stat`, `.f-wtplab`, `.f-wtprow`, `.fb-alert`, `.fb-alert-act`, `.fb-alert-bd`, `.fb-alert-h`, `.fb-alert-k`, `.fb-arthead`, `.fb-byline`, `.fb-byline-av`, `.fb-byline-col`, `.fb-byline-dates`, `.fb-byline-n`, `.fb-byline-r`, `.fb-bylines`, `.fb-caveat`, `.fb-clin`, `.fb-clin-foot`, `.fb-clin-in`, `.fb-clin-k`, `.fb-clin-q`, `.fb-credit`, `.fb-crumb`, `.fb-cta`, `.fb-cta-body`, `.fb-cta-in`, `.fb-figure`, `.fb-mchips`, `.fb-metabar`, `.fb-note`, `.fb-now`, `.fb-num`, `.fb-num-feat`, `.fb-num-n`, `.fb-pshot-og`, `.fb-pub`, `.fb-pub-src`, `.fb-punch`, `.fb-refs`, `.fb-refs-h`, `.fb-stand`, `.fb-stat`, `.fb-stat-k`, `.fb-sys`, `.fb-sys-chip`

### In no source file at all (26)

Either a component waiting for a page that has not been rebuilt, or dead. This is
the group to read when looking for something to delete, and even here a class may
be waiting: 10 routes are still on the old design.

`.f-btn-on`, `.f-c-12`, `.f-core-dark`, `.f-in`, `.f-kitaside`, `.f-kitfoot`, `.f-kitgrid`, `.f-kitprice`, `.f-kittitle`, `.f-lab`, `.f-oneoff`, `.f-out`, `.f-rep`, `.f-row-top`, `.f-shot-band`, `.f-spec-open`, `.f-st`, `.f-st-hot`, `.f-sub2`, `.f-total`, `.f-tray-dark`, `.f-val`, `.fb-authav`, `.fb-stat-big`, `.fb-tablewrap`, `.fb-wrap`

---

_Generated by `frontend/scripts/route-conformance.js` on 2026-09-09. 43 routes
rendered at 1440px against a dev server, each on the host that serves it (`/auth`, `/results-dashboard`, `/account`, `/subscriptions`, `/founding-member-status`, `/supplement-waitlist-status`, `/order/confirmed`, `/subscription/confirmed` on the app host, everything else on the apex). Dark-launch flags on for this run, inferred from the routes that rendered: `MEMBERSHIP_ENABLED=true`._

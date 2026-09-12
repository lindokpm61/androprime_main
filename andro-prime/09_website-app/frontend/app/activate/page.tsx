import { redirect } from 'next/navigation'

/**
 * DEPRECATED 2026-06-12, RETIRED 2026-09-12. It now redirects to
 * `/how-to-sample`, which is the replacement the deprecation decision named.
 *
 * WHAT THIS USED TO BE: a login-gated, per-order kit-activation screen with
 * five states (signed out, no kit code, kit not found, wrong account, already
 * activated) wrapped around five instruction steps. It was deprecated because
 * it was redundant for both of its jobs — auth already happens passwordlessly
 * at `/auth/post-checkout`, and Vitall links the sample to the customer at
 * dispatch, so results flow whether anyone scans anything or not. Decision:
 * `docs/2026-06-12-activate-qr-deprecation.md`, owner Keith.
 *
 * 🔴 IT ALSO NEVER SOLVED ITS OWN PRECONDITION. The QR had to encode an order
 * UUID that only exists after purchase, while Vitall fulfils the physical box,
 * so nothing was ever printing a per-order code. The flow was served and
 * unreachable for its entire life.
 *
 * The five instruction steps are the only part that survives, and they are on
 * `/how-to-sample` byte-identical. The body of this page is preserved in git
 * history; `redesign/direction-f` up to bc11c6e has the last rendering version.
 *
 * ⚠ WHAT IS LEFT BEHIND, and left behind on purpose. `app/api/activate/route.ts`,
 * `lib/activate/*` and `components/activate/*` still exist, still carry their
 * deprecation headers, and now have no caller. The deprecation decision chose
 * marked-not-deleted so the call could be reversed; deleting them is a separate
 * sweep with its own blast radius (`getKitActivation` is one of the 21 files
 * holding a hardcoded kit name, per copy-register row 16). Recorded rather than
 * done.
 *
 * ⚠ `app/activate/layout.tsx` and `styles/pages/activate.css` ARE deleted, since
 * both existed only to chrome and style a body that no longer renders. That
 * takes the V2.0 page stylesheets from two standing to one: `dashboard-panels.css`
 * is the last, held open by `DevFixtureBar` and the `status-indicator--*` set.
 */
export default function ActivatePage() {
  redirect('/how-to-sample')
}

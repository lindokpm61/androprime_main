import { redirect } from 'next/navigation'

// RETIRED 2026-07-22. The founding-member programme is closed: the join API
// 410s, /founding-member redirects to /kits, and the founding_member_list table
// holds no rows. This status page used to render the member's list state; it now
// redirects to /account. Mirrors app/(marketing)/founding-member/page.tsx.
// The redirect runs after middleware auth (see middleware.ts protectedRoutes),
// which is harmless. The original page body is preserved in git history.
//
// ─────────────────────────────────────────────────────────────────────────
// 🔴 NOT A RESTYLE, AND IT WAS ON THE BATCH-3 LIST AS ONE. Recorded here on
// 2026-09-11 so the next reader does not schedule it a third time.
//
// `design/route-conformance.md` lists this route among the gated seven and
// annotates it "no F markers in source", which reads as a page awaiting a
// rebuild. It is true and it means nothing: THIS FILE RENDERS NO MARKUP AT ALL.
// A redirect has no classes to count, so the static fallback cannot tell it
// apart from a page that genuinely needs the work.
//
// This is the THIRD route to be scheduled for design work that a header comment
// had already retired, after `/activate` (deprecated by the QR decision, caught
// in batch 1) and this one, which `account-F.html` caught when it was drawn:
// that frame prints "There is nothing to draw" as Frame M and says it is kept
// only "so the inventory stops counting it". The frame was right and the
// conformance report still counts it.
//
// The fix belongs in the report, not here: the static signal should say
// "renders no markup" rather than "no F markers in source". Logged as
// task-observer OBS-714.
export default function FoundingMemberStatusPage() {
  redirect('/account')
}

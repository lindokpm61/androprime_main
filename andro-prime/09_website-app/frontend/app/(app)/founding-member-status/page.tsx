import { redirect } from 'next/navigation'

// RETIRED 2026-07-22. The founding-member programme is closed: the join API
// 410s, /founding-member redirects to /kits, and the founding_member_list table
// holds no rows. This status page used to render the member's list state; it now
// redirects to /account. Mirrors app/(marketing)/founding-member/page.tsx.
// The redirect runs after middleware auth (see middleware.ts protectedRoutes),
// which is harmless. The original page body is preserved in git history.
export default function FoundingMemberStatusPage() {
  redirect('/account')
}

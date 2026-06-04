import { redirect } from 'next/navigation'

// DISABLED 2026-06-04 (FM take-down — low-T routing decision). The founding-member
// list is closed pending a lawful basis (solicitor task 869d99kzh). This page used
// to render the public opt-in (JoinForm). It now redirects to /kits. The original
// page body is preserved in git history; restore it to reopen the list.
// See 04_products/results-engine/2026-06-04-low-t-routing-decision.md §6.
export default function FoundingMemberPage() {
  redirect('/kits')
}

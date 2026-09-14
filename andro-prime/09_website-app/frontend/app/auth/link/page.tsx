import type { Metadata } from 'next'
import { AuthCard } from '@/components/auth/AuthCard'
import { sendLoginLinkAction } from '@/lib/auth/actions'

/* The card's own heading as the document title, and noindex stated in the page
   as well as in `robots.txt`. Register M2; the reasoning is written out once,
   in `app/auth/login/page.tsx`.

   ⚠ M2's own text lists FOUR routes and then says "these five pages". The fifth
   is this one. It was fixed with the other four rather than left to be found
   again by the next sweep. */
export const metadata: Metadata = {
  title: 'Get a Sign-In Link',
  robots: { index: false, follow: false },
}

type LinkPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function MagicLinkPage({ searchParams }: LinkPageProps) {
  const params = await searchParams

  return (
    <AuthCard
      mode="link"
      title="Get a Sign-In Link"
      description="Enter your email and we'll send a one-time link to sign in. No password needed. It's the quickest way back to your results."
      action={sendLoginLinkAction}
      nextPath={readParam(params.next)}
      message={readParam(params.message)}
      error={readParam(params.error)}
    />
  )
}

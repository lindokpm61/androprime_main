import type { Metadata } from 'next'
import { AuthCard } from '@/components/auth/AuthCard'
import { loginAction } from '@/lib/auth/actions'

/**
 * THE TITLE IS THE CARD'S OWN HEADING, and it is here because all five
 * `/auth/*` routes rendered the root `title.default` — "Andro Prime | Premium
 * At-Home Blood Tests for Men" — which is what Next serves when a page exports
 * no title at all. Register M2.
 *
 * ⚠ NOT A SEARCH PROBLEM. `robots.txt` already disallows `/auth/`. It is a
 * CUSTOMER problem: a man following a reset link has the login page, the reset
 * page and the site open in three tabs at once, all labelled identically, and
 * the reset flow is the single moment he is most likely to have them all open.
 * `robots: { index: false }` is stated here as well as in `robots.txt` because a
 * disallowed page can still be indexed from an inbound link — the same reasoning
 * `/go` records, and the two halves are not interchangeable.
 *
 * The title is the string `AuthCard` already renders as the card heading, so no
 * new words enter the product.
 */
export const metadata: Metadata = {
  title: 'Access Your Results',
  robots: { index: false, follow: false },
}

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams

  return (
    <AuthCard
      mode="login"
      title="Access Your Results"
      description="Your results, recommendations, and order history are waiting. Log in to access your private dashboard."
      action={loginAction}
      nextPath={readParam(params.next)}
      message={readParam(params.message)}
      error={readParam(params.error)}
    />
  )
}

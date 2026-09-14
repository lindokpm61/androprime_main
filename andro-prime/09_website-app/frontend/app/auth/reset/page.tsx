import type { Metadata } from 'next'
import { AuthCard } from '@/components/auth/AuthCard'
import { resetPasswordAction } from '@/lib/auth/actions'

/* The card's own heading as the document title, and noindex stated in the page
   as well as in `robots.txt`. Register M2; the reasoning is written out once,
   in `app/auth/login/page.tsx`. This is the route that reasoning is about — a
   man resetting a password is the one with three identical tabs open. */
export const metadata: Metadata = {
  title: 'Reset Your Password',
  robots: { index: false, follow: false },
}

type ResetPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function ResetPage({ searchParams }: ResetPageProps) {
  const params = await searchParams

  return (
    <AuthCard
      mode="reset"
      title="Reset Your Password"
      description="Request a password reset email for the account linked to your Andro Prime lab history and dashboard access."
      action={resetPasswordAction}
      message={readParam(params.message)}
      error={readParam(params.error)}
    />
  )
}

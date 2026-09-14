import type { Metadata } from 'next'
import { AuthCard } from '@/components/auth/AuthCard'
import { signupAction } from '@/lib/auth/actions'

/* The card's own heading as the document title, and noindex stated in the page
   as well as in `robots.txt`. Register M2; the reasoning is written out once,
   in `app/auth/login/page.tsx`. */
export const metadata: Metadata = {
  title: 'Create Your Account',
  robots: { index: false, follow: false },
}

type SignupPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams

  return (
    <AuthCard
      mode="signup"
      title="Create Your Account"
      description="Your results go here. Set up your account and every biomarker, recommendation, and report lands in your private dashboard the moment it's ready."
      action={signupAction}
      message={readParam(params.message)}
      error={readParam(params.error)}
    />
  )
}

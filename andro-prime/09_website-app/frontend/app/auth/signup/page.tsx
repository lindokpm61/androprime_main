import { AuthCard } from '@/components/auth/AuthCard'
import { signupAction } from '@/lib/auth/actions'

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
      description="Set up your secure Andro Prime account so purchases, lab results, and future recommendations stay attached to the right profile."
      action={signupAction}
      message={readParam(params.message)}
      error={readParam(params.error)}
    />
  )
}

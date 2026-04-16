import { AuthCard } from '@/components/auth/AuthCard'
import { resetPasswordAction } from '@/lib/auth/actions'

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

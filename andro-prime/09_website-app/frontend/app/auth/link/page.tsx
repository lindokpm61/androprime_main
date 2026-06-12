import { AuthCard } from '@/components/auth/AuthCard'
import { sendLoginLinkAction } from '@/lib/auth/actions'

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
      description="Enter your email and we'll send a one-time link to sign in. No password needed — it's the quickest way back to your results."
      action={sendLoginLinkAction}
      nextPath={readParam(params.next)}
      message={readParam(params.message)}
      error={readParam(params.error)}
    />
  )
}

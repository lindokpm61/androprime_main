import { AuthCard } from '@/components/auth/AuthCard'
import { loginAction } from '@/lib/auth/actions'

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

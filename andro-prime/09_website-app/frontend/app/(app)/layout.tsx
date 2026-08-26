import { Nav } from '@/components/shared/Nav'
import { requireAuthenticatedUser } from '@/lib/auth/session'
import { getCurrentHost } from '@/lib/hosts-server'
import { isMembershipEnabled } from '@/lib/flags'
import '@/styles/components/dashboard-panels.css'
import '@/styles/pages/results-dashboard.css'
import '@/styles/pages/founding-member-status.css'
import '@/styles/pages/subscriptions.css'
import '@/styles/pages/account.css'
import '@/styles/pages/membership.css'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAuthenticatedUser()
  const currentHost = await getCurrentHost()

  return (
    <>
      {/*
        The flag is read HERE, in a server component, and passed down. The nav is
        a client component and cannot read a server-only env var; making the flag
        NEXT_PUBLIC_ to reach it would inline it into the browser bundle at build
        time and break the "live env read, no rebuild" contract every other flag
        in lib/flags.ts holds to.
      */}
      <Nav variant="app" currentHost={currentHost} membershipEnabled={isMembershipEnabled()} />
      <main id="main-content" className="pt-20 min-h-[calc(100vh-5rem)]">{children}</main>
    </>
  )
}

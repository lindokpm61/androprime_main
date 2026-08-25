import { Nav } from '@/components/shared/Nav'
import { requireAuthenticatedUser } from '@/lib/auth/session'
import { getCurrentHost } from '@/lib/hosts-server'
import '@/styles/components/dashboard-panels.css'
import '@/styles/pages/results-dashboard.css'
import '@/styles/pages/founding-member-status.css'
import '@/styles/pages/subscriptions.css'
import '@/styles/pages/account.css'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAuthenticatedUser()
  const currentHost = await getCurrentHost()

  return (
    <>
      <Nav variant="app" currentHost={currentHost} />
      <main id="main-content" className="pt-20 min-h-[calc(100vh-5rem)]">{children}</main>
    </>
  )
}

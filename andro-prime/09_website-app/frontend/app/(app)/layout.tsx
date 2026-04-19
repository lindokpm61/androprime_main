import { Nav } from '@/components/shared/Nav'
import { requireAuthenticatedUser } from '@/lib/auth/session'
import '@/styles/components/dashboard-panels.css'
import '@/styles/pages/results-dashboard.css'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAuthenticatedUser()

  return (
    <>
      <Nav variant="app" />
      <main className="pt-20 min-h-[calc(100vh-5rem)]">{children}</main>
    </>
  )
}

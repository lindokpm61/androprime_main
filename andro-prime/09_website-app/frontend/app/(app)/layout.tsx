import { Nav } from '@/components/shared/Nav'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Nav variant="app" />
      <main className="pt-20 min-h-[calc(100vh-5rem)]">{children}</main>
    </>
  )
}

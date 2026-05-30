import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Nav variant="marketing" />
      <main id="main-content" className="pt-20">{children}</main>
      <Footer />
    </>
  )
}

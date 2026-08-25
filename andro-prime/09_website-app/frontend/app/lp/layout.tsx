import { Nav } from '@/components/shared/Nav'

// Not host-aware, for the same reason as the marketing layout: headers() would
// make every LP dynamic. LPs are apex-only, so the apex default is correct.
export default function LpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Nav variant="lp" />
      <main id="main-content" className="pt-20">{children}</main>
      <div className="border-t-4 border-black py-6">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-sans font-black uppercase tracking-widest text-black text-center">
            &copy; 2026 Andro Prime Ltd. Wellness information service only. Not
            medical advice. Testing by a UKAS ISO 15189 accredited laboratory.
          </p>
        </div>
      </div>
    </>
  )
}

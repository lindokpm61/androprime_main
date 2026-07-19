import { Nav } from '@/components/shared/Nav'

export default function LpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Nav variant="lp" />
      <main id="main-content" className="pt-20">{children}</main>
      <div className="border-t border-black py-6">
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

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
          {/* The SECOND site of the same self-description, changed in the same
              pass as components/shared/Footer.tsx under PRODUCT.md ruling B
              (2026-09-02). Fixing one of two call sites for one fact is worse
              than fixing neither: a duplicated fact is invisible while the
              copies agree, and the first correction is what turns a quiet
              inconsistency into the site saying two different things about what
              the company is. These two cannot be collapsed to one source — the
              LP chrome is deliberately separate from the marketing chrome — so
              they are coupled by this comment and by nothing else. Change both. */}
          <p className="text-xs font-sans font-black uppercase tracking-widest text-black text-center">
            &copy; 2026 Andro Prime Ltd. Men&rsquo;s health information service only. Not
            medical advice. Testing by a UKAS ISO 15189 accredited laboratory.
          </p>
        </div>
      </div>
    </>
  )
}

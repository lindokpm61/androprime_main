import Link from 'next/link'

const diagnosticsLinks = [
  { label: 'Testosterone Profile', href: '/kits/testosterone' },
  { label: 'Energy & Recovery', href: '/kits/energy-recovery' },
  { label: 'Complete Male Axis', href: '/kits/hormone-recovery' },
  { label: 'Diagnostic Quiz', href: '/test-selector' },
]

const companyLinks = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

export function Footer() {
  return (
    <footer className="bg-white border-t-4 border-black pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-16 border-b-2 border-black pb-16">

          {/* Brand column */}
          <div className="md:col-span-6">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-sans font-black text-lg leading-none tracking-tighter">
                AP
              </div>
              <span className="text-black font-sans font-black uppercase tracking-tighter text-3xl">
                AndroPrime
              </span>
            </Link>
            <p className="text-base text-black font-serif leading-relaxed max-w-md">
              Andro Prime is a wellness information service. Our kits show you your
              numbers — they don&apos;t diagnose conditions, replace your GP, or
              constitute medical advice. If you have a health concern, talk to a
              doctor.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center gap-3 text-xs font-sans font-black uppercase tracking-widest text-black px-3 py-2 border-2 border-black">
                <span className="status-dot" />
                UKAS ISO 15189
              </div>
              <div className="flex items-center gap-3 text-xs font-sans font-black uppercase tracking-widest text-black px-3 py-2 border-2 border-black">
                <span className="status-dot" />
                EFSA Regulated
              </div>
            </div>
          </div>

          {/* Diagnostics column */}
          <div className="md:col-span-3">
            <h4 className="text-black font-sans font-black uppercase tracking-tighter text-xl mb-6">
              Diagnostics
            </h4>
            <ul className="space-y-4">
              {diagnosticsLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base font-serif text-black hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div className="md:col-span-3">
            <h4 className="text-black font-sans font-black uppercase tracking-tighter text-xl mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base font-serif text-black hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Copyright bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-sans font-black uppercase tracking-widest text-black">
          <p>
            &copy; 2026 Andro Prime Ltd. Registered in England &amp; Wales. Testing
            carried out by Thriva Solutions, UKAS ISO 15189 accredited. Supplement
            claims are EFSA-approved.
          </p>
          <div className="flex gap-8 shrink-0">
            <span>SYS.STAT: ONLINE</span>
            <span>SEC: AES-256</span>
          </div>
        </div>

      </div>
    </footer>
  )
}

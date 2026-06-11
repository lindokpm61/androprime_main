import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'
import '@/styles/pages/activate.css'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ActivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="h-16 border-b-2 border-black flex items-center justify-center bg-white sticky top-0 z-50">
        <Link
          href="/"
          className="inline-flex hover:opacity-80 transition-opacity"
          aria-label="Andro Prime home"
        >
          <Logo variant="dark" className="h-7 w-auto" />
        </Link>
      </header>
      <main id="main-content" className="pb-20">{children}</main>
    </>
  )
}

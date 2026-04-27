import type { Metadata } from 'next'
import Link from 'next/link'
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
          className="font-black font-sans text-2xl uppercase tracking-tighter text-black hover:opacity-80 transition-opacity"
        >
          AndroPrime
        </Link>
      </header>
      <main className="pb-20">{children}</main>
    </>
  )
}

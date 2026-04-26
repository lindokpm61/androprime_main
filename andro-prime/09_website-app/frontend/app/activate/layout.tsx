import type { Metadata } from 'next'
import Link from 'next/link'
import '@/styles/pages/activate.css'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ActivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="h-16 border-b-2 border-black flex items-center px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-sans font-black text-lg leading-none tracking-tighter transition-transform group-hover:scale-105">
            AP
          </div>
          <span className="text-black font-black font-sans uppercase tracking-tighter text-2xl">
            AndroPrime
          </span>
        </Link>
      </header>
      <main className="pb-20">{children}</main>
    </>
  )
}

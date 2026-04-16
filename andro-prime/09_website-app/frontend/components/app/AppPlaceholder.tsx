import Link from 'next/link'

type AppPlaceholderProps = {
  eyebrow: string
  title: string
  description: string
}

export function AppPlaceholder({
  eyebrow,
  title,
  description,
}: AppPlaceholderProps) {
  return (
    <section className="bg-stone-100 px-6 py-12">
      <div className="mx-auto max-w-5xl border-4 border-black bg-white">
        <div className="border-b-4 border-black bg-black px-8 py-8 text-white">
          <p className="data-label mb-4 text-white">{eyebrow}</p>
          <h1 className="text-4xl uppercase tracking-tight sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-200">
            {description}
          </p>
        </div>

        <div className="grid gap-8 px-8 py-10 md:grid-cols-2">
          <div className="border-2 border-black p-6">
            <p className="data-label mb-3">What Exists Now</p>
            <p className="text-base leading-relaxed">
              Authentication, session-aware routing, and protected app shells are now
              wired. This route is intentionally live so we can verify access control
              before the results engine ships.
            </p>
          </div>
          <div className="border-2 border-black p-6">
            <p className="data-label mb-3">Next Phase</p>
            <p className="text-base leading-relaxed">
              Phase 5 will replace this placeholder with biomarker-driven results
              logic, qualifier gates, and the correct product or GP referral path.
            </p>
          </div>
        </div>

        <div className="border-t-4 border-black px-8 py-6">
          <Link
            href="/auth/logout"
            className="inline-flex border-2 border-black bg-black px-5 py-3 font-sans text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
          >
            Log Out
          </Link>
        </div>
      </div>
    </section>
  )
}

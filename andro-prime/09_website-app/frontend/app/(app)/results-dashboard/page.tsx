import type { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth/session'
import { getDashboardData } from '@/lib/results/getDashboardData'
import { KitTabs } from '@/components/results-engine'
import { DevFixtureBar } from '@/components/results-engine'

export const metadata: Metadata = {
  title: 'Your Results',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ dev?: string }>
}

export default async function ResultsDashboardPage({ searchParams }: PageProps) {
  const user = await getCurrentUser()
  if (!user) return null

  const { dev } = await searchParams
  const data = await getDashboardData(user.id, dev)

  if (data.state === 'no-results') {
    return (
      <div className="results-dashboard">
        <div className="results-dashboard__inner">
          {process.env.NODE_ENV !== 'production' && (
            <DevFixtureBar currentScenario={dev} />
          )}
          <div className="results-holding">
            <p className="data-label text-xs mb-4">Your results</p>
            <h1 className="font-black font-sans text-3xl uppercase tracking-tight mb-4">
              Your results are on their way
            </h1>
            <p className="font-serif text-base text-stone-600 max-w-md mx-auto">
              Once your sample reaches the lab, your results will appear here. Most results are
              ready within 2 to 3 working days.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="results-dashboard">
      <div className="results-dashboard__inner">
        {process.env.NODE_ENV !== 'production' && (
          <DevFixtureBar currentScenario={dev} />
        )}

        <KitTabs kits={data.kits} />

        <div className="results-dashboard__footer">
          <p className="data-label text-xs mb-2">About these results</p>
          <p className="font-serif text-sm" style={{ color: 'var(--color-gray-600)' }}>
            Results are analysed by a UKAS ISO 15189 accredited laboratory. If any marker prompts
            concern, speak to your GP. These results are for information only and do not constitute
            a diagnosis.
          </p>
        </div>
      </div>
    </div>
  )
}

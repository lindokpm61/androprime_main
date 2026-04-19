'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const SCENARIOS: { group: string; scenarios: { name: string; label: string }[] }[] = [
  {
    group: 'Kit 1 — Testosterone',
    scenarios: [
      { name: 'low-testosterone', label: 'Low T' },
      { name: 'normal-testosterone-energy', label: 'Normal T + energy symptoms' },
      { name: 'normal-testosterone-no-energy', label: 'Normal T, no symptoms' },
      { name: 'optimal-testosterone', label: 'Optimal T' },
    ],
  },
  {
    group: 'Kit 2 — Energy & Recovery',
    scenarios: [
      { name: 'elevated-crp', label: 'Elevated CRP (mixed panel)' },
      { name: 'high-crp', label: 'High CRP (GP block)' },
      { name: 'low-vitamin-d', label: 'Low Vitamin D' },
      { name: 'low-ferritin', label: 'Low Ferritin' },
      { name: 'low-b12', label: 'Low B12' },
    ],
  },
  {
    group: 'Kit 3 — Hormone & Recovery',
    scenarios: [{ name: 'multi-deficiency', label: 'Multi-deficiency (all 9 markers)' }],
  },
  {
    group: 'Multi-kit (tabs)',
    scenarios: [
      {
        name: 'low-testosterone,elevated-crp',
        label: 'Kit 1 + Kit 2',
      },
      {
        name: 'low-testosterone,multi-deficiency',
        label: 'Kit 1 + Kit 3',
      },
      {
        name: 'low-testosterone,elevated-crp,multi-deficiency',
        label: 'All three kits',
      },
    ],
  },
]

interface DevFixtureBarProps {
  currentScenario: string | undefined
}

export function DevFixtureBar({ currentScenario }: DevFixtureBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function navigate(scenario: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('dev', scenario)
    router.push(`?${params.toString()}`)
  }

  function clearDev() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('dev')
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="dev-fixture-bar">
      <div className="dev-fixture-bar__header">
        <span className="dev-fixture-bar__label">DEV FIXTURES</span>
        {currentScenario && (
          <button className="dev-fixture-bar__clear" onClick={clearDev}>
            Clear (show real data)
          </button>
        )}
      </div>
      <div className="dev-fixture-bar__groups">
        {SCENARIOS.map((group) => (
          <div key={group.group} className="dev-fixture-bar__group">
            <p className="dev-fixture-bar__group-label">{group.group}</p>
            <div className="dev-fixture-bar__buttons">
              {group.scenarios.map((s) => (
                <button
                  key={s.name}
                  className={`dev-fixture-bar__btn ${currentScenario === s.name ? 'dev-fixture-bar__btn--active' : ''}`}
                  onClick={() => navigate(s.name)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

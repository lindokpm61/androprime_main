'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface QualifierGateProps {
  resultId: string
  questionKey: string
  question: string
}

export function QualifierGate({ resultId, questionKey, question }: QualifierGateProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAnswer(answer: boolean) {
    setPending(true)
    setError(null)
    try {
      const res = await fetch('/api/results/qualifier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultId, questionKey, answer }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Something went wrong')
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setPending(false)
    }
  }

  return (
    <div className={`border-2 border-black p-6 ${pending ? 'opacity-50 pointer-events-none' : ''}`}>
      <p className="font-black font-sans text-sm uppercase tracking-widest mb-4">{question}</p>
      <div className="flex gap-3">
        <button
          onClick={() => handleAnswer(true)}
          className="bg-black text-white hover:bg-white hover:text-black border-2 border-black font-sans font-black uppercase tracking-widest text-xs px-6 py-3 transition-colors"
        >
          Yes
        </button>
        <button
          onClick={() => handleAnswer(false)}
          className="bg-white text-black hover:bg-black hover:text-white border-2 border-black font-sans font-black uppercase tracking-widest text-xs px-6 py-3 transition-colors"
        >
          No
        </button>
      </div>
      {error && (
        <p className="text-sm text-black mt-3 font-serif">{error}. Please try again.</p>
      )}
    </div>
  )
}

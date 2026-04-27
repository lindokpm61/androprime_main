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
    <div className={`relative border-4 border-black flex flex-col overflow-hidden ${pending ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Corner accents */}
      <span className="absolute top-0 left-0 w-4 h-4 bg-black z-10" aria-hidden />
      <span className="absolute top-0 right-0 w-4 h-4 bg-black z-10" aria-hidden />
      <span className="absolute bottom-0 left-0 w-4 h-4 bg-black z-10" aria-hidden />
      <span className="absolute bottom-0 right-0 w-4 h-4 bg-black z-10" aria-hidden />

      {/* Header bar */}
      <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
        <span className="font-black font-sans uppercase tracking-widest text-sm">Assessment Gate</span>
        <span className="font-mono text-[10px] tracking-widest uppercase">REF: {questionKey}</span>
      </div>

      {/* Body */}
      <div className="flex flex-col md:flex-row">

        {/* Question panel */}
        <div className="flex-1 p-8 lg:p-10 md:border-r-4 border-b-4 md:border-b-0 border-black flex flex-col justify-center gap-5">
          <span className="font-mono text-[10px] font-bold tracking-widest uppercase bg-black text-white px-3 py-1.5 w-fit">
            One Question
          </span>
          <h2
            className="font-black font-sans uppercase tracking-tight leading-tight text-black"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
          >
            {question}
          </h2>
          <p className="font-serif text-sm text-gray-700 max-w-sm">
            Your answer helps us show you the most relevant recommendation for your result.
          </p>
        </div>

        {/* YES / NO buttons */}
        <div className="flex md:flex-col w-full md:w-[40%]">
          <button
            type="button"
            onClick={() => handleAnswer(true)}
            className="flex-1 flex items-center justify-center p-8 md:border-b-4 border-r-4 md:border-r-0 border-black hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer font-black font-sans uppercase tracking-widest text-4xl md:text-6xl min-h-[120px]"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleAnswer(false)}
            className="flex-1 flex items-center justify-center p-8 hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer font-black font-sans uppercase tracking-widest text-4xl md:text-6xl min-h-[120px]"
          >
            No
          </button>
        </div>

      </div>

      {error && (
        <p className="px-8 pb-4 pt-3 text-sm font-serif border-t-2 border-black">
          {error}. Please try again.
        </p>
      )}
    </div>
  )
}

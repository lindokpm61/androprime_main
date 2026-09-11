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

  /*
   * Rebuilt in Direction F on 2026-09-11. Not one word changed: the question,
   * the helper sentence and the two answers are as they were, and the POST, the
   * pending lock, the refresh and the error path are untouched.
   *
   * WHAT WENT IS THE FURNITURE, and there was a lot of it: four black corner
   * squares, an inverted "Assessment Gate" header bar, an internal ref readout
   * of the question key, and two 60px YES/NO slabs in a 120px-tall split panel.
   * That is a great deal of apparatus around one yes-or-no question, and two
   * pieces of it were addressed to us rather than to the customer. The ref is
   * gone: a customer does not need `crp_joint_symptoms`, and it was the only
   * thing on the card written in the database's language rather than his.
   *
   * The two answers are ordinary buttons now. They were the largest type on the
   * whole dashboard, larger than his own result, which inverted the page's own
   * hierarchy: the number is the thing he came for.
   */
  return (
    <div style={pending ? { opacity: 0.5, pointerEvents: 'none' } : undefined}>
      <p className="f-blab">One question</p>
      <p className="f-sub" style={{ fontSize: 16 }}>{question}</p>
      <p className="f-fine" style={{ marginTop: 10 }}>
        Your answer helps us show you the most relevant recommendation for your result.
      </p>

      <div className="f-btns" style={{ marginTop: 18 }}>
        <button type="button" onClick={() => handleAnswer(true)} className="f-btn">
          Yes
        </button>
        <button type="button" onClick={() => handleAnswer(false)} className="f-btn f-btn-ghost">
          No
        </button>
      </div>

      {error && (
        <p className="f-err" role="alert">
          {error}. Please try again.
        </p>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import {
  SCALE_MAX,
  SCALE_MIN,
  type CheckinQuestion,
} from '@/lib/membership/checkin'

interface Props {
  questions: readonly CheckinQuestion[]
  /** What is already logged today, keyed by question. */
  answeredToday: Record<string, boolean | number>
}

/**
 * Today's three taps.
 *
 * Optimistic: the chip fills the moment it is tapped and rolls back if the save
 * fails. A daily habit control that waits on a round trip before acknowledging
 * a tap gets tapped twice, and the second tap is what the daily unique index in
 * the database exists to absorb.
 *
 * The boolean chip is a toggle and the scale chip cycles 1 to 5. Both are real
 * <button>s with an accessible name taken from the question's own prompt, so
 * the row is operable from a keyboard and reads correctly to a screen reader
 * rather than being three tappable divs.
 */
export function CheckinRow({ questions, answeredToday }: Props) {
  const [answers, setAnswers] = useState<Record<string, boolean | number>>(answeredToday)
  const [failed, setFailed] = useState<string | null>(null)

  async function save(question: CheckinQuestion, answer: boolean | number) {
    const previous = answers[question.key]
    setAnswers((current) => ({ ...current, [question.key]: answer }))
    setFailed(null)

    try {
      const res = await fetch('/api/membership/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionKey: question.key, answer }),
      })

      if (res.status === 401) {
        window.location.href = '/auth/login?next=/membership'
        return
      }

      if (!res.ok) throw new Error(String(res.status))
    } catch {
      // Roll the chip back to exactly what it was, including "unanswered".
      setAnswers((current) => {
        const next = { ...current }
        if (previous === undefined) delete next[question.key]
        else next[question.key] = previous
        return next
      })
      setFailed(question.key)
    }
  }

  function nextValue(question: CheckinQuestion, current: boolean | number | undefined) {
    if (question.type === 'boolean') return current !== true
    const value = typeof current === 'number' ? current : SCALE_MIN - 1
    return value >= SCALE_MAX ? SCALE_MIN : value + 1
  }

  return (
    <div>
      <div className="membership__checkin">
        {questions.map((question) => {
          const value = answers[question.key]
          const filled = question.type === 'boolean' ? value === true : typeof value === 'number'
          const display =
            question.type === 'boolean'
              ? value === true
                ? '✓'
                : '–'
              : typeof value === 'number'
                ? String(value)
                : '–'

          return (
            <button
              key={question.key}
              type="button"
              onClick={() => save(question, nextValue(question, value))}
              aria-label={question.prompt}
              className={`membership__chip${filled ? ' membership__chip--filled' : ''}`}
            >
              <span className="membership__chip-key">{question.label}</span>
              <span className="membership__chip-value" aria-hidden="true">
                {display}
              </span>
            </button>
          )
        })}
      </div>
      {failed && (
        <p role="status" className="membership__checkin-error">
          That did not save. Tap it again.
        </p>
      )}
    </div>
  )
}

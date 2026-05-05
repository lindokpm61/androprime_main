'use client'

import { useMemo, useState } from 'react'

type KitType = 'testosterone' | 'energy-recovery' | 'hormone-recovery'

function maxDobIso(): string {
  const today = new Date()
  today.setFullYear(today.getFullYear() - 18)
  return today.toISOString().slice(0, 10)
}

function isAtLeast18(dobIso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dobIso)) return false
  const dob = new Date(dobIso)
  const eighteen = new Date()
  eighteen.setFullYear(eighteen.getFullYear() - 18)
  return dob <= eighteen
}

export function CheckoutDetailsForm({ kitType }: { kitType: KitType }) {
  const [dob, setDob] = useState('')
  const [sex, setSex] = useState<'male' | 'female' | ''>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const maxDob = useMemo(() => maxDobIso(), [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!dob) {
      setError('Please enter your date of birth.')
      return
    }
    if (!isAtLeast18(dob)) {
      setError('You must be 18 or over to order a kit.')
      return
    }
    if (!sex) {
      setError('Please select male or female.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/checkout/kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kitType, dobIso: dob, sex }),
      })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
        return
      }

      setError(data.error ?? 'Something went wrong. Please try again.')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* DATE OF BIRTH */}
      <div>
        <label htmlFor="dob" className="data-label block mb-3">
          Date of birth
        </label>
        <input
          id="dob"
          name="dob"
          type="date"
          value={dob}
          max={maxDob}
          onChange={(event) => setDob(event.target.value)}
          required
          className="w-full border-2 border-black bg-white px-4 py-3 font-serif text-lg text-black focus:outline-none focus:ring-0"
        />
        <p className="font-serif text-sm text-gray-500 mt-2">
          You must be 18 or over. We use this to apply the correct lab reference ranges.
        </p>
      </div>

      {/* SEX */}
      <div>
        <span className="data-label block mb-3">Sex (biological)</span>
        <div className="grid grid-cols-2 gap-4">
          {(['male', 'female'] as const).map((option) => {
            const selected = sex === option
            return (
              <button
                type="button"
                key={option}
                onClick={() => setSex(option)}
                className={`border-2 border-black px-6 py-5 font-sans font-black uppercase tracking-widest text-sm transition-colors ${
                  selected ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {option}
              </button>
            )
          })}
        </div>
        <p className="font-serif text-sm text-gray-500 mt-2">
          Reference ranges for testosterone differ between male and female biology. The lab needs this to analyse your sample correctly.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="border-2 border-black bg-white p-4">
          <p className="font-serif text-sm text-black">{error}</p>
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Redirecting to checkout…' : 'Continue to payment'}
      </button>

      <p className="font-serif text-xs text-gray-500 text-center">
        Next: secure payment, phone number, and delivery address on our payment provider.
      </p>
    </form>
  )
}

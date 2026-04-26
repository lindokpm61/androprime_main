'use client'

import { useRef, useState, useTransition } from 'react'
import { dismissPasswordPromptAction, setPasswordAction } from '@/lib/dashboard/actions'

export function PasswordBanner() {
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [isPending, startTransition] = useTransition()
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleDismiss() {
    setDismissed(true)
    startTransition(() => dismissPasswordPromptAction())
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const password = String(formData.get('password') ?? '')
    const confirm = String(formData.get('confirm') ?? '')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Minimum 8 characters.')
      return
    }

    setError('')
    startTransition(async () => {
      const result = await setPasswordAction(formData)
      if ('error' in result && result.error) {
        setError(result.error)
        return
      }
      setModalOpen(false)
      setSuccess(true)
      if (toastRef.current) clearTimeout(toastRef.current)
      toastRef.current = setTimeout(() => setSuccess(false), 4000)
    })
  }

  if (dismissed) return null

  return (
    <>
      <div className="bg-black text-white py-3 px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="font-sans text-sm">
          Set a password to make it easier to sign in next time.
        </p>
        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="font-sans font-black text-xs uppercase tracking-widest border border-white px-4 py-1.5 hover:bg-white hover:text-black transition-colors"
          >
            SET PASSWORD
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="text-white text-xl leading-none hover:opacity-60 transition-opacity"
          >
            ×
          </button>
        </div>
      </div>

      {/* Modal overlay */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}
        >
          <div className="bg-white border-2 border-black w-full max-w-sm p-8">
            <h2 className="font-black font-sans text-xl uppercase tracking-tight mb-6">
              Set your password.
            </h2>

            {error && (
              <p className="border border-black px-4 py-2 text-sm font-sans font-bold mb-4">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="block">
                <span className="data-label mb-2 block">PASSWORD</span>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="w-full border-2 border-black bg-white px-4 py-3 font-sans text-sm font-semibold text-black outline-none focus:bg-stone-100"
                  placeholder="Minimum 8 characters"
                />
              </label>
              <label className="block">
                <span className="data-label mb-2 block">CONFIRM PASSWORD</span>
                <input
                  name="confirm"
                  type="password"
                  required
                  minLength={8}
                  className="w-full border-2 border-black bg-white px-4 py-3 font-sans text-sm font-semibold text-black outline-none focus:bg-stone-100"
                  placeholder="Repeat password"
                />
              </label>
              <p className="font-serif text-sm text-gray-600">Minimum 8 characters.</p>
              <button
                type="submit"
                disabled={isPending}
                className="w-full border-2 border-black bg-black px-5 py-3 font-sans text-sm font-black uppercase tracking-widest text-white transition hover:bg-white hover:text-black disabled:opacity-50"
              >
                {isPending ? 'SAVING…' : 'SAVE PASSWORD  →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success toast */}
      {success && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white font-sans text-sm px-6 py-3 border-2 border-black">
          Password set. You can now sign in with your email and password.
        </div>
      )}
    </>
  )
}

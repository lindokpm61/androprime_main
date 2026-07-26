'use client'

import { useState } from 'react'
import type { AddressData } from '@/lib/account/getAddress'

// Account "Delivery address" section. Rendered only when
// ACCOUNT_ADDRESS_ENABLED is on (the account page reads the flag and decides
// whether to mount this). Lets a signed-in customer view and update the delivery
// address on their `users` row, which is the address the bundle second-kit
// dispatch snapshots at send time (lib/bundles/dispatch.ts). The bundle
// address-check email links here so a customer can correct their address before
// the soft-window auto-dispatch.
//
// COPY STATUS: plain logistics copy, no health claim, no em dashes (AI-tell
// rule). Pending the compliance read that gates flipping the flag on.

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

// Only these three are required for a deliverable UK address. line2 and county
// are optional; country defaults to GB and is shown read-only (UK-only dispatch).
const REQUIRED: (keyof AddressData)[] = ['line1', 'city', 'postalCode']

export function AddressSection({ initial }: { initial: AddressData }) {
  const [form, setForm] = useState<AddressData>(initial)
  const [state, setState] = useState<SaveState>('idle')

  const missing = REQUIRED.filter((k) => form[k].trim() === '')

  function update(key: keyof AddressData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (state !== 'idle') setState('idle')
  }

  async function save() {
    if (missing.length > 0) {
      setState('error')
      return
    }
    setState('saving')
    try {
      const res = await fetch('/api/account/address', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setState(res.ok ? 'saved' : 'error')
    } catch {
      setState('error')
    }
  }

  return (
    <div className="account__section">
      <h2 className="account__section-heading">Delivery address</h2>
      <p className="font-serif text-sm leading-relaxed text-gray-800 mb-6">
        This is where we send your test kits. Keep it up to date so any kit still
        to be dispatched reaches you.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
        <Field label="First name" value={form.firstName} onChange={(v) => update('firstName', v)} autoComplete="given-name" />
        <Field label="Last name" value={form.lastName} onChange={(v) => update('lastName', v)} autoComplete="family-name" />
        <Field label="Address line 1" value={form.line1} onChange={(v) => update('line1', v)} required autoComplete="address-line1" className="sm:col-span-2" />
        <Field label="Address line 2 (optional)" value={form.line2} onChange={(v) => update('line2', v)} autoComplete="address-line2" className="sm:col-span-2" />
        <Field label="Town or city" value={form.city} onChange={(v) => update('city', v)} required autoComplete="address-level2" />
        <Field label="County (optional)" value={form.county} onChange={(v) => update('county', v)} autoComplete="address-level1" />
        <Field label="Postcode" value={form.postalCode} onChange={(v) => update('postalCode', v)} required autoComplete="postal-code" />
        <Field label="Country" value={form.country === 'GB' ? 'United Kingdom' : form.country} onChange={() => {}} disabled />
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={state === 'saving'}
          className="inline-block bg-black text-white border-4 border-black font-sans font-black text-sm uppercase tracking-widest px-6 py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === 'saving' ? 'Saving' : 'Save address'}
        </button>
        {state === 'saved' && (
          <span className="font-serif text-sm text-gray-800">Address saved.</span>
        )}
        {state === 'error' && (
          <span className="font-serif text-sm text-black font-bold">
            {missing.length > 0
              ? 'Please fill in your address line 1, town or city, and postcode.'
              : 'Something went wrong. Please try again or email support@andro-prime.com.'}
          </span>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  autoComplete,
  className = '',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  className?: string
}) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="data-label text-xs text-gray-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className="border-2 border-black bg-white px-3 py-2 font-serif text-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:text-gray-500"
      />
    </label>
  )
}

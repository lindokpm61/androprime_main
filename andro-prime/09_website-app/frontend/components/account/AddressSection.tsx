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
//
// ─────────────────────────────────────────────────────────────────────────
// RESTYLED IN DIRECTION F ON 2026-09-11 (batch 3). Not one word changed, and no
// branch changed: the same three required fields, the same first-failure
// behaviour, the same two distinct error messages.
//
// IT COMPOSES `.f-formrow` AND `.f-inp` RATHER THAN GROWING ITS OWN FIELD. Those
// are the primitives the auth rebuild added on 2026-09-08 and they already carry
// the label placement, the focus ring and the full-width input. A second field
// component here is how two forms on one site end up disagreeing about where a
// label sits, which is exactly the drift `FPage` was extracted to end.
//
// ⚠ THE FOUR SAVE STATES ARE THE FRAME'S AND WERE ALREADY THE CODE'S: idle,
// saving, saved, and two different errors. Frame K's note is that the validation
// error names the three required fields, "because 'something went wrong' on an
// address form is the version that gets abandoned". That was already true here
// and is preserved rather than discovered.

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
    <div className="f-tray f-rise">
      <div className="f-core">
        <p className="f-blab">Delivery address</p>
        <p className="f-sub">
          This is where we send your test kits. Keep it up to date so any kit still
          to be dispatched reaches you.
        </p>

        <div className="f-addrgrid">
          <Field label="First name" value={form.firstName} onChange={(v) => update('firstName', v)} autoComplete="given-name" />
          <Field label="Last name" value={form.lastName} onChange={(v) => update('lastName', v)} autoComplete="family-name" />
          <Field label="Address line 1" value={form.line1} onChange={(v) => update('line1', v)} required autoComplete="address-line1" wide />
          <Field label="Address line 2 (optional)" value={form.line2} onChange={(v) => update('line2', v)} autoComplete="address-line2" wide />
          <Field label="Town or city" value={form.city} onChange={(v) => update('city', v)} required autoComplete="address-level2" />
          <Field label="County (optional)" value={form.county} onChange={(v) => update('county', v)} autoComplete="address-level1" />
          <Field label="Postcode" value={form.postalCode} onChange={(v) => update('postalCode', v)} required autoComplete="postal-code" />
          <Field label="Country" value={form.country === 'GB' ? 'United Kingdom' : form.country} onChange={() => {}} disabled />
        </div>

        <div className="f-saverow">
          <button type="button" onClick={save} disabled={state === 'saving'} className="f-btn">
            {state === 'saving' ? 'Saving' : 'Save address'}
          </button>
          {state === 'saved' && <span className="f-fine">Address saved.</span>}
          {state === 'error' && (
            <p className="f-err" role="alert">
              {missing.length > 0
                ? 'Please fill in your address line 1, town or city, and postcode.'
                : 'Something went wrong. Please try again or email support@andro-prime.com.'}
            </p>
          )}
        </div>
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
  wide = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  wide?: boolean
}) {
  return (
    <label className={wide ? 'f-formrow f-addrwide' : 'f-formrow'}>
      <span className="f-blab">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className="f-inp"
      />
    </label>
  )
}

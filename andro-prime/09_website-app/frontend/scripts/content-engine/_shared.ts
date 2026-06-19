/**
 * Shared helpers for the content-engine scripts (orchestrator + agents). These run
 * in the cloud agent runtime (or locally via tsx), NOT in the Next app. Credentials
 * come from env (cloud runtime) or .env.local (local dev).
 */
import fs from 'fs'
import path from 'path'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../lib/supabase/types'

export function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
    if (!m) continue
    let val = m[2]
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = val
  }
}

export function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v || v === 'placeholder-service-role-key') {
    throw new Error(`Missing required env: ${name}`)
  }
  return v
}

let _admin: SupabaseClient<Database> | null = null
export function admin(): SupabaseClient<Database> {
  if (_admin) return _admin
  _admin = createClient<Database>(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
  return _admin
}

/** Append a row to agent_runs so no failure stays silent (read by the daily digest). */
export async function logRun(args: {
  agent: string
  itemRef?: string | null
  status: 'ok' | 'error' | 'blocked'
  error?: string | null
  detail?: Record<string, unknown> | null
  startedAt?: string
}) {
  try {
    await admin()
      .from('agent_runs')
      .insert({
        agent: args.agent,
        item_ref: args.itemRef ?? null,
        status: args.status,
        error: args.error ?? null,
        detail: (args.detail ?? null) as never,
        started_at: args.startedAt ?? new Date().toISOString(),
        finished_at: new Date().toISOString(),
      })
  } catch (e) {
    // Logging must never throw the run — surface to stderr instead.
    console.error('logRun failed:', (e as Error).message)
  }
}

export const ISO_TODAY = () => new Date().toISOString().slice(0, 10)

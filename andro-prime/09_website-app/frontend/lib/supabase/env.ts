const FALLBACK_SUPABASE_URL = 'https://phqrjtnflovicgkngieu.supabase.co'
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBocXJqdG5mbG92aWNna25naWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTE1MzUsImV4cCI6MjA5MTkyNzUzNX0.6rQtviSCKqhxVenMlwTmCQdwFI4-bVxF-FuOU3YRveY'
const FALLBACK_SUPABASE_SERVICE_KEY = 'placeholder-service-role-key'

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  )
}

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? FALLBACK_SUPABASE_URL
}

export function getSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    FALLBACK_SUPABASE_ANON_KEY
  )
}

export function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? FALLBACK_SUPABASE_SERVICE_KEY
}

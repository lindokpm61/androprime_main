export const dynamic = 'force-dynamic'

export async function GET() {
  throw new Error('Sentry test — uncaught error in API route (Node SDK)')
}

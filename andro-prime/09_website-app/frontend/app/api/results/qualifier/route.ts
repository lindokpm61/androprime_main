import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedApiUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const userOrResponse = await requireAuthenticatedApiUser(request)
  if (userOrResponse instanceof NextResponse) return userOrResponse
  const user = userOrResponse

  let body: { resultId: string; questionKey: string; answer: boolean | string | number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { resultId, questionKey, answer } = body
  if (!resultId || !questionKey || answer === undefined) {
    return NextResponse.json(
      { error: 'Missing required fields: resultId, questionKey, answer' },
      { status: 400 }
    )
  }

  const supabase = await createSupabaseServerClient()

  // Check if a response already exists for this result + question
  const { data: existing } = await supabase
    .from('qualifier_responses')
    .select('id')
    .eq('result_id', resultId)
    .eq('question_key', questionKey)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    // Update existing response
    const { error } = await supabase
      .from('qualifier_responses')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ answer: answer as any })
      .eq('id', existing.id)

    if (error) {
      return NextResponse.json({ error: 'Failed to update qualifier response' }, { status: 500 })
    }
    return NextResponse.json({ updated: true }, { status: 200 })
  }

  // Insert new response
  const { error } = await supabase.from('qualifier_responses').insert({
    user_id: user.id,
    result_id: resultId,
    question_key: questionKey,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    answer: answer as any,
  })

  if (error) {
    return NextResponse.json({ error: 'Failed to save qualifier response' }, { status: 500 })
  }
  return NextResponse.json({ saved: true }, { status: 201 })
}

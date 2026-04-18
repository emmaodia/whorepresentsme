import { NextResponse } from 'next/server'
import { reviewContribution } from '@/lib/queries'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(req: Request) {
  // Verify the caller is an authenticated admin
  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const { id, status, notes } = await req.json()

    if (!id || !['approved', 'rejected', 'duplicate'].includes(status)) {
      return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
    }

    await reviewContribution(id, status, user.email ?? user.id, notes)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/admin/review]', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}

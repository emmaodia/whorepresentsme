import { NextResponse } from 'next/server'
import { upsertOfficial } from '@/lib/queries'
import { createServerSupabase } from '@/lib/supabase-server'

// Shared auth check
async function getAuthedUser(req: Request) {
  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()
  return user
}

/**
 * POST /api/admin/officials
 * Create a new official record. Stamps verified_by and verified_at from
 * the authenticated user automatically.
 */
export async function POST(req: Request) {
  const user = await getAuthedUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  try {
    const body = await req.json()
    const official = await upsertOfficial({
      ...body,
      verified_by: user.email ?? user.id,
      verified_at: new Date().toISOString(),
    })
    return NextResponse.json({ ok: true, id: official.id })
  } catch (err: any) {
    console.error('[POST /api/admin/officials]', err)
    return NextResponse.json({ error: err.message ?? 'Server error.' }, { status: 500 })
  }
}

/**
 * PUT /api/admin/officials
 * Update an existing official record. Requires `id` in the body.
 * Updates verified_by to the current user so there's a clear audit trail
 * of who last touched the record.
 */
export async function PUT(req: Request) {
  const user = await getAuthedUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: '`id` is required for updates.' }, { status: 400 })
    }

    const official = await upsertOfficial({
      ...body,
      verified_by: user.email ?? user.id,
      // Don't reset verified_at on edits — only stamp when first verified
    })
    return NextResponse.json({ ok: true, id: official.id })
  } catch (err: any) {
    console.error('[PUT /api/admin/officials]', err)
    return NextResponse.json({ error: err.message ?? 'Server error.' }, { status: 500 })
  }
}

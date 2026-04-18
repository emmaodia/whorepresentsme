import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { getAllNotesAdmin, addNote, deleteNote } from '@/lib/queries'

async function getAuthedUser() {
  const sb = await createServerSupabase()
  const { data: { user } } = await sb.auth.getUser()
  return user
}

export async function GET(req: Request) {
  const user = await getAuthedUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const officialId = searchParams.get('official_id')
  if (!officialId) return NextResponse.json({ error: 'official_id required.' }, { status: 400 })

  const notes = await getAllNotesAdmin(officialId)
  return NextResponse.json(notes)
}

export async function POST(req: Request) {
  const user = await getAuthedUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  try {
    const body = await req.json()
    const { official_id, note, note_type, is_public } = body

    if (!official_id || !note?.trim()) {
      return NextResponse.json({ error: 'official_id and note are required.' }, { status: 400 })
    }

    const created = await addNote({
      official_id,
      note: note.trim(),
      note_type: note_type || 'general',
      is_public: is_public ?? true,
      added_by: user.email ?? user.id,
    })
    return NextResponse.json(created)
  } catch (err) {
    console.error('[POST /api/admin/notes]', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const user = await getAuthedUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required.' }, { status: 400 })

  try {
    await deleteNote(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/admin/notes]', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { submitContribution } from '@/lib/queries'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate minimum required fields
    if (!body.change_type || !body.source_url?.trim()) {
      return NextResponse.json(
        { error: 'change_type and source_url are required.' },
        { status: 400 },
      )
    }

    await submitContribution({
      official_id:       body.official_id,
      change_type:       body.change_type,
      field_name:        body.field_name,
      proposed_value:    body.proposed_value,
      source_url:        body.source_url.trim(),
      notes:             body.notes,
      contributor_name:  body.contributor_name,
      contributor_email: body.contributor_email,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/contribute]', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}

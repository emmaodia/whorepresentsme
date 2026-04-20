import { createServerSupabase, supabaseAdmin } from './supabase-server'
import type { DirectoryFilters, OfficialWithRefs, Contribution, OfficialNote, NoteType } from './types'

// Columns fetched for every official listing / profile
const OFFICIALS_SELECT = `
  id, full_name, gender, constituency, photo_url, date_of_birth,
  term_start, term_end, next_election_date,
  phone, official_email, official_website, twitter_handle,
  bio, status, verified, source_url,
  bills_sponsored, motions_moved, attendance_pct,
  created_at, updated_at,
  offices ( id, title, level, category, constituency_type ),
  parties ( id, name, abbreviation, color_hex ),
  states  ( id, name, slug, zone )
`

// ─── Public queries ───────────────────────────────────────────────────────────

/**
 * Fetch all verified, active officials with optional filters.
 * Full-text search uses Postgres tsvector (index already on the column).
 */
export async function getOfficials(filters: Partial<DirectoryFilters> = {}) {
  const sb = await createServerSupabase()
  let query = sb
    .from('officials')
    .select(OFFICIALS_SELECT)
    .eq('status', 'active')
    .eq('verified', true)
    .order('full_name')

  if (filters.search?.trim()) {
    // websearch mode supports quoted phrases and minus exclusions
    query = query.textSearch('full_name', filters.search.trim(), { type: 'websearch' })
  }
  if (filters.level && filters.level !== 'all') {
    query = query.eq('offices.level', filters.level)
  }
  if (filters.state) {
    query = query.eq('states.name', filters.state)
  }
  if (filters.party) {
    query = query.eq('parties.abbreviation', filters.party)
  }
  if (filters.gender) {
    query = query.eq('gender', filters.gender)
  }
  if (filters.category) {
    query = query.eq('offices.category', filters.category)
  }

  const { data, error } = await query
  if (error) throw error
  return data as unknown as OfficialWithRefs[]
}

/** Fetch a single verified official by ID. Throws on not found. */
export async function getOfficial(id: string) {
  const sb = await createServerSupabase()
  const { data, error } = await sb
    .from('officials')
    .select(OFFICIALS_SELECT)
    .eq('id', id)
    .eq('verified', true)
    .single()
  if (error) throw error
  return data as unknown as OfficialWithRefs
}

/** Fetch states, parties, and offices for populating filter dropdowns. */
export async function getReferenceData() {
  const sb = await createServerSupabase()
  const [states, parties, offices] = await Promise.all([
    sb.from('states').select('*').order('name'),
    sb.from('parties').select('*').order('abbreviation'),
    sb.from('offices').select('*').order('level, title'),
  ])
  return {
    states: states.data ?? [],
    parties: parties.data ?? [],
    offices: offices.data ?? [],
  }
}

/** Insert a public contribution into the review queue. */
export async function submitContribution(payload: {
  official_id?: string
  contributor_name?: string
  contributor_email?: string
  change_type: string
  field_name?: string
  proposed_value?: string
  source_url: string
  notes?: string
}) {
  // Public insert goes through anon key — RLS allows it
  const sb = await createServerSupabase()
  const { error } = await sb.from('contributions').insert(payload)
  if (error) throw error
}

/** Fetch states using the admin client — safe to call from generateStaticParams at build time. */
export async function getStatesAdmin(): Promise<Array<{ id: number; name: string; slug: string; zone: string | null }>> {
  const { data, error } = await supabaseAdmin.from('states').select('*').order('name')
  if (error) throw error
  return (data ?? []) as Array<{ id: number; name: string; slug: string; zone: string | null }>
}

/**
 * Fetch officials for a single state, filtered by state_id (the direct FK column).
 * This is more reliable than filtering via the embedded `states.name` resource
 * which PostgREST does not support in this schema.
 */
export async function getOfficialsByStateId(stateId: number) {
  const sb = await createServerSupabase()
  const { data, error } = await sb
    .from('officials')
    .select(OFFICIALS_SELECT)
    .eq('status', 'active')
    .eq('verified', true)
    .eq('state_id', stateId)
    .order('full_name')
  if (error) throw error
  return data as unknown as OfficialWithRefs[]
}

// ─── Admin queries (bypass RLS via service key) ───────────────────────────────

/** All contributions with status = 'pending', oldest first. */
export async function getPendingContributions() {
  const { data, error } = await supabaseAdmin
    .from('contributions')
    .select('*, officials ( id, full_name )')
    .eq('status', 'pending')
    .order('submitted_at')
  if (error) throw error
  return data as (Contribution & { officials: { id: string; full_name: string } | null })[]
}

/** Approve, reject, or mark duplicate. Records reviewer identity. */
export async function reviewContribution(
  id: string,
  status: 'approved' | 'rejected' | 'duplicate',
  reviewerId: string,
  notes?: string,
) {
  const { error } = await supabaseAdmin
    .from('contributions')
    .update({
      status,
      reviewer_id: reviewerId,
      reviewer_notes: notes ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) throw error
}

/** Insert or update an official directly (admin only). */
export async function upsertOfficial(official: Partial<OfficialWithRefs> & { id?: string }) {
  const { data, error } = official.id
    ? await supabaseAdmin.from('officials').update(official).eq('id', official.id).select().single()
    : await supabaseAdmin.from('officials').insert(official).select().single()
  if (error) throw error
  return data as unknown as OfficialWithRefs
}

// ─── Notes queries ────────────────────────────────────────────────────────────

/** Fetch all public notes for a given official. */
export async function getOfficialNotes(officialId: string) {
  const sb = await createServerSupabase()
  const { data, error } = await sb
    .from('official_notes')
    .select('*')
    .eq('official_id', officialId)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as OfficialNote[]
}

/** Fetch ALL notes (public + private) for admin view. */
export async function getAllNotesAdmin(officialId: string) {
  const { data, error } = await supabaseAdmin
    .from('official_notes')
    .select('*')
    .eq('official_id', officialId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as OfficialNote[]
}

/** Add a note — admin only. */
export async function addNote(payload: {
  official_id: string
  note:        string
  note_type:   NoteType
  is_public:   boolean
  added_by:    string
}) {
  const { data, error } = await supabaseAdmin
    .from('official_notes')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data as OfficialNote
}

/** Delete a note — admin only. */
export async function deleteNote(id: string) {
  const { error } = await supabaseAdmin
    .from('official_notes')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export type Level = 'Federal' | 'State' | 'Local'
export type Gender = 'Male' | 'Female' | 'Prefer not to say'
export type OfficialStatus = 'active' | 'former' | 'deceased'
export type ContributionStatus = 'pending' | 'approved' | 'rejected' | 'duplicate'
export type ChangeType = 'new_official' | 'field_update' | 'correction' | 'photo'

export interface State {
  id: number
  name: string
  slug: string
  zone: string
  capital: string
}

export interface Party {
  id: number
  name: string
  abbreviation: string
  color_hex: string
}

export interface Office {
  id: number
  title: string
  level: Level
  category: 'Executive' | 'Legislative'
  constituency_type: string | null
}

export interface Official {
  id: string
  full_name: string
  gender: Gender | null
  office_id: number
  party_id: number | null
  state_id: number | null
  constituency: string | null
  photo_url: string | null
  date_of_birth: string | null
  term_start: string | null
  term_end: string | null
  next_election_date: string | null
  phone: string | null
  official_email: string | null
  official_website: string | null
  twitter_handle: string | null
  bio: string | null
  status: OfficialStatus
  verified: boolean
  source_url: string | null
  bills_sponsored: number | null
  motions_moved: number | null
  attendance_pct: number | null
  first_elected: string | null
  created_at: string
  updated_at: string
}

export interface OfficialWithRefs extends Official {
  offices: Office
  parties: Party | null
  states: State | null
}

export interface Contribution {
  id: string
  official_id: string | null
  contributor_name: string | null
  contributor_email: string | null
  change_type: ChangeType
  field_name: string | null
  proposed_value: string | null
  current_value: string | null
  source_url: string
  notes: string | null
  status: ContributionStatus
  reviewer_id: string | null
  reviewer_notes: string | null
  submitted_at: string
  reviewed_at: string | null
}

export interface DirectoryFilters {
  search: string
  level: Level | 'all'
  state: string
  party: string
  gender: string
  category: string
}

export type NoteType =
  | 'general'
  | 'seat_dispute'
  | 'party_change'
  | 'vacancy'
  | 'correction'
  | 'historical'

export interface OfficialNote {
  id:          string
  official_id: string
  note:        string
  note_type:   NoteType
  is_public:   boolean
  added_by:    string
  created_at:  string
  updated_at:  string
}

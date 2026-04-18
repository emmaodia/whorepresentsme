/**
 * Nigeria's election cycle.
 *
 * INEC publishes election timetables ahead of each cycle. The dates below
 * are based on the 2027 general election cycle (following 2023 pattern) and
 * off-cycle governorship elections (Anambra, Ekiti, Osun, Edo, Ondo) which
 * run 4 years after their respective swearing-in dates.
 *
 * INEC announces exact dates ~18 months before. These are projected dates
 * that update as INEC publishes the official timetable.
 */

export type ElectionType =
  | 'presidential'
  | 'national-assembly'
  | 'governorship'
  | 'state-assembly'
  | 'fct-area-council'
  | 'local-government'

export interface ElectionEvent {
  date: string // ISO date YYYY-MM-DD
  type: ElectionType
  title: string
  description: string
  scope: string // e.g. "Nationwide" or "Anambra State"
  projected: boolean // true = date not yet officially confirmed by INEC
}

export const ELECTION_TIMETABLE: ElectionEvent[] = [
  // ═══════════════════════════════════════════════════════════════════
  // OFF-CYCLE GOVERNORSHIP ELECTIONS
  // ═══════════════════════════════════════════════════════════════════
  {
    date: '2025-11-08',
    type: 'governorship',
    title: 'Anambra State Governorship Election',
    description: 'Governor Soludo\'s term ends March 2026. Election held November 2025.',
    scope: 'Anambra State',
    projected: false,
  },
  {
    date: '2026-06-20',
    type: 'governorship',
    title: 'Ekiti State Governorship Election',
    description: 'Governor Oyebanji\'s term ends October 2026. Election held ~4 months prior.',
    scope: 'Ekiti State',
    projected: true,
  },
  {
    date: '2026-08-08',
    type: 'governorship',
    title: 'Osun State Governorship Election',
    description: 'Governor Adeleke\'s term ends November 2026. Election held ~3 months prior.',
    scope: 'Osun State',
    projected: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // 2027 GENERAL ELECTION CYCLE
  // ═══════════════════════════════════════════════════════════════════
  {
    date: '2027-02-20',
    type: 'presidential',
    title: 'Presidential Election',
    description: 'Election for President and Vice President of Nigeria.',
    scope: 'Nationwide',
    projected: true,
  },
  {
    date: '2027-02-20',
    type: 'national-assembly',
    title: 'National Assembly Elections',
    description: 'Senate and House of Representatives elections held same day as presidential.',
    scope: 'Nationwide',
    projected: true,
  },
  {
    date: '2027-03-06',
    type: 'governorship',
    title: 'Governorship Elections (28 States)',
    description: 'Governorship elections in all states except Anambra, Ekiti, Osun, Edo, Ondo, Bayelsa, Kogi, and Imo.',
    scope: '28 States',
    projected: true,
  },
  {
    date: '2027-03-06',
    type: 'state-assembly',
    title: 'State House of Assembly Elections',
    description: 'State House of Assembly elections held same day as governorship.',
    scope: '36 States',
    projected: true,
  },
  {
    date: '2027-03-06',
    type: 'fct-area-council',
    title: 'FCT Area Council Elections',
    description: 'Elections for chairmen and councillors of the 6 FCT area councils.',
    scope: 'FCT',
    projected: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // POST-2027 OFF-CYCLE ELECTIONS
  // ═══════════════════════════════════════════════════════════════════
  {
    date: '2027-11-11',
    type: 'governorship',
    title: 'Bayelsa, Imo & Kogi Governorship Elections',
    description: 'Off-cycle governorship elections held every 4 years.',
    scope: 'Bayelsa, Imo, Kogi',
    projected: true,
  },
  {
    date: '2028-09-23',
    type: 'governorship',
    title: 'Edo & Ondo Governorship Elections',
    description: 'Off-cycle governorship elections held every 4 years.',
    scope: 'Edo, Ondo',
    projected: true,
  },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Get the next upcoming election (soonest future date) */
export function getNextElection(now: Date = new Date()): ElectionEvent | null {
  const upcoming = ELECTION_TIMETABLE
    .filter(e => new Date(e.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  return upcoming[0] ?? null
}

/** Get all upcoming elections sorted by date */
export function getUpcomingElections(now: Date = new Date()): ElectionEvent[] {
  return ELECTION_TIMETABLE
    .filter(e => new Date(e.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

/** Get past elections (most recent first) */
export function getPastElections(now: Date = new Date()): ElectionEvent[] {
  return ELECTION_TIMETABLE
    .filter(e => new Date(e.date) <= now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const ELECTION_TYPE_LABELS: Record<ElectionType, string> = {
  'presidential': 'Presidential',
  'national-assembly': 'National Assembly',
  'governorship': 'Governorship',
  'state-assembly': 'State Assembly',
  'fct-area-council': 'FCT Area Council',
  'local-government': 'Local Government',
}

export const ELECTION_TYPE_COLORS: Record<ElectionType, { bg: string; text: string; border: string }> = {
  'presidential':      { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200' },
  'national-assembly': { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  'governorship':      { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
  'state-assembly':    { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'fct-area-council':  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
  'local-government':  { bg: 'bg-gray-50',   text: 'text-gray-700',   border: 'border-gray-200' },
}

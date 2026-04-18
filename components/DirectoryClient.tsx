'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { OfficialWithRefs, State, Party, Office } from '@/lib/types'
import ElectionCountdown from './ElectionCountdown'
import ScorecardBadges from './ScorecardBadges'
import ShareButtons from './ShareButtons'

interface Props {
  initialOfficials: OfficialWithRefs[]
  states: State[]
  parties: Party[]
  offices: Office[]
}

// Office-type filter groups — mapped to office titles in the DB.
// Order matters: state assembly matched BEFORE HOR to avoid "Speaker, State
// House of Assembly" being mis-categorised as House of Reps.
const OFFICE_FILTERS = [
  { key: 'all',       label: 'All' },
  { key: 'senate',    label: 'Senate',    match: (t: string) => t === 'Senator' || t.includes('Senate President') || t.includes('Deputy Senate') },
  { key: 'hoa',       label: 'State Assembly', match: (t: string) => t.includes('State House of Assembly') || t === 'State Legislator' },
  { key: 'hor',       label: 'House of Reps', match: (t: string) => t.includes('House of Representatives') || t.includes('House of Rep') || (t === 'Speaker, House of Representatives') || (t === 'Deputy Speaker, House of Reps') },
  { key: 'governor',  label: 'Governors',  match: (t: string) => t === 'Governor' || t === 'Deputy Governor' },
  { key: 'president', label: 'President',  match: (t: string) => t === 'President' || t === 'Vice President' },
  { key: 'lga',       label: 'LGA',        match: (t: string) => t.includes('Chairman') || t.includes('Councillor') || t.includes('Local Government') },
] as const

type OfficeFilterKey = typeof OFFICE_FILTERS[number]['key']

function matchesOfficeFilter(officeTitle: string | undefined, key: OfficeFilterKey): boolean {
  if (key === 'all') return true
  if (!officeTitle) return false
  const filter = OFFICE_FILTERS.find(f => f.key === key)
  if (!filter || !('match' in filter)) return false
  return filter.match(officeTitle)
}

export default function DirectoryClient({ initialOfficials, states, parties }: Props) {
  const [search,       setSearch]       = useState('')
  const [officeFilter, setOfficeFilter] = useState<OfficeFilterKey>('all')
  const [stateFilter,  setStateFilter]  = useState('')
  const [partyFilter,  setPartyFilter]  = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [sortBy,       setSortBy]       = useState<'name' | 'state'>('name')
  const [expandedId,   setExpandedId]   = useState<string | null>(null)

  // Determine which office filters have data
  const availableFilters = useMemo(() => {
    return OFFICE_FILTERS.filter(f => {
      if (f.key === 'all') return true
      return initialOfficials.some(o => matchesOfficeFilter(o.offices?.title, f.key))
    })
  }, [initialOfficials])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return initialOfficials.filter(o => {
      if (!matchesOfficeFilter(o.offices?.title, officeFilter)) return false
      if (stateFilter && o.states?.name !== stateFilter) return false
      if (partyFilter && o.parties?.abbreviation !== partyFilter) return false
      if (genderFilter && o.gender !== genderFilter) return false
      if (q) {
        const text = [
          o.full_name, o.offices?.title, o.states?.name, o.states?.zone,
          o.parties?.abbreviation, o.parties?.name,
          o.constituency, o.bio,
        ].join(' ').toLowerCase()
        return text.includes(q)
      }
      return true
    })
  }, [initialOfficials, search, officeFilter, stateFilter, partyFilter, genderFilter])

  const sorted = useMemo(() => {
    if (sortBy === 'state') {
      return [...filtered].sort((a, b) => {
        const stateA = a.states?.name ?? ''
        const stateB = b.states?.name ?? ''
        if (stateA !== stateB) return stateA.localeCompare(stateB)
        return a.full_name.localeCompare(b.full_name)
      })
    }
    return filtered // already sorted by name from the query
  }, [filtered, sortBy])

  const femaleCount = sorted.filter(o => o.gender === 'Female').length
  const tog = (id: string) => setExpandedId(prev => prev === id ? null : id)

  return (
    <div>
      {/* ── Search ───────────────────────────────────────────────────────── */}
      <input
        type="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name, constituency, state, or party..."
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-green-700"
      />

      {/* ── Office type filter (pill buttons) ────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-3">
        {availableFilters.map(f => (
          <button
            key={f.key}
            onClick={() => setOfficeFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              officeFilter === f.key
                ? 'bg-green-800 text-white border-green-800'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Dropdown filters ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Select value={stateFilter} onChange={setStateFilter} placeholder="All states">
          {states.map(s => <option key={s.id}>{s.name}</option>)}
        </Select>

        <Select value={partyFilter} onChange={setPartyFilter} placeholder="All parties">
          {parties.map(p => <option key={p.id} value={p.abbreviation}>{p.abbreviation}</option>)}
        </Select>

        <Select value={genderFilter} onChange={setGenderFilter} placeholder="All genders">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </Select>
      </div>

      {/* ── Count + sort ────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs text-gray-500">
          {sorted.length} official{sorted.length !== 1 ? 's' : ''}
          {femaleCount > 0 && ` · ${femaleCount} female, ${sorted.length - femaleCount} male`}
        </p>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 mr-1">Sort:</span>
          {(['name', 'state'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${
                sortBy === s
                  ? 'bg-green-800 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {s === 'name' ? 'Name' : 'State'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Column headers ───────────────────────────────────────────────── */}
      {sorted.length > 0 && (
        <div className="hidden sm:grid sm:grid-cols-[2fr_1.5fr_1fr_1fr_72px_96px] gap-2 px-3 py-2 border-b border-gray-200 text-xs text-gray-400 uppercase tracking-wide">
          <span>Official</span>
          <span>Office</span>
          <span>Constituency</span>
          <span>State</span>
          <span>Party</span>
          <span>Next election</span>
        </div>
      )}

      {/* ── Rows ─────────────────────────────────────────────────────────── */}
      <div className="divide-y divide-gray-100">
        {sorted.length === 0 && (
          <p className="text-center py-12 text-sm text-gray-400">
            No officials match your filters.
          </p>
        )}

        {sorted.map(o => (
          <OfficialRow
            key={o.id}
            official={o}
            expanded={expandedId === o.id}
            onToggle={() => tog(o.id)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Row component ────────────────────────────────────────────────────────────

function OfficialRow({
  official: o,
  expanded,
  onToggle,
}: {
  official: OfficialWithRefs
  expanded: boolean
  onToggle: () => void
}) {
  const party = o.parties
  const partyBg = party ? `${party.color_hex}22` : '#f3f4f6'
  const partyTx = party?.color_hex ?? '#6b7280'

  const nextElecLabel = o.next_election_date
    ? new Date(o.next_election_date).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })
    : '—'

  return (
    <div className={`transition-colors ${expanded ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
      {/* Clickable summary row */}
      <button className="w-full text-left" onClick={onToggle}>
        <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1.5fr_1fr_1fr_72px_96px] gap-2 px-3 py-3 items-center">
          {/* Name + gender tag */}
          <div>
            <p className="text-sm font-medium text-gray-900 leading-tight">{o.full_name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {o.gender ?? '—'} · {o.offices?.level}
            </p>
          </div>
          {/* Office */}
          <p className="hidden sm:block text-sm text-gray-700 truncate">{o.offices?.title}</p>
          {/* Constituency */}
          <p className="hidden sm:block text-sm text-gray-600 truncate">{o.constituency ?? '—'}</p>
          {/* State */}
          <p className="hidden sm:block text-sm text-gray-700">{o.states?.name ?? 'Federal'}</p>
          {/* Party badge */}
          <span
            className="hidden sm:inline text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: partyBg, color: partyTx }}
          >
            {party?.abbreviation ?? '—'}
          </span>
          {/* Next election */}
          <div className="hidden sm:block">
            <ElectionCountdown date={o.next_election_date} size="sm" />
            {!o.next_election_date && <span className="text-sm text-gray-300">—</span>}
          </div>
          {/* Mobile: party + chevron */}
          <div className="sm:hidden flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: partyBg, color: partyTx }}>
              {party?.abbreviation ?? '—'}
            </span>
            <span className="text-gray-400 text-xs">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>
      </button>

      {/* Expanded profile panel */}
      {expanded && (
        <div className="px-3 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 pb-3 border-t border-green-100">
            <Field label="Gender"        value={o.gender} />
            <Field label="Age"           value={calcAge(o.date_of_birth)} />
            <Field label="Constituency"  value={o.constituency} />
            <Field label="Party"         value={party?.name} />
            <Field label="State"         value={o.states?.name} />
            <Field label="Term start"    value={fmtDate(o.term_start)} />
            <Field label="Term end"      value={fmtDate(o.term_end)} />
            <div>
              <p className="text-xs text-gray-400 mb-1">Next election</p>
              <ElectionCountdown date={o.next_election_date} size="md" />
              {!o.next_election_date && <p className="text-sm text-gray-300">—</p>}
            </div>
            <Field label="Office category" value={o.offices?.category} />
            <Field label="Phone"         value={o.phone} />
            <Field label="Email"         value={o.official_email} link={`mailto:${o.official_email}`} />
            <Field label="Website"       value={o.official_website} link={`https://${o.official_website}`} />
            <Field label="Twitter"       value={o.twitter_handle ? `@${o.twitter_handle}` : null} link={`https://twitter.com/${o.twitter_handle}`} />
          </div>

          {/* Scorecard badges */}
          {(o.bills_sponsored != null || o.motions_moved != null || o.attendance_pct != null) && (
            <div className="mt-2 mb-3">
              <ScorecardBadges
                billsSponsored={o.bills_sponsored}
                motionsMoved={o.motions_moved}
                attendancePct={o.attendance_pct}
              />
            </div>
          )}

          {o.bio && (
            <p className="text-sm text-gray-600 leading-relaxed mt-1 mb-3 bg-white border border-gray-100 rounded-md p-3">
              {o.bio}
            </p>
          )}

          <div className="flex gap-2 flex-wrap mb-3">
            <Link
              href={`/officials/${o.id}`}
              className="text-xs text-green-700 border border-green-200 rounded px-3 py-1.5 hover:bg-green-50 transition-colors"
            >
              Full profile →
            </Link>
            <Link
              href={`/contribute?official=${o.id}`}
              className="text-xs text-gray-600 border border-gray-200 rounded px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              Suggest a correction
            </Link>
          </div>
          <ShareButtons
            url={`/officials/${o.id}`}
            text={`${o.full_name} — ${o.offices?.title ?? 'Official'}${o.constituency ? `, ${o.constituency}` : ''}${o.states?.name ? ` (${o.states.name})` : ''}`}
          />
        </div>
      )}
    </div>
  )
}

// ─── Helper components ────────────────────────────────────────────────────────

function Field({
  label,
  value,
  link,
  highlight,
}: {
  label: string
  value?: string | null
  link?: string
  highlight?: boolean
}) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      {!value ? (
        <p className="text-sm text-gray-300">—</p>
      ) : link && value ? (
        <a href={link} target="_blank" rel="noreferrer"
          className="text-sm text-green-700 hover:underline block truncate">
          {value}
        </a>
      ) : (
        <p className={`text-sm ${highlight ? 'text-green-700 font-medium' : 'text-gray-800'}`}>
          {value}
        </p>
      )}
    </div>
  )
}

function Select({
  value,
  onChange,
  placeholder,
  children,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  children: React.ReactNode
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-green-700"
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  )
}

function calcAge(dob?: string | null) {
  if (!dob) return null
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return `${age} years`
}

function fmtDate(d?: string | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

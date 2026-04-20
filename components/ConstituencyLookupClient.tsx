'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { getLGAsForState, getConstituencyForLGA } from '@/lib/data/lga-constituency-map'
import { getAssemblyConstituencies, hasAssemblyData } from '@/lib/data/state-assembly-map'
import { ELECTIVE_OFFICES } from '@/lib/data/elective-offices'
import type { State } from '@/lib/types'

interface Props {
  states: State[]
  googleMapsApiKey?: string
}

// Offices available at each tier — links to /offices/[slug] + label
const TIER_OFFICES = [
  {
    tier: 'Federal',
    icon: '🇳🇬',
    offices: [
      { slug: 'president', label: 'President / Vice President', note: 'Nation-wide election' },
      { slug: 'senator', label: 'Senator', note: 'Senatorial district election' },
      { slug: 'house-of-reps-member', label: 'HOR Member', note: 'Federal constituency election' },
    ],
  },
  {
    tier: 'State',
    icon: '🏛️',
    offices: [
      { slug: 'governor', label: 'Governor / Deputy Governor', note: 'State-wide election' },
      { slug: 'state-assembly-member', label: 'State Assembly Member', note: 'State constituency election' },
    ],
  },
  {
    tier: 'Local',
    icon: '🏘️',
    offices: [
      { slug: 'lga-chairman', label: 'LGA Chairman', note: 'LGA-wide election' },
      { slug: 'councillor', label: 'Ward Councillor', note: 'Ward election' },
    ],
  },
]

interface Suggestion {
  placeId: string
  mainText: string
  secondaryText: string
  fullText: string
}

export default function ConstituencyLookupClient({ states, googleMapsApiKey }: Props) {
  const [selectedState, setSelectedState] = useState('')
  const [selectedLGA, setSelectedLGA] = useState('')
  const [placesInput, setPlacesInput] = useState('')
  const [activeTab, setActiveTab] = useState<'find' | 'run'>('find')

  const lgasForState = useMemo(() => getLGAsForState(selectedState), [selectedState])
  const lgaMapping = useMemo(() => {
    if (!selectedState || !selectedLGA) return undefined
    return getConstituencyForLGA(selectedState, selectedLGA)
  }, [selectedState, selectedLGA])

  const assemblyConstituencies = useMemo(() => {
    if (!selectedState || !selectedLGA) return null
    return getAssemblyConstituencies(selectedState, selectedLGA)
  }, [selectedState, selectedLGA])

  const stateHasAssemblyData = useMemo(() => hasAssemblyData(selectedState), [selectedState])

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setSelectedLGA('')
    setPlacesInput('')
  }

  const handlePlaceSelect = useCallback((state: string, lga: string) => {
    const matched = states.find(s =>
      s.name.toLowerCase() === state.toLowerCase() ||
      state.toLowerCase().includes(s.name.toLowerCase())
    )
    if (matched) {
      setSelectedState(matched.name)
      const lgas = getLGAsForState(matched.name)
      const matchedLGA = lgas.find(l =>
        l.lga.toLowerCase() === lga.toLowerCase() ||
        lga.toLowerCase().includes(l.lga.toLowerCase()) ||
        l.lga.toLowerCase().includes(lga.toLowerCase())
      )
      if (matchedLGA) setSelectedLGA(matchedLGA.lga)
    }
  }, [states])

  const hasResult = selectedState && selectedLGA

  return (
    <div>
      {/* ── Address lookup ───────────────────────────────────────────── */}
      {googleMapsApiKey && (
        <div className="mb-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Quick lookup — search by address</p>
          <PlacesAutocomplete
            apiKey={googleMapsApiKey}
            onSelect={handlePlaceSelect}
            value={placesInput}
            onChange={setPlacesInput}
          />
          <p className="text-[11px] text-gray-400 mt-1.5">
            Your address is used only to detect your state and LGA — nothing is stored.
          </p>
        </div>
      )}

      {/* ── Manual selectors ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1.5">State</label>
          <select
            value={selectedState}
            onChange={e => handleStateChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-white"
          >
            <option value="">Select state...</option>
            {states.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1.5">Local Government Area</label>
          <select
            value={selectedLGA}
            onChange={e => setSelectedLGA(e.target.value)}
            disabled={!selectedState || lgasForState.length === 0}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-white disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">
              {!selectedState ? 'Select state first' : lgasForState.length === 0 ? 'LGA data loading...' : 'Select LGA...'}
            </option>
            {lgasForState.map(l => <option key={l.lga} value={l.lga}>{l.lga}</option>)}
          </select>
        </div>
      </div>

      {/* ── Empty state ──────────────────────────────────────────────── */}
      {!hasResult && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-2xl mb-3">📍</p>
          <p className="text-sm text-gray-600 font-medium mb-1">Enter your location above</p>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            {googleMapsApiKey
              ? 'Search by address or select your state and LGA.'
              : 'Select your state and LGA to see your constituencies.'}
          </p>
        </div>
      )}

      {/* ── Results ──────────────────────────────────────────────────── */}
      {hasResult && lgaMapping && (
        <div className="space-y-6">
          {/* Area summary */}
          <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-4">
            <p className="text-xs text-green-600 uppercase tracking-wide mb-1">Your location</p>
            <p className="text-lg font-semibold text-green-900">
              {selectedLGA} · {selectedState} State
            </p>
          </div>

          {/* ── Tabs ────────────────────────────────────────────────── */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <TabBtn active={activeTab === 'find'} onClick={() => setActiveTab('find')}>
              Your constituencies
            </TabBtn>
            <TabBtn active={activeTab === 'run'} onClick={() => setActiveTab('run')}>
              Offices you can run for
            </TabBtn>
          </div>

          {/* ── Tab: Constituencies ─────────────────────────────────── */}
          {activeTab === 'find' && (
            <div className="space-y-3">

              {/* Senatorial */}
              <ConstituencyRow
                level="Federal"
                icon="⚖️"
                office="Senatorial District"
                value={lgaMapping.senatorialDistrict}
                officeSlug="senator"
                note="3 senators per state, one per senatorial district"
              />

              {/* Federal Constituency */}
              <ConstituencyRow
                level="Federal"
                icon="🏛️"
                office="Federal Constituency"
                value={lgaMapping.federalConstituency}
                officeSlug="house-of-reps-member"
                note="360 federal constituencies across Nigeria"
                pending={!lgaMapping.federalConstituency}
                pendingNote="Federal constituency mapping for this LGA is being verified"
              />

              {/* Governorship */}
              <ConstituencyRow
                level="State"
                icon="🏢"
                office="Governorship"
                value={`${selectedState} State (state-wide)`}
                officeSlug="governor"
                note="Governor + Deputy Governor elected state-wide"
              />

              {/* State Assembly */}
              {assemblyConstituencies ? (
                <ConstituencyRow
                  level="State"
                  icon="📋"
                  office={`State Assembly ${assemblyConstituencies.length > 1 ? 'Constituencies' : 'Constituency'}`}
                  value={assemblyConstituencies.join(', ')}
                  officeSlug="state-assembly-member"
                  note={assemblyConstituencies.length > 1
                    ? `${selectedLGA} LGA spans ${assemblyConstituencies.length} state assembly constituencies`
                    : `${selectedLGA} LGA has one state assembly constituency`}
                />
              ) : (
                <ConstituencyRow
                  level="State"
                  icon="📋"
                  office="State Assembly Constituency"
                  value={null}
                  officeSlug="state-assembly-member"
                  pending
                  pendingNote={
                    stateHasAssemblyData
                      ? `Assembly constituency for ${selectedLGA} is being verified`
                      : `State Assembly mapping for ${selectedState} is coming soon`
                  }
                />
              )}

              {/* LGA */}
              <ConstituencyRow
                level="Local"
                icon="🏘️"
                office="Local Government Area"
                value={`${selectedLGA} LGA`}
                officeSlug="lga-chairman"
                note="LGA Chairman elected LGA-wide; Councillors elected per ward"
              />

              {/* Ward */}
              <div className="border border-dashed border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <LevelBadge level="Local" />
                      <span className="text-xs font-medium text-gray-600">Ward</span>
                    </div>
                    <p className="text-sm text-gray-400 italic mb-1">
                      Select your specific ward for councillor information
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Each LGA has multiple wards. Ward-level lookup is coming soon.
                    </p>
                  </div>
                  <Link
                    href={`/offices/councillor`}
                    className="text-xs text-green-700 border border-green-200 rounded px-2.5 py-1 hover:bg-green-50 transition-colors whitespace-nowrap shrink-0"
                  >
                    About this office
                  </Link>
                </div>
              </div>

              {/* Find my reps CTA */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between gap-3 mt-2">
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-0.5">See who currently holds these offices</p>
                  <p className="text-xs text-gray-500">Find your senators, HOR member, and state assembly reps.</p>
                </div>
                <Link
                  href={`/find`}
                  className="text-xs bg-green-800 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap shrink-0"
                >
                  Find my reps →
                </Link>
              </div>
            </div>
          )}

          {/* ── Tab: Offices you can run for ────────────────────────── */}
          {activeTab === 'run' && (
            <div className="space-y-6">
              <p className="text-xs text-gray-500">
                Based on your location in <strong>{selectedLGA}, {selectedState}</strong>,
                here are the offices you can contest — with the specific constituency you would need
                to file with INEC.
              </p>

              {/* Federal */}
              <OfficeGroup
                tier="Federal"
                icon="🇳🇬"
                label="Federal offices"
                items={[
                  {
                    slug: 'senator',
                    label: 'Senator',
                    constituency: lgaMapping.senatorialDistrict,
                    constituencyLabel: 'Senatorial District',
                    electionBody: 'INEC',
                    minAge: 35,
                  },
                  {
                    slug: 'house-of-reps-member',
                    label: 'HOR Member',
                    constituency: lgaMapping.federalConstituency ?? 'Pending verification',
                    constituencyLabel: 'Federal Constituency',
                    electionBody: 'INEC',
                    minAge: 30,
                    pending: !lgaMapping.federalConstituency,
                  },
                  {
                    slug: 'president',
                    label: 'President',
                    constituency: 'Nation-wide',
                    constituencyLabel: 'Election scope',
                    electionBody: 'INEC',
                    minAge: 40,
                  },
                ]}
              />

              {/* State */}
              <OfficeGroup
                tier="State"
                icon="🏛️"
                label="State offices"
                items={[
                  {
                    slug: 'governor',
                    label: 'Governor',
                    constituency: `${selectedState} State`,
                    constituencyLabel: 'Election scope',
                    electionBody: 'INEC',
                    minAge: 35,
                  },
                  {
                    slug: 'state-assembly-member',
                    label: 'State Assembly Member',
                    constituency: assemblyConstituencies
                      ? assemblyConstituencies.join(' or ')
                      : 'Data coming soon',
                    constituencyLabel: 'State Constituency',
                    electionBody: 'INEC',
                    minAge: 25,
                    pending: !assemblyConstituencies,
                  },
                ]}
              />

              {/* Local */}
              <OfficeGroup
                tier="Local"
                icon="🏘️"
                label="Local Government offices"
                items={[
                  {
                    slug: 'lga-chairman',
                    label: 'LGA Chairman',
                    constituency: `${selectedLGA} LGA`,
                    constituencyLabel: 'Election scope',
                    electionBody: 'SIEC',
                    minAge: 25,
                  },
                  {
                    slug: 'councillor',
                    label: 'Ward Councillor',
                    constituency: 'Your ward (select ward to identify)',
                    constituencyLabel: 'Ward',
                    electionBody: 'SIEC',
                    minAge: 21,
                  },
                ]}
              />

              <Link
                href="/run-for-office"
                className="flex items-center justify-between bg-green-800 text-white rounded-xl px-5 py-4 hover:bg-green-700 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold mb-0.5">How to file your candidacy →</p>
                  <p className="text-xs text-green-200">Step-by-step: party primaries, INEC nomination, campaign finance.</p>
                </div>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 text-xs font-medium px-3 py-2 rounded-md transition-colors ${
        active ? 'bg-white text-green-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  )
}

function LevelBadge({ level }: { level: 'Federal' | 'State' | 'Local' }) {
  const colors = {
    Federal: 'bg-blue-50 text-blue-700',
    State: 'bg-amber-50 text-amber-700',
    Local: 'bg-green-50 text-green-700',
  }
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${colors[level]}`}>
      {level}
    </span>
  )
}

function ConstituencyRow({
  level,
  icon,
  office,
  value,
  officeSlug,
  note,
  pending,
  pendingNote,
}: {
  level: 'Federal' | 'State' | 'Local'
  icon: string
  office: string
  value: string | null
  officeSlug: string
  note?: string
  pending?: boolean
  pendingNote?: string
}) {
  return (
    <div className="border border-gray-100 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <LevelBadge level={level} />
            <span className="text-xs font-semibold text-gray-700">{office}</span>
          </div>
          {pending ? (
            <p className="text-sm text-amber-600 italic">{pendingNote}</p>
          ) : (
            <p className="text-sm font-medium text-gray-900">{value}</p>
          )}
          {note && <p className="text-[11px] text-gray-400 mt-1">{note}</p>}
        </div>
        <Link
          href={`/offices/${officeSlug}`}
          className="text-xs text-green-700 border border-green-200 rounded px-2.5 py-1 hover:bg-green-50 transition-colors whitespace-nowrap shrink-0 mt-0.5"
        >
          About this office
        </Link>
      </div>
    </div>
  )
}

function OfficeGroup({
  tier,
  icon,
  label,
  items,
}: {
  tier: string
  icon: string
  label: string
  items: {
    slug: string
    label: string
    constituency: string
    constituencyLabel: string
    electionBody: string
    minAge: number
    pending?: boolean
  }[]
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
        <span>{icon}</span> {label}
        <span className="flex-1 border-t border-gray-100" />
      </h3>
      <div className="space-y-2">
        {items.map(item => {
          const office = ELECTIVE_OFFICES.find(o => o.slug === item.slug)
          return (
            <div key={item.slug} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 mb-1">{item.label}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                    <span>
                      <span className="text-gray-400">{item.constituencyLabel}:</span>{' '}
                      <span className={item.pending ? 'text-amber-600 italic' : 'font-medium text-gray-700'}>
                        {item.constituency}
                      </span>
                    </span>
                    <span>
                      <span className="text-gray-400">Min. age:</span>{' '}
                      <span className="font-medium text-gray-700">{item.minAge}</span>
                    </span>
                    <span>
                      <span className="text-gray-400">Conducted by:</span>{' '}
                      <span className="font-medium text-gray-700">{item.electionBody}</span>
                    </span>
                  </div>
                  {office && (
                    <p className="text-[11px] text-gray-400">{office.termYears}-year term · {office.seats.toLocaleString()} seats nationwide</p>
                  )}
                </div>
                <Link
                  href={`/offices/${item.slug}`}
                  className="text-xs text-green-700 border border-green-200 rounded px-2.5 py-1.5 hover:bg-green-50 transition-colors whitespace-nowrap shrink-0"
                >
                  Learn more
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Google Places Autocomplete (new Places API) ─────────────────────────────

function PlacesAutocomplete({
  apiKey,
  onSelect,
  value,
  onChange,
}: {
  apiKey: string
  onSelect: (state: string, lga: string) => void
  value: string
  onChange: (v: string) => void
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [ready, setReady] = useState(false)

  const loadScript = useCallback(() => {
    if (typeof window === 'undefined') return
    if (document.querySelector('#google-maps-script')) {
      setReady(typeof google !== 'undefined' && !!google.maps?.places)
      return
    }
    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`
    script.async = true
    script.onload = () => {
      const check = () => {
        if (typeof google !== 'undefined' && google.maps?.places) {
          setReady(true)
        } else {
          setTimeout(check, 100)
        }
      }
      check()
    }
    document.head.appendChild(script)
  }, [apiKey])

  useState(() => { loadScript() })

  const handleInput = async (text: string) => {
    onChange(text)
    if (text.length < 3 || !ready) { setSuggestions([]); return }
    try {
      const { suggestions: results } = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: text, includedRegionCodes: ['ng'], language: 'en',
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped: Suggestion[] = (results ?? []).filter((s: any) => s.placePrediction).map((s: any) => ({
        placeId: s.placePrediction.placeId,
        mainText: s.placePrediction.mainText?.text ?? s.placePrediction.text?.text ?? '',
        secondaryText: s.placePrediction.secondaryText?.text ?? '',
        fullText: s.placePrediction.text?.text ?? '',
      }))
      setSuggestions(mapped)
      setShowSuggestions(mapped.length > 0)
    } catch { setSuggestions([]) }
  }

  const handleSelect = async (suggestion: Suggestion) => {
    onChange(suggestion.fullText)
    setShowSuggestions(false)
    setSuggestions([])
    try {
      const { Place } = google.maps.places
      const place = new Place({ id: suggestion.placeId })
      await place.fetchFields({ fields: ['addressComponents'] })
      let state = '', lga = ''
      for (const comp of place.addressComponents ?? []) {
        if (comp.types.includes('administrative_area_level_1')) state = comp.longText?.replace(' State', '') ?? ''
        if (comp.types.includes('administrative_area_level_2')) lga = comp.longText ?? ''
      }
      if (state) onSelect(state, lga)
    } catch {
      try {
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ placeId: suggestion.placeId }, (results, status) => {
          if (status !== 'OK' || !results?.[0]) return
          let state = '', lga = ''
          for (const comp of results[0].address_components) {
            if (comp.types.includes('administrative_area_level_1')) state = comp.long_name.replace(' State', '')
            if (comp.types.includes('administrative_area_level_2')) lga = comp.long_name
          }
          if (state) onSelect(state, lga)
        })
      } catch {}
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={e => handleInput(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={ready ? 'Type your address or area (e.g. Lekki, Victoria Island)...' : 'Loading Google Places...'}
        disabled={!ready}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-white disabled:bg-gray-50 disabled:text-gray-400"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map(s => (
            <li key={s.placeId}>
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                onMouseDown={() => handleSelect(s)}
              >
                <span className="text-gray-900">{s.mainText}</span>
                {s.secondaryText && <span className="text-xs text-gray-400 ml-1.5">{s.secondaryText}</span>}
              </button>
            </li>
          ))}
          <li className="px-4 py-2 text-[10px] text-gray-300 border-t border-gray-100">
            Powered by Google
          </li>
        </ul>
      )}
    </div>
  )
}
